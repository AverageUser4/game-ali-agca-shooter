import canvas from './classes/Canvas.js';
import entities from './classes/Entities.js';
import utility from './classes/Utility.js';
import resources from './classes/Resources.js';

class Main {

  canvas;
  entities;
  utility;

  backgroundMusic;

  constructor(data) {
    this.canvas = data.canvas;
    this.entities = data.entities;
    this.utility = data.utility;
    this.resources = data.resources;

    this.backgroundMusic = new Audio('audio/music.mp3');
    this.backgroundMusic.addEventListener('loadeddata', () => {
      window.addEventListener('mousemove', () => {
        this.backgroundMusic.play();
      });
    });

    // this.resources.loadResource('images/pope.png', 'pope');

    this.resources.loadResource('images/papamobile/arm.png', 'papamobileArm');
    this.resources.loadResource('images/papamobile/bodyAndHead.png', 'papamobileBodyAndHead');
    this.resources.loadResource('images/papamobile/leftWheel.png', 'papamobileLeftWheel');
    this.resources.loadResource('images/papamobile/rightWheel.png', 'papamobileRightWheel');
    this.resources.loadResource('images/papamobile/vehicle.png', 'papamobileVehicle');

    this.resources.loadResource('images/player/bodyAndHead.png', 'playerBodyAndHead');
    this.resources.loadResource('images/player/leftArm.png', 'playerLeftArm');
    this.resources.loadResource('images/player/leftLeg.png', 'playerLeftLeg');
    this.resources.loadResource('images/player/rightArm.png', 'playerRightArm');
    this.resources.loadResource('images/player/rightLeg.png', 'playerRightLeg');

    this.resources.loadResource('audio/browning.mp3', 'browning', 'audio');
    this.resources.loadResource('audio/jump.mp3', 'jump', 'audio');


    this.entities.createEntity({ 
      kind: 'player',
      canvas: this.canvas,
      master: this,
      utility: this.utility,
      resources: this.resources,
    });

    this.entities.createEntity({ 
      kind: 'enemy',
      canvas: this.canvas,
      utility: this.utility,
      resources: this.resources,
      master: this,
    });

    this.entities.createEntity({
      kind: 'platform',
      canvas: this.canvas,
      utility: this.utility,
      coordinates: {
        x: 0,
        y: 580,
        width: 230,
        height: 40,
      }
    });

    this.entities.createEntity({
      kind: 'platform',
      canvas: this.canvas,
      utility: this.utility,
      coordinates: {
        x: 420,
        y: 350,
        width: 350,
        height: 40,
      }
    });

    this.entities.createEntity({
      kind: 'platform',
      canvas: this.canvas,
      utility: this.utility,
      coordinates: {
        x: 1050,
        y: 530,
        width: 230,
        height: 40,
      }
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
    this.entities.logic();

    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.entities.draw();
  }

}

const main = new Main({ canvas, entities, utility, resources });