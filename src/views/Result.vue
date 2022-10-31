<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="ma-6 pa-6 ps-16" max-width="1600" min-height="400">
          <v-row>
            <v-col cols="6">
              <v-card-title class="justify-center"
                >Analysis Parameters</v-card-title
              >
              <div>
                <table
                  id="orfanGenesSummary"
                  class="table text-left"
                  cellspacing="0"
                >
                  <tbody>
                    <tr class="border-bottom">
                      <th>Organism:</th>
                      <td>
                        <!-- <img
                          :src="analysisParameters.organismImg"
                          width="40"
                          height="40"
                          style="border-radius: 50%;"
                        />
                        <br /> -->
                        <span id="parameters_organism" wfd-id="31">{{
                          analysisParameters.organism
                        }}</span>
                      </td>
                    </tr>
                    <tr class="border-bottom">
                      <th>Analysis ID:</th>
                      <td>
                        <span wfd-id="30">{{
                          analysisParameters.analysisId
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Sequence Type:</th>
                      <td>
                        <div class="chip" wfd-id="28">
                          <span id="parameters_sequence_type" wfd-id="29">{{
                            analysisParameters.sequenceType
                          }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Evalue(e-10):</th>
                      <td>
                        <span id="parameters_evalue" wfd-id="27">{{
                          analysisParameters.evalue
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Maximum Target Sequences:</th>
                      <td>
                        <span id="parameters_max_tar_seq" wfd-id="26">{{
                          analysisParameters.maximumTargetSequences
                        }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Identity:</th>
                      <td>
                        <div id="myProgress" wfd-id="23">
                          <v-progress-linear
                            v-model="analysisParameters.identity"
                            height="25"
                          >
                            <strong
                              >{{
                                Math.ceil(analysisParameters.identity)
                              }}%</strong
                            >
                          </v-progress-linear>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-col>
            <v-col cols="6">
              <v-card-title class="justify-center"
                >ORFan gene summary</v-card-title
              >
              <BarChart :chartData="chartSummary" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <v-card class="ma-6" max-width="1600" min-height="100">
          <v-card-title class="justify-center"
            >ORFan Genes Categorization</v-card-title
          >
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="genesCategorization.search"
                append-icon="mdi-magnify"
                label="Enter Search Item Here"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="genesCategorization.headers"
              :items="genesCategorization.desserts"
              :search="genesCategorization.search"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item.sessionId="{ item }">
                <v-dialog v-model="item.showDialog" v-if="item.orfanLevel !='Strict ORFan'" width="1200" height="1200">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      @click="loadBlastData(item.sessionId, item.geneId)"
                      large
                      >mdi-chart-bar</v-icon
                    >
                  </template>
                  <v-card>
                    <TreeChart :chartData="blastResult" :loading="treeChartLoading" />
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="item.showDialog = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-right">
      <v-col cols="11">
        <v-btn
          class="mx-2"
          small
          color="teal"
          @click="downloadBlast(analysisId)"
        >
          <v-icon color="white">
            mdi-download
          </v-icon>
          BLAST RESULTS
        </v-btn>
      </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
    <v-row class="text-right">
      <v-col cols="11">
      </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
  </v-container>
</template>
<script>
import analysisAPI from "../api/analysis";
import BarChart from "../components/BarChart";
import TreeChart from "../components/TreeChart";
import { required, email } from "vuelidate/lib/validators";
import VueProgressBar from 'vue-progressbar'

export default {
  name: "Result",
  components: {
    BarChart,
    TreeChart,
    VueProgressBar
  },
  data() {
    return {
      treeChartLoading: false,
      organismList: [],
      saveResultDialog: false,
      analysisId: this.$route.params.analysisId,
      analysisParameters: {
        organism: "",
        sequenceType: "",
        evalue: "",
        maximumTargetSequences: "",
        identity: "",
        analysisId: "",
        organismImg: "",
      },
      chartSummary: {
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: -60,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "bar",
          },
        ],
      },
      genesCategorization: {
        search: "",
        headers: [
          { text: "Gene", align: "start", sortable: false, value: "geneId" },
          { text: "Description", value: "description", sortable: false },
          { text: "ORFan Gene Level", value: "orfanLevel", sortable: false },
          { text: "Homology Evidence", value: "sessionId", sortable: false },
        ],
        desserts: [],
      },
      blastResult: {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",

            data: [],

            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "20%",

            symbolSize: 12,
            initialTreeDepth: 9,

            label: {
              normal: {
                position: "left",
                verticalAlign: "middle",
                align: "right",
                fontSize: 12,
              },
            },

            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left",
                },
              },
            },
            emphasis: {
                    focus: 'descendant'
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      },
      analysisResult: {
        analysisId: this.$route.params.analysisId,
        email: "",
        firstName: "",
        lastName: "",
      },
    };
  },
  mounted() {
    const that = this;
    analysisAPI.getOrganismList().then((response) => {
      that.organismList = Object.keys(response.data).map((key) => {
        return { key: key, value: response.data[key] };
      });
    });
    this.$Progress.start()
    analysisAPI
      .getAnalysis({ sessionId: this.$route.params.analysisId })
      .then((response) => {
        that.$Progress.finish()
        console.log(response.data);
        that.analysisParameters.analysisId = response.data.analysisId;
        that.analysisParameters.organism = response.data.organism;
        that.analysisParameters.sequenceType = response.data.sequenceType;
        that.analysisParameters.evalue = response.data.evalue;
        that.analysisParameters.maximumTargetSequences =
          response.data.maximumTargetSequences;
        that.analysisParameters.identity = response.data.identity;
        let selectOrganism = that.organismList.filter(function(item) {
          return item.key.includes(response.data.organism);
        });
        that.analysisParameters.organismImg = selectOrganism[0].value;

        response.data.geneList.forEach((element) => {
          that.genesCategorization.desserts.push({
            id: element.id,
            geneId: element.geneId,
            sequence: element.sequence,
            description: element.description,
            orfanLevel: element.orfanLevel,
            taxonomyId: element.taxonomyId,
            gccontent: element.gccontent,
            length: element.length,
            startLocation: element.startLocation,
            endLocation: element.endLocation,
            sessionId: that.analysisId,
          });
        });
      });

    analysisAPI
      .getSummaryChart({ sessionId: this.$route.params.analysisId })
      .then((response) => {
        console.log(response);
        response.data.x.forEach((item) => {
          that.chartSummary.xAxis.data.push(item);
        });
        response.data.y.forEach((item) => {
          that.chartSummary.series[0].data.push(item);
        });
      });
  },
  methods: {
    searchGene(gene) {
      window.location.href =
        "https://www.ncbi.nlm.nih.gov/search/all/?term=" + gene;
    },
    downloadBlast(id) {
      analysisAPI.downloadBlast(id).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", id);
        document.body.appendChild(link);
        link.click();
      });
    },
    loadBlastData(sessionId, geneId) {
      this.blastResult.series[0].data = [];
      this.treeChartLoading = true;
      const that = this;
      console.log("Loadding Blast " + sessionId + " " + geneId);
      analysisAPI
        .getBlastSummary({ geneId: geneId, sessionId: sessionId })
        .then((response) => {
        this.treeChartLoading = false;
          response.data.tree.children.forEach((item) => {
            that.blastResult.series[0].data.push(item);
          });
        });
    },
    saveAnalysis() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const that = this;
        analysisAPI.saveAnalysis(this.analysisResult).then((response) => {
          that.saveResultDialog = false;
          console.log(response);
        });
      }
    },
    closeTreeChartDialog() {
      
    }
  },
  validations: {
    analysisResult: {
      firstName: {
        required,
      },
      lastName: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
};
</script>

<style>
table {
  border-spacing: 2px;
}
td {
  padding: 10px;
}
.border-bottom {
  border-bottom: 1px solid gray !important;
}
</style>
