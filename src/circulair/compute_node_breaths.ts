import { computeColumns } from "./compute_columns";
import { GraphData, Graph, Link, Node } from "./model";
import { numberOfNonSelfLinkingCycles } from "./utils";

const calculateNodeSize = (
  node: Node,
  nodesLength: number,
  columnsLength: number,
  {
    getNodeID,
    setNodePositions,
  }: Pick<Graph<Node, Link>, "getNodeID" | "setNodePositions">,
  graph: Readonly<Pick<GraphData, "ky" | "y1" | "y0">>,
  i: number
): Node => {
  const selfLinkingCycles = numberOfNonSelfLinkingCycles(node, getNodeID);
  // if the node is in the last column, and is the only node in that column, put it in the centre
  if (node.depth == columnsLength - 1 && nodesLength == 1) {
    node.y0 = graph.y1 / 2 - node.value * graph.ky;
    node.y1 = node.y0 + node.value * graph.ky;

    // if the node is in the first column, and is the only node in that column, put it in the centre
  } else if (node.depth == 0 && nodesLength == 1) {
    node.y0 = graph.y1 / 2 - node.value * graph.ky;
    node.y1 = node.y0 + node.value * graph.ky;
  }

  // if the node has a circular link
  else if (node.partOfCycle) {
    // if the node has no self links
    if (selfLinkingCycles == 0) {
      node.y0 = graph.y1 / 2 + i;
      node.y1 = node.y0 + node.value * graph.ky;
    } else if (node.circularLinkType == "top") {
      node.y0 = graph.y0 + i;
      node.y1 = node.y0 + node.value * graph.ky;
    } else {
      node.y0 = graph.y1 - node.value * graph.ky - i;
      node.y1 = node.y0 + node.value * graph.ky;
    }
  } else {
    // if (graph.y0.top == 0 || graph.y1.bottom == 0) {
    node.y0 = ((graph.y1 - graph.y0) / nodesLength) * i;
    node.y1 = node.y0 + node.value * graph.ky;
    // } else {
    // node.y0 = (graph.y1 - graph.y0) / 2 - nodesLength / 2 + i;
    // node.y1 = node.y0 + node.value * graph.ky;
    // // }
  }

  return { ...node, height: node.y1 - node.y0 };
};

// Assign nodes' breadths, and then shift nodes that overlap (resolveCollisions)
export const computeNodeBreadths = (
  inputGraph: Readonly<GraphData>,
  settings: Pick<Graph<Node, Link>, "getNodeID" | "setNodePositions">
) => {
  const { getNodeID, setNodePositions } = settings;
  const columns = computeColumns(inputGraph);

  const columnsLength = columns.length;

  columns.forEach((nodes: Node[]) => {
    var nodesLength = nodes.length;

    let totalColumnValue = nodes.reduce(function (total, d) {
      return total + d.value;
    }, 0);

    // let preferredTotalGap = y1 - y0 - totalColumnValue * ky;

    nodes.sort((a, b) => {
      if (a.circularLinkType == b.circularLinkType) {
        return (
          numberOfNonSelfLinkingCycles(b, getNodeID) -
          numberOfNonSelfLinkingCycles(a, getNodeID)
        );
      } else if (
        a.circularLinkType == "top" &&
        b.circularLinkType == "bottom"
      ) {
        return -1;
      } else if (a.circularLinkType == "top" && b.partOfCycle == false) {
        return -1;
      } else if (a.partOfCycle == false && b.circularLinkType == "bottom") {
        return -1;
      }
    });

    if (setNodePositions) {
      console.warn("implement setNodePositions");
      let currentY = y0;

      //   nodes.forEach(function (node, i) {
      //     if (nodes.length == 1) {
      //       node.y0 = sankeyExtent.y1 / 2 - node.value * graph.ky;
      //       node.y1 = node.y0 + node.value * graph.ky;
      //     } else {
      //       node.y0 = currentY;
      //       node.y1 = node.y0 + node.value * graph.ky;
      //       currentY = node.y1 + preferredTotalGap / (nodes.length - 1);
      //     }
      //   });
    } else {
      nodes.forEach((node: Node, i) =>
        calculateNodeSize(
          node,
          nodesLength,
          columnsLength,
          settings,
          inputGraph,
          i
        )
      );
    }
  });

  return inputGraph;
};
