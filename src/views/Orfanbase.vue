<template>
  <div class="container orfanbase-wrapper">
    <PageGuide
      description="This page lists ORFan genes that have been categorized by ORFanID analyses and submitted to the ORFanBase database."
      :steps="[
        'Search the table to filter genes by organism, gene ID, description, or ORFan level.',
        'Sort columns to review records by date, organism, gene ID, description, or ORFan level.',
        'Use the chart icon to open the related ORFanID result details.',
        'Move through pages with the pagination controls.',
        'Change the items per page value to show more or fewer database records.'
      ]"
    />
    <div class="section">
      <div id="savedResultView" class="row">
        <div class="col s10 offset-s1 center-align">
          <div>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Enter Search Term Here" single-line
                hide-details></v-text-field>
            </v-card-title>
            <v-data-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :headers="headers" :items="displayedDesserts"
              :page.sync="page" :items-per-page="itemsPerPage" :server-items-length="serverItemsLength" hide-default-footer class="elevation-1"
              @page-count="localPageCount = $event" @update:sort-desc="loadData">

              <template v-slot:item.analysisIdNav="{ item }">
                <router-link :to="{
                  name: 'result',
                  params: { analysisId: item.analysisIdNav },
                }">
                  <v-icon large>mdi-chart-bar</v-icon>
                </router-link>
              </template>
            </v-data-table>
            <v-row>
              <v-col cols="12" class="mt-3">
                <v-pagination v-model="page" :length="paginationLength"></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="items-dropdown">
                <v-combobox v-model="itemsPerPage" :items="[5, 10, 15, 20, 25, 30]" label="Items per page" type="number"></v-combobox>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import analysisAPI from "../api/analysis";
import moment from "moment";

const SEARCH_RESULTS_PAGE_SIZE = 1000;

export default {
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      localPageCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      headers: [
        {
          text: "Date",
          sort: (a, b) => {
            return (
              moment(a, "YYYY-MM-DD HH:mm:ss") -
              moment(b, "YYYY-MM-DD HH:mm:ss")
            );
          },
          formatter: (x) => (x ? moment(x).format(this.dateFormat) : null),
          align: "start",
          sortable: true,
          value: "date",
        },
        { text: "Organism", value: "organism", sortable: true },
        { text: "Genes ID", value: "geneId", sortable: true },
        { text: "Description", value: "description", sortable: true },
        { text: "Orfan Level", value: "orfanLevel", sortable: true },
        { text: "", value: "analysisIdNav", sortable: true },
      ],
      desserts: [],
      searchDesserts: [],
      searchFetchTimer: null,
      sortBy: ["date"],
      sortDesc: [true],
    };
  },
  computed: {
    isSearchActive() {
      return this.search.trim().length > 0;
    },
    normalizedSearch() {
      return this.search.trim().toLowerCase();
    },
    displayedDesserts() {
      if (!this.isSearchActive) {
        return this.desserts;
      }

      return this.searchDesserts.filter(item => {
        return [
          item.date,
          item.organism,
          item.geneId,
          item.description,
          item.orfanLevel
        ].some(value => String(value || "").toLowerCase().includes(this.normalizedSearch));
      });
    },
    paginationLength() {
      if (this.isSearchActive) {
        return Math.max(1, Math.ceil(this.displayedDesserts.length / this.itemsPerPage));
      }
      return this.pageCount;
    },
    serverItemsLength() {
      return this.isSearchActive ? -1 : this.totalItems;
    }
  },
  mounted() {
    this.loadData();
  },
  beforeDestroy() {
    clearTimeout(this.searchFetchTimer);
    this.searchFetchTimer = null;
  },
  watch: {
    page() {
      if (!this.isSearchActive) {
        this.loadPagedData();
      }
    },
    itemsPerPage(value) {
      this.itemsPerPage = Number(value) || 10;
      this.page = 1;
      this.loadData();
    },
    search() {
      this.page = 1;
      clearTimeout(this.searchFetchTimer);
      this.searchFetchTimer = setTimeout(() => {
        this.loadData();
      }, 300);
    }
  },
  methods: {
    sortByDate(items, index, isDescending) {
      items.sort((a, b) => {
        if (index[0] === "date") {
          if (isDescending) {
            return moment(b.date) - moment(a.date);
          } else {
            return moment(a.date) - moment(b.date);
          }
        }
      });

      return items;
    },
    loadData() {
      if (this.isSearchActive) {
        this.loadSearchData();
      } else {
        this.loadPagedData();
      }
    },
    loadPagedData() {
      const that = this;
      this.$Progress.start();
      let sortDir = 'desc';
      if (this.sortDesc && this.sortDesc.length > 0) {
        sortDir = this.sortDesc[0] ? 'desc' : 'asc';
      }
      analysisAPI
        .orfanBaseGenesByPage(this.page - 1, this.itemsPerPage, sortDir)
        .then((response) => {
          that.totalItems = response.data.total;
          that.pageCount = Math.ceil(that.totalItems / that.itemsPerPage);
          that.desserts = response.data.data.map(this.mapOrfanbaseRow);
          that.$Progress.finish();
        })
        .catch((error) => {
          console.error("Error fetching ORFanBase data:", error);
          that.$Progress.fail();
        });
    },
    loadSearchData() {
      const that = this;
      this.$Progress.start();
      this.searchDesserts = [];
      let sortDir = 'desc';
      if (this.sortDesc && this.sortDesc.length > 0) {
        sortDir = this.sortDesc[0] ? 'desc' : 'asc';
      }

      analysisAPI.orfanBaseGenesByPage(0, SEARCH_RESULTS_PAGE_SIZE, sortDir).then((response) => {
        const firstPage = response.data.data || [];
        const total = response.data.total || firstPage.length;
        const totalPages = Math.max(1, Math.ceil(total / SEARCH_RESULTS_PAGE_SIZE));
        const requests = [];

        for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
          requests.push(analysisAPI.orfanBaseGenesByPage(pageIndex, SEARCH_RESULTS_PAGE_SIZE, sortDir));
        }

        return Promise.all(requests).then((responses) => {
          const remainingRows = responses.reduce((rows, pageResponse) => {
            return rows.concat(pageResponse.data.data || []);
          }, []);
          that.searchDesserts = firstPage.concat(remainingRows).map(this.mapOrfanbaseRow);
          that.$Progress.finish();
        });
      }).catch((error) => {
        console.error("Error fetching searchable ORFanBase data:", error);
        that.$Progress.fail();
      });
    },
    mapOrfanbaseRow(element) {
      return {
        date: moment
          .utc(element.analysisDate)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
        organism: element.organism,
        geneId: element.geneId,
        description: element.description,
        orfanLevel: element.orfanLevel,
        analysisId: element.analysisId,
        analysisIdNav: element.analysisId,
      };
    },
  },
};
</script>

<style></style>
