import { maxBy, minBy } from "lodash";
import { Graph, Link, Node } from "../model";

export const fillHeight = ({ graph: data }: Readonly<Graph<any, any>>) => {
  const nodes = data.getNodes();
  const links = data.getLinks();

  let top = false;
  let bottom = false;
  const { extend } = data;

  data.forEachLink((link: Link) => {
    if (link.circularLinkType == "top") {
      top = true;
    } else if (link.circularLinkType == "bottom") {
      bottom = true;
    }
  });

  if (top == false || bottom == false) {
    const minY0 = minBy(nodes, (node: Node) => node.y0)?.y0 ?? 0;
    const maxY1 = maxBy(nodes, (node: Node) => node.y1)?.y1 ?? 0;

    const currentHeight = maxY1 - minY0;
    const chartHeight = extend.y1 - extend.y0;
    const ratio = chartHeight / currentHeight;

    nodes.forEach((node: Node) => {
      const nodeHeight = (node.y1 - node.y0) * ratio;
      node.y0 = (node.y0 - minY0) * ratio;
      node.y1 = node.y0 + nodeHeight;
    });

    links.forEach((link: Link) => {
      link.y0 = (link.y0 - minY0) * ratio;
      link.y1 = (link.y1 - minY0) * ratio;
      link.width = link.width * ratio;
    });
  }
};
