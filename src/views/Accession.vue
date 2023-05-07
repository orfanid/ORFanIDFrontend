<template>
  <v-container>
    <v-form>
      <v-row>
        <v-container fluid class="secondary-header" style="border-bottom: none !important">
          <v-container>
            <v-row no-gutters>
              <v-spacer></v-spacer>
              <v-col cols="12" md="6">
                <v-text-field label="Enter search terms" color="primary" v-model="search.query">
                    <template #append>
                      <v-btn depressed tile color="primary" @click="SearchResult(search.query)">
                        <v-icon>
                          search
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                <v-icon>mdi-cloud-download</v-icon>
                <a style="text-decoration: right;" href="#" @click="downloadPageFile(downloadSummaryResult)">
                  Download current page result
                </a>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="mt-0">
              <v-col md="6" class="d-flex align-items-end p-0 pl-3"> </v-col>
            </v-row>
            <v-row>
              <v-spacer />
              <v-col cols="6">
                <h6>This page provides a search utility to find multiple accession numbers associated
                with a species name.</h6>
                <br />
                To use this utility, follow these steps:
                <br />
                <ol>
                  
                  <li>Enter a species name in the search field provided. The search field is the text box
                located on the page where you can enter your query.</li>
                  <li>Click on the magnifying glass
                icon to initiate the search.</li>
                  <li>The results will display a list of accession numbers
                affiliated with the species name that you entered.</li>
                <li>You can download the accession
                list as a CSV file, which can be used as input to ORFanID to identify novel genes or
                proteins in the genome of the species you searched for.</li>
                </ol>
                   
              </v-col>
              <v-spacer />
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
        itemPerPage: 200,
        noOfPages: null,
        currentPage: 1
      },
      pubMedApi: null,
      downloadSummaryResult:[]
    };
  },
  async mounted() {
    this.pubMedApi = new PubmedApi();
  },
  methods: {
    SearchResult: async function(query) {
      
      this.getESearch(query);

    },
    getESearch: async function(query) {
      this.$Progress.start();
      this.searchResult.idList = [];
      this.searchResult.resultSummary = [];
      const options = {
        retStart: "1",
        retMax: "1000"
      };
      try {
        let that = this;
        const results = await this.pubMedApi.eSearch.search(that.selectedDatabase, query, options);
        this.$Progress.finish();
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
        let pageIds = await that.getCurretPageIds();

        that.downloadSummaryResult = await that.getESearchSummary(pageIds);
        if (that.downloadSummaryResult && that.downloadSummaryResult.result) {
          Object.values(that.downloadSummaryResult.result).forEach(val => {
            that.searchResult.resultSummary.push(val);
          });

          //this.downloadPageFile(that.downloadSummaryResult);
        }
      } catch (error) {
        console.log(error);
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
        (this.paginationConfig.currentPage - 1) * this.paginationConfig.itemPerPage + 1;
      let maxIndex = minIndex + this.paginationConfig.itemPerPage;
      let selecteditems = lodash.filter(this.searchResult.idList, function(e) {
        return e.index >= minIndex && e.index <= maxIndex;
      });

      let idArray = lodash.map(selecteditems, function(e) {
        return e.id;
      });

      return idArray.toString();
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
      let that = this;
      that.searchResult.resultSummary = [];
      let pageIds = await that.getCurretPageIds();

      that.downloadSummaryResult = await that.getESearchSummary(pageIds);
      if (that.downloadSummaryResult && that.downloadSummaryResult.result) {
        Object.values(that.downloadSummaryResult.result).forEach(val => {
          that.searchResult.resultSummary.push(val);
        });
      }

      //this.downloadPageFile(summaryResult);
    },
    downloadPageFile(summaryResult) {
      let acceessionList = lodash.map(summaryResult.result, function(i) {
        if (i.accessionversion != undefined && i.accessionversion != null) {
          return { accession: i.accessionversion };
        } else {
          return { accession: "" };
        }
      });
      csvDownload(acceessionList);

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
