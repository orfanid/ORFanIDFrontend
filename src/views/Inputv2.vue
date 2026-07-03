<template>
  <v-container class="query-container">
    <PageGuide
      description="This page lets you submit protein or gene sequences, accession numbers, organism details, and analysis parameters for ORFanID processing."
      :steps="[
        'Enter a real name or recognizable name so we can help you more easily if support or further explanation is needed.',
        'Choose whether to search by sequence or accession, or load one of the example datasets.',
        'Provide the sequence, upload a FASTA file, or enter NCBI or UniProt accession numbers.',
        'Select or enter the organism name in the required scientific name and taxonomy ID format.',
        'Adjust advanced parameters if needed, then submit the analysis.'
      ]"
    />
    <v-form @submit.prevent="submitFormConfirmation">
      <!-- Nickname -->
      <!-- <pre>{{ $v }}</pre> -->
      <v-row>
        <v-col cols="12" md="4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="Name / Nickname"
                required
                v-model="submiterNickname"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
              <!-- {{ !$v.submiterNickname.required }}
              {{ $v.submiterNickname.$dirty }} -->
            </template>
            <span>Please use a real name or recognizable name so we can help you more easily if something goes wrong or if you need further explanation.</span>
          </v-tooltip>
          <div class="nickname-help">
            Please enter a real name or recognizable name. This makes it easier for us to help if support or further explanation is needed.
          </div>
          <div
            class="error-message"
            v-if="!$v.submiterNickname.required && $v.submiterNickname.$dirty"
          >
            Please enter a name or nickname.
          </div>
        </v-col>
      </v-row>

      <!-- Search By -->
      <v-row>
        <v-col cols="s6" offset-s1>
          <v-container fluid class="d-flex align-center pl-0">
            <p class="mb-0 mr-2">Search By:</p>
            <v-radio-group row v-model="identifier" @change="identifierChanged" :disabled="useExampleData">
              <v-radio label="Sequence" value="sequence"></v-radio>
              <v-radio label="Accessions" value="accession"></v-radio>
            </v-radio-group>
          </v-container>
        </v-col>

        <!-- Examples -->
        <v-col cols="s6">
          <v-col cols="12">
            <v-switch
              v-model="useExampleData"
              label="Use Example Data"
              color="teal"
              class="mb-2"
              @change="exampleDataChanged"
            ></v-switch>
            <div :class="{ 'disabled-area': !useExampleData }">
              <h6>Examples</h6>
              <v-tooltip bottom v-for="example in examples" :key="example.label">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    size="72"
                    color="green darken-2"
                    :class="['icon', 'icon-species', 'pa-4', 'icon-' + example.icon]"
                    v-on:click="loadExampleData(example.taxonomyName)"
                    v-bind="attrs"
                    v-on="on"
                  ></v-icon>
                </template>
                <span>{{ example.name }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-col>
      </v-row>

      <!-- Upload File -->
      <v-row>
        <v-col cols="12" md="4" offset-s1>
          <v-row>
            <v-col cols="12">
              <v-file-input
                placeholder="Upload your documents"
                label="Upload File"
                prepend-icon="mdi-cloud-upload"
                :disabled="identifier == 'accession'"
                v-model="uploadedSequenceFile"
                @change="readUploadedFile"
                @click:clear="clearUploadedFile"
                v-bind="attrs"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-col>

        <!-- Radio Group -->
        <v-col cols="12" md="2">
          <v-radio-group mandatory v-model="dna_sequence" @change="changeAccessionType" :disabled="useExampleData">
            <v-radio label="Protein" value="protein"></v-radio>
            <v-radio label="Gene" value="nucleotide"></v-radio>
          </v-radio-group>
        </v-col>

        <!-- NCBI or Uniprot Accessions -->
        <v-col cols="12" md="6" v-if="identifier == 'accession'">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="NCBIAccession"
                label="NCBI or Uniprot Accession(s)"
                v-bind="attrs"
                v-on="on"
                @click:append-outer="showAccessionSearchDialogHandler"
                :append-outer-icon="'mdi-store-search-outline'"
                :disabled="useExampleData"
              ></v-text-field>
              <v-dialog max-width="800" v-model="showAccessionSearchDialog">
                <v-card>
                  <v-card-title class="text-h5">
                    NCBI or Uniprot Accession(s) Lookup
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Protein / Gene Name"
                          v-model="geneNameForAccessionSearch"
                          :append-outer-icon="'mdi-store-search-outline'"
                          @click:append-outer="accessionSearchHandler"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-list dense style="height:200px; overflow-y:auto">
                          <v-list-item-group color="primary">
                            <v-list-item
                              v-for="(item, i) in accessionSearchResult &&
                              accessionSearchResult.accessionList
                                ? accessionSearchResult.accessionList
                                : []"
                              :key="i"
                            >
                              <v-list-item-action>
                                <v-checkbox
                                  v-model="item.selected"
                                  true-value="true"
                                  false-value="false"
                                ></v-checkbox>
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
                    <v-btn color="green darken-1" text @click="accesionLookupCloseHandler">
                      Close
                    </v-btn>
                    <v-btn color="green darken-1" text @click="applySelectedAccesion">
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <span>NCBI/Uniprot accession. Multiple accessions should be separated by comma(s)</span>
          </v-tooltip>
          <div class="error-message" v-if="!$v.NCBIAccession.required && $v.NCBIAccession.$dirty">
            Please enter Accession(s)
          </div>

          <!-- Invalid Accession -->
          <v-chip class="ma-n3 float-right" x-small>/100</v-chip>
          <v-card class="accession-help-card" outlined>
            <div class="accession-help-header">
              <v-icon color="teal" class="mr-2">mdi-compass-outline</v-icon>
              <div>
                <h6>Need help finding accession numbers?</h6>
                <p>
                  Use these NCBI resources to search by organism, gene name,
                  accession, species assembly, or taxonomy ID.
                </p>
              </div>
            </div>

            <div class="accession-resource-grid">
              <a
                class="accession-resource"
                href="https://www.ncbi.nlm.nih.gov/nuccore/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon color="teal">mdi-dna</v-icon>
                <span>
                  <strong>Nucleotide</strong>
                  <small>GenBank / RefSeq</small>
                </span>
              </a>
              <a
                class="accession-resource"
                href="https://www.ncbi.nlm.nih.gov/protein/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon color="teal">mdi-alpha-p-circle-outline</v-icon>
                <span>
                  <strong>Protein</strong>
                  <small>NP_ accessions</small>
                </span>
              </a>
              <a
                class="accession-resource"
                href="https://www.ncbi.nlm.nih.gov/datasets/genome/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon color="teal">mdi-database-search</v-icon>
                <span>
                  <strong>Genome Assembly</strong>
                  <small>Reference assemblies</small>
                </span>
              </a>
              <a
                class="accession-resource"
                href="https://www.ncbi.nlm.nih.gov/taxonomy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon color="teal">mdi-file-tree-outline</v-icon>
                <span>
                  <strong>NCBI Taxonomy</strong>
                  <small>Taxon IDs</small>
                </span>
              </a>
            </div>

            <div class="accession-format-panel">
              <div class="accession-format-title">Accession formats to know</div>
              <div class="accession-format-list">
                <v-chip small class="format-chip">
                  NC_ complete genomic reference
                </v-chip>
                <v-chip small class="format-chip">
                  NM_ mRNA / transcript
                </v-chip>
                <v-chip small class="format-chip">NP_ protein</v-chip>
                <v-chip small class="format-chip">
                  WP_ prokaryote protein
                </v-chip>
              </div>
              <p>
                For ORFan mining, complete genomic reference accessions such as
                <strong>NC_</strong> chromosomes or plasmids are often the most
                useful.
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Program Selection -->
      <v-row v-if="dna_sequence == 'protein'">
        <v-col>
          <v-row>
            <v-col cols="6">
              <div>
                <h6>Program Selection</h6>
                <v-radio-group mandatory v-model="program">
                  <!-- <v-radio
                    label="PSI-BLAST (Position-Specific Iterated BLAST)"
                    value="PSI-BLAST"
                  ></v-radio> -->
                  <v-radio label="BLAST" value="BLAST"></v-radio>
                  <v-radio label="DIAMOND" value="DIAMOND"></v-radio>
                </v-radio-group>
              </div>
            </v-col>

            <!-- Number of iterations -->
            <!-- <v-col cols="6">
              <v-select
                label="Number of iterations"
                :items="num_iterations"
                item-text="text"
                item-value="value"
                v-model="num_iteration"
              ></v-select>
            </v-col> -->
          </v-row>
        </v-col>
      </v-row>

      <!-- Gene Sequence -->
      <v-row v-if="identifier == 'sequence'">
        <v-col cols="12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-textarea
                :label="dna_sequence == 'nucleotide' ? 'Gene Sequence' : 'Protein Sequence'"
                v-bind="attrs"
                v-on="on"
                v-model="sequence"
              ></v-textarea>
            </template>
            <span
              >Enter query sequence(s) in the text area. It strictly follows FASTA file format.
              Multiple sequence can be separated by new line</span
            >
          </v-tooltip>
          <div class="error-message" v-if="!$v.sequence.required && $v.sequence.$dirty">
            Please enter Sequence.
          </div>
          <div class="error-message" v-if="!$v.sequence.maxLength && $v.sequence.$dirty">
            Sequence can only have a maximum of 5000 characters.
          </div>
          <div
            v-for="message in visibleSequenceValidationErrors"
            :key="message"
            class="error-message"
          >
            {{ message }}
          </div>
          <v-alert
            v-if="visibleSequenceValidationWarnings.length"
            dense
            text
            type="warning"
            class="sequence-validation-alert"
          >
            <div
              v-for="message in visibleSequenceValidationWarnings"
              :key="message"
              class="sequence-validation-message"
            >
              {{ message }}
            </div>
          </v-alert>
          <v-chip class="ma-n3 float-right" x-small>{{ sequence.length }}/5000</v-chip>
        </v-col>
      </v-row>

      <!-- Organism -->
      <v-row>
        <v-col cols="12">
          <v-radio-group mandatory v-model="organismInputType">
            <v-radio label="Select Organism Name from list" value="dropdown"></v-radio>
            <v-radio label="Enter Organism Name" value="textfield"></v-radio>
          </v-radio-group>
          <v-autocomplete
            v-if="organismInputType == 'dropdown'"
            v-model="organismName"
            :items="organismList"
            label="Organism"
            item-text="name"
            item-value="name"
            v-bind="attrs"
            :disabled="useExampleData"
          >
            <template v-slot:item="data">
              <v-list-item-avatar>
                <img
                  :src="data.item.img"
                  onerror="javascript:this.src='https://dummyimage.com/60x40/c7abc7/1721a6.png&text=Organism'"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            label="Organism"
            v-model="organismName"
            v-else
            @blur="reformatOrganismName(organismName)"
            :disabled="useExampleData"
          ></v-text-field>
          <label style="color: red"></label>
          <div class="error-message" v-if="!$v.organismName.required && $v.organismName.$dirty">
            Please enter Organism Name
          </div>
          <div
            class="error-message"
            v-if="!$v.organismName.nameFormat && $v.organismName.$dirty && $v.organismName.$model"
          >
            The format entered for the organism name is incorrect. Please enter the Organism Name as
            follows: "organism name (tax id)"
          </div>
          <!-- <pre>{{ $v }}</pre> -->
        </v-col>
      </v-row>

      <!-- Advanced Parameters -->
      <v-row>
        <v-col cols="s12" class="d-flex align-center">
          <v-expansion-panels flat class="pa-0">
            <v-expansion-panel class="pa-0">
              <v-expansion-panel-header class="pa-0">
                <v-spacer />
                <v-col cols="6" md="2">Advanced Parameters:</v-col>
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
                    :thumb-size="36"
                    thumb-label="always"
                    v-model="maxEvalue"
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
                    v-model="maxTargetSequence"
                    :thumb-size="36"
                    thumb-label="always"
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
                    v-model="identity"
                    :thumb-size="36"
                    thumb-label="always"
                    ticks
                    color="teal"
                  ></v-slider>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row justify="space-around">
        <v-spacer />
      </v-row>

      <!-- Submit Button -->
      <v-row>
        <v-col cols="10"></v-col>
        <v-col cols="2">
          <v-btn style="color: white" color="teal" type="submit"
            >Submit<v-icon text color="white" right dark class="mdiChevronDoubleRight"
              >mdi-send</v-icon
            ></v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <!-- ORFanID Dialog -->
    <v-dialog width="800" height="200" overlay-color="#506c87" v-model="showSubmissionConfirmation">
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span style="color: white">ORFanID</span>
        </v-card-title>

        <v-card-text>
          <div class="pa-3">
            <h5><center>Please Confirm Sequence Submission</center></h5>
            <v-alert
              v-if="sequenceValidationWarnings.length"
              dense
              text
              type="warning"
              class="mt-4 mb-0"
            >
              <div class="font-weight-bold mb-1">Please review before submitting:</div>
              <div
                v-for="message in sequenceValidationWarnings"
                :key="message"
                class="sequence-validation-message"
              >
                {{ message }}
              </div>
            </v-alert>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showSubmissionConfirmation = false">Cancel</v-btn>
          <v-btn color="primary" text @click="submitAnalysData"><span>Submit</span></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import analysis from "@/api/analysis";
import { getAccessionESearch } from "@/api/accessionSearch";
import lodash from "lodash";
export default {
  name: "Input",
  metaInfo: {
    title: 'New Query | ORFanID',
    meta: [
      { name: 'description', content: 'Submit protein or gene sequences for ORFanID analysis.' }
    ]
  },
  data() {
    return {
      dna_sequence: "protein", // protein or nucleotide
      identifier: "accession", // sequence or accession
      organismList: [],
      organismInputType: "", // dropdown or textfield,
      program: "PSI-BLAST", // PSI-BLAST, BLAST, DIAMOND,
      organismSelectionType: "dropdown", // dropdown or textfield,
      useExampleData: false, // Use Example Data
      attrs: {},
      submiterNickname: "",
      NCBIAccession: "",
      sequence: "",
      sequenceValidationAttempted: false,
      organismName: "",
      showSubmissionConfirmation: false,
      uploadedSequenceFile: null,
      uploadedSequenceFileContent: "",
      maxEvalue: 3,
      maxTargetSequence: 550,
      identity: 60,
      num_iteration: 3,
      showAccessionSearchDialog: false,
      geneNameForAccessionSearch: "",
      accessionSearchResult: {
        idList: [],
        resultSummary: [],
        accessionList: []
      },
      examples: [
        { name: "Homo sapiens", icon: "human", taxonomyName: "Homo sapiens(9606)" },
        {
          name: "Drosophila melanogaster",
          icon: "fly",
          taxonomyName: "Drosophila melanogaster(7227)"
        },
        { name: "Escherichia coli", icon: "ecoli", taxonomyName: "Escherichia coli(562)" },
        {
          name: "Arabidopsis thaliana",
          icon: "brassica",
          taxonomyName: "Arabidopsis thaliana(3702)"
        }
      ],
      num_iterations: [
        { text: "0", value: 0 },
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 }
      ],
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
      }
    };
  },
  computed: {
    sequenceValidation() {
      return this.validateSequenceInput();
    },
    sequenceValidationErrors() {
      return this.sequenceValidation.errors;
    },
    sequenceValidationWarnings() {
      return this.sequenceValidation.warnings;
    },
    visibleSequenceValidationErrors() {
      if (this.identifier !== "sequence" || !this.shouldShowSequenceValidation) {
        return [];
      }
      return this.sequenceValidationErrors;
    },
    visibleSequenceValidationWarnings() {
      if (this.identifier !== "sequence" || !this.shouldShowSequenceValidation) {
        return [];
      }
      return this.sequenceValidationWarnings;
    },
    shouldShowSequenceValidation() {
      return Boolean(this.sequenceValidationAttempted || this.sequence);
    }
  },
  methods: {
    getOrganismList() {
      let that = this;
      analysis.getOrganismList().then(response => {
        Object.entries(response.data).forEach(element => {
          that.organismList.push({
            name: element[0],
            img: element[1]
          });
        });
        console.log("that.organismList", that.organismList);
      });
    },
    clearAccessionSequenceAndOrganism() {
      this.NCBIAccession = "";
      this.sequence = "";
      this.organismName = "";
      console.log("Clear NCBIAccession Sequence OrganismName");
    },
    remove_linebreaks(str) {
      return str.replace(/[\r]+/gm, "");
    },
    parseSequenceInput(value) {
      const raw = value || "";
      const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
      const result = {
        hasFastaHeaders: normalized.includes(">"),
        records: [],
        errors: []
      };

      if (!normalized) {
        return result;
      }

      if (!result.hasFastaHeaders) {
        result.records.push({
          header: "",
          sequence: normalized.replace(/\s+/g, "").toUpperCase()
        });
        return result;
      }

      const lines = normalized.split("\n");
      let currentRecord = null;
      let sequenceLines = [];

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          return;
        }
        if (trimmedLine.startsWith(">")) {
          if (currentRecord) {
            currentRecord.sequence = sequenceLines.join("").replace(/\s+/g, "").toUpperCase();
            result.records.push(currentRecord);
          }
          const header = trimmedLine.substring(1).trim();
          if (!header) {
            result.errors.push("FASTA headers must include an identifier after the > symbol.");
          }
          currentRecord = { header, sequence: "" };
          sequenceLines = [];
        } else if (currentRecord) {
          sequenceLines.push(trimmedLine);
        } else {
          result.errors.push("FASTA sequence lines must appear after a header line beginning with >.");
        }
      });

      if (currentRecord) {
        currentRecord.sequence = sequenceLines.join("").replace(/\s+/g, "").toUpperCase();
        result.records.push(currentRecord);
      }

      result.records.forEach((record, index) => {
        if (!record.sequence) {
          result.errors.push(`Sequence ${index + 1} is missing sequence characters.`);
        }
      });

      return result;
    },
    validateSequenceInput() {
      const errors = [];
      const warnings = [];

      if (this.identifier !== "sequence" || !this.sequence) {
        return { errors, warnings };
      }

      const parsedInput = this.parseSequenceInput(this.sequence);
      errors.push(...parsedInput.errors);

      const isProtein = this.dna_sequence === "protein";
      const allowedProteinPattern = /^[ACDEFGHIKLMNPQRSTVWYBXZUOJ*]+$/i;
      const allowedNucleotidePattern = /^[ACGTUNRYKMSWBDHV]+$/i;
      const nucleotideOnlyPattern = /^[ACGTUN]+$/i;
      const proteinOnlyCharacterPattern = /[EFILPQXZJO]/i;
      const proteinAccessionPattern = /\b(?:NP|XP|YP|WP|AP|AAI|CAA|AAB)_[A-Z0-9.]+|\b[A-Z]{3}\d{5,}(?:\.\d+)?\b/i;
      const nucleotideAccessionPattern = /\b(?:NC|NM|NZ|XM|XR|NR|NG|NW)_[A-Z0-9.]+/i;
      const selectedOrganismName = this.extractOrganismName(this.organismName);

      parsedInput.records.forEach((record, index) => {
        const label = parsedInput.records.length > 1 ? `Sequence ${index + 1}` : "Sequence";
        const sequence = record.sequence;

        if (!sequence) {
          return;
        }

        const isValidForSelectedType = isProtein
          ? allowedProteinPattern.test(sequence)
          : allowedNucleotidePattern.test(sequence);

        if (!isValidForSelectedType) {
          const invalidCharacters = this.getInvalidSequenceCharacters(
            sequence,
            isProtein ? allowedProteinPattern : allowedNucleotidePattern
          );
          errors.push(
            `${label} contains characters that are not valid for ${
              isProtein ? "protein" : "gene/nucleotide"
            } input: ${invalidCharacters.join(", ")}.`
          );
        }

        if (!isProtein && proteinOnlyCharacterPattern.test(sequence)) {
          errors.push(
            `${label} looks like a protein sequence, but Gene was selected. Please choose Protein or enter a nucleotide sequence.`
          );
        }

        if (isProtein && nucleotideOnlyPattern.test(sequence) && sequence.length >= 30) {
          warnings.push(
            `${label} only contains nucleotide letters. Please confirm Protein is the correct sequence type.`
          );
        }

        if (isProtein && sequence.length < 30) {
          warnings.push(
            `${label} is very short (${sequence.length} aa). Short peptides can produce limited BLAST evidence and may classify as strict ORFan.`
          );
        }

        if (!isProtein && sequence.length < 90) {
          warnings.push(
            `${label} is short (${sequence.length} bp). Please confirm this is the intended nucleotide sequence.`
          );
        }

        if (record.header) {
          if (isProtein && nucleotideAccessionPattern.test(record.header)) {
            warnings.push(
              `${label} header looks like a nucleotide accession, but Protein was selected.`
            );
          }
          if (!isProtein && proteinAccessionPattern.test(record.header)) {
            warnings.push(`${label} header looks like a protein accession, but Gene was selected.`);
          }
          const headerOrganism = this.extractBracketedOrganism(record.header);
          if (
            headerOrganism &&
            selectedOrganismName &&
            !this.organismNamesMatch(headerOrganism, selectedOrganismName)
          ) {
            warnings.push(
              `${label} header mentions ${headerOrganism}, but the selected organism is ${selectedOrganismName}.`
            );
          }
        }
      });

      return {
        errors: [...new Set(errors)],
        warnings: [...new Set(warnings)]
      };
    },
    getInvalidSequenceCharacters(sequence, allowedPattern) {
      return [...new Set(sequence.split("").filter(character => !allowedPattern.test(character)))];
    },
    extractOrganismName(value) {
      if (!value) {
        return "";
      }
      return value
        .replace(/\(\s*\d+\s*\)/g, "")
        .trim()
        .toLowerCase();
    },
    extractBracketedOrganism(header) {
      const matches = header.match(/\[([A-Z][a-z]+(?:\s+[a-z][a-z.-]+)+)\]/);
      return matches ? matches[1].trim().toLowerCase() : "";
    },
    organismNamesMatch(headerOrganism, selectedOrganism) {
      return headerOrganism === selectedOrganism || headerOrganism.includes(selectedOrganism);
    },
    formatSequenceForSubmission() {
      const parsedInput = this.parseSequenceInput(this.sequence);
      if (!parsedInput.hasFastaHeaders) {
        return parsedInput.records.length ? parsedInput.records[0].sequence : this.sequence;
      }
      return parsedInput.records
        .map(record => `>${record.header}\n${record.sequence}`)
        .join("\n");
    },
    identifierChanged() {
      console.log("Radio Button Group Changed");
      this.sequenceValidationAttempted = false;
      this.clearAccessionSequenceAndOrganism();
    },
    loadExampleData(_exampleName) {
      if (this.identifier === "accession") {
        if (this.dna_sequence === "protein") {
          this.NCBIAccession = this.exampleProteinDataValues[_exampleName];
        } else {
          this.NCBIAccession = this.exampleNucleotideDataValues[_exampleName];
        }
      } else {
        let that = this;
        let url = `/data/example-${this.dna_sequence}-${_exampleName}.fasta`;
        $.get(url, data => {
          that.sequence = that.remove_linebreaks(data);
        });
      }
      this.organismName = _exampleName;
    },
    submitFormConfirmation() {
      console.log("Submit Form");
      this.sequenceValidationAttempted = true;
      this.$v.$touch();
      if (!this.$v.$invalid && this.sequenceValidationErrors.length === 0) {
        this.showSubmissionConfirmation = true;
      }
    },
    reformatOrganismName(input) {
      const pattern = /(\b\w+\b)\s*\(\s*(\d+)\s*\)/g;
      let text = input.replace(pattern, "$1($2)");
      this.organismName = text;
    },
    submitAnalysData() {
      console.log("Submit Analysis Data");
      this.showSubmissionConfirmation = false;
      var requestInfo = {
        accession: this.NCBIAccession,
        accessionType: this.dna_sequence,
        identity: this.identity,
        maxEvalue: this.maxEvalue,
        maxTargetSequence: this.maxTargetSequence,
        organismName: this.organismName,
        sequence: this.identifier === "sequence" ? this.formatSequenceForSubmission() : this.sequence,
        email: this.submiterNickname,
        isPsiBlast: this.program == "PSI-BLAST" ? true : false,
        num_iteration: parseInt(this.num_iteration),
        executionType: this.program == "DIAMOND" ? "diamond" : "blast"
      };
      console.log("Request Info", requestInfo);
      analysis
        .analyse(requestInfo)
        .then(response => {
          console.log(response);
          this.$router.push("results");
        })
        .catch(error => {
          console.log(error);
        });
    },
    readUploadedFile(event) {
      if (!this.uploadedSequenceFile) {
        this.uploadedSequenceFile = "No File Chosen";
      }
      var reader = new FileReader();

      reader.readAsText(this.uploadedSequenceFile);
      reader.onload = () => {
        this.uploadedSequenceFileContent = reader.result;
        this.sequence = reader.result;
      };
    },
    clearUploadedFile() {
      if (this.uploadedSequenceFileContent == this.sequence) {
        this.sequence = "";
      }
      this.uploadedSequenceFile = null;
      this.uploadedSequenceFileContent = "";
    },
    showAccessionSearchDialogHandler() {
      console.log("Accession Search Handler");
      this.showAccessionSearchDialog = true;
    },
    accessionSearchHandler() {
      console.log("Accession Search Handler");
      let db="";
      if (this.dna_sequence === "protein") {
        db = "protein";
      } else {
        db = "gene";
      }
      if (this.geneNameForAccessionSearch.length > 0) {
        console.log("Gene Name for Accession Search:", this.geneNameForAccessionSearch);
        this.getAccessionSearchHandler(db);
      }
    },
    accesionLookupCloseHandler() {
      console.log("Accession Lookup Close Handler");
      this.showAccessionSearchDialog = false;
    },
    getAccessionSearchHandler(db) {
      console.log("Accession Search Handler");
      this.$Progress.start();
      // Start the progress bar
      getAccessionESearch(this.accessionSearchResult, this.geneNameForAccessionSearch, db)
        .then(response => {
          console.log("Result of Accession Search", response);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    applySelectedAccesion() {
      console.log("Apply Selected Accession");
      var selectedAccessions = lodash.filter(this.accessionSearchResult.accessionList, {
        selected: "true"
      });
      console.log("Selected Accessions ", selectedAccessions);
      var accessionsArray = lodash.map(selectedAccessions, "text");
      if (accessionsArray != null && accessionsArray.length > 0) {
        this.NCBIAccession = accessionsArray.toString();
      }
      this.showAccessionSearchDialog = false;
    },
    changeAccessionType() {
      console.log("Reset Sequence");
      this.sequenceValidationAttempted = false;
      this.sequence = "";
      this.NCBIAccession = "";
      this.accessionSearchResult.idList.length = 0;
      this.accessionSearchResult.resultSummary.length = 0;
      this.accessionSearchResult.accessionList.length = 0;

    },
    exampleDataChanged() {
      console.log("Example Data Changed");
      if (this.useExampleData) {
        this.identifier == "accession";
        this.dna_sequence == "protein";
      }else {
      }
      this.clearAccessionSequenceAndOrganism();
    }
  },
  validations: {
    NCBIAccession: {
      required: requiredIf(function(accession) {
        return this.identifier === "accession";
      })
    },
    sequence: {
      required: requiredIf(function(accession) {
        return this.identifier === "sequence";
      }),
      maxLength: maxLength(5000)
    },
    organismName: {
      required: required,
      nameFormat: value => /^^\w+(?:\s+\w+)*\(\d+\)$/.test(value)
    },
    submiterNickname: { required }
  },
  mounted() {
    this.getOrganismList();
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

/* CSS class for error message */
.error-message {
  color: red; /* Red color for error message */
  animation: fadeInRed 0.5s ease; /* Animation for fading in */
}

.sequence-validation-alert {
  margin-top: 18px;
}

.sequence-validation-message {
  line-height: 1.45;
  margin-bottom: 4px;
}

/* Keyframes for animation */
@keyframes fadeInRed {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.disabled-area {
  pointer-events: none; /* Prevents clicking on the area */
  opacity: 0.5; /* Makes the area look faded out */
}

.nickname-help {
  color: #555;
  font-size: 0.85rem;
  line-height: 1.35;
  margin-top: -12px;
}

.accession-help-card {
  background: #f8fbfa;
  border-color: #d7ebe7 !important;
  border-radius: 8px;
  margin-top: 24px;
  padding: 16px;
}

.accession-help-header {
  align-items: flex-start;
  display: flex;
  margin-bottom: 14px;
}

.accession-help-header h6 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.accession-help-header p,
.accession-format-panel p {
  color: #546662;
  font-size: 0.88rem;
  line-height: 1.45;
  margin: 0;
}

.accession-resource-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 14px;
}

.accession-resource {
  align-items: center;
  background: white;
  border: 1px solid #dcebe8;
  border-radius: 8px;
  color: #263330;
  display: flex;
  gap: 10px;
  padding: 10px;
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.accession-resource:hover {
  border-color: #009688;
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.12);
}

.accession-resource strong,
.accession-resource small {
  display: block;
}

.accession-resource small {
  color: #607d78;
  font-size: 0.76rem;
}

.accession-format-panel {
  border-top: 1px solid #dcebe8;
  padding-top: 12px;
}

.accession-format-title {
  color: #00796b;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.accession-format-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.format-chip {
  background: #e0f2ef !important;
  color: #00695c !important;
  font-weight: 600;
}

@media (max-width: 960px) {
  .accession-resource-grid {
    grid-template-columns: 1fr;
  }
}

</style>
