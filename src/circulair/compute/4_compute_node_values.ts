import { sumBy } from "lodash";
import { Node, GraphData, Link } from "../model";

// Compute the value (size) and cycleness of each node by summing the associated links.
export const computeNodeValues = (inputGraph: GraphData) => {
  inputGraph.forEachNode((node: Node) => {
    const sourceLinks = inputGraph.getSourceLinks(node);
    const targetLinks = inputGraph.getTargetLinks(node);

    const value = Math.max(
      sumBy(sourceLinks, (n: Link) => n.value ?? 0),
      sumBy(targetLinks, (n: Link) => n.value ?? 0)
    );

    let findCirculair = sourceLinks.find((l) => l.circular);
    if (!findCirculair) {
      findCirculair = targetLinks.find((l) => l.circular);
    }

    node.value = value;
    node.partOfCycle = !!findCirculair;
    node.circularLinkType = findCirculair?.circularLinkType;
  });

  return inputGraph;
};
