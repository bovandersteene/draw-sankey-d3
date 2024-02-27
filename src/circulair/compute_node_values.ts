// Compute the value (size) and cycleness of each node by summing the associated links.
function computeNodeValues(inputGraph) {
  let graph = clone(inputGraph);

  graph.nodes.forEach(function(node) {
    node.partOfCycle = false;
    node.value = Math.max(
      d3.sum(node.sourceLinks, value),
      d3.sum(node.targetLinks, value)
    );
    node.sourceLinks.forEach(function(link) {
      if (link.circular) {
        node.partOfCycle = true;
        node.circularLinkType = link.circularLinkType;
      }
    });
    node.targetLinks.forEach(function(link) {
      if (link.circular) {
        node.partOfCycle = true;
        node.circularLinkType = link.circularLinkType;
      }
    });
  });

  return graph;
}