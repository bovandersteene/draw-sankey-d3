import { computeNodeLinks } from "./compute_node_links";
import { drawSankey } from "./draw_sankey";
import { identifyCircles } from "./identify_circulair_circles";
import {
  DefaultGraph,
  Graph,
  GraphArrow,
  GraphData,
  Link,
  Node,
  SankeyData,
  SankeyParams,
} from "./model";

import { selectCircularLinkTypes } from "./select_circular_link_types";
import { computeNodeValues } from "./compute_node_values";
import { computeNodeDepths } from "./compute_node_depths";
import { adjustSankeySize } from "./adjust_sankey_size";
import { computeNodeBreadths } from "./compute_node_breaths";
import { createVirtualNodes } from "./create_virtual_nodes";
import { pick } from "lodash";

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
  public arrow?: GraphArrow | null | undefined;
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
    this.height = setup?.height ?? 500;
    this.padding = setup?.padding ?? 0;
    this.arrow = setup?.arrow ?? null;
    this.sankey = setup?.sankey ?? DefaultGraph.sankey;
    this.useVirtualRoutes =
      setup?.useVirtualRoutes ?? DefaultGraph.useVirtualRoutes;
  }

  draw(data: SankeyData) {
    this.graph = data as GraphData;
    this.graph = computeNodeLinks(this.graph, this);
    this.graph = identifyCircles(this.graph, this);
    this.graph = selectCircularLinkTypes(this.graph, this);
    this.graph = computeNodeValues(this.graph);
    this.graph = computeNodeDepths(this.graph, this);
    this.graph = createVirtualNodes(this.graph, this);
    console.table(pick(this.graph, ["x0", "y0", "x1", "y1", "py", "ky"]));
    this.graph = adjustSankeySize(this.graph, this);
    console.table(pick(this.graph, ["x0", "y0", "x1", "y1", "py", "ky"]));
    this.graph = computeNodeBreadths(this.graph, this);
    console.table(pick(this.graph, ["x0", "y0", "x1", "y1", "py", "ky"]));
    this.graph.nodes.forEach((node: any) => {
      console.log(node.name, node.x0, node.y0);
    });
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
  console.log(documentId, sankey);
  document.getElementById(documentId)?.appendChild(sankey!);
  //d3.select(documentId).append(sankey as any);
};
