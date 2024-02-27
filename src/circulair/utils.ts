import { Link, Node } from "./model";
import { getSourceLinks, getTargetLinks } from "./utils/links";

export const _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

export const isSelfLinking = <TYPE>(
  node: Node,
  link: Link,
  getNodeID: (node: any) => string
) => {
  const nodeId = getNodeID(node);
  return nodeId == getNodeID(link.target) || nodeId === getNodeID(link.source);
};

export const selfLinking = (link: Link, getNodeID: (node: any) => string) => {
  return getNodeID(link.source) == getNodeID(link.target);
};

export function numberOfNonSelfLinkingCycles(
  node: Node,
  links: Link[],
  getNodeID: (node: any) => string
) {
  function countNonSelfLinkingCycles(links: Link[]): number {
    return links.reduce((result: number, link: Link) => {
      if (!link.circular || selfLinking(link, getNodeID)) return result;
      return result + 1;
    }, 0);
  }
  const sourceCount = countNonSelfLinkingCycles(
    getSourceLinks(node, links, getNodeID)
  );
  const targetCount = countNonSelfLinkingCycles(
    getTargetLinks(node, links, getNodeID)
  );

  return sourceCount + targetCount;
}

export function getColumn(node: Node) {
  return node.column ?? node.col;
}

export function getWidth(link: Link, scale = 1) {
  if (!link.value) return 1;

  return link.value * (scale ?? 1);
}

export const findNode = (nodeById: Record<string, any>, id: string) => {
  const node = nodeById[id]?.[0];
  if (!node) throw new Error("missing: " + id);
  return node;
};

export function ascendingBreadth(a: Node, b: Node) {
  if (a.partOfCycle === b.partOfCycle) {
    return a.y0 - b.y0;
  } else {
    if (a.circularLinkType === "top" || b.circularLinkType === "bottom") {
      return -1;
    } else {
      return 1;
    }
  }
}
export function ascendingSourceBreadth(a: Link, b: Link) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

export function ascendingTargetBreadth(a: Link, b: Link) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

export function nodeCenter(node: Node) {
  return (node.y0 + node.y1) / 2;
}
