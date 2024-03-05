import * as d3 from "d3";

type TYPE = {
  x0: number;
  y0: number;
};

type SVG<T extends TYPE> = d3.Selection<
  SVGSVGElement,
  T,
  SVGAElement,
  undefined
>;

type Props<T extends TYPE> = {
  width?: number;
  y?: (d: T) => number;
  x?: (d: T) => number;
  anchor?: "left" | "right" | "middle";
  wordBreak?: boolean;
};

export const breakWords = (text, textEl, width) => {
  let currentWidth = 0;
  let currentText = "";
  const x = textEl.node().getAttribute("x");
  textEl.text(null);

  const words = text.split(/\s+/);

  const textMeasure = document.createElement("span");
  document.body.append(textMeasure);

  const splitted: string[] = [];
  words.forEach((word) => {
    //  parentNode.style.opacity = 1; // Show the text
    textMeasure.textContent =
      currentText === "" ? word : currentText + " " + word;
    const wordWidth = textMeasure.offsetWidth;

    if (currentWidth + wordWidth < width) {
      currentText += (currentText === "" ? "" : " ") + word;
      currentWidth += wordWidth;
      return null;
    } else {
      const newText = currentText;
      currentText = word;
      currentWidth = wordWidth;
      splitted.push(newText);
      return newText;
    }
  });

  if (currentText) {
    splitted.push(currentText);
  }

  textEl
    .selectAll("tspan")
    .data(splitted)
    .enter()
    .append("tspan")
    .attr("x", x)
    .attr("dy", "1.2em")
    .text((d) => d);
  // .text(currentText);

  document.body.removeChild(textMeasure);
  return;
};

export type TextProps<T extends TYPE> = Props<T>;

export const createTextElement = <T extends TYPE>(
  node: SVG<T>,
  getText: (d: T) => string,
  { width, x, y, anchor, wordBreak }: Props<T>
) => {
  const dy = y ?? ((d) => d.y0);
  const dx = x ?? ((d) => d.x0);

  const text = node
    .append("text")
    .attr("x", dx)
    .attr("y", dy)
    .attr("dy", "0.35em")
    .attr("text-anchor", anchor ?? "middle")
    .attr("opacity", 1)
    .text(getText);

  if (wordBreak) {
    text.each(function (t) {
      breakWords(getText(t), d3.select(this), width);
    });

    // TODO put it in the middle
    text.attr("y", (d) => d.y0);
  }
  return;
};
