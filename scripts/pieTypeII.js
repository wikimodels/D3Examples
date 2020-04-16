async function getPieTypeII(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.mobileVsDesktop);
    console.log("data type II", data);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const radius = canvasSizes.r;

    const labelHeight = calcuateHeight(canvasSizes, data.data.length);
    console.log("labelHeight", labelHeight);

    var svg = d3
      .selectAll(".pie2")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", canvasSizes.svgHeight)
      .append("g")
      .attr("transform", `translate(${canvasSizes.cx}, ${canvasSizes.cy})`);

    var labelArc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - 0.7 * radius)
      .padAngle(0.03)
      .cornerRadius(8);

    var pie = d3
      .pie()
      .sort(null)
      .value(function (d, i) {
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
      .style("font-size", "20px")
      .text(function (d) {
        return `${d.data.clicks}`;
      })
      .attr("class", "labelText");

    // LEGEND
    var svgLegned = d3
      .select("#pie_type_2_legend")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", labelHeight);

    var legend = svgLegned
      .selectAll(".legendTypeII")
      .data(data.data)
      .enter()
      .append("g")
      .attr("class", "legends3")
      .attr("transform", function (d, i) {
        {
          return `translate(${
            canvasSizes.label.marginLeft
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
        return `${d.device} (${d.percent})`;
      })
      .style("text-anchor", "start")
      .attr("class", "labelText")
      .style("font-size", canvasSizes.label.fontSize);

    // ТITLE
    var svgLegned = d3
      .select("#pie_type_2_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");
  } catch (e) {
    console.error(e);
  }
}
