export default class Item {
  constructor(power, configuration) {
    this.power = power;
    this.configuration = configuration;
  }

  name(){
    return  this.power.label + ' ' + (this.configuration.discovered ? this.configuration.effect : this.configuration.color.label)  + ' ' + 'potion'
  }
}