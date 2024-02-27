// sort links' breadth (ie top to bottom in a column), based on their source nodes' breadths
export function ascendingSourceBreadth(nodeSort?){
  return (a, b) =>{
  return ascendingBreadth(nodeSort)(a.source, b.source) || a.index - b.index;
}
}

// sort links' breadth (ie top to bottom in a column), based on their target nodes' breadths
export function ascendingTargetBreadth(nodeSort?){
  return (a, b) =>{
  return ascendingBreadth(nodeSort)(a.target, b.target) || a.index - b.index;
}
}

// sort nodes' breadth (ie top to bottom in a column)
// if both nodes have circular links, or both don't have circular links, then sort by the top (y0) of the node
// else push nodes that have top circular links to the top, and nodes that have bottom circular links to the bottom
export function ascendingBreadth(nodeSort?){
  return (a, b) =>{
  if (a.partOfCycle === b.partOfCycle) {
    if (nodeSort) return nodeSort(a, b) || a.y0 - b.y0;
    return a.y0 - b.y0;
  } else {
    if (a.circularLinkType === 'top' || b.circularLinkType === 'bottom') {
      return -1;
    } else {
      return 1;
    }
  }
}

}
