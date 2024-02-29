// Assign a circular link type (top or bottom), based on:
// - if the source/target node already has circular links, then use the same type

import { Graph } from "../model";
import { isSelfLinking } from "../utils/self-linking";

// - if not, choose the type with fewer links
export function selectCircularLinkTypes(graph: Readonly<Graph<any, any>>) {
  const { graph: data } = graph;
  let numberOfTops = 0;
  let numberOfBottoms = 0;
  //correct self-linking links to be same direction as node
  data.forEachLink((link) => {
    if (link.circular) {
      const { source: sourceNode, target: targetNode } =
        data.getNodeLinks(link);
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

      if (link.circularLinkType == "top") {
        numberOfTops = numberOfTops + 1;
      } else {
        numberOfBottoms = numberOfBottoms + 1;
      }

      data.forEachNode((node) => {
        if (isSelfLinking(node, link)) {
          node.circularLinkType = link.circularLinkType;
        }
      });
    }

    return link;
  });

  data.forEachLink((link) => {
    const { source: sourceNode, target: targetNode } =
      data.getNodeLinks(link);
    if (link.circular) {
      //if both source and target node are same type, then link should have same type
      if (sourceNode.circularLinkType == targetNode.circularLinkType) {
        link.circularLinkType =
          sourceNode.circularLinkType ?? link.circularLinkType;
      }
      //if link is selflinking, then link should have same type as node
      if (targetNode._id === sourceNode._id) {
        link.circularLinkType =
          sourceNode.circularLinkType ?? link.circularLinkType;
      }
    }

    return link;
  });

  return data;
}
