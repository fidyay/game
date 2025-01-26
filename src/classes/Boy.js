export default class Boy {
  type = "boy";
  y = 0;
  hitboxWidth = 32;
  hitboxHeight = 184;
  _animationState = 0;
  _perf = performance.now();
  constructor(x) {
    this.x = x;
  }
  get hitboxX() {
    return this.x + 24;
  }

  get imageX() {
    const imageX = this._animationState * 256;
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
