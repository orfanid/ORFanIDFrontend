<template>
  <v-container>
    <PageGuide
      description="This page provides a search utility to find multiple accession numbers associated with a species name."
      :steps="[
        'Enter a species name in the search field provided.',
        'Click the magnifying glass icon to start the search.',
        'Review the accession numbers affiliated with the species name that you entered.',
        'Download the accession list as a CSV file for use as ORFanID input.'
      ]"
    />
    <v-form>
      <v-row>
        <v-container fluid class="secondary-header" style="border-bottom: none !important">
          <v-container>
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <v-col cols="12" md="6">
                <v-text-field label="Enter search terms" color="primary" v-model="search.query" @keyup.enter="SearchResult(search.query)">
                  <template #append>
                    <v-btn depressed tile color="primary" @click="SearchResult(search.query)">
                      <v-icon>
                        search
                      </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                <v-icon>mdi-cloud-download</v-icon>
                <a style="text-decoration: right;" href="#" @click.prevent="downloadPageFile">
                  Download current page result
                </a>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="mt-0">
              <v-col md="6" class="d-flex align-items-end p-0 pl-3"> </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-row>
      <v-row>
        <v-col  cols="12" md="3"></v-col>
        <v-col  cols="12" md="9">
          <v-pagination
            :length="paginationConfig.noOfPages"
            :total-visible="7"
            v-model="paginationConfig.currentPage"
            @input="pageChanged"
          ></v-pagination>
          <v-divider></v-divider>
          <div>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Accession
                    </th>
                    <th class="text-left">
                      Organism
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(result, index) in searchResult.resultSummary" :key="index">
                    <td>{{ result.accessionversion }}</td>
                    <td>{{ result.organism }}</td>
                  </tr>
                  <tr v-if="searchResult.resultSummary.length === 0">
                    <td colspan="2" class="text-center grey--text">
                      No accession results to display.
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import PubmedApi from "pubmed-api";
import lodash from "lodash";
import csvDownload from "json-to-csv-export";

export default {
  layout: "search",
  metaInfo: {
    title: 'Accession Search | ORFanID',
    meta: [
      { name: 'description', content: 'Search to find multiple accession numbers associated with a species name.' }
    ]
  },
  data() {
    return {
      availableDatabases: [{ key: "Gene", label: "Gene" }],
      selectedDatabase: "protein",
      search: {
        query: ""
      },
      searchResult: {
        idList: [],
        resultSummary: []
      },
      paginationConfig: {
        itemPerPage: 10,
        noOfPages: null,
        currentPage: 1
      },
      pubMedApi: null,
      downloadSummaryResult: []
    };
  },
  async mounted() {
    this.pubMedApi = new PubmedApi();
  },
  methods: {
    SearchResult: async function(query) {
      await this.getESearch(query);
    },
    getESearch: async function(query) {
      if (!query || !query.trim()) {
        this.searchResult.idList = [];
        this.searchResult.resultSummary = [];
        this.downloadSummaryResult = [];
        this.paginationConfig.currentPage = 1;
        this.paginationConfig.noOfPages = 1;
        return;
      }

      this.$Progress.start();
      this.searchResult.idList = [];
      this.searchResult.resultSummary = [];
      this.downloadSummaryResult = [];
      this.paginationConfig.currentPage = 1;
      this.paginationConfig.noOfPages = 1;
      const options = {
        retStart: "0",
        retMax: "1000"
      };
      try {
        let that = this;
        const results = await this.pubMedApi.eSearch.search(
          that.selectedDatabase,
          this.buildOrganismSearchQuery(query),
          options
        );
        var result = JSON.parse(results);
        if (
          result.esearchresult &&
          result.esearchresult.idlist &&
          result.esearchresult.idlist.length > 0
        ) {
          for (let index = 0; index < result.esearchresult.idlist.length; index++) {
            that.searchResult.idList.push({
              index: index,
              id: result.esearchresult.idlist[index]
            });
          }
          that.paginationConfig.noOfPages = Math.ceil(
            that.searchResult.idList.length / that.paginationConfig.itemPerPage
          );
        }

        await that.loadCurrentPageSummary();
      } catch (error) {
        console.log(error);
      } finally {
        this.$Progress.finish();
      }
    },
    getESearchSummary: async function(queryids) {
      let that = this;
      try {
        const results = await this.pubMedApi.eSummary.search(that.selectedDatabase, queryids);
        let resultSummary = JSON.parse(results);
        console.log(resultSummary);
        return resultSummary;
      } catch (error) {
        console.log(error);
      }
    },
    getCurretPageIds() {
      let minIndex =
        (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemPerPage;
      let maxIndex = minIndex + this.paginationConfig.itemPerPage - 1;
      let selecteditems = lodash.filter(this.searchResult.idList, function(e) {
        return e.index >= minIndex && e.index <= maxIndex;
      });

      let idArray = lodash.map(selecteditems, function(e) {
        return e.id;
      });

      return idArray.toString();
    },
    normalizeSummaryRows(summaryResult) {
      if (!summaryResult || !summaryResult.result) {
        return [];
      }

      return Object.values(summaryResult.result)
        .filter(item => item && item.accessionversion)
        .filter(item => this.organismMatchesSearch(item.organism))
        .map(item => ({
          accessionversion: item.accessionversion,
          organism: item.organism || "",
          title: item.title || ""
        }));
    },
    buildOrganismSearchQuery(query) {
      const trimmedQuery = (query || "").trim();
      if (!trimmedQuery || /\[[^\]]+\]/.test(trimmedQuery)) {
        return trimmedQuery;
      }
      return `"${trimmedQuery}"[Organism]`;
    },
    normalizeOrganismName(value) {
      return (value || "")
        .replace(/\(\s*\d+\s*\)/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    },
    organismMatchesSearch(organism) {
      const searchedOrganism = this.normalizeOrganismName(this.search.query);
      const resultOrganism = this.normalizeOrganismName(organism);

      if (!searchedOrganism) {
        return true;
      }

      return (
        resultOrganism === searchedOrganism ||
        resultOrganism.includes(searchedOrganism) ||
        searchedOrganism.includes(resultOrganism)
      );
    },
    generateUri(doi) {
      if (doi) {
        let uriPart = doi.split(":");
        return `https://dx.doi.org/${uriPart[1].trim()}`;
      } else {
        return "#";
      }
    },
    async pageChanged() {
      await this.loadCurrentPageSummary();
    },
    async loadCurrentPageSummary() {
      this.searchResult.resultSummary = [];
      this.downloadSummaryResult = [];
      const pageIds = await this.getCurretPageIds();

      if (!pageIds) {
        return;
      }

      const summaryResult = await this.getESearchSummary(pageIds);
      const rows = this.normalizeSummaryRows(summaryResult);
      this.searchResult.resultSummary = rows;
      this.downloadSummaryResult = rows;
    },
    downloadPageFile() {
      if (!this.downloadSummaryResult.length) {
        alert("No accession results are available to download.");
        return;
      }

      let accessionList = lodash.map(this.downloadSummaryResult, function(i) {
        return {
          accession: i.accessionversion,
          organism: i.organism
        };
      });
      csvDownload({
        data: accessionList,
        filename: "AccessionResult",
        delimiter: ","
      });

      //csvDownload({data:acceessionList,filename:'AccessionResult'});
    }
  },
  filters: {
    authors: function(list) {
      if (list && list.length > 0) {
        let authorNames = list.map(l => {
          return l.name;
        });
        return authorNames.toString();
      }
      return "";
    }
  }
};
</script>

<style scoped>
.v-pagination-item-font-size {
  font-size: 0.75em !important;
}
.author-size {
  font-size: 0.75em;
}
</style>
