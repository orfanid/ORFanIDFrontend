import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import ECharts from 'vue-echarts'
import "echarts";
import Vuelidate from 'vuelidate'
import VueAnalytics from 'vue-analytics';
// import 'materialize-css/dist/css/materialize.min.css'
// import 'material-design-icons/iconfont/material-icons.css'

Vue.component('v-chart', ECharts)

Vue.use(Vuelidate)

Vue.use(VueAnalytics, {
  id: 'G-37PVYZFCHN',
  router
});

Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
