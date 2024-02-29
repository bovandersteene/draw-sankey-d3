import { meanBy } from "lodash";
import { Graph, GraphExtend, SankeyParams, Node, GraphData } from "../model";
import { nodeCenter } from "../utils/node";
import { numberOfNonSelfLinkingCycles } from "../utils/self-linking";
import { ascendingBreadth } from "../utils/breath";

// For each node in each column, check the node's vertical position in relation to its targets and sources vertical position
// and shift up/down to be closer to the vertical middle of those targets and sources
function relaxLeftAndRight(
  alpha: number,
  columns: Node[][],
  extend: Readonly<GraphExtend>,
  data: Readonly<GraphData>
) {
  const columnsLength = columns.length;

  columns.forEach(function (nodes) {
    const n = nodes.length;
    const depth = nodes[0].depth;

    nodes.forEach(function (node) {
      // check the node is not an orphan
      let nodeHeight;
      const sourceLinks = data.getSourceLinks(node);
      const targetLinks = data.getTargetLinks(node);

      if (sourceLinks.length || targetLinks.length) {
        if (node.partOfCycle && numberOfNonSelfLinkingCycles(node, data) > 0);
        else if (depth == 0 && n == 1) {
          nodeHeight = node.y1 - node.y0;

          node.y0 = extend.y1 / 2 - nodeHeight / 2;
          node.y1 = extend.y1 / 2 + nodeHeight / 2;
        } else if (depth == columnsLength - 1 && n == 1) {
          nodeHeight = node.y1 - node.y0;

          node.y0 = extend.y1 / 2 - nodeHeight / 2;
          node.y1 = extend.y1 / 2 + nodeHeight / 2;
        } else {
          let avg = 0;

          const avgTargetY = meanBy(sourceLinks, (link) =>
            nodeCenter(data.getNodeTarget(link))
          );
          const avgSourceY = meanBy(targetLinks, (link) =>
            nodeCenter(data.getNodeSource(link))
          );

          if (avgTargetY && avgSourceY) {
            avg = (avgTargetY + avgSourceY) / 2;
          } else {
            avg = avgTargetY || avgSourceY;
          }

          const dy = (avg - nodeCenter(node)) * alpha;
          // positive if it node needs to move down
          node.y0 += dy;
          node.y1 += dy;
        }
      }
    });
  });
}
// For each column, check if nodes are overlapping, and if so, shift up/down
function resolveCollisions(
  columns: Node[][],
  extend: Readonly<GraphExtend>,
  sankey: Readonly<SankeyParams>
) {
  const { nodePadding, minNodePadding } = sankey;
  columns.forEach((nodes) => {
    let node,
      dy,
      y = extend.y0,
      n = nodes.length,
      i;

    // Push any overlapping nodes down.
    nodes.sort(ascendingBreadth);

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      dy = y - node.y0;

      if (dy > 0) {
        node.y0 += dy;
        node.y1 += dy;
      }
      y = node.y1 + nodePadding;
    }

    // If the bottommost node goes outside the bounds, push it back up.
    dy = y - nodePadding - extend.y1;
    if (dy > 0) {
      (y = node.y0 -= dy), (node.y1 -= dy);

      // Push any overlapping nodes back up.
      for (i = n - 2; i >= 0; --i) {
        node = nodes[i];
        dy = node.y1 + minNodePadding /*nodePadding*/ - y;
        if (dy > 0) (node.y0 -= dy), (node.y1 -= dy);
        y = node.y0;
      }
    }
  });
}

export const resolveCollisionsAndRelax = (graph: Graph<any, any>) => {
  const { iterations } = graph.sankey;
  const data = graph.graph;
  const columns = data.computeColumns();

  for (let alpha = 1, n = iterations; n > 0; --n) {
    relaxLeftAndRight((alpha *= 0.99), columns, data.extend, data);
    resolveCollisions(columns, data.extend, graph.sankey);
  }
};
