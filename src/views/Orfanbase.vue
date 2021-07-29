<template>
  <div class="container">
    <div class="section">
      <div id="savedResultView" class="row">
        <div class="col s10 offset-s1 center-align">
          <div>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Enter Search Term Here"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="desserts"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              :search="search"
              hide-default-footer
              class="elevation-1"
              @page-count="pageCount = $event"
            >
              <template v-slot:item.analysisIdNav="{ item }">
                <router-link
                  :to="{
                    name: 'result',
                    params: { analysisId: item.analysisIdNav },
                  }"
                >
                  <v-icon large>mdi-chart-bar</v-icon>
                </router-link>
              </template>
            </v-data-table>
            <v-row>
              <v-col cols="1">
                <v-combobox
                  :value="itemsPerPage"
                  :items="[5, 10, 15, 20, 25, 30]"
                  label="Items per page"
                  type="number"
                  @input="itemsPerPage = parseInt($event, 5)"
                ></v-combobox>
              </v-col>
              <v-col cols="11"
                ><v-pagination v-model="page" :length="pageCount"></v-pagination
              ></v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import analysisAPI from "../api/analysis";
import moment from "moment";

export default {
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        { text: "Date", align: "start", sortable: true, value: "date" },
        { text: "Organism", value: "organism", sortable: true },
        { text: "Genes ID", value: "geneId", sortable: true },
        { text: "Description", value: "description", sortable: true },
        { text: "Orfan Level", value: "orfanLevel", sortable: true },
        { text: "", value: "analysisIdNav", sortable: true },
      ],
      desserts: [],
    };
  },
  mounted() {
    const that = this;
    analysisAPI.orfanBaseGenes().then((response) => {
      console.log(response);
      response.data.forEach((element) => {
        that.desserts.push({
          date: moment(element.analysisDate).format("YYYY-MM-DD HH:mm:ss"),
          organism: element.organism,
          geneId: element.geneId,
          description: element.description,
          orfanLevel: element.orfanLevel,
          analysisId: element.analysisId,
          analysisIdNav: element.analysisId,
        });
      });
    });
  },
};
</script>

<style></style>
