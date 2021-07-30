<template>
  <v-footer padless app  class="pa-0">
    <v-bottom-navigation class="d-flex flex-column" background-color="teal"  height="auto">
      <v-container class="p-2 pl-6">
        <v-row>
          <v-col cols="12">
            <h5 class="white-text text-left" style="color:white;">ORFanID</h5>
            <p class="grey-text text-lighten-4  text-left" style="color:white;">
              ORFanID is an open-source web application that is capable of
              predicting orphan genes from a given list of gene sequences of a
              specified species. Each candidate gene is searched against the
              BLAST non-redundant database to find any detectable homologous
              sequences using BLASP programme.
            </p>
          </v-col>
        </v-row>
      </v-container>
      <div class="copyright-footer">
        <v-container>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="8">
                <div class="container text-left" style="color:white;">
                  Copyright &nbsp;© Gunasekera 2021
                </div>
              </v-col>
              <v-col cols="4" class="align-center d-flex justify-end">
                <p class="text-lg-right mb-0" style="color:white;">
                  <a
                    class="grey-text text-lg-right footer-link"
                    href="mailto:sureshhewabi@gmail.com?cc=vinodh@thegunasekeras.org,richgun01@gmail.com&Subject=ORFanID%20Online%20Issues"
                    >Contact Us</a
                  >
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      </div>
    </v-bottom-navigation>
  </v-footer>
</template>
<script>
export default {
  name: "Header",
};
</script>
