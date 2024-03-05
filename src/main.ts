import "./style.css";
import { data3 } from "./data-simple";
import { drawSankeyCirculair } from "./circulair/draw-sankey";
import { energyData } from "./energy-data";
import { drawEhub } from "./circulair/draw-ehub";

/** Inspired on https://observablehq.com/@tomshanley/sankey-circular-deconstructed */

// drawSankey("#chart", data2);
drawSankeyCirculair("chart2", data3, { useVirtualRoutes: true });
false && drawSankeyCirculair("chart2", data3, { useVirtualRoutes: false });
drawSankeyCirculair("chart2", energyData, {
  useVirtualRoutes: true,
  nodeText: (d: any) => d.label ?? d.name,
});
drawEhub("chart2", energyData, {
  useVirtualRoutes: true,
  nodeText: (d: any) => d.label ?? d.name,
});
false && drawSankeyCirculair("chart2", energyData, { useVirtualRoutes: false });
// drawSankey('#chart2', data);
