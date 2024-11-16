import { Scene } from "phaser";

import { drawWind, drawFloat, drawFog, drawUi, drawInventory, drawSubInventory, drawThrow } from "utils/graphics";
import { Map, Tiles, Mobs, Status, Action, Keys, Effects, Powers, Colors } from "utils/constants";
import Mob from "models/mob";
import Item from "models/item";

const INVENTORY_SIZE = 6;
const INVENTORY_TOGGLE_DELAY = 300;

class GameScene extends Scene {
  //datas
  #click = 0;
  #tick = 1;
  #hero = {};
  #mobs = [];
  #lootConfigurations = [];
  //#mob = {};
  #map = {};
  #winds = [];
  #floats = [];

  #direction = Keys.LEFT;

  #ui = {};

  //direction helpers
  #cursors;
  #DIR_X = [0, 0, -1, 1];
  #DIR_Y = [-1, 1, 0, 0];
  
  #showInventory = false;
  #showSubInventory = false;
  #showThrow = false;

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

  click(){
    return this.#click;
  }

  create() {
    //camera zoom
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(85, 60);

    this.#loadLevel();

    //initiate interaction for player 
    
    this.#cursors = this.input.keyboard.createCursorKeys();
    this.#cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL); //replace space by crtl button
    
    this.#update = this.#update_interact_game;
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

    // should be done each time a game start, but not between level
    this.#generateLootConfiguration();

    this.#hero.putInInventory(new Item(Powers.SMALL, this.#lootConfigurations[5]));
    this.#hero.putInInventory(new Item(Powers.MEDIUM, this.#lootConfigurations[0]));
    this.#hero.putInInventory(new Item(Powers.LARGE, this.#lootConfigurations[5]));

    console.log("GameScene.create");
  }

  #generateLootConfiguration() {
    let colors = Object.values(Colors);
    let effects = Object.values(Effects);

    let color, effect;

    while (colors.length > 0) {
      //color = colors.splice(Math.floor((Math.random() * colors.length)), 1)[0];
      //effect = effects.splice(Math.floor((Math.random() * effects.length)), 1)[0];
      //
      color = colors.splice(0, 1)[0];
      effect = effects.splice(0, 1)[0];

      this.#lootConfigurations.push({
        color: color,
        effect: effect,
        discovered: false
      });
    }
  }

  #loadLevel() {
    //initiate map
    this.#map = this.add.tilemap("map");
    const tileset = this.#map.addTilesetImage("decorations");
    const platforms = this.#map.createLayer("level1", tileset, 0, 0);

    //initiate hero position
    this.#tick = 1;

    this.#hero = this.#createMob(5, 7, Mobs.HERO);
    this.initiateFog();

    this.#createMob(4, 6, Mobs.SLIME);
    this.#createMob(5, 5, Mobs.SLIME);
    this.#createMob(8, 2, Mobs.SLIME);
    this.#createMob(7, 10, Mobs.SLIME);
    this.#createMob(9, 6, Mobs.SLIME);
    this.#createMob(2, 2, Mobs.SLIME);
    this.#createMob(14, 5, Mobs.SLIME);
    this.#createMob(18, 9, Mobs.SLIME);

    //
  }

  initiateFog(){
    this.#fog = Array(Map.WIDTH)
      .fill(0)
      .map((x) => Array(Map.HEIGHT).fill(false));
      
    this.#unfog(this.#hero);
  }

  #createMob(x, y, type) {
    const mob = new Mob(x, y, type);
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
    this.#floats.forEach((float) => {
      float.y += (float.ty - float.y) / 10;
      float.t += 1;
      if (float.t > 70) {
        float.sprite?.destroy();
        this.#floats.splice(this.#floats.indexOf(float), 1);
      }
    });
  }

  //INVENTORY
  #update_interact_inventory() {
    this.#tick = Math.min(this.#tick + 0.125, 1);
    const button = this.#getButton();
    //console.log("update_interact_inventory " + this.#tick)
    if(this.#tick === 1){
      this.#executeInInventory(button);
      this.#tick = 0;
    }
  }

  #update_game_over() {}

  #getButton() {
    //[ "up", "down", "left", "right", "space", "shift" ]
    let result = -1;
    Object.keys(this.#cursors).forEach((dir, ind) => {
      if (ind >= Keys.UP && ind <= Keys.BACK && this.#cursors[dir].isDown) {
        result = ind;
      }
    });
    return result;
  }

  #executeInInventory(button) {
    if (button === Keys.BACK) {
      console.log("!inventory")
      if(this.#showSubInventory) {
        // Back to inventory
        this.#showSubInventory = false;
      } else {
        // Back to game
        this.#showInventory = false;
        setTimeout(() => {
          this.#update = this.#update_interact_game;
        }, INVENTORY_TOGGLE_DELAY);
      }
    } else if (button === Keys.ENTER) {
      if(this.#showSubInventory) {
        // Use Item
        this.#showInventory = false;
        this.#showSubInventory = false;
        this.#useItem();
      } else if (this.#hero.inventory.elements[this.#hero.inventory.position]){
        //Show Sub Inventory
        console.log("subinventory");
        this.#showSubInventory = true;
        this.#hero.inventory.subInventory.position = 0;
      }
    } else if ([Keys.UP, Keys.DOWN].includes(button)) {
      //Move cursor
      if(this.#showSubInventory){
        //in Sub Inventory
        this.#hero.inventory.subInventory.position += this.#DIR_Y[button];
        this.#hero.inventory.subInventory.position = (this.#hero.inventory.subInventory.position + 3) % 3;
      } else {
        //in Inventory, cursor move only on items
        this.#hero.inventory.position += this.#DIR_Y[button];
        this.#hero.inventory.position = (this.#hero.inventory.position + this.#hero.inventory.elements.length) % this.#hero.inventory.elements.length;
        this.#hero.inventory.position = isNaN(this.#hero.inventory.position) ? 0 : this.#hero.inventory.position;
      }
    }
  }

  #useItem(){
    let action = this.#hero.inventory.subInventory.position
    console.log(action);

    switch (action) {
      case 0: // drink
        console.log('drink');
        let item = this.#hero.pullFromInventory();
        console.log(item);
        item.configuration.discovered = true;
        this.#hero.use(this, item);
        this.#tick = 0;
        this.#update = this.#update_pturn;
        break;
      case 1: // launch
        console.log('launch');
        this.#update = this.#update_throw_item
        this.#showThrow = true;
        break;
      default: // drop
        console.log('drop');
        this.#hero.pullFromInventory();
        this.#tick = 0;
        this.#update = this.#update_pturn;
        break;
    }
    //once use, a turn has passed
  }
  
  //THROW
  #update_throw_item(){
    this.#tick = Math.min(this.#tick + 0.125, 1);
    const button = this.#getButton();
    //console.log("update_throw_item " + this.#tick)
    if(this.#tick === 1){
      this.#executeInThrow(button);
      this.#tick = 0;
    }
  }

  #executeInThrow(button){
    //console.log('xecuteInThrow' )+ button;
    if (button === Keys.ENTER){ //THROW
      this.#showThrow = false;
      let item = this.#hero.pullFromInventory();
      console.log(item);
      item.configuration.discovered = true;
      // find first element in direction
      let element = this.#findFirstPhysicalElementInDirection(this.#hero.x, this.#hero.y, this.#direction);
      console.log(element);
      if(this.#isMob(element)){
        element.use(this, item);
      } else if (item.configuration.effect === Effects.EXPLODE && this.#isTile(element)){
        this.#map.putTileAt(Tiles.FLOOR, element.x, element.y);
        element.destroy();
        //this.#openDoorSound.play(); -> play explode sound
      }

      this.#hero.prepare(Action.INTERACT, this.#DIR_X[this.#direction], this.#DIR_Y[this.#direction])
      this.#tick = 0;
      this.#update = this.#update_pturn;
    } else if (button === Keys.BACK) {
      this.#showThrow = false;
      this.#showInventory = true;
      this.#tick = 0;
      setTimeout(() => {
        this.#update = this.#update_interact_inventory;
      }, INVENTORY_TOGGLE_DELAY);
  
    } else if (button !== -1){
      this.#direction = button;
    } 
  }

  #isTile(element){
    return element.constructor.name === 'Tile'
  }

  #isMob(element){
    return element.constructor.name === 'Mob'
  }

  #findFirstPhysicalElementInDirection(x, y, direction){
    let dx = x, dy = y;
    while(true){
      dx += this.#DIR_X[direction];
      dy += this.#DIR_Y[direction];
      let mob = this.getMob(dx, dy);
      if(mob){
        return mob;
      }
      let tile = this.#map.getTileAt(dx, dy);
      if(!tile || tile.properties?.solid){
        return tile;
      }
    }
  }

  //GAME
  #update_interact_game() {
    const button = this.#getButton();
    if (this.#winds.length > 0) {
      if (this.#winds[0].interact && button === 4) {
        this.#winds[0].duration = 0;
        this.#winds[0].interact = false;
      }
    } else {
      this.#executeInGame(button);
    }
  }

  #executeInGame(button) {
    if (button < Keys.UP) return;
    if (button === Keys.ENTER) {
      console.log("inventory");
      this.#showInventory = true;
      this.#tick = 0;
      setTimeout(() => {
        this.#update = this.#update_interact_inventory;
      }, INVENTORY_TOGGLE_DELAY);
    }
    if (button >= Keys.UP && button <= Keys.RIGHT) {
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
        let canMove = mob.apply(this);
        if (mob.isDead()) {
          mob.sprite?.destroy();
          this.#mobs.splice(this.#mobs.indexOf(mob), 1);
        } else if(!canMove){
          return;
        } else if (mob.status === Status.WAIT) {
          this.#wait(mob);
        } else if (mob.status === Status.ATTACK) {
          this.#attack(mob);
        }
      });
  }

  #canSee(mob, x, y) {
    //console.log("dist : " + this.#distance(mob.x, mob.y, hero.x, hero.y))
    return (
      this.#distance(mob.x, mob.y, x, y) <= mob.sight() &&
      this.#isInLineOfSigth(mob.x, mob.y, x, y)
    );
  }

  #wait(mob) {
    if (this.#canSee(mob, this.#hero.x, this.#hero.y)) {
      mob.status = Status.ATTACK;
      mob.target = { x: this.#hero.x, y: this.#hero.y };
      //!
      this.addFloat("!", mob.x, mob.y, Colors.WHITE);
    }
  }

  #attack(mob) {
    if (this.#canSee(mob, this.#hero.x, this.#hero.y)) {
      mob.target = { x: this.#hero.x, y: this.#hero.y };
    }
    if (mob.x === mob.target.x && mob.y === mob.target.y) {
      mob.status = Status.WAIT;
      mob.target = {};
      // ?
      this.addFloat("?", mob.x, mob.y, Colors.WHITE);
    } else {
      //console.log("target: " + mob.target.x + "" + mob.target.y);
      let distMap = this.#computeDijkstraArray(mob.target.x, mob.target.y);
      let dx,
        dy,
        dist,
        best_dirs = [],
        best_dist = 999;
      for (let dir = 0; dir < 4; dir++) {
        dx = mob.x + this.#DIR_X[dir];
        dy = mob.y + this.#DIR_Y[dir];
        dist = distMap[dx][dy];

        let nextPosTile = this.#map.getTileAt(dx, dy);

        if (!(!nextPosTile || nextPosTile.properties?.solid)) {
          if (dist < best_dist) {
            best_dist = dist;
            best_dirs = [dir];
          } else if (dist === best_dist) {
            best_dirs.push(dir);
          }
        }
      }

      let optimal_dirs = [];

      for (const dir of best_dirs) {
        dx = mob.x + this.#DIR_X[dir];
        dy = mob.y + this.#DIR_Y[dir];
        let other = this.getMob(dx, dy);
        if (!other || other?.type === Mobs.HERO) {
          optimal_dirs.push(dir);
        }
      }

      if (optimal_dirs.length > 0) {
        const best_dir =
          optimal_dirs[Math.floor(Math.random() * optimal_dirs.length)];
        if (
          best_dist === 0 &&
          this.#hero.x === mob.target.x &&
          this.#hero.y === mob.target.y
        ) {
          mob.prepare(
            Action.INTERACT,
            this.#DIR_X[best_dir],
            this.#DIR_Y[best_dir],
          );
          this.#hitMob(mob, this.#hero);
          this.#hurtSound.play();
        } else {
          mob.prepare(
            Action.WALK,
            this.#DIR_X[best_dir],
            this.#DIR_Y[best_dir],
          );
        }
        //move mob
        //this.#walkMobSound.play();
        this.#tick = 0;
        this.#update = this.#update_mturn;
      }
    }
  }

  #moveHero(dx, dy) {
    let canMove = this.#hero.apply(this);

    if (dx > 0) {
      this.#hero.flip = false;
    } else if (dx < 0) {
      this.#hero.flip = true;
    }

    const nextPosTile = this.#map.getTileAt(
      this.#hero.x + dx,
      this.#hero.y + dy,
    );
    const mob = this.getMob(this.#hero.x + dx, this.#hero.y + dy);

    if(!canMove){
      this.#hero.prepare(Action.BUMP, dx, dy);
    } else if (!nextPosTile || nextPosTile.properties?.solid) {
      if (nextPosTile?.properties?.interactive) {
        this.#interactWith(nextPosTile);
        this.#hero.prepare(Action.INTERACT, dx, dy);
      } else {
        this.#hero.prepare(Action.BUMP, dx, dy);
      }
    } else if (mob) {
      this.#hero.prepare(Action.INTERACT, dx, dy);
      this.#hitMob(this.#hero, mob);
      this.#hitSound.play();
    } else {
      this.#hero.prepare(Action.WALK, dx, dy);
      this.#walkSound.play();
    }

    this.#tick = 0;
    this.#update = this.#update_pturn;
  }

  #interactWith(tile) {
    //console.log(tile);
    if (tile.index === Tiles.DOOR) {
      this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
      tile.destroy();
      this.#openDoorSound.play();
    } else if (tile.index === Tiles.VASE) {
      this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
      tile.destroy();
      this.#breakVaseSound.play();
      //loot
    } else if (tile.index === Tiles.PANEL) {
      //display message
      this.#showMsg(["hello world"], 100);
    } else if (tile.index === Tiles.CLOSED_CHEST) {
      this.#map.putTileAt(Tiles.OPENED_CHEST, tile.x, tile.y);
      tile.destroy();
      this.#openChestSound.play();
      //loot
    }
  }

  #update_pturn() {
    this.#tick = Math.min(this.#tick + 0.125, 1);

    //player move
    this.#hero.do(this.#tick);

    if (this.#tick === 1) {
      this.#update = this.#update_interact_game;
      let hasInteracted = this.#hero.hasInteract();
      this.#hero.action = Action.NONE;
      if (this.#hero.isDead()) {
        this.#mobs = [];
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        return;
        //reinitiate scene
      }
      if (hasInteracted || this.#hero.curse) {
        this.#aiMobs();
      }
    }
  }

  #update_mturn() {
    this.#tick = Math.min(this.#tick + 0.125, 1);

    //player move
    this.#mobs
      .filter((mob) => mob.type !== Mobs.HERO)
      .forEach((mob) => {
        mob.do(this.#tick);
        if (this.#tick === 1) {
          mob.action = Action.NONE;
        }
      });

    if (this.#tick === 1) {
      this.#update = this.#update_interact_game;
      if (this.#hero.isDead()) {
        this.#mobs = [];
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        return;
        //reinitiate scene
      }
    }
  }

  #unfog(hero) {
    let tx, ty, tile;

    for (let x = 0; x < this.#fog.length; x++) {
      for (let y = 0; y < this.#fog[0].length; y++) {
        //this.#map.getTileAt(x, y).visible = this.#fog[x][y];
        if (this.#canSee(hero, x, y) && !this.#fog[x][y]) {
          this.#fog[x][y] = true;
          for (let dir = 0; dir < 4; dir++) {
            tx = x + this.#DIR_X[dir];
            ty = y + this.#DIR_Y[dir];
            tile = this.#map.getTileAt(tx, ty);
            if (!!tile && !this.#fog[tx][ty] && tile.properties?.solid) {
              this.#fog[tx][ty] = true;
            }
          }
        }
      }
    }
  }

  getMob(x, y) {
    return this.#mobs.filter((m) => m.x === x && m.y === y)[0];
  }

  #hitMob(attacker, defender) {
    defender.health -= attacker.atk;
    this.addFloat(attacker.atk, defender.x, defender.y, defender.isHero() ? Colors.RED : Colors.ORANGE)
    defender.flash = 8;
  }

  #computeDijkstraArray(x, y) {
    let result = Array(Map.WIDTH)
      .fill(0)
      .map((x) => Array(Map.HEIGHT).fill(-1));
    let candidates = [],
      dx,
      dy,
      tile,
      current;
    candidates.push({ x: x, y: y, step: 0 });
    result[x][y] = 0;
    do {
      current = candidates.shift();
      for (let dir = 0; dir < 4; dir++) {
        dx = current.x + this.#DIR_X[dir];
        dy = current.y + this.#DIR_Y[dir];
        tile = this.#map.getTileAt(dx, dy);
        if (tile && result[dx][dy] === -1) {
          result[dx][dy] = current.step + 1;
          if (!tile.properties?.solid) {
            // is walkable
            candidates.push({ x: dx, y: dy, step: current.step + 1 });
          }
        }
      }
    } while (candidates.length !== 0);

    return result;
  }

  #distance(x1, y1, x2, y2) {
    const dx = x1 - x2,
      dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #isInLineOfSigth(x1, y1, x2, y2) {
    if (this.#distance(x1, y1, x2, y2) === 1) {
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

    while (x !== x2 || y !== y2) {
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
    drawFog(this.#map, this.#fog);
    drawInventory(this, this.#hero, this.#showInventory)
    drawSubInventory(this, this.#hero, this.#showSubInventory)
    drawThrow(this, this.#hero, this.#map, this.#direction, this.#showThrow)
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

    if (mob.isDead() && Math.sin(this.#click * 2) > 0) {
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

    mob.sprite.visible = this.#fog[mob.x][mob.y];
  }

  #showMsg(txt, duration) {
    let wind = this.#addWind(txt);
    wind.duration = duration;
  }

  #showTalk(txt) {
    let talk = this.#addWind(txt);
    talk.interact = true;
  }

  addFloat(txt, x, y, color) {
    let float = {
      txt: txt,
      x: x * 8 + 1,
      y: y * 8,
      tx: x * 8 + 2,
      ty: y * 8 - 10,
      color: color,
      t: 0,
    };
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

  #drawFloats() {
    this.#floats.forEach((float) => {
      drawFloat(this, float);
    });
  }
}

export default GameScene;
