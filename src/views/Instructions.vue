<template>
    <div class="container">
        <div class="row">
            <div class="col s12 m9 l10">
                <div id="perform_analysis" class="section scrollspy">
                    <h4>How to Run an Example Sequence</h4>
                    <p>1. Visit the ORFanGenes website (http://orfangenes.com/) and click <Strong>Get Started</Strong> on our landing page to do your analysis.</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/GetStarted.png">

                    <p>2. Now you are in the Input page. You can perform your analysis bu only providing your gene/protein sequence and the organism.
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/Input_options.png">
                        There are manly three ways that you can give your input sequence. Please click your preferred option below to see more details:
                    <ul class="collapsible">
                        <li>
                            <div class="collapsible-header"><i class="material-icons">looks_one</i>Search by Accession(s)</div>
                            <div class="collapsible-body">
                                <h6><b>Recommended Method</b></h6>
                                <span>
                                You can easily submit gene/protein sequence by doing a search by their NCBI standard Accession(eg: AAC37594.1 for Human BRCA1 Gene).
                                    You can provide multiple accessions for the search to retreive multiple sequences in FASTA format. Our search engine is smart enough to handle multiple sequences for the analysis
                            </span>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header"><i class="material-icons">looks_two</i>By FASTA File upload</div>
                            <div class="collapsible-body"><span>You can upload multiple sequence in FASTA format. Therefore, our file choose functionality except only FASTA files.
                            Each sequence should separated by a new line charactor("\n") as any statndard FASTA file does.</span></div>
                        </li>
                        <li>
                            <div class="collapsible-header"><i class="material-icons">looks_3</i>Direct Input</div>
                            <div class="collapsible-body"><span>Although we do not recommend to use this option, user can still submit their own nucleotide/protein sequence
                            with the promise of they follow standard <a href="https://www.ncbi.nlm.nih.gov/BLAST/fasta.shtml">FASTA file format</a>.</span></div>
                        </li>
                    </ul>
                    <p>3. Secondly, you can specify the organism of the input gene using the auto-completion selection textbox. When you start typing, auto-completion will help you to select the organism quickly
                    by showing the Scientific name, NCBI Taxonomy ID and a image.</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/organism_selection.png">
                        <p>You have simply provided data for the analysis. If you click on the "Example" link on the bottom left, text fields will automatically get filled with an example input sequence of genes of E. Coli.</p>
                    <p>5.You can fine tune other optional parameters by clicking on the "Advance Parameter" link. You can mainly change following parameters:</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/advance_parameters.png">
                    <ul class="collapsible">
                        <li>
                            <div class="collapsible-header"><i class="material-icons">looks_one</i>E-Value</div>
                            <div class="collapsible-body">
                                <span> Move the slider to select the appropriate values.</span>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header"><i class="material-icons">looks_two</i>Maximum Target Sequences</div>
                            <div class="collapsible-body"><span>Move the slider to select the appropriate values.</span></div>
                        </li>

                    </ul>

                    <p>4. Select "Submit" and wait for around 10 minutes or more until ORFanGenes processes the input sequence and returns the results.</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/classify.png">
                </div>

                <div id="results_interpretation" class="section scrollspy">
                    <h4>How to Interpret Results</h4>
                    <p>5. View the results of the example sequence</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/result.png">
                    <p>The example input contains three genes. Out of the three genes, two of which are Genus Restricted Genes, and the other is an ORFan Gene. The Blast Results table shows the taxonomies (and their parents) for each gene in the input sequence from the BLAST search.</p>
                    <img class="materialboxed" width="650" src="../../public/assets/images/documentation/blast_results_chart.png">
                </div>
                <div id="ORFanBase_access" class="section scrollspy">
                    <h4>ORFanBase Database</h4>
                    <p>We have archive the analysis of orfan genes in ORFanBase Database.</p>
                </div>
                <div id="sequence_preparation" class="section scrollspy">
                    <p>Content </p>
                </div>
            </div>
            <div class="col hide-on-small-only m3 l2">
                <ul class="section table-of-contents">
                    <li><a href="#perform_analysis">Perform Analysis</a></li>
                    <li><a href="#results_interpretation">Results Interpretation</a></li>
                    <li><a href="#ORFanBase_access">ORFanBase Access</a></li>
                    <li><a href="#sequence_preparation">Sequence Preparation</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>