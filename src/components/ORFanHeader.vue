<template>
  <v-app-bar app color="teal">
    <v-toolbar>
      <v-container fluid class="d-flex position-relative w-100">
        <v-toolbar-items class="hidden-sm-and-down">
          <template v-for="item in menuItems" :key="item.title">
            <v-btn :value="item.title" text color="white" :to="item.path">
              <span>{{ item.title }}</span>
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </template>
        </v-toolbar-items>
      </v-container>
    </v-toolbar>>
  </v-app-bar>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "ORFanHeader",
  setup() {
    const sidebar = ref(false);
    const items = ref([{ title: 'DIAMOND BLASTX' }]);
    const menuItems = ref([
    { title: "Home", path: "/input", icon: "mdi-home" },
      { title: "New Query", path: "/input", icon: "" },
      { title: "Results", path: "/results" , icon: ""},
      { title: "ORFanBase", path: "/orfanBase", icon: "" },
      { title: "Accessions", path: "/accession" , icon: ""},
      { title: "Instructions", path: "/instructions" , icon: ""},
      { title: "Experiment", path: "/experiment-diamond", icon: "" }
    ]);

    const navInstruction = () => {
      const routeData = this.$router.resolve({ name: "instructions" });
      if (routeData && routeData.href) {
        window.open(routeData.href, "_blank");
      } else {
        console.error("Route 'instructions' not found");
      }
    };

    return {
      sidebar,
      items,
      menuItems,
      navInstruction
    };
  }
};
</script>

<style>
</style>