import { Graph, GraphData, Link, Node } from "../model";
import { opacity, mouseOut } from "./const";
import * as d3 from "d3";

type G_EL = d3.Selection<SVGGElement, undefined, null, undefined>;
type SVG = d3.Selection<SVGSVGElement, undefined, null, undefined>;

export const drawLinks = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  g: G_EL,
  svg: SVG,
  width?: (l: LINK_TYPE) => number | number
) => {
  const { linkColor } = graphSetup;
  const links = graphSetup.graph.filterLinks((d) => !!d.path);
  const linkG = g
    .append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

  const linkData = linkG.data(links);

  const link = linkData.enter().append("g");
  const widthFn = width ?? (() => 5);

  const linkPaths = link
    .append("path")
    .attr("class", "sankey-link")
    .attr("d", (link) => link.path)
    .style("stroke-width", widthFn)
    .style("opacity", opacity.normal)
    .style("stroke", linkColor)
    .attr("id", (d) => d._id)
    .on("mouseover", mouseOver(svg, graphSetup.graph))
    .on("mouseout", mouseOut(svg));
  //.attr("marker-end", "url(#arrow)");

  link.append("title").text(function (d) {
    const { source, target } = graphSetup.graph.getNodeLinks(d);
    return source.name + " → " + target.name + "\n Index: " + d.index;
  });

  return { linkG, links, linkData, link, linkPaths };
};

export const updateLink = <NODE_TYPE extends Node, LINK_TYPE extends Link>(
  graphSetup: Graph<NODE_TYPE, LINK_TYPE>,
  linkData,
  linkPaths
) => {
  linkData.data(graphSetup.graph.filterLinks((d) => !!d.path));
  linkPaths.attr("d", (l) => l.path);
};

export const mouseOver = (svg: SVG, graph: GraphData) => {
  return (d) => {
    const _id = d.srcElement.id;
    const link = graph.getLink(_id);
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
