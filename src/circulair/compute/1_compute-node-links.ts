import { Graph, GraphData, SankeyData, Node, Link } from "../model";
import { GraphDataImpl } from "./_grap-data.impl";

export const computeNodeLinksInitial = (
  data: Readonly<SankeyData>,
  settings: Pick<Graph, "getNodeID" | "sankey">
): GraphData => {
  const graphData = new GraphDataImpl(settings.sankey.extend);

  data.nodes.forEach((node, index) => {
    graphData.addNode(settings.getNodeID(node), { ...node, index } as Node);
  });

  data.links.forEach((link, index) => {
    graphData.addLink({ ...link, index } as Link);
  });

  return graphData;
};
