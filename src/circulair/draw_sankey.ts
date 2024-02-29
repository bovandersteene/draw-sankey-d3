import * as d3 from "d3";
import { type Graph, type GraphArrow, type Link, type Node } from "./model";
import { drawNodes, mouseOutNode, mouseOverNode } from "./draw/node";
import { drawLinks } from "./draw/link";

function drawArrow(arrow: any, arrowSetup: GraphArrow) {
  const totalDashArrayLength = arrowSetup.length + arrowSetup.gapLength;
  const thisPath = d3.select(arrow).node();
  const parentG = d3.select(arrow.parentNode);
  const pathLength = 1; // thisPath.getTotalLength();
  let numberOfArrows = Math.ceil(pathLength / totalDashArrayLength);
  // remove the last arrow head if it will overlap the target node
  if (
    (numberOfArrows - 1) * totalDashArrayLength +
      (arrow.length + (arrow.headSize + 1)) >
    pathLength
  ) {
    numberOfArrows = numberOfArrows - 1;
  }
  const arrowHeadData = d3.range(numberOfArrows).map(function (d, i) {
    const length = i * totalDashArrayLength + arrow.length;
    const point = thisPath.getPointAtLength(length);
    const previousPoint = thisPath.getPointAtLength(length - 2);
    let rotation = 0;
    if (point.y === previousPoint.y) {
      rotation = point.x < previousPoint.x ? 180 : 0;
    } else if (point.x === previousPoint.x) {
      rotation = point.y < previousPoint.y ? -90 : 90;
    } else {
      const adj = Math.abs(point.x - previousPoint.x);
      const opp = Math.abs(point.y - previousPoint.y);
      let angle = Math.atan(opp / adj) * (180 / Math.PI);
      if (point.x < previousPoint.x) {
        angle = angle + (90 - angle) * 2;
      }
      if (point.y < previousPoint.y) {
        rotation = -angle;
      } else {
        rotation = angle;
      }
    }
    return { x: point.x, y: point.y, rotation };
  });
  const arrowHeads = parentG
    .selectAll(".arrow-heads")
    .data(arrowHeadData)
    .enter()
    .append("path")
    .attr("d", function (d) {
      return (
        "M" +
        d.x +
        "," +
        (d.y - arrow.headSize / 2) +
        " " +
        "L" +
        (d.x + arrow.headSize) +
        "," +
        d.y +
        " " +
        "L" +
        d.x +
        "," +
        (d.y + arrow.headSize / 2)
      );
    })
    .attr("class", "arrow-head")
    .attr("transform", function (d) {
      return "rotate(" + d.rotation + "," + d.x + "," + d.y + ")";
    })
    .style("fill", arrow.color);
}

const drawArrows = (arrowSetup: GraphArrow, linkG: any, links: Link[]) => {
  const arrowsG = linkG
    .data(links)
    .enter()
    .append("g")
    .attr("class", "g-arrow");
  const arrows = arrowsG
    .append("path")
    .attr("d", arrowSetup.path)
    .style("stroke-width", 1)
    .style("stroke", arrowSetup.color)
    .style("stroke-dasharray", arrowSetup.length + "," + arrowSetup.gapLength);

  arrows.each((arrow) => {
    drawArrow(arrow, arrowSetup);
  });
};

export const drawSankey = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>
) => {
  const { width, height, padding, graph, nodeColor, arrow } = graphSetup;
  const svg = d3
    .create("svg")
    .attr("width", width + padding + padding)
    .attr("height", height + padding + padding);

  const g = svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + padding + ")");


  drawNodes(graphSetup, g, svg);
  drawLinks(graphSetup, g, svg);

  
  return svg.node();
};
