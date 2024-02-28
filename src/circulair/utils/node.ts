import { Link, Node, Graph } from "../model";
import { findSourceNode, findTargetNode } from "./links";

export const addIndexToLink = (
  link: Link,
  linkIndex: number | null,
  nodes: Node[],
  { getNodeID }: Pick<Graph, "getNodeID">
) => {
  let source = findSourceNode(link, nodes, getNodeID);
  let target = findTargetNode(link, nodes, getNodeID);

  return {
    ...link,
    index: linkIndex ?? link.index,
    sourceIndex: source.index,
    targetIndex: target.index,
  };
};
