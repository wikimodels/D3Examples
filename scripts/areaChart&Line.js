async function getDailyClicksForTimePeriod(urls, canvasSizes) {
  try {
    // ТITLE
    d3.select("#chart_daily_clicks_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");

    const data = await d3.json(urls.dailyClicksForTimePeriod);
    console.log("data type VII", data);

    var margin = {
      top: canvasSizes.margin.top,
      right: canvasSizes.margin.right + 10,
      bottom: canvasSizes.areaChartType1.marginBottom,
      left: canvasSizes.margin.left,
    };

    var color = d3
      .scaleOrdinal()
      .domain(["uniqueClicks", "totalClicks"])
      .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"]);

    var x = d3
        .scaleTime()
        .range([0, canvasSizes.svgWidth - margin.left - margin.right]),
      y = d3
        .scaleLinear()
        .range([canvasSizes.svgHeight - margin.top - margin.bottom, 0]),
      z = color;

    var area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(function (d) {
        return x(d.date);
      })
      .y0(y(0))
      .y1(function (d) {
        return y(d.clicks);
      });

    var svg = d3
      .selectAll(".areaChartType1")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", 650);

    var g = svg
      .append("g")
      .attr("id", "areaChart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // PREPARING DATE & TIME
    var locale = d3.timeFormatLocale(getLocale());
    var formatLocale = locale.format("%d %b %Y");

    data.data.forEach((e) => {
      e.date = new Date(e.date);
    });

    data.data.sort((a, b) => {
      return a.date - b.date;
    });

    const data_ready_total = d3
      .nest()
      .key(function (d) {
        return "totalClicks";
      })
      .rollup(function (leaves) {
        var temp = leaves.reduce((acc, cur) => {
          var obj = {};
          obj.date = cur.date;
          obj.clicks = cur.totalClicks;
          acc.push(obj);
          return acc;
        }, []);
        return temp;
      })
      .entries(data.data);

    const data_ready_unique = d3
      .nest()
      .key(function (d) {
        return "uniqueClicks";
      })
      .rollup(function (leaves) {
        var temp = leaves.reduce((acc, cur) => {
          var obj = {};
          obj.date = cur.date;
          obj.clicks = cur.uniqueClicks;
          acc.push(obj);
          return acc;
        }, []);
        return temp;
      })
      .entries(data.data);

    const data_ready = data_ready_total.concat(data_ready_unique);
    console.log("data_ready", data_ready);

    // -------------------------------------------------

    x.domain(
      d3.extent(data.data, function (d) {
        return d.date;
      })
    );

    y.domain([
      0,
      d3.max(data_ready, function (c) {
        return d3.max(c.value, function (d) {
          return d.clicks;
        });
      }),
    ]);

    z.domain(
      data_ready.map(function (c) {
        return c.key;
      })
    );

    g.append("g")
      .attr(
        "transform",
        `translate(${0}, ${canvasSizes.svgHeight - margin.top - margin.bottom})`
      )
      .attr("class", "axisWhite")
      .call(
        d3
          .axisBottom(x)
          .tickFormat(formatLocale)
          .ticks(canvasSizes.areaChartType1.tickN)
      )
      // .selectAll("text")
      // .style("text-anchor", "end")
      // .attr("dx", "-.8em")
      // .attr("dy", ".15em")
      // .attr(
      //   "transform",
      //   `rotate(${canvasSizes.areaChartType1.rotateLabelText})`
      // )
      .append("text")
      .attr("x", canvasSizes.areaChartType1.AxisXLabel)
      .attr("dy", "2.74em")
      .attr("class", "axis-x-text")
      .attr("text-anchor", "end")
      .text("Время");

    g.append("g")
      .attr("class", "axisWhite")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("class", "axis-y-text")
      .text("Клики");

    var areaSource = g
      .selectAll(".area")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", function (d) {
        return `area ${d.key}`;
      });

    areaSource
      .append("path")
      .attr("d", function (d) {
        return area(d.value);
      })
      .style("fill", function (d) {
        return z(d.key);
      });

    //LINE
    const lineColor = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3
      .line()
      .x(function (d, i) {
        return x(d.date);
      }) // set the x values for the line generator
      .y(function (d) {
        return y(d.clicks);
      }) // set the y values for the line generator
      .curve(d3.curveMonotoneX);

    var lineSource = g
      .selectAll(".line")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", function (d) {
        return `line ${d.key}`;
      });

    lineSource
      .append("path")
      .attr("d", function (d) {
        return line(d.value);
      })
      .attr("fill", "none")
      .attr("stroke-width", "0.1em")
      .attr("stroke", (d) => lineColor(d.key));

    // TOTAL-CLICKS CIRCLES
    var totalClicksCircles = g
      .selectAll("total")
      .data(data_ready_total[0].value)
      .enter()
      .append("g")
      .attr("class", "circles total");

    totalClicksCircles
      .append("circle")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.clicks);
      })
      .attr("r", 3)
      .attr("fill", "red")
      .attr("stroke", "none");

    // UNIQUE-CLICKS CIRCLES
    var uniqueClicksCircles = g
      .selectAll("total")
      .data(data_ready_unique[0].value)
      .enter()
      .append("g")
      .attr("class", "circles total");

    uniqueClicksCircles
      .append("circle")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.clicks);
      })
      .attr("r", 4)
      .attr("fill", "blue")
      .attr("stroke", "none");

    // ---------------------------------------------------------
    // Calculate height of element
    var width = document.getElementById("chart_days_of_week").offsetWidth;
    var labelHeight1 = 0;
    var labelWidth1 = 0;
    var labelHeight2 = 0;
    var labelWidth2 = 0;

    var graphWidth = d3.select("#areaChart").node().getBoundingClientRect()
      .width;
    var graphHeight = d3.select("#areaChart").node().getBoundingClientRect()
      .height;

    if (graphWidth <= 500) {
      // MOBILE
      labelHeight1 = graphHeight + 70;
      labelHeight2 = graphHeight + 93;
    } else {
      // DESKTOP
      labelHeight1 = graphHeight + 80;
      labelHeight2 = graphHeight + 80;
      labelWidth1 = 0.12 * width;
      labelWidth2 = 0.5 * width;
    }

    // Legend Colors
    var colors = ["red", "blue"];

    // LEGEND 1
    var legend1 = svg
      .append("g")
      .attr(
        "transform",
        `translate(${canvasSizes.areaChartLegendX},${labelHeight1})`
      );

    // RECT LABEL 1
    var rectLabel1 = legend1
      .append("rect")
      .attr(
        "transform",
        `translate(
       ${57}, 
       ${0})`
      )
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasSizes.legend.rectWidth)
      .attr("height", canvasSizes.legend.rectWidth)
      .style("fill", colors[1])
      .style("opacity", 1);

    // LINE LABEL 1
    var lineLabel1 = legend1
      .append("line")
      .attr("x1", canvasSizes.areaChartType1.lineX1)
      .attr("y1", canvasSizes.areaChartType1.lineY1)
      .attr("x2", canvasSizes.areaChartType1.lineX2)
      .attr("y2", canvasSizes.areaChartType1.lineY2)
      .style("stroke", colors[1])
      .style("fill", "none")
      .attr("stroke-width", canvasSizes.areaChartType1.strokeWidth)
      .style("opacity", 1);

    //Line Label Circle
    var circle = legend1
      .append("circle")
      .attr("cx", canvasSizes.areaChartType1.circleCX)
      .attr("cy", canvasSizes.areaChartType1.circleCY)
      .attr("r", canvasSizes.areaChartType1.circleR)
      .style("opacity", 0)
      .attr("class", "dot")
      .transition()
      .duration(500)
      .delay(2000)
      .attr("cx", canvasSizes.areaChartType1.circleCX)
      .attr("cy", canvasSizes.areaChartType1.circleCY)
      .attr("r", canvasSizes.areaChartType1.circleR)
      .attr("class", "dot")
      .style("opacity", 1);

    // RECT LABEL Text 1
    var recText1 = legend1
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
      .text("Всего")
      .transition()
      .duration(500)
      .delay(2000)
      .attr(
        "transform",
        `translate(
       ${canvasSizes.areaChartType1.text1x},
           ${0}
           )`
      )
      .attr("dy", "1em")
      .attr("class", "legend-text")
      .style("opacity", 1)
      .text("Всего");

    // LEGEND 2
    var legend2 = svg
      .append("g")
      .attr(
        "transform",
        `translate(${canvasSizes.areaChartLegendX2},${labelHeight2})`
      );

    // RECT LABEL 1
    var rectLabel2 = legend2
      .append("rect")
      .attr(
        "transform",
        `translate(
     ${57}, 
     ${0})`
      )
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasSizes.legend.rectWidth)
      .attr("height", canvasSizes.legend.rectWidth)
      .style("fill", colors[1])
      .style("opacity", 1);

    // LINE LABEL 1
    var lineLabel2 = legend2
      .append("line")
      .attr("x1", canvasSizes.areaChartType1.lineX1)
      .attr("y1", canvasSizes.areaChartType1.lineY1)
      .attr("x2", canvasSizes.areaChartType1.lineX2)
      .attr("y2", canvasSizes.areaChartType1.lineY2)
      .style("stroke", colors[1])
      .style("fill", "none")
      .attr("stroke-width", canvasSizes.areaChartType1.strokeWidth)
      .style("opacity", 1);

    //Line Label Circle
    var circle = legend2
      .append("circle")
      .attr("cx", canvasSizes.areaChartType1.circleCX)
      .attr("cy", canvasSizes.areaChartType1.circleCY)
      .attr("r", canvasSizes.areaChartType1.circleR)
      .style("opacity", 0)
      .attr("class", "dot")
      .transition()
      .duration(500)
      .delay(2000)
      .attr("cx", canvasSizes.areaChartType1.circleCX)
      .attr("cy", canvasSizes.areaChartType1.circleCY)
      .attr("r", canvasSizes.areaChartType1.circleR)
      .attr("class", "dot")
      .style("opacity", 1);

    // RECT LABEL Text 2
    var recText1 = legend2
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
      .text("Уникальные")
      .transition()
      .duration(500)
      .delay(2000)
      .attr(
        "transform",
        `translate(
     ${canvasSizes.areaChartType1.text1x},
         ${0}
         )`
      )
      .attr("dy", "1em")
      .attr("class", "legend-text")
      .style("opacity", 1)
      .text("Уникальные");

    // ---------------------------------------------------------
  } catch (e) {
    console.error(e);
  }
}
