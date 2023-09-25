import { Scene } from "phaser";

import heroSprites from "images/hero.png";
import mobsSprites from "images/mobs.png";
import decorationsSprites from "images/decorations.png";

import heroAtlas from "jsons/hero.json";
import mobsAtlas from "jsons/mobs.json";
import decorationsAtlas from "jsons/decorations.json";
import map from "jsons/map.json";

import breakVase from "sounds/breakVase.mp3";
import hit from "sounds/hit.mp3";
import hurt from "sounds/hurt.mp3";
import openChest from "sounds/openChest.mp3";
import openDoor from "sounds/openDoor.mp3";
import walk from "sounds/walk.mp3";

class PreloadScene extends Scene {
  constructor() {
    super({
      key: "PreloadScene",
    });
  }

  init() {}

  preload() {
    console.log("PreloadScene.preload");

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const loadingLabel = this.add
      .text(screenCenterX, screenCenterY - 30, "Loading ...", {
        font: "30px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    const progressPercent = this.add
      .text(screenCenterX, screenCenterY + 30, "", {
        font: "30px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    const progressFile = this.add
      .text(screenCenterX, screenCenterY + 90, "", {
        font: "30px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const progressBox = this.add.graphics();
    progressBox.clear();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(screenCenterX - 300, screenCenterY, 600, 60);

    const progressBar = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value) => {
      console.log(
        "PreloadScene.preload - progress : " + parseInt(value * 100) + "%",
      );
      progressPercent.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBox.fillRect(
        screenCenterX - 290,
        screenCenterY + 10,
        580 * value,
        40,
      );
    });

    // Register a fileprogress event to show loading asset
    this.load.on("fileprogress", (file) => {
      progressFile.setText("Loading asset: " + file.key);
    });

    // Register a complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      console.log("PreloadScene.preload - complete");
      loadingLabel.destroy();
      progressFile.destroy();
      progressPercent.destroy();
      progressBox.destroy();
      progressBar.destroy();
      this.scene.start("GameScene");
    });

    //Load all assets
    this.load.image("heroSprites", heroSprites);
    this.load.atlas("hero", heroSprites, heroAtlas);
    this.load.image("mobsSprites", mobsSprites);
    this.load.atlas("mobs", mobsSprites, mobsAtlas);
    this.load.image("decorationsSprites", decorationsSprites);
    this.load.atlas("decorations", decorationsSprites, decorationsAtlas);

    this.load.tilemapTiledJSON("map", map);

    this.load.audio("breakVase", breakVase);
    this.load.audio("hit", hit);
    this.load.audio("hurt", hurt);
    this.load.audio("openChest", openChest);
    this.load.audio("openDoor", openDoor);
    this.load.audio("walk", walk);
  }
}

export default PreloadScene;
