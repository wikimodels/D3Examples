async function getDaysOfWeekChart(urls, canvasSizes) {
  try {
    // ТITLE
    d3.select("#chart_days_of_week_header")
      .append("h6")
      .html(canvasSizes.title)
      .attr("class", "header");

    const data = await d3.json(urls.clicksByDaysOfWeek);
    console.log("data type VII", data);
    // const data_ready = data.data;
    // const color = d3.scaleOrdinal(d3.schemeCategory10);

    var margin = {
      top: canvasSizes.margin.top,
      right: canvasSizes.margin.right + 10,
      bottom: canvasSizes.margin.bottom,
      left: canvasSizes.margin.left,
    };

    var color = d3
      .scaleOrdinal()
      .domain(["uniqueClicks", "totalClicks"])
      .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"]);

    var x = d3
        .scaleLinear()
        .range([0, canvasSizes.svgWidth - margin.left - margin.right]),
      y = d3
        .scaleLinear()
        .range([canvasSizes.svgHeight - margin.top - margin.bottom, 0]),
      z = color;

    var area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(function (d) {
        return x(d.dofn);
      })
      .y0(y(0))
      .y1(function (d) {
        return y(d.clicks);
      });

    var svg = d3
      .selectAll(".barChartType2")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", 650);

    var g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const data_ready_total = d3
      .nest()
      .key(function (d) {
        return "totalClicks";
      })
      .rollup(function (leaves) {
        var temp = leaves.reduce((acc, cur) => {
          var obj = {};
          obj.dofws = cur.dofws;
          obj.dofn = cur.dofn;
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
          obj.dofn = cur.dofn;
          obj.clicks = cur.uniqueClicks;
          acc.push(obj);
          return acc;
        }, []);
        return temp;
      })
      .entries(data.data);

    const data_ready = data_ready_total.concat(data_ready_unique);
    console.log("data_ready", data_ready);

    console.log(data_ready);

    x.domain(
      d3.extent(data.data, function (d) {
        return d.dofn;
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

    var xAxisGenerator = d3.axisBottom(x);
    xAxisGenerator.ticks(7);
    // xAxisGenerator.tickValues(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
    xAxisGenerator.tickValues([1, 2, 3, 4, 5, 6, 7]);

    g.append("g")
      .attr("class", "axis--x")
      .attr(
        "transform",
        `translate(${0}, ${canvasSizes.svgHeight - margin.top - margin.bottom})`
      )
      .attr("class", "axisWhite")
      .call(xAxisGenerator)
      .append("text")
      .attr("x", 0.92 * canvasSizes.svgWidth)
      .attr("dy", "2.74em")
      .attr("class", "axis-x-text")
      .attr("text-anchor", "end")
      .text("Дни недели");

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
        return x(d.dofn);
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
        return x(d.dofn);
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
        return x(d.dofn);
      })
      .attr("cy", function (d) {
        return y(d.clicks);
      })
      .attr("r", 3)
      .attr("fill", "blue")
      .attr("stroke", "none");
  } catch (e) {
    console.error(e);
  }
}
