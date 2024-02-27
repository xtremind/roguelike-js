import { Mobs, Status, Action } from "utils/constants";

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
    this.action = "NONE";
    this.status = Status.WAIT;

    switch (type) {
      case Mobs.HERO:
        this.atk = 1;
        this.health = 5;
        this.maxHealth = 5;
        this.distanceSight = 5;
        break;
      case Mobs.SLIME:
        this.atk = 1;
        this.health = 1;
        this.maxHealth = 1;
        this.distanceSight = 3;
        break;
    }
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
}
