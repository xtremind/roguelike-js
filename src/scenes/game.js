import {Scene} from 'phaser';

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

        this.#showMsg(["hello world qqsdsd","this is line 2", "ezrf"], 20);

        console.log("GameScene.create");
    }

    update() { 
        //console.log("GameScene.update");
        this.#update();
        this.#draw();
        this.#drawWind();
        //update turn 
        this.#click = (this.#click+1) % 64;
    }

    #update_interact(){
        this.#button_buffer = this.#getButton();
        this.#execute(this.#button_buffer);
        this.#button_buffer = -1;
    }

    #getButton(){
      //[ "up", "down", "left", "right", "space", "shift" ]
      let result = -1;
      Object.keys(this.#cursors).forEach((dir, ind) => {
        if (ind >= 0 && ind < 4 && this.#cursors[dir].isDown){
          result = ind;
        }
      });
      return result;
    }

    #execute(button){
      if (button < 0) return;
      if (button >= 0 && button < 4 ){
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
            if(nextPosTile.properties.interactive){
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

    #interactWith(tile){
      //console.log(tile);
      if(tile.index == Tiles.DOOR){
        this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
        tile.destroy();
        this.#openDoorSound.play();
      } else if(tile.index == Tiles.VASE){
        this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
        tile.destroy();
        this.#breakVaseSound.play();
        //loot
      } else if(tile.index == Tiles.PANEL){
        //display message
        this.#showMsg(["hello world"]);
      } else if(tile.index == Tiles.CLOSED_CHEST){
        this.#map.putTileAt(Tiles.OPENED_CHEST, tile.x, tile.y);
        tile.destroy();
        this.#openChestSound.play();
        //loot
      }

    }

    #update_pturn(){
        this.#hero.time = Math.min(this.#hero.time + 0.125, 1);

        //player move
        if(this.#hero.action == 'WALK'){
            this.#hero.offset_x=this.#hero.soffset_x * (1-this.#hero.time);
            this.#hero.offset_y=this.#hero.soffset_y * (1-this.#hero.time);
        } else if (this.#hero.action == 'BUMP'){
            const tme = this.#hero.time >= 0.5 ? 1 - this.#hero.time  : this.#hero.time ;
            this.#hero.offset_x=this.#hero.soffset_x * (tme);
            this.#hero.offset_y=this.#hero.soffset_y * (tme);
        }
        
        if( this.#hero.time === 1){
            this.#update = this.#update_interact;
            this.#hero.action = 'NONE'
        }

    }

    #interact(tle, dx, dy){
        if(tle.index === 6){
            //if tle is vase 6
            this.#map.removeTileAt(dx, dy);
            this.#map.putTileAt(2, dx, dy);
        } else if(tle.index === 5){
            // if tle is door 5
            this.#map.removeTileAt(dx, dy);
            this.#map.putTileAt(2, dx, dy);
        } else if(tle.index === 8){
            // if tle is chest 8=>9
            this.#map.removeTileAt(dx, dy);
            this.#map.putTileAt(9, dx, dy);
        } else if(tle.index === 7){
            //if tle is panel 7
            
        } 
    }

    #draw_game(){
        //console.log("GameScene.render");
        //clear scene
        this.#hero.sprite?.destroy();
        //draw hero
        this.#hero.sprite = this.add.image(this.#hero.x*8 + this.#hero.offset_x, this.#hero.y*8 + this.#hero.offset_y, 'hero', Math.floor((this.#click/16))%4)
        //this.#hero.sprite.setTint(0xff0000); // pour changer la couleur du sprite
        //gauche
        if(this.#hero.flip){
            this.#hero.sprite.setOrigin(1, 0)
            this.#hero.sprite.scaleX = -1
        } else {
            this.#hero.sprite.setOrigin(0, 0)
            this.#hero.sprite.scaleX = 1
        }
        //draw floor => managed by phaser
    }

    #showMsg(txt, duration){
      let width = Math.max(...txt.map(str => str.length))*6;
      let height = (txt.length+1)*5 + (txt.length)*4;
      let wind = this.#addWind(135 - width/2, 80 - (height/2), height, width+6, txt);
      wind.duration = duration;
    }

    #addWind(x, y, h, w, txt){
      let wind = {x: x, y: y, h: h, w: w, txt: txt};
      this.#wind.push(wind);
      return wind;
    }

    #drawWind(){
      this.#wind.forEach(wind => {
        //à voir si c'est pas mieux de destroy puis reconstruire à chaque fois
        if(!wind.sprite){
          //create display
          wind.sprite = this.add.container(wind.x, wind.y);
          //text.setOrigin(0.5, 1);

          let r1 = this.add.rectangle(0, 0, wind.w+4, wind.h+4, 0x000000);
          wind.sprite.add(r1);
          wind.sprite.add(this.add.rectangle(0, 0, wind.w+2, wind.h+2, 0xffffff));
          wind.sprite.add(this.add.rectangle(0, 0, wind.w, wind.h, 0x000000));

          const text = this.add.text(0, 0, wind.txt.join('\n'), { align: 'center' });
          text.setFont('Courier');
          text.setFontSize(10);
          text.setOrigin(0);
          Phaser.Display.Align.In.Center(text, r1);
          wind.sprite.add(text);
          wind.sprite.setDepth(10);
        } else {
          //update display
        }
      });
    }
}


export default GameScene;