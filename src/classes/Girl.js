export default class Girl {
    currentAction = 'running'
    _perf = performance.now()
    _animationState = 0
    get imageX() {
        const imageX = this._animationState * 192
        if (performance.now() - this._perf >= 60) {
            this._perf = performance.now()
            if (this._animationState === 7) {
                this._animationState = 0
            } else {
                this._animationState++
            }

        }
        return imageX
    }
}