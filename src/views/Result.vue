<template>
  <v-container>
    <PageGuide
      description="This page summarizes one ORFanID analysis, including the submitted parameters, ORFan gene categories, and homology evidence."
      :steps="[
        'Review the analysis parameters to confirm the organism, sequence type, E-value, target sequence limit, and identity threshold.',
        'Use the ORFan gene summary chart to compare the categories identified in the analysis.',
        'Search the categorization table to locate a specific gene or description.',
        'Open the homology evidence graph for non-strict ORFan genes to inspect the taxonomy tree.',
        'Download the BLAST results when you need the raw evidence file.'
      ]"
    />
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="result-overview-card ma-md-6" max-width="1600" min-height="400">
          <v-row>
            <v-col cols="12" md="6">
              <div class="result-section-heading">
                <div class="section-eyebrow">Analysis Overview</div>
                <h2>Result Details</h2>
                <div class="summary-chip-row">
                  <v-chip small color="teal" text-color="white">
                    {{ displayValue(analysisParameters.sequenceType, "Sequence type unavailable") }}
                  </v-chip>
                  <v-chip small outlined color="teal">
                    {{ analysisParameters.totalGenes }} gene{{ analysisParameters.totalGenes === 1 ? "" : "s" }}
                  </v-chip>
                </div>
              </div>
              <div id="orfanGenesSummary" class="detail-grid text-left">
                <div
                  class="detail-item"
                  v-for="item in analysisDetailRows"
                  :key="item.label"
                >
                  <div class="detail-label">{{ item.label }}</div>
                  <div class="detail-value" :title="item.title || item.value">{{ item.value }}</div>
                </div>
                <div class="detail-item detail-item-full">
                  <div class="detail-label">Identity Threshold</div>
                  <div class="identity-row">
                    <v-progress-linear
                      v-model="analysisParameters.identity"
                      color="teal"
                      background-color="#d9ece9"
                      height="22"
                    >
                      <strong>{{ Math.ceil(analysisParameters.identity || 0) }}%</strong>
                    </v-progress-linear>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-card-title class="justify-center chart-title">ORFan gene summary</v-card-title>
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
        submitterName: "",
        submittedQuery: "",
        evalue: "",
        maximumTargetSequences: "",
        identity: "",
        analysisId: "",
        organismImg: "",
        totalGenes: 0
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
  computed: {
    analysisDetailRows() {
      return [
        {
          label: "Submitter",
          value: this.displayValue(this.analysisParameters.submitterName, "Not provided")
        },
        {
          label: "Analysis ID",
          value: this.displayValue(this.analysisParameters.analysisId)
        },
        {
          label: "Organism",
          value: this.displayValue(this.analysisParameters.organism)
        },
        {
          label: "Sequence Type",
          value: this.displayValue(this.analysisParameters.sequenceType)
        },
        ...this.submittedQueryRow,
        {
          label: "E-value (e-10)",
          value: this.displayValue(this.analysisParameters.evalue)
        },
        {
          label: "Maximum Target Sequences",
          value: this.displayValue(this.analysisParameters.maximumTargetSequences)
        }
      ];
    },
    submittedQueryRow() {
      if (!this.analysisParameters.submittedQuery) {
        return [];
      }
      return [
        {
          label: "Submitted Query",
          value: this.truncateText(this.analysisParameters.submittedQuery, 80),
          title: this.analysisParameters.submittedQuery
        }
      ];
    }
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
      that.analysisParameters.submitterName = that.getSubmitterName(response.data);
      if (!that.analysisParameters.submitterName) {
        that.loadSubmitterNameFromResults();
      }
      that.analysisParameters.submittedQuery = that.getSubmittedQuery(response.data);
      that.analysisParameters.evalue = response.data.evalue;
      that.analysisParameters.maximumTargetSequences = response.data.maximumTargetSequences;
      that.analysisParameters.identity = response.data.identity;
      that.analysisParameters.totalGenes = response.data.numberOfGenes || (response.data.geneList ? response.data.geneList.length : 0);
      let selectOrganism = that.organismList.filter(function(item) {
        return item.key.includes(response.data.organism);
      });
      that.analysisParameters.organismImg = selectOrganism.length > 0 ? selectOrganism[0].value : "";

      (response.data.geneList || []).forEach(element => {
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
    displayValue(value, fallback = "Not available") {
      return value !== undefined && value !== null && value !== "" ? value : fallback;
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
    loadSubmitterNameFromResults() {
      analysisAPI.getByDesc(0, 1000, "desc").then(response => {
        const results = response.data && response.data.results ? response.data.results : [];
        const matchingAnalysis = results.find(item => item.analysisId === this.analysisParameters.analysisId);
        if (matchingAnalysis) {
          this.analysisParameters.submitterName = this.getSubmitterName(matchingAnalysis);
        }
      });
    },
    getSubmittedQuery(data) {
      return data.accession || data.accessions || data.ncbiAccessionInput || data.sequence || "";
    },
    truncateText(value, maxLength) {
      if (!value) {
        return "Not available";
      }
      return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
    },
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

.result-overview-card {
  padding: 40px 48px;
}

.result-section-heading {
  margin-bottom: 22px;
  text-align: left;
}

.result-section-heading h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 4px 0 10px;
}

.section-eyebrow {
  color: #00796b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-item {
  background: #f7faf9;
  border: 1px solid #e0ece9;
  border-radius: 6px;
  padding: 12px 14px;
}

.detail-item-full {
  grid-column: 1 / -1;
}

.detail-label {
  color: #607d78;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.detail-value {
  color: #263330;
  font-size: 1rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.identity-row {
  margin-top: 8px;
}

.chart-title {
  font-weight: 600;
}

@media (max-width: 960px) {
  .result-overview-card {
    padding: 24px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.v-application--is-ltr .v-data-footer__pagination {
  margin-left: auto;
}

.gray-background {
  background-color: #cccccc;
}
</style>
