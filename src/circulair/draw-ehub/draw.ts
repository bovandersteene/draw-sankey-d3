/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

import { drawArrow, updateArrow } from "../draw/arrow";
import { Setup, GraphSetup } from "../draw/graph-setup";
import { drawLinks, updateLink } from "../draw/link";
import { TextProps, createTextElement, updateText } from "../draw/text-element";
import { SankeyData, Link, Node } from "../model";
import { drawNode, drawNodes } from "../draw/node";
import * as d3 from "d3";
import { pick } from "lodash";

export const drawEhub = <
  DATA extends SankeyData,
  NODE_TYPE extends Node,
  LINK_TYPE extends Link
>(
  documentId: string,
  data: DATA,
  setup?: Setup<NODE_TYPE, LINK_TYPE>
) => {
  const graphSetup = new GraphSetup(setup);
  graphSetup.generateEhubData(data);

  const { width, height, padding, sankey, nodeColor } = graphSetup;
  const svg = d3
    .create("svg")
    .attr("width", width + padding + padding)
    .attr("height", height + padding + padding);

  const g = svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + padding + ")");

  const textProps: TextProps<Node> = {
    width: sankey.nodeWidth - 10,
    anchor: "right",
    x: (d) => d.x0 + 15,
    y: (d) => d.y0 + 5,
    wordBreak: true,
  };
  const { nodeText } = graphSetup;

  const { node } = drawNode(graphSetup, g, svg, (node: Node) =>
    updateDrawing(node)
  );

  const { text } = createTextElement(node, nodeText, textProps);

  const { linkG, links, linkData, linkPaths } = drawLinks(graphSetup, g, svg);
  const { arrows } = drawArrow(graphSetup, links, linkG);

  const updateDrawing = (node?: Node) => {
    if (node) graphSetup.dragEhub(node);

    updateLink(graphSetup, linkData, linkPaths);
    updateText(text, nodeText, textProps);
    updateArrow(arrows);
  };

  document.getElementById(documentId)?.appendChild(svg.node()!);
};
