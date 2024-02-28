import { cloneDeep, groupBy } from "lodash";
import { Graph, GraphData, Link, Node } from "./model";
import { _typeof, findNode } from "./utils";
import {
  findSourceNode,
  findTargetNode,
  getSourceLinks,
  getTargetLinks,
} from "./utils/links";
import { addIndexToLink } from "./utils/node";

const createReplacedLinks = (
  link: Link,
  targetNode: Node,
  sourceNode: Node,
  virtualNodeIndex: number,
  virtualLinkIndex: number,
  { getNodeID }: Pick<Graph, "getNodeID">
) => {
  const links = [];
  const nodes = [];
  links.push({ ...link, type: "replaced" });

  let totalToCreate = targetNode.column - sourceNode.column - 1;
  //console.log("total nodes to create: " + totalToCreate);

  for (var n = 0; n < totalToCreate; n++) {
    let newNode = {} as Node;

    //get the next index number
    virtualNodeIndex = virtualNodeIndex + 1;
    newNode.name = "virtualNode" + virtualNodeIndex;
    newNode.index = "v" + virtualNodeIndex;

    //console.log(" created node: " + newNode.name);

    // newNode.sourceLinks = [];
    // newNode.targetLinks = [];
    newNode.partOfCycle = false;
    newNode.value = link.value;
    newNode.depth = sourceNode.depth + (n + 1);
    newNode.height = sourceNode.height - (n + 1);
    newNode.column = sourceNode.column + (n + 1);
    newNode.virtual = true;
    newNode.replacedLink = link.index;

    // nodes.push(newNode);

    let newLink = {} as Link;
    let vMinus1 = virtualNodeIndex - 1;
    newLink.source = n == 0 ? getNodeID(sourceNode) : "virtualNode" + vMinus1;
    //   newLink.sourceIndex =
    newLink.target = getNodeID(newNode);
    newLink.value = link.value;
    newLink.index = "virtualLink" + virtualLinkIndex;
    virtualLinkIndex = virtualLinkIndex + 1;
    newLink.circular = false;
    newLink.type = "virtual";
    newLink.parentLink = link.index;

    //console.log(newLink);

    // links.push(newLink);
  }

  let lastLink = {} as Link;
  lastLink.source = "virtualNode" + virtualNodeIndex;
  lastLink.target = getNodeID(targetNode);
  lastLink.targetIndex = targetNode.index;

  lastLink.value = link.value;
  lastLink.index = "virtualLink" + virtualLinkIndex;
  virtualLinkIndex = virtualLinkIndex + 1;
  lastLink.circular = false;
  lastLink.type = "virtual";
  lastLink.parentLink = link.index;

  //console.log(lastLink);

  // links.push(lastLink);

  return { links, nodes, virtualLinkIndex, virtualNodeIndex };
};

export const createVirtualNodes = (
  inputGraph: Readonly<GraphData>,
  settings: Pick<Graph, "useVirtualRoutes" | "getNodeID">
) => {
  const { useVirtualRoutes, getNodeID } = settings;
  const replacedLinks: Link[] = [];
  let links = inputGraph.links;
  let nodes = inputGraph.nodes;

  console.log("links", links.length, "nodes", nodes.length);
  if (useVirtualRoutes) {
    let virtualNodeIndex = -1;
    let virtualLinkIndex = 0;

    links = [];

    inputGraph.links.forEach((link) => {
      const targetNode = findTargetNode(link, inputGraph.nodes, getNodeID);
      const sourceNode = findSourceNode(link, inputGraph.nodes, getNodeID);

      if (
        !targetNode ||
        !sourceNode ||
        targetNode.column - sourceNode.column < 2
      ) {
        link.type = "normal";
        links.push({ ...link, type: "normal" });
      } else {
        const replaced = createReplacedLinks(
          link,
          targetNode,
          sourceNode,
          virtualNodeIndex,
          virtualLinkIndex,
          { getNodeID }
        );

        links.push(...replaced.links);
        nodes.push(...replaced.nodes);
        console.log(links.length, nodes.length);
        virtualLinkIndex = replaced.virtualLinkIndex;
        virtualNodeIndex = replaced.virtualNodeIndex;
      }
    });

    //console.log(graph.links);

    links = inputGraph.links.map((link, i) => {
      if (link.type == "virtual") {
        return addIndexToLink(link, null, nodes, settings);
      }
      return link;
    });

    // let l = links.length;
    // while (l--) {
    //   if (links[l].type == "replaced") {
    //     let obj = cloneDeep(links[l]);
    //     links.splice(l, 1);
    //     replacedLinks.push(obj);
    //   }
    // }

    // console.log(nodes);
    // nodes.forEach(function (node) {
    //   const sourceLinks = getSourceLinks(node, links, getNodeID);
    //   let sIndex = sourceLinks.length;
    //   while (sIndex--) {
    //     if (sourceLinks[sIndex].type == "replaced") {
    //       // sourceLinks.splice(sIndex, 1);
    //     }
    //   }

    //   const targetLinks = getTargetLinks(node, links, getNodeID);
    //   let tIndex = targetLinks.length;
    //   while (tIndex--) {
    //     if (targetLinks[tIndex].type == "replaced") {
    //       // targetLinks.splice(tIndex, 1);
    //     }
    //   }
    // });
  }

  console.log("links", links.length, "nodes", nodes.length);

  return {
    ...inputGraph,
    replacedLinks,
    links: links.filter((l) => l.type !== "replaced"),
    nodes,
  };
};
