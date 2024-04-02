<template>
  <div>
    <div class="svgcontainer"></div>
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
              {
                name: "Son of A"
              },
              {
                name: "Daughter of A"
              }
            ]
          },
          {
            name: "Level 2: B"
          }
        ]
      },
      treemap: null,
      root: null,
      svg: null, i: 0,
      duration: 750,
      nodeExit: null
    };
  },
  mounted() {
    console.log("chartData ", this.chartData);
    this.initChat();
  },
  methods: {
    initChat() {
      var margin = { top: 20, right: 90, bottom: 20, left: 90 };
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      this.svg = d3
        .select(".svgcontainer")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      this.i = 0;
      this.duration = 750;

      this.treemap = d3.tree().size([height, width]);
      this.root = d3.hierarchy(this.treeData, function(d) {
        return d.children;
      });
      this.root.x0 = height / 2;
      this.root.y0 = 0;
      console.log("root ", this.root);

      this.update(this.root);
    },
    update(source) {
      var treeData = this.treemap(this.root);

      // nodes
      var nodes = treeData.descendants();
      nodes.forEach(function(d) {
        d.y = d.depth * 180;
      });
      var node = this.svg.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++this.i);
      });
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + source.y0 + ", " + source.x0 + ")";
        })
        .on("click", click);

      nodeEnter
        .append("circle")
        .attr("class", "node")
        .attr("r", 0)
        .style("fill", function(d) {
          return d._children ? "red" : "#fff";
        });

      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
          return d.data.name;
        });

      var nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(this.duration)
        .attr("transform", function(d) {
          return "translate(" + d.y + ", " + d.x + ")";
        });

      nodeUpdate
        .select("circle.node")
        .attr("r", 10)
        .style("fill", function(d) {
          return d._children ? "red" : "#fff";
        })
        .attr("cursor", "pointer");

      this.nodeExit = node
        .exit()
        .transition()
        .duration(this.duration)
        .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      this.nodeExit.select("circle").attr("r", 0);
      this.nodeExit.select("text").style("fill-opacity", 0);

      // links
      function diagonal(s, d) {
        let path = `M ${s.y} ${s.x}
      C ${(s.y + d.y) / 2} ${s.x}
        ${(s.y + d.y) / 2} ${d.x}
        ${d.y} ${d.x}`;
        return path;
      }
      var links = treeData.descendants().slice(1);
      var link = this.svg.selectAll("path.link").data(links, function(d) {
        return d.id;
      });
      var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = { x: source.x0, y: source.y };
          return diagonal(o, o);
        });
      var linkUpdate = linkEnter.merge(link);
      linkUpdate
        .transition()
        .duration(this.duration)
        .attr("d", function(d) {
          return diagonal(d, d.parent);
        });

      var linkExit = link
        .exit()
        .transition()
        .duration(this.duration)
        .attr("d", function(d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        })
        .remove();

      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      function click(event, d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
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
</style>
