export default {
	missingBaseUrl:
		'Missing base url: 🤞 Domain Expansion (Unlimited Void) requires a proper URL!\n\n' +
		'Solution: Set your website URL as NEXT_PUBLIC_BASE_URL in your environment variables (including https://).\n\n' +
		'💁‍♂️ https://sanitypress.dev/docs/errors#missing-base-url',

	missingSiteSettings:
		'Missing Site settings: 🫠 Your website might be having an identity crisis...\n\n' +
		'Solution: Publish the Site document in your Sanity Studio.\n\n' +
		'💁‍♂️ https://sanitypress.dev/docs/errors#missing-site-settings',

	missingHomepage:
		"Missing homepage: 🏚️ There's no place like... index?\n\n" +
		'Solution: Add a new Page document in your Sanity Studio with the slug "index".\n\n' +
		'💁‍♂️ https://sanitypress.dev/docs/errors#missing-homepage',

	missingBlogTemplate:
		'Missing blog template: 👻 Oof, your blog posts are ghosting...\n\n' +
		'Solution: Add a new Global module document in your Sanity Studio with the path "blog/".\n' +
		'Also add the Blog post content module to display blog post content.\n\n' +
		'💁‍♂️ https://sanitypress.dev/docs/errors#missing-blog-template',

	missingPortfolioTemplate:
		'Missing portfolio template: 🔍 Your portfolio items are hiding...\n\n' +
		'Solution: Add a new Global module document in your Sanity Studio with the path "portfolio/".\n' +
		'Also add the Portfolio item content module to display portfolio item content.\n\n' +
		'💁‍♂️ https://sanitypress.dev/docs/errors#missing-portfolio-template',
}
