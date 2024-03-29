import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import ECharts from 'vue-echarts'
import "echarts";
import Vuelidate from 'vuelidate'
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '100px',
  thickness: '15px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
})
Vue.component('v-chart', ECharts)

Vue.use(Vuelidate)
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
