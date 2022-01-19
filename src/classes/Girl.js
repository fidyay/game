export default class Girl {
    currentAction = 'running'
    _perf = performance.now()
    _jumpPerf = performance.now()
    _animationState = 0
    hitboxRunningWidth = 36
    // hitboxRunningHeight = 132
    // hitboxSlidingHeight = 78
    hitboxSlidingWidth = 120
    _cv = 14
    _jumpY = 0
    get imageX() {
        const imageX = this._animationState * 192
        if (performance.now() - this._perf >= 60) {
            this._perf = performance.now()
            if (this.currentAction === 'running') {
                if (this._animationState === 7) {
                    this._animationState = 0
                } else {
                    this._animationState++
                }
            } else if (this.currentAction === 'sliding') {
                if (this._animationState === 3) {
                    this._animationState = 0
                } else {
                    this._animationState++
                }
            }

        }
        return imageX
    }
    get y() {
        return this._jumpY
    }
    get jumpY() {
        if (performance.now() - this._jumpPerf >= 60) {
            this._jumpY += this._cv
            if (this._cv < 0 && this._jumpY <= 0) {
                this._cv = 14
                this._jumpY = 0
                this.run()
            }
            if (this._cv <= 0 && this._jumpY > 0) {
                this._cv -= .25
            }
            if (this._cv > 0) {
                this._cv -= .5
            }
        }
        return this._jumpY
    }
    jump() {
        this.currentAction = 'jumping'
        this._animationState = 0
    }
    run() {
        this.currentAction = 'running'
        this._animationState = 0
    }
    slide() {
        this.currentAction = 'sliding'
        this._animationState = 0
    }
    get jumpImageX() {
        if (this._cv > 3) return 0
        if (this._cv >= 0 && this._cv <= 3) return 192
        if (this._cv < 0 && this._cv >= -3) return 384
        if (this._cv < 0 && this._cv >= -14) return 576
        return 0
    }
    get paddingLeft() {
        if (this.currentAction === 'jumping') return 6
        return 0
    }
}