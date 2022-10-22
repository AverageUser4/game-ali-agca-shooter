const randomInteger = (min = 0, max = 100, negative = false) => {
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  return negative && randomInteger(0, 1) ? -random : random;
}

const mirrorImage = (canvas, image, x = 0, y = 0, horizontal = false, vertical = false, translateOffsetX) => {
  /*! https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5 */
  canvas.context.save();
  canvas.context.setTransform(
      horizontal ? -1 : 1, 0,
      0, vertical ? -1 : 1,
      x + (horizontal ? image.width : 0),
      y + (vertical ? image.height : 0)
  );
  canvas.context.drawImage(image, 0, 0);
  canvas.context.restore();
}

export default {
  randomInteger,
  mirrorImage
};