/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

import { drawArrows, updateArrow } from "../draw/arrow";
import { Setup, GraphSetup } from "../draw/graph-setup";
import { drawLinks, updateLink } from "../draw/link";
import { SankeyData, Link, Node } from "../model";
import * as d3 from "d3";
import { drawNode, drawNodes } from "../draw/node";
import { TextProps, createTextElement, updateText } from "../draw/text-element";

export const drawSankeyCirculair = <
  DATA extends SankeyData,
  NODE_TYPE extends Node,
  LINK_TYPE extends Link
>(
  documentId: string,
  data: DATA,
  setup?: Setup<NODE_TYPE, LINK_TYPE>
) => {
  const graphSetup = new GraphSetup(setup);
  // console.log(data);
  graphSetup.generateSankeyData(data);
  // console.log(graphSetup.graph);
  // console.table(graphSetup.graph.links);
  // console.table(graphSetup.graph.nodes);

  const { extend } = graphSetup.graph;
  const { width, height, padding, sankey, nodeColor, arrow } = graphSetup;
  const svg = d3
    .create("svg")
    .attr("width", width + padding + padding)
    .attr("height", height + padding + padding);

  const g = svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + padding + ")");

  const textProps: TextProps<Node> = {
    y: (d) => {
      let y = d.y0 - 5;
      y = y < extend.y0 ? d.y1 + 5 : y;
      return y;
    },
  };

  const { nodeText } = graphSetup;
  const { node } = drawNode(graphSetup, g, svg, (node: Node) =>
    updateDrawing(node)
  );
  const { text } = createTextElement(node, nodeText, textProps);
  const { linkG, links, linkData, linkPaths } = drawLinks(
    graphSetup,
    g,
    svg,
    (d) => Math.max(1, d.width)
  );
  const { arrows } = drawArrows(graphSetup, links, linkG);

  const updateDrawing = (node: Node) => {
    if (node) graphSetup.dragSankey(node);
    updateLink(graphSetup, linkData, linkPaths);
    updateText(text, nodeText, textProps);
    // updateArrow(arrows);
  };
  document.getElementById(documentId)?.appendChild(svg.node()!);

  //d3.select(documentId).append(sankey as any);
};
