import Vue from "vue";
import VueRouter from "vue-router";
import Results from "../views/Results";
import Result from "../views/Result";
import Instructions from "../views/Instructions.vue";
import Home from "../views/Home";
import OrfanBase from "../views/Orfanbase";
import Input from "../views/Inputv2";
import Accession from "../views/Accession.vue";
import experimentdiamond from "../views/experiment-diamond.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/input",
    name: "input",
    component: Input
  },
  {
    path: "/results",
    name: "results",
    component: Results
  },
  {
    path: "/orfanBase",
    name: "orfanBase",
    component: OrfanBase
  },
  {
    path: "/result/:analysisId",
    name: "result",
    component: Result
  },
  {
    path: "/instructions",
    name: "instructions",
    component: Instructions
  },
  {
    path: "/accession",
    name: "accession",
    component: Accession
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/experiment-diamond",
    name: "experiment-diamond",
    component: experimentdiamond
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
