export default function HomePortfolio({ title }: Partial<{ title: string }>) {
	return (
		<section className="section">
			{title && <h2 className="title">{title}</h2>}
		</section>
	)
}
