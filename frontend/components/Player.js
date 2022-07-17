import React, { useEffect, useRef, useState } from 'react'
import Control from './player/Control'
import Display from './player/Display'
import Misc from './player/Misc'
import Playlist from './player/Playlist'
import { FaPlay } from 'react-icons/fa'
import ReactHowler from 'react-howler'
import dynamic from 'next/dynamic'
const DynamicAudio = dynamic(() => import('./player/Audio'), {
    ssr: false,
})
const Player = () => {
    const [userEngaged, setUserEngaged] = useState(false)
    const [play, setPlay] = useState(false)
    const [staticPlay, setStaticPlay] = useState(false)
    const [loaded, setLoaded] = useState(true)
    const [volume, setVolume] = useState(60)
    const [activeTrack, setActiveTrack] = useState({
        name: 'Lofi Hip Hop',
        audio: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    })
    const timeOut = useRef()
    const staticPlayer = useRef()

    useEffect(() => {
        setStaticPlay(true)
        timeOut.current = setTimeout(() => {
            setStaticPlay(false)
        }, 650)
        return (() => {
            clearTimeout(timeOut.current)
        })
    }, [activeTrack])
    useEffect(() => {
        setLoaded(true)
    }, [])
    useEffect(() => {
        if (!userEngaged) window.addEventListener("keypress", () => { setUserEngaged(true) })
        return (() => {
            window.removeEventListener("keypress", () => { setUserEngaged(true) })
        })
    }, [userEngaged])

    return (
        <>
            <Display
                trackName={userEngaged ? activeTrack.name : ""}
            />
            {userEngaged ?
                <>
                    <Control
                        play={play}
                        setPlay={setPlay}
                        activeTrack={activeTrack}
                        setActiveTrack={setActiveTrack}
                        volume={volume}
                        setVolume={setVolume}
                    />
                    <Playlist
                        setActiveTrack={setActiveTrack}
                    />
                    <Misc />
                </> :
                <button className="rounded-md absolute bottom-1 md:bottom-7 left-1 md:left-7 p-5 color-re z-10 bg-yellow-50  flex flex-col items-center" onClick={() => {
                    setUserEngaged(true)
                }}>
                    <p>Press <FaPlay className='mx-1 inline text-lg text-yellow-700 hover:text-yellow-400' />or any key to start</p>
                    <p className='sm:hidden'>(This site is optimized for desktop.)</p>
                </button>
            }
            {/* AUDIO SRC HERE ============================================================== */}
            <div style={{ position: 'absolute', maxWidth: '0px', pointerEvents: 'none' }}>
                <DynamicAudio activeTrack={activeTrack} play={play} volume={volume} />
            </div>
            <ReactHowler
                ref={staticPlayer}
                src='/media/static.mp3'
                playing={staticPlay}
                volume={.4}
                loop={true}
                onPause={() => staticPlayer.current.seek(1)}
            />
        </>
    )
}



export default Player

