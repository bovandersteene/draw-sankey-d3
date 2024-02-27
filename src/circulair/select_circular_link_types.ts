// Assign a circular link type (top or bottom), based on:
// - if the source/target node already has circular links, then use the same type

import { cloneDeep } from "lodash";
import { Graph, GraphData } from "./model";
import { isSelfLinking, selfLinking } from "./utils";

// - if not, choose the type with fewer links
export function selectCircularLinkTypes<TYPE>(
  inputGraph: GraphData,
  { getNodeID }: Pick<Graph<TYPE>, "getNodeID">
) {
  let graph = cloneDeep(inputGraph);

  var numberOfTops = 0;
  var numberOfBottoms = 0;
  graph.links.forEach(function (link) {
    if (link.circular) {
      // if either souce or target has type already use that
      if (link.source.circularLinkType || link.target.circularLinkType) {
        // default to source type if available
        link.circularLinkType = link.source.circularLinkType
          ? link.source.circularLinkType
          : link.target.circularLinkType;
      } else {
        link.circularLinkType =
          numberOfTops < numberOfBottoms ? "top" : "bottom";
      }

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
  });

  const links =
    //correct self-linking links to be same direction as node
    graph.links.map((link) => {
      if (link.circular) {
        //if both source and target node are same type, then link should have same type
        if (link.source.circularLinkType == link.target.circularLinkType) {
          link.circularLinkType = link.source.circularLinkType;
        }
        //if link is selflinking, then link should have same type as node
        if (getNodeID(link.target) === getNodeID(link.source)) {
          link.circularLinkType = link.source.circularLinkType;
        }
      }

      return link;
    });

  return { ...graph, links };
}
