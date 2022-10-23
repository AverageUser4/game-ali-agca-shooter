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

  shooting = false;
  attackCooldown = 0;

  jumpCooldown = 0;
  isJumping = false;
  
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

  constructor(data) {
    this.canvas = data.canvas;
    this.master = data.master;

    this.canvas.element.addEventListener('mousedown', () => {
      this.shooting = true;
    });
    
    this.canvas.element.addEventListener('mousemove', (event) => {
      this.mouseOffsetX = event.offsetX;
      this.mouseOffsetY = event.offsetY;
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
      this.shooting = false;
    });

    window.addEventListener('keydown', (event) => {
      this.pressedKeys.add(event.key);
    });

    window.addEventListener('keyup', (event) => {
      this.pressedKeys.delete(event.key);
    });
  }

  logic() {
    this.x = this.pressedKeys.has('a') ? this.x - this.speed : this.x;
    this.x = this.pressedKeys.has('d') ? this.x + this.speed : this.x;

    this.jumpCooldown--;

    if(this.jumpCooldown > 10)
      this.y -= 2;
    else
      this.y += 4;

    if(this.pressedKeys.has('w') && this.jumpCooldown <= 0)
      this.jumpCooldown = 20;

    
    this.attackCooldown--;

    if(this.shooting && this.attackCooldown <= 0) {
      this.attackCooldown = 20;
      this.master.request('createEntity', {
        kind: 'bullet',
        canvas: this.canvas,
        x: this.x + this.width,
        y: this.y + this.height * 0.25,
        destinationX: this.mouseOffsetX,
        destinationY: this.mouseOffsetY,
      });

      this.gunSFX.cloneNode().play();
    }

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(Math.max(this.y, 0), this.maxY);
  }

  draw() {
    if(this.imagesReady) {
      this.canvas.context.drawImage(this.images.leftArm, this.x, this.y);
      this.canvas.context.drawImage(this.images.leftLeg, this.x, this.y);
      this.canvas.context.drawImage(this.images.rightLeg, this.x, this.y);
      this.canvas.context.drawImage(this.images.body, this.x, this.y);
      this.canvas.context.drawImage(this.images.head, this.x, this.y);
      this.canvas.context.drawImage(this.images.gun, this.x, this.y);
      this.canvas.context.drawImage(this.images.rightArm, this.x, this.y);

      this.canvas.context.strokeStyle = 'green';
      this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

}

