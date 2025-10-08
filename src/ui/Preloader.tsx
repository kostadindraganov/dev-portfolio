'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

let isInitialLoad = true

export default function Preloader() {
	const [showPreloader, setShowPreloader] = useState(false)
	const [loaderAnimating, setLoaderAnimating] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		// Only show preloader on home page and only on initial load
		if (pathname === '/') {
			setShowPreloader(isInitialLoad)
		}

		return () => {
			isInitialLoad = false
		}
	}, [pathname])

	useGSAP(() => {
		if (showPreloader) {
			setLoaderAnimating(true)

			const tl = gsap.timeline({
				delay: 0.3,
				defaults: {
					ease: 'power2.out',
				},
			})

			// Animate the counter numbers
			const counts = document.querySelectorAll('.count')
			counts.forEach((count, index) => {
				const digits = count.querySelectorAll('.digit h1')

				tl.to(
					digits,
					{
						y: '0%',
						duration: 1,
						stagger: 0.075,
					},
					index * 1,
				)

				if (index < counts.length) {
					tl.to(
						digits,
						{
							y: '-100%',
							duration: 1,
							stagger: 0.075,
						},
						index * 1 + 1,
					)
				}
			})

			// Hide spinner
			tl.to('.spinner', {
				opacity: 0,
				duration: 0.3,
			})

			// Animate words
			tl.to(
				'.word h1',
				{
					y: '0%',
					duration: 1,
				},
				'<',
			)

			// Animate divider
			tl.to('.divider', {
				scaleY: '100%',
				duration: 1,
				onComplete: () => {
					gsap.to('.divider', { opacity: 0, duration: 0.3, delay: 0.3 })
				},
			})

			// Animate word transitions
			tl.to('#word-1 h1', {
				y: '100%',
				duration: 1,
				delay: 0.3,
			})

			tl.to(
				'#word-2 h1',
				{
					y: '-100%',
					duration: 1,
				},
				'<',
			)

			// Final block animation
			tl.to(
				'.block',
				{
					clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
					duration: 1,
					stagger: 0.1,
					delay: 0.75,
					onComplete: () => {
						gsap.set('.loader', { pointerEvents: 'none' })
						setLoaderAnimating(false)
						setShowPreloader(false)
					},
				},
				'<',
			)
		}
	}, [showPreloader])

	if (!showPreloader) return null

	return (
		<div className="loader fixed inset-0 z-50">
			<div className="overlay">
				<div className="block"></div>
				<div className="block"></div>
			</div>
			<div className="intro-logo">
				<div className="word" id="word-1">
					<h1>
						<span>Kostadin</span>
					</h1>
				</div>
				<div className="word pl-2" id="word-2">
					<h1>Draganow</h1>
				</div>
			</div>
			<div className="divider"></div>
			<div className="spinner-container">
				<div className="spinner"></div>
			</div>
			<div className="counter">
				<div className="count">
					<div className="digit">
						<h1>0</h1>
					</div>
					<div className="digit">
						<h1>0</h1>
					</div>
				</div>
				<div className="count">
					<div className="digit">
						<h1>2</h1>
					</div>
					<div className="digit">
						<h1>7</h1>
					</div>
				</div>
				<div className="count">
					<div className="digit">
						<h1>6</h1>
					</div>
					<div className="digit">
						<h1>5</h1>
					</div>
				</div>
				<div className="count">
					<div className="digit">
						<h1>9</h1>
					</div>
					<div className="digit">
						<h1>8</h1>
					</div>
				</div>
				<div className="count">
					<div className="digit">
						<h1>9</h1>
					</div>
					<div className="digit">
						<h1>9</h1>
					</div>
				</div>
			</div>
		</div>
	)
}
