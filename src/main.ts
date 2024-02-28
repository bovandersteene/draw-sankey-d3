import "./style.css";
import * as d3 from "d3";
import { data2, data1, data4 } from "./data";
import { data3 } from "./data-simple";
import { drawSankey } from "./draw-sankey";
import { sankeyCircular } from "./sankey-circulair";
import { drawSankeyCirculair } from "./circulair/sankey-circulair";

/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

// drawSankey("#chart", data2);
false && drawSankeyCirculair("chart", data2, { useVirtualRoutes: true });
drawSankeyCirculair("chart2", data3, { useVirtualRoutes: true });
false && drawSankeyCirculair("chart2", data3, { useVirtualRoutes: false });
// drawSankey('#chart2', data);
