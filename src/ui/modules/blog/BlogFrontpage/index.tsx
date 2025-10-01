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

	const [first, ...rest] =
		stegaClean(mainItem) === 'featured'
			? sortFeaturedPosts(items as any)
			: (items as any)

	return (
		<section className="section space-y-12">
			<PostPreviewLarge post={first as any} />

			<hr />

			<PortfolioFilterList />

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
				<PortfolioPaginated
					items={sortFeaturedPosts(rest as any, showFeaturedFirst) as any}
					itemsPerPage={itemsPerPage}
				/>
			</Suspense>
		</section>
	)
}
