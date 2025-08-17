import { useMemo, useRef } from "react";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import myFontJson from "../../assets/helvetiker_regular.typeface.json";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh } from "three";

export default function Text3D(props: {
  text: string;
  pos: [number, number, number];
  color: string;
  size: number;
  opacity: number;
  faceCamera?: boolean;
}) {
  const { faceCamera = false } = props;
  const ref = useRef<Mesh | null>(null);
  const { camera } = useThree();
  const textGeometry = useMemo(() => {
    const loader = new FontLoader();
    const font: Font = loader.parse(myFontJson);

    return new TextGeometry(props.text, {
      font,
      size: props.size,
      depth: 0,
    });
  }, [props.pos, props.text, props.size]);

  useFrame(() => {
    if (faceCamera) {
      if (!ref.current) return;
      ref.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={ref} geometry={textGeometry} position={props.pos}>
      <meshPhongMaterial
        attach="material"
        color={props.color}
        transparent={true}
        opacity={props.opacity}
      />
    </mesh>
  );
}
