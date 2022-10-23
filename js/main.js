import canvas from './classes/Canvas.js';
import entities from './classes/Entities.js';
import utility from './classes/Utility.js';

class Main {

  canvas;
  entities;
  utility;

  backgroundImage;
  backgroundReady = false;

  constructor(data) {
    this.canvas = data.canvas;
    this.entities = data.entities;
    this.utility = data.utility;

    this.backgroundImage = new Image();
    this.backgroundImage.addEventListener('load', () => this.backgroundReady = true);
    this.backgroundImage.src = 'resources/bazylika.jpg';

    this.entities.createEntity({ 
      kind: 'player',
      canvas: this.canvas,
      master: this,
    });

    this.entities.createEntity({ 
      kind: 'enemy',
      canvas: this.canvas,
      utility: this.utility
    });

    setInterval(() => this.gameLoop(), 33);
  }

  request(what, data) {
    switch(what) {
      case 'createEntity':
        this.entities.createEntity(data)
        break;

      default:
        console.error('Requested unknown action.');
    }
  }

  gameLoop() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.entities.logic();

    if(this.backgroundReady)
      this.canvas.context.drawImage(this.backgroundImage, 0, 0);

    this.entities.draw();
  }

}

const main = new Main({ canvas, entities, utility });