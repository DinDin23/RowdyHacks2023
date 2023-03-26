import React, {useState, useEffect} from 'react';
import { Canvas, } from '@react-three/fiber'
import TorusMesh from './TorusMesh';

function App() {
  const camPos = [19, -5, 6] 
  const camRot = [1.6, 0, 0] 


  return (
    <div id="canvas-container" style={{ width: "100vw", height: "100vh" }}>
      <TorusMesh/>
    </div>
  );
}

export default App;
