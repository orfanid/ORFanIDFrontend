<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="pa-3 ma-md-6 pa-md-6 ps-md-16" max-width="1600" min-height="400">
          <v-row>
            <v-col cols="12" md="6">
              <v-card-title class="justify-center">Analysis Parameters</v-card-title>
              <div>
                <div id="orfanGenesSummary" class="text-left">
                  <div class="border-bottom">
                    <v-row>
                      <v-col cols="4">
                        <div class="info-item"><strong>Organism:</strong></div>
                      </v-col>
                      <v-col>
                        <span id="parameters_organism">{{ analysisParameters.organism }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <div class="border-bottom">
                    <v-row>
                      <v-col cols="4">
                        <div class="info-item"><strong>Analysis ID:</strong></div>
                      </v-col>
                      <v-col>
                        <span>{{ analysisParameters.analysisId }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <div>
                    <v-row>
                      <v-col cols="4">
                        <div class="info-item"><strong>Sequence Type:</strong></div>
                      </v-col>
                      <v-col>
                        <span id="parameters_sequence_type">{{
                          analysisParameters.sequenceType
                        }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <div>
                    <v-row>
                      <v-col cols="4">
                        <div class="info-item"><strong>Evalue(e-10):</strong></div>
                      </v-col>
                      <v-col>
                        <span id="parameters_evalue">{{ analysisParameters.evalue }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <div>
                    <v-row>
                      <v-col cols="4"
                        ><div class="info-item">
                          <strong>Maximum Target Sequences:</strong>
                        </div></v-col
                      >
                      <v-col
                        ><span id="parameters_max_tar_seq">{{
                          analysisParameters.maximumTargetSequences
                        }}</span></v-col
                      >
                    </v-row>
                  </div>
                  <div>
                    <v-row>
                      <v-col cols="4"
                        ><div class="info-item"><strong>Identity:</strong></div></v-col
                      >
                      <v-col
                        ><div id="myProgress">
                          <v-progress-linear v-model="analysisParameters.identity" height="25">
                            <strong>{{ Math.ceil(analysisParameters.identity) }}%</strong>
                          </v-progress-linear>
                        </div></v-col
                      >
                    </v-row>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-card-title class="justify-center">ORFan gene summary</v-card-title>
              <!-- <BarChart :chartData="chartSummary" /> -->
              <GeneSummary :dataChart="chartSummary" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <v-card class="ma-md-6" max-width="1600" min-height="100">
          <v-card-title class="justify-center">ORFan Genes Categorization</v-card-title>
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
              disable-pagination
              class="elevation-1 querytable"
            >
              <template v-slot:item.sessionId="{ item }">
                <v-dialog
                  v-model="item.showDialog"
                  v-if="item.orfanLevel != 'Strict ORFan'"
                  transition="dialog-bottom-transition"
                  fullscreen
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      @click="loadBlastDataV2(item.sessionId, item.geneId)"
                      large
                      >mdi-chart-bar</v-icon
                    >
                  </template>
                  <v-card>
                    <v-card-title class="fixed-size" style="background-color: #009688 ">
                      <v-spacer></v-spacer>
                      <span class="gray-block-title">{{ item.description }}</span>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="item.showDialog = false" style="z-index:1000">
                        <v-icon size="x-large" color="white">mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text style="overflow: hidden;">
                      <v-row>
                        <v-col v-if="treeChartLoading == false">
                          <TreeChart :chartData="treeData" :loading="treeChartLoading" />
                        </v-col>
                        <v-col v-if="treeChartLoading == true">
                          Loading...
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </template>
              <template #footer.prepend>
                <v-spacer />
              </template>
            </v-data-table>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-right">
      <v-col cols="11">
        <v-btn class="mx-2" small color="teal" @click="downloadBlast(analysisId)">
          <v-icon color="white">
            mdi-download
          </v-icon>
          BLAST RESULTS
        </v-btn>
      </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
    <v-row class="text-right">
      <v-col cols="11"> </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
  </v-container>
</template>
<script>
import analysisAPI from "../api/analysis";
import BarChart from "../components/BarChart";
import TreeChart from "../components/TreeChart";
import GeneSummary from "../components/GeneSummary";
import { required, email } from "vuelidate/lib/validators";
import VueProgressBar from "vue-progressbar";

export default {
  name: "Result",
  components: {
    BarChart,
    TreeChart,
    VueProgressBar,
    GeneSummary
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
        organismImg: ""
      },
      chartSummary: {
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: -60
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "bar"
          }
        ]
      },
      genesCategorization: {
        search: "",
        headers: [
          { text: "Gene", align: "start", sortable: false, value: "geneId" },
          { text: "Description", value: "description", sortable: false },
          { text: "ORFan Gene Level", value: "orfanLevel", sortable: false },
          { text: "Homology Evidence", value: "sessionId", sortable: false }
        ],
        desserts: []
      },
      blastResult: {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
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
                fontSize: 12
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left"
                }
              }
            },
            emphasis: {
              focus: "descendant"
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      },
      analysisResult: {
        analysisId: this.$route.params.analysisId,
        email: "",
        firstName: "",
        lastName: ""
      },
      treeData: {}
    };
  },
  mounted() {
    const that = this;
    analysisAPI.getOrganismList().then(response => {
      that.organismList = Object.keys(response.data).map(key => {
        return { key: key, value: response.data[key] };
      });
    });
    this.isLoading = true;
    this.$Progress.start();
    analysisAPI.getAnalysis({ sessionId: this.$route.params.analysisId }).then(response => {
      that.$Progress.finish();
      console.log(response.data);
      that.analysisParameters.analysisId = response.data.analysisId;
      that.analysisParameters.organism = response.data.organism;
      that.analysisParameters.sequenceType = response.data.sequenceType;
      that.analysisParameters.evalue = response.data.evalue;
      that.analysisParameters.maximumTargetSequences = response.data.maximumTargetSequences;
      that.analysisParameters.identity = response.data.identity;
      let selectOrganism = that.organismList.filter(function(item) {
        return item.key.includes(response.data.organism);
      });
      that.analysisParameters.organismImg = selectOrganism[0].value;

      response.data.geneList.forEach(element => {
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
          sessionId: that.analysisId
        });
      });
    });

    this.isLoading = false;

    analysisAPI.getSummaryChart({ sessionId: this.$route.params.analysisId }).then(response => {
      console.log(response);
      response.data.x.forEach(item => {
        that.chartSummary.xAxis.data.push(item);
      });
      response.data.y.forEach(item => {
        that.chartSummary.series[0].data.push(item);
      });
    });
  },
  methods: {
    searchGene(gene) {
      window.location.href = "https://www.ncbi.nlm.nih.gov/search/all/?term=" + gene;
    },
    downloadBlast(id) {
      analysisAPI.downloadBlast(id).then(response => {
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
      analysisAPI.getBlastSummary({ geneId: geneId, sessionId: sessionId }).then(response => {
        this.treeChartLoading = false;
        response.data.tree.children.forEach(item => {
          that.blastResult.series[0].data.push(item);
          console.log("loadBlastData", item);
        });
      });
    },
    loadBlastDataV2(sessionId, geneId) {
      this.treeChartLoading = true;
      console.log("Loadding Blast " + sessionId + " " + geneId);
      analysisAPI.getBlastSummary({ geneId: geneId, sessionId: sessionId }).then(response => {
        this.treeChartLoading = false;
        this.treeData = this.extractNames(response.data.tree);
        console.log("extractedData", this.treeData);
      });
    },
    extractNames(node) {
      const result = { name: node.name };
      if (node.children) {
        result.children = node.children.map(child => this.extractNames(child));
      }
      return result;
    },
    saveAnalysis() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const that = this;
        analysisAPI.saveAnalysis(this.analysisResult).then(response => {
          that.saveResultDialog = false;
          console.log(response);
        });
      }
    },
    closeTreeChartDialog() {}
  },
  validations: {
    analysisResult: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required,
        email
      }
    }
  }
};
</script>

<style>
.info-item {
  padding-right: 10px; /* Adjust as needed */
}

.v-application--is-ltr .v-data-footer__pagination {
  margin-left: auto;
}

.gray-background {
  background-color: #cccccc;
}
</style>
