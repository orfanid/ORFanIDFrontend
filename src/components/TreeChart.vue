<template>
  <v-chart class="chart" :option="chartData" />
  <!-- <pre>{{chartData}}</pre> -->
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
  },
  data() {
    return {}
  },
};
</script>

<style scoped>
.chart {
  height: 600px;
  width: 1200px;
}
</style>
