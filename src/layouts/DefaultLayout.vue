<template>
    <v-app>
      <ORFanHeader />
      <v-app-bar app>
        <v-toolbar-title>Default Layout</v-toolbar-title>
      </v-app-bar>
      <v-main class="flex-grow-1">
        <router-view></router-view>
      </v-main>
      <ORFanFooter />
    </v-app>
  </template>
  
  <script>
  import ORFanHeader from '../components/ORFanHeader';
  import ORFanFooter from '../components/ORFanFooter';
  
  export default {
    name: "DefaultLayout",
    components: {
      ORFanHeader,
      ORFanFooter
    },
    setup() {
      return {};
    }
  }
  </script>
  
  <style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }
  
  .v-application {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .v-main {
    flex-grow: 1;
  }
  </style>