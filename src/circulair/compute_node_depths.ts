// Iteratively assign the depth for each node.
// Nodes are assigned the maximum depth of incoming neighbors plus one;
// nodes with no incoming links are assigned depth zero, while
// nodes with no outgoing links are assigned the maximum depth.
function computeNodeDepths(inputGraph) {
  let graph = clone(inputGraph);

  var nodes, next, x;

  if (sortNodes != null && sortNodes(graph.nodes[0]) != undefined) {
    graph.nodes.sort(function(a, b) {
      return sortNodes(a) < sortNodes(b) ? -1 : 1;
    });

    let c = 0;
    var currentSortIndex = sortNodes(graph.nodes[0]);

    graph.nodes.forEach(function(node) {
      c = sortNodes(node) == currentSortIndex ? c : c + 1;

      currentSortIndex =
        sortNodes(node) == currentSortIndex
          ? currentSortIndex
          : sortNodes(node);
      node.column = c;
    });
  }

  for (
    nodes = graph.nodes, next = [], x = 0;
    nodes.length;
    ++x, nodes = next, next = []
  ) {
    nodes.forEach(function(node) {
      node.depth = x;
      node.sourceLinks.forEach(function(link) {
        if (next.indexOf(link.target) < 0 && !link.circular) {
          next.push(link.target);
        }
      });
    });
  }

  for (
    nodes = graph.nodes, next = [], x = 0;
    nodes.length;
    ++x, nodes = next, next = []
  ) {
    nodes.forEach(function(node) {
      node.height = x;
      node.targetLinks.forEach(function(link) {
        if (next.indexOf(link.source) < 0 && !link.circular) {
          next.push(link.source);
        }
      });
    });
  }

  //console.log(sortNodes(graph.nodes[0]));

  // assign column numbers, and get max value
  graph.nodes.forEach(function(node) {
    node.column =
      sortNodes == null || sortNodes(graph.nodes[0]) == undefined
        ? align(node, x)
        : node.column;

    //node.column = Math.floor(align.call(null, node, x));
  });

  return graph;
}