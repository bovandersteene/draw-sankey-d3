import * as d3 from "d3";

export const wrap = (text, width: number, dyAdjust: number) => {
  // Use default values for the last three parameters if values are not provided.
  const lineHeightEms = 1.05;
  const lineHeightSquishFactor = 1;
  const splitOnHyphen = true;
  const centreVertically = true;

  text.each(function () {
    const text = d3.select(this),
      x = text.attr("x"),
      y = text.attr("y");

    const words: string[] = [];
    text
      .text()
      .split(/\s+/)
      .forEach(function (w) {
        if (splitOnHyphen) {
          const subWords = w.split("-");
          for (let i = 0; i < subWords.length - 1; i++)
            words.push(subWords[i] + "-");
          words.push(subWords[subWords.length - 1] + " ");
        } else {
          words.push(w + " ");
        }
      });

    text.text(null); // Empty the text element

    // `tspan` is the tspan element that is currently being added to
    let tspan = text.append("tspan");

    const line = ""; // The current value of the line
    const prevLine = ""; // The value of the line before the last word (or sub-word) was added
    const nWordsInLine = 0; // Number of words in the line

    let currentWidth = 0;
    let currentText = "";
    const textMeasure = document.createElement("span");
    words.forEach((word) => {
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
        tspan = text.append("tspan").text(word.trim());
        return newText;
      }
    });

    const tspans = text.selectAll("tspan");

    let h = lineHeightEms;
    // Reduce the line height a bit if there are more than 2 lines.
    if (tspans.size() > 2)
      for (let i = 0; i < tspans.size(); i++) h *= lineHeightSquishFactor;

    tspans.each(function (d, i) {
      // Calculate the y offset (dy) for each tspan so that the vertical centre
      // of the tspans roughly aligns with the text element's y position.
      let dy = i * h + dyAdjust;
      if (centreVertically) dy -= ((tspans.size() - 1) * h) / 2;
      d3.select(this)
        .attr("y", y)
        .attr("x", x)
        .attr("dy", dy + "em");
    });
  });
};
