import { Node } from "../model";

export const getNode = (nodeId: string, nodeMap: Map<string, Node>): Node => {
  const node = nodeMap.get(nodeId);
  if (!node) throw new Error(`Node "${nodeId}" not found`);

  return node;
};

export function nodeCenter(node: Node) {
  return (node.y0 + node.y1) / 2;
}
