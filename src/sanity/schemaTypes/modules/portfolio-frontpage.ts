import { defineField, defineType } from 'sanity'
import { ImNewspaper } from 'react-icons/im'

export default defineType({
	name: 'portfolio-frontpage',
	title: 'Portfolio frontpage',
	icon: ImNewspaper,
	type: 'object',
	fields: [
		defineField({
			name: 'mainItem',
			description: 'Choose which item to display as the main item',
			type: 'string',
			options: {
				list: [
					{ title: 'Most recent item', value: 'recent' },
					{ title: 'Featured item', value: 'featured' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'showFeaturedFirst',
			description: 'In the list below the main item',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'itemsPerPage',
			type: 'number',
			initialValue: 6,
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { mainItem: 'mainItem' },
		prepare: ({ mainItem }) => ({
			title: 'Portfolio frontpage',
			subtitle: `Main item: ${mainItem}`,
		}),
	},
})
