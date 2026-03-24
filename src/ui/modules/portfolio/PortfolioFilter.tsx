'use client'

import { usePortfolioFilters } from '../blog/store'
import { usePageState } from '@/lib/usePagination'

export default function PortfolioFilter({
	label,
	value = 'All',
}: {
	label: string
	value?: 'All' | string
}) {
	const { category, setCategory } = usePortfolioFilters()
	const { setPage } = usePageState()

	return (
		<button
			className="portfolio-filter-btn"
			data-active={category === value}
			onClick={() => {
				setCategory(value)
				setPage(1)
			}}
		>
			{`{${label.toUpperCase()}}`}
		</button>
	)
}
