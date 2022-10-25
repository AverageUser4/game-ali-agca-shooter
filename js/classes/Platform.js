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

    this.path = new Path2D();
    this.path.rect(this.x, this.y, this.width, this.height);
    this.path.lineTo(this.x + 10, this.y - 10);
    this.path.lineTo(this.x + 10 + this.width, this.y - 10);
    this.path.lineTo(this.x + this.width, this.y);
    this.path.moveTo(this.x + this.width, this.y + this.height);
    this.path.lineTo(this.x + this.width + 10, this.y + this.height -10);
    this.path.lineTo(this.x + 10 + this.width, this.y - 10);
    this.path.lineTo(this.x + this.width, this.y);
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

    this.canvas.context.fill(this.path);
    this.canvas.context.stroke(this.path);
  }

}