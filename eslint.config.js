// @ts-check
import sanityStudio from '@sanity/eslint-config-studio'
import globals from 'globals'

export default [
	...sanityStudio,
	{
		// Browser globals for all client-side files in a Next.js project
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		ignores: ['.next/', '.sanity/', 'dist/', 'node_modules/', 'public/'],
	},
]
