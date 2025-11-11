import { getSite } from '@/sanity/lib/queries'
import Navigation from './Navigation'
import Social from '@/ui/Social'
import LanguageSwitcher from '@/ui/LanguageSwitcher'
import { PortableText } from 'next-sanity'
import Link from 'next/link'
import { Img } from '@/ui/Img'

import ExplosionAnimation from './ExplosionAnimation'
import Copy from '@/ui/Copy/Copy'
export default async function Footer() {
	const { title, blurb, logo, copyright } = await getSite()

	const logoImage = logo?.image?.light || logo?.image?.default

	// return (
	// 	<footer className="bg-ink text-canvas" role="contentinfo">
	// 		<div className="section flex flex-wrap justify-between gap-x-12 gap-y-8 max-sm:flex-col">
	// 			<div className="flex flex-col gap-3 self-stretch">
	// 				<Link className="h3 md:h2 max-w-max" href="/">
	// 					{logoImage ? (
	// 						<Img
	// 							className="max-h-[1.5em] w-auto"
	// 							image={logoImage}
	// 							alt={logo?.name || title}
	// 						/>
	// 					) : (
	// 						title
	// 					)}
	// 				</Link>

	// 				{blurb && (
	// 					<div className="max-w-sm text-sm text-balance">
	// 						<PortableText value={blurb} />
	// 					</div>
	// 				)}

	// 				<Social className="mb-auto -ml-2" />

	// 				<LanguageSwitcher className="mt-4 max-w-max" />
	// 			</div>

	// 			<Navigation />
	// 		</div>

	// 		{copyright && (
	// 			<div className="border-canvas/20 mx-auto flex max-w-screen-xl flex-wrap justify-center gap-x-6 gap-y-2 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-sm [&_a:hover]:underline">
	// 				<PortableText value={copyright} />
	// 			</div>
	// 		)}
	// 	</footer>
	// )

	return (
		<footer role="contentinfo">
			<div className="footer-container">
				<div className="footer-symbols footer-symbols-1">
					<img src="/images/global/s6.png" alt="" />
					<img src="/images/global/s6.png" alt="" />
				</div>
				<div className="footer-symbols footer-symbols-2">
					<img src="/images/global/s6.png" alt="" />
					<img src="/images/global/s6.png" alt="" />
				</div>
				<div className="footer-header">
					<h1>Kostadin Draganov</h1>
				</div>

				<div className="footer-row">
					<div className="footer-col">
						<p>Quick Jumps</p>
						<Navigation />
					</div>
					<div className="footer-col">
						<p>Side Streets</p>
						<p>Roll the Showreel</p>
						<p>Weird Shop</p>
						<p>Buy Me a Coffee</p>
					</div>
					<div className="footer-col">
						<p>Social Signals</p>
						<p>
							<a href="https://www.youtube.com/@codegrid" target="_blank">
								YouTube
							</a>
						</p>
						<p>
							<a
								href="https://codegrid.gumroad.com/l/codegridpro"
								target="_blank"
							>
								Membership
							</a>
						</p>
						<p>
							<a href="https://www.instagram.com/codegridweb/" target="_blank">
								Instagram
							</a>
						</p>
					</div>
					<div className="footer-col">
						<p>Alt Dimensions</p>
						<p>Logo Dump</p>
						<p>Freelance Top 100</p>
					</div>
				</div>

				<ExplosionAnimation />
			</div>
		</footer>
	)
}
