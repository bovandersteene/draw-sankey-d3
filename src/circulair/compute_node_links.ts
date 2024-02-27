// Populate the sourceLinks and targetLinks for each node.

import { Graph, GraphData, Link } from "./model";
import { groupBy } from "lodash";
import { _typeof, findNode } from "./utils";

// Also, if the source and target are not objects, assume they are indices.
export const computeNodeLinks = (
  inputGraph: Readonly<GraphData>,
  { getNodeID }: Pick<Graph, "getNodeID">
): GraphData => {
  //let graph = cloneDeep(inputGraph);

  const nodes = inputGraph.nodes.map((node, index) => ({
    ...node,
    index,
    sourceLinks: [],
    targetLinks: [],
  }));

  const nodeById = groupBy(nodes, getNodeID);

  const links: Link[] = inputGraph.links.map((link, i) => {
    link.index = i;
    let source = link.source;
    let target = link.target;
    if (
      (typeof source === "undefined" ? "undefined" : _typeof(source)) !==
      "object"
    ) {
      source = link.source = findNode(nodeById, source);
    }
    if (
      (typeof target === "undefined" ? "undefined" : _typeof(target)) !==
      "object"
    ) {
      target = link.target = findNode(nodeById, target);
    }
    source.sourceLinks.push(link);
    target.targetLinks.push(link);

    return link;
  });

  return { ...inputGraph, nodes, links };
};
