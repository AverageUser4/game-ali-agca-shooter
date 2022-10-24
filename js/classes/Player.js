import Bullet from './Bullet.js';

export default class Player {

  x = 0;
  y = 0;
  maxX;
  maxY;
  width;
  height;
  speed = 7;
  health = 100;

  isShooting = false;
  attackCooldown = 0;
  
  gunEdgeXBase = 120;
  gunEdgeX = 0;
  gunEdgeYBase = 60;
  gunEdgeY = 0;

  jumpCooldown = 0;
  
  pressedKeys = new Set();
  mouseOffsetX;
  mouseOffsetY;

  gunSFX = new Audio('resources/browning.mp3');

  images = {
    body: new Image(),
    gun: new Image(),
    head: new Image(),
    leftArm: new Image(),
    leftLeg: new Image(),
    rightArm: new Image(),
    rightLeg: new Image(),
  }
  imagesLoaded = 0;
  imagesRequired = 0;
  imagesReady = false;

  rightArmRotationCenterX = 20;
  rightArmRotationCenterY = 72;
  rightArmRadian = 0;

  rightLegRotationCenterX = 35;
  rightLegRotationCenterY = 130;
  rightLegRadian = 0;
  rightLegDirection = -1;

  leftLegRotationCenterX = 22;
  leftLegRotationCenterY = 130;
  leftLegRadian = 0;
  leftLegDirection = 1;

  leftArmRotationCenterX = 30;
  leftArmRotationCenterY = 72;
  leftArmRadian = 0;
  leftArmDirection = 1;

  constructor(data) {
    this.canvas = data.canvas;
    this.master = data.master;
    this.utility = data.utility;

    this.canvas.element.addEventListener('mousedown', () => {
      this.isShooting = true;
    });
    
    this.canvas.element.addEventListener('mousemove', (event) => {
      this.mouseOffsetX = event.offsetX;
      this.mouseOffsetY = event.offsetY;

      /* https://qr.ae/pvm1Md */
      let slope = (this.mouseOffsetY - this.y - this.rightArmRotationCenterY) /
        (this.mouseOffsetX - this.x - this.rightArmRotationCenterX);

      this.rightArmRadian = Math.atan(slope);
    
      if(this.mouseOffsetX < this.x + this.rightArmRotationCenterX) {
        let buf = this.utility.radiansToDegrees(this.rightArmRadian);
        this.rightArmRadian = this.utility.degreesToRadians(-90 + (-90 + buf));
      }
    });

    for(let key in this.images) {
      this.imagesRequired++;

      this.images[key].addEventListener('load', () => {
        this.imagesLoaded++;

        if(this.imagesLoaded >= this.imagesRequired)
          this.imagesReady = true;

        this.width = this.images[key].naturalWidth;
        this.height = this.images[key].naturalHeight;

        this.maxX = this.canvas.width - this.width;
        this.maxY = this.canvas.height - this.height;
        this.y = this.maxY;
      });

      this.images[key].addEventListener('error', () => {
        console.error(`Unable to load image ${key}`);
      })

      this.images[key].src = `resources/player/${key}.png`;
    }

    window.addEventListener('mouseup', () => {
      this.isShooting = false;
    });

    window.addEventListener('keydown', (event) => {
      this.pressedKeys.add(event.key);
    });

    window.addEventListener('keyup', (event) => {
      this.pressedKeys.delete(event.key);
    });
  }

  moveLimbs() {
    for(let limb of ['rightLeg', 'leftLeg', 'leftArm']) {
      if(this[`${limb}Direction`] === -1) {
        this[`${limb}Radian`] -= this.utility.degreesToRadians(1);
        if(this.utility.radiansToDegrees(this[`${limb}Radian`]) < -20)
          this[`${limb}Direction`] = 1;
      } else {
        this[`${limb}Radian`] += this.utility.degreesToRadians(1);
        if(this.utility.radiansToDegrees(this[`${limb}Radian`]) > 20)
          this[`${limb}Direction`] = -1;
      }
    }
  }

  logic() {
    this.x = this.pressedKeys.has('a') ? this.x - this.speed : this.x;
    this.x = this.pressedKeys.has('d') ? this.x + this.speed : this.x;

    if(
        (this.pressedKeys.has('a') || this.pressedKeys.has('d')) &&
        !(this.pressedKeys.has('a') && this.pressedKeys.has('d'))
      )
      this.moveLimbs();

    this.jumpCooldown--;

    if(this.jumpCooldown > 20)
      this.y -= (10 - 50 / this.jumpCooldown);
    else if(this.jumpCooldown <= 15)
      this.y += 10;

    if(this.pressedKeys.has('w') && this.jumpCooldown <= 0)
      this.jumpCooldown = 40;

    
    this.attackCooldown--;

    if(this.isShooting && this.attackCooldown <= 0) {
      this.attackCooldown = 20;
      this.master.request('createEntity', {
        kind: 'bullet',
        canvas: this.canvas,
        x: this.gunEdgeX,
        y: this.gunEdgeY,
        destinationX: this.mouseOffsetX,
        destinationY: this.mouseOffsetY,
      });

      this.gunSFX.cloneNode().play();
    }

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(Math.max(this.y, 0), this.maxY);

    this.gunEdgeX = this.x + this.gunEdgeXBase;
    this.gunEdgeY = this.y + this.gunEdgeYBase;
  }

  draw() {
    if(this.imagesReady) {

      this.drawLimbs(['leftArm', 'leftLeg', 'rightLeg']);

      this.canvas.context.drawImage(this.images.body, this.x, this.y);
      this.canvas.context.drawImage(this.images.head, this.x, this.y);

      this.drawLimbs(['rightArm']);

      this.canvas.context.strokeStyle = 'green';
      this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  drawLimbs(namesArray) {
    for(let limb of namesArray) {
      this.canvas.context.save();

      this.canvas.context.translate(this.x + this[`${limb}RotationCenterX`],
        this.y + this[`${limb}RotationCenterY`]);
  
      this.canvas.context.rotate(this[`${limb}Radian`]);
  
      this.canvas.context.translate(-this.x - this[`${limb}RotationCenterX`],
        -this.y - this[`${limb}RotationCenterY`]);
  
      if(limb === 'rightArm')
        this.canvas.context.drawImage(this.images.gun, this.x, this.y);

      this.canvas.context.drawImage(this.images[limb], this.x, this.y);
  
      this.canvas.context.restore();
    }
  }

}

