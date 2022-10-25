export default class Platform {

  x;
  y;
  x2;
  y2;
  width;
  height;

  collidable = true;
  collidabilityCooldown = 0;

  canvas;

  constructor(data) {
    this.canvas = data.canvas;
    this.x = data.coordinates.x;
    this.y = data.coordinates.y;
    this.width = data.coordinates.width;
    this.height = data.coordinates.height;
    this.x2 = this.x + this.width;
    this.y2 = this.y + this.height;
  }

  makeNonCollidable(frames) {
    this.collidabilityCooldown = frames;
    this.collidable = false;
  }

  logic() {
    this.collidabilityCooldown--;
    if(this.collidabilityCooldown <= 0)
      this.collidable = true;
  }

  draw() {
    this.canvas.context.fillStyle = 'rgb(90, 65, 5)';
    this.canvas.context.strokeStyle = 'black';
    this.canvas.context.fillRect(this.x, this.y, this.width, this.height);
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);
  }

}