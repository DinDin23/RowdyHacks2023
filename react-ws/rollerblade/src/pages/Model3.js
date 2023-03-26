import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Model3(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/rollergrandma.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log(actions);
    actions["Armature|mixamo.com|Layer0"].play();
    actions["Armature.001|mixamo.com|Layer0"].play();
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Ch03"
            geometry={nodes.Ch03.geometry}
            material={materials.Ch03_Body}
            skeleton={nodes.Ch03.skeleton}
          />
        </group>
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips_1} />
          <skinnedMesh
            name="Ch03001"
            geometry={nodes.Ch03001.geometry}
            material={materials["Ch03_Body.001"]}
            skeleton={nodes.Ch03001.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/rollerbladinggirl.gltf");