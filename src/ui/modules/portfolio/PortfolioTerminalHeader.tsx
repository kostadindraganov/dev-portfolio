'use client'

import { usePortfolioFilters } from '../blog/store'

export default function PortfolioTerminalHeader({
	totalCount,
}: {
	totalCount: number
}) {
	const { category } = usePortfolioFilters()

	const displayTitle =
		category === 'All' ? 'PORTFOLIO' : category.toUpperCase().replace(/\s+/g, '_')

	return (
		<div className="space-y-4">
			<h1 className="portfolio-title">{displayTitle}</h1>
			<div className="portfolio-record-count">
				[ {totalCount}_RECORDS_FOUND ]
			</div>
		</div>
	)
}
