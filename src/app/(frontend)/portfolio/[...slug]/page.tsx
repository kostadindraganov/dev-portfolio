import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { PORTFOLIO_DIR } from '@/lib/env'
import {
	IMAGE_QUERY,
	MODULES_QUERY,
	TRANSLATIONS_QUERY,
} from '@/sanity/lib/queries'
import { languages, type Lang } from '@/lib/i18n'
import errors from '@/lib/errors'

export default async function Page({ params }: Props) {
	const item = await getItem(await params)
	if (!item) notFound()
	return <Modules modules={item.modules} post={item as any} />
}

export async function generateMetadata({ params }: Props) {
	const item = await getItem(await params)
	if (!item) notFound()
	return processMetadata(item)
}

export async function generateStaticParams() {
	const slugs = await client.fetch<string[]>(
		groq`*[_type == 'portfolio.item' && defined(metadata.slug.current)].metadata.slug.current`,
	)

	return slugs.map((slug) => ({ slug: slug.split('/') }))
}

async function getItem(params: Params) {
	const templateExists = await fetchSanityLive<boolean>({
		query: groq`count(*[_type == 'global-module' && path == '${PORTFOLIO_DIR}/']) > 0`,
	})

	if (!templateExists) throw new Error(errors.missingPortfolioTemplate)

	const { slug, lang } = processSlug(params)

	return await fetchSanityLive<
		Sanity.PortfolioItem & { modules: Sanity.Module[] }
	>({
		query: groq`*[
			_type == 'portfolio.item'
			&& metadata.slug.current == $slug
			${lang ? `&& language == '${lang}'` : ''}
		][0]{
			...,
			body[]{
				...,
				_type == 'image' => {
					${IMAGE_QUERY},
					asset->
				}
			},
			'readTime': length(string::split(pt::text(body), ' ')) / 200,
			'headings': body[style in ['h2', 'h3']]{
				style,
				'text': pt::text(@)
			},
			categories[]->,
			authors[]->,
			metadata { ...,
				'ogimage': image.asset->url + '?w=1200'
			},
			'modules': (
				*[_type == 'global-module' && path == '*'].before[]{ ${MODULES_QUERY} }
				+ *[_type == 'global-module' && path == '${PORTFOLIO_DIR}/'].before[]{ ${MODULES_QUERY} }
				+ *[_type == 'global-module' && path == '${PORTFOLIO_DIR}/'].after[]{ ${MODULES_QUERY} }
				+ *[_type == 'global-module' && path == '*'].after[]{ ${MODULES_QUERY} }
			),
			${TRANSLATIONS_QUERY},
		}`,
		params: { slug },
	})
}

type Params = { slug: string[] }

type Props = { params: Promise<Params> }

function processSlug(params: Params) {
	const lang = languages.includes(params.slug[0] as Lang)
		? params.slug[0]
		: undefined
	const slug = params.slug.join('/')
	return { slug: lang ? slug.replace(new RegExp(`^${lang}/`), '') : slug, lang }
}
