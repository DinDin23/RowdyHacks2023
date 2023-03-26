import React, {useRef, useState} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

export default function CanvasContents(props) {
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

    console.log(`delta x: ${newConeVel*Math.cos(newConeOrientation + Math.PI/2)}`)
    myMesh.current.position.x += newConeVel*Math.cos(newConeOrientation + Math.PI/2)
    myMesh.current.position.y += newConeVel*Math.sin(newConeOrientation + Math.PI/2)

    const angle = Math.atan2(myMesh.current.position.y, myMesh.current.position.x)
    camera.position.x = myMesh.current.position.x - 5*Math.cos(newConeOrientation + Math.PI/2)
    camera.position.y = myMesh.current.position.y - 5*Math.sin(newConeOrientation + Math.PI/2)
    camera.rotation.y = newConeOrientation




    console.log(myMesh.current.position)


  })
  return (
    <>
      <mesh>
        <torusGeometry args={[20, 7, 2, 100]} />
        <meshStandardMaterial />
      </mesh>

      <mesh position={[0, 0, .01]}>
        <torusGeometry args={[20, 1, 2, 100]} />
        <meshBasicMaterial color={"#ff0000"} />
      </mesh>
      <mesh ref={myMesh} position={[20, 0, 2.5]} rotation={[1.6, 0, 0]}>
        <coneGeometry args={[1, 5, 32]}/>
        <meshBasicMaterial color={'#ffff00'}/>
      </mesh>
    </>
  )
}