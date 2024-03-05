// Populate the sourceLinks and targetLinks for each node.

import { Graph } from "../model";

import findCircuits from "elementary-circuits-directed-graph";

export const identifyCircles = (graph: Readonly<Graph<any, any>>) => {
  const { sortNodes, graph: data } = graph;
  let circularLinkID = 0;
  if (sortNodes === null) {
    // Building adjacency graph
    const adjList: number[][] = [];

    data.forEachLink((link) => {
      const { source: s, target: t } = data.getNodeLinks(link);
      const source = s.index as number;
      const target = t.index as number;

      if (!adjList[source]) adjList[source] = [];
      if (!adjList[target]) adjList[target] = [];

      // Add links if not already in set
      if (adjList[source].indexOf(target) === -1) adjList[source].push(target);
    });

    // Find all elementary circuits
    const cycles = findCircuits(adjList);

    // Sort by circuits length
    cycles.sort(function (a, b) {
      return a.length - b.length;
    });

    const circularLinks = {};
    for (let i = 0; i < cycles.length; i++) {
      const cycle = cycles[i];
      const last = cycle.slice(-2);
      if (!circularLinks[last[0]]) circularLinks[last[0]] = {};
      circularLinks[last[0]][last[1]] = true;
    }

    data.forEachLink((link) => {
      const { source: s, target: t } = data.getNodeLinks(link);
      const source = s.index as number;
      const target = t.index as number;
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
    // data.linkIds.forEach((linkId) => {
    //   const link = getLink(linkId, data.linkMap);
    //   //if (link.source[sortNodes] < link.target[sortNodes]) {
    //   if (sortNodes(link.source) < sortNodes(link.target)) {
    //     link.circular = false;
    //   } else {
    //     link.circular = true;
    //     link.circularLinkID = circularLinkID;
    //     circularLinkID = circularLinkID + 1;
    //   }
    // });
    console.warn("IMPLEMENT sort nodes");
  }

  return data;
};
