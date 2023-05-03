<template>
  <v-app-bar app color="teal">
    <v-navigation-drawer v-model="sidebar" app class="hidden-md-and-up">
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar>
      <v-container fluid class="d-flex position-relative w-100">
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
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn value="home" text color="white" to="/">
            <span color="white">Home</span>
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn value="results" text color="white" to="/input">
            <span>New Query</span>
            <!-- <v-icon>mdi-mdiFileChart</v-icon> -->
          </v-btn>

          <v-btn value="results" text color="white" to="/results">
            <span>Results</span>
            <!-- <v-icon>mdi-mdiFileChart</v-icon> -->
          </v-btn>

          <v-btn value="nearby" text color="white" to="/orfanBase">
            <span>ORFanBase</span>
            <!-- <v-icon>mdi-map-marker</v-icon> -->
          </v-btn>

          <v-btn value="nearby" text color="white" to="/accession">
            <span>Accessions</span>
            <!-- <v-icon>mdi-map-marker</v-icon> -->
          </v-btn>

          <v-btn value="nearby" text color="white" @click="navInstruction">
            <span>Instructions</span>
            <!-- <v-icon>mdi-map-marker</v-icon> -->
          </v-btn>

          <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="white"
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
        { title: "New Query", path: "/input" },
        { title: "Results", path: "/results" },
        { title: "ORFanBase", path: "/orfanBase" },
        { title: "Accessions", path: "/accession" },
        { title: "Instructions", path: "/instructions" },
        { title: "Experiment", path: "/experiment-diamond" }
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
