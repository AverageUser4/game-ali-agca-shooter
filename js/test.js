'use strict';
const cl = (...x) => x.forEach((x) => console.log(x));

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const pressedKeys = new Set();

const w = 800;
const h = 600;
let x = 300;
let y = 385;
let speed = 10;

let offsetX = 0;
let offsetY = 0;
let shootingArmRadian = 0;


const bg = new Image();
bg.src = 'bg.jpg';




window.addEventListener('keydown', (event) => {
  pressedKeys.add(event.key);
});
window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.key);
});


const images = document.querySelectorAll('img');

context.strokeStyle = 'red';
context.fillStyle = 'green';

function gameLoop() {
  if(pressedKeys.has('a'))
    x -= speed;
  if(pressedKeys.has('d'))
    x += speed;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bg, 0, 0);

  for(let image of images) {
    if(
        image.src !== 'http://localhost/something/rightArm.png' &&
        image.src !== 'http://localhost/something/gun.png' 
      )
      context.drawImage(image, x, y);
    else {
      context.save();
      context.translate(x + cx, y + cy);
      context.rotate(shootingArmRadian);
      context.translate(-x -cx, -y - cy);
      context.drawImage(image, x, y);
      context.restore();
    }
  }

  setTimeout(gameLoop, 33);
}

gameLoop();


// const canvas = document.querySelector('canvas');
// const context = canvas.getContext('2d');

// const pressedKeys = new Set();

// const w = 800;
// const h = 600;
// let x = 300;
// let y = 300;

// const bg = new Image();
// bg.src = 'bg.jpg';

// let rotation = 0;
// let rotationAmount = degreesToRadians(1);

// function degreesToRadians(degrees) {
//   return Math.PI * degrees / 180;
// }

// function radiansToDegrees(radians) {
//   return radians * 180 / Math.PI;
// }

// window.addEventListener('keydown', (event) => {
//   pressedKeys.add(event.key);
// });
// window.addEventListener('keyup', (event) => {
//   pressedKeys.delete(event.key);
// });

// const armImage = document.querySelector('[src="rightArm.png"]');

// function gameLoop() {
//   if(pressedKeys.has('a'))
//     rotation -= rotationAmount;
//   if(pressedKeys.has('d'))
//     rotation += rotationAmount;

//   context.clearRect(0, 0, canvas.width, canvas.height);
//   context.drawImage(bg, 0, 0);

//   context.save();

//   console.log(x, y)
//   // 120x219
//   let cx = 25;
//   let cy = 72;

//   context.translate(x + cx, y + cy);
//   context.rotate(rotation);
//   context.translate(-x - cx, -y - cy);
//   context.drawImage(armImage, x, y);

//   context.restore();

//   setTimeout(gameLoop, 33);
// }

// gameLoop();
