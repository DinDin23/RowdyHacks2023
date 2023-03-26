import React, {useState, useEffect} from 'react';
import { Canvas, } from '@react-three/fiber'
import CanvasContents from './CanvasContents';

export default function Game(props) {
  const camRot = [1.6, 0, 0] 

  const [wDown, setWDown] = useState(false)
  const [aDown, setADown] = useState(false)
  const [dDown, setDDown] = useState(false)
  const [sDown, setSDown] = useState(false)


  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "w") {
        setWDown(true)
      }
      if (e.key === "a") {
        setADown(true)
      }
      if (e.key === "d") {
        setDDown(true)
      }
      if (e.key === "s") {
        setSDown(true)
      }
    }

    function handleKeyUp(e) {
      if (e.key === "w") {
        setWDown(false)
      }
      if (e.key === "a") {
        setADown(false)
      }
      if (e.key === "d") {
        setDDown(false)
      }
      if (e.key === "s") {
        setSDown(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
    }
  }, [])

  

 

  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{fov: 75, near: 0.1, far: 1000, position: [20, -5, 2.5], rotation: camRot}}>
        <CanvasContents 
          aDown={aDown} wDown={wDown} dDown={dDown} sDown={sDown}
          otherPlayers={props.otherPlayers}
          sendCoords={props.sendCoords}
        />
      </Canvas>
    </div>
  );
}