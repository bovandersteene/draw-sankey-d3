import { Graph, GraphData, Node, Link } from "../model";
import { nodeHeight, nodeWidth } from "../utils/node";
import { mouseOut } from "./const";
import * as d3 from "d3";
import { TextProps, createTextElement } from "./text-element";

type G_EL = d3.Selection<SVGGElement, undefined, null, undefined>;
type SVG = d3.Selection<SVGSVGElement, undefined, null, undefined>;

export const drawNodes = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  g: G_EL,
  svg: SVG,
  update: () => void,
  textProps: TextProps<any>
) => {
  const { nodeText } = graphSetup;
  const { node, nodeG } = drawNode(graphSetup, g, svg, () => update());

  createTextElement(node, nodeText, textProps);

  return { node, nodeG };
};

export const drawNode = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  g: G_EL,
  svg: SVG,
  dragEvent: () => void
) => {
  const nodes = graphSetup.graph.getNodes();
  const { graph, nodeColor, nodeText } = graphSetup;

  const nodeG = g
    .append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");
  const dragHandler = d3
    .drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);

  function dragStarted(event, d) {
    console.log(event);
  }

  function dragged(event, d) {
    d3.select(this)
      .attr("cx", event.x)
      .attr("cy", event.y)
      .attr("x", event.x)
      .attr("y", event.y);
  }

  function dragEnded(event, d) {
    const height = nodeHeight(d);
    const width = nodeWidth(d);
    d.x0 = event.x;
    d.y0 = event.y;
    d.x1 = d.x0 + width;
    d.y0 = d.y0 + width;
    console.log(event);
    dragEvent();
  }

  const node = nodeG.data(nodes).enter().append("g");

  const nodeRect = node
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .style("fill", nodeColor)
    .style("stroke", "grey")
    .style("opacity", 0.5)
    .attr("id", (d) => d._id)
    .on("mouseover", mouseOverNode(node, svg, graph))
    .on("mouseout", mouseOut(svg));

  node.append("title").text((d) => {
    return nodeText(d) + "\n" + d.value;
  });

  dragHandler(nodeRect);

  return { nodeG, node };
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

export const highlightNodes =
  (name: string, graph: GraphData) => (node: any) => {
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
