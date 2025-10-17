import Nav from '@/ui/Nav/Nav'
import '@/styles/app.css'
import '@/styles/about.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Nav />
			<main id="main-content" role="main" tabIndex={-1}>
				{children}
			</main>
		</>
	)
}
