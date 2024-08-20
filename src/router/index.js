import { createRouter, createWebHistory } from "vue-router";
//import ResultsView from "../views/ResultsView";
//import ResultView from "../views/ResultView";
//import InstructionsView from "../views/InstructionsView";
import HomeView from "../views/HomeView";
//import OrfanBaseView from "../views/OrfanbaseView";
import InputView from "../views/InputView";
//import AccessionResult from "../views/AccessionResult";
//import ExperimentDiamond from "../views/experiment-diamond.vue"
import DefaultLayout from "../layouts/DefaultLayout.vue";

const routes = [
  {
    path: "/",
    name: "Public",
    component: DefaultLayout,
    redirect: "/",
    children: [
      {
        path: "",
        name: "home",
        component: HomeView
      }
    ]

  },
  {
    path: "/input",
    name: "input",
    component: DefaultLayout,
    redirect: "/input",
    children: [
      {
        path: "",
        name: "input",
        component: InputView
      }
    ]
  },
  // {
  //   path: "/results",
  //   name: "results",
  //   component: ResultsView
  // },
  // {
  //   path: "/orfanBase",
  //   name: "orfanBase",
  //   component: OrfanBaseView
  // },
  // {
  //   path: "/result/:analysisId",
  //   name: "result",
  //   component: ResultView
  // },
  // {
  //   path: "/instructions",
  //   name: "instructions",
  //   component: InstructionsView
  // },
  // {
  //   path: "/accession",
  //   name: "accession",
  //   component: AccessionResult
  // },
  // {
  //   path: "/experiment-diamond",
  //   name: "experiment-diamond",
  //   component: ExperimentDiamond
  // },
];

const router = new createRouter({
  history: createWebHistory(),
  routes
});

export default router;
