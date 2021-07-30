import Vue from 'vue'
import VueRouter from 'vue-router'
import Results from '../views/Results'
import Result from '../views/Result'
import Instructions from '../views/Instructions.vue'
import Home from '../views/Home'
import OrfanBase from '../views/Orfanbase'
import Input from '../views/Input'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/input',
    name: 'input',
    component: Input
  },
  {
    path: '/results',
    name: 'results',
    component: Results
  },
  {
    path: '/orfanBase',
    name: 'orfanBase',
    component: OrfanBase
  },
  {
    path: '/result/:analysisId',
    name: 'result',
    component: Result
  },
  {
    path: '/instructions',
    name: 'instructions',
    component: Instructions
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
