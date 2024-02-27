// Populate the sourceLinks and targetLinks for each node.

import { Graph, GraphData } from "./model";
import { cloneDeep } from "lodash";
import * as d3 from "d3";
import { _typeof, find } from "./utils";

import findCircuits from "elementary-circuits-directed-graph";

export const identifyCircles = <TYPE>(
  inputGraph: GraphData,
  { sortNodes }: Pick<Graph<TYPE>, "sortNodes">
): GraphData => {
  let graph = cloneDeep(inputGraph);

  var circularLinkID = 0;
  if (sortNodes === null || sortNodes(graph.nodes[0]) === undefined) {
    // Building adjacency graph
    var adjList = [];
    for (var i = 0; i < graph.links.length; i++) {
      var link = graph.links[i];
      var source = link.source.index;
      var target = link.target.index;
      if (!adjList[source]) adjList[source] = [];
      if (!adjList[target]) adjList[target] = [];

      // Add links if not already in set
      if (adjList[source].indexOf(target) === -1) adjList[source].push(target);
    }

    // Find all elementary circuits
    var cycles = findCircuits(adjList);

    // Sort by circuits length
    cycles.sort(function (a, b) {
      return a.length - b.length;
    });

    var circularLinks = {};
    for (i = 0; i < cycles.length; i++) {
      var cycle = cycles[i];
      var last = cycle.slice(-2);
      if (!circularLinks[last[0]]) circularLinks[last[0]] = {};
      circularLinks[last[0]][last[1]] = true;
    }

    graph.links.forEach(function (link) {
      var target = link.target.index;
      var source = link.source.index;
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
