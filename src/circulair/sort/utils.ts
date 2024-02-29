import { GraphData, Link, Node } from "../model";

// test if links both slope up, or both slope down
export function sameInclines(link1: Link, link2: Link) {
  return incline(link1) == incline(link2);
}
// returns the slope of a link, from source to target
// up => slopes up from source to target
// down => slopes down from source to target
export function incline(link: Link) {
  return link.y0 - link.y1 > 0 ? "up" : "down";
}
// Return the Y coordinate on the longerLink path * which is perpendicular shorterLink's source.
// * approx, based on a straight line from target to source, when in fact the path is a bezier
export function linkPerpendicularYToLinkTarget(
  longerLink: Link,
  shorterLink: Link,
  data: GraphData
) {
  // get the angle for the longer link
  const angle = linkAngle(longerLink, data.getNodeLinks(longerLink));

  // get the adjacent length to the other link's x position
  const heightFromY1ToPependicular =
    linkXLength(data.getNodeLinks(shorterLink)) / Math.tan(angle);

  // add or subtract from longer link's original y1, depending on the slope
  const yPerpendicular =
    incline(longerLink) == "up"
      ? longerLink.y1 - heightFromY1ToPependicular
      : longerLink.y1 + heightFromY1ToPependicular;

  return yPerpendicular;
}

// Return the Y coordinate on the longerLink path * which is perpendicular shorterLink's source.
// * approx, based on a straight line from target to source, when in fact the path is a bezier
export function linkPerpendicularYToLinkSource(
  longerLink: Link,
  shorterLink: Link,
  data: GraphData
) {
  // get the angle for the longer link
  const angle = linkAngle(longerLink, data.getNodeLinks(longerLink));

  // get the adjacent length to the other link's x position
  const heightFromY1ToPependicular =
    linkXLength(data.getNodeLinks(shorterLink)) / Math.tan(angle);

  // add or subtract from longer link1's original y1, depending on the slope
  const yPerpendicular =
    incline(longerLink) == "up"
      ? longerLink.y1 + heightFromY1ToPependicular
      : longerLink.y1 - heightFromY1ToPependicular;

  return yPerpendicular;
}

// Return the angle between a straight line between the source and target of the link, and the vertical plane of the node
function linkAngle(
  link: Link,
  { target, source }: { target: Node; source: Node }
) {
  const adjacent = Math.abs(link.y1 - link.y0);
  const opposite = Math.abs(target.x0 - source.x1);

  return Math.atan(opposite / adjacent);
}
// return the distance between the link's target and source node, in terms of the nodes' X coordinate
function linkXLength({ target, source }: { target: Node; source: Node }) {
  return target.x0 - source.x1;
}
