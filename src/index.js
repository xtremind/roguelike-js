// Modules
import {Game} from 'phaser';

// Scenes
//import BootScene from 'scenes/boot';
//import PreloadScene from 'scenes/preload';
//import TitleScene from 'scenes/title';
//import WaitingScene from 'scenes/waiting';
//import GameScene from 'scenes/game';
//import EndScene from 'scenes/end';

// Declare configuration
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#22b34e',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200,
    height: 800,
  },
  dom: {
      createContainer: true
  },
  pixelArt: true,
  scene: [
    //BootScene,
    //PreloadScene,
    //TitleScene,
    //WaitingScene,
    //GameScene,
    //EndScene
  ]
};

var game = new Game(config);
