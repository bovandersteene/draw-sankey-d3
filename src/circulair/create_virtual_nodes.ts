export function createVirtualNodes(inputGraph) {
  let graph = clone(inputGraph);

  graph.replacedLinks = [];

  if (useVirtualRoutes) {
    let virtualNodeIndex = -1;
    let virtualLinkIndex = 0;
    let linksLength = graph.links.length;

    for (var linkIndex = 0; linkIndex < linksLength; linkIndex++) {
      var thisLink = graph.links[linkIndex];

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
        thisLink.type = 'normal';
      } else {
        //console.log("NEEDS NEW VIRTUAL LINKS");
        //console.log("link index: " + thisLink.index);

        thisLink.type = 'replaced';

        let totalToCreate = thisLink.target.column - thisLink.source.column - 1;
        //console.log("total nodes to create: " + totalToCreate);

        for (var n = 0; n < totalToCreate; n++) {
          let newNode = {};

          //get the next index number
          virtualNodeIndex = virtualNodeIndex + 1;
          newNode.name = 'virtualNode' + virtualNodeIndex;
          newNode.index = 'v' + virtualNodeIndex;

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
          newLink.source = n == 0 ? thisLink.source : 'virtualNode' + vMinus1;
          newLink.target = newNode.name;
          newLink.value = thisLink.value;
          newLink.index = 'virtualLink' + virtualLinkIndex;
          virtualLinkIndex = virtualLinkIndex + 1;
          newLink.circular = false;
          newLink.type = 'virtual';
          newLink.parentLink = thisLink.index;

          //console.log(newLink);

          graph.links.push(newLink);
        }

        let lastLink = {};
        lastLink.source = 'virtualNode' + virtualNodeIndex;
        lastLink.target = thisLink.target;

        lastLink.value = thisLink.value;
        lastLink.index = 'virtualLink' + virtualLinkIndex;
        virtualLinkIndex = virtualLinkIndex + 1;
        lastLink.circular = false;
        lastLink.type = 'virtual';
        lastLink.parentLink = thisLink.index;

        //console.log(lastLink);

        graph.links.push(lastLink);
      }
    }

    //console.log(graph.links);

    var nodeById = d3.map(graph.nodes, id);

    graph.links.forEach(function (link, i) {
      if (link.type == 'virtual') {
        var source = link.source;
        var target = link.target;
        if (
          (typeof source === 'undefined' ? 'undefined' : _typeof(source)) !==
          'object'
        ) {
          //console.log(source);
          //console.log(find(nodeById, source));
          source = link.source = find(nodeById, source);
        }
        if (
          (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !==
          'object'
        ) {
          target = link.target = find(nodeById, target);
        }
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      }
    });

    let l = graph.links.length;
    while (l--) {
      if (graph.links[l].type == 'replaced') {
        let obj = clone(graph.links[l]);
        graph.links.splice(l, 1);
        graph.replacedLinks.push(obj);
      }
    }

    graph.nodes.forEach(function (node) {
      let sIndex = node.sourceLinks.length;
      while (sIndex--) {
        if (node.sourceLinks[sIndex].type == 'replaced') {
          node.sourceLinks.splice(sIndex, 1);
        }
      }

      let tIndex = node.targetLinks.length;
      while (tIndex--) {
        if (node.targetLinks[tIndex].type == 'replaced') {
          node.targetLinks.splice(tIndex, 1);
        }
      }
    });
  }

  return graph;
}
