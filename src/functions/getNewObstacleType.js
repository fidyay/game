export default function getNewObstacleType() {
    const number = Math.floor(Math.random() * 4)
    let type

    switch (number) {
        case 0: 
            type = 'cage'
            break
        case 1:
            type = 'chair'
            break
        case 2:
            type = 'backpack'
            break
        case 3:
            type = 'parrot'
            break 
        default: 
            type = 'cage'
            break
    }

    return type
}