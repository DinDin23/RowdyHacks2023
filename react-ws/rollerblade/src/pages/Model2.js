import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Model(props) {

  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/rollergrandma.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log(actions);
    actions["Armature|mixamo.com|Layer0"].play();
    actions["Armature|mixamo.com|Layer0.001"].play();
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Fitness_Grandma_BrowsAnimGeo"
            geometry={nodes.Fitness_Grandma_BrowsAnimGeo.geometry}
            material={materials["FitGrandma_Brows_MAT1.001"]}
            skeleton={nodes.Fitness_Grandma_BrowsAnimGeo.skeleton}
          />
          <skinnedMesh
            name="Fitness_Grandma_EyesAnimGeo"
            geometry={nodes.Fitness_Grandma_EyesAnimGeo.geometry}
            material={materials["FitGrandma_Eyes_MAT1.001"]}
            skeleton={nodes.Fitness_Grandma_EyesAnimGeo.skeleton}
          />
          <skinnedMesh
            name="Fitness_Grandma_MouthAnimGeo"
            geometry={nodes.Fitness_Grandma_MouthAnimGeo.geometry}
            material={materials["FitGrandma_Mouth_MAT1.001"]}
            skeleton={nodes.Fitness_Grandma_MouthAnimGeo.skeleton}
          />
          <group name="Fitness_Grandma_BodyGeo">
            <skinnedMesh
              name="Fitness_Grandma_BodyGeo001"
              geometry={nodes.Fitness_Grandma_BodyGeo001.geometry}
              material={materials["Grandma_MAT.001"]}
              skeleton={nodes.Fitness_Grandma_BodyGeo001.skeleton}
            />
            <skinnedMesh
              name="Fitness_Grandma_BodyGeo001_1"
              geometry={nodes.Fitness_Grandma_BodyGeo001_1.geometry}
              material={materials["Lens_MAT.001"]}
              skeleton={nodes.Fitness_Grandma_BodyGeo001_1.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/rollergrandma.gltf");
