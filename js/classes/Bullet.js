export default class Bullet {

  x;
  y;
  speedX;
  speedY;
  radius = 5;
  speedBase = 20;

  outOfCanvas = true;

  constructor(dependencies, x, y, destinationX, destinationY) {
    this.canvas = dependencies.canvas;

    this.x = x;
    this.y = y;

    this.speedX = 25;//destinationX / destinationY * this.speedBase;
    this.speedY = 0;//destinationY / destinationX * this.speedBase;
  }

  logic() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.outOfCanvas = this.x > this.canvas.width || this.x < 0 ||
      this.y > this.canvas.height || this.y < 0;
  }

  draw() {
    this.canvas.context.fillStyle = 'red';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.context.fill();
  }

}