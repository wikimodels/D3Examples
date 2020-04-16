async function getHoursOfDayChart(urls, canvasSizes) {
  try {
    const data = await d3.json(urls.clicksByHoursOfDay);
    console.log("data type IV", data.data);

    const data_ready_total = d3
      .nest()
      .key(function (d) {
        return "totalClicks";
      })
      .entries(data.data);

    const data_ready_unique = d3
      .nest()
      .key(function (d) {
        return "uniqueClicks";
      })
      .entries(data.data);

    const data_ready = data_ready_total.concat(data_ready_unique);
    console.log("data_ready_unique", data_ready);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(function (d) {
      return d.key;
    });

    const totalClicks = data.data.reduce((acc, cur) => {
      acc.push(cur.totalClicks);
      return acc;
    }, []);
    console.log("Total CLICKS", totalClicks);

    const x = d3.scaleLinear().range([0, 23]).domain(data_ready);
    const y = d3
      .scaleLinear()
      .range(d3.extent(totalClicks))
      .domain(totalClicks);

    var svg = d3
      .selectAll(".graph1")
      .append("svg")
      .attr("width", canvasSizes.svgWidth)
      .attr("height", canvasSizes.svgHeight);

    var g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${canvasSizes.svgWidth}, ${canvasSizes.svgHeight})`
      );

    var area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(function (d) {
        console.log("X d", d);
        return x(d);
      })
      .y0(y(0))
      .y1(function (d) {
        return y(d.data.totalClicks);
      });

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + canvasSizes.svgHeight + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Power, kW");

    var source = g
      .selectAll(".area")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", function (d) {
        return `area ${d.key}`;
      });

    source
      .append("path")
      .attr("d", function (d) {
        console.log("Area D", d);
        console.log("Area Func", area(d.key));
        return area(d.key);
      })
      .style("fill", function (d) {
        return color(d.key);
      });

    // x.domain(
    //   d3.extent(data, function (d) {
    //     return d.date;
    //   })
    // );
    // y.domain([
    //   0,
    //   d3.max(sources, function (c) {
    //     return d3.max(c.values, function (d) {
    //       return d.kW;
    //     });
    //   }),
    // ]);
    // z.domain(
    //   sources.map(function (c) {
    //     return c.id;
    //   })
    // );
  } catch (e) {
    console.log(e);
  }
}
// var svg = d3.select("svg"),
//   margin = { top: 20, right: 20, bottom: 30, left: 50 },
//   width = +svg.attr("width") - margin.left - margin.right,
//   height = +svg.attr("height") - margin.top - margin.bottom,
//   g = svg
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var parseDate = d3.timeParse("%Y/%m/%d %H:%M");

// var color = d3
//   .scaleOrdinal()
//   .domain(["PVkW", "TBLkW"])
//   .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"]);

// var x = d3.scaleTime().range([0, width]),
//   y = d3.scaleLinear().range([height, 0]),
//   z = color;

// var area = d3
//   .area()
//   .curve(d3.curveMonotoneX)
//   .x(function (d) {
//     return x(d.date);
//   })
//   .y0(y(0))
//   .y1(function (d) {
//     return y(d.kW);
//   });

// d3.csv("kW_zoomed.csv", type, function (error, data) {
//   if (error) throw error;

//   var sources = data.columns.slice(1).map(function (id) {
//     return {
//       id: id,
//       values: data.map(function (d) {
//         return { date: d.date, kW: d[id] };
//       }),
//     };
//   });

//   console.log(sources);

//   x.domain(
//     d3.extent(data, function (d) {
//       return d.date;
//     })
//   );
//   y.domain([
//     0,
//     d3.max(sources, function (c) {
//       return d3.max(c.values, function (d) {
//         return d.kW;
//       });
//     }),
//   ]);
//   z.domain(
//     sources.map(function (c) {
//       return c.id;
//     })
//   );

//   g.append("g")
//     .attr("class", "axis axis--x")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

//   g.append("g")
//     .attr("class", "axis axis--y")
//     .call(d3.axisLeft(y))
//     .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("fill", "#000")
//     .text("Power, kW");

//   var source = g
//     .selectAll(".area")
//     .data(sources)
//     .enter()
//     .append("g")
//     .attr("class", function (d) {
//       return `area ${d.id}`;
//     });

//   source
//     .append("path")
//     .attr("d", function (d) {
//       console.log(area(d.values));
//       return area(d.values);
//     })
//     .style("fill", function (d) {
//       return z(d.id);
//     });
// });

// function type(d, _, columns) {
//   d.date = parseDate(d.date);
//   for (var i = 1, n = columns.length, c; i < n; ++i)
//     d[(c = columns[i])] = +d[c];
//   return d;
// }