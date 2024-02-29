import { Graph } from "../model";
import { sortSourceLinks } from "../sort/ sort-links";
import { sortTargetLinks } from "../sort/sort-target-links";

export const sortLinks = (graph: Readonly<Graph<any, any>>) => {
  const linkSortingIterations = 3;

  for (let iteration = 0; iteration < linkSortingIterations; iteration++) {
    sortSourceLinks(graph);
    sortTargetLinks(graph);
    // resolveNodeLinkOverlaps(graph);
  }
};
