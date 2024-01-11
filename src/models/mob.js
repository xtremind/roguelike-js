import { Mobs, Status } from "utils/constants";

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
}