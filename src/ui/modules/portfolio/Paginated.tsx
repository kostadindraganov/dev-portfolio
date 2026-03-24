'use client'

import { usePagination } from '@/lib/usePagination'
import PortfolioList, { useFilterPortfolioItems } from './List'

export default function Paginated({
	items,
	itemsPerPage = 6,
}: {
	items: Sanity.PortfolioItem[]
	itemsPerPage?: number
}) {
	const { paginatedItems, Pagination } = usePagination({
		items: useFilterPortfolioItems(items),
		itemsPerPage,
	})

	function scrollToList() {
		if (typeof window !== 'undefined')
			document
				.querySelector('#portfolio-list')
				?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="relative space-y-8">
			<PortfolioList
				id="portfolio-list"
				items={paginatedItems}
				className="portfolio-grid scroll-mt-[calc(var(--header-height)+1rem)]"
			/>

			<Pagination
				className="flex items-center justify-center"
				buttonClassName="portfolio-load-more"
				onClick={scrollToList}
			/>
		</div>
	)
}
