<template>
  <v-app-bar app color="teal">
    <v-navigation-drawer
      v-model="sidebar"
      app
      class="hidden-md-and-up mobile-drawer"
      :fixed="true"
      v-if="$vuetify.breakpoint.smAndDown"
      width="292"
    >
      <v-list class="drawer-list" nav dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          class="drawer-item"
          active-class="drawer-item-active"
          @click="sidebar = false"
        >
          <v-list-item-action class="drawer-icon-wrap">
            <v-icon class="drawer-icon">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="drawer-item-title">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar flat color="teal">
      <v-container fluid class="header-container">
        <span class="hidden-md-and-up d-flex d-md-none align-items-center">
          <v-app-bar-nav-icon @click="sidebar = !sidebar">
            <v-icon>menu</v-icon>
          </v-app-bar-nav-icon>
          <v-toolbar-title class="general-title">
          <router-link to="/" tag="span" style="cursor: pointer">
            ORFanID
          </router-link>
        </v-toolbar-title>
        </span>
        <v-toolbar-items class="hidden-sm-and-down nav-items">
          <v-btn value="home" text color="white" to="/" class="nav-link">
            <span color="white">Home</span>
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn value="results" text color="white" to="/input" class="nav-link">
            <span>New Query</span>
          </v-btn>

          <v-btn value="results" text color="white" to="/results" class="nav-link">
            <span>Results</span>
          </v-btn>

          <v-btn value="nearby" text color="white" to="/orfanBase" class="nav-link">
            <span>ORFanBase</span>
          </v-btn>

          <v-btn value="nearby" text color="white" to="/accession" class="nav-link">
            <span>Accessions</span>
          </v-btn>

          <v-btn value="nearby" text color="white" @click="navInstruction" class="nav-link">
            <span>Instructions</span>
          </v-btn>

          <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="white"
                  class="experiment-btn"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                  to="/experiment-diamond"
                >
                Experiment
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <v-list-item-title >{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </v-toolbar-items>
      </v-container>
    </v-toolbar>
  </v-app-bar>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      value: null,
      items: [
      { title: 'DIAMOND BLASTX' }
    ],
    sidebar: false,
      menuItems: [
        { title: "New Query", path: "/input", icon: "mdi-plus-circle-outline" },
        { title: "Results", path: "/results", icon: "mdi-chart-bar" },
        { title: "ORFanBase", path: "/orfanBase", icon: "mdi-database-search" },
        { title: "Accessions", path: "/accession", icon: "mdi-format-list-bulleted-square" },
        { title: "Instructions", path: "/instructions", icon: "mdi-book-open-page-variant" },
        { title: "Experiment", path: "/experiment-diamond", icon: "mdi-flask-outline" }
        // { title: 'Careers', path: '/signin' }
      ],
    };
  },
  methods: {
    navInstruction() {
      let routeData = this.$router.resolve({ name: "instructions" });
      window.open(routeData.href, "_blank");
      //window.open("https://docs.google.com/document/d/1YfvC9pTchIy58m9ONug2po59BwALcpCO3Ix5KfB6dUk/edit",'_blank');
    }
  }
};
</script>

<style scoped>
.header-container {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.nav-items {
  align-items: center;
  gap: 22px;
  justify-content: center;
  width: 100%;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  min-width: auto !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.experiment-btn {
  color: #222 !important;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  min-width: 150px !important;
}

.mobile-drawer {
  background: #009688 !important;
}

.drawer-list {
  padding: 12px 10px !important;
}

.drawer-item {
  border-radius: 8px !important;
  color: white !important;
  margin-bottom: 6px;
  min-height: 48px;
}

.drawer-item:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  color: white !important;
}

.drawer-item-active {
  background: white !important;
  color: #00695c !important;
}

.drawer-item-active .drawer-item-title,
.drawer-item-active .drawer-icon {
  color: #00695c !important;
}

.drawer-icon-wrap {
  margin-right: 14px !important;
}

.drawer-icon {
  color: inherit !important;
}

.drawer-item-title {
  font-size: 0.98rem;
  font-weight: 650;
}
</style>
