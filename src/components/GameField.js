import { useRef } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import WallpaperSource from "../sprites/wallpaper.png";

const Wallpaper = new Image()
Wallpaper.source = WallpaperSource



const wallpaperWidth = 192

export default function GameField() {
    const {height, width} = useWindowDimensions()
    const canvas = useRef(null)
    const ctx = useRef(null)


    const draw = () => {
        if (!canvas.current) return
        if (!ctx.current) {
            ctx.current = canvas.current.getContext('2d')
        }
        ctx.current.clearRect(0, 0, height, width)
        const wallpaperColumns = Math.ceil(width/wallpaperWidth)
        const wallpaperRows = Math.ceil(height/wallpaperWidth)
        for (let i = 1; i <= wallpaperColumns; i++) {
            for (let j = 1; i <= wallpaperRows; j++) {
                ctx.current.drawImage(Wallpaper, i*wallpaperWidth, j*wallpaperWidth)
            }
        }

        requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)

    return (
        <canvas ref={canvas} height={height} width={width}/>
    )
}