import { buffer } from "d3";
import { linkHorizontal } from "d3-shape";
import { Graph, GraphData, Link, Node } from "./model";
import { selfLinking } from "./utils";
import { findSourceNode, findTargetNode, getSourceLinks } from "./utils/links";
import { computeCircularPathString } from "./compute-circulair-path";
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

const computeNormalPath = (
  link: Readonly<Link>,
  source: Readonly<Node>,
  target: Readonly<Node>
) => {
  const normalPath = linkHorizontal()
    .source((d: any) => {
      var x = source.x0 + (source.x1 - source.x0);
      var y = d.y0;
      return [x, y];
    })
    .target((d: any) => {
      var x = target.x0;
      var y = d.y1;
      return [x, y];
    });

  return normalPath(link as any);
};
const computePath = (
  link: Link,
  nodes: Node[],
  { getNodeID }: Pick<Graph<Node, Link>, "getNodeID">
): Link => {
  let path: string | null;
  const source = findSourceNode(link, nodes, getNodeID);
  const target = findTargetNode(link, nodes, getNodeID);

  if (link.circular) {
    path = computeCircularPathString(link);
  } else {
    path = computeNormalPath(link, source, target);
  }

  return { ...link, path };
};

export const computeLinkPaths = (
  inputGraph: Readonly<GraphData>,
  settings: Graph
) => {
  const links = inputGraph.links.map((link) =>
    computePath(link, inputGraph.nodes, settings)
  );
  return { ...inputGraph, links };
};
