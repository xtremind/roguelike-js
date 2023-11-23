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

    this.#loadLevel();

    //initiate interaction for player
    this.#cursors = this.input.keyboard.createCursorKeys();

    this.#update = this.#update_interact;
    this.#draw = this.#draw_game;

    //this.#showMsg(["hello world qqsdsd"], 100);
    //this.#showMsg(["second message", "with two lines"], 100);
    //this.#showTalk(["third message"]);

    console.log("GameScene.create");
  }

  #loadLevel() {
    //initiate map
    this.#map = this.add.tilemap("map");
    const tileset = this.#map.addTilesetImage("decorations");
    const platforms = this.#map.createLayer("level1", tileset, 0, 0);

    //initiate hero position
    this.#tick = 1;

    this.#hero = this.#createMob(5, 7, Mobs.HERO);
    this.#createMob(5, 9, Mobs.SLIME);
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
    mob.flash = 0;
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

  #update_game_over() {}

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

  #aiMobs() {
    this.#mobs
      .filter((mob) => mob.type !== "hero")
      .forEach((mob) => {
        if (this.#distance(mob.x, mob.y, this.#hero.x, this.#hero.y) === 1) {
          //attack
          prepareBump(mob, this.#hero.x - mob.x, this.#hero.y - mob.y);
          this.#hitMob(mob, this.#hero);
          this.#hurtSound.play();
        } else {
          //go to hero
          let dx,
            dy,
            dist,
            best_dir,
            best_dist = 999;
          for (let dir = 0; dir < 4; dir++) {
            dx = mob.x + this.#DIR_X[dir];
            dy = mob.y + this.#DIR_Y[dir];
            dist = this.#distance(dx, dy, this.#hero.x, this.#hero.y);

            let nextPosTile = this.#map.getTileAt(dx, dy);
            if (
              dist < best_dist &&
              !(!nextPosTile || nextPosTile.properties?.solid)
            ) {
              best_dist = dist;
              best_dir = dir;
            }
          }
          prepareWalk(mob, this.#DIR_X[best_dir], this.#DIR_Y[best_dir]);
        }
      });

    //move mob
    this.#tick = 0;
    this.#update = this.#update_mturn;
  }

  #moveHero(dx, dy) {
    if (dx > 0) {
      this.#hero.flip = false;
    } else if (dx < 0) {
      this.#hero.flip = true;
    }

    const nextPosTile = this.#map.getTileAt(
      this.#hero.x + dx,
      this.#hero.y + dy,
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
      this.#hitMob(this.#hero, mob);
      this.#hitSound.play();
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
      if (this.#isDead(this.#hero)) {
        this.scene.start("GameOverScene");
        //reinitiate scene
      }
      this.#aiMobs();
    }
  }

  #update_mturn() {
    this.#tick = Math.min(this.#tick + 0.125, 1);

    //player move
    this.#mobs
      .filter((mob) => mob.type !== "hero")
      .forEach((mob) => {
        if (mob.action == "WALK") {
          walk(mob, this.#tick);
        } else if (mob.action == "BUMP") {
          bump(mob, this.#tick);
        }

        if (this.#tick === 1) {
          mob.action = "NONE";
        }
      });

    if (this.#tick === 1) {
      this.#update = this.#update_interact;
      if (this.#isDead(this.#hero)) {
        this.#hero = {};
        this.#mobs = [];
        this.scene.start("GameOverScene");
        //reinitiate scene
      }
    }
  }

  #getMob(x, y) {
    return this.#mobs.filter((m) => m.x === x && m.y === y)[0];
  }

  #hitMob(attacker, defender) {
    defender.health -= attacker.atk;
    defender.flash = 16;
    //console.log(defender.health);
    if (this.#isDead(defender)) {
      defender.sprite?.destroy();
      this.#mobs.splice(this.#mobs.indexOf(defender), 1);
    }
  }

  #isDead(mob) {
    return mob.health <= 0;
  }

  #distance(x1, y1, x2, y2) {
    const dx = x1 - x2,
      dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #draw_game() {
    //console.log("GameScene.render");
    //clear scene
    this.#drawMobs();
    //draw floor => managed by phaser
  }

  #draw_game_over() {}

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
            ".ase",
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
      sprite,
    );

    if (mob.flash > 0) {
      // pour changer la couleur du sprite
      mob.sprite.setTintFill(0xffffff);
      mob.flash -= 1;
    }

    if (mob.flip) {
      //gauche
      mob.sprite.setOrigin(1, 0);
      mob.sprite.scaleX = -1;
    } else {
      //droite
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
