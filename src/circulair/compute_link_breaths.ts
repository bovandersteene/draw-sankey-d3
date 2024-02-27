import { ascendingSourceBreadth, ascendingTargetBreadth } from "./utils";
import { GraphData, Graph, Link, Node } from "./model";
import { getSourceLinks, getTargetLinks } from "./utils/links";

const computeLinkBreath = (
  node: Node,
  links: Link[],
  getNodeID: (node: Node) => string
) => {
  let sourceLinks = getSourceLinks(node, links, getNodeID).sort(
    ascendingTargetBreadth
  );
  let targetLinks = getTargetLinks(node, links, getNodeID).sort(
    ascendingSourceBreadth
  );
  let y0 = node.y0;
  let y1 = y0;

  // start from the bottom of the node for cycle links
  let y0cycle = node.y1;
  let y1cycle = y0cycle;

  sourceLinks = sourceLinks.map((link) => {
    if (link.circular) {
      link.y0 = y0cycle - link.width / 2;
      y0cycle = y0cycle - link.width;
    } else {
      link.y0 = y0 + link.width / 2;
      y0 += link.width;
    }

    return link;
  });

  targetLinks = targetLinks.map((link) => {
    if (link.circular) {
      link.y1 = y1cycle - link.width / 2;
      y1cycle = y1cycle - link.width;
    } else {
      link.y1 = y1 + link.width / 2;
      y1 += link.width;
    }

    return link;
  });

  return node;
};

export const computeLinkBreadths = (
  inputGraph: Readonly<GraphData>,
  { getNodeID }: Pick<Graph<Node, Link>, "getNodeID" | "setNodePositions">
) => {
  const nodes = inputGraph.nodes.map((node) =>
    computeLinkBreath(node, inputGraph.links, getNodeID)
  );

  return { ...inputGraph, nodes };
};
