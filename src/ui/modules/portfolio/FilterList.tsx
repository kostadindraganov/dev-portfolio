import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { Suspense } from 'react'
import Filter from '../blog/BlogList/Filter'
import css from '../blog/BlogList/FilterList.module.css'
import { cn } from '@/lib/utils'

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

			<div
				className={cn(
					css.list,
					'filtering group flex flex-wrap gap-1 max-sm:justify-center',
				)}
			>
				<Suspense>
					<Filter label="All" />

					{categories?.map((category, key) => (
						<Filter
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
