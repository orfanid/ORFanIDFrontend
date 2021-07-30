<template>
  <v-app>
    <Header v-if="!isHome"/>
    <v-main v-if="!isHome">
      <router-view></router-view>
    </v-main>
    <router-view v-if="isHome"></router-view>
    <Footer v-if="!isHome"/>
  </v-app>
</template>

<script>
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import M from 'materialize-css'
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
    M.AutoInit()
},
  data: () => ({
    //
  }),
};
</script>
