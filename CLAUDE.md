# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A developer portfolio built on SanityPress, using Next.js App Router + Sanity CMS.

- Frontend pages are composed from Sanity documents and module arrays
- Sanity Studio is embedded at `/admin`
- Core content types include `page`, `blog.post`, `portfolio.item`, `global-module`, and `site`

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
- No repo-level tests are configured (no `npm test` script or test runner config outside `node_modules`), so there is no native “run one test” command yet

## Architecture

### Route Groups

- `src/app/(frontend)/` — Public routes (catch-all pages, blog, portfolio)
- `src/app/(studio)/admin/` — Embedded Sanity Studio
- `src/app/api/` — Draft mode routes and OG image route

### Language routing and proxy

Language-aware redirects are handled in `src/proxy.ts` (not `src/middleware.ts`).

- Uses Sanity translations from `getTranslations()`
- Matcher excludes `/api`, `/admin`, `/_next`, and `/favicon.ico`

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

When adding or changing a module, update all of these:
1. Schema in `src/sanity/schemaTypes/modules/`
2. Type in `src/types/Sanity.d.ts` (`// modules` section)
3. GROQ expansion in `MODULES_QUERY` (`src/sanity/lib/queries.ts`) when needed
4. Frontend mapping in `src/ui/modules/index.tsx`

Missing one of the four usually causes missing data or non-rendering modules.

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
- `documents/` — top-level content docs (`site`, `page`, `blog.post`, etc.)
- `modules/` — page-builder modules
- `objects/` — reusable fields (`metadata`, `img`, `link`, `cta`, `module-options`)
- `misc/` — supporting documents (`person`, `testimonial`, etc.)

Schema registry entry point: `src/sanity/schemaTypes/index.ts`.

## Conventions from repo rules

From `.cursor/rules/sanitypress.mdc` and established code style:

- Prefer React Server Components, minimize `'use client'`
- For Sanity schema, use `defineType`, `defineField`, `defineArrayMember`
- Use camelCase schema field names
- Prefer `react-icons/vsc` for schema icons when practical
- Rich text should be Portable Text arrays (`of: [{ type: 'block' }]`)
- Module schemas should separate `content` and `options` groups
- Include `module-options` in module schemas
- Use snippets from `.vscode/sanitypress.code-snippets` for schema/module scaffolding

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
