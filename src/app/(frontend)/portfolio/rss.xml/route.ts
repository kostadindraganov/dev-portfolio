import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { PORTFOLIO_DIR } from '@/lib/env'
import resolveUrl from '@/lib/resolveUrl'
import { Feed } from 'feed'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { urlFor } from '@/sanity/lib/image'
import { DEFAULT_LANG } from '@/lib/i18n'

export async function GET() {
	const { portfolio, items, copyright } = await fetchSanityLive<{
		portfolio: Sanity.Page
		items: Array<Sanity.PortfolioItem & { image?: string }>
		copyright: string
	}>({
		query: groq`{
            'portfolio': *[_type == 'page' && metadata.slug.current == '${PORTFOLIO_DIR}'][0]{
                _type,
                title,
                metadata,
                'image': metadata.image.asset->url,
            },
            'items': *[_type == 'portfolio.item']{
                _type,
                body,
                publishDate,
                authors[]->,
                metadata,
                'image': metadata.image.asset->url,
                language,
            },
            'copyright': pt::text(*[_type == 'site'][0].copyright)
        }`,
	})

	if (!portfolio || !items) {
		return new Response(
			'Missing either a portfolio page or portfolio items in Sanity Studio',
			{ status: 500 },
		)
	}

	const url = resolveUrl(portfolio)

	const feed = new Feed({
		title: (portfolio as any)?.title || portfolio.metadata.title,
		description: portfolio.metadata.description,
		link: url,
		id: url,
		copyright,
		favicon: process.env.NEXT_PUBLIC_BASE_URL + '/favicon.ico',
		language: DEFAULT_LANG,
		generator: 'https://sanitypress.dev',
	})

	items.map((item) => {
		const url = resolveUrl(item, { language: item.language })

		return feed.addItem({
			title: escapeHTML(item.metadata.title),
			description: item.metadata.description,
			id: url,
			link: url,
			published: new Date(item.publishDate),
			date: new Date(item.publishDate),
			author: item.authors?.map((author) => ({ name: author.name })),
			content: toHTML(item.body as any, {
				components: {
					types: {
						image: ({ value: { alt = '', caption, source, ...value } }) => {
							const img = `<img src="${urlFor(value).url()}" alt="${escapeHTML(alt)}" />`
							const figcaption =
								caption && `<figcaption>${escapeHTML(caption)}</figcaption>`
							const aSource = source && `<a href="${source}">(Source)</a>`
							return `<figure>${[img, figcaption, aSource].filter(Boolean).join(' ')}</figure>`
						},
						admonition: ({ value: { title, content } }) => {
							return `<dl><dt>${title}</dt><dd>${toHTML(content)}</dd></dl>`
						},
						code: ({ value }: any) =>
							`<pre><code>${escapeHTML(value.code)}</code></pre>`,
						'custom-html': () => '',
					},
				},
			}),
			image: (item as any).image,
		})
	})

	return new Response(feed.atom1(), {
		headers: {
			'Content-Type': 'application/atom+xml',
		},
	})
}
