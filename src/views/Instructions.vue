<template>
  <div class="container">
    <v-row>
      <v-spacer />
      <v-col cols="6">
        <h4>ORFanID Operating Instructions</h4>
        <br/>
        <h5>ORFanID Sequence Submission</h5>
        <p>
          Visit the ORFanGenes website <a href="http://orfangenes.com"> (http://orfangenes.com/)</a> and click
          <Strong>Get Started</Strong> on the landing page.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/GetStarted.png"
        />
        <p>
         An ORFan analysis can be performed by providing either a DNA or protein sequence and the scientific name of the Organism.
        </p>
        <img
            class="materialboxed"
            width="650"
            src="../../public/assets/images/documentation/Input_options.png"
          />

        <p>
          The input DNA or protein sequences can be added in three ways: Search
          by Accession, FASTA File Upload, or Direct Input. Details on the Input
          sequences are below:
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/table.png"
        />
        <p style="text-align: justify">
          Next, the Organism Name of the input gene must be specified. The
          Organism can be specified using the auto-completion selection textbox
          (see the screenshot below). Start typing and auto-completion will help
          you select the organism quickly by showing the Scientific name, NCBI
          Taxonomy ID and an image. If the organism of interest is not in the
          ORFanID database, please go to NCBI Taxonomy Database and obtain the
          full scientific name and the taxonomy ID which has to be added within
          parentheses. Example Organism names are provided in the screenshot
          below.
        </p>
        <p>
          NOTE: The search engine will take UP TO 5,000 characters for a query
          on the Gene Sequence. Please DO NOT input more than 5,000 characters
          as your query will not be processed.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/3_organism_selection.png"
        />
        <p>
          Example sequences are provided to demonstrate the use of this ORFan
          identifying software engine. When a graphical icon at the bottom left
          of the screen is selected, the appropriate data will be automatically
          loaded into the forms. The “sequence” or the “accession” option can be
          selected.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/4_example.png"
        />
        <p>
          The search can be fine tuned using optional parameters by clicking on
          the "Advance Parameter" link. The following parameters can be adjusted
          according to the user preference:
        </p>
        <ol class="collapsible">
          <li>
            Maximum eValue for BLAST(e-10)
          </li>
          <li>
            Maximum number of target sequences for BLAST results
          </li>
          <li>
            Identity
          </li>
        </ol>

        <P
          >An example is provided below. In each case, the slider should be
          moved to set the appropriate value.</P
        >
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/5_advance_parameters.png"
        />
        <P
          >When either the gene sequence, or accession number, and the organism
          has been determined, click "submit" to start the ORFanID search.
        </P>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/6_Submit_Button.png"
        />
        <p>
          If you would like to double check–or modify–your search request,
          simply click on "cancel" to cancel the ORFanID search. Otherwise,
          click on "Submit" to start the ORFanID search.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/7_Confirm_Sequence_Submission.png"
        />
        <p>Next, click "Ok".</p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/8_Ok_Redirect.png"
        />
        <p>
          Upon clicking "Ok", you will be redirected to this status page.
          ORFanID will process the input sequence and depending on the query, as
          well as the workload of the ORFanID servers, you should expect a
          result within 5 minutes.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/9_Processing_Image.png"
        />
        <br/>
        <br/>
        <h5>Interpreting Results</h5>
        <p>
          To view the results of the ORFanID search, click on the "bar graph"
          button.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/10_Complete.png"
        />
        <p>Results will be displayed as in the screenshot below:</p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/11_result_page.png"
        />
        <p>
          The example shown above contains three genes. One of the sequences are
          Genus Restricted Genes, and the second and thrid are ORFan Genes. The
          BLAST Results table shows the taxonomies (and their parents) for each
          gene in the input sequence from the BLAST search. <br />
        </p>
        <p>
          A graphical representation of the taxonomy tree can be viewed by
          selecting the "graph" button for each sequence that is not an ORFan
          Gene.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/12_orfan_genes_table.png"
        />
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/13_Homology_Evidence.png"
        />
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/14_Graph.png"
        />
        <p>
          Results can be submitted to the “ORFanBase” database by providing the
          user contact information as follows:
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/15_save_results.png"
        />
        <p>
          The Results page displays previous ORFanID analyses stored in the
          database.
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/16_results_page.png"
        />
        <br/>
        <br/>
        <h5>The ORFanBase Database</h5>
        <p>
          Genes that have been categorized from the analysis and submitted to
          the “ORFanbase” database can be found on the “ORFanbase” page:
        </p>
        <img
          class="materialboxed"
          width="650"
          src="../../public/assets/images/documentation/17_result_page.png"
        />
        <p>
          The orphan gene information obtained can now be used for your research
          purposes. <br />
        </p>
        <p>
          If you have any questions regarding the instructions for using the
          ORFanID to search and find ORFan Genes of interest to you, or
          regarding the analysis of your data input, please email us at:
          info@orfangenes.com
        </p>
      </v-col>
      <v-spacer />
    </v-row>
    <!-- <div class="row">
      <div class="col s8 m9 l10">
        <div id="perform_analysis" class="section scrollspy"></div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>