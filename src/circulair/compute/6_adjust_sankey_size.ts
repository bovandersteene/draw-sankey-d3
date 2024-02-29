import { sumBy } from "lodash";
import {
  Graph,
  GraphData,
  GraphExtend,
  Link,
  Node,
  SankeyParams,
} from "../model";

import { getWidth } from "../utils/links";
type GraphDimensions = {
  scaleX: number;
  scaleY: number;
};
type Margin = { top: number; left: number; right: number; bottom: number };

const getMinVal = (nodes: Node[], sankey: SankeyParams, py: number) => {
  const sumNodes = sumBy(nodes, (d: Node) => d.value ?? 0);
  return (
    (sankey.extend.y1 - sankey.extend.y0 - (nodes.length - 1) * py) / sumNodes
  );
};

const getKy = (columns: any, py: number, sankey: SankeyParams) => {
  const values = columns.map((nodes: Node[]) => getMinVal(nodes, sankey, py));
  const minValue = Math.min(...values);

  return minValue * sankey.scale;
};

const caclulateMarginValue = (
  value: number,
  { baseRadius, verticalMargin }: SankeyParams
) => {
  return value > 0 ? value + verticalMargin + baseRadius : value;
};

const calculateMargin = (
  graph: Readonly<GraphData>,
  { sankey }: Pick<Graph<Node, Link>, "sankey">
): Margin => {
  let totalTopLinksWidth = 0,
    totalBottomLinksWidth = 0,
    totalRightLinksWidth = 0,
    totalLeftLinksWidth = 0;

  const maxColumn = graph.maxColumns();

  graph.forEachLink((link: Link) => {
    const linkWidth = getWidth(link, graph.extend.ky);
    if (link.circular) {
      if (link.circularLinkType == "top") {
        totalTopLinksWidth = totalTopLinksWidth + linkWidth;
      } else {
        totalBottomLinksWidth = totalBottomLinksWidth + linkWidth;
      }
      const { target, source } = graph.getNodeLinks(link);
      if (target.column == 0) {
        totalLeftLinksWidth = totalLeftLinksWidth + linkWidth;
      }

      if (source.column == maxColumn) {
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
  const { extend } = graph;
  const currentWidth = extend.x1 - extend.x0;
  const currentHeight = extend.y1 - extend.y0;

  const newWidth = currentWidth + margin.right + margin.left;
  const newHeight = currentHeight + margin.top + margin.bottom;

  const scaleX = currentWidth / newWidth;
  const scaleY = currentHeight / newHeight;

  const x0 = extend.x0 * scaleX + margin.left;
  const x1 = margin.right == 0 ? extend.x1 : extend.x1 * scaleX;
  const y0 = extend.y0 * scaleY + margin.top;
  const y1 = extend.y1 * scaleY;

  graph.setExtendValue("x0", x0);
  graph.setExtendValue("x1", x1);
  graph.setExtendValue("y0", y0);
  graph.setExtendValue("y1", y1);

  return { scaleX, scaleY };
};

const calculateNodeSize = <NODE_TYPE extends Node>(
  extend: GraphExtend,
  node: NODE_TYPE,
  { nodeWidth }: Pick<SankeyParams, "nodeWidth">,
  maxColumn: number
): void => {
  const x0 = extend.x0 ?? 0;
  const x1 = extend.x1 ?? 0;
  const column = node.column ?? 0;
  const mCol = maxColumn ?? 1;
  const nodeX0 = x0 + column * ((x1 - x0 - nodeWidth) / mCol);
  const nodeX1 = nodeX0 + (nodeWidth ?? 10);

  node.x0 = nodeX0;
  node.x1 = nodeX1;
  node.width = nodeX1 - nodeX0;
  // width: nodeWidth
};

export const adjustSankeySize = (graph: Readonly<Graph<any, any>>) => {
  const { sankey, graph: data } = graph;
  const { extend } = data;
  //  let graph = cloneDeep(data);
  const py = extend.py ?? 0;

  const columns = data.computeColumns();
  const maxColumn = data.maxColumns();

  //override py if nodePadding has been set
  if (sankey.paddingRatio) {
    let padding = Infinity;
    columns.forEach((nodes: Node[]) => {
      const thisPadding =
        (sankey.extend.y1 * sankey.paddingRatio) / (nodes.length + 1);
      padding = thisPadding < padding ? thisPadding : padding;
    });
    data.setExtendValue("py", padding);
  } else {
    data.setExtendValue("py", sankey.nodePadding);
  }
  console.log(columns, py, sankey);
  data.setExtendValue("ky", getKy(columns, py, sankey));

  const margin = calculateMargin(data, graph);

  const graphDimensions = calculateGraphDimsions(data, margin);

  data.forEachNode((node: Node) =>
    calculateNodeSize(data.extend, node, sankey, maxColumn)
  );

  //re-calculate widths
  data.setExtendValue("ky", extend.ky * graphDimensions.scaleY);

  data.forEachLink((link: Link) => {
    link.width = getWidth(link, extend.ky);
  });

  return data;
};
