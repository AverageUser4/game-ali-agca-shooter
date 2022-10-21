import canvas from './classes/Canvas.js';
import utility from './classes/Utility.js';
import Player from './classes/Player.js';
import Enemy from './classes/Enemy.js';

class Main {

  constructor() {
    this.canvas = canvas;
    this.utility = utility;
    this.player = new Player({ canvas });
    this.enemy = new Enemy({ canvas });

    setInterval(() => this.gameLoop(), 33);
  }

  request(what) {
    switch(what) {
      default:
        console.error('Requested unknown action.');
    }
  }

  gameLoop() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.logic();
    this.enemy.logic();

    this.player.draw();
    this.enemy.draw();
  }

}

const main = new Main();