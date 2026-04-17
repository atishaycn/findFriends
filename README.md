# Friend Graph

Friend Graph is a mobile-first web app where one starter creates a round, friends pass invite links through chat, and the full network unlocks only when a valid loop closes the round.

## Product model

- One authenticated user starts one round.
- Each claimed invite creates one participant node for that user in that round.
- Direct send-backs to the inviter's parent are warnings, not loops.
- The first valid connection back to any other earlier participant closes the round.
- Once complete, the round locks, the final graph unlocks, and completion emails go out.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth for magic-link email sign-in
- Supabase Postgres via `postgres`
- Resend for completion emails
- D3 for the final graph layout

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=friend-graph@example.com
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Apply the database schema:

```bash
npm run db:push
```

3. Start the app:

```bash
npm run dev
```

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run db:push
```

## Supabase auth email branding

For local CLI-based Supabase config, the repo includes:

- `supabase/config.toml`
- `supabase/templates/confirm-signup.html`
- `supabase/templates/magic-link.html`

Those brand the confirmation and sign-in emails with `findFriends`.

## Core routes

- `/`: landing page and magic-link entry
- `/studio`: create rounds and list your active/completed rounds
- `/r/:slug`: participant workspace with invite generation and polling status
- `/r/:slug/graph`: final graph reveal
- `/invite/:token`: invite claim flow

## API routes

- `POST /api/rounds`
- `POST /api/invites`
- `POST /api/invites/:token/claim`
- `GET /api/rounds/:slug`
- `GET /api/rounds/:slug/graph`

## Database schema

The canonical schema lives in [supabase/schema.sql](./supabase/schema.sql).

- `rounds`: round metadata and completion state
- `participants`: one node per authenticated user per round
- `invites`: unclaimed or consumed share links
- `connections`: visible graph edges, including the closing loop edge
