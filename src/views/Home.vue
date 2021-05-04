<template>
  <div class="container">
    <!--      id="input_form"
      action="/analyse"
      th:action="@{/analyse}"
      th:object="${sequence}"
      method="post" -->
    <form id="input_form" @submit="saveData">
      <div class="row">
        <div class="col s4 offset-s1">
          <div class="file-field input-field">
            <div class="btn">
              <input
                id="fastafile"
                type="file"
                accept=".fasta"
                onchange="setFileContent(this.value);"
              />
              <i class="large material-icons" style="height: 50px; width: 50px"
                >cloud_upload</i
              >
            </div>
            <div class="file-path-wrapper">
              <input
                class="file-path validate"
                id="fastaFileName"
                type="text"
                placeholder="Upload file"
              />
            </div>
          </div>
        </div>
        <div class="col s1">
          <div class="row">
            <div class="col s10">
              <div>
                <p>
                  <label>
                    <input
                      class="with-gap"
                      name="accessionType"
                      type="radio"
                      value="protein"
                      v-model="from.accessionType"
                      checked
                    />
                    <span>Protein</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      class="with-gap"
                      name="accessionType"
                      type="radio"
                      value="nucleotide"
                      v-model="from.accessionType"
                    />
                    <span>Gene</span>
                  </label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col s5">
          <div class="row">
            <div class="col s10">
              <div class="input-field">
                <input
                  id="ncbi_accession_input"
                  class="validate"
                  name="accession"
                  type="text"
                  data-length="100"
                  v-model="from.ncbiAccessionInput"
                  ref="ncbiAccessionInput"
                />
                <label for="ncbi_accession_input"
                  >NCBI or Uniprot Accession(s) seperated by comma</label
                >
                <span
                  id="ncbi_accession_input_helper"
                  class="helper-text"
                  style="font-size: small; color: #818181"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col offset-s1 s10">
          <div class="input-field">
            <TextareaAutosize
              id="sequence"
              name="sequence"
              class="materialize-textarea validate"
              raw="5"
              data-length="10000"
              style="overflow-y: scroll"
              v-model="from.sequence"
              ref="sequence"
            ></TextareaAutosize>
            <label for="sequence">Gene Sequence</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s10 offset-s1">
          <div class="row">
            <div class="input-field col s12">
              <input
                type="text"
                id="organism"
                name="organism"
                class="autocomplete validate"
                required="required"
                v-model="from.organism"
                ref="organism"
              />
              <label for="organism">Organism</label>
            </div>
          </div>
        </div>
        <div id="organismIcon" class="col s1"></div>
      </div>

      <div
        class="row v-fade"
        id="advanceparameterssection"
        v-show="toggleAdvanceparameters"
      >
        <div
          class="col offset-s1 s10"
          v-bind:class="{ hidden: !toggleAdvanceparameters }"
        >
          <h6>Advanced parameters:</h6>
          <br />
          <p class="range-field">
            <label for="maxevalue"
              >Maximum
              <a
                href="https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=FAQ"
                >E-value</a
              >
              for BLAST(e-10):</label
            >
            <input
              type="range"
              id="maxevalue"
              name="maxEvalue"
              min="1"
              max="10"
              value="3"
              v-model="from.maxEvalue"
            />
            <label for="maxtargets">Maximum target sequences for BLAST:</label>
            <input
              type="range"
              id="maxtargets"
              name="maxTargetSequence"
              min="100"
              max="1000"
              value=""
              v-model="from.maxTargetSequence"
            /><!--{{Config::get('orfanid.default_maxtargetseq')}} -->
            <label for="identity">Identity:</label>
            <input
              type="range"
              id="identity"
              name="identity"
              min="60"
              max="100"
              value="60"
              v-model="from.identity"
            />
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col offset-s1 s8">
          <div class="switch">
            <p>Try out by:</p>
            <label>
              sequence
              <input
                id="example_method"
                type="checkbox"
                v-model="from.exampleMethod"
              />
              <span class="lever"></span>
              accessions
            </label>
          </div>
          <a
            id="load-ecoli-example-data"
            class="waves-effect waves-light tooltipped load-example-data"
            name="Escherichia coli(562)"
            data-position="bottom"
            data-tooltip="Escherichia coli"
            v-on:click="loadExampleData('Escherichia coli(562)')"
          >
            <i class="icon medium icon-species icon-ecoli"></i> </a
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            id="load-fly-example-data"
            class="waves-effect waves-light tooltipped load-example-data"
            name="Drosophila melanogaster(7227)"
            data-position="bottom"
            data-tooltip="Drosophila melanogaster"
            v-on:click="loadExampleData('Drosophila melanogaster(7227)')"
          >
            <i class="icon medium icon-species icon-fly"></i> </a
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            id="load-human-example-data"
            class="waves-effect waves-light tooltipped load-example-data"
            name="Homo sapiens(9606)"
            data-position="bottom"
            data-tooltip="Homo sapiens"
            v-on:click="loadExampleData('Homo sapiens(9606)')"
          >
            <i class="icon medium icon-species icon-human"></i> </a
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            id="load-thaliana-example-data"
            class="waves-effect waves-light tooltipped load-example-data"
            name="Arabidopsis thaliana(3702)"
            data-position="bottom"
            data-tooltip="Arabidopsis thaliana"
            v-on:click="loadExampleData('Arabidopsis thaliana(3702)')"
          >
            <i class="icon medium icon-species icon-brassica"></i> </a
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <br />
        </div>
        <div class="col s3">
          <a
            id="advanceparameterslink"
            class="waves-effect waves-light"
            v-on:click="toggleAdvanceparameters = !toggleAdvanceparameters"
            ><i class="small material-icons">add</i>Advanced parameters</a
          >
        </div>
      </div>

      <div
        id="input_progressbar"
        class="modal"
        style="background-color: #f6f7f9"
      >
        <div class="modal-content">
          <h6>ORFanID In Progress....</h6>
          <div class="progress">
            <div cl ass="indeterminate"></div>
          </div>
          <div class="row">
            <div class="col s12" style="margin-top: 40px">
              <div class="col offset-s3 s1">
                <img src="assets/images/loading4.gif" alt="progressbar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col offset-s10 s2">
          <button
            class="btn waves-effect waves-light"
            type="submit"
            name="action"
            id="submit"
          >
            Submit
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </form>
    <div class="vld-parent">
      <Loading
        :active.sync="isLoading"
        :can-cancel="true"
        :on-cancel="onCancel"
        :is-full-page="fullPage"
      ></Loading>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import analysis from '@/api/analysis';
import Loading from 'vue-loading-overlay';

export default {
  name: 'Home',
  components: { Loading },
  methods: {
    loadExampleData(_exampleName) {
      this.from.exampleName = _exampleName;
      let url = '';
      if (this.from.exampleMethod === true) {
        this.$refs.ncbiAccessionInput.$el.focus();
        if (this.from.accessionType === 'protein') {
          this.from.ncbiAccessionInput = this.exampleProteinDataValues[
            this.from.exampleName
          ];
        } else {
          this.from.ncbiAccessionInput = this.exampleNucliotideDataValues[
            this.from.exampleName
          ];
        }
        this.from.sequence = '';
      } else {
        url = `/data/example-${this.from.accessionType}-${this.from.exampleName}.fasta`;
        $.get(url, (data) => {
          this.from.sequence = data;
          this.$refs.sequence.$el.focus();
        });
        this.from.ncbiAccessionInput = '';
      }
      this.from.organism = this.from.exampleName;
      this.$refs.organism.$el.focus();
    },
    saveData(e) {
      console.log(this.from);

      this.isLoading = true;
      e.preventDefault();

      // validate/accessions
      // TODO

      // analyse
      analysis
        .saveAnalysis(this.from)
        .then((response) => {
          this.data = response.data;
          this.isLoading = false;
          this.$router.push('result');
          // this.$router.push({ name: `result?analysisId=${from.analysisId}` });
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          // reject(error);
        });
    },
    onCancel() {
      console.log('a');
    },
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      toggleAdvanceparameters: false,
      from: {
        analysisId: new Date().toJSON().replace(/-/g, '/'),
        exampleName: '',
        accessionType: 'protein',
        ncbiAccessionInput: '',
        exampleMethod: false,
        sequence: '',
        organism: '',
        maxEvalue: 3,
        maxTargetSequence: 550,
        identity: 60,
      },
      exampleProteinDataValues: {
        'Escherichia coli(562)': 'NP_415100.1,YP_002791247.1,NP_414542.1',
        'Drosophila melanogaster(7227)': 'NP_524859.2',
        'Homo sapiens(9606)': 'NP_001119584.1',
        'Arabidopsis thaliana(3702)': 'NP_187663.1',
      },
      exampleNucliotideDataValues: {
        'Escherichia coli(562)': 'NZ_JAACYZ010000241.1,X86971.1',
        'Drosophila melanogaster(7227)': 'NM_080120.3',
        'Homo sapiens(9606)': 'NM_001126112.2',
        'Arabidopsis thaliana(3702)': 'NM_111887.3',
      },
    };
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
</style>
<!--export default class Home extends Vue {}-->
