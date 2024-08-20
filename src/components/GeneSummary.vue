<template>
  <div class="bar-chart" ref="barChart"></div>
</template>

<script>
import * as echarts from "echarts";
import orfanApiService from "../api/orfanApiService";
export default {
  props: {
    dataChart: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      chartData: {
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: -70,
            align: "justify",
            formatter: function(value) {
              return value.split(" ").join("\n");
            },
            fontSize: 8
          }
        },
        yAxis: {
          type: "value",
          min: 0, 
          interval: 1,
          axisLabel: {
            pformatter: '{value}'
          },
          axisLine: {
            show: true
          },
        },
        series: [{ data: [], type: "bar" }]
      }
    };
  },
  mounted() {
    console.log("dataChart", this.dataChart);
    this.fetchChartData();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    renderChart() {
      const chart = echarts.init(this.$refs.barChart);
      chart.setOption(this.chartData);
    },
    handleResize() {
      const chart = echarts.getInstanceByDom(this.$refs.barChart);
      chart.resize();
    },
    fetchChartData() {
      let that = this;
      orfanApiService.getSummaryChart({ sessionId: this.$route.params.analysisId }).then(response => {
        response.data.x.forEach(item => {
          that.chartData.xAxis.data.push(item);
        });
        response.data.y.forEach(item => {
          that.chartData.series[0].data.push(item);
        });

        console.log("Fetched chartSummary", JSON.stringify(this.chartData));
        this.renderChart();
      });
    }
  }
};
</script>

<style>
#orfanGenesSummary ul {
  list-style-type: none; /* Remove default bullet points */
}

.bar-chart {
  width: 100%;
  height: 400px;
}

@media screen and (max-width: 768px) {
  .bar-chart {
    height: 300px;
  }
}

@media screen and (max-width: 576px) {
  .bar-chart {
    height: 200px;
  }
}
</style>
