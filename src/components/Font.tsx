// Text3D.tsx
import { useMemo } from "react";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import myFontJson from "../assets/helvetiker_regular.typeface.json";

const loader = new FontLoader();
const font: Font = loader.parse(myFontJson);

export default function Text3D(props: {
  text: string;
  pos: [number, number, number];
  color: string;
  size: number;
  opacity: number;
}) {
  const textGeometry = useMemo(() => {
    const loader = new FontLoader();
    const font: Font = loader.parse(myFontJson);

    return new TextGeometry(props.text, {
      font,
      size: props.size,
      depth: 0,
    });
  }, []);

  // textGeometry.center();
  return (
    <mesh geometry={textGeometry} position={props.pos}>
      <meshPhongMaterial
        attach="material"
        color={props.color}
        transparent={true}
        opacity={props.opacity}
      />
    </mesh>
  );
}

// export function Text2DMesh(text: string, position: [number, number, number]): THREE.Mesh {
//   // Create canvas texture
//   const canvas = document.createElement("canvas");
//   canvas.width = 1000;
//   canvas.height = 200;
//   const ctx = canvas.getContext("2d")!;
//   ctx.fillStyle = "white";
//   ctx.font = "64px monospace";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText(text, canvas.width / 2, canvas.height / 2);

//   const texture = new THREE.CanvasTexture(canvas);

//   // Create geometry
//   const geometry = new THREE.PlaneGeometry(5, 1);

//   // Create material with texture
//   const material = new THREE.MeshBasicMaterial({
//     map: texture,
//     transparent: true,
//   });

//   // Create mesh
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.set(position[0], position[1], position[2]);

//   return mesh;
// }

// export function createText3DMesh(params: {
//   text: string;
//   pos: THREE.Vector3;
//   color: string;
//   size: number;
//   opacity: number;
// }) {
//   const { color, opacity, size, pos, text } = params;

//   const geometry = new TextGeometry(text, {
//     font,
//     size,
//     depth: 0,
//   });

//   const material = new THREE.MeshPhongMaterial({
//     color,
//     opacity,
//     transparent: opacity < 1,
//   });

//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.copy(pos);
//   return mesh;
// }

// export function updateText3DMesh(mesh: THREE.Mesh, text: string, pos: THREE.Vector3, size: number) {
//   // Dispose old geometry
//   mesh.geometry.dispose();

//   // Create new geometry
//   mesh.geometry = new TextGeometry(text, {
//     font,
//     size,
//     depth: 0,
//   });

//   // Update position
//   mesh.position.copy(pos);
// }
