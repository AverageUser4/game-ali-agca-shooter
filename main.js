const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 800;
const canvasHeight = 600;

let shooting = false;
let offsetX;
let offsetY;

const machineGunSFX = new Audio('machine-gun-sfx.mp3');

const enemyImage = new Image();

enemyImage.addEventListener('load', () => {
  ctx.drawImage(enemyImage, 280, 100);
});

enemyImage.src = 'papiez.png';

function cleanCanvasUp() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(enemyImage, 280, 100);
}

function randomInteger(min = 0, max = 100, negative = false) {

  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  return negative && randomInteger(0, 1) ? -random : random;
}

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

canvas.addEventListener('mousedown', () => {
  shooting = true;
});

window.addEventListener('mouseup', () => {
  shooting = false;
});

canvas.addEventListener('mousemove', (event) => {
  offsetX = event.offsetX;
  offsetY = event.offsetY;
});

let counter = 0;

setInterval(() => {
  counter++;
  if(counter > 5) {
    counter = 0;
    cleanCanvasUp();
  }

  for(let trail of bloodTrails) {
    trail[0].move();
  }

  machineGunSFX.pause();

  if(!shooting)
    return;

  machineGunSFX.play();

  const x = offsetX + randomInteger(0, 20, true);
  const y = offsetY + randomInteger(0, 20, true);

  bloodTrails.set(new BloodTrail(randomInteger(0, 99999999, true), x, y))

  ctx.fillStyle = 'yellow';
  ctx.fillRect(x, y, 3, 3);
}, 33)

