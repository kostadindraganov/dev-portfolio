# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A developer portfolio built on SanityPress, using Next.js App Router + Sanity CMS.

- Frontend pages are composed from Sanity documents and module arrays
- Sanity Studio is embedded at `/admin`
- Core content types: `page`, `blog.post`, `portfolio.item`, `global-module`, `site`

## Commands

| Task | Command | Notes |
|---|---|---|
| Install dependencies | `npm install` | `.npmrc` sets `legacy-peer-deps=true` |
| Dev server | `npm run dev` | App + Studio (`/admin`) |
| Dev server (Turbopack) | `npm run dev:turbopack` | Faster local iteration |
| Build | `npm run build` | Runs `manifest` then `next build` |
| Start production build | `npm start` | Requires successful build |
| Typecheck | `npm run typecheck` | `tsc --noEmit` |
| Lint | `npm run lint` | `eslint .` |
| Lint single file | `npx eslint src/app/(frontend)/[[...slug]]/page.tsx` | Closest equivalent to single-test workflow |
| Extract Sanity manifest | `npm run manifest` | Outputs to `public/admin/static` |

Additional notes:
- Node version is `v22.14.0` (`.nvmrc`)
- No repo-level tests are configured; there is no native "run one test" command

## Architecture

### Route Groups

- `src/app/(frontend)/` — Public routes (catch-all pages, blog, portfolio)
- `src/app/(studio)/admin/` — Embedded Sanity Studio
- `src/app/api/` — Draft mode routes and OG image route

### Language routing and proxy

Language-aware redirects are handled in `src/proxy.ts` (not `src/middleware.ts`).

- Uses Sanity translations from `getTranslations()`
- Matcher excludes `/api`, `/admin`, `/_next`, and `/favicon.ico`
- Supported languages are configured in `src/lib/i18n.ts` — add/enable entries in `supportedLanguages` there

### URL constants

`src/lib/env.ts` exports `BLOG_DIR = 'blog'` and `PORTFOLIO_DIR = 'portfolio'`. These constants are used throughout GROQ queries and URL construction — do not hardcode the path strings.

### Data layer

- `src/sanity/lib/client.ts` — `next-sanity` client with stega support
- `src/sanity/lib/fetch.ts` — `fetchSanity()` / `fetchSanityLive()` wrappers
  - Dev or draft mode: `perspective: 'drafts'`, no CDN, token enabled
  - Published mode: `perspective: 'published'`, CDN enabled, 1h revalidate
- `src/sanity/lib/live.ts` — Live Content API wiring (`sanityFetch`, `SanityLive`)
- `src/sanity/lib/queries.ts` — GROQ fragments + page/post query composition

### Visual editing and draft mode

- `src/sanity/presentation.ts` configures Presentation Tool routes/locations
- `src/ui/VisualEditingControls.tsx` enables overlays in draft mode
- Draft mode endpoints are under `src/app/api/draft-mode/*`

### Module system (critical project pattern)

Pages render from Sanity module arrays via `src/ui/modules/index.tsx` (`MODULE_MAP`).

**When creating a new module, complete all five steps in order:**

1. Define the Sanity schema in `src/sanity/schemaTypes/modules/` and register it in `src/sanity/schemaTypes/index.ts`.
2. Add the TypeScript interface to `src/types/Sanity.d.ts` under the `// modules` section, in alphabetical order.
3. If the module fetches dereferenced or joined data, add a conditional expansion to `MODULES_QUERY` in `src/sanity/lib/queries.ts`:
   ```ts
   _type == 'your-module' => { field-> }
   ```
4. Create the frontend component under `src/ui/modules/`:
   - If the module has interactive (`use client`) sub-components, create it as `ModuleName/index.tsx` and isolate reactive parts in sibling files.
   - Otherwise, place it directly as `ModuleName.tsx`.
5. Add the component to `MODULE_MAP` in `src/ui/modules/index.tsx`, in alphabetical order.

Missing any step causes missing data or a silently non-rendering module.

**MODULE_MAP key naming conventions:**
- Kebab-case for most types: `accordion-list`, `card-list`, `richtext-module`
- Dot-notation for variants: `hero.split`, `hero.saas`, `hero.split`, `testimonial.featured`, `home.portfolio`, `scroll.hero`

**Passing extra props to modules:**
Some modules need data beyond their Sanity document (e.g. `post`, `page`, `headerMenu`). Add a case for these in the `getAdditionalProps` switch in `src/ui/modules/index.tsx`.

### Global module composition

`global-module` documents inject modules around page/post modules.

Composition order in frontend queries:
1. global before (`path == '*'`)
2. path-specific before
3. document modules
4. path-specific after
5. global after (`path == '*'`)

For detail templates:
- Blog posts depend on global modules with `path == 'blog/'`
- Portfolio items depend on global modules with `path == 'portfolio/'`

### Sanity schema organization

`src/sanity/schemaTypes/`:
- `documents/` — top-level content docs (`site`, `page`, `blog.post`, `portfolio.item`, `navigation`, `global-module`, `redirect`)
- `modules/` — page-builder modules
- `objects/` — reusable fields (`metadata`, `img`, `link`, `cta`, `module-options`, `icon`, `youtube`)
- `misc/` — supporting documents (`person`, `testimonial`, `pricing`, `logo`, `reputation`, `announcement`)
- `fragments/` — reusable GROQ query fragments and shared field definitions (e.g. `image-block`, `textAlign`, `admonition`)

Schema registry entry point: `src/sanity/schemaTypes/index.ts`.

## Conventions

From `.cursor/rules/sanitypress.mdc` and established code style:

- Prefer React Server Components; minimize `'use client'`
- Use `<Img>` (`src/ui/Img.tsx`) for all images sourced from Sanity — do not use `<img>` or `next/image` directly for CMS assets
- For Sanity schema, use `defineType`, `defineField`, `defineArrayMember`
- Use camelCase for schema `name` values; omit `title` unless the name is an abbreviation or all-caps
- Prefer `react-icons/vsc` for schema `icon` fields
- Rich text fields: use `array` of `block` type, not the `text` primitive
- Module schemas: separate fields into `content` and `options` groups; always include `module-options` as the first field in the `options` group
- Use `.vscode/sanitypress.code-snippets` for schema and module boilerplate scaffolding

## Environment variables

Required:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

Optional:
- `NEXT_PUBLIC_GITHUB_TOKEN`
- `NEXT_PUBLIC_YOUTUBE_API_KEY`

## Paths and aliases

From `tsconfig.json`:
- `@/*` → `./src/*`
- `$/*` → `./*`

Global Sanity typings are declared in `src/types/Sanity.d.ts`.
