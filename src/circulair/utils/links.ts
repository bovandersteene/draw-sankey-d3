import { Link, Node } from "../model";

export const getLink = (linkId: string, linkMap: Map<string, Link>): Link => {
  const link = linkMap.get(linkId);
  if (!link) throw new Error(`Link "${linkId}" not found`);

  return link;
};

export const getLinkInternalId = (link: Link) => {
  return [link.source, link.target].join("_|_");
};

export const getNodeLinks = (link: Link, nodes: Map<string, Node>) => {
  const source = nodes.get(link.source);
  if (!source) throw new Error(`Source Node "${link}" not found`);
  const target = nodes.get(link.target);
  if (!target) throw new Error(`Target Node "${link}" not found`);

  return { source, target };
};
export function getWidth(link: Link, scale = 1) {
  if (!link.value) return 1;

  return link.value * (scale ?? 1);
}

export function getColumn(node: Node) {
  return node.column ?? node.col;
}
