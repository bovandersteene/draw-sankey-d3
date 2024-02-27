import { meanBy } from "lodash";
import { computeColumns } from "./compute_columns";
import { Graph, GraphData } from "./model";
import {
  ascendingBreadth,
  findNode,
  nodeCenter,
  numberOfNonSelfLinkingCycles,
} from "./utils";
import * as d3 from "d3";
import {
  findSourceNode,
  findTargetNode,
  getSourceLinks,
  getTargetLinks,
} from "./utils/links";
export const resolveCollisionsAndRelax = (
  inputGraph: Readonly<GraphData>,
  { sankey, getNodeID }: Pick<Graph, "sankey" | "getNodeID">
): GraphData => {
  const { iterations, nodePadding, minNodePadding } = sankey;
  const columns = computeColumns(inputGraph);

  for (var alpha = 1, n = iterations; n > 0; --n) {
    relaxLeftAndRight((alpha *= 0.99));
    resolveCollisions();
  }

  // For each node in each column, check the node's vertical position in relation to its targets and sources vertical position
  // and shift up/down to be closer to the vertical middle of those targets and sources
  function relaxLeftAndRight(alpha: number) {
    var columnsLength = columns.length;

    columns.forEach(function (nodes) {
      var n = nodes.length;
      var depth = nodes[0].depth;

      nodes.forEach(function (node) {
        // check the node is not an orphan
        let nodeHeight;
        const sourceLinks = getSourceLinks(node, inputGraph.links, getNodeID);
        const targetLinks = getTargetLinks(node, inputGraph.links, getNodeID);
        if (sourceLinks.length || targetLinks.length) {
          if (
            node.partOfCycle &&
            numberOfNonSelfLinkingCycles(node, inputGraph.links, getNodeID) > 0
          );
          else if (depth == 0 && n == 1) {
            nodeHeight = node.y1 - node.y0;

            node.y0 = inputGraph.y1 / 2 - nodeHeight / 2;
            node.y1 = inputGraph.y1 / 2 + nodeHeight / 2;
          } else if (depth == columnsLength - 1 && n == 1) {
            nodeHeight = node.y1 - node.y0;

            node.y0 = inputGraph.y1 / 2 - nodeHeight / 2;
            node.y1 = inputGraph.y1 / 2 + nodeHeight / 2;
          } else {
            let avg = 0;

            let avgTargetY = meanBy(sourceLinks, (link) =>
              nodeCenter(findSourceNode(link, nodes, getNodeID))
            );
            let avgSourceY = meanBy(targetLinks, (link) =>
              nodeCenter(findTargetNode(link, nodes, getNodeID))
            );

            if (avgTargetY && avgSourceY) {
              avg = (avgTargetY + avgSourceY) / 2;
            } else {
              avg = avgTargetY || avgSourceY;
            }

            let dy = (avg - nodeCenter(node)) * alpha;
            // positive if it node needs to move down
            node.y0 += dy;
            node.y1 += dy;
          }
        }
      });
    });
  }

  // For each column, check if nodes are overlapping, and if so, shift up/down
  function resolveCollisions() {
    columns.forEach((nodes) => {
      var node,
        dy,
        y = inputGraph.y0,
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
      dy = y - nodePadding - inputGraph.y1;
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

  return inputGraph;
};
