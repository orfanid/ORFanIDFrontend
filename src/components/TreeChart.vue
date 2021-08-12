<template>
  <v-chart class="chart" :option="chartData"  :loading="loading" :loadingOptions="treeLoadingOptions" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "App",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "teal",
  },
  props: {
    chartData: {
      type: Object,
      require: true,
    },
    loading: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      treeLoadingOptions: {
        text: "Loading…",
        color: "#4ea397",
        maskColor: "rgba(255, 255, 255, 0.4)"
      },
    }
  },
  methods: {

  }
};
</script>

<style scoped>
.chart {
  height: 600px;
  width: 1200px;
}
</style>
