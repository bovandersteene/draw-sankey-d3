import "./style.css";
import * as d3 from "d3";
import { data2, data1, data4 } from "./data";
import { data } from "./data-simple";
import { drawSankey } from "./draw-sankey";
import { sankeyCircular } from "./sankey-circulair";
import { drawSankeyCirculair } from "./circulair/sankey-circulair";

// drawSankey("#chart", data2);
drawSankeyCirculair("chart2", data2);
// drawSankey('#chart2', data);
