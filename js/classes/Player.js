export default class Player {

  set x(value) {
    this._x = value;

    this.hitboxX = value;
    if(this.directionX === -1)
      this.hitboxX += (this.width - this.hitboxWidth);

    for(let limb of ['rightArm', 'leftArm', 'rightLeg', 'leftLeg']) {
      if(this.directionX === 1)
        this[limb].rotationCenter.x = value + this[limb].rotationCenterBase.x;
      else
        this[limb].rotationCenter.x = value + this.width - this[limb].rotationCenterBase.x;
    }
  }
  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;

    for(let limb of ['rightArm', 'leftArm', 'rightLeg', 'leftLeg'])
      this[limb].rotationCenter.y = value + this[limb].rotationCenterBase.y;
  }
  get y() {
    return this._y;
  }

  _x = 200;
  _y = 0;

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
  maxAttackCooldown = 20;
  
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

  rightArm = {
    rotationCenterBase: { x: 20, y: 72 },
    rotationCenter: { x: 20, y: 72 },
    radian: 0,
    radius: 100,
  };

  rightLeg = {
    rotationCenterBase: { x: 35, y: 130 },
    rotationCenter: { x: 35, y: 130 },
    radian: 0,
    direction: -1,
  };

  leftLeg = {
    rotationCenterBase: { x: 22, y: 130 },
    rotationCenter: { x: 22, y: 130 },
    radian: 0,
    direction: 1,
  };

  leftArm = {
    rotationCenterBase: { x: 30, y: 72 },
    rotationCenter: { x: 30, y: 72 },
    radian: 0,
    direction: 1,
  };

  constructor(data) {
    this.canvas = data.canvas;
    this.master = data.master;
    this.utility = data.utility;
    this.resources = data.resources;

    this.gunSFX = this.resources.getResource('browning');
    this.jumpSFX = this.resources.getResource('jump');
  
    this.images = {
      bodyAndHead: this.resources.getResource('playerBodyAndHead'),
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
    let slope = (this.mouseOffsetY - this.rightArm.rotationCenter.y) /
      (this.mouseOffsetX - this.rightArm.rotationCenter.x);

    this.rightArm.radian = Math.atan(slope);
  
    if(this.mouseOffsetX < this.rightArm.rotationCenter.x)
      this.rightArm.radian = 2 * this.utility.RADIAN * -90 + this.rightArm.radian;
  }

  moveLimbs() {
    const limbSpeed = 3;
    const minRadian = -20 * this.utility.RADIAN;
    const maxRadian = 20 * this.utility.RADIAN;

    for(let limb of ['rightLeg', 'leftLeg', 'leftArm']) {
      if(this[limb].direction === -1) {
        this[limb].radian -= this.utility.RADIAN * limbSpeed;
        if(this[limb].radian < minRadian)
          this[limb].direction = 1;
      } else {
        this[limb].radian += this.utility.RADIAN * limbSpeed;
        if(this[limb].radian > maxRadian)
          this[limb].direction = -1;
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

    this.updateRightArmRadian();
  }

  attackLogic() {
    this.attackCooldown--;

    if(this.isShooting && this.attackCooldown <= 0) {
      /*! https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle */
      const gunPointAdjustment = this.directionX === 1 ? this.utility.RADIAN * 8 : this.utility.RADIAN * -10;
      const sx = this.rightArm.radius * Math.cos(this.rightArm.radian - gunPointAdjustment);
      const sy = this.rightArm.radius * Math.sin(this.rightArm.radian - gunPointAdjustment);

      this.master.request('createEntity', {
        kind: 'bullet',
        canvas: this.canvas,
        x: this.rightArm.rotationCenter.x + sx,
        y: this.rightArm.rotationCenter.y + sy,
        destinationX: this.mouseOffsetX,
        destinationY: this.mouseOffsetY,
      });

      this.gunSFX.cloneNode().play();
      this.attackCooldown = this.maxAttackCooldown;
    }
  }

  logic(entities) {
    this.movementLogic(entities);
    this.attackLogic();
  }

  draw() {
    this.drawLimbs(['leftArm', 'leftLeg', 'rightLeg']);

    if(this.directionX === -1)
      this.utility.mirrorImage(this.canvas, this.images.bodyAndHead, this.x, this.y, true);
    else
      this.canvas.context.drawImage(this.images.bodyAndHead, this.x, this.y);

    this.drawLimbs(['rightArm']);

    this.canvas.context.strokeStyle = 'green';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    this.canvas.context.strokeStyle = 'blue';
    this.canvas.context.strokeRect(this.hitboxX, this.y, this.hitboxWidth, this.height);

    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.rightArm.rotationCenter.x, this.rightArm.rotationCenter.y, this.rightArm.radius, 0, 2 * Math.PI);
    const sx = this.rightArm.radius * Math.cos(this.rightArm.radian);
    const sy = this.rightArm.radius * Math.sin(this.rightArm.radian);
    this.canvas.context.moveTo(this.rightArm.rotationCenter.x, this.rightArm.rotationCenter.y);
    this.canvas.context.lineTo(this.rightArm.rotationCenter.x + sx, this.rightArm.rotationCenter.y + sy);
    this.canvas.context.lineTo(this.mouseOffsetX, this.mouseOffsetY);
    this.canvas.context.stroke();
  }

  drawLimbs(limbNames) {
    for(let limb of limbNames) {
      this.canvas.context.save();

      let rcx = this[limb].rotationCenter.x;
      let rcy = this[limb].rotationCenter.y;

      // right arm has rotationCenter.x changed in logic
      // if(this.directionX === -1 && limb !== 'rightArm')
      //   rcx = this.x + this.width - this[limb].rotationCenter.x;

      this.canvas.context.translate(rcx, rcy);
      this.canvas.context.rotate(this[limb].radian);
      this.canvas.context.translate(-rcx, -rcy);
  
      if(this.directionX === -1) {
        if(limb === 'rightArm') {
          this.canvas.context.scale(1, -1);
          this.canvas.context.drawImage(this.images[limb], this.x + 80, // 80????
            -this.y - this.height + this.rightArm.rotationCenterBase.y + 3); // 3???
        } else {
          this.canvas.context.scale(-1, 1);
          this.canvas.context.drawImage(this.images[limb], -this.x - this.width, this.y);
        }
      } else {
        this.canvas.context.drawImage(this.images[limb], this.x, this.y);
      }
  
      this.canvas.context.restore();
    }
  }

}

