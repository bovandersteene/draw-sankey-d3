import { Graph, GraphData, Node } from "../model";
import { numberOfNonSelfLinkingCycles } from "../utils/self-linking";

const calculateNodeSize = (
  node: Node,
  nodesLength: number,
  columnsLength: number,
  graph: Readonly<GraphData>,
  i: number
) => {
  const selfLinkingCycles = numberOfNonSelfLinkingCycles(node, graph);
  const { extend } = graph;
  // if the node is in the last column, and is the only node in that column, put it in the centre
  if (node.depth == columnsLength - 1 && nodesLength == 1) {
    node.y0 = extend.y1 / 2 - node.value * extend.ky;
    node.y1 = node.y0 + node.value * extend.ky;

    // if the node is in the first column, and is the only node in that column, put it in the centre
  } else if (node.depth == 0 && nodesLength == 1) {
    node.y0 = extend.y1 / 2 - node.value * extend.ky;
    node.y1 = node.y0 + node.value * extend.ky;
  }

  // if the node has a circular link
  else if (node.partOfCycle) {
    // if the node has no self links
    if (selfLinkingCycles == 0) {
      node.y0 = extend.y1 / 2 + i;
      node.y1 = node.y0 + node.value * extend.ky;
    } else if (node.circularLinkType == "top") {
      node.y0 = extend.y0 + i;
      node.y1 = node.y0 + node.value * extend.ky;
    } else {
      node.y0 = extend.y1 - node.value * extend.ky - i;
      node.y1 = node.y0 + node.value * extend.ky;
    }
  } else {
    // if (graph.y0.top == 0 || graph.y1.bottom == 0) {
    // node.y0 = ((graph.y1 - graph.y0) / nodesLength) * i;
    // node.y1 = node.y0 + node.value * graph.ky;
    // } else {
    node.y0 = (extend.y1 - extend.y0) / 2 - nodesLength / 2 + i;
    node.y1 = node.y0 + node.value * extend.ky;
    // }
  }
};

const sortNodes = (a: Node, b: Node, data: GraphData) => {
  if (a.circularLinkType == b.circularLinkType) {
    return (
      numberOfNonSelfLinkingCycles(b, data) -
      numberOfNonSelfLinkingCycles(a, data)
    );
  } else if (a.circularLinkType == "top" && b.circularLinkType == "bottom") {
    return -1;
  } else if (a.circularLinkType == "top" && b.partOfCycle == false) {
    return -1;
  } else if (a.partOfCycle == false && b.circularLinkType == "bottom") {
    return -1;
  }

  return 1;
};

// Assign nodes' breadths, and then shift nodes that overlap (resolveCollisions)
export const computeNodeBreadths = (graph: Graph<any, any>) => {
  const { graph: data, setNodePositions } = graph;
  const { extend } = data;
  const columns = data.computeColumns();

  const columnsLength = columns.length;

  columns.forEach((nodes: Node[]) => {
    const nodesLength = nodes.length;

    const totalColumnValue = nodes.reduce((total, d) => total + d.value, 0);

    const preferredTotalGap =
      extend.y1 - extend.y0 - totalColumnValue * extend.ky;

    const sortedNodes = nodes.sort((a: Node, b: Node) => sortNodes(a, b, data));

    if (setNodePositions) {
      console.warn("implement setNodePositions");
      const currentY = extend.y0;

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
      sortedNodes.forEach((node: Node, i) =>
        calculateNodeSize(node, nodesLength, columnsLength, data, i)
      );
    }
  });
};
