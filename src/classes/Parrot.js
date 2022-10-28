export default class Parrot {
  type = "parrot";
  _animationState = 0;
  _perf = performance.now();
  y = 100;
  hitboxWidth = 30;
  hitboxHeight = 28;
  constructor(x) {
    this.x = x;
  }

  get imageX() {
    const imageX = this._animationState * 64;
    if (performance.now() - this._perf >= 33) {
      this._perf = performance.now();
      if (this._animationState === 3) {
        this._animationState = 0;
      } else {
        this._animationState++;
      }
    }
    return imageX;
  }
  get hitboxX() {
    return this.x;
  }
}
