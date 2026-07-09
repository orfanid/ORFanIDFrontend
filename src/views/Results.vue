<template>
  <div class="container results-container">
    <PageGuide
      description="This page displays submitted ORFanID analyses and their current processing status."
      :steps="[
        'Use New Query to start another ORFanID analysis.',
        'Search the table to find an analysis by date, submitter, organism, or analysis ID.',
        'Check the status chip to see whether an analysis is queued, processing, completed, or errored.',
        'Open completed results with the chart icon, or cancel and delete records when appropriate.',
        'Use pagination and items per page to browse additional analyses.'
      ]"
    />
    <div class="section">
      <div id="savedResultView" class="row">
        <div class="col s10 offset-s1 center-align">
          <div>
            <v-alert
              v-if="hasActiveAnalyses"
              class="processing-time-alert text-left"
              border="left"
              colored-border
              color="teal"
              elevation="1"
              icon="mdi-clock-outline"
            >
              <strong>Processing time:</strong>
              submissions usually take about 30-40 minutes on average. Larger jobs may take longer
              depending on the number of sequences, sequence length, selected program, organism,
              server workload, and BLAST or DIAMOND search complexity.
            </v-alert>
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
                class="pa-0 ma-0"
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
              :hide-default-footer="true"
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
              <template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-2"
                  icon
                  color="red"
                  @click="openDeleteDialog(item.analysisId)"
                  style="float: right;"
                  title="Delete"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            <!-- Delete confirmation dialog -->
            <v-dialog v-model="deleteDialog" max-width="450">
              <v-card>
                <v-card-title class="headline">Confirm Delete</v-card-title>
                <v-card-text>
                  <div>Enter passcode to delete analysis <strong>{{ deleteTargetId }}</strong></div>
                  <v-text-field
                    v-model="passcode"
                    label="Passcode"
                    type="password"
                    autofocus
                  ></v-text-field>
                  <v-alert v-if="passcodeError" type="error" dense text>
                    {{ passcodeError }}
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="cancelDelete">Cancel</v-btn>
                  <v-btn color="red" text @click="confirmDelete" :disabled="!passcode">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-row>
              <v-col cols="12" class="mt-3">
                <v-pagination v-model="page" :length="paginationLength"></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="items-dropdown">
                <v-combobox
                  v-model="itemsPerPage"
                  :items="[5, 10, 15, 20, 25, 30]"
                  label="Items per page"
                  type="number"
                ></v-combobox>
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

const SEARCH_RESULTS_PAGE_SIZE = 1000;

export default {
  name: "Results",
  metaInfo: {
    title: 'Results | ORFanID',
    meta: [
      { name: 'description', content: 'View and manage your ORFanID analysis results.' }
    ]
  },
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      pageCountR: 0,
      itemsSort: 'desc',
      itemsPerPage: 10,
      headers: [
        {
          text: "Submitted",
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
        { text: "Submitter", value: "email", sortable: false },
        { text: "Organism", value: "organism", sortable: false },
        { text: "Genes", value: "genes", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "", value: "analysisIdNav", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      desserts: [],
      sortBy: ["date"],
      sortDesc: [true],
      intervalHandler: null,
      searchFetchTimer: null,
  // delete dialog state
  deleteDialog: false,
  deleteTargetId: null,
  passcode: "",
  passcodeError: "",
    };
  },
  computed: {
    isSearchActive() {
      return this.search.trim().length > 0;
    },
    paginationLength() {
      return this.isSearchActive ? this.pageCount : this.pageCountR;
    },
    hasActiveAnalyses() {
      return this.desserts.some(item => item.status === "START_PROCESSING" || item.status === "PENDING");
    }
  },
  mounted() {
    this.loadData();
    this.intervalHandler = setInterval(this.loadData,30000 );
  },
  beforeDestroy() {
    clearInterval(this.intervalHandler);
    clearTimeout(this.searchFetchTimer);
    this.intervalHandler = 0;
    this.searchFetchTimer = null;
  },
  watch: {
    page() {
      if (!this.isSearchActive) {
        this.loadData();
      }
    },
    itemsPerPage() {
      this.page = 1; // Reset to the first page on itemsPerPage change
      if (!this.isSearchActive) {
        this.loadData();
      }
    },
    search() {
      this.page = 1;
      clearTimeout(this.searchFetchTimer);
      this.searchFetchTimer = setTimeout(() => {
        this.loadData();
      }, 300);
    },
  },
  methods: {
    // Open passcode dialog for a given analysis id
    openDeleteDialog(analysisId) {
      this.deleteTargetId = analysisId;
      this.passcode = "";
      this.passcodeError = "";
      this.deleteDialog = true;
    },

    cancelDelete() {
      this.deleteDialog = false;
      this.deleteTargetId = null;
      this.passcode = "";
      this.passcodeError = "";
    },

    confirmDelete() {
      // Read expected passcode from env or fallback
      const expected = (process && process.env && process.env.VUE_APP_DELETE_PASSCODE) || "admin123";
      if (this.passcode === expected) {
        // Close dialog then call existing delete
        const id = this.deleteTargetId;
        this.cancelDelete();
        this.deleteErrorBlast(id);
      } else {
        this.passcodeError = "Invalid passcode.";
      }
    },
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

    deleteErrorBlast(analysisId) {
      if (analysisId != null) {
        analysisAPI.deleteErrorBlast(analysisId).then((response) => {
          let deleteItem = _.findIndex(this.desserts, {
            analysisId: analysisId,
          });
          this.desserts.splice(deleteItem, 1);
        });
      }
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
      that.$Progress.start();
      that.desserts = [];

      analysisAPI.getByDesc(this.page - 1, this.itemsPerPage, this.itemsSort).then((response) => {
        that.desserts = response.data.results.map(this.mapAnalysisRow);
        that.pageCountR = response.data.totalPages;
        that.$Progress.finish();
      }).catch((error) => {
        console.error("Error fetching data:", error);
        that.$Progress.fail();
      });
    },
    loadSearchData() {
      const that = this;
      that.$Progress.start();
      that.desserts = [];

      analysisAPI.getByDesc(0, SEARCH_RESULTS_PAGE_SIZE, this.itemsSort).then((response) => {
        const firstPage = response.data.results || [];
        const totalPages = response.data.totalPages || 1;
        const requests = [];

        for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
          requests.push(analysisAPI.getByDesc(pageIndex, SEARCH_RESULTS_PAGE_SIZE, this.itemsSort));
        }

        return Promise.all(requests).then((responses) => {
          const remainingRows = responses.reduce((rows, pageResponse) => {
            return rows.concat(pageResponse.data.results || []);
          }, []);
          that.desserts = firstPage.concat(remainingRows).map(this.mapAnalysisRow);
          that.$Progress.finish();
        });
      }).catch((error) => {
        console.error("Error fetching searchable data:", error);
        that.$Progress.fail();
      });
    },
    mapAnalysisRow(element) {
      return {
        date: moment.utc(element.analysisDate).local().format("YYYY-MM-DD HH:mm:ss"),
        analysisId: element.analysisId,
        email: this.getSubmitterName(element) || "Not provided",
        organism: element.organism,
        genes: element.numberOfGenes,
        analysisIdNav: element.analysisId,
        status: element.status,
      };
    },
    getSubmitterName(data) {
      return (
        data.email ||
        data.submitterName ||
        data.nickname ||
        data.submitterNickname ||
        data.submiterNickname ||
        data.name ||
        ""
      );
    },
  },
};
</script>


<style scoped>
.processing-time-alert {
  margin-bottom: 18px;
}
</style>
