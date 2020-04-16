async function getPieTypeIII_2(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.clicksByDaysOfWeek);
    console.log("data type III", data);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const radius = canvasSizes.r;

    const labelHeight = calcuateHeight(canvasSizes, data.data.length);
    console.log("labelHeight III", labelHeight);

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
      .innerRadius(radius - 0.75 * radius)
      .padAngle(0.03)
      .padRadius(100)
      .cornerRadius(8);

    var outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

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
      //.attr("d", labelArc)
      .style("fill", function (d, i) {
        return color(d.data.clicks);
      })
      .transition()
      .delay(function (d, i) {
        return i * 200;
      })
      .duration(200)
      .attrTween("d", function (d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return labelArc(d);
        };
      });

    g.append("text")
      .attr("transform", function (d) {
        return "translate(" + labelArc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("dx", "-0.5em")
      .style("font-size", "17px")
      .transition()
      .delay(1600)
      .text(function (d) {
        return `${d.data.clicks}`;
      })
      .attr("class", "labelText");

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
      .transition()
      .duration(300)
      .delay(function (d, i) {
        return 100 + i * 100;
      })
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
      .transition()
      .duration(300)
      .delay(function (d, i) {
        return 100 + i * 100;
      })
      .text(function (d, i) {
        return `${d.dofw} (${d.percent})`;
      })
      .style("text-anchor", "start")
      .attr("class", "labelText")
      .style("font-size", canvasSizes.label.fontSize);

    // ТITLE
    var svgLegned = d3
      .select("#pie_type_3_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");

    // POLYLINES
    const data_ready = pie(d3.entries(data.data));
    // The arc generator
    var arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function (d) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        var myArray = [posA, posB, posC];
        console.log("myArray", myArray);

        return [posA, posB, posC];
      });

    // Add the polylines between chart and labels:
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        console.log(d.data.key);
        return d.data.value.dofws;
      })
      .attr("transform", function (d) {
        console.log("DD ", d);

        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        console.log("d1", d);
        return d.data.value.dofws;
      })
      .attr("transform", function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  } catch (e) {
    console.error(e);
  }
}
