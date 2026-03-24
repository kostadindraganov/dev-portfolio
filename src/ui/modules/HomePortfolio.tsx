'use client'

import { useRef, useState, useEffect } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomEase from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'

import Nav from '@/ui/Nav/Nav'
import AnimatedButton from '@/ui/AnimatedButton/AnimatedButton'
import FeaturedProjects from '@/ui/FeaturedProjects/FeaturedProjects'
import LocalPixelImage from '@/ui/PixelImageEffect/LocalPixelImage'
import Copy from '@/ui/Copy/Copy'
import Spotlight from '@/ui/Spotlight/Spotlight'
import ScannHero from '@/ui/ScannHero'
import { urlFor } from '@/sanity/lib/image'

let isInitialLoad = true
gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('hop', '0.9, 0, 0.1, 1')

export default function Home({
	headerMenu,
	preloaderFirstName = 'Kostadin',
	preloaderLastName = 'Draganov',
	whatWeDoHeading = 'At Terrene, we design with purpose and clarity,',
	howWeWorkTitle = 'How we work',
	howWeWorkDescription = 'We approach each build with a clarity of intent. Every plan is shaped through research, iteration, and conversation. What remains is the essential, designed to last and built to feel lived in.',
	tags = ['Quiet', 'View', 'Tactile', 'Light-forward', 'Slow design', 'Modular rhythm'],
	featuredWorkLabel = 'Featured work',
	featuredWorkTitle = 'A selection of recent studies and completed spaces',
	featuredProjects,
	galleryStatNumber = '800+',
	galleryStatLabel = 'Project Images',
	galleryCopyText = 'Take a closer look at the projects that define our practice. From intimate interiors to expansive landscapes, each image highlights a unique perspective that might spark your next big idea.',
	galleryCtaLabel = 'Explore Gallery',
	galleryCtaRoute = 'blueprints',
	galleryImages,
}: Sanity.HomePortfolio & {
	headerMenu: Sanity.Navigation
}) {
	const tagsRef = useRef<HTMLDivElement>(null)
	const [showPreloader, setShowPreloader] = useState(isInitialLoad)
	const [loaderAnimating, setLoaderAnimating] = useState(false)
	const lenis = useLenis()
	const pathname = usePathname()

	useEffect(() => {
		return () => {
			isInitialLoad = false
		}
	}, [])

	useEffect(() => {
		if (pathname === '/') {
			setShowPreloader(isInitialLoad)
		} else {
			setShowPreloader(false)
		}
		return () => {
			isInitialLoad = false
		}
	}, [pathname])

	useEffect(() => {
		if (lenis) {
			if (loaderAnimating) {
				lenis.stop()
			} else {
				lenis.start()
			}
		}
	}, [lenis, loaderAnimating])

	useGSAP(() => {
		const tl = gsap.timeline({
			delay: 0.3,
			defaults: {
				ease: 'hop',
			},
		})

		if (showPreloader) {
			setLoaderAnimating(true)
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

			tl.to('.spinner', {
				opacity: 0,
				duration: 0.3,
			})

			tl.to(
				'.word h1',
				{
					y: '0%',
					duration: 1,
				},
				'<',
			)

			tl.to('.divider', {
				scaleY: '100%',
				duration: 1,
				onComplete: () => {
					gsap.to('.divider', { opacity: 0, duration: 0.3, delay: 0.3 })
				},
			})

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

			tl.to(
				'.block',
				{
					clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
					duration: 1,
					stagger: 0.1,
					delay: 0.75,
					onStart: () => {
						gsap.to('.scan-hero-container', { scale: 1, duration: 2, ease: 'hop' })
					},
					onComplete: () => {
						gsap.set('.loader', { pointerEvents: 'none' })
						setLoaderAnimating(false)
					},
				},
				'<',
			)
		}
	}, [showPreloader])

	useGSAP(
		() => {
			if (!tagsRef.current) return

			const tagEls = tagsRef.current.querySelectorAll('.what-we-do-tag')
			gsap.set(tagEls, { opacity: 0, x: -40 })

			ScrollTrigger.create({
				trigger: tagsRef.current,
				start: 'top 90%',
				once: true,
				animation: gsap.to(tagEls, {
					opacity: 1,
					x: 0,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
				}),
			})
		},
		{ scope: tagsRef },
	)

	const getGalleryImageSrc = (index: number): string => {
		const sanityImg = galleryImages?.[index]
		if (sanityImg?.asset) {
			return urlFor(sanityImg as Sanity.Image).width(800).url()
		}
		return `/gallery-callout/gallery-callout-${index + 1}.jpg`
	}

	const getGalleryImageAlt = (index: number): string => {
		return galleryImages?.[index]?.alt ?? ''
	}

	return (
		<>
			{showPreloader && (
				<div className="loader">
					<div className="overlay">
						<div className="block"></div>
						<div className="block"></div>
					</div>
					<div className="intro-logo">
						<div className="word" id="word-1">
							<h1>
								<span>{preloaderFirstName}</span>
							</h1>
						</div>
						<div className="word" id="word-2">
							<h1>{preloaderLastName}</h1>
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
			)}
			<Nav headerMenu={headerMenu} />
			<section className="hero">
				<div className="hero-bg">
					<ScannHero />
					<div className="hero-gradient"></div>
				</div>

				<div className="container">
					<div className="hero-content">
						<div className="hero-header"></div>
						<div className="hero-tagline"></div>
					</div>
				</div>
			</section>
			<section className="what-we-do">
				<div className="container">
					<div className="what-we-do-header">
						<Copy delay={0.1}>
							<h1>
								<span className="spacer">&nbsp;</span>
								{whatWeDoHeading}
							</h1>
						</Copy>
					</div>
					<div className="what-we-do-content">
						<div className="what-we-do-col">
							<Copy delay={0.1}>
								<p>{howWeWorkTitle}</p>
							</Copy>

							<Copy delay={0.15}>
								<p className="lg">{howWeWorkDescription}</p>
							</Copy>
						</div>
						<div className="what-we-do-col">
							<div className="what-we-do-tags" ref={tagsRef}>
								{tags.map((tag, i) => (
									<div key={i} className="what-we-do-tag">
										<h3>{tag}</h3>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="featured-projects-container">
				<div className="container">
					<div className="featured-projects-header-callout">
						<Copy delay={0.1}>
							<p>{featuredWorkLabel}</p>
						</Copy>
					</div>
					<div className="featured-projects-header">
						<Copy delay={0.15}>
							<h2>{featuredWorkTitle}</h2>
						</Copy>
					</div>
				</div>
				<FeaturedProjects projects={featuredProjects} />
			</section>
			<section className="gallery-callout">
				<div className="container">
					<div className="gallery-callout-col">
						<div className="gallery-callout-row">
							<div className="gallery-callout-img gallery-callout-img-1">
								<LocalPixelImage src={getGalleryImageSrc(0)} alt={getGalleryImageAlt(0)} />
							</div>
							<div className="gallery-callout-img gallery-callout-img-2">
								<LocalPixelImage src={getGalleryImageSrc(1)} alt={getGalleryImageAlt(1)} />
								<div className="gallery-callout-img-content">
									<h3>{galleryStatNumber}</h3>
									<p>{galleryStatLabel}</p>
								</div>
							</div>
						</div>
						<div className="gallery-callout-row">
							<div className="gallery-callout-img gallery-callout-img-3">
								<LocalPixelImage src={getGalleryImageSrc(2)} alt={getGalleryImageAlt(2)} />
							</div>
							<div className="gallery-callout-img gallery-callout-img-4">
								<LocalPixelImage src={getGalleryImageSrc(3)} alt={getGalleryImageAlt(3)} />
							</div>
						</div>
					</div>
					<div className="gallery-callout-col">
						<div className="gallery-callout-copy">
							<Copy delay={0.1}>
								<h3>{galleryCopyText}</h3>
							</Copy>
							<AnimatedButton label={galleryCtaLabel} route={galleryCtaRoute} />
						</div>
					</div>
				</div>
			</section>
			<Spotlight />
		</>
	)
}
