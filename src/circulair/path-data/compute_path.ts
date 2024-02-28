import { linkHorizontal } from "d3-shape";
import { Graph, GraphData, Link, Node } from "../model";
import { findSourceNode, findTargetNode } from "../utils/links";
import { computeCircularPathString } from "./compute-circulair-path";
import { minBy } from "lodash";
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
      var x = source.x0 + (source.x1 - source.x0);
      var y = d.y0;
      return [x, y];
    })
    .target((d: any) => {
      var x = target.x0;
      var y = d.y1;
      return [x, y];
    });

  return normalPath(link as any);
};

export const computeLinkPaths = (
  inputGraph: Readonly<GraphData>,
  settings: Graph
) => {
  const { getNodeID } = settings;
  const nodes = inputGraph.nodes;
  let links = inputGraph.links;
  const minY =
    minBy(links, (link: Link) => {
      const source = findSourceNode(link, inputGraph.nodes, getNodeID);
      return source.y0;
    })?.y0 ?? 0;

  // calc vertical offsets per top/bottom links
  const topLinks = links.filter((l: Link) => l.circularLinkType == "top");
  /* topLinks = */ calcVerticalBuffer(topLinks, nodes, settings);

  const bottomLinks = links.filter((l: Link) => l.circularLinkType == "bottom");

  /* bottomLinks = */ calcVerticalBuffer(bottomLinks, nodes, settings);

  links = links.map((link: Link) => {
    let path: string | null = "";
    const { getNodeID } = settings;
    const source = findSourceNode(link, nodes, getNodeID);
    const target = findTargetNode(link, nodes, getNodeID);
    if (link.circular) {
      link.circularPathData = computeCircularPathData(
        link,
        source,
        target,
        nodes,
        inputGraph.links,
        settings,
        minY
      );
      path = computeCircularPathString(link);
    } else {
      path = computeNormalPath(link, source, target);
    }

    return { ...link, path };
  });
  return { ...inputGraph, links };
};
