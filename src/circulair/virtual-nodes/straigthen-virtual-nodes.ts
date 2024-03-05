import { Graph } from "../model";

export function straigtenVirtualNodes(graph: Readonly<Graph<any, any>>) {
  const { useVirtualRoutes, graph: data } = graph;
  if (!useVirtualRoutes) return;

  data.forEachNode((node) => {
    if (node.virtual) {
      let dy = 0;

      const sourceLinks = data.getSourceLinks(node);
      const targetLinks = data.getTargetLinks(node);
      const { source: firstSource, target: firstTarget } = data.getNodeLinks(
        targetLinks[0]
      );
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
  });
}
