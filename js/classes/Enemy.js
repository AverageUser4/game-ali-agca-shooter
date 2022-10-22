export default class Enemy {

  x = 280;
  y = 100;
  width;
  heigth;
  maxX;
  maxY;

  movementChangeCounter = 0;
  directionX = 0;
  directionY = 0;
  speedX = 0;
  speedY = 0;

  canvas;
  image;
  imageReady = false;

  constructor(data) {
    this.canvas = data.canvas;
    this.utility = data.utility;

    this.image = new Image();

    this.image.addEventListener('load', () => {
      this.imageReady = true;
      
      this.width = this.image.naturalWidth;
      this.height = this.image.naturalHeight;

      this.maxX = this.canvas.width - this.width;
      this.maxY = this.canvas.height * 0.5;
    });

    this.image.src = 'resources/pope.png';
  }

  logic() {
    this.movementChangeCounter--;

    if(this.movementChangeCounter <= 0) {
      this.directionX = this.utility.randomInteger(0, 1, true);
      this.directionY = this.utility.randomInteger(0, 1, true);

      this.speedX = this.utility.randomInteger(2, 10) * this.directionX;
      this.speedY = this.utility.randomInteger(2, 10) * this.directionY;

      this.movementChangeCounter = this.utility.randomInteger(10, 30);
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.x = Math.min(Math.max(this.x, 0), this.maxX);
    this.y = Math.min(Math.max(this.y, 0), this.maxY);
  }

  draw() {
    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.strokeRect(this.x, this.y, this.width, this.height);

    if(!this.imageReady) 
      return;

    if(this.directionX >= 0)
      this.canvas.context.drawImage(this.image, this.x, this.y);
    else
      this.utility.mirrorImage(this.canvas, this.image, this.x, this.y, true);
  }

}