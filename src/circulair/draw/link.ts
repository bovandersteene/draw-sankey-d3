import { Graph, GraphData, Link, Node } from "../model";
import { opacity, mouseOut } from "./const";
import * as d3 from "d3";

type G_EL = d3.Selection<SVGGElement, undefined, null, undefined>;
type SVG = d3.Selection<SVGSVGElement, undefined, null, undefined>;

export const drawLinks = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  g: G_EL,
  svg: SVG
) => {
  const links = graphSetup.graph.getLinks();
  const linkG = g
    .append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

  const link = linkG.data(links).enter().append("g");

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
    .style("opacity", opacity.normal)
    .style("stroke", function (link, i) {
      if (link.circular) {
        return "red";
      } else if (link.type === "virtual") {
        return "yellow";
      } else if (link.type === "replaced") {
        return "blue";
      } else {
        return "black";
      }
      // return link.circular ? "red" : "black";
    })
    .attr("id", (d) => d._id)
    .on("mouseover", mouseOver(svg, graphSetup.graph))
    .on("mouseout", mouseOut(svg));

  link.append("title").text(function (d) {
    const { source, target } = graphSetup.graph.getNodeLinks(d);
    return source.name + " → " + target.name + "\n Index: " + d.index;
  });

  //   if (arrow && arrow.draw) {
  //     drawArrows(arrow, linkG, graph.getLinks());
  //   }
};

export const mouseOver = (svg: SVG, graph: GraphData) => {
  return (d) => {
    const _id = d.srcElement.id;
    const link = graph.getLink(_id);
    console.log(_id);

    svg.selectAll("rect").style("opacity", highlightNodes(link, graph));

    svg.selectAll(".sankey-link").style("opacity", (l: Link) => {
      return l._id === _id ? opacity.highlight : opacity.noHighlight;
    });

    svg.selectAll("text").style("opacity", highlightNodes(link, graph));
  };
};

export const highlightNodes = (link: Link, graph: GraphData) => (node: any) => {
  return link.source === node._id || link.target === node._id
    ? opacity.highlight
    : opacity.noHighlight;
};
