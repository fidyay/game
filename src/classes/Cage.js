export default class Cage {
  type = "cage";
  y = 0;
  hitboxWidth = 78;
  hitboxHeight = 66;
  constructor(x) {
    this.x = x;
  }
  get hitboxX() {
    return this.x;
  }
}
