<template>
  <v-container fluid class="admin-page">
    <div class="admin-toolbar">
      <div>
        <div class="admin-eyebrow">Analysis Debug Record</div>
        <h1>{{ analysisId }}</h1>
      </div>
      <div class="admin-toolbar-actions">
        <v-btn outlined color="teal" :to="{ name: 'admin-dashboard' }">
          <v-icon left>mdi-arrow-left</v-icon>
          Dashboard
        </v-btn>
        <v-btn outlined color="teal" @click="loadAnalysis">
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn outlined color="teal" @click="downloadAnalysisJson" :disabled="!analysis">
          <v-icon left>mdi-code-json</v-icon>
          JSON
        </v-btn>
        <v-btn outlined color="teal" @click="downloadGeneCsv" :disabled="geneList.length === 0">
          <v-icon left>mdi-file-delimited-outline</v-icon>
          Gene CSV
        </v-btn>
        <v-btn outlined color="teal" @click="downloadInputFasta" :disabled="geneList.length === 0">
          <v-icon left>mdi-file-download-outline</v-icon>
          Input FASTA
        </v-btn>
        <v-btn outlined color="teal" @click="downloadBlast" :disabled="!analysisId">
          <v-icon left>mdi-database-arrow-down-outline</v-icon>
          BLAST
        </v-btn>
      </div>
    </div>

    <v-alert v-if="loadError" type="error" dense outlined>{{ loadError }}</v-alert>

    <div v-if="analysis" class="admin-detail-layout">
      <section class="admin-panel">
        <div class="panel-title">Submission</div>
        <div class="detail-grid">
          <div class="detail-item" v-for="item in overviewItems" :key="item.label">
            <div class="detail-label">{{ item.label }}</div>
            <div class="detail-value">{{ item.value }}</div>
          </div>
        </div>
      </section>

      <section class="admin-panel">
        <div class="panel-title">Timeline</div>
        <div class="timeline-list">
          <div v-for="item in timelineItems" :key="item.label" class="timeline-row">
            <v-icon :color="item.active ? 'teal' : 'blue-grey'">{{ item.icon }}</v-icon>
            <div>
              <div class="timeline-label">{{ item.label }}</div>
              <div class="timeline-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="admin-panel admin-panel-wide">
        <div class="panel-title">Submitted Input</div>
        <pre class="query-block">{{ submittedInput || "Not recorded in API response." }}</pre>
      </section>

      <section class="admin-panel admin-panel-wide">
        <div class="panel-title">Gene Classification Results</div>
        <v-data-table
          :headers="geneHeaders"
          :items="geneList"
          :items-per-page="10"
          dense
          class="elevation-0"
        >
          <template v-slot:item.sequence="{ item }">
            <span class="sequence-preview" :title="item.sequence">{{ truncate(item.sequence, 80) }}</span>
          </template>
        </v-data-table>
      </section>

      <section class="admin-panel admin-panel-wide">
        <div class="panel-title">Raw Analysis JSON</div>
        <pre class="json-block">{{ prettyAnalysis }}</pre>
      </section>
    </div>
  </v-container>
</template>

<script>
import analysisAPI from "../api/analysis";
import moment from "moment";

export default {
  name: "AdminAnalysisDetail",
  data() {
    return {
      analysisId: this.$route.params.analysisId,
      analysis: null,
      loadError: "",
      geneHeaders: [
        { text: "Gene ID", value: "geneId" },
        { text: "Description", value: "description" },
        { text: "ORFan Level", value: "orfanLevel" },
        { text: "Taxon", value: "taxonomyId" },
        { text: "Length", value: "length" },
        { text: "Sequence", value: "sequence", sortable: false }
      ]
    };
  },
  computed: {
    geneList() {
      return this.analysis && this.analysis.geneList ? this.analysis.geneList : [];
    },
    overviewItems() {
      return [
        { label: "Submitter", value: this.getSubmitter(this.analysis) },
        { label: "Submitted", value: this.formatDate(this.analysis.analysisDate) },
        { label: "Started", value: this.formatDate(this.analysis.startedAt) },
        { label: "Finished", value: this.formatDate(this.analysis.finishedAt) },
        { label: "Queue Time", value: this.formatDuration(this.analysis.queueDurationSeconds) || "Not recorded" },
        { label: "Duration", value: this.formatDuration(this.analysis.durationSeconds) || "Not recorded" },
        { label: "Status", value: this.analysis.status || "Unknown" },
        { label: "Organism", value: this.analysis.organism || "Not recorded" },
        { label: "Taxonomy ID", value: this.analysis.taxonomyId || "Not recorded" },
        { label: "Sequence Type", value: this.analysis.sequenceType || "Not recorded" },
        { label: "Input Type", value: this.analysis.inputType || "Not recorded" },
        { label: "Input Count", value: this.analysis.inputSequenceCount || "Not recorded" },
        { label: "Input Length", value: this.inputLengthSummary },
        { label: "E-value (e-10)", value: this.analysis.evalue },
        { label: "Identity", value: `${this.analysis.identity}%` },
        { label: "Max Targets", value: this.analysis.maximumTargetSequences },
        { label: "Program", value: this.programLabel(this.analysis) },
        { label: "Error Reason", value: this.analysis.errorReason || this.analysis.errorMessage || "Not recorded" }
      ];
    },
    timelineItems() {
      const status = this.analysis.status;
      return [
        { label: "Submitted", value: this.formatDate(this.analysis.analysisDate), icon: "mdi-check-circle-outline", active: true },
        { label: "Queued", value: this.formatDuration(this.analysis.queueDurationSeconds) || "Not recorded", icon: "mdi-timer-sand", active: Boolean(status) },
        { label: "Started", value: this.formatDate(this.analysis.startedAt), icon: "mdi-play-circle-outline", active: Boolean(this.analysis.startedAt) },
        { label: "Finished", value: this.formatDate(this.analysis.finishedAt), icon: "mdi-flag-checkered", active: status === "COMPLETED" || status === "ERRORED" || status === "CANCELLED" }
      ];
    },
    submittedInput() {
      const direct = this.analysis.submittedInput || this.analysis.submittedQuery || this.analysis.accession || this.analysis.sequence || "";
      if (direct) {
        return direct;
      }

      if (this.geneList.length === 0) {
        return "";
      }

      const geneIds = this.geneList
        .map(gene => gene.geneId)
        .filter(geneId => geneId && geneId !== "Query_1");

      if (geneIds.length > 0) {
        return geneIds.join("\n");
      }

      return this.geneList.map(gene => gene.sequence).filter(Boolean).join("\n");
    },
    prettyAnalysis() {
      return JSON.stringify(this.analysis, null, 2);
    },
    inputLengthSummary() {
      if (!this.analysis.minInputLength && !this.analysis.maxInputLength) {
        return "Not recorded";
      }
      return `${this.analysis.minInputLength || 0}-${this.analysis.maxInputLength || 0} bp/aa, avg ${this.analysis.averageInputLength || 0}`;
    }
  },
  mounted() {
    this.loadAnalysis();
  },
  methods: {
    loadAnalysis() {
      this.loadError = "";
      analysisAPI.getAnalysis({ sessionId: this.analysisId })
        .then(response => {
          this.analysis = response.data;
        })
        .catch(() => {
          this.loadError = "Unable to load this analysis.";
        });
    },
    getSubmitter(data) {
      const user = data.user || {};
      return data.email || data.submitterName || data.nickname || user.email || "Not provided";
    },
    formatDate(value) {
      return value ? moment.utc(value).local().format("YYYY-MM-DD HH:mm:ss") : "Not recorded";
    },
    formatDuration(seconds) {
      if (seconds === undefined || seconds === null || seconds === "") {
        return "";
      }
      const totalSeconds = Math.max(0, Math.round(Number(seconds)));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const remainingSeconds = totalSeconds % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      }
      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${remainingSeconds}s`;
    },
    programLabel(data) {
      if (data.isPsiBlast) {
        return `PSI-BLAST (${data.numIteration || "default"} iterations)`;
      }
      return data.executionType || "blast";
    },
    truncate(value, maxLength) {
      if (!value) return "";
      return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
    },
    downloadAnalysisJson() {
      this.downloadText(this.prettyAnalysis, `${this.analysisId}-analysis.json`, "application/json");
    },
    downloadGeneCsv() {
      const columns = ["geneId", "description", "orfanLevel", "taxonomyId", "length", "gccontent", "sequence"];
      const csv = [
        columns.join(","),
        ...this.geneList.map(gene => columns.map(column => this.csvEscape(gene[column])).join(","))
      ].join("\n");
      this.downloadText(csv, `${this.analysisId}-genes.csv`, "text/csv");
    },
    downloadInputFasta() {
      const fasta = this.geneList.map((gene, index) => {
        const id = gene.geneId || `Query_${index + 1}`;
        const description = gene.description || "submitted sequence";
        return `>${id} ${description}\n${gene.sequence || ""}`;
      }).join("\n");
      this.downloadText(fasta, `${this.analysisId}-input.fasta`, "text/plain");
    },
    downloadBlast() {
      analysisAPI.downloadBlast(this.analysisId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.analysisId}-blast-results.bl`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    },
    csvEscape(value) {
      const text = String(value === undefined || value === null ? "" : value);
      return `"${text.replace(/"/g, '""')}"`;
    },
    downloadText(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.admin-page {
  background: #f6f9f8;
  min-height: 100vh;
  padding: 28px 34px;
}

.admin-toolbar {
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.admin-toolbar h1 {
  color: #1d3330;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 2px 0 0;
}

.admin-toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-eyebrow {
  color: #00796b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-detail-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
}

.admin-panel {
  background: #ffffff;
  border: 1px solid #dfecea;
  border-radius: 6px;
  padding: 18px;
}

.admin-panel-wide {
  grid-column: 1 / -1;
}

.panel-title {
  color: #1d3330;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 14px;
}

.detail-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-label {
  color: #607d78;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.detail-value {
  color: #263330;
  font-size: 0.96rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.timeline-list {
  display: grid;
  gap: 14px;
}

.timeline-row {
  align-items: center;
  display: flex;
  gap: 12px;
}

.timeline-label {
  color: #263330;
  font-weight: 700;
}

.timeline-value {
  color: #73807e;
  font-size: 0.9rem;
}

.query-block,
.json-block {
  background: #f4f8f7;
  border: 1px solid #dfecea;
  border-radius: 6px;
  color: #213330;
  font-family: "Roboto Mono", Consolas, monospace;
  font-size: 0.86rem;
  line-height: 1.55;
  max-height: 360px;
  overflow: auto;
  padding: 14px;
  white-space: pre-wrap;
}

.sequence-preview {
  display: inline-block;
  max-width: 360px;
  overflow-wrap: anywhere;
}

@media (max-width: 1000px) {
  .admin-detail-layout,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
