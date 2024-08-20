<template>
  <v-footer app padless class="pa-0" color="teal">
    <v-col class="d-flex flex-column" cols="12" background-color="teal">
      <v-container class="py-1 px-4">
        <v-row>
          <v-col cols="12">
            <h5 class="white--text text-left">ORFanID</h5>
            <p class="white--text text-left">
              ORFanID is an open-source web application that is capable of predicting orphan genes
              from a given list of gene sequences of a specified species. Each candidate gene is
              searched against the BLAST non-redundant database to find any detectable homologous
              sequences using BLAST programme.
            </p>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-container class="py-1 px-4">
        <v-row>
          <v-col cols="10" class="d-flex justify-space-between align-center">
            <div class="py-1 text-left white--text">
              Copyright &nbsp;© Gunasekera 2018 - 2023
            </div>
            <p class="py-1 text-right mb-0 white--text">
              <a
                class="grey--text footer-link"
                href="mailto:sureshhewabi@gmail.com?cc=vinodh@thegunasekeras.org,richgun01@gmail.com&Subject=ORFanID%20Online%20Issues"
              >Contact Us</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "ORFanFooter"
};
</script>

<style scoped>
.footer-link {
  color: white;
  text-decoration: none;
}
.footer-link:hover {
  text-decoration: underline;
}
</style>