<template>
  <div class="chart-container">
    <div class="svg-wrapper">
      <svg class="svgcontainer"></svg>
    </div>
  </div>
</template>


<script>
import * as d3 from "d3";

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      treeData: {
        name: "Top Level",
        children: [
          {
            name: "Level 2: A",
            children: [
              { name: "Son of A" },
              { name: "Daughter of A" }
            ]
          },
          { name: "Level 2: B" }
        ]
      },
      treemap: null,
      root: null,
      svg: null,
      g: null,
      i: 0,
      duration: 750,
      nodeExit: null
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const margin = { top: 20, right: 90, bottom: 20, left: 90 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const dimensions = this.calculateTreeDimensions(this.chartData);

      this.svg = d3.select(".svgcontainer")
        .attr("width", dimensions.width + margin.right + margin.left)
        .attr("height", dimensions.height + margin.top + margin.bottom)
        .call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", this.zoomed));

      this.g = this.svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      this.i = 0;
      this.duration = 750;

      this.treemap = d3.tree().size([dimensions.height, dimensions.width]);
      this.root = d3.hierarchy(this.chartData, d => d.children);
      this.root.x0 = dimensions.height / 2;
      this.root.y0 = 0;

      this.update(this.root);
    },
    zoomed(event) {
      this.g.attr("transform", event.transform);
    },
    update(source) {
      const treeData = this.treemap(this.root);

      // nodes
      const nodes = treeData.descendants();
      nodes.forEach(d => { d.y = d.depth * 180; });

      const node = this.g.selectAll("g.node")
        .data(nodes, d => d.id || (d.id = ++this.i));

      const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
        .on("click", this.click);

      nodeEnter.append("circle")
        .attr("class", "node")
        .attr("r", 0)
        .style("fill", d => d._children ? "red" : "#fff");

      nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children || d._children ? -13 : 13)
        .attr("text-anchor", d => d.children || d._children ? "end" : "start")
        .text(d => d.data.name);

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate.transition()
        .duration(this.duration)
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

      nodeUpdate.select("circle.node")
        .attr("r", 10)
        .style("fill", d => d._children ? "red" : "#fff")
        .attr("cursor", "pointer");

      const nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
        .remove();

      nodeExit.select("circle").attr("r", 0);
      nodeExit.select("text").style("fill-opacity", 0);

      // links
      const links = treeData.descendants().slice(1);

      const link = this.g.selectAll("path.link")
        .data(links, d => d.id);

      const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return this.diagonal(o, o);
        });

      const linkUpdate = linkEnter.merge(link);

      linkUpdate.transition()
        .duration(this.duration)
        .attr("d", d => this.diagonal(d, d.parent));

      const linkExit = link.exit().transition()
        .duration(this.duration)
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return this.diagonal(o, o);
        })
        .remove();

      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    diagonal(s, d) {
      const path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x}
          ${(s.y + d.y) / 2} ${d.x}
          ${d.y} ${d.x}`;
      return path;
    },
    click(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.update(d);
    },
    calculateTreeDimensions(data) {
      const depth = this.getMaxDepth(data);
      const breadth = this.getMaxBreadth(data);

      const width = depth * 180;
      const height = breadth * 100;

      return { width, height };
    },
    getMaxDepth(node) {
      if (!node.children || node.children.length === 0) {
        return 1;
      } else {
        return 1 + Math.max(...node.children.map(child => this.getMaxDepth(child)));
      }
    },
    getMaxBreadth(node) {
      if (!node.children || node.children.length === 0) {
        return 1;
      } else {
        return node.children.length + Math.max(...node.children.map(child => this.getMaxBreadth(child)));
      }
    }
  }
};
</script>

<style>
.xAxis path,
.xAxis line {
  stroke: teal;
  shape-rendering: crispEdges;
}
.xAxis text {
  font-family: Optima, Futura, sans-serif;
  font-weight: bold;
  font-size: 14px;
  fill: teal;
}

.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

.chart-container {
  width: calc(100vw - 10px); /* Full width of viewport */
  height: calc(100vh - 10px); /* Full height of viewport */
  position: relative;
}

.svg-wrapper {
  width: fit-content;
  height: fit-content;
  margin-right: 20px; /* Adjust for margin */
  margin-bottom: 20px; /* Adjust for margin */
}

.svgcontainer {
  /* SVG styles */
}
</style>

