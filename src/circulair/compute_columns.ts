// Populate the sourceLinks and targetLinks for each node.

import { GraphData, Node } from "./model";
import * as d3 from "d3";
import { _typeof } from "./utils";
import { nest } from "d3-collection";

// Also, if the source and target are not objects, assume they are indices.
export const computeColumns = (inputGraph: Readonly<GraphData>): Node[][] => {
  const columns = nest()
    .key(function (d) {
      return d.column;
    })
    .sortKeys(d3.ascending)
    .entries(inputGraph.nodes)
    .map((d) => d.values);

  return columns;
};
