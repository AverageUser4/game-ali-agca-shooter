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

  virtualCursor =  {
    x: 0, y: 0
  };

  wheels = {
    radian: 0,
    left: {
      rotationCenter: { x: 158, y: 175 }
    },
    right: {
      rotationCenter: { x: 410, y: 178 }
    },
  };

  arm = {
    rotationCenter: { x: 238, y: 64 },
    radian: 0,
    radius: 103,
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

  updateArmRadian() {
    let slope = (this.virtualCursor.y - this.y - this.arm.rotationCenter.y) /
      (this.virtualCursor.x - this.x - this.arm.rotationCenter.x);

    this.arm.radian = Math.atan(slope);
  
    if(this.virtualCursor.x < this.x + this.arm.rotationCenter.x)
      this.arm.radian = 2 * this.utility.RADIAN * -90 + this.arm.radian;
  }

  logic(entities) {
    //debug
    this.x = 500;
    this.directionX = 1;

    const playerX = entities.players[0].x;
    const playerY = entities.players[0].y;

    const cursorSpeed = 10;

    if(this.virtualCursor.x < playerX)
      this.virtualCursor.x += cursorSpeed;
    else if(this.virtualCursor.x > playerX)
      this.virtualCursor.x -= cursorSpeed;

    if(this.virtualCursor.y < playerY)
      this.virtualCursor.y += cursorSpeed;
    else if(this.virtualCursor.y > playerY)
      this.virtualCursor.y -= cursorSpeed;

    this.updateArmRadian();

    // this.x += this.speed * this.directionX;
    this.wheels.radian += this.directionX === 1 ? 
      this.utility.RADIAN * this.speed : this.utility.RADIAN * -this.speed;

    if(this.x <= this.minX)
      this.directionX = 1;
    else if(this.x > this.maxX)
      this.directionX = -1;
  }

  drawWheels() {
    for(let wheel of ['left', 'right']) {
      let rcx = this.x + this.wheels[wheel].rotationCenter.x;
      let rcy = this.y + this.wheels[wheel].rotationCenter.y;

      if(this.directionX === -1)
        rcx = this.x + this.width - this.wheels[wheel].rotationCenter.x;

      this.canvas.context.save();
      this.canvas.context.translate(rcx, rcy);
      this.canvas.context.rotate(this.wheels.radian);
      this.canvas.context.translate(-rcx, -rcy);

      if(this.directionX === -1) {
        this.canvas.context.scale(-1, 1);
        this.canvas.context.drawImage(this.images[`${wheel}Wheel`], -this.x - this.width, this.y);
      } else
        this.canvas.context.drawImage(this.images[`${wheel}Wheel`], this.x, this.y);

      this.canvas.context.restore();
    }
  }

  drawArm() {
    let rcx = this.x + this.arm.rotationCenter.x;
    let rcy = this.y + this.arm.rotationCenter.y;

    this.canvas.context.save();

    this.canvas.context.translate(rcx, rcy);
    this.canvas.context.rotate(this.arm.radian);
    this.canvas.context.translate(-rcx, -rcy);

    this.canvas.context.drawImage(this.images.arm, this.x, this.y);

    this.canvas.context.restore();
  }

  draw() {
    if(this.directionX === 1) {
      this.canvas.context.drawImage(this.images.bodyAndHead, this.x, this.y);
      this.canvas.context.drawImage(this.images.vehicle, this.x, this.y);

      this.drawWheels();
      this.drawArm();
    }
    else {
      this.utility.mirrorImage(this.canvas, this.images.bodyAndHead, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.vehicle, this.x, this.y, true);
    
      this.drawWheels();

      this.utility.mirrorImage(this.canvas, this.images.arm, this.x, this.y, true);
    }

    this.canvas.context.strokeStyle = 'green';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x + this.arm.rotationCenter.x, this.y + this.arm.rotationCenter.y, this.arm.radius, 0, 2 * Math.PI);
    this.canvas.context.stroke();

    this.canvas.context.fillRect(this.virtualCursor.x, this.virtualCursor.y, 10, 10);
  }

}