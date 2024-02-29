export const align = (node, x) => {

  /// TODO add some more logic here, end nodes shoudl go to the end, start nodes to the start, ....
  return node.column ?? node.col ?? x;
};
