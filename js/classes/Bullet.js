export default class Bullet {

  x;
  y;
  speedX;
  speedY;
  radius = 3;
  speedBase = 20;

  owner;

  removeFromGame = false;

  constructor(data) {
    this.canvas = data.canvas;
    this.owner = data.owner;

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

  isColliding(x, y, w, h) {
    const x2 = x + w;
    const y2 = y + h;

    if(
        this.x + this.radius < x ||
        this.x > x2 ||
        this.y + this.radius < y ||
        this.y > y2
      )
        return false;

    this.x = 99999;
    this.y = 99999;
    return true;
  }

  logic(entities) {
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.owner === 'enemy' && this.isColliding(entities.players[0].hitboxX, entities.players[0].y, entities.players[0].hitboxWidth, entities.players[0].height))
      entities.players[0].getDamaged();
    else if(this.owner === 'player' && this.isColliding(entities.enemies[0].x, entities.enemies[0].y, entities.enemies[0].width, entities.enemies[0].height))
      entities.enemies[0].getDamaged();

    this.removeFromGame = this.x > this.canvas.width || this.x < 0 ||
      this.y > this.canvas.height || this.y < 0;
  }

  draw() {
    this.canvas.context.fillStyle = '#E1B300';
    this.canvas.context.strokeStyle = 'black';

    this.canvas.context.beginPath();
    this.canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.context.fill();
    this.canvas.context.stroke();
  }

}