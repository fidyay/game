export default class Chair {
    type = 'chair'
    y = 0
    hitboxWidth = 53
    hitboxHeight = 95
    constructor(x) {
        this.x = x
    }
    get hitboxX() {
        return this.x
    }
}