// import { GoogleTagManager } from '@next/third-parties/google'
import Root from '@/ui/Root'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Preloader from '@/ui/Preloader'
import ClientLayout from './client-layout'
import '@/styles/app.css'
import '@/styles/preloader.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root>
			{/* <GoogleTagManager gtmId="" /> */}
			<body className="bg-canvas text-ink antialiased">
				<ClientLayout>
					<Preloader />
					<NuqsAdapter>
						<SkipToContent />
						<Announcement />
						<Header />
						<main id="main-content" role="main" tabIndex={-1}>
							{children}
						</main>
						<Footer />

						<VisualEditingControls />
					</NuqsAdapter>

					<Analytics />
					<SpeedInsights />
				</ClientLayout>
			</body>
		</Root>
	)
}
