import { Node, Link } from "../model";

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
export const ascendingSourceBreadth =
  (getNode: (nodeId: string) => Node) => (a: Link, b: Link) => {
    const sourceA = getNode(a.source);
    const sourceB = getNode(b.source);
    return ascendingBreadth(sourceA, sourceB) || a.index - b.index;
  };

export const ascendingTargetBreadth =
  (getNode: (nodeId: string) => Node) => (a: Link, b: Link) => {
    const targetA = getNode(a.target);
    const targetB = getNode(b.target);
    return ascendingBreadth(targetA, targetB) || a.index - b.index;
  };
