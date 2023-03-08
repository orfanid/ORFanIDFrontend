<template>
  <div class="container instructions-container">
    <v-row>
      <v-spacer />
      <v-col cols="10">
        <h4 class="text-center">ORFanID Operating Instructions</h4>
        <br />
        <h5 class="">ORFanID Sequence Submission</h5>
        <p>
          Follow the instruction given below to successfully submit a sequence by yourself
        </p>
        <ol start="1">
          <li>
            <div class="d-flex">
              <div class="step-title">Visit the OrFanGenes website</div> 
               <span class="ml-2">
                (<a href="http://orfangenes.com">http://orfangenes.com/</a>)
               </span>
            </div>
          </li>
          <li>
            <div>
              <div class="step-title">Click on the "Get Started" button on the home page.</div>
              <img
                src="../../public/assets/images/documentation/image_1.png"
              />
              <p>
                Provide a DNA or protein sequence and the scientific name of the organism to perform an OrFan analysis.
              </p>
            </div>
          </li>
          <li>
            <div class="step-title">DNA or protein sequences can be added in three different ways:</div>
            <div>
              <ol start="1" type="A">
                <li class="step-subtitle">Search by Accession (recommended method)</li>
              </ol>
            </div>
            <p style="padding-left: 24px;">
              DNA/protein sequences can be submitted by searching their NCBI standard Accession (e.g., AAC37594.1 for Human BRCA1 Gene). Multiple accessions can be provided for the search to retrieve multiple sequences in FASTA format. The search engine can analyze multiple sequences simultaneously.
            </p>
            <div>
              <ol start="2" type="A">
                <li class="step-subtitle">Search by Sequence</li>
              </ol>
            </div>
            <div style="padding-left: 16px;">
              <ol start="1" type="a">
                <li class="step-supersubtitle">FASTA File Upload</li>
              </ol>
            </div>
            <p style="padding-left: 24px;">
              The sequences themselves can be uploaded in FASTA format. Only files in the FASTA format can be uploaded. Each sequence in the file should be separated by a new line character ("\n") as is standard for FASTA files.
            </p>
            <div style="padding-left: 16px;">
              <ol start="2" type="a">
                <li class="step-supersubtitle">Direct Input</li>
              </ol>
            </div>
            <p style="padding-left: 24px;">
              Users can also submit their own nucleotide/protein sequence as long as the standard FASTA file format is followed. As provided in the NCBI BLAST help, an example sequence in FASTA format is:
            </p>
            <p>
              <code>
                >P01013 GENE X PROTEIN (OVALBUMIN-RELATED)
                QIKDLLVSSSTDLDTTLVLVNAIYFKGMWKTAFNAEDTREMPFHVTKQESKPVQMMCMNNSFNVATLPAEKMKILELPFASGDLSMLVLLPDEVSDLERIEKTINFEKLTEWTNPNTMEKRRVKVYLPQMKIEEKYNLTSVLMALGMTDLFIPSANLTGISSAESLKISQAVHGAFMELSEDGIEMAGSTGVIEDIKHSPESEQFRADHPFLFLIKHNPTNTIVYFGRYWSP
              </code>
            </p>
            <p>In this case the organism name must be included.</p>
            <p>
              Note that the search engine will take up to 5,000 characters for a query on the gene sequence. Please DO NOT input more than 5,000 characters, as your query will not be processed.
            </p>
            <img src="../../public/assets/images/documentation/Image_2.png"/>
            <p>
              Example sequences are provided to demonstrate the process. When you click on a graphical icon, the appropriate data will be automatically loaded into the forms, depending on the selected search by option (Sequence or Accession).
            </p>
            <img src="../../public/assets/images/documentation/Image_3.png"/>
          </li>
          <li>
            <div class="step-title">
              To specify the organism name of the input gene, follow these steps:
            </div>
            <div>
              <ol start="1" type="A">
                <li>
                  <div class="step-subtitle">
                    Select the organism name from the dropdown list provided. You can start typing the organism's name and use the auto-completion feature to quickly select the organism. If the organism of interest is not available in the ORFanID database, you need to obtain the full scientific name and the taxonomy ID from the NCBI Taxonomy Database. Add the scientific name and the taxonomy ID within parentheses after the organism name.
                  </div>
                  <div class="mt-3">Example Organism names are provided in the image below.</div>
                  <img
                    src="../../public/assets/images/documentation/Image_4.png"
                  />
                </li>
                <li>
                  <div class="step-subtitle">
                    Type the organism name in the correct format (Full scientific name and the taxonomy ID which should be enclosed within parentheses).
                  </div>
                  <br />
                  <img
                    src="../../public/assets/images/documentation/Image_5.png"
                  />
                </li>
                <li>
                  <div class="step-subtitle">
                    Fine-tune your search using the optional parameters by clicking on the "Advance Parameter" link. You can adjust the following parameters based on your preference:
                  </div>
                  <div>
                    <ol start="1" type="1" style="padding-left: 16px;">
                      <li>Maximum eValue for BLAST(e-10)</li>
                      <li>Maximum number of target sequences for BLAST results</li>
                      <li>Identity</li>
                    </ol>
                  </div>
                  <p class="mt-3">
                    An example is provided below. Move the sliders to set the appropriate value for each parameter.
                  </p>
                  <img
                    src="../../public/assets/images/documentation/Image_6.png"
                  />
                </li>
              </ol>
            </div>
          </li>
          <li class="step-title">
            <div>
              <p>
                Once you have determined the gene sequence, accession number, and organism, click on the "SUBMIT" button to start the ORFanID search.
              </p>
              <img
                src="../../public/assets/images/documentation/Image_7.png"
              />
            </div>
          </li>
          <li class="step-title">
            <div>
              If you need to double-check or modify your search request, click on the "CANCEL" button to cancel the ORFanID search.
            </div>
          </li>
          <li class="step-title">
            <div>
              <p>If you are satisfied with your search criteria, click on the "SUBMIT" button to start the ORFanID search.</p>
              <img
                src="../../public/assets/images/documentation/Image_8.png"
              />
            </div>
          </li>
          <li class="step-title">
            <div>
              Click the "OK" button to continue with the search.
              <img
                src="../../public/assets/images/documentation/Image_9.png"
              />
            </div>
          </li>
          <li class="step-title">
            <div>
              After clicking the "OK" button, you will be redirected to the status page, where ORFanID will process the input sequence. Depending on the query and the workload of the ORFanID servers, you should expect to receive results within 5 minutes.
            </div>
            <img
              src="../../public/assets/images/documentation/Image_10.png"
            />
          </li>
        </ol>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="10">
        <h4 class="text-center">Interpreting Results</h4>
        <br />
        <ol>
          <li class="step-title">
            <div>
              To view the results of your ORFanID search, go to the Results menu and click on the "Bar Graph" button available at the end of each record.
            </div>
            <img
              src="../../public/assets/images/documentation/Image_11.png"
            />
          </li>
          <li class="step-title">
            <p>The relevant search result will be displayed as shown in the example below.</p>
            <img
              src="../../public/assets/images/documentation/Image_12.png"
            />

            <div style="padding-left: 60px;">
              <ol start="1" type="I">
                <li>
                  <i
                    >The example may contain one or more genes. Among them, one sequence may be a Genus Restricted Gene, while the other(s) may be ORFan Genes.</i
                  >
                </li>
                <li>
                  <i
                    >The BLAST Results table shows the taxonomies (and their parents) for each gene in the input sequence from the BLAST search.</i
                  >
                </li>
                <li>
                  <i
                    >If the sequence is not an ORFan Gene, you can view a graphical representation of the taxonomy tree by clicking the "Graph" button for that sequence.
                  </i>
                </li>
              </ol>
              <br />
              <img
                src="../../public/assets/images/documentation/Image_13.png"
              />
              <br />
              <img
                src="../../public/assets/images/documentation/Image_14.png"
                style="height:400px;"
              />
            </div>
          </li>
          <li class="step-title">
            <div>
              <p>To download the results to a text file, use the "Blast Results" button.</p>
              <img
                src="../../public/assets/images/documentation/Image_15.png"
              />
            </div>
          </li>
        </ol>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="10">
        <h4 class="text-center">The ORFanBase Database</h4>
        <ol start="1" type="1">
          <li class="step-title">
            <div>
              <p>
                Go to the "ORFanbase" page of the system to find genes that have been categorized from the analysis and submitted to the ORFanbase database.
              </p>
              <img
                src="../../public/assets/images/documentation/Image_17.png"
              />
              <p>
                Use the orphan gene information obtained for your research purposes.
              </p>
            </div>
          </li>
          <li class="step-title">
            <div>
              Click on the "Accession" menu item and search for the relevant accession number of an organism by entering the organism name as the search keyword.
The organism name should be typed in the correct format, which includes the full scientific name and the taxonomy ID added within parentheses.
            </div>
          </li>
          <li class="step-title">
            <p>The search results can be downloaded.</p>
            <img
                src="../../public/assets/images/documentation/Image_18.png"
              />
          </li>
        </ol>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col cols="10">
        If you have any questions about using the ORFanID to search for ORFan genes of your interest or regarding the analysis of your data input, please email us at info@orfangenes.com.
      </v-col>
    </v-row>
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
code {
  font-family: Consolas, "courier new";
  color: crimson;
  background-color: #f1f1f1;
  padding: 2px;
  font-size: 105%;
  word-wrap: normal;
  word-wrap: break-word;
}
</style>
