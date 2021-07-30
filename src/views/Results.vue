<template>
  <div class="container">
    <div class="section">
      <div id="savedResultView" class="row">
        <div class="col s10 offset-s1 center-align">
          <div>
            <v-card-title>
              <router-link
                :to="{
                  name: 'input',
                }"
                >New Query</router-link
              >
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Enter Search Term Here"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :headers="headers"
              :items="desserts"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              :search="search"
              class="elevation-1"
              @page-count="pageCount = $event"
            >
              <template v-slot:item.analysisIdNav="{ item }">
                <div v-if="item.status != 'START_PROCESSING'">
                  <router-link
                    :to="{
                      name: 'result',
                      params: { analysisId: item.analysisIdNav },
                    }"
                  >
                    <v-icon large>mdi-chart-bar</v-icon>
                  </router-link>
                </div>
              </template>
              <template v-slot:item.status="{ item }">
                <v-tooltip top v-if="item.status == 'START_PROCESSING'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip class="ma-2" color="green" text-color="white">
                      Processing
                    </v-chip>
                  </template>
                  <span>Processing</span>
                </v-tooltip>

                <v-tooltip
                  top
                  v-else-if="item.status == 'COMPLETED'"
                  color="teal"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip class="ma-2" color="teal" text-color="white">
                      Completed
                    </v-chip>
                  </template>
                  <span>Completed</span>
                </v-tooltip>

                <v-tooltip top v-else-if="item.status == 'PENDING'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip class="ma-2"> Queued </v-chip>
                  </template>
                  <span>Queued</span>
                </v-tooltip>

                <v-tooltip top v-else-if="item.status == 'ERRORED'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip class="ma-2" color="red" text-color="white">
                      Error
                    </v-chip>
                  </template>
                  <span>Error</span>
                </v-tooltip>

                <v-btn
                  v-if="item.status == 'PENDING'"
                  class="ms-6"
                  @click="cancelAnalyse(item.analysisId)"
                  >Cancel</v-btn
                >
              </template>
            </v-data-table>
            <v-row>
              <v-col cols="1">
                <v-combobox
                  :value="itemsPerPage"
                  :items="[5, 10, 15, 20, 25, 30]"
                  label="Items per page"
                  type="number"
                  @input="itemsPerPage = parseInt($event, 5)"
                ></v-combobox>
              </v-col>
              <v-col cols="11">
                <v-pagination v-model="page" :length="pageCount"></v-pagination>
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
import _ from "lodash";

export default {
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
          sort: (a, b) => {
            return (
              moment(a, "YYYY-MM-DD HH:mm:ss") -
              moment(b, "YYYY-MM-DD HH:mm:ss")
            );
          },
          formatter: (x) => (x ? moment(x).format(this.dateFormat) : null),
        },
        { text: "Analysis ID", value: "analysisId", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Organism", value: "organism", sortable: false },
        { text: "Genes", value: "genes", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "", value: "analysisIdNav", sortable: false },
      ],
      desserts: [],
      sortBy: ["date"],
      sortDesc: [true],
    };
  },
  mounted() {
    this.loadData();
    setInterval(this.loadData,30000 );
  },
  methods: {
    cancelAnalyse(analysisId) {
      let that = this;
      if (analysisId != null) {
        analysisAPI.cancelAnalyse(analysisId).then((response) => {
          let cancelItem = _.findIndex(that.desserts, {
            analysisId: analysisId,
          });
          that.desserts.splice(cancelItem, 1);
        });
      }
    },
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
      const that = this;
      that.desserts.splice(0,that.desserts.length)
      analysisAPI.getAll().then((response) => {
        console.log(response);
        response.data.forEach((element) => {
          that.desserts.push({
            date: moment
              .utc(element.analysisDate)
              .local()
              .format("YYYY-MM-DD HH:mm:ss"),
            analysisId: element.analysisId,
            email: element.email,
            organism: element.organism,
            genes: element.numberOfGenes,
            analysisIdNav: element.analysisId,
            status: element.status,
          });
        });
      });
    },
  },
};
</script>

<style></style>
