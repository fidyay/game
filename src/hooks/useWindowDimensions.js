import { useState } from "react"

export default function useWindowDimensions() {
    const [size, setSize] = useState({height: document.documentElement.clientHeight, width: document.documentElement.clientWidth})
    window.onresize = () => {
        setSize({height: document.documentElement.clientHeight, width: document.documentElement.clientWidth})
    }
    return size
}