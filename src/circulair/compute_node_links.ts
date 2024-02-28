// Populate the sourceLinks and targetLinks for each node.

import { Graph, GraphData, Link } from "./model";
import { groupBy, set } from "lodash";
import { _typeof, findNode } from "./utils";
import { findSourceNode, findTargetNode } from "./utils/links";
import { addIndexToLink } from "./utils/node";

// Also, if the source and target are not objects, assume they are indices.
export const computeNodeLinks = (
  inputGraph: GraphData,
  settings: Pick<Graph, "getNodeID">
): GraphData => {
  //let graph = cloneDeep(inputGraph);

  const nodes = inputGraph.nodes.map((node, index) => ({
    ...node,
    index,
  }));

  const links: Link[] = inputGraph.links.map((link, i) => {
    return addIndexToLink(link, i, nodes, settings);
  });

  return { ...inputGraph, nodes, links };
};
