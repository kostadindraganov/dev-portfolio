'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLenis } from 'lenis/react';
import Media from './MediaClass';
import { Size } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function PixelImageEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediasRef = useRef<Media[]>([]);

  // Add Lenis integration to update ScrollTrigger properly
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let sizes: Size;
    
    const init = () => {
      // 1. Setup Three.js Scene
      scene = new THREE.Scene();
      
      const fov = 75;
      camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 10;
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        alpha: true,
        antialias: true
      });
      
      const pixelRatio = Math.min(2, window.devicePixelRatio);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Calculcate sizing at current Z distance
      const height = camera.position.z * Math.tan((fov * Math.PI) / 180 / 2) * 2;
      const width = height * camera.aspect;
      sizes = { width, height };

      // 2. Gather Images (skip hero, cards, and gallery section to avoid conflicts)
      const imageElements = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter(
         img => !img.closest('.hero') && 
                !img.closest('header') && 
                !img.closest('nav') && 
                !img.closest('.featured-project-card') && 
                !img.closest('.gallery-callout') && 
                !img.closest('.spotlight') &&
                !img.closest('[class*="logo"]') &&
                !img.closest('[id*="logo"]') &&
                !img.classList.contains('skip-pixel-effect') &&
                img.src
      );

      console.log("PIXEL EFFECT - Found images to track:", imageElements.length);
      console.log("PIXEL EFFECT - Image targets:", imageElements);

      // 3. Create Media Instances
      mediasRef.current = imageElements.map((img) => {
        const media = new Media({
          element: img,
          scene,
          sizes,
        });
        media.observe();
        return media;
      });
    };

    const render = () => {
      // we can read scroll from window or GSAP scroll trigger instead if we had one global scroller
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.scrollY;

      mediasRef.current.forEach((media) => {
        media.updateScroll(scrollTop);
      });

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const fov = camera.fov * (Math.PI / 180);
      const height = camera.position.z * Math.tan(fov / 2) * 2;
      const width = height * camera.aspect;
      sizes = { width, height };

      mediasRef.current.forEach((media) => {
        media.onResize(sizes);
      });

      ScrollTrigger.refresh();
    };

    init();
    
    // Use GSAP ticker instead of requestAnimationFrame to run in sync with scroll
    gsap.ticker.add(render);
    window.addEventListener('resize', handleResize);

    // Initial render fix
    setTimeout(() => {
        ScrollTrigger.refresh();
        render();
    }, 500); // Sometimes images load late, timeout ensures correct bounds 

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener('resize', handleResize);
      mediasRef.current.forEach(media => media.destroy());
      mediasRef.current = [];
      if (renderer) renderer.dispose();
      // clean up ThreeJS 
      scene?.clear();
    };
  }, []);

  return (
    <div 
        ref={containerRef} 
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1
        }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
