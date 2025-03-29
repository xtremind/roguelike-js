import { Mobs, Status, Action, Effects, Powers, Colors } from "utils/constants";

export default class Mob {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.offset_x = 0;
    this.offset_y = 0;
    this.soffset_x = 0;
    this.soffset_y = 0;
    this.flip = false;
    this.flash = 0;
    this.type = type;
    this.curse = null;
    this.action = "NONE";
    this.status = Status.WAIT;

    switch (type) {
      case Mobs.HERO:
        this.atk = 1;
        this.health = 5;
        this.maxHealth = 5;
        this.distanceSight = 5;
        this.inventory = {
          elements: [],
          position: 0,
          subInventory: {
            position: 0
          }
        };
        break;
      case Mobs.SLIME:
        this.atk = 1;
        this.health = 1;
        this.maxHealth = 1;
        this.distanceSight = 3;
        break;
    }
  }

  moveTo(x, y){
    this.x = x;
    this.y = y;
  }

  sight(){
    return Math.max(0, this.distanceSight - (this.curse?.effect == Effects.BLIND ? Math.floor(this.curse.time) : 0));
  }

  isHero(){
    return this.type == Mobs.HERO;
  }

  isDead() {
    return this.health <= 0;
  }

  prepare(action, dx, dy) {
    this.action = action;
    switch (action) {
      case Action.BUMP:
      case Action.INTERACT:
        this.soffset_x = dx * 8;
        this.soffset_y = dy * 8;
        this.offset_x = 0;
        this.offset_y = 0;
        break;
      case Action.WALK:
        this.x += dx;
        this.y += dy;
        this.soffset_x = -dx * 8;
        this.soffset_y = -dy * 8;
        this.offset_x = this.soffset_x;
        this.offset_y = this.soffset_y;
        break;
      default:
        break;
    }
  }

  do(tick) {
    switch (this.action) {
      case Action.BUMP:
      case Action.INTERACT:
        const tme = tick >= 0.5 ? 1 - tick : tick;
        this.offset_x = this.soffset_x * tme;
        this.offset_y = this.soffset_y * tme;
        break;
      case Action.WALK:
        this.offset_x = this.soffset_x * (1 - tick);
        this.offset_y = this.soffset_y * (1 - tick);
        break;
      default:
        break;
    }
  }

  hasInteract() {
    return this.action == Action.INTERACT || this.action == Action.WALK;
  }

  #getIndexNextEmptySpotInInventory(){
    if(this.inventory.elements.length == 0)
      return 0;
    let i = 0;
    while(typeof this.inventory.elements[i] != undefined && this.inventory.elements[i] != null){
      i++;
    }
    return i;
  }

  putInInventory(scene, item){
    if(item) {
      scene.addFloat("!", this.x, this.y, Colors.WHITE);
      this.inventory.elements[this.#getIndexNextEmptySpotInInventory()] = item;
    }
  }

  pullFromInventory(){
    let item = this.inventory.elements.splice(this.inventory.position,1)[0];
    this.inventory.position = 0;
    return item
  }

  use(scene, item){
    console.log(item.configuration.effect)
    switch (item.configuration.effect) {
      // GOOD EFFECT
      case Effects.HEAL:
        this.health = Math.min(this.maxHealth, this.health + item.power.value);
        scene.addFloat(item.power.value, this.x, this.y, Colors.GREEN);
        break;
      case Effects.CURE:
        this.curse = null
        scene.addFloat("!", this.x, this.y, Colors.GREEN);
        break;
      case Effects.INCREASE_MAX_HEALTH:
        this.maxHealth += item.power.value
        scene.addFloat(item.power.value, this.x, this.y, Colors.BLUE);
        break;
      // BAD EFFECT
      case Effects.BLIND:
        this.curse = {
          effect: Effects.BLIND,
          time: item.power.value
        }
        scene.addFloat("!", this.x, this.y, Colors.BLACK);
        if(this.isHero()) scene.initiateFog();
        break;
      case Effects.POISON:
        this.curse = {
          effect: Effects.POISON,
          time: item.power.value
        }
        scene.addFloat("!", this.x, this.y, Colors.PURPLE);
        break;
      case Effects.FREEZE:
        this.curse = {
          effect: Effects.FREEZE,
          time: item.power.value
        }
        scene.addFloat("!", this.x, this.y, Colors.BLUE);
        break;
      case Effects.BURN:
      case Effects.EXPLODE: //can destroy wall ?
        this.health = Math.max(0, this.health - item.power.value);
        scene.addFloat(item.power.value, this.x, this.y, this.isHero() ? Colors.RED : Colors.ORANGE)
        if(this.curse?.effect == Effects.FREEZE) this.curse == null; //fire unfreeze you
        break;
      case Effects.SLEEP:
        this.curse = {
          effect: Effects.SLEEP,
          time: item.power.value
        }
        //scene.addFloat("!", this.x, this.y, Colors.BLUE);
        break;
      default:
        break;
    }
  }

  apply(scene){
    if(this.curse == null) return true;

    let canMove = true;
    switch (this.curse.effect) {
      case Effects.BLIND:
        this.curse.time -= 1/4;
        break;
      case Effects.POISON:
        //each turn until power turn, deal 1 hit 
        this.health -= 1;
        scene.addFloat(1, this.x, this.y, Colors.PURPLE)
        this.flash = 8;
        this.curse.time -= 1
        break;
      case Effects.FREEZE:
        //don't move until 2 turns
        this.curse.time -= 1;
        canMove = false;
        break;
      case Effects.SLEEP:
        //on mob, don't move until hit
        //on hero, don't move until 2 turns
        if(this.isHero()) this.curse.time -= 1;
        canMove = false;
        break;
      default:
        break;
    }
    console.log(this.curse?.time)
    //if curse.time == 0 => remove it
    if(this.curse?.time <= 0) this.curse = null;

    return canMove;
  }
}
