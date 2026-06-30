<template>
  <v-container class="admin-login-shell">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="admin-login-card" elevation="2">
          <div class="admin-eyebrow">Internal Access</div>
          <h1>Admin Dashboard</h1>
          <p class="admin-login-copy">
            Sign in to review submitted analyses, troubleshoot failed jobs, and export reports.
          </p>
          <v-form @submit.prevent="submitLogin">
            <v-text-field
              v-model="password"
              label="Admin password"
              type="password"
              outlined
              dense
              autofocus
              :error-messages="errorMessage"
            ></v-text-field>
            <v-btn block color="teal" dark type="submit">
              <v-icon left>mdi-lock-open-outline</v-icon>
              Sign In
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { loginAdmin } from "../utils/adminAuth";

export default {
  name: "AdminLogin",
  data() {
    return {
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    submitLogin() {
      if (loginAdmin(this.password)) {
        this.$router.push({ name: "admin-dashboard" });
        return;
      }

      this.errorMessage = "Invalid admin password.";
    }
  }
};
</script>

<style scoped>
.admin-login-shell {
  padding-top: 80px;
}

.admin-login-card {
  border-top: 5px solid #009688;
  padding: 28px;
}

.admin-login-card h1 {
  color: #1d3330;
  font-size: 2rem;
  font-weight: 700;
  margin: 4px 0 12px;
}

.admin-eyebrow {
  color: #00796b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-login-copy {
  color: #536865;
  font-size: 0.98rem;
  line-height: 1.55;
  margin-bottom: 24px;
}
</style>
