'use client'

import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'
import Code from '../RichtextModule/Code'
import CustomHTML from '../CustomHTML'
import Reputation from '@/ui/Reputation'
import CTAList from '@/ui/CTAList'

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
if (typeof window !== 'undefined') {
	ScrollTrigger.normalizeScroll(true)
}

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
			const context = canvas.getContext('2d', { willReadFrequently: true })
			if (!context) return
			contextRef.current = context

			const setCanvasSize = () => {
				const pixelRatio = window.devicePixelRatio || 1
				const cappedRatio = Math.min(1.5, pixelRatio)
				canvas.width = window.innerWidth * cappedRatio
				canvas.height = window.innerHeight * cappedRatio
				canvas.style.width = `${window.innerWidth}px`
				canvas.style.height = `${window.innerHeight}px`
				context.setTransform(1, 0, 0, 1, 0, 0)
				context.scale(cappedRatio, cappedRatio)
			}

			setCanvasSize()

			const frameCount = 207
			const MAX_CONCURRENCY = 10 // Increased concurrency
			const PRELOAD_BEFORE_ACTIVATION = 20 // Start animation after more frames are loaded
			const currentFrame = (index: number) =>
				`/frames/frame_${(index + 1).toString().padStart(4, '0')}.webp`

			let images: (HTMLImageElement | ImageBitmap)[] = new Array(frameCount)
			let nextIndexToLoad = 0
			let inFlight = 0
			let loadedCount = 0
			let scrollTriggerInitialized = false

			const useImageBitmap = 'createImageBitmap' in window

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
					img.crossOrigin = 'anonymous'
					img.loading = 'eager'
					;(img as any).decoding = 'async'
					try {
						;(img as any).fetchPriority = idx < 10 ? 'high' : 'auto'
					} catch {}

					img.onload = () => {
						if (useImageBitmap) {
							createImageBitmap(img).then((bitmap) => {
								images[idx] = bitmap
								finalizeLoad()
							})
						} else {
							images[idx] = img
							finalizeLoad()
						}

						function finalizeLoad() {
							lastLoadedFrameRef.current = Math.max(
								lastLoadedFrameRef.current,
								idx,
							)
							loadedCount++
							inFlight--
							maybeInitScrollTrigger()
							if (idx < PRELOAD_BEFORE_ACTIVATION || idx % 5 === 0) {
								render()
							}
							startNextLoad()
						}
					}

					img.onerror = () => {
						loadedCount++
						inFlight--
						maybeInitScrollTrigger()
						startNextLoad()
					}
					img.src = currentFrame(idx)
				}
			}

			imagesRef.current = images as HTMLImageElement[] // Keep original ref type for now

			const render = () => {
				if (!contextRef.current) return
				const ctx = contextRef.current
				const canvasWidth = window.innerWidth
				const canvasHeight = window.innerHeight

				ctx.clearRect(0, 0, canvasWidth, canvasHeight)

				const desired = videoFramesRef.current.frame
				const safeIndex = Math.min(desired, lastLoadedFrameRef.current)
				const img = images[safeIndex]

				if (img) {
					const naturalWidth =
						img instanceof HTMLImageElement ? img.naturalWidth : img.width
					const naturalHeight =
						img instanceof HTMLImageElement ? img.naturalHeight : img.height

					if (naturalWidth > 0) {
						const imageAspect = naturalWidth / naturalHeight
						const canvasAspect = canvasWidth / canvasHeight
						let drawWidth, drawHeight, drawX, drawY

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
			}

			const setupScrollTrigger = () => {
				gsap.set(headerRef.current, { transform: 'translate(-50%, -50%)' })
				const navOpacity = gsap.quickSetter(navRef.current, 'opacity')
				const headerZ = gsap.quickSetter(headerRef.current, 'z', 'px')
				const headerOpacity = gsap.quickSetter(headerRef.current, 'opacity')
				const heroImgZ = gsap.quickSetter(heroImgRef.current, 'z', 'px')
				const heroImgOpacity = gsap.quickSetter(heroImgRef.current, 'opacity')

				scrollTriggerInstance = ScrollTrigger.create({
					trigger: '.hero',
					start: 'top top',
					end: `+=${window.innerHeight * 7}px`,
					pin: true,
					pinSpacing: true,
					scrub: 0.5,
					onUpdate: (self) => {
						const progress = self.progress
						const animationProgress = Math.min(progress, 1)
						const targetFrame = Math.round(
							animationProgress * (frameCount - 1),
						)
						videoFramesRef.current.frame = targetFrame
						render()

						// Nav opacity
						if (progress <= 0.1) {
							navOpacity(1 - progress / 0.1)
						} else {
							navOpacity(0)
						}

						// Header animations
						if (progress <= 0.25) {
							const zProgress = progress / 0.25
							headerZ(zProgress * -500)
							let opacity = 1
							if (progress >= 0.2) {
								opacity = 1 - (progress - 0.2) / 0.05
							}
							headerOpacity(opacity)
						} else {
							headerOpacity(0)
						}

						// Hero image animations
						if (progress < 0.6) {
							heroImgZ(1000)
							heroImgOpacity(0)
						} else if (progress <= 0.9) {
							const imgProgress = (progress - 0.6) / 0.3
							heroImgZ(1000 - imgProgress * 1000)
							let opacity =
								progress <= 0.8 ? (progress - 0.6) / 0.2 : 1
							heroImgOpacity(opacity)
						} else {
							heroImgZ(0)
							heroImgOpacity(1)
						}
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
					if (img && img instanceof HTMLImageElement) {
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
		<div ref={containerRef} className="scroll-hero">
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

			<section className="hero" {...moduleProps(props)}>
				<canvas
					ref={canvasRef}
					style={{
						backgroundImage: `url(${FIRST_FRAME})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				></canvas>

				<div className="hero-content mt-2">
					<div className="header" ref={headerRef}>
						{/* <h2>{pretitle}</h2> */}
						<h1>
							<PortableText
								value={content}
								components={{
									types: {
										code: ({ value }) => (
											<Code
												value={value}
												className="mx-auto mt-6! max-w-max"
												theme="snazzy-light"
											/>
										),
										'custom-html': ({ value }) => <CustomHTML {...value} />,
										'reputation-block': ({ value }) => (
											<Reputation
												className="!mt-4 justify-center"
												reputation={value.reputation}
											/>
										),
									},
								}}
							/>
						</h1>
						<div className="flex justify-center">
							<CTAList ctas={ctas} className="!mt-8 justify-center" />
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
}
