import { defineField, defineType } from 'sanity'
import { VscEdit } from 'react-icons/vsc'

export default defineType({
	name: 'portfolio-item-content',
	title: 'Portfolio item content',
	icon: VscEdit,
	type: 'object',
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
		}),
	],
	preview: {
		select: { uid: 'options.uid' },
		prepare: ({ uid }) => ({
			title: 'Portfolio item content',
			subtitle: uid && `#${uid}`,
		}),
	},
})
