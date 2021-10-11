<template>
     <div class="container">
         <div class="row">
            <h4>Comparative Genomic Studies of ORFan genes in Mammalian Genomes
            </h4>
        </div>

        <div class="row">
            <div class="col s6">
                <h5>Purpose</h5>
                <p>Investigate the function/s, if any, of the ORFan gene sequences identified in previous studies from the literature, with a special focus of Clamp at el study. However, the initial goal is to find out all the orphan genes of the human genome.</p>

                <h5>Methods</h5>
                <p>Human Genome GRCh38.p7 was used for the analysis. </p>

                <p>A bioinformatics pipeline was developed using R language with BiomaRt package to filter genes. BiomaRt is the official filtering tool to query ensemble databases. There were six main steps in the filtering process:
                <ol>
                    <li>Removal of Retrotransposons/Pseudogenes</li>
                    <li>Removal of orthologous genes with Dog</li>
                    <li>Removal of orthologous genes with Mouse</li>
                    <li>Removal of paralogous genes within Human</li>
                    <li>Removal of known pfam genes</li>
                    <li>Removal of genes that absent the protein sequence (i.e. non-coding genes)</li>
                </ol>
                </p>
            </div>
            <div class="col s6">
                <img src="../assets/images/Clamp.png" alt="Clamp method" height="50%" width="50%">
            </div>
        </div>
        <div class="row">
            <div class="col offset-s9 col s3">
                <button class="btn waves-effect waves-light" type="button" name="action" id="submit" v-on:click="ClampResults()">View Clamp Results
                    <i class="material-icons right">send</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  methods: {
    ClampResults() {
      this.$router.replace('/clampresults');
    },
  },
};

</script>
