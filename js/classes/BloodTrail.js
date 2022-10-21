const bloodTrails = new Map();

class BloodTrail {

  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = randomInteger(1, 8);
  }

  move() {
    this.y += 10;

    this.draw();

    if(this.y > canvasHeight)
      this.die();
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, 3, this.size);
  }

  die() {
    bloodTrails.delete(this.id);
  }

}