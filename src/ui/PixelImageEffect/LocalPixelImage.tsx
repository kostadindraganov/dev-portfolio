'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { fragmentShader, vertexShader } from '@/lib/shaders/pixelEffect';

gsap.registerPlugin(ScrollTrigger);

export default function LocalPixelImage({ 
  src, 
  alt, 
  className 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!mountRef.current || !canvasRef.current) return;

    // Set up a basic scene
    const scene = new THREE.Scene();
    // Use an Orthographic camera because we just want the plane to fill exactly 1x1 units
    // which scales to match the canvas aspect ratio via CSS width/height.
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    const pixelRatio = Math.min(2, window.devicePixelRatio);
    renderer.setPixelRatio(pixelRatio);

    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uContainerRes: { value: new THREE.Vector2(1, 1) },
        uProgress: { value: 0 },
        uGridSize: { value: 15 },
        uColor: { value: new THREE.Color('#8c8a8aff') },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const updateSize = () => {
      if (!mountRef.current || !renderer) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height, false); // false means don't set style width/height
      material.uniforms.uContainerRes.value.set(width, height);
    };

    let ctx = gsap.context(() => {});

    const texLoader = new THREE.TextureLoader();
    texLoader.load(src, (texture) => {
      material.uniforms.uTexture.value = texture;
      material.uniforms.uResolution.value.set(
        texture.image.naturalWidth,
        texture.image.naturalHeight
      );
      updateSize();
      renderer.render(scene, camera);

      // Add scroll trigger
      ctx.add(() => {
        gsap.to(material.uniforms.uProgress, {
          value: 1,
          scrollTrigger: {
            // Use the parent card container as trigger to sync perfectly
            trigger: mountRef.current!.closest('.featured-project-card') || mountRef.current,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play reset restart reset',
          },
          duration: 1.8,
          ease: 'linear',
        });
      });
    });

    // Render loop
    const render = () => {
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(mountRef.current);

    return () => {
      gsap.ticker.remove(render);
      resizeObserver.disconnect();
      ctx.revert();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [src]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Invisible image handles semantics, right click saves, and container sizing */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
        }}
      />
    </div>
  );
}
