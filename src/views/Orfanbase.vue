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
            <v-data-table v-if="isSearchActive" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :headers="headers"
              :items="displayedDesserts" :page="1" :items-per-page="itemsPerPage" hide-default-footer class="elevation-1"
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
            <v-data-table v-else :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :headers="headers" :items="displayedDesserts"
              :page.sync="page" :items-per-page="itemsPerPage" :server-items-length="totalItems" hide-default-footer class="elevation-1"
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
                <v-select
                  v-model.number="itemsPerPage"
                  :items="itemsPerPageOptions"
                  label="Items per page"
                  @change="handleItemsPerPageChange"
                ></v-select>
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

export default {
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      localPageCount: 0,
      itemsPerPage: 10,
      itemsPerPageOptions: [5, 10, 15, 20, 25, 30],
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
      searchTotalItems: 0,
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

      return this.searchDesserts;
    },
    filteredSearchDesserts() {
      if (!this.isSearchActive) {
        return [];
      }

      return this.searchDesserts;
    },
    paginationLength() {
      if (this.isSearchActive) {
        return Math.max(1, Math.ceil(this.searchTotalItems / this.itemsPerPage));
      }
      return this.pageCount;
    },
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
    handleItemsPerPageChange(value) {
      const selectedValue = Number(value);
      this.itemsPerPage = this.itemsPerPageOptions.includes(selectedValue) ? selectedValue : 10;
      this.page = 1;
      this.loadData();
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
          const rows = this.extractOrfanbaseRows(response);
          that.totalItems = this.extractOrfanbaseTotal(response, rows.length);
          that.pageCount = Math.max(1, Math.ceil(that.totalItems / that.itemsPerPage));
          that.desserts = rows.map(this.mapOrfanbaseRow);
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

      analysisAPI.orfanBaseGenesSearch(this.search, this.page - 1, this.itemsPerPage, sortDir).then((response) => {
        const rows = this.extractOrfanbaseRows(response);
        that.searchTotalItems = this.extractOrfanbaseTotal(response, rows.length);
        that.searchDesserts = rows.map(this.mapOrfanbaseRow);
        that.$Progress.finish();
      }).catch((error) => {
        console.error("Error fetching searchable ORFanBase data:", error);
        that.$Progress.fail();
      });
    },
    extractOrfanbaseRows(response) {
      const payload = response && response.data ? response.data : {};

      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload.data)) {
        return payload.data;
      }
      if (Array.isArray(payload.content)) {
        return payload.content;
      }
      if (payload.data && Array.isArray(payload.data.data)) {
        return payload.data.data;
      }
      if (payload.data && Array.isArray(payload.data.content)) {
        return payload.data.content;
      }
      return [];
    },
    extractOrfanbaseTotal(response, fallbackTotal) {
      const payload = response && response.data ? response.data : {};
      const total =
        payload.total ||
        payload.totalElements ||
        payload.totalItems ||
        payload.count ||
        (payload.data &&
          (payload.data.total ||
            payload.data.totalElements ||
            payload.data.totalItems ||
            payload.data.count));

      const numericTotal = Number(total);
      return Number.isFinite(numericTotal) && numericTotal >= fallbackTotal
        ? numericTotal
        : fallbackTotal;
    },
    sortRowsByDate(rows, sortDir) {
      return rows.sort((a, b) => {
        const left = moment(a.date, "YYYY-MM-DD HH:mm:ss");
        const right = moment(b.date, "YYYY-MM-DD HH:mm:ss");
        return sortDir === "asc" ? left - right : right - left;
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
        searchText: Object.values(element)
          .map(value => String(value || ""))
          .join(" ")
          .toLowerCase(),
      };
    },
  },
};
</script>

<style></style>
