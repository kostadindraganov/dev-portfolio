> [!NOTE]

## Key Features

- [x] ✨ Next.js 15 (App Router, RSC, Typescript) with Tailwind 4
- [x] 📕 [Pre-configured Sanity schema](/src/sanity/schemaTypes/index.ts) & [frontend components](/src/ui/)
- [x] ⌨️ Auto-generated [sitemap](/sitemap.xml) + [Blog RSS feed](/blog/rss.xml)
- [x] ⚡ [Perfect Lighthouse scores] on desktop and mobile.

## Getting Started

### 1. Install with the Sanity CLI

### 2. Start local server

Run the following command to start the development server:

- Website: http://localhost:3000
- Sanity Studio: http://localhost:3000/admin

```sh
npm run dev
```

### 3. Add content

In your new Sanity Studio, publish the **required** `site` and `page` documents.

| Document        | Slug           | Use             | Required? | Notes                                                                                          |
| --------------- | -------------- | --------------- | :-------: | ---------------------------------------------------------------------------------------------- |
| `site`          |                | Global settings |    ✅     |                                                                                                |
| `page`          | `index`        | Homepage        |    ✅     |                                                                                                |
| `page`          | `404`          | Page not found  |           |                                                                                                |
| `page`          | `blog`         | Blog listing    |           | Add the [**Blog frontpage**](https://sanitypress.dev/docs/modules/blog-frontpage) module       |
| `global-module` | `blog/` (path) | Blog post       |           | Add the [**Blog post content**](https://sanitypress.dev/docs/modules/blog-post-content) module |

```sh
sanity dataset import src/sanity/demo.tar.gz
```

### 4. Set up deployments

#### 1. Create a GitHub repository

Create a GitHub repository from this project. [Learn more](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

#### 2. Set up deployments

Create a new [Vercel](https://vercel.com) / [Netlify](https://www.netlify.com) / etc project, connecting it to your Github repository

Set up your deployment settings, such as the **Root Directory** to your Next.js app.

#### 3. Set environment variables

Configure your Environment Variables in Vercel / Netlify / etc.

```ini
NEXT_PUBLIC_BASE_URL="" # https://sanitypress.dev

NEXT_PUBLIC_SANITY_PROJECT_ID="" # abcdefgh
NEXT_PUBLIC_SANITY_DATASET="" # production
SANITY_API_READ_TOKEN="" # "Viewer" token from https://sanity.io/manage

NEXT_PUBLIC_GITHUB_TOKEN="" # recommended to add to display GitHub stars & forks
NEXT_PUBLIC_YOUTUBE_API_KEY=""
```

#### 4. Add a deployment widget to enable deployments directly from the Studio.

- Vercel: [`vercel-dashboard-widget`](https://www.sanity.io/plugins/vercel-dashboard-widget)
- Netlify: [`sanity-plugin-dashboard-widget-netlify`](https://www.sanity.io/plugins/sanity-plugin-dashboard-widget-netlify)
