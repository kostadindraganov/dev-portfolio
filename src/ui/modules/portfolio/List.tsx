'use client'

import { usePortfolioFilters } from '../blog/store'
import PortfolioCard from './PortfolioCard'

export default function PortfolioList({
	items,
	...props
}: {
	items: Sanity.PortfolioItem[]
} & React.ComponentProps<'div'>) {
	const filtered = useFilterPortfolioItems(items)

	if (!filtered.length) {
		return (
			<div className="portfolio-record-count py-12 text-center">
				[ 0_RECORDS_FOUND ]
			</div>
		)
	}

	return (
		<div {...props}>
			{filtered.map((item) => (
				<PortfolioCard item={item} key={item._id} />
			))}
		</div>
	)
}

export function useFilterPortfolioItems(items: Sanity.PortfolioItem[]) {
	const { category, author } = usePortfolioFilters()

	return items.filter((item) => {
		if (category !== 'All' && author)
			return (
				item.authors?.some(({ slug }) => slug?.current === author) &&
				item.categories?.some(({ slug }) => slug?.current === category)
			)

		if (category !== 'All')
			return item.categories?.some(({ slug }) => slug?.current === category)

		if (author)
			return item.authors?.some(({ slug }) => slug?.current === author)

		return true
	})
}
