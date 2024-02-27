import { buffer } from "d3";
import { linkHorizontal } from "d3-shape";
import { Graph, GraphData, Link, Node } from "./model";
import { selfLinking } from "./utils";
import { findSourceNode, findTargetNode, getSourceLinks } from "./utils/links";
function sortLinkSourceYDescending(link1, link2) {
  return link2.y0 - link1.y0;
} // sort ascending links by their target vertical position, y1
function sortLinkTargetYAscending(link1, link2) {
  return link1.y1 - link2.y1;
}
function sortLinkSourceYAscending(link1, link2) {
  return link1.y0 - link2.y0;
} // sort descending links by their target vertical position, y1
function sortLinkTargetYDescending(link1, link2) {
  return link2.y1 - link1.y1;
}
const computePath = (
  link: Link,
  links: Link[],
  nodes: Node[],
  { getNodeID, sankey }: Pick<Graph<Node, Link>, "getNodeID" | "sankey">
): Link => {
  if (link.circular) {
    // link.path = createCircularPathString(link);
  } else {
    var normalPath = linkHorizontal()
      .source(function (d) {
        const source = findSourceNode(link, nodes, getNodeID);
        var x = source.x0 + (source.x1 - source.x0);
        var y = d.y0;
        return [x, y];
      })
      .target(function (d) {
        const target = findTargetNode(link, nodes, getNodeID);
        var x = target.x0;
        var y = d.y1;
        console.log([x, y]);
        return [x, y];
      });
    link.path = normalPath(link);
  }

  return link;
};

export const computeLinkPaths = (
  inputGraph: Readonly<GraphData>,
  settings: Graph
) => {
  const links = inputGraph.links.map((link) =>
    computePath(link, inputGraph.links, inputGraph.nodes, settings)
  );
  return { ...inputGraph, links };
};
