// Populate the sourceLinks and targetLinks for each node.

import { Graph, GraphData } from "./model";
import { cloneDeep } from "lodash";
import { _typeof } from "./utils";

import findCircuits from "elementary-circuits-directed-graph";

export const identifyCircles = (
  inputGraph: GraphData,
  { sortNodes, getNodeID }: Pick<Graph, "sortNodes" | "getNodeID">
): GraphData => {
  let graph = cloneDeep(inputGraph);

  var circularLinkID = 0;
  if (sortNodes === null || sortNodes(graph.nodes[0]) === undefined) {
    // Building adjacency graph
    const adjList: number[][] = [];
    for (var i = 0; i < graph.links.length; i++) {
      const link = graph.links[i];
      const source = link.sourceIndex;
      const target = link.targetIndex;

      if (!adjList[source]) adjList[source] = [];
      if (!adjList[target]) adjList[target] = [];

      // Add links if not already in set
      if (adjList[source].indexOf(target) === -1) adjList[source].push(target);
    }

    // Find all elementary circuits
    const cycles = findCircuits(adjList);

    // Sort by circuits length
    cycles.sort(function (a, b) {
      return a.length - b.length;
    });

    const circularLinks = {};
    for (i = 0; i < cycles.length; i++) {
      const cycle = cycles[i];
      const last = cycle.slice(-2);
      if (!circularLinks[last[0]]) circularLinks[last[0]] = {};
      circularLinks[last[0]][last[1]] = true;
    }

    graph.links.forEach((link) => {
      const source = link.sourceIndex;
      const target = link.targetIndex;
      // If self-linking or a back-edge
      if (
        target === source ||
        (circularLinks[source] && circularLinks[source][target])
      ) {
        link.circular = true;
        link.circularLinkID = circularLinkID;
        circularLinkID = circularLinkID + 1;
      } else {
        link.circular = false;
      }
    });
  } else {
    graph.links.forEach(function (link) {
      //if (link.source[sortNodes] < link.target[sortNodes]) {
      if (sortNodes(link.source) < sortNodes(link.target)) {
        link.circular = false;
      } else {
        link.circular = true;
        link.circularLinkID = circularLinkID;
        circularLinkID = circularLinkID + 1;
      }
    });
  }

  return graph;
};
