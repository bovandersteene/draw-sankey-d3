import { GraphData, Link, Node } from "../model";

export const isSelfLinking = (node: Node, link: Link) => {
  const nodeId = node._id;
  return nodeId == link.target || nodeId === link.source;
};

export const selfLinking = (link: Link) => {
  return link.source == link.target;
};

export function numberOfNonSelfLinkingCycles(node: Node, graph: GraphData) {
  function countNonSelfLinkingCycles(links: Link[]): number {
    return links.reduce((result: number, link: Link) => {
      if (!link.circular || selfLinking(link)) return result;
      return result + 1;
    }, 0);
  }

  const sourceCount = countNonSelfLinkingCycles(graph.getSourceLinks(node));
  const targetCount = countNonSelfLinkingCycles(graph.getTargetLinks(node));

  return sourceCount + targetCount;
}

export const onlyCircularLink = (link: Link, graph: GraphData) => {
  const { source: sourceNode, target: targetNode } = graph.getNodeLinks(link);
  const nodeSourceLinks = graph.getSourceLinks(sourceNode);
  let hasNonCircular = nodeSourceLinks.some((l) => !l.circular);

  if (hasNonCircular) return false;

  const targetLinks = graph.getSourceLinks(targetNode);
  hasNonCircular = targetLinks.some((l) => !l.circular);

  return !hasNonCircular;
};
