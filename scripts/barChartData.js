function getTip() {
  if (window.innerWidth < 500) {
    return d3
      .tip()
      .attr("class", "d3-tip")
      .direction(function (d) {
        console.log("DIR", this);
        let direction;
        if (this.getBBox().x <= 0.5 * width) {
          direction = "e";
        } else if (this.getBBox().x > 0.5 * width) {
          direction = "w";
        }
        return direction;
      })
      .offset(function () {
        console.log("this", this);

        return [-10, 0];
      })
      .html(function (d) {
        return `<table><tr><th>Пользователи</th><td></td></tr><tr><td>Общие</td><td>${d.totalClicks}</td></tr><tr><td>Уникальные</td><td>${d.uniqueClicks}</td></tr>
    <tr><th style="text-align:left">Время (ч.)</th><th>${d.hour}</th></tr></table>`;
      });
  } else {
    return d3
      .tip()
      .attr("class", "d3-tip")
      .direction(function (d) {
        console.log("DIR", this);
        let direction;
        if (this.getBBox().x <= 0.5 * width) {
          direction = "e";
        } else if (this.getBBox().x > 0.5 * width) {
          direction = "w";
        }
        return direction;
      })
      .offset(function () {
        console.log("this", this);

        return [-10, 0];
      })
      .html(function (d) {
        return `<table><tr><th>Пользователи</th><td></td></tr><tr><td>Общие</td><td>${d.totalClicks}</td></tr><tr><td>Уникальные</td><td>${d.uniqueClicks}</td></tr>
    <tr><th style="text-align:left">Время (ч.)</th><th>${d.hour}</th></tr></table>`;
      });
  }
}

function getBarChartSetting() {
  var barChartSettings = {};
  if (window.innerWidth < 500) {
    // width of each bar
    barChartSettings.xScaleMobilePadding = 0.15;
    barChartSettings.radiusMobile = 10;

    barChartSettings.rectGroupTranslateX = 0.3;
    barChartSettings.rectGroupTranslateY = 20;
    barChartSettings.rectWidth = 40;

    barChartSettings.lineGroupTranslateX = 0.3;
    barChartSettings.lineGroupTranslateY = 90;

    barChartSettings.labelY = 60;
    barChartSettings.lineTxtLabelDY = "2em";

    barChartSettings.xAxisLabel = 0.87;

    //Клики
    barChartSettings.YAxisLabel = "-.3em";

    barChartSettings.rectLabelY = 40;
    barChartSettings.rectLabelX = 160;
    barChartSettings.rectLabelDY = "0.88em";
  } else {
    // width of each bar
    barChartSettings.xScaleMobilePadding = 0.35;
    barChartSettings.radiusMobile = 7;

    barChartSettings.rectGroupTranslateX = 0.1;
    barChartSettings.rectGroupTranslateY = 0;

    //Клики
    barChartSettings.YAxisLabel = "-1.3em";

    barChartSettings.rectWidth = 25;

    barChartSettings.rectLabelDY = "0.84em";
    barChartSettings.lineLabelDY = "0.76em";
    barChartSettings.lineTxtLabelDY = ".85em";

    barChartSettings.rectLabelY = 0;
    barChartSettings.rectLabelX = 125;

    barChartSettings.xAxisLabel = 0.89;

    barChartSettings.labelY = 15;
    barChartSettings.lineGroupTranslateX = 0.5;
    barChartSettings.lineGroupTranslateY = 0;
  }

  return barChartSettings;
}
