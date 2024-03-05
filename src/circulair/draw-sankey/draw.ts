import * as d3 from "d3";
import { type Graph, type Link, type Node } from "../model";
import { drawNodes } from "./node";
import { drawLinks } from "../draw/link";
import { drawArrows } from "../draw/arrow";

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

  const { linkG, links } = drawLinks(graphSetup, g, svg, (d) =>
    Math.max(1, d.width)
  );
  drawArrows(graphSetup, links, linkG);
  return svg.node();
};
