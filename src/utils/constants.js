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
  INCREASE__MAX_HEALTH: "maxhealth",
  BLIND: "blind", 
  POISON: "poison", 
  FREEZE: "freeze", 
  BURN: "burn", 
  EXPLODE: "explode", 
  SLEEP: "sleep"
})

exports.Powers = Object.freeze({
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  EXTRA_LARGE: "extralarge"
})

exports.Colors = Object.freeze({
  WHITE: "white",
  BLACK: "black",
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  YELLOW: "yellow",
  ROSE: "rose",
  ORANGE: "orange",
  PURPLE: "purple"
})

exports.Keys  = Object.freeze({
  UP : 0,
  DOWN : 1,
  LEFT : 2,
  RIGHT : 3,
  ENTER : 4,
  BACK : 5
})