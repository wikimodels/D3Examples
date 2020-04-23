async function getPieTypeIII(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.clicksByDaysOfWeek);
    console.log("data type III", data);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const radius = canvasSizes.r;

    const labelHeight = calcuateHeight(canvasSizes, data.data.length);
    console.log("labelHeight", labelHeight);

    var svg = d3
      .selectAll(".pie3")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", canvasSizes.svgHeight)
      .append("g")
      .attr("transform", `translate(${canvasSizes.cx}, ${canvasSizes.cy})`);

    var labelArc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - 0.9 * radius)
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

    // INNER LABELS
    g.append("text")
      .attr("transform", function (d) {
        return `translate(${labelArc.centroid(d)})`;
      })
      .attr("dy", ".35em")
      .attr("dx", "-.95em")
      .style("font-size", canvasSizes.label.pieFontSize)
      .text(function (d) {
        return `${d.data.percent}`;
      })
      .attr("class", "labelText");

    // ТITLE
    var svgLegned = d3
      .select("#pie_type_3_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");

    // LEGEND
    var svgLegned = d3
      .select("#pie_type_3_legend")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", labelHeight);

    var legend = svgLegned
      .selectAll(".legendTypeIII")
      .data(data.data)
      .enter()
      .append("g")
      .attr("class", "legend3")
      .attr("transform", position);

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
        return `${d.dofws} (${d3.format("~s")(d.clicks)})`;
      })
      .style("text-anchor", "start")
      .attr("class", "labelText")
      .style("font-size", canvasSizes.label.fontSize);

    // ARRANGEMENT LEGEND iN TWO COLUNMS
    function position(d, i) {
      if (window.innerWidth < 500) {
        //MOBiLE
        var c = 2; // number of columns
        var h = 24; // height of each entry
        var w = 0.38 * canvasSizes.svgWidth; // width of each entry (so you can position the next column)
        var tx = canvasSizes.svgWidth - 2 * w; // tx/ty are essentially margin values
        var ty = 20;
        var x = (i % c) * w + tx;
        var y = Math.floor(i / c) * h + ty;
        return `translate(${x}, ${y})`;
      } else {
        //DESKTOP
        var c = 4; // number of columns
        var h = 27; // height of each entry
        var w = 120; // width of each entry (so you can position the next column)
        var tx = 0.14 * canvasSizes.svgWidth; // tx/ty are essentially margin values
        var ty = 0;
        var x = (i % c) * w + tx;
        var y = Math.floor(i / c) * h + ty;
        return `translate(${x}, ${y})`;
      }
    }
  } catch (e) {
    console.error(e);
  }
}
