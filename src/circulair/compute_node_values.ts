import { clone, sumBy } from "lodash";
import { GraphData, Graph, Link } from "./model";
import * as d3 from "d3";

// Compute the value (size) and cycleness of each node by summing the associated links.
export const computeNodeValues = (inputGraph: GraphData) => {
  const nodes = inputGraph.nodes.map((node) => {
    const value = Math.max(
      sumBy(node.sourceLinks, (n: Link) => n.value ?? 0),
      sumBy(node.targetLinks, (n: Link) => n.value ?? 0)
    );

    let findCirculair = node.sourceLinks.find((l) => l.circular);
    if (!findCirculair) {
      findCirculair = node.targetLinks.find((l) => l.circular);
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
