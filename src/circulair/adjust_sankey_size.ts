import { sumBy } from "lodash";
import { Graph, GraphData, Link, Node, SankeyParams } from "./model";

import * as d3 from "d3";
import { getColumn, getWidth } from "./utils";
import { computeColumns } from "./compute_columns";

type GraphDimensions = Pick<GraphData, "x0" | "x1" | "y1" | "y0"> & {
  scaleX: number;
  scaleY: number;
};
type Margin = { top: number; left: number; right: number; bottom: number };

const getKy = (columns: any, py: number, sankey: SankeyParams) => {
  const values = columns.map(
    (nodes: Node[]) =>
      (sankey.extend.y1 - sankey.extend.y0 - (nodes.length - 1) * py) /
      sumBy(nodes, (d) => d.value)
  );
  const minValue = Math.min(...values);
  console.log(values, sankey.scale);
  console.log(minValue, sankey.scale);

  return minValue * sankey.scale;
};

const caclulateMarginValue = (
  value: number,
  { baseRadius, verticalMargin }: SankeyParams
) => {
  return value > 0 ? value + verticalMargin + baseRadius : value;
};

const calculateMargin = (
  nodes: Node[],
  links: Link[],
  sankey: SankeyParams
): Margin => {
  let totalTopLinksWidth = 0,
    totalBottomLinksWidth = 0,
    totalRightLinksWidth = 0,
    totalLeftLinksWidth = 0;

  const maxColumn = d3.max(nodes, getColumn);

  links.forEach((link) => {
    const linkWidth = getWidth(link);
    if (link.circular) {
      if (link.circularLinkType == "top") {
        totalTopLinksWidth = totalTopLinksWidth + linkWidth;
      } else {
        totalBottomLinksWidth = totalBottomLinksWidth + linkWidth;
      }

      if (getColumn(link.target) == 0) {
        totalLeftLinksWidth = totalLeftLinksWidth + linkWidth;
      }

      if (getColumn(link.source) == maxColumn) {
        totalRightLinksWidth = totalRightLinksWidth + linkWidth;
      }
    }
  });

  return {
    top: caclulateMarginValue(totalTopLinksWidth, sankey),
    bottom: caclulateMarginValue(totalBottomLinksWidth, sankey),
    left: caclulateMarginValue(totalLeftLinksWidth, sankey),
    right: caclulateMarginValue(totalRightLinksWidth, sankey),
  };
};

const calculateGraphDimsions = (
  graph: Readonly<GraphData>,
  margin: Margin
): GraphDimensions => {
  const currentWidth = graph.x1 - graph.x0;
  const currentHeight = graph.y1 - graph.y0;

  const newWidth = currentWidth + margin.right + margin.left;
  const newHeight = currentHeight + margin.top + margin.bottom;

  const scaleX = currentWidth / newWidth;
  const scaleY = currentHeight / newHeight;

  const x0 = graph.x0 * scaleX + margin.left;
  const x1 = margin.right == 0 ? graph.x1 : graph.x1 * scaleX;
  const y0 = graph.y0 * scaleY + margin.top;
  const y1 = graph.y1 * scaleY;

  return { x0, y0, y1, x1, scaleX, scaleY };
};

const calculateNodeSize = <NODE_TYPE extends Node>(
  graph: GraphDimensions,
  node: NODE_TYPE,
  { nodeWidth }: Pick<SankeyParams, "nodeWidth">,
  maxColumn: number
): NODE_TYPE => {
  const x0 = graph.x0 ?? 0;
  const x1 = graph.x1 ?? 0;
  const column = getColumn(node) ?? 0;
  const mCol = maxColumn ?? 1;
  const nodeX0 = x0 + column * ((x1 - x0 - nodeWidth) / mCol);
  const nodeX1 = x0 + nodeWidth;

  return { ...node, x0: nodeX0, nodeX1, width: nodeWidth };
};

export const adjustSankeySize = (
  inputGraph: Readonly<GraphData>,
  { sankey }: Pick<Graph<Node, Link>, "sankey">
) => {
  //  let graph = cloneDeep(inputGraph);
  let py = inputGraph.py ?? 0;

  const columns = computeColumns(inputGraph);
  const maxColumn = d3.max(inputGraph.nodes, getColumn) ?? 1;

  //override py if nodePadding has been set
  if (sankey.paddingRatio) {
    var padding = Infinity;
    columns.forEach((nodes: Node[]) => {
      var thisPadding =
        (sankey.extend.y1 * sankey.paddingRatio) / (nodes.length + 1);
      padding = thisPadding < padding ? thisPadding : padding;
    });
    py = padding;
  } else {
    py = sankey.nodePadding;
  }

  let ky = getKy(columns, py, sankey);

  const margin = calculateMargin(inputGraph.nodes, inputGraph.links, sankey);

  const graphDimensions = calculateGraphDimsions(inputGraph, margin);
  const nodes = inputGraph.nodes.map((node) =>
    calculateNodeSize(graphDimensions, node, sankey, maxColumn)
  );

  //re-calculate widths
  ky = ky * graphDimensions.scaleY;

  const links = inputGraph.links.map((link) => {
    return { ...link, width: getWidth(link, ky) };
  });
  return { ...inputGraph, nodes, links, ky, py, ...graphDimensions };
};
