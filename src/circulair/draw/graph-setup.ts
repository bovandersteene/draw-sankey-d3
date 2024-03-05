import {
  computeNodeLinksInitial,
  identifyCircles,
  selectCircularLinkTypes,
} from "../compute";
import { sortLinks } from "../compute/10_sort_links";
import { fillHeight } from "../compute/11_fill_chart";
import {
  computeNodeValues,
  setNodeValue,
} from "../compute/4_compute_node_values";
import { computeNodeDepths } from "../compute/5_compute_node_depths";
import { adjustSankeySize } from "../compute/6_adjust_sankey_size";
import { computeNodeBreadths } from "../compute/7_compute_node_breaths";
import { resolveCollisionsAndRelax } from "../compute/8_resolve-collision";
import { computeLinkBreadths } from "../compute/9_compute_link_breaths";
import {
  Graph,
  GraphArrow,
  SankeyParams,
  DefaultGraph,
  SankeyData,
  Link,
  Node,
} from "../model";
import { computeOrthogonalPaths } from "../path-data/compute_orthogonal_paths";
import { computeLinkPaths } from "../path-data/compute_path";
import { addVirtualPathDatas } from "../virtual-nodes/add-virtual-path-data";
import { createVirtualNodes } from "../virtual-nodes/create_virtual_nodes";
import { straigtenVirtualNodes } from "../virtual-nodes/straigthen-virtual-nodes";

export type Setup<NODE_TYPE extends Node, LINK_TYPE extends Link> = Partial<
  Omit<Graph<NODE_TYPE, LINK_TYPE>, "graph">
>;

export class GraphSetup<
  NODE_TYPE extends Node = Node,
  LINK_TYPE extends Link = Link
> implements Graph<NODE_TYPE, LINK_TYPE>
{
  public width: number;
  public padding: number;
  public height: number;
  public graph: any;
  public nodeColor: (d: NODE_TYPE) => string;
  public linkColor: (d: LINK_TYPE) => string;
  public nodeText: (d: NODE_TYPE) => string;
  public getNodeID: (d: NODE_TYPE) => string;
  public arrow: GraphArrow | null;
  public sankey: SankeyParams;
  public useVirtualRoutes: boolean;

  // TODO add if needed
  public sortNodes: ((d: NODE_TYPE) => any) | null;

  constructor(setup: Setup<NODE_TYPE, LINK_TYPE> | undefined | null) {
    this.graph = "";
    this.width = setup?.width ?? DefaultGraph.width;
    this.nodeColor = setup?.nodeColor ?? DefaultGraph.nodeColor;
    this.linkColor = setup?.linkColor ?? DefaultGraph.linkColor;
    this.getNodeID = setup?.getNodeID ?? DefaultGraph.getNodeID;
    this.nodeText = setup?.nodeText ?? DefaultGraph.nodeText;
    this.sortNodes = setup?.sortNodes ?? null;
    this.height = setup?.height ?? DefaultGraph.height;
    this.padding = setup?.padding ?? DefaultGraph.padding;
    this.arrow = setup?.arrow ?? DefaultGraph.arrow;
    this.sankey = setup?.sankey ?? DefaultGraph.sankey;
    if (!setup?.sankey) {
      this.sankey.extend = {
        x0: this.padding,
        y0: this.padding,
        x1: this.width - this.padding,
        y1: this.height - this.padding,
      };
    }
    this.useVirtualRoutes =
      setup?.useVirtualRoutes ?? DefaultGraph.useVirtualRoutes;
  }

  generateSankeyData(data: SankeyData) {
    this.graph = computeNodeLinksInitial(data, this);
    identifyCircles(this);
    selectCircularLinkTypes(this);
    computeNodeValues(this.graph);
    computeNodeDepths(this);
    // optional depending on the config
    createVirtualNodes(this);
    adjustSankeySize(this);
    computeNodeBreadths(this);
    resolveCollisionsAndRelax(this);
    computeLinkBreadths(this.graph);
    straigtenVirtualNodes(this);
    sortLinks(this);
    fillHeight(this);
    addVirtualPathDatas(this);

    computeLinkPaths(this);

    return this;
  }

  generateEhubData(data: SankeyData) {
    const defaultValue = 1000;
    this.sankey.nodeWidth = 70;
    this.graph = computeNodeLinksInitial(data, this);
    identifyCircles(this);
    selectCircularLinkTypes(this);
    setNodeValue(this.graph, defaultValue);
    computeNodeDepths(this);
    // optional depending on the config
    //  createVirtualNodes(this, defaultValue);
    adjustSankeySize(this);
    computeNodeBreadths(this);
    resolveCollisionsAndRelax(this);
    //    computeLinkBreadths(this.graph);
    straigtenVirtualNodes(this);
    sortLinks(this);
    fillHeight(this);
    addVirtualPathDatas(this);

    computeOrthogonalPaths(this);

    return this;
  }

  dragEhub() {
    console.log("ehub");
    computeOrthogonalPaths(this);
  }

  dragSankey() {
    console.log("sanjkey");
  }
}
