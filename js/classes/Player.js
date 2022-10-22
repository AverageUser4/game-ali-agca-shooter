import Bullet from './Bullet.js';

export default class Player {

  x = 0;
  y;
  maxX;
  maxY;
  width = 25;
  height = 45;
  speed = 7;
  health = 100;

  shooting = false;
  attackCooldown = 0;

  jumpCooldown = 0;
  isJumping = false;
  
  pressedKeys = new Set();
  mouseOffsetX;
  mouseOffsetY;

  gunSFX = new Audio('resources/gunshot.mp3');;

  constructor(data) {
    this.canvas = data.canvas;
    this.master = data.master;

    this.maxX = this.canvas.width - this.width;
    this.maxY = this.canvas.height - this.height;
    this.y = this.maxY;

    this.canvas.element.addEventListener('mousedown', () => {
      this.shooting = true;
    });
    
    this.canvas.element.addEventListener('mousemove', (event) => {
      this.mouseOffsetX = event.offsetX;
      this.mouseOffsetY = event.offsetY;
    });

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
        x: this.x,
        y: this.y,
        destinationX: this.mouseOffsetX,
        destinationY: this.mouseOffsetY,
      });

      this.gunSFX.cloneNode().play();
    }

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(Math.max(this.y, 0), this.maxY);
  }

  draw() {
    this.canvas.context.fillStyle = 'green';
    this.canvas.context.fillRect(this.x, this.y, this.width, this.height);
  }

}