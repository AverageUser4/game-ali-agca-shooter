export default class Platform {

  x;
  y;
  width;
  height;

  canvas;

  constructor(data) {
    this.canvas = data.canvas;
    this.x = data.coordinates.x;
    this.y = data.coordinates.y;
    this.width = data.coordinates.width;
    this.height = data.coordinates.height;
  }

  draw() {
    console.log(this.x , this.y, this.width, this.height)

    this.canvas.context.fillStyle = 'rgb(90, 65, 5)';
    this.canvas.context.strokeStyle = 'black';
    this.canvas.context.fillRect(this.x, this.y, this.width, this.height);
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);
  }

}