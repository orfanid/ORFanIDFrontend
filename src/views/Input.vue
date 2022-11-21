<template>
  <v-container>
    <v-form id="input_form">
      <v-row>
        <v-col cols="4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="from.email"
                label="Nickname - (Optional)"
                required
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <span>Optional. Nickname will be useful to find your dataset quickly</span>
          </v-tooltip>
        </v-col>
        <v-col cols="8"></v-col>
      </v-row>
      <v-row>
        <v-col cols="s6" offset-s1>
          <v-container fluid class="d-flex align-center pl-0">
            <p class="mb-0 mr-2">Search By:</p>
            <label class="d-flex align-center">
              Sequence
              <v-switch
                true-value="a"
                false-value="s"
                class="ml-2"
                v-model="from.searchMethod"
                @change="onSequenceAccessionSwitch"
              >
              </v-switch>
              <span class="d-inline lever">Accessions</span>
            </label>
          </v-container>
        </v-col>
        <v-col cols="s6">
          <v-expansion-panels inset>
            <v-expansion-panel>
              <v-expansion-panel-header>Examples</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :disabled="from.submissionMode === 'upload'"
                        size="72"
                        color="green darken-2"
                        class="icon icon-species icon-human pa-4"
                        v-on:click="loadExampleData('Homo sapiens(9606)')"
                        v-bind="attrs"
                        v-on="on"
                      >
                      </v-icon>
                    </template>
                    <span>Homo sapiens</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :disabled="from.submissionMode === 'upload'"
                        size="72"
                        color="green darken-2"
                        class="icon icon-species icon-fly pa-4"
                        v-on:click="loadExampleData('Drosophila melanogaster(7227)')"
                        v-bind="attrs"
                        v-on="on"
                      >
                      </v-icon>
                    </template>
                    <span>Drosophila melanogaster</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :disabled="from.submissionMode === 'upload'"
                        size="72"
                        color="green darken-2"
                        class="icon icon-species icon-ecoli pa-4"
                        v-on:click="loadExampleData('Escherichia coli(562)')"
                        v-bind="attrs"
                        v-on="on"
                      ></v-icon>
                    </template>
                    <span>Escherichia coli</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :disabled="from.submissionMode === 'upload'"
                        size="72"
                        color="green darken-2"
                        class="icon icon-species icon-brassica pa-4"
                        v-on:click="loadExampleData('Arabidopsis thaliana(3702)')"
                        v-bind="attrs"
                        v-on="on"
                      >
                      </v-icon>
                    </template>
                    <span>Arabidopsis thaliana</span>
                  </v-tooltip>
                </v-col>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset-s1>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-file-input
                :disabled="
                  from.submissionMode === 'sequence' || from.submissionMode === 'accessions'
                "
                v-model="from.fileAttachment"
                @change="readFile"
                placeholder="Upload your documents"
                label="Upload File"
                multiple
                prepend-icon="mdi-cloud-upload"
                class="upload-button"
                v-bind="attrs"
                v-on="on"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </template>
            <span
              >Enter query sequence(s) in the text area. It strictly follows FASTA file format.
              Multiple sequence can be separated by new line</span
            >
          </v-tooltip>
        </v-col>
        <v-col cols="2">
          <v-radio-group v-model="from.accessionType" mandatory @change="onAccessionSelect">
            <v-radio label="Protein" value="protein"></v-radio>
            <v-radio label="Gene" value="nucleotide"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="NCBI or Uniprot Accession(s)"
                v-model="from.ncbiAccessionInput"
                @blur="validate"
                @click:append-outer="accessionLookup"
                :disabled="from.searchMethod == 's'"
                v-bind="attrs"
                v-on="on"
                :append-outer-icon="'mdi-store-search-outline'"
              ></v-text-field>
              <v-dialog v-model="showAccessionLookup" persistent max-width="1200">
                <v-card>
                  <v-card-title class="text-h5">
                    NCBI or Uniprot Accession(s) Lookup
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Gene name"
                          v-model="geneName"
                          :append-outer-icon="'mdi-store-search-outline'"
                          @click:append-outer="accessionSearch"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        
                        <v-list dense style="height:400px; overflow-y:auto">
                          <v-list-item-group v-model="AccesionLookup.selectedItem" color="primary">
                            <v-list-item v-for="(item, i) in AccesionLookup.items" :key="i">
                              <v-list-item-action>
                                <v-checkbox v-model="item.selected" true-value="true" false-value="false"></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  >{{ item.text }} - {{ item.title }}</v-list-item-title
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions style="position: absolute; position:0;">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="accesionLookupClose">
                      Close
                    </v-btn>
                    <v-btn color="green darken-1" text @click="accesionLookupApply">
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <span>NCBI/Uniprot accession. Multiple accessions should be separated by comma(s)</span>
          </v-tooltip>
          <label
            v-if="errors.showInvalidAccession == true && errors.invalidAccession == true"
            style="color: red"
            >Invalid Accession(s) - {{ errors.invalidAccessionMsg }}</label
          >
          <label
            style="color: red"
            v-if="$v.from.ncbiAccessionInput.$dirty && !$v.from.ncbiAccessionInput.required"
            >Accession is required.</label
          >
          <v-chip class="ma-n3 float-right" x-small>
            {{ from.ncbiAccessionInput.length }}/100
          </v-chip>
        </v-col>
      </v-row>
      <v-row v-if="this.from.accessionType === 'protein'">
        <v-col cols="6">
          <div>
            <h7>Program Selection</h7>
            <v-radio-group mandatory v-model="from.program">
              <v-radio
                label="PSI-BLAST (Position-Specific Iterated BLAST)"
                value="PSI-BLAST"
              ></v-radio>
              <v-radio label="BLAST" value="BLAST"></v-radio>
            </v-radio-group>
          </div>
        </v-col>
        <v-col cols="6" v-if="from.program == 'PSI-BLAST'">
          <v-select
            label="Number of iterations"
            :items="num_iterations"
            item-text="text"
            item-value="value"
            v-model="from.num_iteration"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-textarea
                label="Gene Sequence"
                v-model="from.sequence"
                :rules="textAreaRules"
                v-bind="attrs"
                v-on="on"
                :disabled="from.searchMethod == 'a'"
              ></v-textarea>
            </template>
            <span
              >Enter query sequence(s) in the text area. It strictly follows FASTA file format.
              Multiple sequence can be separated by new line</span
            >
          </v-tooltip>
          <v-chip class="ma-n3 float-right" x-small> {{ from.sequence.length }}/5000 </v-chip>
          <div style="color: red" v-if="$v.from.sequence.$dirty && !$v.from.sequence.required">
            Sequence is required.
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="organismSelection" mandatory>
            <v-radio label="Select Organism Name from list" value="dropdown"></v-radio>
            <v-radio label="Enter Organism Name" value="textfield"></v-radio>
          </v-radio-group>
          <v-autocomplete
            v-if="organismSelection == 'dropdown'"
            v-model="from.organismName"
            :items="organismList"
            label="Organism"
            item-text="name"
            item-value="name"
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:item="data">
              <v-list-item-avatar>
                <img :src="data.item.img" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            label="Organism"
            v-if="organismSelection == 'textfield'"
            v-model="from.organismName"
          ></v-text-field>

          <div
            style="color: red"
            v-if="$v.from.organismName.$dirty && !$v.from.organismName.required"
          >
            Organism is required.
          </div>
          <div style="color: red" v-if="$v.from.organismName.$dirty && !$v.from.organismName.alpha">
            The format entered for the organism name is incorrect. Please enter the Organism Name as
            follows: "organism name (tax id)"
          </div>
          <div
            style="color: orange"
            v-if="$v.from.organismName.$dirty && !$v.from.organismName.validOrganism"
          >
            This species name is not found in the ncbi lineage database. Taxonomic results will be
            limited. Do you still want to proceed.
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="s12" class="d-flex align-center">
          <v-expansion-panels flat class="pa-0">
            <v-expansion-panel class="pa-0">
              <v-expansion-panel-header class="pa-0">
                <v-spacer />
                <v-col cols="2"> Advanced Parameters: </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pa-0">
                <v-card flat color="transparent" class="pa-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-subheader class="pa-0" v-bind="attrs" v-on="on"
                        >Maximum
                        <a
                          class="mx-2"
                          href="https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=FAQ#expect"
                          target="_blank"
                          >E-value</a
                        >
                        for BLAST(e-10):</v-subheader
                      >
                    </template>
                    <span
                      >The Expect value (E) is a parameter that describes the number of hits one can
                      "expect" to see by chance when searching a database of a particular size. The
                      lower the E-value, or the closer it is to zero, the more "significant" the
                      match is. E value shown here are e-10 values.</span
                    >
                  </v-tooltip>
                  <v-slider
                    max="10"
                    min="1"
                    thumb-label
                    v-model="from.maxEvalue"
                    ticks
                    color="teal"
                  ></v-slider>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-subheader class="pa-0" v-bind="attrs" v-on="on"
                        >Maximum target Sequences for BLAST:</v-subheader
                      >
                    </template>
                    <span
                      >Maximum number of target sequences for BLAST is used to filter best hits from
                      the BLAST output. Eg: 500 means it will return only top 500 records from the
                      output. Higher the number, less relevant data might get includes while fewer
                      the number might miss matching subjects.</span
                    >
                  </v-tooltip>
                  <v-slider
                    max="1000"
                    min="100"
                    v-model="from.maxTargetSequence"
                    thumb-label
                    ticks
                    color="teal"
                  ></v-slider>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-subheader class="pa-0" v-bind="attrs" v-on="on">Identity:</v-subheader>
                    </template>
                    <span
                      >Percentage value(%) of how much subject and query sequences are
                      identical.</span
                    >
                  </v-tooltip>
                  <v-slider
                    max="100"
                    min="40"
                    v-model="from.identity"
                    thumb-label
                    ticks
                    color="teal"
                  ></v-slider>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row align="left" justify="space-around">
        <v-spacer />
      </v-row>

      <v-row>
        <v-col cols="10"></v-col>
        <v-col cols="2">
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="from.email"
            label="E-mail"
            required
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
            </template>
            <span>Optional. Email will be useful to find your dataset quickly</span>
          </v-tooltip>
          <label
            style="color: red"
            v-if="$v.from.email.$dirty && !$v.from.email.email"
            >Invalid email address</label
          > -->
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="2" offset-10>
          <v-btn
            @click="analysConformation"
            :disabled="disableSubmit"
            style="color: white"
            color="teal"
            >Submit
            <v-icon text color="white" right dark class="mdiChevronDoubleRight">
              mdi-send
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="isLoading" width="800" height="200" overlay-color="#506c87">
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span style="color: white">ORFanID</span>
        </v-card-title>

        <v-card-text>
          <div class="pa-3">
            <h5>
              <center>Please Confirm Sequence Submission</center>
            </h5>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="isLoading = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="analysData">
            <span>Submit</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import $ from "jquery";
import analysis from "@/api/analysis";
import { maxLength, required, requiredIf, email, helpers } from "vuelidate/lib/validators";
import router from "@/router";
import PubmedApi from "pubmed-api";
import lodash from "lodash";

const organism = helpers.regex("organism", /\(\d*\)$/g);

export default {
  name: "Home",
  methods: {
    loadExampleData(_exampleName) {
      this.clearAccessionSequenceAndOrganism();
      this.from.exampleName = _exampleName;
      let url = "";
      if (this.from.searchMethod == "s") {
        if (this.from.accessionType === "protein") {
          this.from.ncbiAccessionInput = this.exampleProteinDataValues[this.from.exampleName];
        } else {
          this.from.ncbiAccessionInput = this.exampleNucliotideDataValues[this.from.exampleName];
        }
        this.from.sequence = "";
      } else {
        url = `/data/example-${this.from.accessionType}-${this.from.exampleName}.fasta`;
        let that = this;
        $.get(url, data => {
          that.from.sequence = this.remove_linebreaks(data);
        });
        this.from.ncbiAccessionInput = "";
      }
      this.from.organismName = this.from.exampleName;
    },
    clearAccessionSequenceAndOrganism() {
      this.from.ncbiAccessionInput = "";
      this.from.sequence = "";
      this.from.organismName = "";
    },
    analysData() {
      debugger
      this.$v.$touch();
      if (
        this.$v.from.sequence.$invalid == false &&
        this.$v.from.ncbiAccessionInput.$invalid == false
      ) {
        console.log(this.from);

        var requestInfo = {
          accessionType: this.from.accessionType,
          identity: this.from.identity,
          maxEvalue: this.from.maxEvalue,
          maxTargetSequence: this.from.maxTargetSequence,
          organismName: this.from.organismName,
          sequence: this.from.sequence,
          email: this.from.email != "" ? this.from.email : null,
          isPsiBlast: this.from.program == "PSI-BLAST" ? true : false,
          num_iteration: parseInt(this.from.num_iteration)
        };

        if (this.from.submissionMode === "upload") {
          requestInfo.sequence = this.uploadFileContent;
          requestInfo.organismName = this.from.organismName;
        } else {
          if (this.from.searchMethod == "a") {
            requestInfo.accession = this.from.ncbiAccessionInput;
          } else {
            requestInfo.sequence = this.from.sequence;
          }
        }

        this.isLoading = true;
        analysis
          .analyse(requestInfo)
          .then(response => {
            this.analyseResult.session = response.data;
          })
          .catch(error => {
            console.log(error);
          });

        this.isLoading = false;
        setTimeout(function() {
          router.push({ name: "results" });
        }, 600);
      }
    },
    analysConformation() {
      this.$v.$touch();
      if (this.disableSubmit == false) {
        this.isLoading = true;
      }
    },
    goToResultsPage() {
      this.$router.push("results");
    },
    reSetData() {
      this.isLoading = false;
    },
    validate() {
      analysis
        .validate({
          accessions: this.from.ncbiAccessionInput,
          accessionType: this.from.accessionType
        })
        .then(response => {
          if (response.data.isValid == false) {
            this.errors.invalidAccessionMsg = response.data.invalidAccessions.join(", ");
            this.errors.invalidAccession = true;
          } else {
            this.errors.invalidAccession = false;
          }
        });
    },
    onCancel() {
      console.log("a");
    },
    remove_linebreaks(str) {
      return str.replace(/[\r]+/gm, "");
    },
    readFile() {
      if (!this.from.fileAttachment) {
        this.from.fileAttachment = "No File Chosen";
      }
      var reader = new FileReader();

      reader.readAsText(this.from.fileAttachment[0]);
      reader.onload = () => {
        this.uploadFileContent = reader.result;
        this.from.sequence = reader.result;
      };
    },
    organismValid() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(false);
        }, 500);
      });
    },
    accessionLookup() {
      this.showAccessionLookup = true;
    },
    accesionLookupApply() {
      var selectedAccessions = lodash.filter(this.AccesionLookup.items,{'selected': 'true'});
      console.log(selectedAccessions);
      var accessionsArray = lodash.map(selectedAccessions,'text');
      if(accessionsArray != null && accessionsArray.length > 0) {
        this.from.ncbiAccessionInput = accessionsArray.toString();
      }
      this.showAccessionLookup = false;
    },
    accesionLookupClose() {
      this.showAccessionLookup = false;
    },
    searchAccessionLookup() {},
    accessionSearch() {
      console.log("Search Accessions");
      if (this.geneName.length > 0) {
        this.getESearch(this.geneName);
      }
    },
    async getESearch(query) {
      this.searchResult.idList = [];
      this.searchResult.resultSummary = [];
      const options = {
        retStart: "1",
        retMax: "1000"
      };
      try {
        let that = this;
        const results = await this.pubMedApi.eSearch.search(that.selectedDatabase, query, options);
        var result = JSON.parse(results);
        if (
          result.esearchresult &&
          result.esearchresult.idlist &&
          result.esearchresult.idlist.length > 0
        ) {
          for (let index = 0; index < result.esearchresult.idlist.length; index++) {
            that.searchResult.idList.push({
              index: index,
              id: result.esearchresult.idlist[index]
            });
          }
        }
        let pageIds = await that.getCurretPageIds();

        that.downloadSummaryResult = await that.getESearchSummary(pageIds);
        if (that.downloadSummaryResult && that.downloadSummaryResult.result) {
          Object.values(that.downloadSummaryResult.result).forEach(val => {
            that.searchResult.resultSummary.push(val);
            that.AccesionLookup.items.push({
              text: val.accessionversion,
              title: val.title,
              icon: "mdi-flag",
              selected:'false'
            });
            that.AccesionLookup;
          });

          console.log(that.searchResult.resultSummary);

          //this.downloadPageFile(that.downloadSummaryResult);
        }
      } catch (error) {
        console.log(error);
      }
    },
    getESearchSummary: async function(queryids) {
      let that = this;
      try {
        const results = await this.pubMedApi.eSummary.search(that.selectedDatabase, queryids);
        let resultSummary = JSON.parse(results);
        console.log(resultSummary);
        return resultSummary;
      } catch (error) {
        console.log(error);
      }
    },
    getCurretPageIds() {
      let minIndex = 1;
      let maxIndex = 100;
      let selecteditems = lodash.filter(this.searchResult.idList, function(e) {
        return e.index >= minIndex && e.index <= maxIndex;
      });

      let idArray = lodash.map(selecteditems, function(e) {
        return e.id;
      });
      return idArray.toString();
    },
    onAccessionSelect(val) {
      if (val == "nucleotide") {
        this.errors.showInvalidAccession = false;
      } else {
        this.errors.showInvalidAccession = true;
      }
    }
  },
  watch: {
    "from.fileAttachment": {
      handler: function(after, before) {
        if (after.length > 0) {
          this.from.submissionMode = "upload";
        } else {
          this.from.submissionMode = "";
        }
      },
      deep: true
    },
    "from.sequence": {
      handler: function(after, before) {
        if (after != "") {
          this.from.submissionMode = "sequence";
        } else {
          this.from.submissionMode = "";
        }
      },
      deep: true
    },
    "from.ncbiAccessionInput": {
      handler: function(after, before) {
        if (after != "") {
          this.from.submissionMode = "accessions";
        } else {
          this.from.submissionMode = "";
        }
      },
      deep: true
    }
  },
  mounted() {
    this.pubMedApi = new PubmedApi();
    analysis.getOrganismList().then(response => {
      Object.entries(response.data).forEach(element => {
        this.organismList.push({
          name: element[0],
          img: element[1]
        });
      });
    });
  },
  data() {
    return {
      pubMedApi: null,
      selectedDatabase: "protein",
      showAccessionLookup: false,
      AccesionLookup: {
        selectedItem: 1,
        items: []
      },
      organismSelection: "dropdown",
      isLoading: false,
      fullPage: true,
      toggleAdvanceparameters: false,
      organismList: [],
      geneName: null,
      num_iterations: [
        { text: "0", value: 0 },
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 }
      ],
      from: {
        sequenceGroup: 1,
        analysisId: new Date().toJSON().replace(/-/g, "/"),
        exampleName: "",
        accessionType: "protein",
        ncbiAccessionInput: "",
        searchMethod: "a",
        sequence: "",
        organismName: "",
        maxEvalue: 3,
        maxTargetSequence: 550,
        identity: 60,
        email: "",
        fileAttachment: null,
        submissionMode: "",
        program: null,
        num_iteration: 2
      },
      analyseResult: {
        session: ""
      },
      errors: {
        showInvalidAccession: true,
        invalidAccession: false,
        invalidAccessionMsg: ""
      },
      textAreaRules: [value => (value || "").length <= 5000 || "Max 5000 characters"],
      exampleProteinDataValues: {
        "Escherichia coli(562)": "NP_415100.1,YP_002791247.1,NP_414542.1",
        "Drosophila melanogaster(7227)": "NP_524859.2",
        "Homo sapiens(9606)": "NP_001119584.1",
        "Arabidopsis thaliana(3702)": "NP_187663.1"
      },
      exampleNucliotideDataValues: {
        "Escherichia coli(562)": "NZ_JAACYZ010000241.1,X86971.1",
        "Drosophila melanogaster(7227)": "NM_080120.3",
        "Homo sapiens(9606)": "NM_001126112.2",
        "Arabidopsis thaliana(3702)": "NM_111887.3"
      },
      searchResult: {
        idList: [],
        resultSummary: []
      }
    };
  },
  computed: {
    disableSubmit: function() {
      return (
        this.$v.$dirty == true &&
        (this.$v.from.sequence.$invalid == true ||
          (this.$v.from.ncbiAccessionInput.$invalid == true && this.$v.from.email.$invalid == true))
      );
    },
    valdioateAccession: function() {
      if (
        this.from.searchMethod == "a" &&
        this.from.accessionType == "nucleotide" &&
        this.from.ncbiAccessionInput != ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  validations: {
    from: {
      sequence: {
        maxLength: maxLength(5000)
      },
      organismName: {
        required: requiredIf(function() {
          return this.from.submissionMode === "accessions" || this.from.submissionMode === "upload";
        }),
        alpha: organism,
        validOrganism: analysis.validateOrganism
      },
      ncbiAccessionInput: {
        required: function ncbiAccessionRequired(val) {
          if (this.from.submissionMode === "upload") return true;

          if (
            this.from.searchMethod == "a" &&
            this.from.accessionType == "nucleotide" &&
            val == ""
          ) {
            return false;
          } else {
            return true;
          }
        }
      },
      sequence: {
        required: function sequenceRequired(val) {
          if (this.from.submissionMode === "upload") return true;

          if (this.from.searchMethod == "s" && val == "") {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
};
</script>
<style scoped>
.v-fade {
  display: inherit !important; /* override v-show display: none */
  transition: opacity 0.5s;
}

.v-fade[style*="display: none;"] {
  opacity: 0;
  pointer-events: none; /* disable user interaction */
  user-select: none; /* disable user selection */
  height: 0px !important;
}

.v-expansion-panels {
  box-shadow: none;
}

.v-icon {
  cursor: pointer;
}
</style>
<!--export default class Home extends Vue {}-->
