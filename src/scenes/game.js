import { Scene } from "phaser";

import { drawWind, drawFloat, drawFog, drawUi } from "utils/graphics";
import { prepareWalk, walk, prepareBump, bump } from "utils/movements";
import { Tiles, Mobs, Status } from "utils/constants";

class GameScene extends Scene {
  //datas
  #click = 0;
  #tick = 1;
  #hero = {};
  #mobs = [];
  //#mob = {};
  #map = {};
  #winds = [];
  #floats = [];

  #ui = {};

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

  //layers
  #fog = [[]];

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
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(85, 60);

    this.#loadLevel();

    //initiate interaction for player
    this.#cursors = this.input.keyboard.createCursorKeys();

    this.#update = this.#update_interact;
    this.#draw = this.#draw_game;

    //this.#showMsg(["hello world qqsdsd"], 100);
    //this.#showMsg(["second message", "with two lines"], 100);
    //this.#showTalk(["third message"]);

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.time.delayedCall(1000, () => {
          this.scene.start("GameOverScene");
        });
      },
    );

    //DEBUG
    this.sound.mute = true;

    console.log("GameScene.create");
  }

  #loadLevel() {
    //initiate map
    this.#map = this.add.tilemap("map");
    const tileset = this.#map.addTilesetImage("decorations");
    const platforms = this.#map.createLayer("level1", tileset, 0, 0);

    this.#fog = Array(20).fill(0).map(x => Array(15).fill(false))

    //initiate hero position
    this.#tick = 1;

    this.#hero = this.#createMob(5, 7, Mobs.HERO);

    this.#fog[5][7] = true;

    this.#createMob(5, 9, Mobs.SLIME);
    this.#createMob(5, 13, Mobs.SLIME);
    this.#createMob(7, 10, Mobs.SLIME);
    this.#createMob(9, 6, Mobs.SLIME);
    this.#createMob(2, 2, Mobs.SLIME);
    this.#createMob(14, 5, Mobs.SLIME);
    this.#createMob(18, 9, Mobs.SLIME);

    //
    this.#unfog(this.#hero);
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
    mob.status = Status.WAIT;

    switch (type) {
      case Mobs.HERO:
        mob.atk = 1;
        mob.health = 5;
        mob.maxHealth = 5;
        mob.distanceSight = 5;
        break;
      case Mobs.SLIME:
        mob.atk = 1;
        mob.health = 1;
        mob.maxHealth = 1;
        mob.distanceSight = 3;
        break;
    }

    this.#mobs.push(mob);
    return mob;
  }

  update() {
    //console.log("GameScene.update");
    this.#update_floats();
    this.#update();
    this.#draw();
    //update turn
    this.#click = (this.#click + 1) % 64;
  }

  #update_floats() {
    this.#floats.forEach(float => {
      float.y+= (float.ty - float.y)/10;
      float.t+=1
      if(float.t > 70){
        float.sprite?.destroy();
        this.#floats.splice(this.#floats.indexOf(float), 1);
      }
    })
  }

  #update_interact() {
    this.#button_buffer = this.#getButton();
    if (this.#winds.length > 0) {
      if (this.#winds[0].interact && this.#button_buffer == 4) {
        this.#winds[0].duration = 0;
        this.#winds[0].interact = false;
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
    this.#unfog(this.#hero);

    this.#mobs
      .filter((mob) => mob.type !== Mobs.HERO)
      .forEach((mob) => {
        if (this.#isDead(mob)) {
          mob.sprite?.destroy();
          this.#mobs.splice(this.#mobs.indexOf(mob), 1);
        } else if (mob.status == Status.WAIT) {
          this.#wait(mob);
        } else if (mob.status == Status.ATTACK) {
          this.#attack(mob);
        }
      });
  }

  #canSee(mob, hero){
    //console.log("dist : " + this.#distance(mob.x, mob.y, hero.x, hero.y))
    return this.#distance(mob.x, mob.y, hero.x, hero.y) <= mob.distanceSight && this.#isInLineOfSigth(mob.x, mob.y, hero.x, hero.y);
  }

  #wait(mob) {
    if (this.#canSee(mob, this.#hero)) {
      mob.status = Status.ATTACK;
      mob.target = { x: this.#hero.x, y: this.#hero.y };
      //!
      this.#addFloat("!", mob.x, mob.y, 0x000000)
    }
  }

  #attack(mob) {
    if (this.#canSee(mob, this.#hero)) {
      mob.target = { x: this.#hero.x, y: this.#hero.y };
    }
    if (mob.x == mob.target.x && mob.y == mob.target.y) {
      mob.status = Status.WAIT;
      mob.target = {};
      // ?
      this.#addFloat("?", mob.x, mob.y, 0x000000)
    } else {
      //console.log("target: " + mob.target.x + "" + mob.target.y);
      let dx,
        dy,
        dist,
        best_dir = -1,
        best_dist = 999;
      for (let dir = 0; dir < 4; dir++) {
        dx = mob.x + this.#DIR_X[dir];
        dy = mob.y + this.#DIR_Y[dir];
        dist = this.#distance(dx, dy, mob.target.x, mob.target.y);

        let nextPosTile = this.#map.getTileAt(dx, dy);
        if (
          dist < best_dist &&
          !(!nextPosTile || nextPosTile.properties?.solid)
        ) {
          best_dist = dist;
          best_dir = dir;
        }
      }

      if (best_dir != -1) {
        if (
          best_dist == 0 &&
          this.#hero.x == mob.target.x &&
          this.#hero.y == mob.target.y
        ) {
          prepareBump(mob, this.#hero.x - mob.x, this.#hero.y - mob.y);
          this.#hitMob(mob, this.#hero);
          this.#hurtSound.play();
        } else {
          prepareWalk(mob, this.#DIR_X[best_dir], this.#DIR_Y[best_dir]);
        }
        //move mob
        this.#tick = 0;
        this.#update = this.#update_mturn;
      }
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
        this.#hero = {};
        this.#mobs = [];
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        return;
        //reinitiate scene
      }
      this.#aiMobs();
    }
  }

  #update_mturn() {
    this.#tick = Math.min(this.#tick + 0.125, 1);

    //player move
    this.#mobs
      .filter((mob) => mob.type !== Mobs.HERO)
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
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        return;
        //reinitiate scene
      }
    }
  }

  #unfog(hero){
    let tx, ty, tile;

    for(let x = 0; x < this.#fog.length; x++){
      for(let y = 0; y < this.#fog[0].length; y++){
        //this.#map.getTileAt(x, y).visible = this.#fog[x][y];
        if(this.#distance(hero.x, hero.y, x, y) <= hero.distanceSight &&
          !this.#fog[x][y] &&
          this.#isInLineOfSigth(hero.x, hero.y, x, y)
        ){
          this.#fog[x][y] = true;
          for(let dir = 0; dir < 4; dir ++){
            tx = x + this.#DIR_X[dir];
            ty = y + this.#DIR_Y[dir];
            tile = this.#map.getTileAt(tx, ty);
            if (!!tile && !this.#fog[tx][ty] &&
              tile.properties?.solid
              ){
                this.#fog[tx][ty] = true;
            }
          }
        }
      } 
    }
  }

  #getMob(x, y) {
    return this.#mobs.filter((m) => m.x === x && m.y === y)[0];
  }

  #hitMob(attacker, defender) {
    defender.health -= attacker.atk;
    defender.flash = 8;
  }

  #isDead(mob) {
    return mob.health <= 0;
  }

  #distance(x1, y1, x2, y2) {
    const dx = x1 - x2,
      dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #isInLineOfSigth(x1, y1, x2, y2) {
    if (this.#distance(x1, y1, x2, y2) == 1) {
      return true;
    }

    let frst = true;
    let sx, sy, dx, dy;

    if (x1 < x2) {
      sx = 1;
      dx = x2 - x1;
    } else {
      sx = -1;
      dx = x1 - x2;
    }

    if (y1 < y2) {
      sy = 1;
      dy = y2 - y1;
    } else {
      sy = -1;
      dy = y1 - y2;
    }

    let x = x1,
      y = y1,
      err = dx - dy,
      e2;
    let tile;

    while (x != x2 || y != y2) {
      tile = this.#map.getTileAt(x, y);

      if (!frst && (!tile || tile.properties?.solid)) {
        return false;
      }

      frst = false;
      e2 = err + err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return true;
  }

  #draw_game() {
    //console.log("GameScene.render");
    //clear scene
    this.#drawMobs();
    drawUi(this, this.#ui, this.#hero, this.#click);
    this.#drawWinds();
    this.#drawFloats();
    drawFog(this.#map, this.#fog)
    //draw floor => managed by phaser
  }

  #draw_game_over() {}

  #drawMobs() {
    this.#mobs
      .filter((mob) => mob.type !== Mobs.HERO)
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

    if (this.#isDead(mob) && Math.sin(this.#click * 2) > 0) {
      return;
    }

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

    mob.sprite.visible = this.#fog[mob.x][mob.y]
  }

  #showMsg(txt, duration) {
    let wind = this.#addWind(txt);
    wind.duration = duration;
  }

  #showTalk(txt) {
    let talk = this.#addWind(txt);
    talk.interact = true;
  }

  #addFloat(txt, x, y, color){
    let float = {txt: txt, x:x*8+1, y:y*8, tx:x*8+2, ty:y*8 - 10, color:color, t:0}
    this.#floats.push(float);
    return float;
  }

  #addWind(txt) {
    let wind = { txt: txt };
    this.#winds.push(wind);
    return wind;
  }

  #drawWinds() {
    if (this.#winds.length > 0) {
      let wind = this.#winds[0];
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
            this.#winds.shift();
          }
        }
      }
    }
  }

  #drawFloats(){
    this.#floats.forEach(float => {
      drawFloat(this, float);
    })
  }
}

export default GameScene;
