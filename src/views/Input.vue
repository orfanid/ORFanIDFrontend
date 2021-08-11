<template>
  <v-container>
    <v-form id="input_form">
      <v-row>
        <v-col cols="4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="from.email"
            label="E-mail - (Optional)"
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
          >
        </v-col>
        <v-col cols="8"></v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset-s1>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-file-input
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
            <span>Enter query sequence(s) in the text area. It strictly follows FASTA file format.
              Multiple sequence can be separated by new line</span>
          </v-tooltip>
        </v-col>
        <v-col cols="2">
          <v-radio-group v-model="from.accessionType" mandatory>
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
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
          <span>NCBI/Uniprot accession. Multiple accessions should be separated by comma(s)</span>
          </v-tooltip>
          <label v-if="errors.invalidAccession" style="color: red"
            >Invalid Accession(s)- {{ errors.invalidAccessionMsg }}</label
          >
          <label
            style="color: red"
            v-if="
              $v.from.ncbiAccessionInput.$dirty &&
              !$v.from.ncbiAccessionInput.required
            "
            >Accession is required.</label
          >
          <v-chip class="ma-n3 float-right" x-small>
            {{ from.ncbiAccessionInput.length }}/100
          </v-chip>
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
              ></v-textarea>
            </template>
            <span>Enter query sequence(s) in the text area. It strictly follows FASTA file format.
              Multiple sequence can be separated by new line</span>
          </v-tooltip>
          <v-chip class="ma-n3 float-right" x-small>
            {{ from.sequence.length }}/5000
          </v-chip>
          <div
            style="color: red"
            v-if="$v.from.sequence.$dirty && !$v.from.sequence.required"
          >
            Sequence is required.
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
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
            </template>
            <span>Organism name and the Taxonomy ID according to the NCBI Taxonomy Database. Only most common taxa will be shown.
              If the Organism is not available here, type them here in the format of ORGANISM NAME(TAXONOMY ID)</span>
          </v-tooltip>
          <div
            style="color: red"
            v-if="$v.from.organismName.$dirty && !$v.from.organismName.required"
          >
            Organism is required.
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="s6" offset-s1>
          <v-container fluid class="d-flex align-center pl-0">
            <p class="mb-0 mr-2">Search By:</p>
            <label class="d-flex align-center">
              sequence
              <v-switch
                true-value="true"
                false-value="false"
                class="ml-2"
                v-model="from.exampleMethod"
                @change="clearAccessionSequenceAndOrganism"
              >
              </v-switch>
              <span class="d-inline lever">accessions</span>
            </label>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="s12" class="d-flex align-center">
          <v-expansion-panels flat class="pa-0">
            <v-expansion-panel class="pa-0">
              <v-expansion-panel-header class="pa-0">
                <v-spacer />
                <v-col cols="2"> Advanced parameters: </v-col>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pa-0">
                <v-card flat color="transparent" class="pa-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                  <v-subheader class="pa-0"
                               v-bind="attrs"
                               v-on="on"
                    >Maximum
                    <a
                      class="mx-2"
                      href="https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=FAQ"
                      target="_blank"
                      >E-value</a
                    >
                    for BLAST(e-10):</v-subheader
                  >
                    </template>
                    <span>The Expect value (E) is a parameter that describes the number of hits one can "expect" to see
                      by chance when searching a database of a particular size.
                      The lower the E-value, or the closer it is to zero, the more "significant" the match is.
                      E value shown here are e-10 values.</span>
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
                  <v-subheader class="pa-0"
                               v-bind="attrs"
                               v-on="on"
                    >Maximum target sequences for BLAST:</v-subheader
                  >
                    </template>
                    <span>Maximum number of target sequences for BLAST is used to filter best hits from the BLAST output.
                      Eg: 500 means it will return only top 500 records from the output.
                      Higher the number, less relevant data might get includes while fewer the number might miss matching subjects.</span>
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
                  <v-subheader class="pa-0"
                               v-bind="attrs"
                               v-on="on"
                  >Identity:</v-subheader>
                    </template>
                    <span>Percentage value(%) of how much subject and query sequences are identical.</span>
                  </v-tooltip>
                  <v-slider
                    max="100"
                    min="60"
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
        <v-col cols="6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
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
            :disabled="
              ($v.$invalid && $v.$dirty) || this.errors.invalidAccession
            "
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
    <v-dialog
      v-model="isLoading"
      width="800"
      height="200"
      overlay-color="#506c87"
    >
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span style="color: white">ORFanID</span>
        </v-card-title>

        <v-card-text>
          <div class="pa-3">
            <h5 v-if="analyseSubmited == false">
              <center>Please Confirm Sequence Submission</center>
            </h5>
            <h5 v-if="analyseSubmited == true">
              <center>Your request has been submitted successfully.</center>
            </h5>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="isLoading = false"
            v-if="!analyseSubmited"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="analysData">
            <span v-if="!analyseSubmited">Submit</span>
            <span v-if="analyseSubmited">OK</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import $ from "jquery";
import analysis from "@/api/analysis";
import {
  maxLength,
  required,
  requiredIf,
  email,
} from "vuelidate/lib/validators";

export default {
  name: "Home",
  methods: {
    loadExampleData(_exampleName) {
      this.clearAccessionSequenceAndOrganism();
      this.from.exampleName = _exampleName;
      let url = "";
      if (this.from.exampleMethod == "true") {
        if (this.from.accessionType === "protein") {
          this.from.ncbiAccessionInput =
            this.exampleProteinDataValues[this.from.exampleName];
        } else {
          this.from.ncbiAccessionInput =
            this.exampleNucliotideDataValues[this.from.exampleName];
        }
        this.from.sequence = "";
      } else {
        url = `/data/example-${this.from.accessionType}-${this.from.exampleName}.fasta`;
        let that = this;
        $.get(url, (data) => {
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
      if (this.analyseSubmited) {
        this.reSetData();
        this.goToResultsPage();
      } else {
        this.$v.$touch();
        if (this.$v.$invalid == false) {
          console.log(this.from);

          var requestInfo = {
            accessionType: this.from.accessionType,
            identity: this.from.identity,
            maxEvalue: this.from.maxEvalue,
            maxTargetSequence: this.from.maxTargetSequence,
            organismName: this.from.organismName,
            sequence: this.from.sequence,
            email: this.from.email != "" ? this.from.email : null,
          };

          if (this.from.exampleMethod == "true") {
            requestInfo.accession = this.from.ncbiAccessionInput;
          } else {
            requestInfo.sequence = this.from.sequence;
          }
          this.isLoading = true;
          analysis
            .analyse(requestInfo)
            .then((response) => {
              this.analyseResult.session = response.data;
            })
            .catch((error) => {
              console.log(error);
            });
          this.analyseSubmited = true;
        }
      }
    },
    analysConformation() {
      this.$v.$touch();
      if (this.$v.$invalid == false) {
        this.isLoading = true;
      }
    },
    goToResultsPage() {
      this.$router.push("results");
    },
    reSetData() {
      this.isLoading = false;
      this.analyseSubmited = false;
    },
    validate() {
      analysis
        .validate({
          accessions: this.from.ncbiAccessionInput,
          accessionType: this.from.accessionType,
        })
        .then((response) => {
          if (response.data.isValid == false) {
            this.errors.invalidAccessionMsg =
              response.data.invalidAccessions.join(", ");
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
  },
  mounted() {
    analysis.getOrganismList().then((response) => {
      Object.entries(response.data).forEach((element) => {
        this.organismList.push({
          name: element[0],
          img: element[1],
        });
      });
    });
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      toggleAdvanceparameters: false,
      organismList: [],
      analyseSubmited: false,
      from: {
        sequenceGroup: 1,
        analysisId: new Date().toJSON().replace(/-/g, "/"),
        exampleName: "",
        accessionType: "protein",
        ncbiAccessionInput: "",
        exampleMethod: "false",
        sequence: "",
        organismName: "",
        maxEvalue: 3,
        maxTargetSequence: 550,
        identity: 60,
        email: "",
      },
      analyseResult: {
        session: "",
      },
      errors: {
        invalidAccession: false,
        invalidAccessionMsg: "",
      },
      textAreaRules: [
        (value) => (value || "").length <= 5000 || "Max 5000 characters",
      ],
      exampleProteinDataValues: {
        "Escherichia coli(562)": "NP_415100.1,YP_002791247.1,NP_414542.1",
        "Drosophila melanogaster(7227)": "NP_524859.2",
        "Homo sapiens(9606)": "NP_001119584.1",
        "Arabidopsis thaliana(3702)": "NP_187663.1",
      },
      exampleNucliotideDataValues: {
        "Escherichia coli(562)": "NZ_JAACYZ010000241.1,X86971.1",
        "Drosophila melanogaster(7227)": "NM_080120.3",
        "Homo sapiens(9606)": "NM_001126112.2",
        "Arabidopsis thaliana(3702)": "NM_111887.3",
      },
    };
  },
  validations: {
    from: {
      sequence: {
        maxLength: maxLength(5000),
      },
      organismName: {
        required,
      },
      ncbiAccessionInput: {
        required: function ncbiAccessionRequired(val) {
          if (this.from.exampleMethod == "true" && val == "") {
            return false;
          } else {
            return true;
          }
        },
      },
      sequence: {
        required: function sequenceRequired(val) {
          if (this.from.exampleMethod == "false" && val == "") {
            return false;
          } else {
            return true;
          }
        },
      },
      email: {
        email,
      },
    },
  },
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
