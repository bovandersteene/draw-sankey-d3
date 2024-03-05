/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

import { drawArrow } from "../draw/arrow";
import { Setup, GraphSetup } from "../draw/graph-setup";
import { drawLinks } from "../draw/link";
import { TextProps } from "../draw/text-element";
import { SankeyData, Link, Node } from "../model";
import { drawNodes } from "../draw/node";
import * as d3 from "d3";

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

  const { width, height, padding, sankey, nodeColor, arrow } = graphSetup;
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

  const { nodeG, nodes } = drawNodes(
    graphSetup,
    g,
    svg,
    () => updateDrawing(),
    textProps
  );
  const { linkG, links } = drawLinks(graphSetup, g, svg);
  drawArrow(graphSetup, links, linkG);

  const updateDrawing = () => {
    console.log("change the data");
    graphSetup.dragEhub();
    nodeG.data(data.nodes);
    linkG.data(links);
  };

  document.getElementById(documentId)?.appendChild(svg.node()!);
};
