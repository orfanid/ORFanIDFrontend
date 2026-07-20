import Vue from "vue";
import VueRouter from "vue-router";
import Results from "../views/Results";
import Result from "../views/Result";
import Instructions from "../views/Instructions.vue";
import Home from "../views/Home";
import OrfanBase from "../views/Orfanbase";
import Input from "../views/Inputv2";
import Accession from "../views/Accession.vue";
import { isAdminAuthenticated } from "../utils/adminAuth";

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
    redirect: "/input"
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard"
  },
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("../views/AdminLogin.vue")
  },
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("../views/AdminDashboard.vue"),
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/analysis/:analysisId",
    name: "admin-analysis-detail",
    component: () => import("../views/AdminAnalysisDetail.vue"),
    meta: { requiresAdmin: true }
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAdmin) && !isAdminAuthenticated()) {
    next({ name: "admin-login" });
    return;
  }

  if (to.name === "admin-login" && isAdminAuthenticated()) {
    next({ name: "admin-dashboard" });
    return;
  }

  next();
});

export default router;
