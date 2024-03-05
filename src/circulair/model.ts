import * as d3 from "d3";

export type GraphArrow = {
  draw: boolean;
  length: number;
  gapLength: number;
  headSize: number;
  path: (link: Link) => string;
  color: string;
};

type NodeData = { name: string };
type LinkData = { source: string; target: string };
export type SankeyData<
  NODE_TYPE extends NodeData = NodeData,
  LINK_TYPE extends LinkData = LinkData
> = {
  links: LINK_TYPE[];
  nodes: NODE_TYPE[];
};

export type GraphExtend = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  py: number;
  ky: number;
};
export type GraphData<
  NODE_TYPE extends Node = Node,
  LINK_TYPE extends Link = Link
> = {
  // links: LINK_TYPE[];
  // nodes: NODE_TYPE[];

  replacedLinks: any[];
  extend: GraphExtend;
  setExtendValue(key: keyof GraphExtend, value: number): void;
  getNodeLinks(link: Link): { source: NODE_TYPE; target: NODE_TYPE };
  getNodeSource(link: Link): NODE_TYPE;
  getNodeTarget(link: Link): NODE_TYPE;
  getTargetLinks(node: NODE_TYPE): LINK_TYPE[];
  getNodeSourceLinks(node: NODE_TYPE): LINK_TYPE[];
  getNodeTargetLinks(node: NODE_TYPE): LINK_TYPE[];
  getTargetLinks(node: NODE_TYPE): LINK_TYPE[];
  getSourceLinks(node: NODE_TYPE): LINK_TYPE[];
  forEachNode(fnc: (node: NODE_TYPE) => void): void;
  forEachLink(fnc: (node: LINK_TYPE) => void): void;
  totalLinks(key: "sourceLinkMap" | "targetLinkMap", node: Node): number;
  getLink(linkId: string): LINK_TYPE;
  getNode(nodeId: string): NODE_TYPE;

  getLinks(): LINK_TYPE[];
  getNodes(): NODE_TYPE[];
  addNode(_id: string, node: Node): void;
  addLink(link: Link): void;

  removeLinksFromIndex(type: string): void;

  removeVirtualNodesFromIndex(): void;

  computeColumns(): Node[][];
  maxColumns(): number;

  getMinY(): number;
  filterLinks(predicate: (link: Link) => boolean): LINK_TYPE[];
  sameColumnLinks(
    getNode: (link: Link) => Node,
    column: number,
    circularLinkType: CircularLinkType | undefined
  ): LINK_TYPE[];
};

export type SankeyParams = {
  extend: { x0: number; y0: number; x1: number; y1: number };
  paddingRatio: null;
  nodePadding: number;
  verticalMargin: number;
  baseRadius: number;
  nodeWidth: number;
  scale: number;
  iterations: number;
  minNodePadding: number;
  virtualNodePadding: number;
  circularLinkGap: number;
};

export type CircularLinkType = "top" | "bottom";
export type OrthogonalPathData = {
  x: number;
  y: number;
  height: number;
  index: number;
};
export type Link = {
  // internal link id
  _id: string;

  circular?: boolean;
  circularLinkType?: CircularLinkType;
  width: number;
  target: string;
  source: string;
  value: number;
  type: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  index: number;
  circularLinkID?: number;
  circularPathData?: any;
  orthogonalPathData?: {
    source: OrthogonalPathData;
    target: OrthogonalPathData;
  };
  path: string | null;
  parentLink?: NodeIndex;
};

type NodeIndex = number | string;
export type Node = {
  // Internal id derived from getNodeId
  _id: string;

  name: string;
  column: number;
  col?: number;
  values?: any[];
  value: number;
  circular?: boolean;
  circularLinkType?: CircularLinkType;
  partOfCycle?: boolean;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  height: number;
  width: number;
  depth: number;
  index: NodeIndex;
  virtual?: boolean;
  // Replaced link index
  replacedLink?: NodeIndex;
  hasTarget: boolean;
  hasSource: boolean;
};

export type Graph<
  NODE_TYPE extends Node = Node,
  LINK_TYPE extends Link = Link
> = {
  width: number;
  padding: number;
  height: number;
  graph: GraphData<NODE_TYPE, LINK_TYPE>;
  nodeColor: (d: NODE_TYPE) => string;
  linkColor: (d: LINK_TYPE) => string;
  nodeText: (d: NODE_TYPE) => string;
  getNodeID: (d: any) => string;
  sortNodes: ((d: NODE_TYPE) => any) | null;
  setNodePositions?: boolean;
  sankey: SankeyParams;
  arrow: GraphArrow | null;
  useVirtualRoutes: boolean;
};

export const DefaultGraph: Graph<any, Link> = {
  width: 1000,
  padding: 25,
  height: 500,
  graph: undefined,
  useVirtualRoutes: true,
  linkColor: (link) => {
    if (link.circular) {
      return "red";
    } else if (link.type === "virtual") {
      return "yellow";
    } else if (link.type === "replaced") {
      return "blue";
    } else {
      return "black";
    }
  },
  nodeColor: (d: any, index) => {
    return d3.scaleSequential(d3.interpolateCool).domain([0, 1000])(d.x0);
  },
  nodeText: (d) => d.name,
  getNodeID: (d: any) => d.name,
  sortNodes: null,
  sankey: {
    extend: {
      x0: 25,
      y0: 25,
      x1: 975,
      y1: 475,
    },
    paddingRatio: null,
    nodePadding: 25,
    verticalMargin: 25,
    baseRadius: 10,
    nodeWidth: 10,
    scale: 0.3,
    iterations: 15,
    minNodePadding: 7,
    virtualNodePadding: 3,
    circularLinkGap: 5,
  },
  arrow: {
    draw: false,
    arrowColour: "DarkSlateGrey",
    length: 10,
    gapLength: 70,
    headSize: 4,
    path: (link: Link) => link.path,
  },
};
