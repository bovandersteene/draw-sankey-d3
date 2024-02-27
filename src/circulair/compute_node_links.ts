// Populate the sourceLinks and targetLinks for each node.

import { Graph, GraphData, Link } from "./model";
import { groupBy } from "lodash";
import { _typeof, findNode } from "./utils";
import { findSourceNode, findTargetNode } from "./utils/links";

// Also, if the source and target are not objects, assume they are indices.
export const computeNodeLinks = (
  inputGraph: GraphData,
  { getNodeID }: Pick<Graph, "getNodeID">
): GraphData => {
  //let graph = cloneDeep(inputGraph);

  const nodes = inputGraph.nodes.map((node, index) => ({
    ...node,
    index,
    sourceLinks: [],
    targetLinks: [],
  }));

  const links: Link[] = inputGraph.links.map((link, i) => {
    link.index = i;
    let source = findSourceNode(link, nodes, getNodeID);
    let target = findTargetNode(link, nodes, getNodeID);
    // if (
    //   (typeof source === "undefined" ? "undefined" : _typeof(source)) !==
    //   "object"
    // ) {
    //   source = link.source = findNode(nodeById, source);
    // }
    // if (
    //   (typeof target === "undefined" ? "undefined" : _typeof(target)) !==
    //   "object"
    // ) {
    //   target = link.target = findNode(nodeById, target);
    // }
    // source.sourceLinks.push(link);
    // target.targetLinks.push(link);

    return { ...link, sourceIndex: source.index, targetIndex: target.index };
  });

  return { ...inputGraph, nodes, links };
};
