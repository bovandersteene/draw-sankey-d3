import { opacity } from "./const";
import { Graph, Link, Node } from "../model";
import * as d3 from "d3";

export const arrowPath = (t: { x: number; y: number }) => {
  const h = 5;
  const w = 10;

  const y = t.y - h;
  const y1 = y + h;
  const y2 = y1 + h;
  const x = t.x - w;
  const x1 = x + w;

  return `M ${x} ${y} 
         L ${x1} ${y1} 
         L ${x} ${y2} 
         z`;
};

export const drawArrow = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  links: LINK_TYPE[],
  linkG: any
) => {
  const { linkColor } = graphSetup;

  const arrowsData = linkG.data(links).enter();
  const arrows = arrowsData
    .append("g")
    .attr("class", "links-arrow")
    .append("path")
    .attr("d", (d) => arrowPath(d.orthogonalPathData!.target))
    .attr("class", "sankey-arrow")
    .style("opacity", opacity.normal)
    .style("fill", linkColor)
    .style("stroke", linkColor);

  return { arrows, arrowsData };
};

export const updateArrow = (arrow) => {
  arrow.attr("d", (d) => arrowPath(d.orthogonalPathData!.target));
};

export const drawArrowInPath = (
  thisPath: any,
  parentG: any,
  totalDashArrayLength: number,
  arrowLength: number,
  arrowHeadSize
) => {
  const arrowColour = "green";
  const pathLength = thisPath.getTotalLength();
  let numberOfArrows = Math.ceil(pathLength / totalDashArrayLength);
  // remove the last arrow head if it will overlap the target node
  if (
    (numberOfArrows - 1) * totalDashArrayLength +
      (arrowLength + (arrowHeadSize + 1)) >
    pathLength
  ) {
    numberOfArrows = numberOfArrows - 1;
  }

  const arrowHeadData = d3.range(numberOfArrows).map(function (d, i) {
    const length = i * totalDashArrayLength + arrowLength;

    const point = thisPath.getPointAtLength(length);
    const previousPoint = thisPath.getPointAtLength(length - 2);

    let rotation = 0;

    if (point.y == previousPoint.y) {
      rotation = point.x < previousPoint.x ? 180 : 0;
    } else if (point.x == previousPoint.x) {
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

    return { x: point.x, y: point.y, rotation: rotation };
  });

  const arrowHeads = parentG
    .selectAll(".arrow-heads")
    .data(arrowHeadData)
    .enter()
    .append("path")
    .attr("d", arrowPath)
    .attr("class", "arrow-head")
    .attr(
      "transform",
      (d) => "rotate(" + d.rotation + "," + d.x + "," + d.y + ")"
    )
    .style("fill", "black")
    .style("opacity", 0.2);

  return arrowHeads;
};

export const drawArrows = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  links: LINK_TYPE[],
  linkG: any
) => {
  const gapLength = 50;
  const arrowLength = 10;
  const arrowHeadSize = 10;
  const totalDashArrayLength = arrowLength + gapLength;

  const arrowsG = linkG
    .data(links)
    .enter()
    .append("g")
    .attr("class", "g-arrow");
  const arrows = arrowsG
    .append("path")
    .attr("d", (l) => l.path)
    .style("stroke-width", 1)
    .style("stroke", "none")
    .style("stroke-dasharray", arrowLength + "," + gapLength);

  arrows.each(function (arrow) {
    const thisPath = d3.select(this).node();
    const parentG = d3.select(this.parentNode);
    drawArrowInPath(
      thisPath,
      parentG,
      totalDashArrayLength,
      arrowLength,
      arrowHeadSize
    );
  });

  return { arrows };
};
