/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

import { drawArrows } from "../draw/arrow";
import { Setup, GraphSetup } from "../draw/graph-setup";
import { drawLinks } from "../draw/link";
import { SankeyData, Link, Node } from "../model";
import * as d3 from "d3";
import { drawNodes } from "../draw/node";
import { TextProps } from "../draw/text-element";

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

  const { nodeG, nodes } = drawNodes(
    graphSetup,
    g,
    svg,
    () => updateDrawing(),
    textProps
  );

  const { linkG, links } = drawLinks(graphSetup, g, svg, (d) =>
    Math.max(1, d.width)
  );
  drawArrows(graphSetup, links, linkG);

  const updateDrawing = () => {
    console.log("change the data");
    graphSetup.dragSankey();
    nodeG.data(data.nodes);
    linkG.data(links);
  };
  document.getElementById(documentId)?.appendChild(svg.node()!);

  //d3.select(documentId).append(sankey as any);
};
