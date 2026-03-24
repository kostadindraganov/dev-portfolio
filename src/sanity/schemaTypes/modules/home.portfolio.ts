import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
	name: 'home.portfolio',
	title: 'Home Portfolio',
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'preloader', title: 'Preloader' },
		{ name: 'whatWeDo', title: 'What We Do' },
		{ name: 'featuredWork', title: 'Featured Work' },
		{ name: 'gallery', title: 'Gallery Callout' },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),

		// --- Preloader ---
		defineField({
			name: 'preloaderFirstName',
			title: 'Preloader First Name',
			type: 'string',
			group: 'preloader',
			initialValue: 'Kostadin',
		}),
		defineField({
			name: 'preloaderLastName',
			title: 'Preloader Last Name',
			type: 'string',
			group: 'preloader',
			initialValue: 'Draganov',
		}),

		// --- What We Do ---
		defineField({
			name: 'whatWeDoHeading',
			title: 'What We Do Heading',
			type: 'string',
			group: 'whatWeDo',
			initialValue: 'At Terrene, we design with purpose and clarity,',
		}),
		defineField({
			name: 'howWeWorkTitle',
			title: '"How We Work" Title',
			type: 'string',
			group: 'whatWeDo',
			initialValue: 'How we work',
		}),
		defineField({
			name: 'howWeWorkDescription',
			title: '"How We Work" Description',
			type: 'text',
			rows: 4,
			group: 'whatWeDo',
			initialValue:
				'We approach each build with a clarity of intent. Every plan is shaped through research, iteration, and conversation. What remains is the essential, designed to last and built to feel lived in.',
		}),
		defineField({
			name: 'tags',
			title: 'Attribute Tags',
			type: 'array',
			group: 'whatWeDo',
			of: [defineArrayMember({ type: 'string' })],
			initialValue: ['Quiet', 'View', 'Tactile', 'Light-forward', 'Slow design', 'Modular rhythm'],
		}),

		// --- Featured Work ---
		defineField({
			name: 'featuredWorkLabel',
			title: 'Featured Work Label',
			type: 'string',
			group: 'featuredWork',
			initialValue: 'Featured work',
		}),
		defineField({
			name: 'featuredWorkTitle',
			title: 'Featured Work Title',
			type: 'string',
			group: 'featuredWork',
			initialValue: 'A selection of recent studies and completed spaces',
		}),
		defineField({
			name: 'featuredProjects',
			title: 'Featured Projects',
			type: 'array',
			group: 'featuredWork',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'featuredProject',
					fields: [
						defineField({ name: 'info', title: 'Info / Subtitle', type: 'string' }),
						defineField({ name: 'title', title: 'Title', type: 'string' }),
						defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
						defineField({
							name: 'image',
							title: 'Image',
							type: 'image',
							options: { hotspot: true },
							fields: [
								defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
							],
						}),
					],
					preview: {
						select: { title: 'title', media: 'image' },
						prepare: ({ title, media }) => ({ title: title || 'Untitled project', media }),
					},
				}),
			],
		}),

		// --- Gallery Callout ---
		defineField({
			name: 'galleryStatNumber',
			title: 'Gallery Stat Number',
			type: 'string',
			group: 'gallery',
			initialValue: '800+',
		}),
		defineField({
			name: 'galleryStatLabel',
			title: 'Gallery Stat Label',
			type: 'string',
			group: 'gallery',
			initialValue: 'Project Images',
		}),
		defineField({
			name: 'galleryCopyText',
			title: 'Gallery Copy Text',
			type: 'text',
			rows: 4,
			group: 'gallery',
			initialValue:
				'Take a closer look at the projects that define our practice. From intimate interiors to expansive landscapes, each image highlights a unique perspective that might spark your next big idea.',
		}),
		defineField({
			name: 'galleryCtaLabel',
			title: 'Gallery CTA Label',
			type: 'string',
			group: 'gallery',
			initialValue: 'Explore Gallery',
		}),
		defineField({
			name: 'galleryCtaRoute',
			title: 'Gallery CTA Route',
			type: 'string',
			group: 'gallery',
			initialValue: 'blueprints',
		}),
		defineField({
			name: 'galleryImages',
			title: 'Gallery Images (4)',
			type: 'array',
			group: 'gallery',
			validation: (rule) => rule.max(4),
			of: [
				defineArrayMember({
					type: 'image',
					name: 'galleryImage',
					options: { hotspot: true },
					fields: [
						defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			firstName: 'preloaderFirstName',
			lastName: 'preloaderLastName',
		},
		prepare: ({ firstName, lastName }) => ({
			title: `${firstName || 'Home'} ${lastName || 'Portfolio'}`,
			subtitle: 'Home Portfolio Module',
		}),
	},
})
