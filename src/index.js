// Modules
import { Game } from "phaser";

// Scenes
import PreloadScene from "scenes/preload";
import GameScene from "scenes/game";
import GameOverScene from "scenes/gameover";

// Declare configuration
const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scale: {
    //mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 340,
    height: 240,
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scene: [PreloadScene, GameScene, GameOverScene],
};

var game = new Game(config);
