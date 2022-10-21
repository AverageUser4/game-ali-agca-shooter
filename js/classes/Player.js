import Bullet from './Bullet.js';

export default class Player {

  x = 0;
  y;
  maxX;
  maxY;
  width = 25;
  height = 45;
  speed = 5;
  health = 100;

  shooting = false;
  pressedKeys = new Set();
  shootCooldown = 0;

  bullets = [];

  mouseOffsetX;
  mouseOffsetY;

  machineGunSFX = new Audio('resources/machine-gun-sfx.mp3');;

  constructor(dependencies) {
    this.canvas = dependencies.canvas;

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
    // this.y = this.pressedKeys.has('w') ? this.y - this.speed : this.y;
    // this.y = this.pressedKeys.has('s') ? this.y + this.speed : this.y;

    this.shootCooldown--;

    if(this.shooting && this.shootCooldown <= 0) {
      this.shootCooldown = 20;
      this.bullets.push(new Bullet({ canvas: this.canvas }, this.x, this.y, this.mouseOffsetX, this.mouseOffsetY))
    }

    for(let bullet of this.bullets)
      bullet.logic();

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(Math.max(this.y, 0), this.maxY);
  }

  draw() {
    this.canvas.context.fillStyle = 'green';
    this.canvas.context.fillRect(this.x, this.y, this.width, this.height);

    for(let bullet of this.bullets)
      bullet.draw();
  }

}