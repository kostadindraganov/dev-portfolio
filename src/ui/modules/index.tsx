import AccordionList from './AccordionList'
import BlogFrontpage from './blog/BlogFrontpage'
import BlogList from './blog/BlogList'
import BlogPostContent from './blog/PostContent'
import { PortfolioFrontpage } from './blog/BlogFrontpage'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CardList from './CardList'
import CustomHTML from './CustomHTML'
import FlagList from './FlagList'
import Hero from './Hero'
import HeroSplit from './HeroSplit'
import HeroSaaS from './HeroSaaS'
import HomePortfolio from './HomePortfolio'
import ScrollHero from './ScrollHero/ScrollHero'
import LogoList from './LogoList'
import RichtextModule from './RichtextModule'
import ScheduleModule from './ScheduleModule'
import SearchModule from './SearchModule'
import StatList from './StatList'
import StepList from './StepList'
import TabbedContent from './TabbedContent'
import TestimonialList from './TestimonialList'
import TestimonialFeatured from './TestimonialFeatured'

import dynamic from 'next/dynamic'
import { createDataAttribute } from 'next-sanity'

const MODULE_MAP = {
	'accordion-list': AccordionList,
	'blog-frontpage': BlogFrontpage,
	'blog-list': BlogList,
	'blog-post-content': BlogPostContent,
	'portfolio-frontpage': PortfolioFrontpage,
	'portfolio-list': BlogList,
	'portfolio-item-content': BlogPostContent,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'card-list': CardList,
	'creative-module': dynamic(() => import('./CreativeModule')),
	'custom-html': CustomHTML,
	'flag-list': FlagList,
	hero: Hero,
	'hero.split': HeroSplit,
	'hero.saas': HeroSaaS,
	'home.portfolio': HomePortfolio,
	'scroll.hero': ScrollHero,
	'logo-list': LogoList,
	'person-list': dynamic(() => import('./PersonList')),
	'pricing-list': dynamic(() => import('./PricingList')),
	'richtext-module': RichtextModule,
	'schedule-module': ScheduleModule,
	'search-module': SearchModule,
	'stat-list': StatList,
	'step-list': StepList,
	'tabbed-content': TabbedContent,
	'testimonial-list': TestimonialList,
	'testimonial.featured': TestimonialFeatured,
} as const

export default function Modules({
	modules,
	page,
	post,
	headerMenu,
}: {
	modules?: Sanity.Module[]
	page?: Sanity.Page
	post?: Sanity.BlogPost | Sanity.PortfolioItem
	headerMenu?: Sanity.Navigation
}) {
	const getAdditionalProps = (module: Sanity.Module) => {
		switch (module._type) {
			case 'blog-post-content':
				return { post }
			case 'portfolio-item-content':
				return { post }
			case 'breadcrumbs':
				return { currentPage: post || page }
			case 'home.portfolio':
				return { headerMenu }
			default:
				return {}
		}
	}

	return (
		<>
			{modules?.map((module) => {
				if (!module) return null

				const Component = MODULE_MAP[module._type as keyof typeof MODULE_MAP]

				if (!Component) return null

				return (
					<Component
						{...(module as any)}
						{...(getAdditionalProps(module) as any)}
						data-sanity={
							page?._id
								? createDataAttribute({
										id: page._id,
										type: page._type,
										path: `page[_key == "${module._key}"]`,
									}).toString()
								: undefined
						}
						key={module._key}
					/>
				)
			})}
		</>
	)
}
