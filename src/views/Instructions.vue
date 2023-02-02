<template>
  <div class="container">
    <v-row>
      <v-spacer />
      <v-col cols="10">
        <h4>ORFanID Operating Instructions</h4>
        <br />
        <h5>ORFanID Sequence Submission</h5>
        <p>
          Follow the instruction given below to successfully submit a sequence by yourself
        </p>
        <ol start="1">
          <li>
            <div>
              First visit the OrFanGenes website (<a href="http://orfangenes.com"
                >http://orfangenes.com/</a
              >)
            </div>
          </li>
          <li>
            <div>
              Click on Get Started button on the home page
              <img
                src="../../public/assets/images/documentation/image_1.png"
                style="height:400px;"
              />
              <p>
                Perform OrFan analysis by providing either a DNA or protein sequence and the
                scientific name of the Organism.
              </p>
            </div>
          </li>
          <li>
            <div>DNA or Protein sequences can be added in three different ways:</div>
            <div style="padding-left: 70px;">
              <ol start="1" type="A">
                <li>Search by Accession (Recommended method)</li>
              </ol>
            </div>
            <p>
              DNA/ Protein sequences can be submitted easily by doing a search of their NCBI
              standard Accession (eg: AAC37594.1 for Human BRCA1 Gene). You can provide multiple
              accessions for the search to retrieve multiple sequences in FASTA format. The search
              engine is able to analyze multiple sequences simultaneously.
            </p>
            <div style="padding-left: 70px;">
              <ol start="2" type="B">
                <li>Search by Accession (Recommended method)</li>
              </ol>
            </div>
            <div style="padding-left: 100px;">
              <ol start="1" type="a">
                <li>FASTA File Upload</li>
              </ol>
            </div>
            <p>
              The sequences themselves can be uploaded in FASTA format. Only files in the FASTA
              format can be uploaded. Each sequence in the file should be separated by a new line
              character("\n") as is standard for FASTA files
            </p>
            <div style="padding-left: 100px;">
              <ol start="2" type="a">
                <li>Direct Input.</li>
              </ol>
            </div>
            <p>
              Users can also submit their own nucleotide/protein sequence as long as the standard
              FASTA file format is followed. As provided in the NCBI BLAST help, an example sequence
              in FASTA format is:
            </p>
            <p>
              <code>
                >P01013 GENE X PROTEIN (OVALBUMIN-RELATED)
                QIKDLLVSSSTDLDTTLVLVNAIYFKGMWKTAFNAEDTREMPFHVTKQESKPVQMMCMNNSFNVATLPAEKMKILELPFASGDLSMLVLLPDEVSDLERIEKTINFEKLTEWTNPNTMEKRRVKVYLPQMKIEEKYNLTSVLMALGMTDLFIPSANLTGISSAESLKISQAVHGAFMELSEDGIEMAGSTGVIEDIKHSPESEQFRADHPFLFLIKHNPTNTIVYFGRYWSP
              </code>
            </p>
            <p>In this case the organism name must be included.</p>
            <p>
              NOTE: The search engine will take UP TO 5,000 characters for a query on the Gene
              Sequence. Please DO NOT input more than 5,000 characters as your query will not be
              processed
            </p>
            <img src="../../public/assets/images/documentation/Image_2.png" style="height:400px;" />
            <p>
              Example sequences are provided to demonstrate the process. When a graphical icon is
              clicked, the appropriate data will be automatically loaded into the forms depending
              upon the selected search by option (Sequence or Accession).
            </p>
            <img src="../../public/assets/images/documentation/Image_3.png" style="height:400px;" />
          </li>
          <li>
            <div>
              The Organism Name of the input gene must be specified. The organism’s name can be
              added in two different ways:
            </div>
            <div style="padding-left: 70px;">
              <ol start="1" type="I">
                <li>
                  <div>
                    From the given dropdown list. You can start typing the organism’s name so that
                    the auto-completion will help you select the organism quickly by showing the
                    Scientific name, NCBI Taxonomy ID, and an image. If the organism of interest is
                    not in the ORFanID database, please go to NCBI Taxonomy Database and obtain the
                    full scientific name and the taxonomy ID which has to be added within
                    parentheses
                  </div>
                  <div>Example Organism names are provided in the image below.</div>
                  <img
                    src="../../public/assets/images/documentation/Image_4.png"
                    style="height:400px;"
                  />
                </li>
                <li>
                  <div>
                    Typing the organism name with the correct format (Full scientific name and the
                    taxonomy ID which has to be added within parentheses)
                  </div>
                  <br />
                  <img
                    src="../../public/assets/images/documentation/Image_5.png"
                    style="height:400px;"
                  />
                </li>
                <li>
                  <div>
                    The search can be fine-tuned using optional parameters by clicking on the
                    "Advance Parameter" link. The following parameters can be adjusted according to
                    the user preference:
                  </div>
                  <div style="padding-left: 100px;">
                    <ol start="2" type="1">
                      <li>Maximum eValue for BLAST(e-10)</li>
                      <li>Maximum number of target sequences for BLAST results</li>
                      <li>Identity</li>
                    </ol>
                  </div>
                  <p>
                    An example is provided below. In each case, the slider should be moved to set
                    the appropriate value.
                  </p>
                  <img
                    src="../../public/assets/images/documentation/Image_6.png"
                    style="height:400px;"
                  />
                </li>
              </ol>
            </div>
          </li>
          <li>
            <div>
              <p>
                When either the gene sequence, an accession number, and the organism has been
                determined, click on the " SUBMIT " button to start the ORFanID search.
              </p>
              <img
                src="../../public/assets/images/documentation/Image_7.png"
                style="height:400px;"
              />
            </div>
          </li>
          <li>
            <div>
              If you would like to double-check or modify–your search request, simply click on the
              "CANCEL" button to cancel the ORFanID search.
            </div>
          </li>
          <li>
            <div>
              <p>Otherwise, click on "SUBMIT" to start the ORFanID search.</p>
              <img
                src="../../public/assets/images/documentation/Image_8.png"
                style="height:400px;"
              />
            </div>
          </li>
          <li>
            <div>
              Click the "OK" button to continue the search
              <img
                src="../../public/assets/images/documentation/Image_9.png"
                style="height:400px;"
              />
            </div>
          </li>
          <li>
            <div>
              Upon clicking the "OK" button, you will be redirected to this status page. ORFanID
              will process the input sequence and depending on the query, as well as the workload of
              the ORFanID servers, you should expect a result within 5 minutes.
            </div>
            <img
              src="../../public/assets/images/documentation/Image_10.png"
              style="height:400px;"
            />
          </li>
        </ol>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col cols="10">
        <h4>Interpreting Results</h4>
        <br />
        <ol>
          <li>
            <div>
              To view the results of the ORFanID search, click on the Results menu and then click on
              the "Bar Graph" button available at the end of each record.
            </div>
            <img
              src="../../public/assets/images/documentation/Image_11.png"
              style="height:400px;"
            />
          </li>
          <li>
            <p>The relevant search result will be displayed as in the below image.</p>
            <img
              src="../../public/assets/images/documentation/Image_12.png"
              style="height:400px;"
            />

            <div style="padding-left: 60px;">
              <ol start="2" type="I">
                <li>
                  <i
                    >The example shown above contains three genes. One of the sequences is Genus
                    Restricted Genes, and the second and third are ORFan Genes.</i
                  >
                </li>
                <li>
                  <i
                    >The BLAST Results table shows the taxonomies (and their parents) for each gene
                    in the input sequence from the BLAST search</i
                  >
                </li>
                <li>
                  <i
                    >A graphical representation of the taxonomy tree can be viewed by clicking the
                    "Graph" button for each sequence that is not an ORFan Gene.
                  </i>
                </li>
              </ol>
              <br />
              <img
                src="../../public/assets/images/documentation/Image_13.png"
                style="height:400px;"
              />
              <br />
              <img
                src="../../public/assets/images/documentation/Image_14.png"
                style="height:400px;"
              />
            </div>
          </li>
          <li>
            <div>
              <p>The Results can be downloaded to a text file using the Blast Results button</p>
              <img
                src="../../public/assets/images/documentation/Image_15.png"
                style="height:400px;"
              />
            </div>
          </li>
        </ol>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <h4>The ORFanBase Database</h4>
        <ol start="1" type="1">
          <li>
            <div>
              <p>
                Genes that have been categorized from the analysis and submitted to the “ORFanbase”
                database can be found on the “ORFanbase” page of the system.
              </p>
              <img
                src="../../public/assets/images/documentation/Image_17.png"
                style="height:400px;"
              />
              <p>
                The orphan gene information obtained can now be used for your research purposes.
              </p>
            </div>
          </li>
          <li>
            <div>
              The relevant accession number of an organism can be searched after clicking the
              Accession menu item and then interesting the organism name as the search key word. The
              organism name should be typed with the correct format (Full scientific name and the
              taxonomy ID which has to be added within parentheses)
            </div>
          </li>
          <li>
            <p>The searched results can be also be downloaded</p>
            <img
                src="../../public/assets/images/documentation/Image_18.png"
                style="height:400px;"
              />
          </li>
        </ol>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        If you have any questions regarding the instructions for using the ORFanID to search and find ORFan Genes of your interest, or regarding the analysis of your data input, please email us at: info@orfangenes.com.
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
}
</style>
