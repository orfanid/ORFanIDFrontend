<template>
  <div class="bar-chart" ref="barChart"></div>
</template>

<script>
import * as echarts from "echarts";
import analysisAPI from "../api/analysis";
import { VCalendarMonthly } from "vuetify/lib";
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
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
  renderChart() {
    const chart = echarts.init(this.$refs.barChart);

    const options = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const item = params[0];
          return `${item.axisValue}<br/>Value: <b>${item.data}</b>`;
        }
      },
      xAxis: this.chartData.xAxis,
      yAxis: this.chartData.yAxis,
      series: this.chartData.series
    };

    chart.setOption(options);
  },

    // renderChart() {
    //   const chart = echarts.init(this.$refs.barChart);

    //   const options = {
    //     title: {
    //       text: "Bar Chart Example"
    //     },
    //     tooltip: {},
    //     xAxis: {
    //       data: this.chartData.categories
    //     },
    //     yAxis: {},
    //     series: [
    //       {
    //         type: "bar",
    //         data: this.chartData.data
    //       }
    //     ]
    //   };
    //   chart.setOption(this.chartData);
    // },
    handleResize() {
      const chart = echarts.getInstanceByDom(this.$refs.barChart);
      chart.resize();
    },
    fetchChartData() {
      analysisAPI.getSummaryChart({ sessionId: this.$route.params.analysisId })
        .then(response => {
          const xValues = response.data.x;
          const yValues = response.data.y;

      
          this.chartData.xAxis.data = xValues;
          this.chartData.series[0].data = yValues;


          const maxValue = Math.max(...yValues);

          let interval = 1; 
          if (maxValue > 20 && maxValue <= 50) interval = 5;
          else if (maxValue > 50 && maxValue <= 100) interval = 10;
          else if (maxValue > 100 && maxValue <= 200) interval = 20;
          else if (maxValue > 200) {
          
            interval = Math.ceil(maxValue / 10);
          }

          this.chartData.yAxis.interval = interval;
          this.chartData.yAxis.max = Math.ceil(maxValue / interval) * interval;


          this.renderChart();
        });
     }

    // fetchChartData() {
    //   let that = this;
    //   analysisAPI.getSummaryChart({ sessionId: this.$route.params.analysisId }).then(response => {
    //     response.data.x.forEach(item => {
    //       that.chartData.xAxis.data.push(item);
    //     });
    //     response.data.y.forEach(item => {
    //       that.chartData.series[0].data.push(item);
    //     });

    //     console.log("Fetched chartSummary", JSON.stringify(this.chartData));
    //     this.renderChart();
    //   });
    // }
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
