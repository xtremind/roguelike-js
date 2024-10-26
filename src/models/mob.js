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

  putInInventory(item){
    this.inventory.elements[this.#getIndexNextEmptySpotInInventory()] = item;
  }

  pullFromInventory(){
    let item = this.inventory.elements.splice(this.inventory.position,1)[0];
    this.inventory.position = 0;
    return item
  }

  use(item){
    console.log(item.configuration.effect)
    switch (item.configuration.effect) {
      case Effects.HEAL:
        this.health = Math.min(this.maxHealth, this.health + item.power.value);
        break;
      case Effects.CURE:
        this.curse = null
        break;
      case Effects.INCREASE_MAX_HEALTH:
        this.maxHealth += item.power.value
        break;
      case Effects.BLIND:
        this.curse = {
          effect: Effects.BLIND

        }
        //reset discovered map
        //sight = 1
        //each power turn, sight + 1 until sight max    
        break;
      case Effects.POISON:
        this.curse = {
          effect: Effects.POISON,
          time: item.power
        }
        //each turn until power turn, deal 1 hit 
        break;
      case Effects.FREEZE:
        this.curse = {
          effect: Effects.FREEZE,
          time: item.power
        }
        //don't move until 2 turns
        break;
      case Effects.BURN:
      case Effects.EXPLODE: //can destroy wall ?
        this.health = Math.max(0, this.health - item.power.value);
        break;
      case Effects.SLEEP:
        this.curse = {
          effect: Effects.SLEEP,
          time: item.power
        }
        //on mob, don't move until hit
        //on hero, don't move until 2 turns
        break;
      default:
        break;
    }
  }

  apply(){
    //return true if can move
    if(this.curse == null)
      return true;

    switch (this.curse.effect) {
      case Effects.BLIND:
        //reset discovered map
        //sight = 1
        //each power turn, sight + 1 until sight max    
        break;
      case Effects.POISON:
        //each turn until power turn, deal 1 hit 
        break;
      case Effects.FREEZE:
        //don't move until 2 turns
        return false;
      case Effects.SLEEP:
        //on mob, don't move until hit
        //on hero, don't move until 2 turns
        return false;
      default:
        break;
    }
    return true;
  }
}
