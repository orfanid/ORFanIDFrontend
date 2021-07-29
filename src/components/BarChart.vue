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
@media only screen and (max-width: 1920px) {
  .chart {
  height: 350px;
  width: 600px;
}
}
.chart {
  height: 350px;
  width: 800px;
}

.chart[data-v-22e0623b]{
    width: 100% !important;
}
.chart[data-v-22e0623b] >div{
    width: 100% !important;
}
.chart[data-v-22e0623b] canvas{
    width: 100% !important;
}
</style>
