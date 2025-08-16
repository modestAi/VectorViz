import { useMemo } from "react";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import myFontJson from "../assets/helvetiker_regular.typeface.json";

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
