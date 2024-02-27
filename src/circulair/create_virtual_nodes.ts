import { cloneDeep, groupBy } from "lodash";
import { Graph, GraphData, Link } from "./model";
import { _typeof, findNode } from "./utils";

export const createVirtualNodes = (
  inputGraph: Readonly<GraphData>,
  settings: Pick<Graph, "useVirtualRoutes" | "getNodeID">
) => {
  const { useVirtualRoutes, getNodeID } = settings;
  const replacedLinks: Link[] = [];
  let links = inputGraph.links;
  let nodes = inputGraph.nodes;

  if (useVirtualRoutes) {
    let virtualNodeIndex = -1;
    let virtualLinkIndex = 0;
    let linksLength = inputGraph.links.length;

    links = [];
    for (let linkIndex = 0; linkIndex < linksLength; linkIndex++) {
      const thisLink = inputGraph.links[linkIndex];

      /*
      console.log("+++++++++++++++++ ");
      console.log(
        thisLink.index +
          "  -   columns " +
          thisLink.source.column +
          "  <-> " +
          thisLink.target.column
      );
      */

      //if the link spans more than 1 column, then replace it with virtual nodes and links
      if (thisLink.target.column - thisLink.source.column < 2) {
        thisLink.type = "normal";
      } else {
        //console.log("NEEDS NEW VIRTUAL LINKS");
        //console.log("link index: " + thisLink.index);

        thisLink.type = "replaced";

        let totalToCreate = thisLink.target.column - thisLink.source.column - 1;
        //console.log("total nodes to create: " + totalToCreate);

        for (var n = 0; n < totalToCreate; n++) {
          let newNode = {};

          //get the next index number
          virtualNodeIndex = virtualNodeIndex + 1;
          newNode.name = "virtualNode" + virtualNodeIndex;
          newNode.index = "v" + virtualNodeIndex;

          //console.log(" created node: " + newNode.name);

          newNode.sourceLinks = [];
          newNode.targetLinks = [];
          newNode.partOfCycle = false;
          newNode.value = thisLink.value;
          newNode.depth = thisLink.source.depth + (n + 1);
          newNode.height = thisLink.source.height - (n + 1);
          newNode.column = thisLink.source.column + (n + 1);
          newNode.virtual = true;
          newNode.replacedLink = thisLink.index;

          graph.nodes.push(newNode);

          let newLink = {};
          let vMinus1 = virtualNodeIndex - 1;
          newLink.source = n == 0 ? thisLink.source : "virtualNode" + vMinus1;
          newLink.target = newNode.name;
          newLink.value = thisLink.value;
          newLink.index = "virtualLink" + virtualLinkIndex;
          virtualLinkIndex = virtualLinkIndex + 1;
          newLink.circular = false;
          newLink.type = "virtual";
          newLink.parentLink = thisLink.index;

          //console.log(newLink);

          graph.links.push(newLink);
        }

        let lastLink = {};
        lastLink.source = "virtualNode" + virtualNodeIndex;
        lastLink.target = thisLink.target;

        lastLink.value = thisLink.value;
        lastLink.index = "virtualLink" + virtualLinkIndex;
        virtualLinkIndex = virtualLinkIndex + 1;
        lastLink.circular = false;
        lastLink.type = "virtual";
        lastLink.parentLink = thisLink.index;

        //console.log(lastLink);

        links.push(lastLink);
      }
    }

    //console.log(graph.links);

    var nodeById = groupBy(nodes, getNodeID);

    links.forEach(function (link, i) {
      if (link.type == "virtual") {
        var source = link.source;
        var target = link.target;
        if (
          (typeof source === "undefined" ? "undefined" : _typeof(source)) !==
          "object"
        ) {
          //console.log(source);
          //console.log(find(nodeById, source));
          source = link.source = findNode(nodeById, source);
        }
        if (
          (typeof target === "undefined" ? "undefined" : _typeof(target)) !==
          "object"
        ) {
          target = link.target = findNode(nodeById, target);
        }
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      }
    });

    let l = links.length;
    while (l--) {
      if (links[l].type == "replaced") {
        let obj = cloneDeep(links[l]);
        links.splice(l, 1);
        replacedLinks.push(obj);
      }
    }

    nodes.forEach(function (node) {
      let sIndex = node.sourceLinks.length;
      while (sIndex--) {
        if (node.sourceLinks[sIndex].type == "replaced") {
          node.sourceLinks.splice(sIndex, 1);
        }
      }

      let tIndex = node.targetLinks.length;
      while (tIndex--) {
        if (node.targetLinks[tIndex].type == "replaced") {
          node.targetLinks.splice(tIndex, 1);
        }
      }
    });
  }

  return { ...inputGraph, replacedLinks, links, nodes };
};
