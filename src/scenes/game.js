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
    #click = 0;
    #hero = {};
    #map = {};
    

    #cursors;
    #DIR_X = [0, 0, -1, 1]
    #DIR_Y = [-1, 1, 0, 0]
    #button_buffer = -1;

    #update;
    #draw;


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

        console.log("GameScene.create");
    }

    update() { 
        //console.log("GameScene.update");
        this.#update();
        this.#draw();
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
        }
    }

    #interactWith(tile){
      console.log(tile);
      if(tile.index == Tiles.DOOR){
        this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
        tile.destroy();
      } else if(tile.index == Tiles.VASE){
        this.#map.putTileAt(Tiles.FLOOR, tile.x, tile.y);
        tile.destroy();
        //loot
      } else if(tile.index == Tiles.PANEL){
        //display message
      } else if(tile.index == Tiles.CLOSED_CHEST){
        this.#map.putTileAt(Tiles.OPENED_CHEST, tile.x, tile.y);
        tile.destroy();
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
}


export default GameScene;