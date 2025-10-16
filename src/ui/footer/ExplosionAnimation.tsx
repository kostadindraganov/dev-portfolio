'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
	element: HTMLImageElement
	x: number
	y: number
	vx: number
	vy: number
	rotation: number
	rotationSpeed: number
}

const config = {
	gravity: 0.28,
	friction: 0.99,
	imageSize: 150,
	horizontalForce: 20,
	verticalForce: 15,
	rotationSpeed: 10,
	resetDelay: 500,
}

const imageParticleCount = 10
const imagePaths = Array.from(
	{ length: imageParticleCount },
	(_, i) => `/images/work-items/work-item-${i + 1}.webp`,
)

export default function ExplosionAnimation() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [hasExploded, setHasExploded] = useState(false)
	const animationIdRef = useRef<number | undefined>(undefined)

	// Preload images
	useEffect(() => {
		imagePaths.forEach((path) => {
			const img = new Image()
			img.src = path
		})
	}, [])

	const createParticles = () => {
		if (!containerRef.current) return []

		containerRef.current.innerHTML = ''

		const particles: Particle[] = []

		imagePaths.forEach((path) => {
			const particle = document.createElement('img')
			particle.src = path
			particle.classList.add('explosion-particle-img')
			particle.style.width = `${config.imageSize}px`
			containerRef.current?.appendChild(particle)

			particles.push({
				element: particle,
				x: 0,
				y: 0,
				vx: (Math.random() - 0.5) * config.horizontalForce,
				vy: -config.verticalForce - Math.random() * 10,
				rotation: 0,
				rotationSpeed: (Math.random() - 0.5) * config.rotationSpeed,
			})
		})

		return particles
	}

	const updateParticle = (particle: Particle) => {
		particle.vy += config.gravity
		particle.vx *= config.friction
		particle.vy *= config.friction
		particle.rotationSpeed *= config.friction

		particle.x += particle.vx
		particle.y += particle.vy
		particle.rotation += particle.rotationSpeed

		particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`
	}

	const explode = () => {
		if (hasExploded || !containerRef.current) return

		setHasExploded(true)
		const particles = createParticles()

		const animate = () => {
			particles.forEach(updateParticle)
			animationIdRef.current = requestAnimationFrame(animate)

			if (
				particles.every(
					(particle) =>
						particle.y > (containerRef.current?.offsetHeight || 0) / 2,
				)
			) {
				if (animationIdRef.current) {
					cancelAnimationFrame(animationIdRef.current)
				}
			}
		}

		animate()
	}

	const checkFooterPosition = () => {
		const footer = document.querySelector('footer')
		if (!footer || !containerRef.current) return

		const footerRect = footer.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		if (footerRect.top > viewportHeight + 100) {
			setHasExploded(false)
		}

		if (!hasExploded && footerRect.top <= viewportHeight + 250) {
			explode()
		}
	}

	useEffect(() => {
		let checkTimeout: NodeJS.Timeout

		const handleScroll = () => {
			clearTimeout(checkTimeout)
			checkTimeout = setTimeout(checkFooterPosition, 5)
		}

		const handleResize = () => {
			setHasExploded(false)
		}

		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', handleResize)

		// Initial check
		setTimeout(checkFooterPosition, 400)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', handleResize)
			clearTimeout(checkTimeout)
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current)
			}
		}
	}, [hasExploded])

	return <div ref={containerRef} className="explosion-container" />
}
