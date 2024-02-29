import { GraphData, Link, Node } from "../model";
import {
  ascendingSourceBreadth,
  ascendingTargetBreadth,
} from "../utils/breath";

const computeLinkBreadth = (
  node: Node,
  sourceLinks: Link[],
  targetLinks: Link[],
  inputGraph: Readonly<GraphData>
) => {
  sourceLinks.sort(ascendingTargetBreadth((node) => inputGraph.getNode(node)));
  targetLinks.sort(ascendingSourceBreadth((node) => inputGraph.getNode(node)));

  let y0 = node.y0 ?? 0;
  let y1 = y0 ?? 0;

  // start from the bottom of the node for cycle links
  let y0cycle = node.y1;
  let y1cycle = y0cycle;

  sourceLinks.forEach((link) => {
    const linkWidth = link.width ?? 1;
    if (!link.width) console.warn("No width", link);

    if (link.circular) {
      link.y0 = y0cycle - linkWidth / 2;
      y0cycle = y0cycle - linkWidth;
    } else {
      link.y0 = y0 + linkWidth / 2;
      y0 += linkWidth;
    }

    return link;
  });

  targetLinks.forEach((link) => {
    const linkWidth = link.width ?? 1;
    if (!link.width) console.warn("No width", link);

    if (link.circular) {
      link.y1 = y1cycle - linkWidth / 2;
      y1cycle = y1cycle - linkWidth;
    } else {
      link.y1 = y1 + linkWidth / 2;
      y1 += linkWidth;
    }
  });
};

export const computeLinkBreadths = (inputGraph: Readonly<GraphData>) => {
  inputGraph.forEachNode((node: Node) => {
    computeLinkBreadth(
      node,
      inputGraph.getSourceLinks(node),
      inputGraph.getTargetLinks(node),
      inputGraph
    );
  });

  return inputGraph;
};
