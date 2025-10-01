import { defineField, defineType } from 'sanity'
import { VscEdit } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'portfolio-list',
	title: 'Portfolio list',
	icon: VscEdit,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'filtering' },
		{ name: 'options' },
	],
	fields: [
		defineField({ name: 'options', type: 'module-options', group: 'options' }),
		defineField({ name: 'pretitle', type: 'string', group: 'content' }),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'layout',
			type: 'string',
			options: { list: ['grid', 'carousel'], layout: 'radio' },
			initialValue: 'carousel',
			group: 'options',
		}),
		defineField({
			name: 'showFeaturedFirst',
			type: 'boolean',
			initialValue: true,
			group: 'filtering',
		}),
		defineField({
			name: 'displayFilters',
			title: 'Display category filter buttons',
			description: 'Allows for on-page filtering of items by category',
			type: 'boolean',
			initialValue: false,
			group: 'filtering',
			hidden: ({ parent }) => !!parent.filteredCategory,
		}),
		defineField({
			name: 'limit',
			title: 'Number of items to show',
			description: 'Leave empty to show all items',
			type: 'number',
			initialValue: 6,
			validation: (Rule) => Rule.min(1).integer(),
			group: 'filtering',
		}),
		defineField({
			name: 'filteredCategory',
			title: 'Filter items by a category',
			description: 'Leave empty to show all items',
			type: 'reference',
			to: [{ type: 'portfolio.category' }],
			group: 'filtering',
		}),
	],
	preview: {
		select: { intro: 'intro' },
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Portfolio list',
		}),
	},
})
