# OneClickIT.blog

## Project Overview
Tech blog built with Next.js 14 (App Router) + Sanity v3 CMS. Deployed on Vercel.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript, Tailwind CSS, App Router
- **CMS**: Sanity v3, embedded Studio at `/admin` via next-sanity
- **Content fetching**: GROQ via `sanityFetch()` with tag-based ISR revalidation
- **Image handling**: `@sanity/image-url` via `urlFor()` helper
- **Theme**: next-themes with dark mode support

## Key Conventions
- Server Components by default. Client components only for interactivity (`'use client'`)
- All Sanity queries in `src/sanity/lib/queries.ts` using `groq` tagged templates
- All TypeScript types in `src/types/sanity.ts`
- All Sanity schemas in `src/sanity/schemas/` (documents/ and objects/)
- Tag-based cache invalidation: every `sanityFetch()` declares tags, webhook maps `_type` to tags
- Affiliate links use `rel="nofollow sponsored"` automatically via PortableText `isAffiliate` annotation
- Feature flags (`enableAds`, `enableAffiliate`) controlled from Sanity siteSettings

## File Structure
```
src/
  app/              # Next.js App Router pages
    (blog)/         # Blog route group (post, digest, category)
    (legal)/        # Legal pages (about, privacy, terms, affiliate)
    admin/          # Sanity Studio embed
    api/            # Webhook + worker API stubs
  sanity/
    schemas/        # Sanity document and object schemas
    lib/queries.ts  # All GROQ queries
    fetch.ts        # sanityFetch() helper (server-only)
    client.ts       # Public Sanity client
    image.ts        # urlFor() image helper
  components/       # React components organized by domain
  lib/              # Utilities and constants
  types/            # TypeScript interfaces
```

## Commands
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint check

## Content Types
Documents: `original_post`, `buyer_guide`, `news_digest`, `trend_radar`, `source`, `category`, `author`, `siteSettings`
Objects: `seo`, `portableText`, `digestItem`, `product`, `trendItem`

## Revalidation
Sanity webhook POSTs to `/api/revalidate` with HMAC signature. Maps `_type` to cache tags for surgical invalidation.

## Worker APIs (stubs, ready for implementation)
- `POST /api/ingest` — RSS feed ingestion
- `POST /api/trends` — Trend discovery
- `POST /api/draft` — AI article drafting
All require `Authorization: Bearer {CRON_SECRET}` header.
