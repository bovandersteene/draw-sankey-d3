import { GraphData, Graph } from "../model";

export function straigtenVirtualNodes(
  inputGraph: Readonly<GraphData>,
  { useVirtualRoutes }: Pick<Graph, "useVirtualRoutes">
) {
  if (!useVirtualRoutes) return;

  inputGraph.forEachNode(function (node) {
    if (node.virtual) {
      const nodeHeight = node.y1 - node.y0;
      let dy = 0;

      const sourceLinks = inputGraph.getSourceLinks(node);
      const targetLinks = inputGraph.getTargetLinks(node);
      const { source: firstSource, target: firstTarget } =
        inputGraph.getNodeLinks(targetLinks[0]);
      //if the node is linked to another virtual node, get the difference in y
      //select the node which precedes it first, else get the node after it
      if (firstSource.virtual) {
        dy = firstSource.y0 - node.y0;
      } else {
        if (firstTarget.virtual) {
          dy = firstTarget.y0 - node.y0;
        }
      }

      node.y0 = node.y0 + dy;
      node.y1 = node.y1 + dy;

      targetLinks.forEach(function (l) {
        l.y1 = l.y1 + dy;
      });

      sourceLinks.forEach(function (l) {
        l.y0 = l.y0 + dy;
      });
    }

    return inputGraph;
  });
}
