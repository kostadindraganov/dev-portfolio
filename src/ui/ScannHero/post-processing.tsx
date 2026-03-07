import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { pass } from 'three/tsl'

import * as THREE from 'three/webgpu'

export const PostProcessing = ({
	strength = 1,
	threshold = 1,
}: {
	strength?: number
	threshold?: number
}) => {
	const { gl, scene, camera } = useThree()

	const render = useMemo(() => {
		const pipeline = new THREE.RenderPipeline(gl as any)
		const scenePass = pass(scene, camera)
		const scenePassColor = scenePass.getTextureNode('output')
		const bloomPass = bloom(scenePassColor, strength, 0.5, threshold)

		const final = scenePassColor.add(bloomPass)

		pipeline.outputNode = final

		return pipeline
	}, [camera, gl, scene, strength, threshold])

	useFrame(() => {
		render.render()
	}, 1)

	return null
}
