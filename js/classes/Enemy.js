export default class Enemy {

  x = 280;
  y = 100;
  width = 486;
  height = 226;

  minX;
  maxX;
  maxY;

  directionX = -1;
  speedX = 10;

  canvas;
  images;

  constructor(data) {
    this.canvas = data.canvas;
    this.utility = data.utility;
    this.resources = data.resources;

    this.x = this.canvas.width + this.width;
    this.y = this.canvas.height - this.height;

    this.minX = -this.width * 1.5;
    this.maxX = this.canvas.width + this.width * 0.5;
    this.maxY = this.canvas.height - this.height;

    this.images = {
      arm: this.resources.getResource('papamobileArm'),
      body: this.resources.getResource('papamobileBody'),
      gun: this.resources.getResource('papamobileGun'),
      head: this.resources.getResource('papamobileHead'),
      leftWheel: this.resources.getResource('papamobileLeftWheel'),
      rightWheel: this.resources.getResource('papamobileRightWheel'),
      vehicle: this.resources.getResource('papamobileVehicle'),
    }
  }

  logic() {
    this.x += this.speedX * this.directionX;

    if(this.x <= this.minX)
      this.directionX = 1;
    else if(this.x > this.maxX)
      this.directionX = -1;
  }

  draw() {
    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    if(this.directionX === 1) {
      this.canvas.context.drawImage(this.images.body, this.x, this.y);
      this.canvas.context.drawImage(this.images.head, this.x, this.y);
      this.canvas.context.drawImage(this.images.vehicle, this.x, this.y);
      this.canvas.context.drawImage(this.images.leftWheel, this.x, this.y);
      this.canvas.context.drawImage(this.images.rightWheel, this.x, this.y);
      this.canvas.context.drawImage(this.images.gun, this.x, this.y);
      this.canvas.context.drawImage(this.images.arm, this.x, this.y);
    }
    else {
      this.utility.mirrorImage(this.canvas, this.images.body, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.head, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.vehicle, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.leftWheel, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.rightWheel, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.gun, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.arm, this.x, this.y, true);
    }
  }

}