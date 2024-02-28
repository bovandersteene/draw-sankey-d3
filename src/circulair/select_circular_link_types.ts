// Assign a circular link type (top or bottom), based on:
// - if the source/target node already has circular links, then use the same type

import { cloneDeep } from "lodash";
import { Graph, GraphData } from "./model";
import { isSelfLinking, selfLinking } from "./utils";
import { findSourceNode } from "./utils/links";

// - if not, choose the type with fewer links
export function selectCircularLinkTypes(
  inputGraph: GraphData,
  { getNodeID }: Pick<Graph, "getNodeID">
) {
  let graph = cloneDeep(inputGraph);

  var numberOfTops = 0;
  var numberOfBottoms = 0;
  let links =
    //correct self-linking links to be same direction as node
    graph.links
      .map(function (link) {
        if (link.circular) {
          const sourceNode = findSourceNode(link, inputGraph.nodes, getNodeID);
          const targetNode = findSourceNode(link, inputGraph.nodes, getNodeID);
          // if either souce or target has type already use that
          if (sourceNode.circularLinkType || targetNode.circularLinkType) {
            // default to source type if available
            link.circularLinkType = sourceNode.circularLinkType
              ? sourceNode.circularLinkType
              : targetNode.circularLinkType;
          } else {
            link.circularLinkType =
              numberOfTops < numberOfBottoms ? "top" : "bottom";
          }

          console.log(link.circularLinkType);

          if (link.circularLinkType == "top") {
            numberOfTops = numberOfTops + 1;
          } else {
            numberOfBottoms = numberOfBottoms + 1;
          }

          graph.nodes.forEach((node) => {
            if (isSelfLinking(node, link, getNodeID)) {
              node.circularLinkType = link.circularLinkType;
            }
          });
        }

        return link;
      })
      .map((link) => {
        const sourceNode = findSourceNode(link, inputGraph.nodes, getNodeID);
        const targetNode = findSourceNode(link, inputGraph.nodes, getNodeID);
        if (link.circular) {
          //if both source and target node are same type, then link should have same type
          if (sourceNode.circularLinkType == targetNode.circularLinkType) {
            link.circularLinkType =
              sourceNode.circularLinkType ?? link.circularLinkType;
          }
          //if link is selflinking, then link should have same type as node
          if (getNodeID(targetNode) === getNodeID(sourceNode)) {
            link.circularLinkType =
              sourceNode.circularLinkType ?? link.circularLinkType;
          }
        }

        return link;
      });

  return { ...graph, links };
}
