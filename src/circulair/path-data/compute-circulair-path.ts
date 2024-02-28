import { Graph, Link } from "../model";

// create a d path using the addCircularPathData
export const computeCircularPathString = (link: Link) => {
  const { circularPathData } = link;
  // 'pathData' is assigned a value but never used
  // var pathData = {}

  if (!circularPathData) {
    console.warn("no circulair path data for", link.source, "->", link.target);
    return null;
  }

  console.log(link.circularLinkType);
  console.table(circularPathData);

  if (link.circularLinkType == "top") {
    // start at the right of the source node
    return (
      "M" +
      circularPathData.sourceX +
      " " +
      circularPathData.sourceY +
      " " +
      // line right to buffer point
      "L" +
      circularPathData.leftInnerExtent +
      " " +
      circularPathData.sourceY +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.leftLargeArcRadius +
      " " +
      circularPathData.leftSmallArcRadius +
      " 0 0 0 " +
      // End of arc X //End of arc Y
      circularPathData.leftFullExtent +
      " " +
      (circularPathData.sourceY - circularPathData.leftSmallArcRadius) +
      " " + // End of arc X
      // line up to buffer point
      "L" +
      circularPathData.leftFullExtent +
      " " +
      circularPathData.verticalLeftInnerExtent +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.leftLargeArcRadius +
      " " +
      circularPathData.leftLargeArcRadius +
      " 0 0 0 " +
      // End of arc X //End of arc Y
      circularPathData.leftInnerExtent +
      " " +
      circularPathData.verticalFullExtent +
      " " + // End of arc X
      // line left to buffer point
      "L" +
      circularPathData.rightInnerExtent +
      " " +
      circularPathData.verticalFullExtent +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.rightLargeArcRadius +
      " " +
      circularPathData.rightLargeArcRadius +
      " 0 0 0 " +
      // End of arc X //End of arc Y
      circularPathData.rightFullExtent +
      " " +
      circularPathData.verticalRightInnerExtent +
      " " + // End of arc X
      // line down
      "L" +
      circularPathData.rightFullExtent +
      " " +
      (circularPathData.targetY - circularPathData.rightSmallArcRadius) +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.rightLargeArcRadius +
      " " +
      circularPathData.rightSmallArcRadius +
      " 0 0 0 " +
      // End of arc X //End of arc Y
      circularPathData.rightInnerExtent +
      " " +
      circularPathData.targetY +
      " " + // End of arc X
      // line to end
      "L" +
      circularPathData.targetX +
      " " +
      circularPathData.targetY
    );
  } else {
    // bottom path
    // start at the right of the source node
    return (
      "M" +
      circularPathData.sourceX +
      " " +
      circularPathData.sourceY +
      " " +
      // line right to buffer point
      "L" +
      circularPathData.leftInnerExtent +
      " " +
      circularPathData.sourceY +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.leftLargeArcRadius +
      " " +
      circularPathData.leftSmallArcRadius +
      " 0 0 1 " +
      // End of arc X //End of arc Y
      circularPathData.leftFullExtent +
      " " +
      (circularPathData.sourceY + circularPathData.leftSmallArcRadius) +
      " " + // End of arc X
      // line down to buffer point
      "L" +
      circularPathData.leftFullExtent +
      " " +
      circularPathData.verticalLeftInnerExtent +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.leftLargeArcRadius +
      " " +
      circularPathData.leftLargeArcRadius +
      " 0 0 1 " +
      // End of arc X //End of arc Y
      circularPathData.leftInnerExtent +
      " " +
      circularPathData.verticalFullExtent +
      " " + // End of arc X
      // line left to buffer point
      "L" +
      circularPathData.rightInnerExtent +
      " " +
      circularPathData.verticalFullExtent +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.rightLargeArcRadius +
      " " +
      circularPathData.rightLargeArcRadius +
      " 0 0 1 " +
      // End of arc X //End of arc Y
      circularPathData.rightFullExtent +
      " " +
      circularPathData.verticalRightInnerExtent +
      " " + // End of arc X
      // line up
      "L" +
      circularPathData.rightFullExtent +
      " " +
      (circularPathData.targetY + circularPathData.rightSmallArcRadius) +
      " " +
      // Arc around: Centre of arc X and  //Centre of arc Y
      "A" +
      circularPathData.rightLargeArcRadius +
      " " +
      circularPathData.rightSmallArcRadius +
      " 0 0 1 " +
      // End of arc X //End of arc Y
      circularPathData.rightInnerExtent +
      " " +
      circularPathData.targetY +
      " " + // End of arc X
      // line to end
      "L" +
      circularPathData.targetX +
      " " +
      circularPathData.targetY
    );
  }
};
