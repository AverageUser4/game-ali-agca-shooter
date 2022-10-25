import Bullet from './Bullet.js';

export default class Player {

  set x(value) {
    this._x = value;
    this.hitboxX = value;
    if(this.directionX === -1)
      this.hitboxX += (this.width - this.hitboxWidth);
  }
  get x() {
    return this._x;
  }
  _x = 0;
  y = 0;
  maxX;
  maxY;
  width = 120;
  height = 219;
  speed = 7;
  health = 100;

  hitboxX = 0;
  hitboxWidth = 70;

  directionX = 1;

  isShooting = false;
  attackCooldown = 0;
  
  jumpCooldown = 0;
  maxJumpCooldown = 30;
  jumpForce = 10;
  jumpedTwice = false;
  canJump = true;
  
  pressedKeys = new Set();
  mouseOffsetX;
  mouseOffsetY;

  gunSFX;
  jumpSFX;
  images;

  rightArmRotationCenterX = 20;
  rightArmRotationCenterY = 72;
  rightArmRadian = 0;
  rightArmRadius = 100;

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
    this.resources = data.resources;

    this.gunSFX = this.resources.getResource('browning');
    this.jumpSFX = this.resources.getResource('jump');
  
    this.images = {
      body: this.resources.getResource('playerBody'),
      gun: this.resources.getResource('playerGun'),
      head: this.resources.getResource('playerHead'),
      leftArm: this.resources.getResource('playerLeftArm'),
      leftLeg: this.resources.getResource('playerLeftLeg'),
      rightArm: this.resources.getResource('playerRightArm'),
      rightLeg: this.resources.getResource('playerRightLeg'),
    }

    this.maxX = this.canvas.width - this.width;
    this.maxY = this.canvas.height - this.height;
    this.y = this.maxY;

    this.canvas.element.addEventListener('mousedown', () => {
      this.isShooting = true;
    });
    
    this.canvas.element.addEventListener('mousemove', (event) => {
      this.mouseOffsetX = event.offsetX;
      this.mouseOffsetY = event.offsetY;

      this.updateRightArmRadian();
    });

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

  updateRightArmRadian() {
    /*! https://qr.ae/pvm1Md */
    let slope = (this.mouseOffsetY - this.y - this.rightArmRotationCenterY) /
      (this.mouseOffsetX - this.x - this.rightArmRotationCenterX);

    this.rightArmRadian = Math.atan(slope);
  
    if(this.mouseOffsetX < this.x + this.rightArmRotationCenterX) {
      let buf = this.utility.radiansToDegrees(this.rightArmRadian);
      this.rightArmRadian = this.utility.degreesToRadians(-90 + (-90 + buf));
    }
  }

  moveLimbs() {
    const limbSpeed = 3;
    for(let limb of ['rightLeg', 'leftLeg', 'leftArm']) {
      if(this[`${limb}Direction`] === -1) {
        this[`${limb}Radian`] -= this.utility.degreesToRadians(limbSpeed);
        if(this.utility.radiansToDegrees(this[`${limb}Radian`]) < -20)
          this[`${limb}Direction`] = 1;
      } else {
        this[`${limb}Radian`] += this.utility.degreesToRadians(limbSpeed);
        if(this.utility.radiansToDegrees(this[`${limb}Radian`]) > 20)
          this[`${limb}Direction`] = -1;
      }
    }
  }

  movementLogic(entities) {
    this.x = this.pressedKeys.has('a') ? this.x - this.speed : this.x;
    this.x = this.pressedKeys.has('d') ? this.x + this.speed : this.x;

    if(
        (this.pressedKeys.has('a') || this.pressedKeys.has('d')) &&
        !(this.pressedKeys.has('a') && this.pressedKeys.has('d'))
      )
      this.moveLimbs();


    this.jumpCooldown--;

    if(this.pressedKeys.has('w') && this.canJump) {
      this.jumpCooldown = this.maxJumpCooldown;
      this.jumpSFX.cloneNode().play();
      this.jumpedTwice = false;
      this.canJump = false;
    }

    if(this.jumpCooldown > this.maxJumpCooldown / 2)
      this.y -= this.jumpForce;
    else if(this.jumpCooldown > this.maxJumpCooldown / 4) {
      if(!this.jumpedTwice && this.pressedKeys.has('w')) {
        this.jumpCooldown = this.maxJumpCooldown;
        this.jumpedTwice = true;
        this.jumpSFX.cloneNode().play();
      }
    }
    else
      this.y += this.jumpForce;

    if(this.y >= this.maxY)
      this.canJump = true;

    for(let platform of entities.platforms) {
      if(
          !platform.collidable ||
          this.hitboxX + this.hitboxWidth < platform.x ||
          this.hitboxX > platform.x2 ||
          this.y + this.height < platform.y ||
          this.y + this.height > platform.y2
        )
        continue;

        if(this.pressedKeys.has('s'))
          platform.makeNonCollidable(10);

        if(this.jumpCooldown <= this.maxJumpCooldown / 4) {
          this.y = platform.y - this.height;
          this.canJump = true;
        }
    }

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(this.y, this.maxY);

    if(this.mouseOffsetX < this.x + this.width / 2)
      this.directionX = -1;
    else
      this.directionX = 1;

    if(this.directionX === -1)
      this.rightArmRotationCenterX = this.width - 20;
    else
      this.rightArmRotationCenterX = 20;

    this.updateRightArmRadian();
  }

  attackLogic() {
    this.attackCooldown--;

    if(this.isShooting && this.attackCooldown <= 0) {
      /*! https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle */
      const gunPointAdjustment = this.directionX === 1 ? this.utility.degreesToRadians(8) : this.utility.degreesToRadians(-10);
      const sx = this.rightArmRadius * Math.cos(this.rightArmRadian - gunPointAdjustment);
      const sy = this.rightArmRadius * Math.sin(this.rightArmRadian - gunPointAdjustment);

      this.master.request('createEntity', {
        kind: 'bullet',
        canvas: this.canvas,
        x: this.x + this.rightArmRotationCenterX + sx,
        y: this.y + this.rightArmRotationCenterY + sy,
        destinationX: this.mouseOffsetX,
        destinationY: this.mouseOffsetY,
      });

      this.gunSFX.cloneNode().play();
      this.attackCooldown = 20;
    }
  }

  logic(entities) {
    this.movementLogic(entities);
    this.attackLogic();
  }

  draw() {
    this.drawLimbs(['leftArm', 'leftLeg', 'rightLeg']);

    if(this.directionX === -1) {
      this.utility.mirrorImage(this.canvas, this.images.body, this.x, this.y, true);
      this.utility.mirrorImage(this.canvas, this.images.head, this.x, this.y, true);
    }
    else {
      this.canvas.context.drawImage(this.images.body, this.x, this.y);
      this.canvas.context.drawImage(this.images.head, this.x, this.y);
    }

    this.drawLimbs(['rightArm']);

    this.canvas.context.strokeStyle = 'green';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    this.canvas.context.strokeStyle = 'blue';
    this.canvas.context.strokeRect(this.hitboxX, this.y, this.hitboxWidth, this.height);

    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x + this.rightArmRotationCenterX, this.y + this.rightArmRotationCenterY, 100, 0, 2 * Math.PI);
    const sx = this.rightArmRadius * Math.cos(this.rightArmRadian);
    const sy = this.rightArmRadius * Math.sin(this.rightArmRadian);
    this.canvas.context.moveTo(this.x + this.rightArmRotationCenterX, this.y + this.rightArmRotationCenterY);
    this.canvas.context.lineTo(this.x + this.rightArmRotationCenterX + sx, this.y + this.rightArmRotationCenterY + sy);
    this.canvas.context.lineTo(this.mouseOffsetX, this.mouseOffsetY);
    this.canvas.context.stroke();
  }

  drawLimbs(namesArray) {
    for(let limb of namesArray) {
      this.canvas.context.save();

      let rcx = this.x + this[`${limb}RotationCenterX`];
      let rcy = this.y + this[`${limb}RotationCenterY`];

      // right arm has rotationCenterX changed in logic
      if(this.directionX === -1 && limb !== 'rightArm')
        rcx = this.x + this.width - this[`${limb}RotationCenterX`];

      this.canvas.context.translate(rcx, rcy);

      this.canvas.context.rotate(this[`${limb}Radian`]);

      this.canvas.context.translate(-rcx, -rcy);
  
      if(this.directionX === -1) {
        if(limb === 'rightArm') {
          this.canvas.context.scale(1, -1);
          this.canvas.context.drawImage(this.images.gun, this.x + this.rightArmRotationCenterX - (this.width - this.rightArmRotationCenterX), -this.y - this.height + this.rightArmRotationCenterY);
          this.canvas.context.drawImage(this.images[limb], this.x + this.rightArmRotationCenterX - (this.width - this.rightArmRotationCenterX), -this.y - this.height + this.rightArmRotationCenterY);
        } else {
          this.canvas.context.scale(-1, 1);
          this.canvas.context.drawImage(this.images[limb], -this.x - this.width, this.y);
        }
      } else {
        if(limb === 'rightArm')
          this.canvas.context.drawImage(this.images.gun, this.x, this.y);
        this.canvas.context.drawImage(this.images[limb], this.x, this.y);
      }
  
      this.canvas.context.restore();
    }
  }

}

