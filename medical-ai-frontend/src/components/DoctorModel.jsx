// DoctorModel.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const DoctorModel = () => {
  const gltf = useGLTF("/models/doctor.glb"); // ✅ reference public path
  return <primitive object={gltf.scene}  rotation={[0, -Math.PI/9, 0]} scale={3.5} position={[-0.2, -3.8, 0] } />;
};

export default DoctorModel;
