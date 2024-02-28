import { min } from "d3-array";
import { linkHorizontal } from "d3-shape";
import { GraphData, Graph, Node, Link } from "../model";
import { selfLinking } from "../utils";
import { minBy } from "lodash";
import { findSourceNode } from "../utils/links";

function calcVerticalBuffer(
  links: Link[],
  { getNodeID }: Pick<Graph<Node, Link>, "getNodeID" | "setNodePositions">
) {
  links.sort(sortLinkColumnAscending);
  links.forEach(function (link, i) {
    var buffer = 0;

    if (selfLinking(link, id) && onlyCircularLink(link)) {
      link.circularPathData.verticalBuffer = buffer + link.width / 2;
    } else {
      var j = 0;
      for (j; j < i; j++) {
        if (circularLinksCross(links[i], links[j])) {
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
}

export function addCircularPathData(
  inputGraph: Readonly<GraphData>,
  { getNodeID }: Pick<Graph<Node, Link>, "getNodeID" | "setNodePositions">
) {
  //var baseRadius = 10
  const buffer = 5;
  //var verticalMargin = 25

  const minY = minBy(inputGraph.links, function (link) {
    const source = findSourceNode(link, inputGraph.nodes, getNodeID);
    return source.y0;
  });

  // create object for circular Path Data
  graph.links.forEach(function (link) {
    if (link.circular) {
      link.circularPathData = {};
    }
  });

  // calc vertical offsets per top/bottom links
  const topLinks = inputGraph.links.filter((l) => l.circularLinkType == "top");
  /* topLinks = */ calcVerticalBuffer(topLinks, circularLinkGap, id);

  const bottomLinks = inputGraph.links.filter(
    (l) => l.circularLinkType == "bottom"
  );

  /* bottomLinks = */ calcVerticalBuffer(bottomLinks, circularLinkGap, id);

  // add the base data for each link
  links = inputGraph.links.map( link =>);

  return { ...inputGraph, links };
}
