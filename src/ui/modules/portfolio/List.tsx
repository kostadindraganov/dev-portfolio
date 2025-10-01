'use client'

import { usePortfolioFilters } from '../blog/store'
import PostPreview from '../blog/PostPreview'

export default function PortfolioList({
	items,
	...props
}: {
	items: Sanity.PortfolioItem[]
} & React.ComponentProps<'ul'>) {
	const filtered = filterPortfolioItems(items)

	if (!filtered.length) {
		return <div>No items found...</div>
	}

	return (
		<ul {...props}>
			{filtered?.map((item) => (
				<li className="anim-fade" key={item._id}>
					{/* Reuse blog preview temporarily; fields are compatible */}
					<PostPreview post={item as any} />
				</li>
			))}
		</ul>
	)
}

export function filterPortfolioItems(items: Sanity.PortfolioItem[]) {
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
