export default class Enemy {

  x = 280;
  y = 100;
  width;
  height;

  canvas;
  image;
  imageReady = false;

  constructor(dependencies) {
    this.canvas = dependencies.canvas;

    this.image = new Image();
    this.image.src = 'resources/papiez.png';
    this.image.addEventListener('load', () => this.imageReady = true);
  }

  logic() {
    
  }

  draw() {
    if(this.imageReady)
      this.canvas.context.drawImage(this.image, 280, 100);
  }

}