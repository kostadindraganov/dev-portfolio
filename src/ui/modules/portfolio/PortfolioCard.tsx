import { Img } from '@/ui/Img'
import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'

export default function PortfolioCard({
	item,
}: {
	item: Sanity.PortfolioItem
}) {
	if (!item) return null

	const title = item.metadata?.title?.replace(/\s+/g, '_').toUpperCase() ?? ''
	const date = item.publishDate
		? new Date(item.publishDate)
				.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' })
				.replace('-', '.')
		: ''

	return (
		<div className="portfolio-card group relative">
			<figure className="portfolio-card-image">
				<Img
					image={item.metadata?.image}
					width={600}
					alt={item.metadata?.title}
				/>
			</figure>

			<div className="portfolio-card-body">
				{item.categories?.length > 0 && (
					<div className="portfolio-tags">
						{item.categories.map((cat) => (
							<span className="portfolio-tag" key={cat._id}>
								{cat.title}
							</span>
						))}
					</div>
				)}

				<div className="portfolio-card-title">
					<Link href={resolveUrl(item, { base: false })}>
						<span className="absolute inset-0 z-10" />
						{title}
					</Link>
				</div>

				{item.metadata?.description && (
					<p className="portfolio-card-desc">
						{item.metadata.description}
					</p>
				)}

				{date && <div className="portfolio-card-date">{date}</div>}
			</div>
		</div>
	)
}
