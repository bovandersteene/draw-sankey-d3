import * as d3 from "d3";
import { Graph } from "../model";

export const addVirtualPathDatas = ({
  graph: data,
  useVirtualRoutes,
}: Readonly<Graph<any, any>>) => {
  if (!useVirtualRoutes) return;
  const virtualLinkType: string = "both";

  const replacedLinks = data.replacedLinks;

  replacedLinks.forEach((replacedLink) => {
    replacedLink.useVirtual = virtualLinkType === "virtual" ? true : false;

    let firstPath = true;

    data.forEachLink((link) => {
      if (link.parentLink == replacedLink.index) {
        if (firstPath) {
          replacedLink.y0 = link.y0;
          replacedLink.x0 = link.source.x1;
          replacedLink.width = link.width;
          firstPath = false;
        } else {
          replacedLink.y1 = link.y1;
          replacedLink.x1 = link.target.x0;
        }
      }
    });

    if (virtualLinkType == "both") {
      let columnToTest = replacedLink.source.column + 1;
      const maxColumnToTest = replacedLink.target.column - 1;
      let i = 1;
      const numberOfColumnsToTest = maxColumnToTest - columnToTest + 1;

      for (i = 1; columnToTest <= maxColumnToTest; columnToTest++, i++) {
        data.forEachNode((node) => {
          if (
            node.column == columnToTest &&
            node.replacedLink != replacedLink.index
          ) {
            const t = i / (numberOfColumnsToTest + 1);

            // Find all the points of a cubic bezier curve in javascript
            // https://stackoverflow.com/questions/15397596/find-all-the-points-of-a-cubic-bezier-curve-in-javascript

            const B0_t = Math.pow(1 - t, 3);
            const B1_t = 3 * t * Math.pow(1 - t, 2);
            const B2_t = 3 * Math.pow(t, 2) * (1 - t);
            const B3_t = Math.pow(t, 3);

            const py_t =
              B0_t * replacedLink.y0 +
              B1_t * replacedLink.y0 +
              B2_t * replacedLink.y1 +
              B3_t * replacedLink.y1;

            const linkY0AtColumn = py_t - replacedLink.width / 2;
            const linkY1AtColumn = py_t + replacedLink.width / 2;

            if (linkY0AtColumn > node.y0 && linkY0AtColumn < node.y1) {
              replacedLink.useVirtual = true;
            } else if (linkY1AtColumn > node.y0 && linkY1AtColumn < node.y1) {
              replacedLink.useVirtual = true;
            } else if (linkY0AtColumn < node.y0 && linkY1AtColumn > node.y1) {
              replacedLink.useVirtual = true;
            }
          }
        });
      }
    }
  });

  //create d path string
  replacedLinks.forEach(function (replacedLink) {
    //replacedLink.width = replacedLink.value * graph.ky;

    if (replacedLink.useVirtual) {
      let pathString = "";
      let firstPath = true;

      data.forEachLink((link) => {
        if (link.parentLink == replacedLink.index) {
          if (firstPath) {
            pathString = pathString + link.path;
            firstPath = false;
          } else {
            pathString = pathString + link.path.replace("M", "L");
          }
        }
      });

      replacedLink.path = pathString;
    } else {
      const normalPath = d3
        .linkHorizontal()
        .source(function (d) {
          const x = d.x0;
          const y = d.y0;
          return [x, y];
        })
        .target(function (d) {
          const x = d.x1;
          const y = d.y1;
          return [x, y];
        });
      replacedLink.path = normalPath(replacedLink);
    }
    data.addLink(replacedLink);
  });

  data.removeLinksFromIndex("virtual");
  data.removeVirtualNodesFromIndex();
};
