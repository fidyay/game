import { useState, useCallback, useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions.js";
import getRandomPosition from "../functions/getRandomPosition.js";
import getNewObstacleType from "../functions/getNewObstacleType.js";
import WallpaperClass from "../classes/Wallpaper.js";
import CageClass from "../classes/Cage.js";
import FloorClass from "../classes/Floor.js";
import ChairClass from "../classes/Chair.js";
import BackpackClass from "../classes/Backpack.js";
import ParrotClass from "../classes/Parrot.js";
import GirlClass from "../classes/Girl.js";
import Particle from "../classes/Particle.js";
import WallpaperSource from "../sprites/wallpaper.png";
import FloorSource from "../sprites/floor.png";
import CageSource from "../sprites/cage.png";
import ChairSource from "../sprites/chair.png";
import BackpackSource from "../sprites/backpack.png";
import ParrotSource from "../sprites/parrot.png";
import GirlRunningSource from "../sprites/girl_running.png";
import GirlJumpingSource from "../sprites/girl_jumping.png";
import GirlSlidingSource from "../sprites/girl_sliding.png";

const Wallpaper = new Image()
Wallpaper.src = WallpaperSource
const Floor = new Image()
Floor.src = FloorSource
const Cage = new Image()
Cage.src = CageSource
const Chair = new Image()
Chair.src = ChairSource
const Backpack = new Image()
Backpack.src = BackpackSource
const Parrot = new Image()
Parrot.src = ParrotSource
const GirlRunning = new Image()
GirlRunning.src = GirlRunningSource
const GirlJumping = new Image()
GirlJumping.src = GirlJumpingSource
const GirlSliding = new Image()
GirlSliding.src = GirlSlidingSource

const wallpaperWidth = 84
const floorWidth = 192
const floorHeight = 72
const cageHeight = 102
const cageWidth = 94
const chairHeight = 95
const chairWidth = 53
const backpackHeight = 82
const backpackWidth = 85
const parrotWidth = 46
const parrotHeight = 28
const girlRunningWidth = 66
const girlRunningHeight = 132
const girlJumpingWidth = 78
const girlJumpingHeight = 156
const girlSlidingWidth = 120
const girlSlidingHeight = 78

export default function GameField() {
    const {height, width} = useWindowDimensions()
    const [canvas, setCanvas] = useState(null)

    const getCanvas = useCallback(element => {
        if (element === null) return
        setCanvas(element)
    }, [setCanvas])

    function startGame() {
        if (!canvas) return
        const cd = canvas.getContext('2d')
        const wallpaperColumns = Math.ceil(width/wallpaperWidth)
        const wallpaperRows = Math.ceil(height/wallpaperWidth)
        const floorUnits = Math.ceil(width/floorWidth)
        const wallpapers = []
        const floors = []
        const obstacles = []
        const particles = []
        let movingSpeed = 8
        let perf = performance.now()
        const Player = new GirlClass()

        document.addEventListener('keydown', e => {
            const code = e.code
            if (Player.currentAction !== 'jumping' && Player.currentAction !== 'sliding') {
                if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') {
                    Player.jump()
                }
            }
            if (Player.currentAction !== 'sliding' && Player.currentAction !== 'jumping') {
                if (code === 'KeyS' || code === 'ArrowDown') {
                    Player.slide()
                }
            }
        }) 

        document.addEventListener('keyup', e => {
            const code = e.code
            if (Player.currentAction === 'sliding') {
                if (code === 'KeyS' || code === 'ArrowDown') {
                    Player.run()
                }
            }
        })


        function draw() {
            // initialize state to start

            if (wallpapers.length === 0) {
                for (let i = 0; i < wallpaperColumns; i++) {
                    for (let j = 0; j < wallpaperRows; j++) {
                        wallpapers.push(new WallpaperClass(wallpaperWidth * i, wallpaperWidth * j))
                    }
                }
            }

            if (floors.length === 0) {
                for (let i = 0; i < floorUnits; i++) {
                    floors.push(new FloorClass(i * floorWidth))
                }
            }

            if (obstacles.length === 0) {
                obstacles.push(new CageClass(width + getRandomPosition()))
            }

            if (Player.currentAction !== 'sliding' && particles.length > 0) {
                particles.length = 0
            }

            // drawing current state of the game
    
            cd.clearRect(0, 0, width, height)

            wallpapers.forEach(wallpaper => {
                cd.drawImage(Wallpaper, wallpaper.x, wallpaper.y)
            })
            floors.forEach(floor => {
                cd.drawImage(Floor, floor.x, height - floorHeight)
            })
            obstacles.forEach(obstacle => {
                switch (obstacle.type) {
                    case 'cage':
                        cd.drawImage(Cage, obstacle.x, height - floorHeight + 12 - cageHeight)
                        break
                    case 'chair':
                        cd.drawImage(Chair, obstacle.x, height - floorHeight + 12 - chairHeight)
                        break
                    case 'backpack':
                        cd.drawImage(Backpack, obstacle.x, height - floorHeight + 12 - backpackHeight) 
                        break
                    case 'parrot':
                        cd.drawImage(Parrot, obstacle.imageX, 0, parrotWidth, parrotHeight, obstacle.x, height - floorHeight + 12 - parrotHeight - 100, parrotWidth, parrotHeight) 
                        break
                    default: 
                        cd.drawImage(Cage, obstacle.x, height - floorHeight + 12 - cageHeight)
                        break
                }
            })

            // drawing player

            if (Player.currentAction === 'running') {
                cd.drawImage(GirlRunning, Player.imageX, 0, girlRunningWidth, girlRunningHeight, width * .2, height - floorHeight + 12 - girlRunningHeight, girlRunningWidth, girlRunningHeight)
            } else if (Player.currentAction === 'jumping') {
                cd.drawImage(GirlJumping, Player.jumpImageX, 0, girlJumpingWidth, girlJumpingHeight, width * .2, height - floorHeight + 12 - girlJumpingHeight - Player.jumpY, girlJumpingWidth, girlJumpingHeight)
            } else if (Player.currentAction === 'sliding') {
                cd.drawImage(GirlSliding, Player.imageX, 0, girlSlidingWidth, girlSlidingHeight, width * .2, height - floorHeight + 12 - girlSlidingHeight, girlSlidingWidth, girlSlidingHeight)
            }

            // drawing particles

            if (Player.currentAction === 'sliding') {
                const transparentParticlesIndex = []
                particles.forEach((particle, index) => {
                    if (particle._opacity <= 0) {
                        transparentParticlesIndex.push(index)
                    }
                })
                transparentParticlesIndex.forEach(index => {
                    particles.splice(index, 1)
                })
                particles.forEach(particle => {
                    cd.fillStyle = `rgba(238, 211, 164, ${particle.opacity})`
                    cd.fillRect(particle.x, particle.y, particle.width, particle.height)
                })
            }

            // adding particles while sliding
            if (Player.currentAction === 'sliding') {
                particles.push(new Particle(width, height, floorHeight))
            }

            if ((performance.now() - perf) >= 16) {
                perf = performance.now()
                
                // computing next state

                // computing wallpapers

                wallpapers.forEach(wallpaper => {
                    wallpaper.x -= movingSpeed
                })
                wallpapers.forEach((wallpaper, index) => {
                    if (wallpaper.x + wallpaperWidth <= 0) {
                        wallpapers.splice(index, 1)
                    }
                })
                if ((wallpapers[wallpapers.length - 1].x + wallpaperWidth) <= width) {
                    const lastX = wallpapers[wallpapers.length - 1].x + wallpaperWidth
                    for (let i = 0; i < wallpaperRows; i++) {
                        wallpapers.push(new WallpaperClass(lastX, i * wallpaperWidth))
                    }
                }

                // computing floors
                
                floors.forEach(floor => {
                    floor.x -= movingSpeed
                })

                if (floors[0].x + floorWidth <= 0) {
                    floors.shift()
                }

                if ((floors[floors.length - 1].x + floorWidth) <= width) {
                    floors.push(new FloorClass(floors[floors.length - 1].x + floorWidth))
                }


                // computing obstacles 
                obstacles.forEach(obstacle => {
                    obstacle.x -= movingSpeed
                })

                if (obstacles[0].x + cageWidth <= 0) {
                    obstacles.shift()
                }

                if ((obstacles[obstacles.length - 1].x + cageWidth) <= width) {
                    const type = getNewObstacleType()
                    switch (type) {
                        case 'cage':
                            obstacles.push(new CageClass(obstacles[obstacles.length - 1].x + cageWidth + getRandomPosition())) 
                            break
                        case 'chair':
                            obstacles.push(new ChairClass(obstacles[obstacles.length - 1].x + chairWidth + getRandomPosition())) 
                            break
                        case 'backpack':
                            obstacles.push(new BackpackClass(obstacles[obstacles.length - 1].x + backpackWidth + getRandomPosition())) 
                            break
                        case 'parrot':
                            obstacles.push(new ParrotClass(obstacles[obstacles.length - 1].x + parrotWidth + getRandomPosition())) 
                            break
                        default: 
                            obstacles.push(new CageClass(obstacles[obstacles.length - 1].x + cageWidth + getRandomPosition()))
                            break
                    }



                }
            }




            requestAnimationFrame(draw)
        }

        requestAnimationFrame(draw)
        
    }

    useEffect(startGame, [canvas, width, height])
    


    return (
        <canvas ref={getCanvas} height={height} width={width}/>
    )
}