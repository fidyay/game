export default class Backpack {
    type = 'backpack'
    y = 0 
    hitboxWidth = 48
    hitboxHeight = 72
    constructor(x) {
        this.x = x
    }
    get hitboxX() {
        return this.x + 18
    }
}