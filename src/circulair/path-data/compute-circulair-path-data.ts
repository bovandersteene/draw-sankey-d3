import { Graph, Link, Node } from "../model";
import { onlyCircularLink, selfLinking } from "../utils";
import { findSourceNode, findTargetNode } from "../utils/links";
function sortLinkSourceYDescending(link1: Link, link2: Link) {
  return link2.y0 - link1.y0;
} // sort ascending links by their target vertical position, y1
function sortLinkTargetYAscending(link1: Link, link2: Link) {
  return link1.y1 - link2.y1;
}
function sortLinkSourceYAscending(link1: Link, link2: Link) {
  return link1.y0 - link2.y0;
} // sort descending links by their target vertical position, y1
function sortLinkTargetYDescending(link1: Link, link2: Link) {
  return link2.y1 - link1.y1;
}

// return the distance between the link's target and source node, in terms of the nodes' column
function linkColumnDistance(
  link: Link,
  nodes: Node[],
  getNodeID: (node: any) => string
) {
  const source = findSourceNode(link, nodes, getNodeID);
  const target = findTargetNode(link, nodes, getNodeID);
  return target.column - source.column;
}

// sort links based on the distance between the source and tartget node columns
// if the same, then use Y position of the source node
function sortLinkColumnAscending(
  nodes: Node[],
  getNodeID: (node: any) => string
) {
  return (link1: Link, link2: Link) => {
    const distance1 = linkColumnDistance(link1, nodes, getNodeID);
    const distance2 = linkColumnDistance(link2, nodes, getNodeID);
    if (distance1 === distance2) {
      return link1.circularLinkType == "bottom"
        ? sortLinkSourceYDescending(link1, link2)
        : sortLinkSourceYAscending(link1, link2);
    } else {
      return distance2 - distance1;
    }
  };
}
function circularLinksCross(
  link1: Link,
  link2: Link,
  nodes: Node[],
  getNodeID: (node: any) => string
) {
  const l1Source = findSourceNode(link1, nodes, getNodeID);
  const l1Target = findTargetNode(link1, nodes, getNodeID);
  const l2Target = findTargetNode(link2, nodes, getNodeID);
  const l2Source = findSourceNode(link2, nodes, getNodeID);
  if (l1Source.column < l2Target.column) {
    return false;
  } else if (l1Target.column > l2Source.column) {
    return false;
  } else {
    return true;
  }
}

export const calcVerticalBuffer = (
  links: Link[],
  nodes: Node[],
  { getNodeID, sankey }: Pick<Graph, "getNodeID" | "sankey">
) => {
  const { circularLinkGap } = sankey;

  links.sort(sortLinkColumnAscending(nodes, getNodeID));
  links.forEach(function (link, i) {
    var buffer = 0;
    link.circularPathData = link.circularPathData ?? {};
    if (
      selfLinking(link, getNodeID) &&
      onlyCircularLink(link, links, nodes, getNodeID)
    ) {
      link.circularPathData.verticalBuffer = buffer + link.width / 2;
    } else {
      var j = 0;
      for (j; j < i; j++) {
        if (circularLinksCross(links[i], links[j], nodes, getNodeID)) {
          var bufferOverThisLink =
            links[j].circularPathData.verticalBuffer +
            links[j].width / 2 +
            circularLinkGap;
          buffer = bufferOverThisLink > buffer ? bufferOverThisLink : buffer;
        }
      }

      link.circularPathData.verticalBuffer = buffer + link.width / 2;
    }
  });

  return links;
};

// create a d path using the addCircularPathData
export const computeCircularPathData = (
  link: Readonly<Link>,
  source: Readonly<Node>,
  target: Readonly<Node>,
  nodes: Node[],
  links: Link[],
  { getNodeID, sankey }: Pick<Graph, "getNodeID" | "sankey">,
  minY: number,
  buffer = 5
) => {
  const { baseRadius, verticalMargin, circularLinkGap } = sankey;
  const circularPathData = link.circularPathData ?? ({} as any);
  circularPathData.arcRadius = link.width + baseRadius;
  circularPathData.leftNodeBuffer = buffer;
  circularPathData.rightNodeBuffer = buffer;
  circularPathData.sourceWidth = source.x1 - source.x0;
  circularPathData.sourceX = source.x0 + circularPathData.sourceWidth;
  circularPathData.targetX = target.x0;
  circularPathData.sourceY = link.y0;
  circularPathData.targetY = link.y1;

  let y1 = 0;

  // for self linking paths, and that the only circular link in/out of that node
  if (
    selfLinking(link, getNodeID) &&
    onlyCircularLink(link, links, nodes, getNodeID)
  ) {
    console.log("only self linking");
    circularPathData.leftSmallArcRadius = baseRadius + link.width / 2;
    circularPathData.leftLargeArcRadius = baseRadius + link.width / 2;
    circularPathData.rightSmallArcRadius = baseRadius + link.width / 2;
    circularPathData.rightLargeArcRadius = baseRadius + link.width / 2;

    if (link.circularLinkType == "bottom") {
      circularPathData.verticalFullExtent =
        source.y1 + verticalMargin + circularPathData.verticalBuffer;
      circularPathData.verticalLeftInnerExtent =
        circularPathData.verticalFullExtent -
        circularPathData.leftLargeArcRadius;
      circularPathData.verticalRightInnerExtent =
        circularPathData.verticalFullExtent -
        circularPathData.rightLargeArcRadius;
    } else {
      // top links
      circularPathData.verticalFullExtent =
        source.y0 - verticalMargin - circularPathData.verticalBuffer;
      circularPathData.verticalLeftInnerExtent =
        circularPathData.verticalFullExtent +
        circularPathData.leftLargeArcRadius;
      circularPathData.verticalRightInnerExtent =
        circularPathData.verticalFullExtent +
        circularPathData.rightLargeArcRadius;
    }
  } else {
    // else calculate normally
    // add left extent coordinates, based on links with same source column and circularLink type
    var thisColumn = source.column;
    var thisCircularLinkType = link.circularLinkType;
    var sameColumnLinks = links.filter((l) => {
      return (
        source.column == thisColumn &&
        l.circularLinkType == thisCircularLinkType
      );
    });

    if (link.circularLinkType == "bottom") {
      sameColumnLinks.sort(sortLinkSourceYDescending);
    } else {
      sameColumnLinks.sort(sortLinkSourceYAscending);
    }

    var radiusOffset = 0;
    sameColumnLinks.forEach(function (l, i) {
      if (l.circularLinkID == link.circularLinkID) {
        circularPathData.leftSmallArcRadius =
          baseRadius + link.width / 2 + radiusOffset;
        circularPathData.leftLargeArcRadius =
          baseRadius + link.width / 2 + i * circularLinkGap + radiusOffset;
      }
      radiusOffset = radiusOffset + l.width;
    });

    // add right extent coordinates, based on links with same target column and circularLink type
    thisColumn = target.column;
    sameColumnLinks = links.filter(function (l) {
      const t = findTargetNode(l, nodes, getNodeID);
      return (
        t.column == thisColumn && l.circularLinkType == thisCircularLinkType
      );
    });
    if (link.circularLinkType == "bottom") {
      sameColumnLinks.sort(sortLinkTargetYDescending);
    } else {
      sameColumnLinks.sort(sortLinkTargetYAscending);
    }

    radiusOffset = 0;
    sameColumnLinks.forEach(function (l, i) {
      if (l.circularLinkID == link.circularLinkID) {
        circularPathData.rightSmallArcRadius =
          baseRadius + link.width / 2 + radiusOffset;
        circularPathData.rightLargeArcRadius =
          baseRadius + link.width / 2 + i * circularLinkGap + radiusOffset;
      }
      radiusOffset = radiusOffset + l.width;
    });

    console.log("verticalBuffer", circularPathData.verticalBuffer);
    // bottom links
    if (link.circularLinkType == "bottom") {
      circularPathData.verticalFullExtent =
        Math.max(y1, source.y1, target.y1) +
        verticalMargin +
        circularPathData.verticalBuffer;
      circularPathData.verticalLeftInnerExtent =
        circularPathData.verticalFullExtent -
        circularPathData.leftLargeArcRadius;
      circularPathData.verticalRightInnerExtent =
        circularPathData.verticalFullExtent -
        circularPathData.rightLargeArcRadius;
    } else {
      // top links
      circularPathData.verticalFullExtent =
        minY - verticalMargin - circularPathData.verticalBuffer;
      circularPathData.verticalLeftInnerExtent =
        circularPathData.verticalFullExtent +
        circularPathData.leftLargeArcRadius;
      circularPathData.verticalRightInnerExtent =
        circularPathData.verticalFullExtent +
        circularPathData.rightLargeArcRadius;
    }
  }

  // all links
  circularPathData.leftInnerExtent =
    circularPathData.sourceX + circularPathData.leftNodeBuffer;
  circularPathData.rightInnerExtent =
    circularPathData.targetX - circularPathData.rightNodeBuffer;
  circularPathData.leftFullExtent =
    circularPathData.sourceX +
    circularPathData.leftLargeArcRadius +
    circularPathData.leftNodeBuffer;
  circularPathData.rightFullExtent =
    circularPathData.targetX -
    circularPathData.rightLargeArcRadius -
    circularPathData.rightNodeBuffer;
  return circularPathData;
};
