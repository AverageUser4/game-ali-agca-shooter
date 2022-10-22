export default class Bullet {

  x;
  y;
  speedX;
  speedY;
  radius = 5;
  speedBase = 20;

  removeFromGame = false;

  constructor(data) {
    this.canvas = data.canvas;

    this.x = data.x;
    this.y = data.y;

    const distanceX = Math.abs(data.x - data.destinationX);
    const distanceY = Math.abs(data.y - data.destinationY);

    let proportionX = 1;
    let proportionY = 1;

    if(distanceX > distanceY)
      proportionY = distanceY / distanceX;
    else
      proportionX = distanceX / distanceY;

    if(data.destinationX < data.x)
      proportionX *= -1;
    if(data.destinationY < data.y)
      proportionY *= -1;

    this.speedX = this.speedBase * proportionX;
    this.speedY = this.speedBase * proportionY;
  }

  logic() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.removeFromGame = this.x > this.canvas.width || this.x < 0 ||
      this.y > this.canvas.height || this.y < 0;
  }

  draw() {
    this.canvas.context.fillStyle = 'yellow';
    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.context.fill();
  }

}