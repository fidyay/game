export default class BoyClass {
  type = "boy";
  y = 0;
  hitboxWidth = 24;
  hitboxHeight = 132;
  _animationState = 0;
  _perf = performance.now();
  constructor(x) {
    this.x = x;
  }
  get hitboxX() {
    return this.x + 18;
  }

  get imageX() {
    const imageX = this._animationState * 192;
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
}
