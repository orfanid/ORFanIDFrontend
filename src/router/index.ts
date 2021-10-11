import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Results from '../views/Results.vue';
import Orfanbase from '../views/Orfanbase.vue';
import Clamp from '../views/Clamp.vue';
import Instructions from '../views/Instructions.vue';
import ClampResults from '../views/ClampResults.vue';
import Welcome from '../views/Welcome.vue';
import Result from '../views/Result.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/input',
    name: 'Home',
    component: Home,
  },
  {
    path: '/results',
    name: 'results',
    component: Results,
  },
  {
    path: '/orfanbase',
    name: 'orfanbase',
    component: Orfanbase,
  },
  {
    path: '/clamp',
    name: 'clamp',
    component: Clamp,
  },
  {
    path: '/clampresults',
    name: 'clampresults',
    component: ClampResults,
  },
  {
    path: '/instructions',
    name: 'instructions',
    component: Instructions,
  },
  {
    path: '/result',
    name: 'result',
    component: Result,
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
