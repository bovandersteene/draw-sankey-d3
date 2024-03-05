import { Graph } from "../model";
import { linkPerpendicularYToLinkSource, sameInclines } from "./utils";

// sort and set the links' y1 for each node
export const sortTargetLinks = ({ graph: data }: Readonly<Graph>) => {
  data.forEachNode(function (node) {
    const nodesTargetLinks = data.getNodeTargetLinks(node);

    const nodesTargetLinksLength = nodesTargetLinks.length;

    if (nodesTargetLinksLength > 1) {
      nodesTargetLinks.sort((link1, link2) => {
        const nodes1 = data.getNodeLinks(link1);
        const nodes2 = data.getNodeLinks(link2);
        // if both are not circular, the base on the source y position
        if (!link1.circular && !link2.circular) {
          if (nodes1.source.column == nodes2.source.column) {
            return link1.y0 - link2.y0;
          } else if (!sameInclines(link1, link2)) {
            return link1.y0 - link2.y0;
          } else {
            // get the angle of the link to the further source node (ie the smaller column)
            if (nodes2.source.column < nodes1.source.column) {
              const link2Adj = linkPerpendicularYToLinkSource(
                link2,
                link1,
                data
              );

              return link1.y0 - link2Adj;
            }
            if (nodes1.source.column < nodes2.source.column) {
              const link1Adj = linkPerpendicularYToLinkSource(
                link1,
                link2,
                data
              );

              return link1Adj - link2.y0;
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
            if (nodes1.source.column === nodes2.source.column) {
              return nodes1.source.y1 - nodes2.source.y1;
            } else {
              // ...and they connect to different column targets, then sort by how far back they
              return nodes1.source.column - nodes2.source.column;
            }
          } else if (
            link1.circularLinkType === link2.circularLinkType &&
            link1.circularLinkType == "bottom"
          ) {
            // ...and they both loop the same way (both bottom)
            // ...and they both connect to a target with same column, then sort by the target's y
            if (nodes1.source.column === nodes2.source.column) {
              return nodes1.source.y1 - nodes2.source.y1;
            } else {
              // ...and they connect to different column targets, then sort by how far back they
              return nodes2.source.column - nodes1.source.column;
            }
          } else {
            // ...and they loop around different ways, the move top up and bottom down
            return link1.circularLinkType == "top" ? -1 : 1;
          }
        }
      });
    }

    // update y1 for links
    let yTargetOffset = node.y0;

    nodesTargetLinks.forEach(function (link) {
      link.y1 = yTargetOffset + link.width / 2;
      yTargetOffset = yTargetOffset + link.width;
    });

    // correct any circular bottom links so they are at the bottom of the node
    nodesTargetLinks.forEach(function (link, i) {
      if (link.circularLinkType == "bottom") {
        let j = i + 1;
        let offsetFromBottom = 0;
        // sum the widths of any links that are below this link
        for (j; j < nodesTargetLinksLength; j++) {
          offsetFromBottom = offsetFromBottom + nodesTargetLinks[j].width;
        }
        link.y1 = node.y1 - offsetFromBottom - link.width / 2;
      }
    });
  });
};
