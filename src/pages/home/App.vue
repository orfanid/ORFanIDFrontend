<template>
  <v-app>
    <Header v-if="!isHome"/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer v-if="!isHome"/>
  </v-app>
</template>
<style>
  @import './assets/css/styles.css';
</style>
<script>
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
// import M from 'materialize-css'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    isHome() {
      return this.$route.name === 'home';
    },
  },
  mounted () {
    //M.AutoInit()
},
  data: () => ({
    //
  }),
};
</script>
