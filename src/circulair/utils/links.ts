import { Link, Node } from "../model";

export const getSourceLinks = (
  node: Node,
  links: Link[],
  getNodeID: (node: Node) => string
): Link[] => {
  const nodeId = getNodeID(node);

  return links.filter((link) => nodeId === link.source);
};

export const getTargetLinks = (
  node: Node,
  links: Link[],
  getNodeID: (node: Node) => string
): Link[] => {
  const nodeId = getNodeID(node);
  return links.filter((link) => nodeId === link.target);
};

export const findSourceNode = (
  link: Link,
  nodes: Node[],
  getNodeID: (node: Node) => string
): Node => {
  return findNode(link.source, nodes, getNodeID);
};

export const findTargetNode = (
  link: Link,
  nodes: Node[],
  getNodeID: (node: Node) => string
): Node => {
  return findNode(link.target, nodes, getNodeID);
};

export const findNode = (
  id: string,
  nodes: Node[],
  getNodeID: (node: Node) => string
): Node => {
  const node = nodes.find((node) => getNodeID(node) === id);

  if (!node) throw new Error(`Node "${id}" not found`);

  return node;
};
