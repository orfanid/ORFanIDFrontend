<template>
  <v-layout wrap>
    <v-app-bar color="white" hide-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-spacer></v-spacer>
      <v-toolbar-title w-100>
        <v-row>
              <v-spacer />
              <v-col cols="9">
                  <h4>ORFanID</h4>
              </v-col>
              <v-spacer />
        </v-row>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-flex xs12 sm12>
      <v-parallax src="../../public/ORFanID_files/background1.jpg">
        <v-layout column align-center justify-center row="4">
          <v-spacer />
          <h1 class="center white-text text-lighten-2 h1">
            ORFanID
          </h1>
          <h5 class="center white-text text-lighten-2">
            Identifying Orfan Genes
          </h5>
          <div class="row center justify mt-2">
            <v-btn class="center" to="input" color="teal"><span color="white">Get Started</span></v-btn>
          </div>
        </v-layout>
      </v-parallax>
      <v-row>
        <v-col cols="s12">
          <div class="parallex-container-wrapper">
            <v-row>
              <v-spacer />
              <v-col cols="9">
                <v-card-title class="justify-center"
                  ><h4>ORFanID</h4></v-card-title
                >
                <v-card-text class="headerPara">
                  <p>
                    ORFanID is a web-based software engine that identifies ORFan
                    genes from the genomes of specified species or from a given
                    list of DNA sequences. The scope of the search for orphan
                    genes can be defined by the selection of the taxonomy level
                    of interest. Detectable homologous sequences are found for
                    candidate gene in the NCBI databases. From these findings
                    the ORFanID engine identifies and depicts orphan genes.
                    Results may be viewed and analyzed graphically for the
                    purpose of scientific research and inquiry.
                  </p>
                </v-card-text>
              </v-col>
              <v-spacer />
            </v-row>
          </v-card>
          </div>
        </v-col>
      </v-row>
      <v-parallax src="../../public/ORFanID_files/background2.jpg">
        <v-layout align-center justify-center row="4">
          <h5
            class="header col s12 center h2 text-center mt-2"
            style="color:#ffe57f;"
          >
            Orphan genes are an unraveling mystery. We hope that ORFanID will
            help reveal the intricacies of their origin and function.
          </h5>
        </v-layout>
      </v-parallax>
      <v-row>
        <v-col cols="12">
          <div class="parallex-container-wrapper">
            <v-card width="100%">
            <v-row>
              <v-spacer />
              <v-col cols="3">
                <div class="col s12 m4">
                <div class="icon-block">
                  <h2 class="text-center brown-text" >
                    <i class="material-icons" style="color:#795548;">flash_on</i>
                  </h2>
                  <h5 class="center text-center" style="">ORFan Genes</h5>
                  <p>
                    Orphan genes (also known as taxonomically restricted genes)
                    are genes that do not have related ancestral genes in other
                    species or at the specified taxonomy level. At the molecular
                    level, ORFan genes consist of DNA sequences that have no
                    homology with sequences found in common DNA databases such
                    as Genbank. While the prevailing dogma has defined genes in
                    different species as a result of gene duplication or
                    recombination, the presence of orphan gene ubiquity in
                    various sequenced genomes is a mystery, perhaps even a
                    significant problem to be solved.
                  </p>
                  <p>&nbsp;</p>
                </div>
                </div>
              </v-col>
              <v-col cols="3">
                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="text-center brown-text">
                      <i class="material-icons" style="color:#795548;">verified_user</i>
                    </h2>
                    <h5 class="center text-center" style="">Biology</h5>
                    <p>
                      Historically, gene function is known to be expressed
                      through proteins. There are specific organisms that have
                      been
                      <strong>found </strong>with unique proteins expressed by
                      orphan genes such as Hydra, various Mollusks, Salamander
                      and others. It appears that the anatomy of Hydra is
                      mediated by orphan genes that give rise to unique
                      proteins. Similarly, the mantle of various Mollusks has
                      been found to be expressed from orphan genes, while the
                      regeration of salamander limbs are mediated by orphans
                      (Dr. Paul Nelson, 2017)
                    </p>
                  </div>
                </div>
              </v-col>
              <v-col cols="3">
                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="text-center brown-text">
                      <i class="material-icons" style="color:#795548;">settings</i>
                    </h2>
                    <h5 class="center text-center" style="">Discovery</h5>
                    <p>
                      By identifying these unique DNA sequences, ORFanID can
                      help discover the origin, function and other significance
                      of orphan genes. The software is able to identify genes
                      unique to genus, family, or species etc. at differing
                      taxonomy levels. Based on the parameters specified, some
                      of orphans (also called Taxonomy Restricted Genes) may or
                      may not fall under the given classification for strict
                      ORFans. &nbsp; As such, ORFanID can help delineate the
                      actual sequence and function of
                      <em>de novo</em> genes discovered in species and at all
                      levels of the taxonomy tree.
                    </p>
                  </div>
                </div>
              </v-col>
              <v-spacer />
            </v-row>
          </v-card>
          </div>
        </v-col>
      </v-row>
      <v-parallax src="../../public/ORFanID_files/background3.jpg">
        <v-layout column align-center justify-center row="4">
          <h1 class="center white-text text-lighten-2 h1" style="font-size:2em">
            Orphan genes, a frontier for discovery
          </h1>
        </v-layout>
      </v-parallax>
      <v-footer color="teal">
        <v-row>
          <v-spacer />
          <v-col cols="9" class="pa-6">
            <div class="row footer-content-wrapper">
              <h5 class="grey-text text-lighten-4" style="color:white;">References</h5>
              <div class="copyrights">
                <p class="grey-text text-lighten-4 text-justify" style="color:white;">
                  Altschul, S.F., Gish, W., Miller, W., Myers, E.W. &amp;
                  Lipman, D.J. (1990) "Basic local alignment search tool." J.
                  Mol. Biol. 215:403-410
                </p>
                <p class="grey-text text-lighten-4 text-justify" style="color:white;">
                  Ekstrom, A. &amp; Yin, Y. (2016) "ORFanFinder: automated
                  identification of taxonomically restricted orphan genes."
                  Bioinformatics; 32 (13): 2053-2055. doi:
                  10.1093/bioinformatics/btw122
                </p>
                <p class="grey-text text-lighten-4 text-justify" style="color:white;">
                  Clamp, M., Fry, B., Kamal, M., Xie, X., Cuff, J., Lin, M.F.,
                  Kellis, K., Lindblad-Toh, K., and Lander, E. S. (2007)
                  “Distinguishing protein-coding and noncoding genes in the
                  human genome”. PNAS 2007 December, 104 (49) 19428-19433
                </p>
                <p class="grey-text text-lighten-4 text-justify" style="color:white;">
                  R. S. Gunasekera, Hewpathirana, S., Gunasekera, V., Dias, S.
                  and Nelson, P., A Web-Based Computational Algorithm, ORFanID,
                  for Discovering and Cataloging Orphan and Taxonomically
                  Restricted Genes in Various Species, International Society for
                  Computational Biology, Chicago, USA, B-847, 2018
                </p>
              </div>
            </div>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row>
          <v-col>
            <v-row class="footer-copyright">
              <v-spacer />
              <v-col cols="12" class="pl-0 pr-0">
                <div class="d-flex container inner-content">
                <div class=" text-left float-left" style="color:white;">
                  Copyright &nbsp;© Gunasekera 2021
                </div>

                <!-- <p class="mb-0 float-right" style="color:white;">
                  <a
                    class="grey-text text-lg-right footer-link"
                    href="mailto:sureshhewabi@gmail.com?cc=vinodh@thegunasekeras.org,richgun01@gmail.com&Subject=ORFanID%20Online%20Issues"
                    >Contact Us</a
                  >
                </p> -->
                </div>
              </v-col>
              <v-spacer />
            </v-row>
          </v-col>
        </v-row>
      </v-footer>
    </v-flex>
  </v-layout>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
};
</script>

<style scoped>
.parallaxImg {
  height: 100%;
  width: 100%;
}
.headerPara {
  width: 100%;
  margin: auto;
}
.copyrights {
  font:white!important;
}
</style>
