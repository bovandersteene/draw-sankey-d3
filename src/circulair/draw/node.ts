import { Graph, GraphData, GraphExtend, Link, Node } from "../model";
import * as d3 from "d3";
import { mouseOut } from "./const";
type G_EL = d3.Selection<SVGGElement, undefined, null, undefined>;
type SVG = d3.Selection<SVGSVGElement, undefined, null, undefined>;
type NODE<NODE_TYPE extends Node = any> = d3.Selection<
  d3.EnterElement,
  NODE_TYPE,
  SVGGElement,
  undefined
>;

export const drawNodes = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  g: G_EL,
  svg: SVG
) => {
  const nodes = graphSetup.graph.getNodes();
  const { width, height, padding, graph, nodeColor, arrow } = graphSetup;
  const { extend } = graphSetup.graph;

  const nodeG = g
    .append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

  const node = nodeG.data(nodes).enter().append("g");

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
      return d.x1 - d.x0;
    })
    .style("fill", nodeColor)
    .style("stroke", "grey")
    .style("opacity", 0.5)
    .attr("id", (d) => d._id)
    .on("mouseover", mouseOverNode(node, svg, graph))
    .on("mouseout", mouseOut(svg));

  node
    .append("text")
    .attr("x", (d) => d.x0)
    .attr("y", function (d) {
      let y = d.y0 - 12;
      y = y < extend.y0 ? d.y1 + 12 : y;
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

  return node;
};

export const mouseOverNode = (nodes: any, svg: SVG, graph: GraphData) => {
  return (d) => {
    const _id = d.srcElement.id;

    nodes.selectAll("rect").style("opacity", highlightNodes(_id, graph));

    svg.selectAll(".sankey-link").style("opacity", (l: Link) => {
      return l.source === _id || l.target === _id ? 1 : 0.3;
    });

    nodes.selectAll("text").style("opacity", highlightNodes(_id, graph));
  };
};

export const highlightNodes = (name, graph: GraphData) => (node: any) => {
  let opacity = 0.3;

  if (node.name === name) {
    opacity = 1;
  }

  graph.getSourceLinks(node).forEach((link) => {
    if (link.target === node._id) {
      opacity = 1;
    }
  });

  graph.getTargetLinks(node).forEach((link) => {
    if (link.source === node._id) {
      opacity = 1;
    }
  });

  return opacity;
};
