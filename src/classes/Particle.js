export default class Particle {
  _opacity = 0.5;
  _width = 2;
  _height = 2;
  constructor(width, height, floorHeight) {
    this._x = width * 0.2 + 114;
    this._y =
      Math.random() * (height - floorHeight + 12 - (height - floorHeight + 6)) +
      height -
      floorHeight +
      6;
  }
  get opacity() {
    const oldOpacity = this._opacity;
    this._opacity -= 0.02;
    return oldOpacity;
  }
  get width() {
    const oldWidth = this._width;
    if (this._width < 10) {
      this._width++;
    }
    return oldWidth;
  }
  get height() {
    const oldHeight = this._height;
    if (this._height < 10) {
      this._height++;
    }
    return oldHeight;
  }
  get x() {
    const oldX = this._x;
    this._x -= 2;
    return oldX;
  }
  get y() {
    const oldY = this._y;
    this._y -= 0.7;
    return oldY;
  }
}
