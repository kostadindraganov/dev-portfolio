'use client'

import { WebGPUCanvas } from './canvas'
import { useAspect, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useContext, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
	abs,
	blendScreen,
	float,
	mod,
	mx_cell_noise_float,
	oneMinus,
	smoothstep,
	texture,
	uniform,
	uv,
	vec2,
	vec3,
} from 'three/tsl'

import * as THREE from 'three/webgpu'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)
import { GlobalContext, ContextProvider } from './context'
import { PostProcessing } from './post-processing'
import TEXTUREMAP from '../../../public/hero/raw-1.webp'
import DEPTHMAP from '../../../public/hero/depth-1.png'

const WIDTH = 1650
const HEIGHT = 950

const Scene = () => {
	const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src], () => {
		rawMap.colorSpace = THREE.SRGBColorSpace
	})

	const { material, uniforms } = useMemo(() => {
		const uPointer = uniform(new THREE.Vector2(0))
		const uProgress = uniform(0)

		const strength = 0.001

		const tDepthMap = texture(depthMap)

		const tMap = texture(
			rawMap,
			uv().add(tDepthMap.r.mul(uPointer).mul(strength)),
		)

		const aspect = float(WIDTH).div(HEIGHT)
		const tUv = vec2(uv().x.mul(aspect), uv().y)

		const tiling = vec2(120.0)
		const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0)

		const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2))

		const dist = float(tiledUv.length())
		const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness)

		const depth = tDepthMap

		const flow = oneMinus(smoothstep(0, 0.01, abs(depth.sub(uProgress))))
		// const mask = dot.mul(flow).mul(vec3(10, 0, 0))
		const mask = dot.mul(flow).mul(vec3(1, 3, 8))

		const final = blendScreen(tMap, mask)

		const material = new THREE.MeshBasicNodeMaterial({
			colorNode: final,
		})

		return {
			material,
			uniforms: {
				uPointer,
				uProgress,
			},
		}
	}, [rawMap, depthMap])

	const [w, h] = useAspect(WIDTH, HEIGHT)

	useGSAP(() => {
		let animationTween: gsap.core.Tween | null = null

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '.scan-hero-container',
				start: 'top center',
				end: 'bottom center',
				onEnter: () => {
					// Start infinite loop animation
					animationTween = gsap.to(uniforms.uProgress, {
						value: 1,
						duration: 3.2,
						ease: 'power1.out',
						repeat: -1,
						onComplete: () => {
							gsap.set(uniforms.uProgress, { value: 0 })
						},
					})
				},
				onLeave: () => {
					// Wait 1 second then stop animation and reset
					setTimeout(() => {
						if (animationTween) {
							animationTween.kill()
							animationTween = null
						}
						gsap.set(uniforms.uProgress, { value: 0 })
					}, 2000)
				},
				onEnterBack: () => {
					// Start infinite loop animation again
					animationTween = gsap.to(uniforms.uProgress, {
						value: 1,
						duration: 3.2,
						ease: 'power1.out',
						repeat: -1,
						onComplete: () => {
							gsap.set(uniforms.uProgress, { value: 0 })
						},
					})
				},
				onLeaveBack: () => {
					// Wait 1 second then stop animation and reset
					setTimeout(() => {
						if (animationTween) {
							animationTween.kill()
							animationTween = null
						}
						gsap.set(uniforms.uProgress, { value: 1 })
					}, 200)
				},
			},
		})

		return () => {
			tl.kill()
			if (animationTween) {
				animationTween.kill()
			}
		}
	}, [uniforms.uProgress])

	useFrame(({ pointer }) => {
		uniforms.uPointer.value = pointer
	})

	return (
		<mesh scale={[w, h, 2]} material={material}>
			<planeGeometry />
		</mesh>
	)
}

const Html = () => {
	return (
		<div data-layout className={''}>
			<div className="h-[200vh]">
				<div className="scan-hero-container sticky top-0 h-svh">
					<WebGPUCanvas>
						<PostProcessing></PostProcessing>
						<Scene></Scene>
					</WebGPUCanvas>
				</div>
			</div>
		</div>
	)
}

export default function Home() {
	return (
		<ContextProvider>
			<Html></Html>
		</ContextProvider>
	)
}
