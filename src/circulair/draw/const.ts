

export const mouseOut =(svg)=> (d) => {
  svg.selectAll("rect").style("opacity", 0.5);
  svg.selectAll(".sankey-link").style("opacity", 0.7);
  svg.selectAll("text").style("opacity", 1);
};

export const opacity = {
  highlight: 1,
  normal: 0.7,
  noHighlight: 0.3,
};