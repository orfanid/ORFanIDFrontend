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
            <v-data-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :headers="headers" :items="desserts"
              :page.sync="page" :items-per-page="itemsPerPage" :server-items-length="totalItems" :search="search" hide-default-footer class="elevation-1"
              @page-count="pageCount = $event" @update:sort-desc="fetchData({ page, itemsPerPage })" @pagination="fetchData">

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
                <v-pagination v-model="page" :length="pageCount" @input="fetchData({ page, itemsPerPage })"></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="items-dropdown">
                <v-combobox :value="itemsPerPage" :items="[5, 10, 15, 20, 25, 30]" label="Items per page" type="number"
                  @input="itemsPerPage = parseInt($event, 5)"></v-combobox>
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
  name: "Orfanbase",
  metaInfo: {
    title: 'ORFanbase | ORFanID',
    meta: [
      { name: 'description', content: 'Search and filter categorized ORFan genes in the ORFanbase database.' }
    ]
  },
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
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
      sortBy: ["date"],
      sortDesc: [true],
    };
  },
  mounted() {
    const that = this;
    this.$Progress.start()
    that.pageCount = Math.ceil(that.totalItems / that.itemsPerPage);
    console.log("Page Count", that.pageCount);
    analysisAPI.orfanBaseGenesByPage(that.page - 1, that.itemsPerPage).then((response) => {
      console.log(response);
      that.totalItems = response.data.total;
      console.log("Total Items", that.totalItems);
      that.pageCount = Math.ceil(that.totalItems / that.itemsPerPage);
      console.log("Page Count", that.pageCount);
      response.data.data.forEach((element) => {
        that.desserts.push({
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
        });
      });
      that.$Progress.finish()
    });
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
    fetchData({ page, itemsPerPage }) {
      const that = this;
      this.$Progress.start();
      let sortDir = 'desc';
      if (this.sortDesc && this.sortDesc.length > 0) {
        sortDir = this.sortDesc[0] ? 'desc' : 'asc';
      }
      analysisAPI
        .orfanBaseGenesByPage(page - 1, itemsPerPage, sortDir)
        .then((response) => {
          console.log(response);
          that.totalItems = response.data.total;
          console.log("Total Items", that.totalItems);
          that.pageCount = Math.ceil(that.totalItems / that.itemsPerPage);
          console.log("Page Count", that.pageCount);
          that.desserts = response.data.data.map((element) => ({
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
          }));
          that.$Progress.finish();
        });
    },

  },
};
</script>

<style></style>
