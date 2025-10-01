import type { SanityImageObject } from '@sanity/image-url/lib/types/types'
import type { SanityAssetDocument, SanityDocument } from 'next-sanity'

declare global {
	namespace Sanity {
		// documents

		interface Site extends SanityDocument {
			// branding
			title: string
			blurb?: any
			logo?: Logo
			// info
			announcements?: Announcement[]
			copyright?: any
			ogimage?: string
			// navigation
			ctas?: CTA[]
			headerMenu?: Navigation
			footerMenu?: Navigation
			social?: Navigation
		}

		interface Navigation extends SanityDocument {
			title: string
			items?: (Link | LinkList)[]
		}

		// pages

		interface PageBase extends SanityDocument {
			title?: string
			metadata: Metadata
			readonly language?: string
		}

		interface Page extends PageBase {
			readonly _type: 'page'
			modules?: Module[]
		}

		interface Translation {
			slug: string
			translations?: {
				slug: string
				slugBlogAlt?: string
				language: string
			}[]
		}

		interface GlobalModule extends SanityDocument {
			path: string
			excludePaths?: string[]
			modules?: Module[]
		}

		interface BlogPost extends PageBase {
			readonly _type: 'blog.post'
			body: any
			readTime: number
			headings?: { style: string; text: string }[]
			categories: BlogCategory[]
			authors: Person[]
			featured: boolean
			hideTableOfContents: boolean
			publishDate: string
		}

		interface BlogCategory extends SanityDocument {
			title: string
			slug: { current: string }
		}

		interface PortfolioItem extends PageBase {
			readonly _type: 'portfolio.item'
			body: any
			readTime: number
			headings?: { style: string; text: string }[]
			categories: PortfolioCategory[]
			authors: Person[]
			featured: boolean
			hideTableOfContents: boolean
			publishDate: string
		}

		interface PortfolioCategory extends SanityDocument {
			title: string
			slug: { current: string }
		}

		// miscellaneous

		interface Announcement extends SanityDocument {
			content: any
			cta?: Link
			start?: string
			end?: string
		}

		interface Logo extends SanityDocument {
			name: string
			image?: Partial<{
				default: Image
				light: Image
				dark: Image
			}>
		}

		interface Person extends SanityDocument {
			name: string
			image?: Image
		}

		interface Pricing extends SanityDocument {
			title: string
			highlight?: string
			price: {
				base?: number
				strikethrough?: number
				suffix?: string
			}
			ctas?: CTA[]
			content?: any
		}

		interface Reputation extends SanityDocument {
			title?: string
			subtitle?: string
			repo?: string
			showForks?: boolean
			limit?: number
			avatars?: Image[]
		}

		interface Testimonial extends SanityDocument {
			content: any
			source?: string
			author?: {
				name: string
				title?: string
				image?: Image
			}
		}

		// objects

		interface YouTubeObject {
			readonly _type?: 'youtube' | 'youtubeVideo'
			id?: string
			url?: string
			title?: string
		}

		interface Code {
			readonly _type: 'code'
			language: string
			code: string
			filename?: string
			highlightedLines?: number[]
		}

		interface CTA {
			readonly _type?: 'cta'
			_key?: string
			link?: Link
			style?: string
		}

		interface CustomHTML extends Module<'custom-html'> {
			className?: string
			html?: {
				code: string
			}
		}

		interface Icon {
			readonly _type: 'icon'
			image?: Image
			ic0n?: string
			size?: string
		}

		interface Img {
			readonly _type: 'img'
			image: Image
			responsive?: {
				image: Image
				media: string
			}[]
			alt?: string
			loading?: 'lazy' | 'eager'
		}

		interface Image extends SanityAssetDocument {
			alt: string
			loading: 'lazy' | 'eager'
		}

		interface Link {
			readonly _type: 'link'
			label: string
			type: 'internal' | 'external'
			internal?: Page | BlogPost | PortfolioItem
			external?: string
			params?: string
		}

		interface LinkList {
			readonly _type: 'link.list'
			link?: Link
			links?: Link[]
		}

		interface Metadata {
			slug: { current: string }
			title: string
			description: string
			image?: Image
			ogimage?: string
			noIndex: boolean
		}

		interface Module<T = string> {
			_type: T
			_key: string
			options?: {
				hidden?: boolean
				uid?: string
			}
		}

		// modules
		interface BlogList extends Module<'blog-list'> {
			pretitle?: string
			intro?: any
			layout: 'grid' | 'carousel'
			showFeaturedPostsFirst: boolean
			displayFilters: boolean
			limit?: number
			filteredCategory?: BlogCategory
		}

		interface PortfolioList extends Module<'portfolio-list'> {
			pretitle?: string
			intro?: any
			layout: 'grid' | 'carousel'
			showFeaturedFirst: boolean
			displayFilters: boolean
			limit?: number
			filteredCategory?: PortfolioCategory
		}

		interface PortfolioFrontpage extends Module<'portfolio-frontpage'> {
			mainItem: 'recent' | 'featured'
			showFeaturedFirst: boolean
			itemsPerPage: number
		}

		interface PortfolioItemContent extends Module<'portfolio-item-content'> {
			options?: {
				hidden?: boolean
				uid?: string
			}
		}
	}
}

export {}
