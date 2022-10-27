export default class Enemy {

  x = 280;
  y = 100;
  width = 490;
  height = 235;

  minX;
  maxX;
  maxY;

  directionX = -1;
  speed = 10;

  canvas;
  images;

  wheels = {
    radian: 0,
    left: {
      rotationCenter: { x: 160, y: 178 }
    },
    right: {
      rotationCenter: { x: 410, y: 180 }
    },
  };

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
      bodyAndHead: this.resources.getResource('papamobileBodyAndHead'),
      leftWheel: this.resources.getResource('papamobileLeftWheel'),
      rightWheel: this.resources.getResource('papamobileRightWheel'),
      vehicle: this.resources.getResource('papamobileVehicle'),
    }
  }

  logic() {
    this.x += this.speed * this.directionX;
    this.wheels.radian += this.utility.RADIAN * this.speed;

    if(this.x <= this.minX)
      this.directionX = 1;
    else if(this.x > this.maxX)
      this.directionX = -1;
  }

  draw() {
    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    if(this.directionX === 1) {
      this.canvas.context.drawImage(this.images.bodyAndHead, this.x, this.y);
      this.canvas.context.drawImage(this.images.vehicle, this.x, this.y);

      console.log('hi')

      this.canvas.context.save();
      this.canvas.context.translate(this.x + this.wheels.left.rotationCenter.x, this.y + this.wheels.left.rotationCenter.y);
      this.canvas.context.rotate(this.wheels.radian);
      this.canvas.context.translate(-this.x - this.wheels.left.rotationCenter.x, -this.y - this.wheels.left.rotationCenter.y);
      this.canvas.context.drawImage(this.images.leftWheel, this.x, this.y);
      this.canvas.context.restore();

      this.canvas.context.save();
      this.canvas.context.translate(this.x + this.wheels.right.rotationCenter.x, this.y + this.wheels.right.rotationCenter.y);
      this.canvas.context.rotate(this.wheels.radian);
      this.canvas.context.translate(-this.x - this.wheels.right.rotationCenter.x, -this.y - this.wheels.right.rotationCenter.y);
      this.canvas.context.drawImage(this.images.rightWheel, this.x, this.y);
      this.canvas.context.restore();

      this.canvas.context.drawImage(this.images.arm, this.x, this.y);
    }
    else {
      this.utility.mirrorImage(this.canvas, this.images.bodyAndHead, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.vehicle, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.leftWheel, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.rightWheel, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.arm, this.x, this.y, true);
    }
  }

}