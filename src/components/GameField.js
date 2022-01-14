import { useState, useCallback, useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions.js";
import getRandomPosition from "../functions/getRandomPosition.js";
import WallpaperClass from "../classes/Wallpaper.js";
import CageClass from "../classes/Cage.js";
import FloorClass from "../classes/Floor.js";
import WallpaperSource from "../sprites/wallpaper.png";
import FloorSource from "../sprites/floor.png";
import CageSource from "../sprites/cage.png";

const Wallpaper = new Image()
Wallpaper.src = WallpaperSource
const Floor = new Image()
Floor.src = FloorSource
const Cage = new Image()
Cage.src = CageSource

const wallpaperWidth = 84
const floorWidth = 192
const floorHeight = 72
const cageHeight = 102
const cageWidth = 94

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

            // drawing current state of the game
            
            wallpapers.forEach(wallpaper => {
                cd.drawImage(Wallpaper, wallpaper.x, wallpaper.y)
            })
            floors.forEach(floor => {
                cd.drawImage(Floor, floor.x, height - floorHeight)
            })
            obstacles.forEach(obstacle => {
                cd.drawImage(Cage, obstacle.x, height - floorHeight + 12 - cageHeight)
            })

            // computing next state

            // computing wallpapers

            wallpapers.forEach(wallpaper => {
                wallpaper.x -= 1
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
                floor.x -= 1
            })

            if (floors[0].x + floorWidth <= 0) {
                floors.shift()
            }

            if ((floors[floors.length - 1].x + floorWidth) <= width) {
                floors.push(new FloorClass(floors[floors.length - 1].x + floorWidth))
            }


            // computing obstacles 
            obstacles.forEach(obstacle => {
                obstacle.x -= 1
            })

            if (obstacles[0].x + cageWidth <= 0) {
                obstacles.shift()
            }

            if ((obstacles[obstacles.length - 1].x + cageWidth) <= width) {
                obstacles.push(new CageClass(obstacles[obstacles.length - 1].x + cageWidth + getRandomPosition()))
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