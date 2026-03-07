import * as THREE from 'three';
import { Size, Position } from './types';
import { gsap } from 'gsap';
import { fragmentShader, vertexShader } from '@/lib/shaders/pixelEffect';

export default class Media {
  element: HTMLImageElement;
  scene: THREE.Scene;
  sizes: Size;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  nodeDimensions: Size;
  meshDimensions: Size;
  meshPostion: Position;
  elementBounds: DOMRect;
  currentScroll: number;
  lastScroll: number;
  scrollSpeed: number;
  scrollTrigger!: globalThis.ScrollTrigger;

  constructor({
    element,
    scene,
    sizes,
  }: {
    element: HTMLImageElement;
    scene: THREE.Scene;
    sizes: Size;
  }) {
    this.element = element;
    this.scene = scene;
    this.sizes = sizes;

    this.currentScroll = 0;
    this.lastScroll = 0;
    this.scrollSpeed = 0;

    // Use non-null assertion because we initialize them in methods
    this.geometry = undefined!;
    this.material = undefined!;
    this.mesh = undefined!;
    this.nodeDimensions = undefined!;
    this.meshDimensions = undefined!;
    this.meshPostion = undefined!;
    this.elementBounds = undefined!;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
    
    this.setNodeBounds();
    this.setMeshDimensions();
    this.setMeshPosition();
    this.setTexture();

    this.scene.add(this.mesh);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(new THREE.Vector4()),
        uResolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uContainerRes: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uProgress: new THREE.Uniform(0),
        uGridSize: new THREE.Uniform(20),
        uColor: new THREE.Uniform(new THREE.Color('#ffffff')),
      },
      transparent: true,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setNodeBounds() {
    this.elementBounds = this.element.getBoundingClientRect();

    this.nodeDimensions = {
      width: this.elementBounds.width,
      height: this.elementBounds.height,
    };
  }

  setMeshDimensions() {
    this.meshDimensions = {
      width: (this.nodeDimensions.width * this.sizes.width) / window.innerWidth,
      height:
        (this.nodeDimensions.height * this.sizes.height) / window.innerHeight,
    };

    this.mesh.scale.x = this.meshDimensions.width;
    this.mesh.scale.y = this.meshDimensions.height;
  }

  setMeshPosition() {
    this.meshPostion = {
      // For elements, getBoundingClientRect() returns left and top. 
      // Three sizes maps to full window innerWidth and innerHeight
      x: (this.elementBounds.left * this.sizes.width) / window.innerWidth,
      y: (-this.elementBounds.top * this.sizes.height) / window.innerHeight,
    };

    this.meshPostion.x -= this.sizes.width / 2;
    this.meshPostion.x += this.meshDimensions.width / 2;

    this.meshPostion.y -= this.meshDimensions.height / 2;
    this.meshPostion.y += this.sizes.height / 2;

    this.mesh.position.x = this.meshPostion.x;
    this.mesh.position.y = this.meshPostion.y;
  }

  setTexture() {
    // Determine the source - handles both Next/Images and standard images
    const src = this.element.currentSrc || this.element.src;
    
    // Check if the source is already loaded to immediately get dimensions or load
    const texLoader = new THREE.TextureLoader();
    
    this.material.uniforms.uTexture.value = texLoader.load(src, (texture) => {
      const { naturalWidth, naturalHeight } = texture.image;

      this.material.uniforms.uResolution.value = new THREE.Vector2(
        naturalWidth,
        naturalHeight,
      );

      this.material.uniforms.uContainerRes.value = new THREE.Vector2(
        this.nodeDimensions.width,
        this.nodeDimensions.height,
      );
      
      // Update element opacity after textures loads successfully
      gsap.set(this.element, { opacity: 0 });
      console.log("PIXEL EFFECT - Texture loaded for:", src);
    }, (err) => {
      console.error("PIXEL EFFECT - Texture load error for:", src, err);
    });
  }

  updateScroll(scrollY: number) {
    this.currentScroll = (-scrollY * this.sizes.height) / window.innerHeight;

    const deltaScroll = this.currentScroll - this.lastScroll;
    this.lastScroll = this.currentScroll;

    this.updateY(deltaScroll);
  }

  updateY(deltaScroll: number) {
    this.meshPostion.y -= deltaScroll;
    this.mesh.position.y = this.meshPostion.y;
  }

  observe() {
    this.scrollTrigger = gsap.to(this.material.uniforms.uProgress, {
        value: 1,
        scrollTrigger: {
          trigger: this.element,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play reset restart reset',
        },
        duration: 1.6,
        ease: 'linear',
      }) as any;
  }

  destroy() {
    this.scene.remove(this.mesh);
    if (this.scrollTrigger && (this.scrollTrigger as any).scrollTrigger) {
      (this.scrollTrigger as any).scrollTrigger.kill();
    }
    this.scrollTrigger?.kill();
    this.geometry.dispose();
    this.material.dispose();
    gsap.killTweensOf(this.material.uniforms.uProgress);
  }

  onResize(sizes: Size) {
    this.sizes = sizes;

    this.setNodeBounds();
    this.setMeshDimensions();
    this.setMeshPosition();

    this.material.uniforms.uContainerRes.value = new THREE.Vector2(
      this.nodeDimensions.width,
      this.nodeDimensions.height,
    );
  }
}
