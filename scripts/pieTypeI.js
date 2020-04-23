async function getPieTypeI(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.uniqueVsTotal);
    console.log("data type I", data);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const radius = canvasSizes.r;

    const labelHeight = calcuateHeight(canvasSizes, data.data.length);
    console.log("labelHeight", labelHeight);

    var svg = d3
      .selectAll(".pie")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", canvasSizes.svgHeight)
      .append("g")
      .attr("transform", `translate(${canvasSizes.cx}, ${canvasSizes.cy})`);

    var labelArc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - 0.95 * radius)
      .padAngle(0.03)
      .cornerRadius(8);

    var pie = d3
      .pie()
      .sort(null)
      .value(function (d, i) {
        console.log("pie data", d);
        return d.clicks;
      });

    var g = svg
      .selectAll(".arc")
      .data(pie(data.data))
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", labelArc)
      .style("fill", function (d, i) {
        return color(d.data.clicks);
      });

    g.append("text")
      .attr("transform", function (d) {
        return "translate(" + labelArc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("dx", "-.5em")
      .style("font-size", canvasSizes.label.labelText)
      .text(function (d) {
        return `${d.data.clicks}`;
      })
      .attr("class", "labelText");

    // LEGEND
    var svgLegned = d3
      .selectAll("#pie_type_1_legend")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", labelHeight);

    var legend = svgLegned
      .selectAll("legendTypeI")
      .data(data.data)
      .enter()
      .append("g")
      .attr("class", "legends3")
      .attr("transform", function (d, i) {
        {
          return `translate(${
            (canvasSizes.svgWidth -
              getTextWidth("Уникальные (5.67%)", canvasSizes.label.fontSize)) /
            2
          }, ${canvasSizes.label.marginTop + i * 24})`;
        }
      });

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function (d, i) {
        return color(d.clicks);
      });

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("dy", ".18em")
      .attr("dx", "-.15em")
      .text(function (d, i) {
        return `${d.name} (${d.percent})`;
      })
      .style("text-anchor", "start")
      .attr("class", "labelText")
      .style("font-size", canvasSizes.label.fontSize);

    // ТITLE
    var svgLegned = d3
      .selectAll("#pie_type_1_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");
  } catch (e) {
    console.error(e);
  }
}

// function getTextWidth(text, font) {
//   // re-use canvas object for better performance
//   var canvas =
//     getTextWidth.canvas ||
//     (getTextWidth.canvas = document.createElement("canvas"));
//   var context = canvas.getContext("2d");
//   context.font = "19px sans-serif";
//   console.log("Context", context);

//   var metrics = context.measureText(text);
//   return metrics.width;
// }
