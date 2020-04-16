getCanvasSizes = ({ elementId = "pie_type_1" } = {}) => {
  const canvasSizes = {};
  const breakPoint = 576;
  const width = document.getElementById(elementId).offsetWidth;
  console.log("window", window.offsetWidth);
  console.log(
    `window-offsetWidth: ${window.offsetWidth} elementId:${elementId}`
  );
  if (elementId === "pie_type_1") {
    canvasSizes.title = "<h6>Пользователи</h6>";
  }
  if (elementId === "pie_type_2") {
    canvasSizes.title = "<h6>Девайсы</h6>";
  }
  if (elementId === "pie_type_3") {
    canvasSizes.title = "<h6>Клики по Дням Недели</h6>";
  }
  if (elementId === "chart_hours_of_day") {
    canvasSizes.title = "<h6>Клики по Времени Суток</h6>";
  }

  if (window.innerWidth <= breakPoint) {
    //MOBILE
    canvasSizes.svgWidth = width;
    canvasSizes.svgHeight = width;

    canvasSizes.cx = Math.floor(width / 2);
    canvasSizes.cy = Math.floor(width / 2);

    canvasSizes.r = Math.floor((0.8 * width) / 2);

    canvasSizes.label = {};
    canvasSizes.label.marginLeft = window.innerWidth * 0.27;
    canvasSizes.label.marginTop = 0;
    canvasSizes.label.marginBottom = 25;
    canvasSizes.label.fontSize = 16;
  } else {
    // DESKTOP
    canvasSizes.svgWidth = width;
    canvasSizes.svgHeight = width;

    canvasSizes.cx = Math.floor(width / 2);
    canvasSizes.cy = Math.floor(width / 2);

    canvasSizes.r = Math.floor((0.85 * width) / 2);
    canvasSizes.label = {};
    canvasSizes.label.marginLeft = (width / 3) * 0.7;
    canvasSizes.label.marginTop = 0;
    canvasSizes.label.marginBottom = 25;
    canvasSizes.label.fontSize = 15;
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
