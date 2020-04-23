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
    const colors = ["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"];

    // Prepare Data for Grouped Bars
    const data_ready = d3
      .nest()
      .key(function (d) {
        return d.dofws;
      })
      .rollup(function (leaves) {
        var tempTotal = leaves.reduce((acc, cur) => {
          var obj = {};
          obj.type = "Общие";
          obj.clicks = cur.totalClicks;
          acc.push(obj);
          return acc;
        }, []);

        var tempUnique = leaves.reduce((acc, cur) => {
          var obj = {};
          obj.type = "Уникальные";
          obj.clicks = cur.uniqueClicks;
          acc.push(obj);
          return acc;
        }, []);
        return tempUnique.concat(tempTotal);
      })
      .entries(data.data);

    console.log("data_ready", data_ready);

    var margin = {
      top: canvasSizes.margin.top,
      right: canvasSizes.margin.right + 10,
      bottom: canvasSizes.margin.bottom,
      left: canvasSizes.margin.left,
    };

    var color = d3
      .scaleOrdinal()
      .domain(["uniqueClicks", "totalClicks"])
      .range(colors);

    // Y
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data.data, function (d) {
          return d.totalClicks;
        }),
      ])
      .range([canvasSizes.svgHeight - margin.top - margin.bottom, 0]);

    // X
    var x0 = d3
      .scaleBand() // domain defined below
      .rangeRound([0, canvasSizes.svgWidth - margin.left - margin.right])
      .paddingInner(0.1)
      .paddingOuter(0.1);

    var x1 = d3
      .scaleBand() // domain and range defined below
      .paddingOuter(0.25)
      .paddingInner(0.15);

    //examine first object, retrieve the keys, and discard the first key
    //return resulting array of keys
    // [ "2017 Q1", "2017 Q2", "2017 Q3 First Estimate"]
    //var subCategories = Object.keys(econ2[0]).slice(1);

    //use new array from just the Category values for the bottom x-axis
    //define category names
    x0.domain(data_ready.map((d) => d.key));

    //array of quarterly value names, fitted in the available bottom categories (x0.bandwidth())
    x1.domain(
      data_ready[0].value.map((d) => {
        return d.type;
      })
    ).rangeRound([0, x0.bandwidth()]);

    var svg = d3
      .selectAll(".barChartType2")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", 650);

    var g = svg
      .append("g")
      .attr("id", "groupedChart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .attr("class", "axis--x")
      .attr(
        "transform",
        `translate(${0}, ${canvasSizes.svgHeight - margin.top - margin.bottom})`
      )
      .attr("class", "axisWhite")
      .call(d3.axisBottom(x0))
      .append("text")
      .attr("x", 0.9 * canvasSizes.svgWidth)
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

    var slice = g
      .selectAll(".slice")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform", function (d) {
        return `translate(${x0(d.key)}, ${0})`;
      });

    slice
      .selectAll("rect")
      .data(function (d) {
        return d.value;
      })
      .enter()
      .append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function (d) {
        return x1(d.type);
      })
      .style("fill", function (d) {
        return color(d.type);
      })
      .attr("y", function (d) {
        return y(0);
      })
      .attr("height", function (d) {
        return canvasSizes.svgHeight - margin.top - margin.bottom - y(0);
      })
      .on("mouseover", function (d) {
        d3.select(this).style("fill", d3.rgb(color(d.type)).brighter(2));
      })
      .on("mouseout", function (d) {
        d3.select(this).style("fill", color(d.type));
      });

    slice
      .selectAll("rect")
      .transition()
      .delay(function (d) {
        return Math.random() * 1000;
      })
      .duration(1000)
      .attr("y", function (d) {
        return y(d.clicks);
      })
      .attr("height", function (d) {
        return canvasSizes.svgHeight - margin.top - margin.bottom - y(d.clicks);
      });

    // ---------------------------------------------------------
    // Calculate height of element
    var width = document.getElementById("chart_days_of_week").offsetWidth;
    var labelHeight1 = 0;
    var labelWidth1 = 0;
    var labelHeight2 = 0;
    var labelWidth2 = 0;

    var graphWidth = d3.select("#groupedChart").node().getBoundingClientRect()
      .width;
    var graphHeight = d3.select("#groupedChart").node().getBoundingClientRect()
      .height;

    if (graphWidth <= 500) {
      // MOBILE
      labelHeight1 = graphHeight + 70;
      labelHeight2 = graphHeight + 70;
    } else {
      // DESKTOP
      labelHeight1 = graphHeight + 90;
      labelHeight2 = graphHeight + 70;
      labelWidth1 = 0.12 * width;
      labelWidth2 = 0.5 * width;
    }

    // ---------------------------------------------------------

    // LEGEND 1
    var legend1 = svg
      .append("g")
      .attr(
        "transform",
        `translate(${canvasSizes.groupedChartLegendGroupX},${labelHeight1})`
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
      .text("Общие пользователи")
      .transition()
      .duration(500)
      .delay(2000)
      .attr(
        "transform",
        `translate(
        ${canvasSizes.groupedChartLineLabeTextX},
            ${0}
            )`
      )
      .attr("dy", "1em")
      .attr("class", "legend-text")
      .style("opacity", 1)
      .text("Общие пользователи");

    // LEGEND 2
    var legend2 = svg.append("g").attr(
      "transform",
      `translate(
            ${canvasSizes.groupedChartLegendGroupX2}, 
            ${labelHeight2})`
    );
    //  RECT LABEL 2
    var rectLabel2 = legend2
      .append("rect")
      .attr(
        "transform",
        `translate(
      ${57}, 
      ${20})`
      )
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasSizes.legend.rectWidth)
      .attr("height", canvasSizes.legend.rectWidth)
      .style("fill", colors[0])
      .style("opacity", 1);

    // RECT LABEL Text 2
    var rectText2 = legend2
      .append("text")
      .attr(
        "transform",
        `translate(
        ${canvasSizes.groupedChartLineLabeTextX},
        ${20})`
      )
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
