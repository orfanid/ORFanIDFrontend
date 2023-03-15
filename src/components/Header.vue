<template>
  <v-app-bar app color="teal">
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
          Expirement
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
