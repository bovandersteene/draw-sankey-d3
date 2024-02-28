import * as d3 from "d3";
import { Graph, GraphArrow, Link, Node } from "./model";

const drawArrow = (arrowSetup: GraphArrow) => {
  // let totalDashArrayLength = arrowSetup.length + arrowSetup.gapLength;
  // var arrowsG = linkG
  //   .data(graph.links)
  //   .enter()
  //   .append("g")
  //   .attr("class", "g-arrow");
  // let arrows = arrowsG
  //   .append("path")
  //   .attr("d", arrowSetup.path)
  //   .style("stroke-width", 1)
  //   .style("stroke", arrowSetup.color)
  //   .style("stroke-dasharray", arrowSetup.length + "," + arrowSetup.gapLength);
  // arrows.each((arrow) => {
  //   let thisPath = d3.select(this).node();
  //   let parentG = d3.select(this.parentNode);
  //   let pathLength = thisPath.getTotalLength();
  //   let numberOfArrows = Math.ceil(pathLength / totalDashArrayLength);
  //   // remove the last arrow head if it will overlap the target node
  //   if (
  //     (numberOfArrows - 1) * totalDashArrayLength +
  //       (arrow.length + (arrow.headSize + 1)) >
  //     pathLength
  //   ) {
  //     numberOfArrows = numberOfArrows - 1;
  //   }
  //   let arrowHeadData = d3.range(numberOfArrows).map(function (d, i) {
  //     let length = i * totalDashArrayLength + arrow.length;
  //     let point = thisPath.getPointAtLength(length);
  //     let previousPoint = thisPath.getPointAtLength(length - 2);
  //     let rotation = 0;
  //     if (point.y == previousPoint.y) {
  //       rotation = point.x < previousPoint.x ? 180 : 0;
  //     } else if (point.x == previousPoint.x) {
  //       rotation = point.y < previousPoint.y ? -90 : 90;
  //     } else {
  //       let adj = Math.abs(point.x - previousPoint.x);
  //       let opp = Math.abs(point.y - previousPoint.y);
  //       let angle = Math.atan(opp / adj) * (180 / Math.PI);
  //       if (point.x < previousPoint.x) {
  //         angle = angle + (90 - angle) * 2;
  //       }
  //       if (point.y < previousPoint.y) {
  //         rotation = -angle;
  //       } else {
  //         rotation = angle;
  //       }
  //     }
  //     return { x: point.x, y: point.y, rotation: rotation };
  //   });
  //   let arrowHeads = parentG
  //     .selectAll(".arrow-heads")
  //     .data(arrowHeadData)
  //     .enter()
  //     .append("path")
  //     .attr("d", function (d) {
  //       return (
  //         "M" +
  //         d.x +
  //         "," +
  //         (d.y - arrow.headSize / 2) +
  //         " " +
  //         "L" +
  //         (d.x + arrow.headSize) +
  //         "," +
  //         d.y +
  //         " " +
  //         "L" +
  //         d.x +
  //         "," +
  //         (d.y + arrow.headSize / 2)
  //       );
  //     })
  //     .attr("class", "arrow-head")
  //     .attr("transform", function (d) {
  //       return "rotate(" + d.rotation + "," + d.x + "," + d.y + ")";
  //     })
  //     .style("fill", arrow.color);
  // });
};

export const drawSankey = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>
) => {
  const { width, height, padding, graph, nodeColor, arrow } = graphSetup;
  let svg = d3
    .create("svg")
    .attr("width", width + padding + padding)
    .attr("height", height + padding + padding);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + padding + ")");

  let linkG = g
    .append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

  let nodeG = g
    .append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

  var node = nodeG.data(graph.nodes).enter().append("g");

  node
    .append("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .attr("width", function (d) {
      return d.width;
    })
    .style("fill", nodeColor)
    .style("stroke", "grey")
    .style("opacity", 0.5)
    .on("mouseover", function (d) {
      let thisName = d.name;

      node.selectAll("rect").style("opacity", function (d) {
        return highlightNodes(d, thisName);
      });

      svg.selectAll(".sankey-link").style("opacity", function (l) {
        return l.source.name == thisName || l.target.name == thisName ? 1 : 0.3;
      });

      node.selectAll("text").style("opacity", function (d) {
        return highlightNodes(d, thisName);
      });
    })
    .on("mouseout", function (d) {
      d3.selectAll("rect").style("opacity", 0.5);
      d3.selectAll(".sankey-link").style("opacity", 0.7);
      d3.selectAll("text").style("opacity", 1);
    });

  node
    .append("text")
    .attr("x", (d) => d.x0)
    .attr("y", function (d) {
      let y = d.y0 - 12;
      y = y < graph.y0 ? d.y1 + 12 : y;
      return y;
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.name;
    });

  node.append("title").text(function (d) {
    return d.name + "\n" + d.value;
  });

  var link = linkG.data(graph.links).enter().append("g");

  link
    .filter((d) => d.path)
    .append("path")
    .attr("class", "sankey-link")
    .attr("d", function (link) {
      return link.path;
    })
    .style("stroke-width", function (d) {
      return Math.max(1, d.width);
    })
    .style("opacity", 0.7)
    .style("stroke", function (link, i) {
      if (link.circular) {
        return "red";
      } else if (link.type == "virtual") {
        return "yellow";
      } else if (link.type == "replaced") {
        return "blue";
      } else {
        return "black";
      }
      //return link.circular ? "red" : "black";
    });

  link.append("title").text(function (d) {
    return d.source.name + " → " + d.target.name + "\n Index: " + d.index;
  });

  if (arrow && arrow.draw) {
    drawArrow(arrow);
  }

  function highlightNodes(node, name) {
    let opacity = 0.3;

    if (node.name == name) {
      opacity = 1;
    }
    // node.sourceLinks.forEach(function (link) {
    //   if (link.target.name == name) {
    //     opacity = 1;
    //   }
    // });
    // node.targetLinks.forEach(function (link) {
    //   if (link.source.name == name) {
    //     opacity = 1;
    //   }
    // });

    return opacity;
  }

  return svg.node();
};
