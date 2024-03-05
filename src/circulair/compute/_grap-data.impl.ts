import { groupBy, maxBy, minBy } from "lodash";
import { CircularLinkType, GraphData, GraphExtend, Link, Node } from "../model";
import { getLink, getLinkInternalId, getNodeLinks } from "../utils/links";
import { getNode } from "../utils/node";

export class GraphDataImpl implements GraphData {
  private readonly sourceLinkMap = new Map<string, string[]>();
  private readonly targetLinkMap = new Map<string, string[]>();
  private nodeIds: string[] = [];
  private readonly nodeMap: Map<string, Node> = new Map();
  private linkIds: string[] = [];
  private readonly linkMap: Map<string, Link> = new Map();
  public readonly extend: GraphExtend;
  constructor(extend: Pick<GraphExtend, "x0" | "x1" | "y1" | "y0">) {
    this.extend = { ...extend, ky: 0, py: extend.y0 };
  }

  setExtendValue(key: keyof GraphExtend, value: number) {
    this.extend[key] = value;
  }

  addNode(_id: string, node: Node) {
    node._id = _id;

    this.nodeMap.set(node._id, node);
    this.sourceLinkMap.set(node._id, []);
    this.targetLinkMap.set(node._id, []);
    this.nodeIds.push(_id);

    return this;
  }

  addLink(link: Link) {
    const _id = getLinkInternalId(link);
    this.sourceLinkMap.get(link.source)!.push(_id);
    this.targetLinkMap.get(link.target)!.push(_id);
    link._id = _id;
    this.linkMap.set(_id, link);
    this.linkIds.push(_id);

    this.getNode(link.target).hasSource = true;
    this.getNode(link.source).hasTarget = true;

    return this;
  }

  getNodeSource(link: Link) {
    return this.getNodeLinks(link).source;
  }

  getNodeTarget(link: Link) {
    return this.getNodeLinks(link).target;
  }

  getNodeLinks(link: Link) {
    return getNodeLinks(link, this.nodeMap);
  }

  getNodeSourceLinks(node: Node): Link[] {
    return this.filterLinks((link) => link.source === node._id);
  }

  getNodeTargetLinks(node: Node): Link[] {
    return this.filterLinks((link) => link.target === node._id);
  }

  getTargetLinks(node: Node) {
    return this.getLinksForNode("targetLinkMap", node).map((l) =>
      getLink(l, this.linkMap)
    );
  }

  private getLinksForNode(key: "sourceLinkMap" | "targetLinkMap", node: Node) {
    return this[key].get(node._id)!;
  }

  totalLinks(key: "sourceLinkMap" | "targetLinkMap", node: Node) {
    return this.getLinksForNode(key, node).length;
  }

  getSourceLinks(node: Node) {
    return this.getLinksForNode("sourceLinkMap", node).map((l) =>
      getLink(l, this.linkMap)
    );
  }

  forEachNode(fnc: (node: Node) => void) {
    this.nodeIds.forEach((nodeId) => {
      const node = this.nodeMap.get(nodeId)!;

      fnc(node);
    });
  }

  forEachLink(fnc: (node: Link) => void) {
    this.linkIds.forEach((linkId) => {
      const link = this.linkMap.get(linkId)!;

      fnc(link);
    });
  }

  getLink(linkId: string) {
    return getLink(linkId, this.linkMap);
  }

  getNode(nodeId: string) {
    return getNode(nodeId, this.nodeMap);
  }

  getLinks() {
    return this.linkIds.map((l) => this.getLink(l));
  }
  getNodes() {
    return this.nodeIds.map((l) => this.getNode(l));
  }

  removeLinksFromIndex(type: string): void {
    this.linkIds = this.linkIds.filter((id) => {
      return this.getLink(id).type !== type;
    });
  }

  computeColumns() {
    const grouped = groupBy(this.getNodes(), (n) => n.column);

    return Object.values(grouped);
  }

  maxColumns(): number {
    return maxBy(this.getNodes(), (n) => n.column)?.column ?? 0;
  }

  getMinY(): number {
    return (
      minBy(this.getLinks(), (link: Link) => {
        const source = this.getNodeSource(link);
        return source.y0;
      })?.y0 ?? 0
    );
  }

  filterLinks(predicate: (link: Link) => boolean): Link[] {
    return this.getLinks().filter(predicate);
  }

  get replacedLinks(): Link[] {
    const replaced: Link[] = [];
    for (const link of this.linkMap.values()) {
      if (link.type === "replaced") replaced.push(link);
    }

    return replaced;
  }

  sameColumnLinks(
    getNode: (link: Link) => Node,
    column: number,
    circularLinkType: CircularLinkType | undefined
  ) {
    return this.filterLinks((l) => {
      const t = getNode(l);
      return t.column == column && l.circularLinkType == circularLinkType;
    });
  }

  removeVirtualNodesFromIndex(): void {
    this.nodeIds = this.nodeIds.filter((nodeId) => {
      return !this.getNode(nodeId).virtual;
    });
  }
}
