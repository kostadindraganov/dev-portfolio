import Nav from '@/ui/Nav/Nav'
import '@/styles/app.css'
import '@/styles/preloader.css'
import { getSite } from '@/sanity/lib/queries'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { headerMenu } = await getSite()

	return (
		<>
			<Nav headerMenu={headerMenu} />
			<main id="main-content" role="main" tabIndex={-1}>
				{children}
			</main>
		</>
	)
}
