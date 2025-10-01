import { defineField, defineType } from 'sanity'
import { VscPlay } from 'react-icons/vsc'

export default defineType({
	name: 'youtube',
	title: 'YouTube',
	type: 'object',
	icon: VscPlay,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'url',
			type: 'url',
			title: 'Video URL',
			description: 'Paste a full YouTube URL (watch, share, or youtu.be).',
			group: 'content',
			validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }).required(),
		}),
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'title', url: 'url' },
		prepare: ({ title, url }) => ({
			title: title || 'YouTube',
			subtitle: url,
		}),
	},
})
