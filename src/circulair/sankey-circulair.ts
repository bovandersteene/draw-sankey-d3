import { drawSankey } from "./draw_sankey";
import {
  DefaultGraph,
  Graph,
  GraphArrow,
  Link,
  Node,
  SankeyData,
  SankeyParams,
} from "./model";

import { selectCircularLinkTypes } from "./compute";
import { computeNodeLinksInitial } from "./compute/1_compute-node-links";
import { identifyCircles } from "./compute/2_identify_circulair_circles";
import { computeNodeValues } from "./compute/4_compute_node_values";
import { computeNodeDepths } from "./compute/5_compute_node_depths";
import { createVirtualNodes } from "./virtual-nodes/create_virtual_nodes";
import { adjustSankeySize } from "./compute/6_adjust_sankey_size";
import { computeNodeBreadths } from "./compute/7_compute_node_breaths";
import { resolveCollisionsAndRelax } from "./compute/8_resolve-collision";
import { computeLinkBreadths } from "./compute/9_compute_link_breaths";
import { computeLinkPaths } from "./path-data/compute_path";

/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

type Setup<NODE_TYPE extends Node, LINK_TYPE extends Link> = Partial<
  Omit<Graph<NODE_TYPE, LINK_TYPE>, "graph">
>;

class GraphSetup<NODE_TYPE extends Node = Node, LINK_TYPE extends Link = Link>
  implements Graph<NODE_TYPE, LINK_TYPE>
{
  public width: number;
  public padding: number;
  public height: number;
  public graph: any;
  public nodeColor: (d: NODE_TYPE) => string;
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
    this.getNodeID = setup?.getNodeID ?? DefaultGraph.getNodeID;
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

  draw(data: SankeyData) {
    this.graph = computeNodeLinksInitial(data, this);
    identifyCircles(this);
    selectCircularLinkTypes(this);
    computeNodeValues(this.graph);
    computeNodeDepths(this);
    // optional depending on the config
    createVirtualNodes(this.graph, this);
    adjustSankeySize(this);
    computeNodeBreadths(this);
    resolveCollisionsAndRelax(this);
    computeLinkBreadths(this.graph);
    // straigtenVirtualNodes(this.graph, this);

    computeLinkPaths(this);

    console.table(this.graph.getNodes());
    console.table(this.graph.getLinks());
    console.table(this.graph.extend);
    return this;
  }
}

export const drawSankeyCirculair = <
  DATA extends SankeyData,
  NODE_TYPE extends Node,
  LINK_TYPE extends Link
>(
  documentId: string,
  data: DATA,
  setup?: Setup<NODE_TYPE, LINK_TYPE>
) => {
  const graphSetup = new GraphSetup(setup);
  // console.log(data);
  graphSetup.draw(data);
  // console.log(graphSetup.graph);
  // console.table(graphSetup.graph.links);
  // console.table(graphSetup.graph.nodes);

  const sankey = drawSankey(graphSetup);
  document.getElementById(documentId)?.appendChild(sankey!);

  //d3.select(documentId).append(sankey as any);
};
