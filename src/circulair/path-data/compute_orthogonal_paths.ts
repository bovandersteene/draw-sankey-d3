import { Graph, GraphData, Link, Node, OrthogonalPathData } from "../model";
import { calcVerticalBuffer } from "./compute-circulair-path-data";
import { nodeHeight } from "../utils/node";
const computeCircularPath = (
  link: Readonly<Link>,
  { x: sx, y: sy, height: sh }: OrthogonalPathData,
  { x: tx, y: ty, height: th }: OrthogonalPathData
) => {
  const height = sh < th ? th : sh;
  const width = 20;
  const x1 = sx + width;
  const y1 = sy + height;
  const x2 = tx - width;

  return `M ${sx} ${sy}
          L ${x1} ${sy}
          L ${x1} ${y1}
          L ${x2} ${y1}
          L ${x2} ${ty}
          L ${tx} ${ty} `;
};

const computeNormalPath = (
  link: Readonly<Link>,
  { x: sx, y: sy }: OrthogonalPathData,
  { x: tx, y: ty }: OrthogonalPathData
) => {
  const x1 = sx + (tx - sx) / 2;
  const y1 = sy;

  return `M ${sx} ${sy} H ${x1} V ${ty} H ${tx}`;
};

const computePathData = (node: Node, data: GraphData<Node, Link>) => {
  const targetLinks = data.getTargetLinks(node);
  const sourceLinks = data.getSourceLinks(node);

  const totalTargetLinks = targetLinks.length;
  const totalSourceLinks = sourceLinks.length;

  const height = nodeHeight(node);
  const offsetTarget = height / (totalTargetLinks + 1);
  const offsetSource = height / (totalSourceLinks + 1);

  targetLinks.forEach((link, i) => {
    const { orthogonalPathData } = link;
    const y = node.y0 + offsetTarget * (i + 1);
    link.orthogonalPathData = {
      ...(orthogonalPathData ?? {
        source: { x: 0, y: 0, height: 0, index: 0 },
      }),
      target: { x: node.x0, y, index: i, height },
    };
  });
  sourceLinks.forEach((link, i) => {
    const { orthogonalPathData } = link;
    const y = node.y0 + offsetSource * (i + 1);
    link.orthogonalPathData = {
      ...(orthogonalPathData ?? {
        target: { x: 0, y: 0, height: 0, index: 0 },
      }),
      source: { x: node.x1, y, index: i, height },
    };
  });
};

const sortOrthogonalLinks =
  (key: "source" | "target") => (l1: Link, l2: Link) => {
    const o1 = l1.orthogonalPathData![key];
    const o2 = l2.orthogonalPathData![key];
    const offset = 10;

    if (o1.y - o2.y < offset) return -1;

    if (o1.y === o2.y) console.warn("oops");

    return 1;
  };

const sortLinks_ = (
  links: Link[],
  orthogonalKey: "source" | "target",
  sortKey: "source" | "target"
) => {
  if (links.length == 1) return;
  const values = links
    .map((l) => l.orthogonalPathData![orthogonalKey].y)
    .sort((a, b) => (a < b ? -1 : 1));

  const sorted = links.sort(sortOrthogonalLinks(sortKey));

  sorted.forEach(
    (link, i) => (link.orthogonalPathData![orthogonalKey].y = values[i])
  );
};

const sortLinks = (node: Node, data: GraphData<Node, Link>) => {
  const targetLinks = data.getTargetLinks(node);
  const sourceLinks = data.getSourceLinks(node);

  sortLinks_(targetLinks, "target", "source");
  sortLinks_(sourceLinks, "source", "target");
};

export const computeOrthogonalPaths = (graph: Graph<any, any>) => {
  const { graph: data } = graph;

  const topLinks = data.filterLinks((l: Link) => l.circularLinkType == "top");
  calcVerticalBuffer(topLinks, graph, data);

  const bottomLinks = data.filterLinks(
    (l: Link) => l.circularLinkType == "bottom"
  );

  calcVerticalBuffer(bottomLinks, graph, data);

  data.forEachNode((node) => computePathData(node, data));
  data.forEachNode((node) => sortLinks(node, data));

  data.forEachLink((link: Link) => {
    const { orthogonalPathData } = link;

    if (!orthogonalPathData) {
      console.log("no path data");
    } else if (link.circular) {
      link.path = computeCircularPath(
        link,
        orthogonalPathData.source,
        orthogonalPathData.target
      );
    } else {
      link.path = computeNormalPath(
        link,
        orthogonalPathData.source,
        orthogonalPathData.target
      );
    }
  });
};
