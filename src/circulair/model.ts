export type GraphArrow = {
  draw: true;
  length: number;
  gapLength: number;
  path: string;
  color: string;
  headSize
};

export type Graph = {
  width: number;
  padding: number;
  height: number;
  graph: any;
  nodeColor: (d: any) => string;

  arrow?: GraphArrow;
};
