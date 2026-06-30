<template>
  <v-container fluid class="admin-page">
    <div class="admin-toolbar">
      <div>
        <div class="admin-eyebrow">ORFanID Operations</div>
        <h1>Admin Dashboard</h1>
      </div>
      <div class="admin-toolbar-actions">
        <v-btn outlined color="teal" @click="loadData">
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn outlined color="teal" @click="downloadCsv(filteredAnalyses, 'orfanid-admin-analyses.csv')">
          <v-icon left>mdi-file-delimited-outline</v-icon>
          Export CSV
        </v-btn>
        <v-btn text color="red" @click="logout">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </div>
    </div>

    <v-alert
      v-if="loadError"
      type="error"
      dense
      outlined
    >
      {{ loadError }}
    </v-alert>

    <div class="admin-stat-grid">
      <div class="admin-stat" v-for="metric in metrics" :key="metric.label">
        <div class="admin-stat-label">{{ metric.label }}</div>
        <div class="admin-stat-value">{{ metric.value }}</div>
      </div>
    </div>

    <div class="admin-filter-bar">
      <v-text-field
        v-model="filters.search"
        label="Search analysis ID, submitter, organism"
        prepend-inner-icon="mdi-magnify"
        dense
        outlined
        hide-details
      ></v-text-field>
      <v-select
        v-model="filters.status"
        :items="statusOptions"
        label="Status"
        dense
        outlined
        hide-details
      ></v-select>
      <v-select
        v-model="filters.sequenceType"
        :items="sequenceTypeOptions"
        label="Sequence type"
        dense
        outlined
        hide-details
      ></v-select>
      <v-text-field
        v-model="filters.from"
        label="From"
        type="date"
        dense
        outlined
        hide-details
      ></v-text-field>
      <v-text-field
        v-model="filters.to"
        label="To"
        type="date"
        dense
        outlined
        hide-details
      ></v-text-field>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredAnalyses"
      :loading="loading"
      :items-per-page="25"
      sort-by="submittedAt"
      :sort-desc="true"
      class="admin-table elevation-1"
    >
      <template v-slot:item.status="{ item }">
        <v-chip small :color="statusColor(item.status)" text-color="white">
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template v-slot:item.submittedAt="{ item }">
        {{ formatDate(item.submittedAt) }}
      </template>
      <template v-slot:item.finishedAt="{ item }">
        <span class="muted">{{ item.finishedAt || "Not recorded" }}</span>
      </template>
      <template v-slot:item.duration="{ item }">
        <span class="muted">{{ item.duration || "Not recorded" }}</span>
      </template>
      <template v-slot:item.queueDuration="{ item }">
        <span class="muted">{{ item.queueDuration || "Not recorded" }}</span>
      </template>
      <template v-slot:item.submittedQuery="{ item }">
        <span class="query-preview" :title="item.submittedQuery">
          {{ truncate(item.submittedQuery || "Open details", 48) }}
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon color="teal" :to="{ name: 'admin-analysis-detail', params: { analysisId: item.analysisId } }">
          <v-icon>mdi-file-search-outline</v-icon>
        </v-btn>
        <v-btn icon color="blue-grey" @click="downloadRowJson(item)">
          <v-icon>mdi-code-json</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import analysisAPI from "../api/analysis";
import moment from "moment";
import { logoutAdmin } from "../utils/adminAuth";

export default {
  name: "AdminDashboard",
  data() {
    return {
      loading: false,
      loadError: "",
      analyses: [],
      filters: {
        search: "",
        status: "All",
        sequenceType: "All",
        from: "",
        to: ""
      },
      headers: [
        { text: "Submitted", value: "submittedAt" },
        { text: "Finished", value: "finishedAt", sortable: false },
        { text: "Queue", value: "queueDuration", sortable: false },
        { text: "Duration", value: "duration", sortable: false },
        { text: "Analysis ID", value: "analysisId" },
        { text: "Submitter", value: "submitter" },
        { text: "Organism", value: "organism" },
        { text: "Taxon", value: "taxonomyId" },
        { text: "Type", value: "sequenceType" },
        { text: "Genes", value: "genes" },
        { text: "Status", value: "status" },
        { text: "Submitted Input", value: "submittedQuery", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      statusOptions: ["All", "PENDING", "START_PROCESSING", "COMPLETED", "ERRORED", "CANCELLED"],
      sequenceTypeOptions: ["All", "protein", "nucleotide", "gene"]
    };
  },
  computed: {
    filteredAnalyses() {
      const search = this.filters.search.trim().toLowerCase();
      return this.analyses.filter(item => {
        const matchesSearch = !search || [
          item.analysisId,
          item.submitter,
          item.organism,
          item.status,
          item.submittedQuery
        ].some(value => String(value || "").toLowerCase().includes(search));
        const matchesStatus = this.filters.status === "All" || item.status === this.filters.status;
        const matchesType = this.filters.sequenceType === "All" || item.sequenceType === this.filters.sequenceType;
        const submittedMoment = item.submittedAt ? moment(item.submittedAt) : null;
        const matchesFrom = !this.filters.from || (submittedMoment && submittedMoment.isSameOrAfter(this.filters.from, "day"));
        const matchesTo = !this.filters.to || (submittedMoment && submittedMoment.isSameOrBefore(this.filters.to, "day"));

        return matchesSearch && matchesStatus && matchesType && matchesFrom && matchesTo;
      });
    },
    metrics() {
      const total = this.analyses.length;
      const completed = this.countByStatus("COMPLETED");
      const errored = this.countByStatus("ERRORED");
      const processing = this.countByStatus("START_PROCESSING");
      const pending = this.countByStatus("PENDING");
      return [
        { label: "Total Loaded", value: total },
        { label: "Completed", value: completed },
        { label: "Processing", value: processing },
        { label: "Queued", value: pending },
        { label: "Errored", value: errored },
        { label: "Average Duration", value: this.averageDuration }
      ];
    },
    averageDuration() {
      const durations = this.analyses
        .map(item => item.durationSeconds)
        .filter(value => typeof value === "number" && value >= 0);
      if (durations.length === 0) {
        return "Not recorded";
      }
      const average = durations.reduce((sum, value) => sum + value, 0) / durations.length;
      return this.formatDuration(average);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.loadError = "";
      analysisAPI.getByDesc(0, 1000, "desc")
        .then(response => {
          const rows = response.data && response.data.results ? response.data.results : [];
          this.analyses = rows.map(this.mapAnalysisRow);
        })
        .catch(() => {
          this.loadError = "Unable to load admin analysis records.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    mapAnalysisRow(row) {
      return {
        submittedAt: row.analysisDate || row.date || "",
        finishedAt: row.finishedAt || row.completedAt || "",
        durationSeconds: row.durationSeconds,
        duration: this.formatDuration(row.durationSeconds),
        queueDurationSeconds: row.queueDurationSeconds,
        queueDuration: this.formatDuration(row.queueDurationSeconds),
        analysisId: row.analysisId || "",
        submitter: this.getSubmitter(row),
        organism: row.organism || "",
        taxonomyId: row.taxonomyId || row.taxId || "",
        sequenceType: row.sequenceType || row.accessionType || "",
        genes: row.numberOfGenes || row.genes || 0,
        status: row.status || "",
        submittedQuery: row.submittedInput || row.submittedQuery || row.accession || row.sequence || "",
        errorMessage: row.errorMessage || "",
        inputType: row.inputType || "",
        program: row.program || row.executionType || "",
        raw: row
      };
    },
    getSubmitter(data) {
      return data.email || data.submitterName || data.nickname || data.submitterNickname || data.name || "Not provided";
    },
    countByStatus(status) {
      return this.analyses.filter(item => item.status === status).length;
    },
    formatDate(value) {
      return value ? moment.utc(value).local().format("YYYY-MM-DD HH:mm:ss") : "Not recorded";
    },
    statusLabel(status) {
      if (status === "START_PROCESSING") {
        return "PROCESSING";
      }
      return status || "UNKNOWN";
    },
    statusColor(status) {
      if (status === "COMPLETED") return "teal";
      if (status === "ERRORED") return "red";
      if (status === "START_PROCESSING") return "green";
      if (status === "PENDING") return "blue-grey";
      return "grey";
    },
    truncate(value, maxLength) {
      if (!value) return "";
      return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
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
    downloadCsv(rows, filename) {
      const columns = [
        "submittedAt",
        "finishedAt",
        "queueDuration",
        "duration",
        "analysisId",
        "submitter",
        "organism",
        "taxonomyId",
        "sequenceType",
        "genes",
        "status",
        "inputType",
        "program",
        "errorMessage",
        "submittedQuery"
      ];
      const csv = [
        columns.join(","),
        ...rows.map(row => columns.map(column => this.csvEscape(row[column])).join(","))
      ].join("\n");
      this.downloadText(csv, filename, "text/csv");
    },
    csvEscape(value) {
      const text = String(value === undefined || value === null ? "" : value);
      return `"${text.replace(/"/g, '""')}"`;
    },
    downloadRowJson(item) {
      this.downloadText(JSON.stringify(item.raw, null, 2), `${item.analysisId}-summary.json`, "application/json");
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
    },
    logout() {
      logoutAdmin();
      this.$router.push({ name: "admin-login" });
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
  font-size: 2rem;
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

.admin-stat-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(6, minmax(120px, 1fr));
  margin-bottom: 16px;
}

.admin-stat {
  background: #ffffff;
  border: 1px solid #dfecea;
  border-radius: 6px;
  padding: 14px 16px;
}

.admin-stat-label {
  color: #607d78;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.admin-stat-value {
  color: #172d2a;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 4px;
}

.admin-filter-bar {
  background: #ffffff;
  border: 1px solid #dfecea;
  border-radius: 6px;
  display: grid;
  gap: 12px;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  margin-bottom: 16px;
  padding: 14px;
}

.admin-table {
  border: 1px solid #dfecea;
}

.muted {
  color: #73807e;
}

.query-preview {
  display: inline-block;
  max-width: 260px;
  overflow-wrap: anywhere;
}

@media (max-width: 1100px) {
  .admin-stat-grid,
  .admin-filter-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .admin-page {
    padding: 18px;
  }

  .admin-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-stat-grid,
  .admin-filter-bar {
    grid-template-columns: 1fr;
  }
}
</style>
