import React, {useState, useEffect, useRef} from 'react';
import { Canvas, } from '@react-three/fiber'
import CanvasContents from './CanvasContents';

export default function Game(props) {
  const camRot = [1.6, 0, 0] 

  const [aDown, setADown] = useState(false)
  const [dDown, setDDown] = useState(false)
  const [sDown, setSDown] = useState(false)
  const [leftDown, setLeftDown] = useState(false)
  const [rightDown, setRightDown] = useState(false)
  const [coneVel, setConeVel] = useState(0)
  const lastSkate = useRef("")
  const [lastCheckpoint, setLastCheckpoint] = useState(0)
  const [laps, setLaps] = useState(0)



  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "a") {
        setADown(true);
      }

      if (e.key === "d") {
        setDDown(true);
      }

      if (e.key === "s") {
        setSDown(true)
      }

      if (e.key === "ArrowLeft") {
        setLeftDown(true)
      }

      if (e.key === "ArrowRight") {
        setRightDown(true)
      }
      
    }

    function handleKeyUp(e) {
      if (e.key === "a" || e.key === "d") {
        if (e.key !== lastSkate.current) {
          setConeVel(prev => prev + .05)
          lastSkate.current = e.key
        }
      }
      if (e.key === "a") {
        setADown(false);
      }

      if (e.key === "d") {
        setDDown(false);
      }

      if (e.key === "s") {
        setSDown(false)
      }

      if (e.key === "ArrowLeft") {
        setLeftDown(false)
      }
      if (e.key === "ArrowRight") {
        setRightDown(false)
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
      <div className="lapInfo">
        <h3>{laps} out of 5 laps completed</h3>
        {props.otherPlayers && props.otherPlayers.map((e, i) => <h3 key={i}>{e.username} {e.laps}</h3>)}
      </div>
      <Canvas camera={{fov: 75, near: 0.1, far: 1000, position: [20, -5, 2.5], rotation: camRot}}>
        <CanvasContents 
          aDown={aDown}
          dDown={dDown}
          sDown={sDown}
          otherPlayers={props.otherPlayers}
          sendCoords={props.sendCoords}
          coneVel={coneVel} setConeVel={setConeVel}
          leftDown={leftDown}
          rightDown={rightDown}
          lastCheckpoint={lastCheckpoint}
          setLastCheckpoint={setLastCheckpoint}
          setLaps={setLaps}
          laps={laps}
          broadcastLap={props.broadcastLap}
        />
      </Canvas>
    </div>
  );
}