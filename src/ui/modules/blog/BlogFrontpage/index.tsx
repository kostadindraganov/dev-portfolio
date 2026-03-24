import { cookies } from 'next/headers'
import { DEFAULT_LANG, langCookieName } from '@/lib/i18n'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { stegaClean } from 'next-sanity'
import sortFeaturedPosts from './sortFeaturedPosts'
import { Suspense } from 'react'
import PostPreviewLarge from '../PostPreviewLarge'
import FilterList from '../BlogList/FilterList'
import PostPreview from '../PostPreview'
import BlogPaginated from './Paginated'
import PortfolioFilterList from '../../portfolio/FilterList'
import PortfolioPaginated from '../../portfolio/Paginated'
import PortfolioTerminalHeader from '../../portfolio/PortfolioTerminalHeader'

export default async function BlogFrontpage({
	mainPost,
	showFeaturedPostsFirst,
	itemsPerPage,
}: Partial<{
	mainPost: 'recent' | 'featured'
	showFeaturedPostsFirst: boolean
	itemsPerPage: number
}>) {
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG

	const posts = await fetchSanityLive<Sanity.BlogPost[]>({
		query: groq`
			*[
				_type == 'blog.post'
				${!!lang ? `&& (!defined(language) || language == '${lang}')` : ''}
			]|order(publishDate desc){
				_type,
				_id,
				featured,
				categories[]->,
				authors[]->,
				publishDate,
				language,
				metadata {
					...,
					image { ${IMAGE_QUERY} }
				},
			}
		`,
	})

	const [firstPost, ...otherPosts] =
		stegaClean(mainPost) === 'featured' ? sortFeaturedPosts(posts) : posts

	return (
		<section className="section space-y-12">
			<PostPreviewLarge post={firstPost} />

			<hr />

			<FilterList />

			<Suspense
				fallback={
					<ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
						{Array.from({ length: itemsPerPage ?? 6 }).map((_, i) => (
							<li key={i}>
								<PostPreview skeleton />
							</li>
						))}
					</ul>
				}
			>
				<BlogPaginated
					posts={sortFeaturedPosts(otherPosts, showFeaturedPostsFirst)}
					itemsPerPage={itemsPerPage}
				/>
			</Suspense>
		</section>
	)
}

export async function PortfolioFrontpage({
	mainItem,
	showFeaturedFirst,
	itemsPerPage,
}: Partial<{
	mainItem: 'recent' | 'featured'
	showFeaturedFirst: boolean
	itemsPerPage: number
}>) {
	const lang = (await cookies()).get(langCookieName)?.value ?? DEFAULT_LANG

	const items = await fetchSanityLive<Sanity.PortfolioItem[]>({
		query: groq`
            *[
                _type == 'portfolio.item'
				${!!lang ? `&& (!defined(language) || language == '${lang}')` : ''}
            ]|order(publishDate desc){
                _type,
                _id,
                featured,
                categories[]->,
                authors[]->,
                publishDate,
                language,
                metadata { ..., image { ${IMAGE_QUERY} } },
            }
        `,
	})

	const allItems: Sanity.PortfolioItem[] =
		stegaClean(mainItem) === 'featured'
			? sortFeaturedPosts(items as any)
			: (items as any)

	return (
		<section className="portfolio-terminal">
			<div className="mx-auto max-w-screen-xl space-y-8 p-8 max-md:px-4">
				<PortfolioFilterList />

				<PortfolioTerminalHeader totalCount={allItems.length} />

				<Suspense
					fallback={
						<div className="portfolio-grid">
							{Array.from({ length: itemsPerPage ?? 6 }).map((_, i) => (
								<div
									key={i}
									className="portfolio-card animate-pulse"
									style={{ minHeight: 280 }}
								/>
							))}
						</div>
					}
				>
					<PortfolioPaginated
						items={
							sortFeaturedPosts(
								allItems as any,
								showFeaturedFirst,
							) as any
						}
						itemsPerPage={itemsPerPage}
					/>
				</Suspense>
			</div>
		</section>
	)
}
