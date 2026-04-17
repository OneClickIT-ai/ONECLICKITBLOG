# OneClickIT Blog

A technology blog built with Next.js 14 and Sanity CMS, powering [oneclickittoday.com](https://oneclickittoday.com).

## Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Analytics**: Vercel Analytics

## Required Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name (e.g. `production`) |
| `SANITY_API_TOKEN` | Sanity API token for server-side reads/writes |

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/oneclickitai/ONECLICKITBLOG.git
   cd ONECLICKITBLOG
   ```

2. Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the blog. Sanity Studio is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/sanity/` — Sanity client configuration, schemas, and queries
- `src/components/` — Shared React components

## Architecture

See [CLAUDE.md](CLAUDE.md) for detailed architecture notes.
