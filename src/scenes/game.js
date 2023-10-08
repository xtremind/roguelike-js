import { Scene } from "phaser";

import { drawWind } from "utils/graphics";
import { prepareWalk, walk, prepareBump, bump } from "utils/movements";
import { Tiles, Mobs } from "utils/constants";

class GameScene extends Scene {
  //datas
  #click = 0;
  #tick = 1;
  #hero = {};
  #mobs = [];
  //#mob = {};
  #map = {};
  #wind = [];

  //direction helpers
  #cursors;
  #DIR_X = [0, 0, -1, 1];
  #DIR_Y = [-1, 1, 0, 0];
  #button_buffer = -1;

  //generic functions
  #update;
  #draw;

  //sound
  #breakVaseSound;
  #hitSound;
  #hurtSound;
  #openChestSound;
  #openDoorSound;
  #walkSound;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init() {
    console.log("GameScene.init");
  }

  preload() {
    console.log("GameScene.preload");
    this.#breakVaseSound = this.sound.add("breakVase", { loop: false });
    this.#hitSound = this.sound.add("hit", { loop: false });
    this.#hurtSound = this.sound.add("hurt", { loop: false });
    this.#openChestSound = this.sound.add("openChest", { loop: false });
    this.#openDoorSound = this.sound.add("openDoor", { loop: false });
    this.#walkSound = this.sound.add("walk", { loop: false });
  }

  create() {
    //camera zoom
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(80, 60);

    //initiate map
    this.#map = this.add.tilemap("map");
    const tileset = this.#map.addTilesetImage("decorations");
    const platforms = this.#map.createLayer("level1", tileset, 0, 0);

    //initiate hero position
    this.#tick = 1;

    this.#hero = this.#createMob(5, 7, Mobs.HERO);
      
      //generate from mps
      for (let i = 0; i < 20; i++){
          for (let j = 0; j < 15; j++){
       
    												const tile = this.#map.getTileAt(i, j);
    												if (tile .index == Tiles.SLIME){
              this.#createMob(tile.x, tile.y, Mobs.SLIME);
    												    	this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
      																		tile.destroy();
    												}
              
          }
      }//this.#createMob(4, 9, 'ghost');

    //initiate interaction for player
    this.#cursors = this.input.keyboard.createCursorKeys();

    this.#update = this.#update_interact;
    this.#draw = this.#draw_game;

    //this.#showMsg(["hello world qqsdsd"], 100);
    //this.#showMsg(["second message", "with two lines"], 100);
    //this.#showTalk(["third message"]);

    console.log("GameScene.create");
  }

  #createMob(x, y, type) {
    const mob = {};
    mob.x = x;
    mob.y = y;
    mob.offset_x = 0;
    mob.offset_y = 0;
    mob.soffset_x = 0;
    mob.soffset_y = 0;
    mob.flip = false;
    mob.type = type;
    mob.action = "NONE";

    switch (type) {
      case Mobs.HERO:
        mob.atk = 1;
        mob.health = 5;
        mob.maxHealth = 5;
        break;
      case Mobs.SLIME:
        mob.atk = 1;
        mob.health = 1;
        mob.maxHealth = 1;
        break;
    }

    this.#mobs.push(mob);
    return mob;
  }

  update() {
    //console.log("GameScene.update");
    this.#update();
    this.#draw();
    this.#draw_wind();
    //update turn
    this.#click = (this.#click + 1) % 64;
  }

  #update_interact() {
    this.#button_buffer = this.#getButton();
    if (this.#wind.length > 0) {
      if (this.#wind[0].interact && this.#button_buffer == 4) {
        this.#wind[0].duration = 0;
        this.#wind[0].interact = false;
      }
    } else {
      this.#execute(this.#button_buffer);
    }
    this.#button_buffer = -1;
  }

  #getButton() {
    //[ "up", "down", "left", "right", "space", "shift" ]
    let result = -1;
    Object.keys(this.#cursors).forEach((dir, ind) => {
      if (ind >= 0 && ind < 5 && this.#cursors[dir].isDown) {
        result = ind;
      }
    });
    return result;
  }

  #execute(button) {
    if (button < 0) return;
    if (button >= 0 && button < 4) {
      let dx = this.#DIR_X[button];
      let dy = this.#DIR_Y[button];
      this.#moveHero(dx, dy);
    }
  }

  #moveHero(dx, dy) {
    if (dx > 0) {
      this.#hero.flip = false;
    } else if (dx < 0) {
      this.#hero.flip = true;
    }

    const nextPosTile = this.#map.getTileAt(
      this.#hero.x + dx,
      this.#hero.y + dy
    );
    const mob = this.#getMob(this.#hero.x + dx, this.#hero.y + dy);

    if (!nextPosTile || nextPosTile.properties?.solid) {
      if (nextPosTile?.properties?.interactive) {
        this.#interactWith(nextPosTile);
      }
      prepareBump(this.#hero, dx, dy);
      this.#tick = 0;
      this.#update = this.#update_pturn;
    } else if (mob) {
      prepareBump(this.#hero, dx, dy);
      this.#tick = 0;
      this.#update = this.#update_pturn;
    } else {
      prepareWalk(this.#hero, dx, dy);
      this.#tick = 0;
      this.#update = this.#update_pturn;

      this.#walkSound.play();
    }
  }

  #interactWith(tile) {
    //console.log(tile);
    if (tile.index == Tiles.DOOR) {
      this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
      tile.destroy();
      this.#openDoorSound.play();
    } else if (tile.index == Tiles.VASE) {
      this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
      tile.destroy();
      this.#breakVaseSound.play();
      //loot
    } else if (tile.index == Tiles.PANEL) {
      //display message
      this.#showMsg(["hello world"], 100);
    } else if (tile.index == Tiles.CLOSED_CHEST) {
      this.#map.putTileAt(Tiles.OPENED_CHEST, tile.x, tile.y);
      tile.destroy();
      this.#openChestSound.play();
      //loot
    }
  }

  #update_pturn() {
    this.#tick = Math.min(this.#tick + 0.125, 1);

    //player move
    if (this.#hero.action == "WALK") {
      walk(this.#hero, this.#tick);
    } else if (this.#hero.action == "BUMP") {
      bump(this.#hero, this.#tick);
    }

    if (this.#tick === 1) {
      this.#update = this.#update_interact;
      this.#hero.action = "NONE";
    }
  }

  #getMob(x, y) {
    return this.#mobs.filter((m) => m.x === x && m.y === y)[0];
  }

  #hitMob(attacker, defender) {
    defender.health -= attacker.atk;
  }

  #isDead(mob) {
    return mob.health <= 0;
  }

  #removeDeadMobs(){
      this.#mobs = this.mobs.filter(mob => !this.#isDead(mob));
  }
    
    #attack(attacker, defender){
        defender.health -= attacker.power;
    }
    
  #draw_game() {
    //console.log("GameScene.render");
    //clear scene
    this.#drawMobs();
    //draw floor => managed by phaser
  }

  #drawMobs() {
    this.#mobs
      .filter((mob) => mob.type !== "hero")
      .forEach((mob) => {
        this.#drawMob(
          mob,
          "mobs",
          "mobs (" +
            mob.type +
            ") " +
            (Math.floor(this.#click / 16) % 4) +
            ".ase"
        );
      });
    this.#drawMob(this.#hero, "hero", Math.floor(this.#click / 16) % 4);
  }

  #drawMob(mob, type, sprite) {
    mob.sprite?.destroy();
    mob.sprite = this.add.image(
      mob.x * 8 + mob.offset_x,
      mob.y * 8 + mob.offset_y,
      type,
      sprite
    );
    //mob.sprite.setTint(0xff0000); // pour changer la couleur du sprite
    //gauche
    if (mob.flip) {
      mob.sprite.setOrigin(1, 0);
      mob.sprite.scaleX = -1;
    } else {
      mob.sprite.setOrigin(0, 0);
      mob.sprite.scaleX = 1;
    }
  }

  #showMsg(txt, duration) {
    let wind = this.#addWind(txt);
    wind.duration = duration;
  }

  #showTalk(txt) {
    let talk = this.#addWind(txt);
    talk.interact = true;
  }

  #addWind(txt) {
    let wind = { txt: txt };
    this.#wind.push(wind);
    return wind;
  }

  #draw_wind() {
    if (this.#wind.length > 0) {
      let wind = this.#wind[0];
      if (!wind.sprite) {
        drawWind(this, wind);
      } else {
        if (wind.duration) {
          wind.duration--;
        }

        if (wind.duration <= 0) {
          wind.height -= wind.height / 4;
          wind.sprite?.destroy();
          drawWind(this, wind);
          if (wind.height <= 1) {
            wind.sprite?.destroy();
            this.#wind.shift();
          }
        }
      }
    }
  }
}

export default GameScene;
