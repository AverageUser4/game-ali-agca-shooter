import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';
import Platform from './Platform.js';

class Entities {

  players = [];
  enemies = [];
  bullets = [];
  platforms = [];

  createEntity(data) {
    switch(data.kind) {
      case 'player':
        this.players.push(new Player(data));
        break;

      case 'enemy':
        this.enemies.push(new Enemy(data));
        break;

      case 'bullet':
        this.bullets.push(new Bullet(data));
        break;

      case 'platform':
        this.platforms.push(new Platform(data));
        break;

      default:
        console.error('Unknown entity kind.');
    }
  }

  logic() {
    for(let entity of [...this.platforms, ...this.players, ...this.enemies, ...this.bullets])
      entity.logic({
        players: this.players,
        enemies: this.enemies,
        bullets: this.bullets,
        platforms: this.platforms,
      });

    for(let i = 0; i < this.enemies.length; i++)
      if(this.enemies[i].removeFromGame) {
        this.enemies.splice(i, 1);
        break;
      }

    for(let i = 0; i < this.bullets.length; i++)
      if(this.bullets[i].removeFromGame) {
        this.bullets.splice(i, 1);
        break;
      }
  }

  draw() {
    for(let entity of [...this.platforms, ...this.bullets, ...this.enemies, ...this.players])
      entity.draw();
  }

}

export default new Entities();
