import { Graph, GraphData, Link, Node } from "../model";

const createReplacedLinks = (
  inputGraph: Readonly<GraphData>,
  link: Link,
  targetNode: Node,
  sourceNode: Node,
  virtualNodeIndex: number,
  virtualLinkIndex: number
) => {
  link.type = "replaced";

  const totalToCreate = targetNode.column - sourceNode.column - 1;
  for (let n = 0; n < totalToCreate; n++) {
    const newNode = {} as Node;

    //get the next index number
    virtualNodeIndex = virtualNodeIndex + 1;
    newNode.name = "virtualNode" + virtualNodeIndex;
    newNode._id = "virtualNode" + virtualNodeIndex;
    newNode.index = "v" + virtualNodeIndex;

    // newNode.sourceLinks = [];
    // newNode.targetLinks = [];
    newNode.partOfCycle = false;
    newNode.value = link.value;
    newNode.depth = sourceNode.depth + (n + 1);
    newNode.height = sourceNode.height - (n + 1);
    newNode.column = sourceNode.column + (n + 1);
    newNode.virtual = true;
    newNode.replacedLink = link.index;
    inputGraph.addNode(newNode._id, newNode);

    const newLink = {} as Link;
    const vMinus1 = virtualNodeIndex - 1;
    newLink.source = n == 0 ? sourceNode._id : "virtualNode" + vMinus1;
    //   newLink.sourceIndex =
    newLink.target = newNode._id;
    newLink.value = link.value;
    newLink.index = "virtualLink" + virtualLinkIndex;
    virtualLinkIndex = virtualLinkIndex + 1;
    newLink.circular = false;
    newLink.type = "virtual";
    newLink.parentLink = link.index;
    inputGraph.addLink(newLink);
  }

  const lastLink = {} as Link;
  lastLink.source = "virtualNode" + virtualNodeIndex;
  lastLink.target = targetNode._id;

  lastLink.value = link.value;
  lastLink.index = "virtualLink" + virtualLinkIndex;
  virtualLinkIndex = virtualLinkIndex + 1;
  lastLink.circular = false;
  lastLink.type = "virtual";
  lastLink.parentLink = link.index;

  inputGraph.addLink(lastLink);

  return { virtualLinkIndex, virtualNodeIndex };
};

export const createVirtualNodes = (
  inputGraph: Readonly<GraphData>,
  settings: Pick<Graph, "useVirtualRoutes">
) => {
  const { useVirtualRoutes } = settings;

  if (useVirtualRoutes) {
    let virtualNodeIndex = -1;
    let virtualLinkIndex = 0;

    inputGraph.forEachLink((link: Link) => {
      const { target: targetNode, source: sourceNode } =
        inputGraph.getNodeLinks(link);

      if (
        !targetNode ||
        !sourceNode ||
        targetNode.column - sourceNode.column < 2
      ) {
        link.type = "normal";
      } else {
        const replaced = createReplacedLinks(
          inputGraph,
          link,
          targetNode,
          sourceNode,
          virtualNodeIndex,
          virtualLinkIndex
        );

        virtualLinkIndex = replaced.virtualLinkIndex;
        virtualNodeIndex = replaced.virtualNodeIndex;

        // TODO add replaced link to array
      }
    });
  }

  inputGraph.removeLinksFromIndex("replaced");
  return inputGraph;
};
