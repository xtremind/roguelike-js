import { Scene } from 'phaser';

const Tiles = Object.freeze({
  WALL: 1,
  FLOOR: 2,
  UP_STAIR: 3,
  DOWN_STAIR: 4,
  DOOR: 5,
  VASE: 6,
  PANEL: 7,
  CLOSED_CHEST: 8,
  OPENED_CHEST: 9
});

class GameScene extends Scene {
  //datas
  #click = 0;
  #hero = {};
  #map = {};
  #wind = [];

  //direction helpers
  #cursors;
  #DIR_X = [0, 0, -1, 1]
  #DIR_Y = [-1, 1, 0, 0]
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
      key: 'GameScene'
    });
  }

  init() {
    console.log("GameScene.init");
  }

  preload() {
    console.log("GameScene.preload");
    this.#breakVaseSound = this.sound.add('breakVase', { loop: false });
    this.#hitSound = this.sound.add('hit', { loop: false });
    this.#hurtSound = this.sound.add('hurt', { loop: false });
    this.#openChestSound = this.sound.add('openChest', { loop: false });
    this.#openDoorSound = this.sound.add('openDoor', { loop: false });
    this.#walkSound = this.sound.add('walk', { loop: false });
  }

  create() {
    //camera zoom
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(80, 60);

    //initiate map
    this.#map = this.add.tilemap('map');
    const tileset = this.#map.addTilesetImage('decorations');
    const platforms = this.#map.createLayer('level1', tileset, 0, 0);

    //initiate hero position
    this.#hero.x = 5;
    this.#hero.y = 7;
    this.#hero.offset_x = 0;
    this.#hero.offset_y = 0;
    this.#hero.soffset_x = 0;
    this.#hero.soffset_y = 0;
    this.#hero.flip = false;
    this.#hero.action = 'NONE'
    this.#hero.time = 1;

    //initiate interaction for player
    this.#cursors = this.input.keyboard.createCursorKeys();

    this.#update = this.#update_interact;
    this.#draw = this.#draw_game;

    //this.#showMsg(["hello world qqsdsd"], 100);
    //this.#showMsg(["second message", "with two lines"], 100);
    this.#showTalk(["third message"]);

    console.log("GameScene.create");
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

    const nextPosTile = this.#map.getTileAt(this.#hero.x + dx, this.#hero.y + dy);

    if (nextPosTile.properties?.solid) {
      if (nextPosTile.properties.interactive) {
        this.#interact(nextPosTile, this.#hero.x + dx, this.#hero.y + dy)
      }

      //BUMP
      this.#hero.soffset_x = dx * 8;
      this.#hero.soffset_y = dy * 8;
      this.#hero.offset_x = 0;
      this.#hero.offset_y = 0;
      this.#hero.time = 0;
      this.#hero.action = 'BUMP'
      this.#update = this.#update_pturn;

      if (nextPosTile.properties?.interactive) {
        this.#interactWith(nextPosTile);
      }
    } else {
      //WALK
      this.#hero.x += dx;
      this.#hero.y += dy;
      this.#hero.soffset_x = -dx * 8;
      this.#hero.soffset_y = -dy * 8;
      this.#hero.offset_x = this.#hero.soffset_x;
      this.#hero.offset_y = this.#hero.soffset_y;
      this.#hero.time = 0;
      this.#hero.action = 'WALK'
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
    this.#hero.time = Math.min(this.#hero.time + 0.125, 1);

    //player move
    if (this.#hero.action == 'WALK') {
      this.#hero.offset_x = this.#hero.soffset_x * (1 - this.#hero.time);
      this.#hero.offset_y = this.#hero.soffset_y * (1 - this.#hero.time);
    } else if (this.#hero.action == 'BUMP') {
      const tme = this.#hero.time >= 0.5 ? 1 - this.#hero.time : this.#hero.time;
      this.#hero.offset_x = this.#hero.soffset_x * (tme);
      this.#hero.offset_y = this.#hero.soffset_y * (tme);
    }

    if (this.#hero.time === 1) {
      this.#update = this.#update_interact;
      this.#hero.action = 'NONE'
    }

  }

  #interact(tle, dx, dy) {
    if (tle.index === 6) {
      //if tle is vase 6
      this.#map.removeTileAt(dx, dy);
      this.#map.putTileAt(2, dx, dy);
    } else if (tle.index === 5) {
      // if tle is door 5
      this.#map.removeTileAt(dx, dy);
      this.#map.putTileAt(2, dx, dy);
    } else if (tle.index === 8) {
      // if tle is chest 8=>9
      this.#map.removeTileAt(dx, dy);
      this.#map.putTileAt(9, dx, dy);
    } else if (tle.index === 7) {
      //if tle is panel 7

    }
  }

  #draw_game() {
    //console.log("GameScene.render");
    //clear scene
    this.#hero.sprite?.destroy();
    //draw hero
    this.#hero.sprite = this.add.image(this.#hero.x * 8 + this.#hero.offset_x, this.#hero.y * 8 + this.#hero.offset_y, 'hero', Math.floor((this.#click / 16)) % 4)
    //this.#hero.sprite.setTint(0xff0000); // pour changer la couleur du sprite
    //gauche
    if (this.#hero.flip) {
      this.#hero.sprite.setOrigin(1, 0)
      this.#hero.sprite.scaleX = -1
    } else {
      this.#hero.sprite.setOrigin(0, 0)
      this.#hero.sprite.scaleX = 1
    }
    //draw floor => managed by phaser
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
        this.#drawWind(wind);
      } else {
        if (wind.duration) {
          wind.duration--;
        }

        if (wind.duration <= 0) {
          wind.height -= wind.height / 4;
          wind.sprite?.destroy();
          this.#drawWind(wind)
          if (wind.height <= 1) {
            wind.sprite?.destroy();
            this.#wind.shift();
          }
        }
      }
    };
  }

  #drawWind(wind) {
    wind.sprite = this.add.container(this.cameras.main.worldView.x + this.cameras.main.width / (2 * this.cameras.main.zoom), this.cameras.main.worldView.y + this.cameras.main.height / (2 * this.cameras.main.zoom));

    const text = this.add.text(0, 0, wind.txt.join('\n'), { align: 'center' });
    text.setFont('Courier');
    text.setFontSize(10);
    text.setOrigin(0.5);

    wind.width = wind.width ? wind.width : text.width;
    wind.height = wind.height ? wind.height : text.height;

    text.setDisplaySize(wind.width, wind.height);

    wind.sprite.add(this.add.rectangle(0, 0, wind.width + 4, wind.height + 4, 0x000000));
    wind.sprite.add(this.add.rectangle(0, 0, wind.width + 3, wind.height + 3, 0xffffff));
    let r1 = this.add.rectangle(0, 0, wind.width + 1, wind.height + 1, 0x000000);
    wind.sprite.add(r1);

    Phaser.Display.Align.In.Center(text, r1);
    wind.sprite.add(text);

    if(wind.interact){
      //draw button spc
      wind.sprite.add(this.add.graphics().fillRoundedRect(0, 0, 13, 13, 3));
      const g = this.add.graphics().strokeRoundedRect(1, 1, 11, 11, 3)
      g.lineStyle(1, 0xffffff, 1);
      wind.sprite.add(g);
      const intText = this.add.text(0, 0, "spc", { align: 'center' });
      intText.setFont('Courier');
      intText.setFontSize(5);
      intText.setOrigin(0.5);
      intText.setColor('#ffffff')
      Phaser.Display.Align.In.Center(intText, g);
      wind.sprite.add(intText);

      //Math.floor((this.#click / 16)) % 4

    }

    wind.sprite.setDepth(10);
  }
}


export default GameScene;