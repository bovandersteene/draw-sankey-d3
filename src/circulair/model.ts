import * as d3 from "d3";

export type GraphArrow = {
  draw: true;
  length: number;
  gapLength: number;
  path: string;
  color: string;
  headSize: string;
};

export type SankeyData = Omit<GraphData, "replacedLinks" | "ky">;

export type GraphData<
  NODE_TYPE extends Node = Node,
  LINK_TYPE extends Link = Link
> = {
  links: LINK_TYPE[];
  nodes: NODE_TYPE[];
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  py: number;
  replacedLinks: any[];
  ky: number;
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

export type Link = {
  circular?: boolean;
  circularLinkType?: CircularLinkType;
  width: number;
  target: string;
  source: string;
  targetIndex: NodeIndex;
  sourceIndex: NodeIndex;
  value?: number;
  type: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  index: number | string;
  circularLinkID?: number;
  circularPathData: any;
  path: string;
  parentLink?: NodeIndex;
};

type NodeIndex = number | string;
export type Node = {
  name: string;
  column: number;
  col?: number;
  values?: any[];
  value?: number;
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
  // sourceLinks: Link[];
  // targetLinks: Link[];
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
  getNodeID: (d: NODE_TYPE) => string;
  sortNodes: ((d: NODE_TYPE) => any) | null;
  setNodePositions?: boolean;
  sankey: SankeyParams;
  arrow?: GraphArrow | null;
  useVirtualRoutes: boolean;
};

export const DefaultGraph: Graph<any, Link> = {
  width: 1000,
  padding: 25,
  height: 500,
  graph: undefined,
  useVirtualRoutes: true,
  nodeColor: (d: any, index) => {
    return d3.scaleSequential(d3.interpolateCool).domain([0, 1000])(d.x0);
  },
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
    iterations: 10,
    minNodePadding: 7,
    virtualNodePadding: 3,
    circularLinkGap: 5,
  },
};
