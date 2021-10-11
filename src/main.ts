import Vue from 'vue';
// import $ from 'jquery';
import VueTextareaAutosize from 'vue-textarea-autosize';
// import Loading from 'vue-loading-overlay';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import 'materialize-css/dist/css/materialize.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'vue-loading-overlay/dist/vue-loading.css';
// import VueSession from 'vue-session'

Vue.config.productionTip = false;
Vue.use(VueTextareaAutosize);

// Vue.use(VueSession)
// Vue.use(Loading);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
