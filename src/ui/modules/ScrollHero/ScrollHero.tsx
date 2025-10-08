'use client'

// import moduleProps from '@/lib/moduleProps'
// import Pretitle from '@/ui/Pretitle'
// import { PortableText } from 'next-sanity'
// import Code from './RichtextModule/Code'
// import CustomHTML from './CustomHTML'
// import Reputation from '@/ui/Reputation'
// import CTAList from '@/ui/CTAList'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'

export default function ScrollHero({
	pretitle,
	content,
	ctas,
	assets,
	assetFaded,
	...props
}: Partial<Sanity.ScrollHero> & Sanity.Module) {
	gsap.registerPlugin(ScrollTrigger)

	const pathname = usePathname()
	const [isInitialized, setIsInitialized] = useState(false)
	const asset = assets?.[0]
	const containerRef = useRef<HTMLDivElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const navRef = useRef<HTMLElement | null>(null)
	const headerRef = useRef<HTMLDivElement | null>(null)
	const heroImgRef = useRef<HTMLDivElement | null>(null)
	const contextRef = useRef<CanvasRenderingContext2D | null>(null)
	const imagesRef = useRef<HTMLImageElement[]>([])
	const videoFramesRef = useRef<{ frame: number }>({ frame: 0 })
	const lastLoadedFrameRef = useRef<number>(0)

	const FIRST_FRAME = '/frames/frame_0001.webp'

	// Force re-initialization on route changes
	useEffect(() => {
		setIsInitialized(false)
		const timer = setTimeout(() => {
			setIsInitialized(true)
		}, 100)
		return () => clearTimeout(timer)
	}, [pathname])

	// Sync ScrollTrigger with app-wide Lenis from ClientLayout
	useLenis(() => {
		ScrollTrigger.update()
	})

	useGSAP(
		() => {
			if (!isInitialized) return

			let scrollTriggerInstance: ScrollTrigger | null = null
			const canvas = canvasRef.current
			if (!canvas) return
			const context = canvas.getContext('2d')
			if (!context) return
			contextRef.current = context

			const setCanvasSize = () => {
				const pixelRatio = window.devicePixelRatio || 1
				// Cap DPR to reduce initial decode and draw costs on very high-DPR screens
				const cappedRatio = Math.min(1.5, pixelRatio)
				canvas.width = window.innerWidth * cappedRatio
				canvas.height = window.innerHeight * cappedRatio
				canvas.style.width = window.innerWidth + 'px'
				canvas.style.height = window.innerHeight + 'px'
				context.setTransform(1, 0, 0, 1, 0, 0)
				context.scale(cappedRatio, cappedRatio)
			}

			setCanvasSize()

			const frameCount = 207
			const MAX_CONCURRENCY = 8
			const PRELOAD_BEFORE_ACTIVATION = 1 // initialize as soon as the first frame is ready
			const currentFrame = (index: number) =>
				`/frames/frame_${(index + 1).toString().padStart(4, '0')}.webp`

			let images: HTMLImageElement[] = new Array(frameCount)
			let nextIndexToLoad = 0
			let inFlight = 0
			let loadedCount = 0
			let scrollTriggerInitialized = false

			const maybeInitScrollTrigger = () => {
				if (
					!scrollTriggerInitialized &&
					loadedCount >= PRELOAD_BEFORE_ACTIVATION
				) {
					scrollTriggerInitialized = true
					render()
					setupScrollTrigger()
				}
			}

			const startNextLoad = () => {
				while (inFlight < MAX_CONCURRENCY && nextIndexToLoad < frameCount) {
					const idx = nextIndexToLoad++
					inFlight++
					const img = new Image()

					// Performance optimizations for image loading
					img.crossOrigin = 'anonymous'
					img.loading = 'eager' // Load immediately for scroll animation
					;(img as any).decoding = 'async'

					// Prioritize first frames for immediate display
					try {
						;(img as any).fetchPriority = idx < 6 ? 'high' : 'auto'
					} catch {}

					img.onload = () => {
						images[idx] = img
						lastLoadedFrameRef.current = Math.max(
							lastLoadedFrameRef.current,
							idx,
						)
						loadedCount++
						inFlight--
						maybeInitScrollTrigger()

						// Only render if this is an important frame
						if (idx < 10 || idx % 5 === 0) {
							render()
						}

						startNextLoad()
					}
					img.onerror = () => {
						// Treat errors as loaded to avoid stalling the queue
						loadedCount++
						inFlight--
						maybeInitScrollTrigger()
						startNextLoad()
					}
					img.src = currentFrame(idx)
				}
			}

			imagesRef.current = images

			const render = () => {
				if (!contextRef.current) return
				const ctx = contextRef.current
				const canvasWidth = window.innerWidth
				const canvasHeight = window.innerHeight

				ctx.clearRect(0, 0, canvasWidth, canvasHeight)

				// If the target frame is not loaded yet, fall back to the last loaded frame
				const desired = videoFramesRef.current.frame
				const safeIndex = Math.min(desired, lastLoadedFrameRef.current)
				const img = images[safeIndex]

				if (img && img.complete && img.naturalWidth > 0) {
					const imageAspect = img.naturalWidth / img.naturalHeight
					const canvasAspect = canvasWidth / canvasHeight

					let drawWidth: number
					let drawHeight: number
					let drawX: number
					let drawY: number

					if (imageAspect > canvasAspect) {
						drawHeight = canvasHeight
						drawWidth = drawHeight * imageAspect
						drawX = (canvasWidth - drawWidth) / 2
						drawY = 0
					} else {
						drawWidth = canvasWidth
						drawHeight = drawWidth / imageAspect
						drawX = 0
						drawY = (canvasHeight - drawHeight) / 2
					}

					ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
				}
			}

			const setupScrollTrigger = () => {
				scrollTriggerInstance = ScrollTrigger.create({
					trigger: '.hero',
					start: 'top top',
					end: `+=${window.innerHeight * 7}px`,
					pin: true,
					pinSpacing: true,
					scrub: 0.5, // Smoother scrub for better performance
					onUpdate: (self) => {
						const progress = self.progress

						const animationProgress = Math.min(progress, 1)
						const targetFrame = Math.round(animationProgress * (frameCount - 1))

						videoFramesRef.current.frame = targetFrame
						render()

						// Use requestAnimationFrame for smooth DOM updates
						requestAnimationFrame(() => {
							if (progress <= 0.1) {
								const navProgress = progress / 0.1
								const opacity = 1 - navProgress
								if (navRef.current) {
									gsap.set(navRef.current, { opacity })
								}
							} else {
								if (navRef.current) {
									gsap.set(navRef.current, { opacity: 0 })
								}
							}

							if (progress <= 0.25) {
								const zProgress = progress / 0.25
								const translateZ = zProgress * -500

								let opacity = 1
								if (progress >= 0.2) {
									const fadeProgress = Math.min(
										(progress - 0.2) / (0.25 - 0.2),
										1,
									)
									opacity = 1 - fadeProgress
								}

								if (headerRef.current) {
									gsap.set(headerRef.current, {
										transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
										opacity,
									})
								}
							} else {
								if (headerRef.current) {
									gsap.set(headerRef.current, { opacity: 0 })
								}
							}

							if (progress < 0.6) {
								if (heroImgRef.current) {
									gsap.set(heroImgRef.current, {
										transform: 'translateZ(1000px)',
										opacity: 0,
									})
								}
							} else if (progress >= 0.6 && progress <= 0.9) {
								const imgProgress = (progress - 0.6) / (0.9 - 0.6)
								const translateZ = 1000 - imgProgress * 1000

								let opacity = 0
								if (progress <= 0.8) {
									const opacityProgress = (progress - 0.6) / (0.8 - 0.6)
									opacity = opacityProgress
								} else {
									opacity = 1
								}

								if (heroImgRef.current) {
									gsap.set(heroImgRef.current, {
										transform: `translateZ(${translateZ}px)`,
										opacity,
									})
								}
							} else {
								if (heroImgRef.current) {
									gsap.set(heroImgRef.current, {
										transform: 'translateZ(0px)',
										opacity: 1,
									})
								}
							}
						})
					},
				})
			}

			// Throttled resize handler for better performance
			let resizeTimeout: NodeJS.Timeout
			const handleResize = () => {
				clearTimeout(resizeTimeout)
				resizeTimeout = setTimeout(() => {
					setCanvasSize()
					render()
					ScrollTrigger.refresh()
				}, 100)
			}

			window.addEventListener('resize', handleResize, { passive: true })

			// Kick off prioritized, limited-concurrency loading
			startNextLoad()

			return () => {
				window.removeEventListener('resize', handleResize)
				clearTimeout(resizeTimeout)
				if (scrollTriggerInstance) {
					scrollTriggerInstance.kill()
				}
				// Clean up images to free memory
				images.forEach((img) => {
					if (img) {
						img.src = ''
						img.onload = null
						img.onerror = null
					}
				})
			}
		},
		{ scope: containerRef, dependencies: [isInitialized] },
	)

	return (
		<div ref={containerRef}>
			<nav ref={navRef}>
				<div className="nav-links">
					<a href="#">Overview</a>
					<a href="#">Solutions</a>
					<a href="#">Resources</a>
				</div>
				<div className="logo">
					<a href="#">
						<img src="/logo.png" alt="" /> Byewind
					</a>
				</div>
				<div className="nav-buttons">
					<div className="btn primary">
						<a href="#">Live Demo</a>
					</div>
					<div className="btn secondary">
						<a href="#">Get Started</a>
					</div>
				</div>
			</nav>

			<section className="hero">
				<canvas
					ref={canvasRef}
					style={{
						backgroundImage: `url(${FIRST_FRAME})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				></canvas>

				<div className="hero-content">
					<div className="header" ref={headerRef}>
						<h1>One unified workspace to build, test, and ship AI faster</h1>
						<p>Trusted by</p>
						<div className="client-logos">
							<div className="client-logo">
								<img src="/client-logo-1.png" alt="" />
							</div>
							<div className="client-logo">
								<img src="/client-logo-2.png" alt="" />
							</div>
							<div className="client-logo">
								<img src="/client-logo-3.png" alt="" />
							</div>
							<div className="client-logo">
								<img src="/client-logo-4.png" alt="" />
							</div>
						</div>
					</div>
				</div>

				<div className="hero-img-container">
					<div className="hero-img" ref={heroImgRef}>
						<img src="/dashboard.png" alt="" />
					</div>
				</div>
			</section>

			<section className="outro">
				<h1>Join teams building faster with Byewind.</h1>
			</section>
		</div>
	)

	// return (
	// 	<section className="section space-y-8 text-center" {...moduleProps(props)}>
	// 		<div className="richtext mx-auto max-w-2xl text-balance">
	// 			<Pretitle>{pretitle}</Pretitle>
	// 			<PortableText
	// 				value={content}
	// 				components={{
	// 					types: {
	// 						code: ({ value }) => (
	// 							<Code
	// 								value={value}
	// 								className="mx-auto mt-6! max-w-max"
	// 								theme="snazzy-light"
	// 							/>
	// 						),
	// 						'custom-html': ({ value }) => <CustomHTML {...value} />,
	// 						'reputation-block': ({ value }) => (
	// 							<Reputation
	// 								className="!mt-4 justify-center"
	// 								reputation={value.reputation}
	// 							/>
	// 						),
	// 					},
	// 				}}
	// 			/>
	// 			<CTAList ctas={ctas} className="!mt-8 justify-center" />
	// 		</div>
	// 	</section>
	// )
}
