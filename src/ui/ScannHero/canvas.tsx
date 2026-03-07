import { Timer } from 'three';
import * as THREE from 'three/webgpu';
import { Canvas, CanvasProps, extend } from '@react-three/fiber';
import { useMemo } from 'react';

extend(THREE as any);

/**
 * Compatibility wrapper for THREE.Timer to satisfy react-three-fiber's expectation of a Clock-like API.
 */
class TimerClock extends Timer {
  getElapsedTime() {
    return this.getElapsed();
  }
}

export const WebGPUCanvas = (props: CanvasProps) => {
  const clock = useMemo(() => new TimerClock(), []);

  return (
    <Canvas
      {...props}
      // @ts-ignore
      clock={clock}
      flat
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer(props as any);
        await renderer.init();
        return renderer;
      }}
    >
      {props.children}
    </Canvas>
  );
};
