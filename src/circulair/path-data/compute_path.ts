import { linkHorizontal } from "d3-shape";
import { Graph, Link, Node } from "../model";
import { computeCircularPathString } from "./compute-circulair-path";
import {
  calcVerticalBuffer,
  computeCircularPathData,
} from "./compute-circulair-path-data";

const computeNormalPath = (
  link: Readonly<Link>,
  source: Readonly<Node>,
  target: Readonly<Node>
) => {
  const normalPath = linkHorizontal()
    .source((d: any) => {
      const x = source.x0 + (source.x1 - source.x0);
      const y = d.y0;
      return [x, y];
    })
    .target((d: any) => {
      const x = target.x0;
      const y = d.y1;
      return [x, y];
    });

  return normalPath(link as any);
};

export const computeLinkPaths = (graph: Graph<any, any>) => {
  const { graph: data } = graph;
  const minY = data.getMinY();

  // calc vertical offsets per top/bottom links
  const topLinks = data.filterLinks((l: Link) => l.circularLinkType == "top");
  /* topLinks = */ calcVerticalBuffer(topLinks, graph, data);

  const bottomLinks = data.filterLinks(
    (l: Link) => l.circularLinkType == "bottom"
  );

  /* bottomLinks = */ calcVerticalBuffer(bottomLinks, graph, data);

  data.forEachLink((link: Link) => {
    const { source, target } = data.getNodeLinks(link);
    if (link.circular) {
      link.circularPathData = computeCircularPathData(
        link,
        source,
        target,
        data,
        graph,
        minY
      );
      link.path = computeCircularPathString(link);
    } else {
      link.path = computeNormalPath(link, source, target);
    }
  });
};
