// Iteratively assign the depth for each node.
// Nodes are assigned the maximum depth of incoming neighbors plus one;
// nodes with no incoming links are assigned depth zero, while

import { Graph, GraphData, Link, Node } from "../model";
import { align } from "../align";

const computeNodeDepth = (
  data: Readonly<GraphData>,
  getLinks: keyof Pick<GraphData, "getSourceLinks" | "getTargetLinks">,
  linkField: keyof Pick<Link, "target" | "source">,
  valueField: keyof Pick<Node, "height" | "depth">
) => {
  let nodes: Node[],
    x: number = 0;
  // const next = new Set<string>/
  const nextNodeIds = new Set<string>();

  const sortedNodes = data.getNodes();

  for (nodes = sortedNodes; nodes.length; ++x) {
    nextNodeIds.clear();
    nodes.forEach((node) => {
      node[valueField] = x;

      data[getLinks](node).forEach((link: Link) => {
        const nextId = link[linkField];
        if (nextId && !link.circular) {
          nextNodeIds.add(nextId);
        }
      });
    });

    if (nodes.length === nextNodeIds.size) {
      console.warn("something is wrong here !!!");
      nodes = [];
    } else {
      nodes = [];
      nextNodeIds.forEach((nodeId) => {
        const node = data.getNode(nodeId);
        nodes.push(node);
      });
    }
  }

  return x;
};

// nodes with no outgoing links are assigned the maximum depth.
export const computeNodeDepths = (graph: Readonly<Graph<any, any>>) => {
  const { sortNodes, graph: data } = graph;

  // TODO if needed sort them

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
  const maxDepth = computeNodeDepth(data, "getSourceLinks", "target", "depth");
  const maxHeight = computeNodeDepth(
    data,
    "getTargetLinks",
    "source",
    "height"
  );

  // Align end nodes to the end of the graph
  data.forEachNode((node) => {
    if (!node.hasTarget) node.depth = maxDepth;
  });


  // assign column numbers, and get max value
  data.forEachNode((node: Node) => {
    const column = sortNodes === null ? align(node, node.depth) : node.column;

    node.column = column;
    node.depth = node.depth ?? 0;
    node.height = node.height ?? 0;

    //node.column = Math.floor(align.call(null, node, x));
  });

  return data;
};
