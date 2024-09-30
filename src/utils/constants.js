exports.Map = Object.freeze({
  WIDTH: 20,
  HEIGHT: 15,
});

exports.Tiles = Object.freeze({
  WALL: 1,
  FLOOR: 2,
  UP_STAIR: 3,
  DOWN_STAIR: 4,
  DOOR: 5,
  VASE: 6,
  PANEL: 7,
  CLOSED_CHEST: 8,
  OPENED_CHEST: 9,
  SLIME: 10,
});

exports.Mobs = Object.freeze({
  HERO: "hero",
  SLIME: "slime",
  BAT: "bat",
  SHOGGOTH: "shoggoth",
  GHOST: "ghost",
  SCORPION: "scorpion",
  GOLEM: "golem",
  DEMON: "demon",
});

exports.Status = Object.freeze({
  WAIT: "wait",
  ATTACK: "attack",
});

exports.Action = Object.freeze({
  BUMP: "BUMP",
  WALK: "WALK",
  INTERACT: "INTERACT",
  NONE: "NONE",
});

exports.Effects = Object.freeze({
  HEAL: "heal", 
  CURE: "cure",
  INCREASE_MAX_HEALTH: "maxhealth",
  BLIND: "blind", 
  POISON: "poison", 
  FREEZE: "freeze", 
  BURN: "burn", 
  EXPLODE: "explode", 
  SLEEP: "sleep"
})

exports.Powers = Object.freeze({
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 4,
  EXTRA_LARGE: 8
})

exports.Colors = Object.freeze({
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  RED: 0xFF0000,
  GREEN: 0x00FF00,
  BLUE: 0x0000FF,
  YELLOW: 0xFFFF00,
  ROSE: 0xFF69B4,
  ORANGE: 0xFF7700,
  PURPLE: 0xFF00FF
})

exports.Keys  = Object.freeze({
  UP : 0,
  DOWN : 1,
  LEFT : 2,
  RIGHT : 3,
  ENTER : 4,
  BACK : 5
})