// Iteratively assign the depth for each node.
// Nodes are assigned the maximum depth of incoming neighbors plus one;
// nodes with no incoming links are assigned depth zero, while

import { groupBy } from "lodash";
import { GraphData, Graph, Node, Link } from "./model";
import { align } from "./align";
import { getColumn } from "./utils";
import { getSourceLinks, getTargetLinks, findNode } from "./utils/links";
import { sort } from "d3-array";

const computeNodeDepth = (
  sortedNodes: Node[],
  links: Link[],
  getLinks: (
    node: Node,
    links: Link[],
    getNodeID: (node: Node) => string
  ) => Link[],
  linkField: keyof Pick<Link, "target" | "source">,
  valueField: keyof Pick<Node, "height" | "depth">,
  { getNodeID }: Pick<Graph, "getNodeID">
) => {
  let nodes: Node[],
    next: Node[],
    x: number = 0;

  const nodeById = groupBy(sortedNodes, getNodeID);

  for (
    nodes = sortedNodes, next = [];
    nodes.length;
    ++x, nodes = next, next = []
  ) {
    nodes.forEach((node) => {
      nodeById[getNodeID(node)][0][valueField] = x;
      getLinks(node, links, getNodeID).forEach((link: Link) => {
        const nextId = link[linkField];
        if (nextId) {
          const t = findNode(nextId, sortedNodes, getNodeID);
          if (t && next.indexOf(t) < 0 && !link.circular) {
            next.push(t);
          }
        }
      });
    });
  }

  return Object.values(nodeById).flat();
};

// nodes with no outgoing links are assigned the maximum depth.
export const computeNodeDepths = (
  inputGraph: Readonly<GraphData>,
  settings: Pick<Graph, "sortNodes" | "getNodeID">
) => {
  const { sortNodes } = settings;

  // TODO if needed sort them
  let sortedNodes = inputGraph.nodes;

  // if (sortNodes != null && sortNodes(graph.nodes[0]) != undefined) {
  //   graph.nodes.sort(function (a, b) {
  //     return sortNodes(a) < sortNodes(b) ? -1 : 1;
  //   });

  //   let c = 0;
  //   var currentSortIndex = sortNodes(graph.nodes[0]);

  //   graph.nodes.forEach(function (node) {
  //     c = sortNodes(node) == currentSortIndex ? c : c + 1;

  //     currentSortIndex =
  //       sortNodes(node) == currentSortIndex
  //         ? currentSortIndex
  //         : sortNodes(node);
  //     node.column = c;
  //   });
  // }

  // Search for the end nodes

  sortedNodes = computeNodeDepth(
    sortedNodes,
    inputGraph.links,
    getSourceLinks,
    "target",
    "depth",
    settings
  );
  sortedNodes = computeNodeDepth(
    sortedNodes,
    inputGraph.links,
    getTargetLinks,
    "source",
    "height",
    settings
  );

  // assign column numbers, and get max value
  sortedNodes = sortedNodes.map((node) => {
    const column =
      sortNodes === null || sortedNodes === undefined
        ? align(node, node.depth)
        : getColumn(node);
    const depth = node.depth ?? 0;
    const height = node.height ?? 0;

    return { ...node, column, depth, height };
    //node.column = Math.floor(align.call(null, node, x));
  });

  return { ...inputGraph, nodes: sortedNodes };
};
