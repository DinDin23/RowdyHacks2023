import React, {useRef, useState, useEffect} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

export default function CanvasContents(props) {
  const conesRef = useRef([])
  const myMesh = useRef();
  const camera = useThree((state) => state.camera);
  const [coneOrientation, setConeOrientation] = useState(0)
  const [coneVel, setConeVel] = useState(0)
  
 

 
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();

    let newConeVel = coneVel
    if (props.wDown) {
      newConeVel += .001
    }
    newConeVel *= .99
    if (props.sDown) {
      newConeVel *= .9
    }

    let newConeOrientation = coneOrientation
    if (props.aDown) {
      newConeOrientation += .01
    }
    if (props.dDown) {
      newConeOrientation -= .01
    }

    setConeVel(newConeVel)
    setConeOrientation(newConeOrientation)

    myMesh.current.position.x += newConeVel*Math.cos(newConeOrientation + Math.PI/2)
    myMesh.current.position.y += newConeVel*Math.sin(newConeOrientation + Math.PI/2)

    const angle = Math.atan2(myMesh.current.position.y, myMesh.current.position.x)
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
        <torusGeometry args={[40, 11, 2, 100]} />
        <meshStandardMaterial />
      </mesh>

      <mesh position={[0, 0, .01]}>
        <torusGeometry args={[40, 1, 2, 100]} />
        <meshBasicMaterial color={"#ff0000"} />
      </mesh>
      
      <mesh ref={myMesh} position={[40, 0, 2.5]} rotation={[1.6, 0, 0]}>
        <coneGeometry args={[1, 5, 32]}/>
        <meshBasicMaterial color={'#ffff00'}/>
      </mesh>

      {props.otherPlayers && props.otherPlayers.map((e, i) => <mesh 
        ref={el => conesRef.current[i] = el} 
        key={i}
        position={[40, 0, 2.5]} 
        rotation={[1.6, 0, 0]}>
        <coneGeometry args={[1, 5, 32]}/>
        <meshBasicMaterial color={'#ff9999'}/>
      </mesh>)}
    </>
  )
}
