export default class Item {
  constructor(power, color, effect) {
    this.effect = effect;
    this.power = power;
    this.color = color;
  }

  name(){
    return  this.power.label + ' ' + this.color.label + ' ' + 'potion'
  }
}