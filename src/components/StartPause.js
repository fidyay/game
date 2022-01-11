import { useState } from "react"

export default function StartPause({}) {
    const [playing, setPlaying] = useState(false)
    return (
        <svg onClick={() => setPlaying(!playing)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d={`${playing ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z'}`}/>
        </svg>
    )
}