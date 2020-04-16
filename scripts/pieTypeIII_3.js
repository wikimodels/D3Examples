async function getPieTypeIII(urls, canvasSizes) {
  try {
    const serverData = await d3.json(urls.clicksByDaysOfWeek);
    const data = serverData.data;
    const radius = canvasSizes.r - 40;

    console.log("data type III", data);

    var svg = d3
      .selectAll(".pie3")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", canvasSizes.svgHeight)
      .append("g")
      .attr(
        "transform",
        "translate(" + canvasSizes.cx + "," + canvasSizes.cy + ")"
      );

    // COLOR
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // COMPUTING POSITION FOR EACH GROUP ON THE PIE
    var pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value(function (d) {
        return d.value.clicks;
      });

    var data_ready = pie(d3.entries(data));

    var labelArc = d3
      .arc()
      .innerRadius(radius - 0.5 * radius)
      .outerRadius(radius - 0.1 * radius);
    //.innerRadius(radius - 0.7 * radius)
    //.padAngle(0.03)
    //.cornerRadius(8);
    // The arc generator
    var arc = d3
      .arc()
      .innerRadius(radius * 0.2) // This is the size of the donut hole
      .outerRadius(radius * 0.8)
      .padAngle(0.03)
      .padRadius(100)
      .cornerRadius(8);

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3
      .arc()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.9);

    // BUILDING PIE
    svg
      .selectAll("allSlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d) {
        return color(d.data.value.dofws);
      });

    // OUTTER LABELS
    svg
      .selectAll("outterLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        return `${d.data.value.dofws} (${d.data.value.percent})`;
      })
      .attr("transform", function (d) {
        var pos = outerArc.centroid(d);
        return `translate(${pos})`;
      })
      .attr("dy", ".35em")
      .attr("dx", "-.15em")
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      })
      .style("fill", "whitesmoke");

    // INNER LABELS

    svg
      .selectAll("arc")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", function (d) {
        console.log("DD", d);

        return `translate(${labelArc.centroid(d)})`;
      })
      .append("text")
      .text(function (d) {
        console.log(`D ${d.data.clicks}`);
        return `ee`;
      })
      .attr("dy", ".35em")
      .attr("dx", "-.5em")
      .style("font-size", "20px")
      .attr("class", "labelText");
  } catch (e) {
    console.error(e);
  }
}
