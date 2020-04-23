function getTextWidth(text, fontSize) {
  // re-use canvas object for better performance

  var font = `${fontSize}px san serif`;
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}
