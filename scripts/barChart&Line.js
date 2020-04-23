async function getHoursOfDayChart(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.clicksByHoursOfDay);
    console.log("data type VI", data);
    const data_ready = data.data;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    var barColors = ["aqua", "deepskyblue", "steelblue"];

    const labelHeight = calcuateHeight(canvasSizes, data.data.length);
    console.log("labelHeight", labelHeight);

    var margin = {
      top: canvasSizes.margin.top,
      right: canvasSizes.margin.right,
      bottom: 100,
      left: canvasSizes.margin.left,
    };

    var svg = d3
      .selectAll(".barChartType1")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", 650);

    var g = svg
      .append("g")
      .attr("id", "barLineChart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxClicksValue = d3.max(data_ready, (d) => d.totalClicks);
    console.log("max value", maxClicksValue);

    var xScale = d3
      .scaleBand()
      .rangeRound([0, canvasSizes.svgWidth - margin.left - margin.right])
      .padding(canvasSizes.barChartPadding)
      .domain(
        data_ready.map(function (d) {
          return d.hour;
        })
      );

    yScale = d3
      .scaleLinear()
      .rangeRound([canvasSizes.svgHeight - margin.top - margin.bottom, 0])
      .domain([
        0,
        d3.max(data_ready, function (d) {
          return d.totalClicks;
        }),
      ]);
    // axis-x
    g.append("g")
      .attr(
        "transform",
        `translate(${0}, ${canvasSizes.svgHeight - margin.top - margin.bottom})`
      )
      .attr("class", "axisWhite")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", 0.99 * (canvasSizes.svgWidth - margin.left - margin.right))
      .attr("dy", "2.71em")
      .attr("class", "axis-x-text")
      .attr("text-anchor", "end")
      .text("Время суток (часы)");

    // axis-y
    g.append("g")
      .attr("class", "axisWhite")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -10)
      .attr("x", 40)
      .attr("dy", "0.91em")
      .attr("dx", "0.3em")
      .attr("class", "axis-y-text")
      .text("Клики");

    var bar = g.selectAll("rect").data(data_ready).enter().append("g");

    // bar chart
    bar
      .append("rect")
      .transition()
      .duration(400)
      .delay(function (d, i) {
        return 100 + 50 * i;
      })
      .attr("x", function (d) {
        return xScale(d.hour);
      })
      .attr("y", function (d) {
        return yScale(d.totalClicks);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return (
          canvasSizes.svgHeight -
          margin.top -
          margin.bottom -
          yScale(d.totalClicks)
        );
      })
      .attr("class", function (d) {
        var s = "bar ";
        if (d.totalClicks < 0.7 * maxClicksValue) {
          return s + "bar1";
        } else if (
          d.totalClicks < 0.8 * maxClicksValue &&
          d.totalClicks > 0.7 * maxClicksValue
        ) {
          return s + "bar2";
        } else {
          return s + "bar3";
        }
      });

    // SET UP EVENTS
    // bar
    //   .on("mouseover", tip.show)
    //   .on("mouseout", tip.hide)
    //   .on("click", tip.show);

    // line chart
    var line = d3
      .line()
      .x(function (d, i) {
        return xScale(d.hour) + xScale.bandwidth() / 2;
      })
      .y(function (d) {
        return yScale(d.uniqueClicks);
      })
      .curve(d3.curveMonotoneX);

    bar
      .append("path")
      .attr("class", "line") // Assign a class for styling
      .attr("d", line(data_ready)) // 11. Calls the line generator
      .style("opacity", 0)
      .transition()
      .duration(1800)
      .delay(2200)
      .attr("class", "line") // Assign a class for styling
      .attr("d", line(data_ready)) // 11. Calls the line generator
      .style("opacity", 1);

    var circle = g.selectAll("circle").data(data_ready).enter().append("g");

    circle
      .append("circle")
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function (d, i) {
        return xScale(d.hour) + xScale.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        return 0;
      })
      .attr("r", 0)
      .transition()
      .duration(400)
      .delay(function (d, i) {
        return 500 + 50 * i;
      })
      .attr("cx", function (d, i) {
        return xScale(d.hour) + xScale.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        return yScale(d.uniqueClicks);
      })
      .attr("r", canvasSizes.lineChartRadius);

    // ТITLE
    d3.select("#chart_hours_of_day_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");

    // ---------------------------------------------------------
    // Calculate height of element
    var width = document.getElementById("chart_days_of_week").offsetWidth;
    var labelHeight1 = 0;
    var labelWidth1 = 0;
    var labelHeight2 = 0;
    var labelWidth2 = 0;

    var graphWidth = d3.select("#barLineChart").node().getBoundingClientRect()
      .width;
    var graphHeight = d3.select("#barLineChart").node().getBoundingClientRect()
      .height;

    if (graphWidth <= 500) {
      // MOBILE
      labelHeight1 = graphHeight + 30;
      labelHeight2 = graphHeight + 50;
    } else {
      // DESKTOP
      labelHeight1 = graphHeight + 50;
      labelHeight2 = graphHeight + 50;
      labelWidth1 = 0.12 * width;
      labelWidth2 = 0.5 * width;
    }

    // ---------------------------------------------------------
    // LEGEND
    var legend1 = svg
      .append("g")
      .attr("id", "legend1")
      .attr(
        "transform",
        `translate(${canvasSizes.barChartLegendGroupX}, ${labelHeight1})`
      );

    var rectGroup = legend1
      .append("g")
      .attr("transform", `translate(${20},${0})`);

    rectGroup
      .selectAll("rect")
      .data(barColors)
      .enter()
      .append("rect")
      .attr("transform", function (d, i) {
        return `translate(${
          i * canvasSizes.legend.rectWidth
        },${canvasSizes.svgHeight - 60})`;
      })
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasSizes.legend.rectWidth)
      .attr("height", canvasSizes.legend.rectWidth)
      .style("fill", function (d, i) {
        return barColors[i];
      })
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(2000)
      .attr("transform", function (d, i) {
        return `translate(${i * canvasSizes.legend.rectWidth},${0})`;
      })
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasSizes.legend.rectWidth)
      .attr("height", canvasSizes.legend.rectWidth)
      .style("fill", function (d, i) {
        return barColors[i];
      })
      .style("opacity", 1);

    // RECT LABEL Text
    var recText = legend1
      .append("text")
      .attr(
        "transform",
        `translate(
              ${110},
              ${0}
              )`
      )
      .attr("dy", "2em")
      .attr("class", "legend-text")
      .style("opacity", 0)
      .text("Общие пользователи")
      .transition()
      .duration(500)
      .delay(2000)
      .attr(
        "transform",
        `translate(
          ${canvasSizes.lineLabeTextX},
              ${0}
              )`
      )
      .attr("dy", "1em")
      .attr("class", "legend-text")
      .style("opacity", 1)
      .text("Общие пользователи");

    //  LINE LEGEND
    var legend2 = svg.append("g").attr("id", "legend2").attr(
      "transform",
      `translate(
              ${canvasSizes.barChartLegendGroupX2},
              ${labelHeight2})`
    );

    var line = legend2
      .append("line")
      .attr("class", "labelLine")
      .attr("x1", canvasSizes.line.x1)
      .attr("y1", canvasSizes.line.y1)
      .attr("x2", canvasSizes.line.x2)
      .attr("y2", canvasSizes.line.y2)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(2000)
      .attr("class", "labelLine")
      .attr("x1", canvasSizes.line.x1)
      .attr("y1", canvasSizes.line.y1)
      .attr("x2", canvasSizes.line.x2)
      .attr("y2", canvasSizes.line.y2)
      .style("opacity", 1);

    //Line Label Circle
    var circle = legend2
      .append("circle")
      .attr("cx", canvasSizes.circle.cx)
      .attr("cy", canvasSizes.circle.cy)
      .attr("r", canvasSizes.circle.r)
      .style("opacity", 0)
      .attr("class", "dot")
      .transition()
      .duration(500)
      .delay(2000)
      .attr("cx", canvasSizes.circle.cx)
      .attr("cy", canvasSizes.circle.cy)
      .attr("r", canvasSizes.circle.r)
      .attr("class", "dot")
      .style("opacity", 1);

    // Line Label Text
    var lineLabelText = legend2
      .append("text")
      .attr("transform", `translate(${canvasSizes.lineLabeTextX},${0})`)
      .attr("dy", "1.4em")
      .attr("class", "legend-text")
      .attr("dy", "1em")
      .style("opacity", 0)
      .text("Уникальные пользователи")
      .transition()
      .duration(500)
      .delay(2000)
      .attr("dy", "1.4em")
      .attr("class", "legend-text")
      .attr("dy", "1em")
      .style("opacity", 1)
      .text("Уникальные пользователи");
  } catch (e) {
    console.error(e);
  }
}
