import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const DoctorModel = () => {
  const gltf = useGLTF("/models/doctor.glb");
  return <primitive object={gltf.scene} rotation={[0, -Math.PI/9, 0]} scale={3.7} position={[-0.6, -3.8, 0]} />;
};

const DoctorScene = ({ isMobile }) => {
  return (
    <Canvas camera={{ position: [0, 0, 6.1], fov: isMobile ? 35 : 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <DoctorModel />
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        enablePan={false}
      />
    </Canvas>
  );
};

export default DoctorScene;