import { Graph, GraphData, Link } from "../model";
import { linkPerpendicularYToLinkTarget, sameInclines } from "./utils";

const sortNodeLinks =
  (data: GraphData, key: "target" | "source") => (link1: Link, link2: Link) => {
    const nodes1 = data.getNodeLinks(link1);
    const nodes2 = data.getNodeLinks(link2);

    // if both are not circular...
    if (!link1.circular && !link2.circular) {
      // if the target nodes are the same column, then sort by the link's target y
      if (nodes1[key].column == nodes2[key].column) {
        return link1.y1 - link2.y1;
      } else if (!sameInclines(link1, link2)) {
        // if the links slope in different directions, then sort by the link's target y
        return link1.y1 - link2.y1;

        // if the links slope in same directions, then sort by any overlap
      } else {
        if (nodes1[key].column > nodes2[key].column) {
          const link2Adj = linkPerpendicularYToLinkTarget(link2, link1, data);
          return link1.y1 - link2Adj;
        }
        if (nodes2[key].column > nodes1[key].column) {
          const link1Adj = linkPerpendicularYToLinkTarget(link1, link2, data);
          return link1Adj - link2.y1;
        }
      }
    }

    // if only one is circular, the move top links up, or bottom links down
    if (link1.circular && !link2.circular) {
      return link1.circularLinkType == "top" ? -1 : 1;
    } else if (link2.circular && !link1.circular) {
      return link2.circularLinkType == "top" ? 1 : -1;
    }

    // if both links are circular...
    if (link1.circular && link2.circular) {
      // ...and they both loop the same way (both top)
      if (
        link1.circularLinkType === link2.circularLinkType &&
        link1.circularLinkType == "top"
      ) {
        // ...and they both connect to a target with same column, then sort by the target's y
        if (nodes1[key].column === nodes2[key].column) {
          return nodes1[key].y1 - nodes2[key].y1;
        } else {
          // ...and they connect to different column targets, then sort by how far back they
          return nodes2[key].column - nodes1[key].column;
        }
      } else if (
        link1.circularLinkType === link2.circularLinkType &&
        link1.circularLinkType == "bottom"
      ) {
        // ...and they both loop the same way (both bottom)
        // ...and they both connect to a target with same column, then sort by the target's y
        if (nodes1[key].column === nodes2[key].column) {
          return nodes2[key].y1 - nodes1[key].y1;
        } else {
          // ...and they connect to different column targets, then sort by how far back they
          return nodes1[key].column - nodes2[key].column;
        }
      } else {
        // ...and they loop around different ways, the move top up and bottom down
        return link1.circularLinkType == "top" ? -1 : 1;
      }
    }
  };
// sort and set the links' y0 for each node
export const sortSourceLinks = ({ graph }: Readonly<Graph>) => {
  const { extend } = graph;
  graph.forEachNode((node) => {
    // move any nodes up which are off the bottom
    if (node.y + (node.y1 - node.y0) > extend.y1) {
      node.y = node.y - (node.y + (node.y1 - node.y0) - extend.y1);
    }

    const nodesSourceLinks = graph.getNodeSourceLinks(node);
    const nodeSourceLinksLength = nodesSourceLinks.length;

    // if more than 1 link then sort
    if (nodeSourceLinksLength > 1) {
      nodesSourceLinks.sort(sortNodeLinks(graph, "target"));
    }

    // update y0 for links
    let ySourceOffset = node.y0;

    nodesSourceLinks.forEach(function (link) {
      link.y0 = ySourceOffset + link.width / 2;
      ySourceOffset = ySourceOffset + link.width;
    });

    // correct any circular bottom links so they are at the bottom of the node
    nodesSourceLinks.forEach(function (link, i) {
      if (link.circularLinkType == "bottom") {
        let j = i + 1;
        let offsetFromBottom = 0;
        // sum the widths of any links that are below this link
        for (j; j < nodeSourceLinksLength; j++) {
          offsetFromBottom = offsetFromBottom + nodesSourceLinks[j].width;
        }
        link.y0 = node.y1 - offsetFromBottom - link.width / 2;
      }
    });
  });

  return graph;
};
