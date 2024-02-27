// Populate the sourceLinks and targetLinks for each node.
// Also, if the source and target are not objects, assume they are indices.
function computeNodeLinks(inputGraph) {
  let graph = clone(inputGraph);

  graph.nodes.forEach(function(node, i) {
    node.index = i;
    node.sourceLinks = [];
    node.targetLinks = [];
  });
  var nodeById = d3.map(graph.nodes, id);
  graph.links.forEach(function(link, i) {
    link.index = i;
    var source = link.source;
    var target = link.target;
    if (
      (typeof source === "undefined" ? "undefined" : _typeof(source)) !==
      'object'
    ) {
      source = link.source = find(nodeById, source);
    }
    if (
      (typeof target === "undefined" ? "undefined" : _typeof(target)) !==
      'object'
    ) {
      target = link.target = find(nodeById, target);
    }
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
  });
  return graph;
}

