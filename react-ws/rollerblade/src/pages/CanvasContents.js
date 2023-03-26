import React, {useRef, useState, useEffect} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

export default function CanvasContents(props) {
  const conesRef = useRef([])
  const myMesh = useRef();
  const camera = useThree((state) => state.camera);
  const [coneOrientation, setConeOrientation] = useState(0)  
  const trackRadius = 100
  const trackThickness = 15

 
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();

    let newConeVel = props.coneVel
    /*if (props.wDown) {
      newConeVel += .001
    }*/
    newConeVel *= .99
    if (props.sDown) {
      newConeVel *= .9
    }

    let newConeOrientation = coneOrientation
    if (props.leftDown) {
      newConeOrientation += .01
    }
    if (props.rightDown) {
      newConeOrientation -= .01
    }

    props.setConeVel(newConeVel)
    setConeOrientation(newConeOrientation)

    const oldAngle = Math.atan2(myMesh.current.position.y, myMesh.current.position.x)

    const newX = myMesh.current.position.x + newConeVel*Math.cos(newConeOrientation + Math.PI/2)
    const newY = myMesh.current.position.y + newConeVel*Math.sin(newConeOrientation + Math.PI/2)
    const radius = Math.hypot(newX, newY)
    const angle = Math.atan2(newY, newX)
    if (radius < trackRadius - trackThickness) {
      myMesh.current.position.x = (trackRadius - trackThickness)*Math.cos(angle)
      myMesh.current.position.y = (trackRadius - trackThickness)*Math.sin(angle)
    } else if (radius > trackRadius + trackThickness) {
      myMesh.current.position.x = (trackRadius + trackThickness)*Math.cos(angle)
      myMesh.current.position.y = (trackRadius + trackThickness)*Math.sin(angle)
    } else {
      myMesh.current.position.x = newX
      myMesh.current.position.y = newY
    }

    const newAngle = Math.atan2(myMesh.current.position.y, myMesh.current.position.x) + Math.PI

    const oldCheckpoint = props.lastCheckpoint
    const newCheckpoint = Math.floor(newAngle/(Math.PI/2))
    if (newCheckpoint - oldCheckpoint === 1 || (oldCheckpoint === 3 && newCheckpoint === 0)) {
      props.setLastCheckpoint(newCheckpoint)
      if (oldCheckpoint === 3 && newCheckpoint === 0) {
        props.setLaps(prev => prev + 1)
      }
    }


    camera.position.x = myMesh.current.position.x - 5*Math.cos(newConeOrientation + Math.PI/2)
    camera.position.y = myMesh.current.position.y - 5*Math.sin(newConeOrientation + Math.PI/2)
    camera.rotation.y = newConeOrientation

    props.sendCoords(myMesh.current.position.x, myMesh.current.position.y, newConeOrientation, newConeVel)
  })

  useEffect(() => {
    conesRef.current = conesRef.current.slice(0, props.otherPlayers.length);
    for (let i = 0; i < props.otherPlayers.length; i++) {
      if (props.otherPlayers[i].x && props.otherPlayers[i].y) {
        conesRef.current[i].position.x = props.otherPlayers[i].x
        conesRef.current[i].position.y = props.otherPlayers[i].y
      }
    }
  }, [props.otherPlayers]);

  return (
    <>
      <mesh>
        <torusGeometry args={[trackRadius, trackThickness, 2, 100]} />
        <meshStandardMaterial />
      </mesh>

      <mesh position={[0, 0, .01]}>
        <torusGeometry args={[trackRadius, 1, 2, 100]} />
        <meshBasicMaterial color={"#ff0000"} />
      </mesh>
      
      <mesh ref={myMesh} position={[trackRadius, 0, 2.5]} rotation={[1.6, 0, 0]}>
        <coneGeometry args={[1, 5, 32]}/>
        <meshBasicMaterial color={'#ffff00'}/>
      </mesh>

      {props.otherPlayers && props.otherPlayers.map((e, i) => <mesh 
        ref={el => conesRef.current[i] = el} 
        key={i}
        position={[trackRadius, 0, 2.5]} 
        rotation={[1.6, 0, 0]}>
        <coneGeometry args={[1, 5, 32]}/>
        <meshBasicMaterial color={'#ff9999'}/>
      </mesh>)}
    </>
  )
}
