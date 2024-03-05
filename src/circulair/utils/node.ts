import { Node } from "../model";

export const getNode = (nodeId: string, nodeMap: Map<string, Node>): Node => {
  const node = nodeMap.get(nodeId);
  if (!node) throw new Error(`Node "${nodeId}" not found`);

  return node;
};

export function nodeCenter(node: Node) {
  return (node.y0 + node.y1) / 2;
}
export function nodeHeight(node: Node) {
  return node.y1 - node.y0;
}

export function nodeWidth(node: Node) {
  return node.x1 - node.x0;
}

export function nodeCenters(node: Node) {
  return {
    y: (node.y0 + node.y1) / 2,
    x: node.x1 + node.x0 / 2,
  };
}
