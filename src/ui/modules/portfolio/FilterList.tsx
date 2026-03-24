import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { Suspense } from 'react'
import PortfolioFilter from './PortfolioFilter'

export default async function PortfolioFilterList() {
	const categories = await fetchSanityLive<Sanity.PortfolioCategory[]>({
		query: groq`*[
            _type == 'portfolio.category' &&
            count(*[_type == 'portfolio.item' && references(^._id)]) > 0
        ]|order(title)`,
	})

	if (!categories) return null

	return (
		<fieldset>
			<legend className="sr-only">Filter by category</legend>

			<div className="portfolio-filters">
				<div className="portfolio-prompt mr-4">
					ROOT@PORTFOLIO:~#
				</div>

				<Suspense>
					<PortfolioFilter label="All" />

					{categories?.map((category, key) => (
						<PortfolioFilter
							label={category.title}
							value={category.slug?.current}
							key={key}
						/>
					))}
				</Suspense>
			</div>
		</fieldset>
	)
}
