<template>
  <v-layout wrap>
    <v-flex xs12 sm12>
      <v-parallax src="../../public/ORFanID_files/background1.jpg">
        <v-layout column align-center justify-center class="hero-content">
          <h1 class="center white-text text-lighten-2 hero-title">
            ORFanID
          </h1>
          <h5 class="center white-text text-lighten-2 hero-subtitle">
            Identifying Orfan Genes
          </h5>
          <p class="hero-description">
            ORFanID is a web-based software engine that identifies ORFan genes from the genomes of specified species or from a given list of DNA sequences. It searches candidate genes against NCBI databases and depicts orphan and taxonomically restricted genes for scientific research and inquiry.
          </p>
          <div class="hero-actions">
            <div class="hero-primary-row">
              <v-btn class="hero-primary-action" to="input" color="teal">
                Get Started
              </v-btn>
            </div>
            <div class="hero-secondary-row">
              <v-btn
                class="video-action"
                href="https://youtu.be/wQY0_BBsJRk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon left>mdi-video</v-icon>
                Video Tutorial
              </v-btn>
              <v-btn
                class="video-action"
                href="https://youtu.be/B9QnPtKNA9c"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon left>mdi-compass-outline</v-icon>
                Navigating NCBI
              </v-btn>
            </div>
          </div>
        </v-layout>
      </v-parallax>
      <v-parallax src="../../public/ORFanID_files/background2.jpg">
        <v-layout align-center justify-center row="4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <h5 class="header col s12 center h2 text-center mt-2" style="color:#ffe57f;">
                  Orphan genes are an unraveling mystery. We hope that ORFanID will
                  help reveal the intricacies of their origin and function.
                </h5>
              </v-col>
            </v-row>
          </v-container>
        </v-layout>
      </v-parallax>
      <v-row>
        <v-col cols="12">
          <div class="parallex-container-wrapper">
            <v-card width="100%">
              <v-container>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="col s12 m4">
                      <div class="icon-block">
                        <h2 class="text-center brown-text">
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
                  <v-col cols="12" md="4">
                    <div class="col s12 m4">
                      <div class="icon-block">
                        <h2 class="text-center brown-text">
                          <i class="material-icons" style="color:#795548;">verified_user</i>
                        </h2>
                        <h5 class="center text-center" style="">Biology</h5>
                        <p>
                          Historically, gene function is known to be expressed through proteins. There are specific
                          organisms that have been found with unique proteins expressed by orphan genes such as Hydra,
                          various Mollusks, Salamander and others. It appears that the anatomy of Hydra is mediated by
                          orphan genes that give rise to unique proteins. Similarly, the mantle of various Mollusks has
                          been found to be expressed from orphan genes, while the regeration of salamander limbs are
                          mediated by orphans.
                        </p>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
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
                </v-row>
              </v-container>
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
                  Gunasekera, R. S., Raja, K. K. B., Hewapathirana, S., Tundrea, E., Gunasekera, V., Galbadage, T., &
                  Nelson, P. A. (2023). ORFanID: A web-based search engine for the discovery and identification of
                  orphan and taxonomically restricted genes. PLoS ONE, 18(10), e0291260.
                </p>
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
                    Copyright &nbsp;© Gunasekera 2018 - 2025
                  </div>
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
export default {
  name: "Home",
  metaInfo: {
    title: 'Home | ORFanID',
    meta: [
      { name: 'description', content: 'ORFanID - Identifying Orphan Genes and finding their origins.' }
    ]
  },
  data() {
    return {
      videoOneUrl: "https://youtu.be/wQY0_BBsJRk",
      videoOneResult: null,
      videoTwoResult: null,
      videoTwoUrl: "https://youtu.be/B9QnPtKNA9c",
    };
  },
  mounted: function () {
    this.$gtag.event('Home', { method: 'Google' })
    const youtubeEmbedTemplate = "https://www.youtube.com/embed/";

    let url = this.videoOneUrl.split(
      /(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/
    );
    console.log("url", url);
    let YId =
      undefined !== url[2] ? url[2].split(/[^0-9a-z_/\\-]/i)[0] : url[0];
    console.log("YId", YId);
    if (YId === url[0]) {
      console.log("not a youtube link");
    } else {
      console.log("it's  a youtube video");
    }
    let topOfQueue = youtubeEmbedTemplate.concat(YId);
    console.log("topOfQueue", topOfQueue);
    this.videoOneResult = topOfQueue;
    this.youtubeURL = "";

    url = this.videoTwoUrl.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    console.log("url", url);
    YId = undefined !== url[2] ? url[2].split(/[^0-9a-z_/\\-]/i)[0] : url[0];
    console.log("YId", YId);
    if (YId === url[0]) {
      console.log("not a youtube link");
    } else {
      console.log("it's  a youtube video");
    }
    topOfQueue = youtubeEmbedTemplate.concat(YId);
    console.log("topOfQueue", topOfQueue);
    this.videoTwoResult = topOfQueue;
    this.youtubeURL = "";
  },
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
  font: white !important;
}

li {
  list-style-type: none;
}

.hero-content {
  align-items: center !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  min-height: 700px;
  padding: 72px 24px 96px;
  text-align: center;
}

.hero-title {
  color: white;
  font-size: 5rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
  margin-bottom: 18px;
}

.hero-subtitle {
  color: white;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0;
  margin: 0 0 22px;
}

.hero-description {
  color: white;
  font-size: 1.35rem;
  font-weight: 400;
  line-height: 1.55;
  margin: 0 auto 30px;
  max-width: 980px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}

.hero-actions {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: center;
  margin-top: 8px;
  width: 100%;
}

.hero-primary-row,
.hero-secondary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.hero-primary-action {
  color: white !important;
  font-weight: 700;
  letter-spacing: 0.04em;
  min-width: 175px !important;
  min-height: 52px;
}

.video-action {
  background-color: rgba(255, 255, 255, 0.94) !important;
  color: #00695c !important;
  font-weight: 700;
  letter-spacing: 0.03em;
  min-width: 190px !important;
  min-height: 52px;
}

@media (max-width: 960px) {
  .hero-content {
    min-height: 660px;
    padding: 54px 18px 84px;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-subtitle {
    font-size: 1.55rem;
  }

  .hero-description {
    font-size: 1.05rem;
  }

  .hero-actions {
    gap: 22px;
  }
}

@media (max-width: 600px) {
  .hero-secondary-row {
    align-items: stretch;
    flex-direction: column;
    width: min(100%, 300px);
  }

  .hero-primary-row {
    width: min(100%, 300px);
  }

  .hero-primary-action,
  .video-action {
    width: 100%;
  }
}
</style>
