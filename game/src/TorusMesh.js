import React, {useRef} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
export default function TorusMesh(props) {
  const myMesh = useRef();


  useFrame(({ clock, state }) => {
    const a = clock.getElapsedTime()
    //props.setCamPos(prev => [prev[0] + a*.1, prev[1] + a*.1, prev[2] + a*.1,]) // the value will be 0 at scene initialization and grow each frame
  

  })
  return (
    <Canvas camera={{fov: 75, near: 0.1, far: 1000, position: camPos, rotation: camRot}}>
        <mesh ref={myMesh}>
        <torusGeometry args={[20, 7, 2, 100]} />
        <meshStandardMaterial />
      </mesh>
        <mesh>
          <coneGeometry args={[1, 5, 32]} />
          <meshStandardMaterial color='#ffff00' />
        </mesh>
      </Canvas>
  )
}