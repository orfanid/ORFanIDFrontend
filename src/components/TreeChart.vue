<template>
  <div class="chart-container">
    <v-toolbar style="position: fixed; top: 0; right: 0;">
      <v-btn icon @click="zoomIn">
        <v-icon>mdi-magnify-plus</v-icon>
      </v-btn>

      <v-btn icon @click="zoomOut">
        <v-icon>mdi-magnify-minus</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="svg-wrapper" style="overflow: auto;">
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
      svg: null,
      i: 0,
      duration: 750,
      nodeExit: null,
      zoom: d3
        .zoom()
        .scaleExtent([0.6, 7])
        .on("zoom", event => {
          this.svg.attr("transform", event.transform);
        })
    };
  },
  mounted() {
    this.initChat();

    // Add event listeners for mouse events
    this.svg
      .on("mousedown", this.onMouseDown)
      .on("mousemove", this.onMouseMove)
      .on("mouseup", this.onMouseUp);
  },
  methods: {
    initChat() {
      var margin = { top: 20, right: 90, bottom: 20, left: 90 };
            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            const dimensions = this.calculateTreeDimensions(this.chartData);
            //This config help to calculate the width and height of the tree and display it with full width
            // this.svg = d3
            //   .select(".svgcontainer")
            //   .attr("width", dimensions.width + margin.right + margin.left)
            //   .attr("height", dimensions.height + margin.top + margin.bottom)
            //   .append("g")
            //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.svg = d3
              .select(".svgcontainer")
              .attr("width", window.innerWidth)
              .attr("height", window.innerHeight)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.i = 0;
            this.duration = 750;

            this.treemap = d3.tree().size([dimensions.height, dimensions.width]);
            this.root = d3.hierarchy(this.chartData, function(d) {
              return d.children;
            });
            this.root.x0 = dimensions.height / 2;
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

            node
              .exit()
              .transition()
              .duration(this.duration)
              .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
              })
              .remove();

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

            function click(d) {
              if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
              update(d);
            }
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
              return (
                node.children.length + Math.max(...node.children.map(child => this.getMaxBreadth(child)))
              );
            }
          },
          zoomIn() {
            const svgContainer = this.svg.node();
            const containerWidth = svgContainer.clientWidth;
            const containerHeight = svgContainer.clientHeight;
            const currentTransform = d3.zoomTransform(svgContainer);

            const newScale = currentTransform.k * 2;
            const newX = containerWidth / 2 - (containerWidth / 2 - currentTransform.x) * 2;
            const newY = containerHeight / 2 - (containerHeight / 2 - currentTransform.y) * 2;

            this.svg
              .transition()
              .duration(750)
              .call(this.zoom.transform, d3.zoomIdentity.translate(newX, newY).scale(newScale));
          },

          zoomOut() {
            const svgContainer = this.svg.node();
            const containerWidth = svgContainer.clientWidth;
            const containerHeight = svgContainer.clientHeight;
            const currentTransform = d3.zoomTransform(svgContainer);

            const newScale = currentTransform.k * 0.5;
            const newX = containerWidth / 2 - (containerWidth / 2 - currentTransform.x) * 0.5;
            const newY = containerHeight / 2 - (containerHeight / 2 - currentTransform.y) * 0.5;

            this.svg
              .transition()
              .duration(750)
              .call(this.zoom.transform, d3.zoomIdentity.translate(newX, newY).scale(newScale));
          },
          onMouseDown(event) {
            // Store the initial mouse position
            this.initialMousePos = { x: event.clientX, y: event.clientY };
            // Store the initial transform of the SVG
            this.initialTransform = d3.zoomTransform(this.svg.node());
          },

          onMouseMove(event) {
            // Check if the mouse button is pressed
            if (event.buttons === 1) {
              // Calculate the distance moved by the mouse
              const dx = event.clientX - this.initialMousePos.x;
              const dy = event.clientY - this.initialMousePos.y;

              // Calculate the new transform based on the initial transform and the mouse movement
              const newTransform = this.initialTransform.translate(dx, dy);

              // Apply the new transform to the SVG
              this.svg.attr("transform", newTransform);
            }
          },

          onMouseUp() {
            // Clear the initial mouse position and transform
            this.initialMousePos = null;
            this.initialTransform = null;
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
        width: 100vw - 10px; /* Full width of viewport */
        height: 100vh - 10px; /* Full height of viewport */
        overflow: auto;
        position: relative;
        cursor: move; /* Add this line to set the mouse cursor to move icon */
      }

      .svg-wrapper {
        width: fit-content;
        height: fit-content;
        margin-right: 20px; /* Adjust for margin */
        margin-bottom: 20px; /* Adjust for margin */
      }
</style>
