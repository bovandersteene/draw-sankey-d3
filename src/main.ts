import "./style.css";
import { data3 } from "./data-simple";
import { drawSankeyCirculair } from "./circulair/sankey-circulair";
import { energyData } from "./energy-data";

/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

// drawSankey("#chart", data2);
drawSankeyCirculair("chart2", data3, { useVirtualRoutes: true });
drawSankeyCirculair("chart2", data3, { useVirtualRoutes: false });
false && drawSankeyCirculair("chart2", energyData, { useVirtualRoutes: true });
false && drawSankeyCirculair("chart2", energyData, { useVirtualRoutes: false });
// drawSankey('#chart2', data);
