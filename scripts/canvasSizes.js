getCanvasSizes = ({ elementId = "pie_type_1" } = {}) => {
  const canvasSizes = {};
  const breakPoint = 576;
  const width = document.getElementById(elementId).offsetWidth;
  console.log("window", window.offsetWidth);
  console.log(
    `window-offsetWidth: ${window.offsetWidth} elementId:${elementId}`
  );
  if (elementId === "pie_type_1") {
    canvasSizes.title = "Пользователи";
  }
  if (elementId === "pie_type_2") {
    canvasSizes.title = "Девайсы";
  }
  if (elementId === "pie_type_3") {
    canvasSizes.title = "Клики по Дням Недели";
  }
  if (elementId === "chart_hours_of_day") {
    canvasSizes.title = "Посещения по Времени Суток";
  }
  if (elementId === "chart_days_of_week") {
    canvasSizes.title = "Посещения по Дням Недели";
  }
  if (elementId === "chart_daily_clicks") {
    canvasSizes.title = "Посещения с... по...";
  }
  // ----------------------------------------
  if (window.innerWidth <= breakPoint) {
    //MOBILE
    canvasSizes.svgWidth = width;
    canvasSizes.svgHeight = width;
    if (elementId === "chart_hours_of_day") {
      canvasSizes.svgHeight = 400;
    }
    if (elementId === "chart_daily_clicks") {
      canvasSizes.svgHeight = 460;
    }
    canvasSizes.cx = Math.floor(width / 2);
    canvasSizes.cy = Math.floor(width / 2);

    canvasSizes.r = Math.floor((0.89 * width) / 2);

    canvasSizes.lineChartRadius = 3.4;
    canvasSizes.margin = {};
    canvasSizes.margin.top = 50;
    canvasSizes.margin.right = 0;
    canvasSizes.margin.left = 30;
    canvasSizes.margin.bottom = 50;

    canvasSizes.barChartPadding = 0.4;
    canvasSizes.label = {};
    canvasSizes.label.marginLeft = window.innerWidth * 0.27;
    canvasSizes.label.marginTop = 20;
    canvasSizes.label.marginBottom = 25;
    canvasSizes.label.fontSize = 15;
    canvasSizes.label.pieFontSize = 12;

    canvasSizes.legend = {};
    canvasSizes.legend.rectWidth = 17;

    //BarChart Legend
    canvasSizes.barChartLegendGroupX =
      (width - (getTextWidth("уникальные пользователи", 17) + 51 + 10)) / 2.3;
    canvasSizes.barChartLegendGroupX2 =
      (width - (getTextWidth("уникальные пользователи", 17) + 51 + 5)) / 2.3;

    canvasSizes.barChartLegendGroupY = 370;
    canvasSizes.barChartLegendGroupY2 = 393;

    canvasSizes.line = {};
    canvasSizes.line.x1 = 20;
    canvasSizes.line.y1 = 12;
    canvasSizes.line.x2 = 70;
    canvasSizes.line.y2 = 12;

    canvasSizes.circle = {};
    canvasSizes.circle.cx = 45;
    canvasSizes.circle.cy = 12;
    canvasSizes.circle.r = 4;

    canvasSizes.lineLabeTextX = 80;

    //GROUPED CHART
    canvasSizes.groupedChartLegendGroupX =
      (width - (getTextWidth("уникальные пользователи", 17) + 51 + 10)) / 5;
    canvasSizes.groupedChartLegendGroupX2 =
      (width - (getTextWidth("уникальные пользователи", 17) + 51 + 5)) / 5;
    canvasSizes.groupedChartLineLabeTextX = 80;

    // AREA CHART TYPE

    canvasSizes.areaChartType1 = {};
    canvasSizes.areaChartType1.lineX1 = 87;
    canvasSizes.areaChartType1.lineY1 = 10;
    canvasSizes.areaChartType1.lineX2 = 157;
    canvasSizes.areaChartType1.lineY2 = 10;
    canvasSizes.areaChartType1.circleCX = 87 + 35;
    canvasSizes.areaChartType1.circleCY = 10;
    canvasSizes.areaChartType1.circleR = 4;
    canvasSizes.areaChartType1.strokeWidth = 2;
    canvasSizes.areaChartType1.text1x = 170;
    canvasSizes.areaChartType1.marginBottom = 50;
    canvasSizes.areaChartType1.tickN = 4;
    canvasSizes.areaChartType1.rotateLabelText = -90;
    canvasSizes.areaChartType1.AxisXLabel = 0.9 * canvasSizes.svgWidth;
    canvasSizes.areaChartLegendX =
      (width - (getTextWidth("уникальные", 17) + 70 + 13 + 35)) / 5;
    canvasSizes.areaChartLegendX2 =
      (width - (getTextWidth("уникальные", 17) + 70 + 13 + 35)) / 5;
  } else {
    // DESKTOP
    canvasSizes.svgWidth = width;
    canvasSizes.svgHeight = width;
    if (
      elementId === "chart_hours_of_day" ||
      elementId === "chart_days_of_week"
    ) {
      canvasSizes.svgHeight = 600;
    }

    if (elementId === "chart_daily_clicks") {
      canvasSizes.svgHeight = 680;
    }

    canvasSizes.barChartPadding = 0.2;
    canvasSizes.cx = Math.floor(width / 2);
    canvasSizes.cy = Math.floor(width / 2);

    canvasSizes.lineChartRadius = 7;
    canvasSizes.margin = {};
    canvasSizes.margin.top = 50;
    canvasSizes.margin.right = 20;
    canvasSizes.margin.left = 40;
    canvasSizes.margin.bottom = 130;

    canvasSizes.r = Math.floor((0.85 * width) / 2);
    canvasSizes.label = {};
    canvasSizes.label.marginLeft = (width / 3) * 0.7;
    canvasSizes.label.marginTop = 0;
    canvasSizes.label.marginBottom = 25;
    canvasSizes.label.fontSize = 19;
    canvasSizes.label.pieFontSize = 19;

    canvasSizes.legend = {};
    canvasSizes.legend.rectWidth = 25;

    //BarChart Legend
    canvasSizes.barChartLegendGroupX = 0.12 * width;
    canvasSizes.barChartLegendGroupX2 = 0.5 * width;
    canvasSizes.barChartLegendGroupY2 = 500;
    canvasSizes.barChartLegendGroupY = 500;

    canvasSizes.line = {};
    canvasSizes.line.x1 = 0;
    canvasSizes.line.y1 = 15;
    canvasSizes.line.x2 = 100;
    canvasSizes.line.y2 = 15;

    canvasSizes.circle = {};
    canvasSizes.circle.cx = 50;
    canvasSizes.circle.cy = 15;
    canvasSizes.circle.r = 7;

    canvasSizes.lineLabeTextX = 114;

    //GroupedChart Legend
    canvasSizes.groupedChartLegendGroupX = 0.2 * width;
    canvasSizes.groupedChartLegendGroupX2 = 0.54 * width;
    canvasSizes.groupedChartLegendGroupY2 = 500;
    canvasSizes.groupedChartLegendGroupY = 500;
    canvasSizes.groupedChartLineLabeTextX = 97;

    // AREA CHART TYPE
    canvasSizes.areaChartLegendX = 0.2 * width;
    canvasSizes.areaChartLegendX2 = 0.54 * width;
    canvasSizes.areaChartType1 = {};
    canvasSizes.areaChartType1.lineX1 = 97;
    canvasSizes.areaChartType1.lineY1 = 13;
    canvasSizes.areaChartType1.lineX2 = 167;
    canvasSizes.areaChartType1.lineY2 = 13;
    canvasSizes.areaChartType1.circleCX = 97 + 35;
    canvasSizes.areaChartType1.circleCY = 13;
    canvasSizes.areaChartType1.circleR = 6;
    canvasSizes.areaChartType1.strokeWidth = 3;
    canvasSizes.areaChartType1.text1x = 187;
    canvasSizes.areaChartType1.marginBottom = 150;
    canvasSizes.areaChartType1.AxisXLabel = 0.96 * canvasSizes.svgWidth;
    canvasSizes.areaChartType1.tickN = 15;
    canvasSizes.areaChartType1.rotateLabelText = 0;
  }
  return canvasSizes;
};

calcuateHeight = (canvasSizes, dataLength) => {
  if (window.innerWidth <= 576) {
    return (
      canvasSizes.label.marginTop +
      dataLength * 24 +
      canvasSizes.label.marginBottom
    );
  }
  return canvasSizes.svgHeight;
};
