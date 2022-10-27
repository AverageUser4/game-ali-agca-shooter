export default class Enemy {

  x = 280;
  y = 100;
  width = 490;
  height = 235;

  minX;
  maxX;
  maxY;

  attackCooldown = 0;
  maxAttackCooldown = 50;

  directionX = -1;
  speed = 10;

  canvas;
  images;

  gunSFX;

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
    // debug
    window.addEventListener('keydown', (event) => {
      if(event.key === 'q') this.directionX *= -1;
    });

    this.canvas = data.canvas;
    this.utility = data.utility;
    this.resources = data.resources;
    this.master = data.master;

    this.gunSFX = this.resources.getResource('browning');

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

  movementLogic() {
    //debug
    this.x = 500;


    // this.x += this.speed * this.directionX;
    this.wheels.radian += this.directionX === 1 ? 
      this.utility.RADIAN * this.speed : this.utility.RADIAN * -this.speed;

    if(this.x <= this.minX)
      this.directionX = 1;
    else if(this.x > this.maxX)
      this.directionX = -1;
  }

  attackLogic(entities) {
    this.attackCooldown--;

    this.virtualCursor.x = entities.players[0].x;
    this.virtualCursor.y = entities.players[0].y + 50;

    this.updateArmRadian();

    if(this.attackCooldown <= 0) {
      const gunPointAdjustment = this.directionX === 1 ? this.utility.RADIAN * 8 : this.utility.RADIAN * -10;
      const sx = this.arm.radius * Math.cos(this.arm.radian - gunPointAdjustment);
      const sy = this.arm.radius * Math.sin(this.arm.radian - gunPointAdjustment);

      this.master.request('createEntity', {
        kind: 'bullet',
        canvas: this.canvas,
        x: this.x + this.arm.rotationCenter.x + sx,
        y: this.y + this.arm.rotationCenter.y + sy,
        destinationX: this.virtualCursor.x,
        destinationY: this.virtualCursor.y,
      });

      this.gunSFX.cloneNode().play();
      this.attackCooldown = this.maxAttackCooldown;
    }
  }

  logic(entities) {
    this.movementLogic();
    this.attackLogic(entities);
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
    if(this.directionX === 1) {
      let rcx = this.x + this.arm.rotationCenter.x;
      let rcy = this.y + this.arm.rotationCenter.y;
  
      this.canvas.context.save();
  
      this.canvas.context.translate(rcx, rcy);
      this.canvas.context.rotate(this.arm.radian);
      this.canvas.context.translate(-rcx, -rcy);
  
      this.canvas.context.drawImage(this.images.arm, this.x, this.y);
  
      this.canvas.context.restore();
    } else {
      let rcx = this.x + this.width - this.arm.rotationCenter.x;
      let rcy = this.y + this.arm.rotationCenter.y;

      this.canvas.context.save();

      this.canvas.context.translate(rcx, rcy);
      this.canvas.context.rotate(this.arm.radian);
      this.canvas.context.translate(-rcx, -rcy);

      this.canvas.context.scale(1, -1);
      this.canvas.context.drawImage(this.images.arm, 
        this.x + 2 * this.arm.rotationCenter.x - this.width,
        -this.y - this.height + this.arm.rotationCenter.y);

      this.canvas.context.restore();

      this.canvas.context.fillStyle = 'red';
      this.canvas.context.fillRect(rcx, rcy, 10, 10)
    }
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
      this.drawArm();
    }

    this.canvas.context.strokeStyle = 'green';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x + this.arm.rotationCenter.x, this.y + this.arm.rotationCenter.y, this.arm.radius, 0, 2 * Math.PI);
    this.canvas.context.stroke();

    // this.canvas.context.fillRect(this.virtualCursor.x, this.virtualCursor.y, 10, 10);
  }

}