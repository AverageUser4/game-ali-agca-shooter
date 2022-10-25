const randomInteger = (min = 0, max = 100, negative = false) => {
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  return negative && randomInteger(0, 1) ? -random : random;
}

const mirrorImage = (canvas, image, x = 0, y = 0, horizontal = false, vertical = false) => {
  /*! https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5 */
  canvas.context.save();
  canvas.context.scale(horizontal ? -1 : 1, vertical ? - 1 : 1);
  canvas.context.translate(horizontal ? image.width : 0, vertical ? image.height : 0);
  
  canvas.context.drawImage(image, 0, 0);
  canvas.context.restore();
}

const degreesToRadians = (degrees) => Math.PI * degrees / 180;

const radiansToDegrees = (radians) => radians * 180 / Math.PI;


export default {
  randomInteger,
  mirrorImage,
  degreesToRadians,
  radiansToDegrees
};