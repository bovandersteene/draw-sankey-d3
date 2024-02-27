import { clone, sumBy } from "lodash";
import { GraphData, Graph, Link } from "./model";
import * as d3 from "d3";
import { getSourceLinks, getTargetLinks } from "./utils/links";

// Compute the value (size) and cycleness of each node by summing the associated links.
export const computeNodeValues = (
  inputGraph: GraphData,
  { getNodeID }: Pick<Graph, "getNodeID">
) => {
  const nodes = inputGraph.nodes.map((node) => {
    const sourceLinks = getSourceLinks(node, inputGraph.links, getNodeID);
    const targetLinks = getTargetLinks(node, inputGraph.links, getNodeID);
    
    const value = Math.max(
      sumBy(sourceLinks, (n: Link) => n.value ?? 0),
      sumBy(targetLinks, (n: Link) => n.value ?? 0)
    );

    let findCirculair = sourceLinks.find((l) => l.circular);
    if (!findCirculair) {
      findCirculair = targetLinks.find((l) => l.circular);
    }

    return {
      ...node,
      value,
      partOfCycle: !!findCirculair,
      circularLinkType: findCirculair?.circularLinkType,
    };
  });

  return { ...inputGraph, nodes };
};
