# Friend Graph Operating Brief

## Purpose
- Build and maintain a beginner-friendly, mobile-first Friend Graph app where one person starts a round, friends pass invite links through chat, and the finished graph unlocks only when a valid closing loop happens.

## Stack And Boundaries
- Runtime: Next.js App Router with TypeScript.
- Frontend: Server-first pages with isolated client components, Tailwind v4, Framer Motion, and Phosphor icons.
- Auth: Supabase magic-link auth callback and server session helpers.
- Data: Supabase Postgres accessed from server code through `postgres`.
- Email: Resend for completion notifications.
- Auth email branding: Supabase auth email subjects/templates live in `supabase/config.toml` and `supabase/templates/`.
- Keep repo-tracked source under `src/`, SQL in `supabase/`, and helper scripts in `scripts/`.

## Important Files
- `src/app/`: pages, layouts, loading states, route handlers, and auth callback.
- `src/components/`: page-level UI, client leaves, and shared layout pieces.
- `src/lib/`: auth, database, validation, query, email, and route helpers.
- `supabase/config.toml`: local/self-hosted Supabase auth config, including branded auth email subjects.
- `supabase/schema.sql`: canonical database schema for rounds, participants, invites, and connections.
- `supabase/templates/`: Supabase auth email HTML templates.
- `scripts/apply-schema.mjs`: applies the SQL schema to `DATABASE_URL`.

## Run And Verify
- `npm run dev`: local app development.
- `npm run lint`: ESLint.
- `npm run test`: Vitest unit coverage for core round logic.
- `npm run build`: production build verification.
- `npm run db:push`: apply `supabase/schema.sql` to the configured database.
- Vercel Production must define `NEXT_PUBLIC_SUPABASE_URL` plus one current public browser key for that same Supabase project: `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Working Rules
- Preserve the round invariant: a round is a tree plus one valid closing edge.
- Direct returns to the inviter's parent are warnings, not loops.
- Do not expose private emails in API payloads, graph payloads, or email content.
- Keep the UI plain-language and beginner-friendly; every primary action should explain what it does and what happens next.
- Favor mobile-first chat flows over desktop-heavy control panels.
- Keep pages server-first and isolate motion or browser APIs to focused client leaves.
- Treat Supabase browser auth config as valid when the URL is set and either supported public key is present.
- Every commit that changes shipped behavior must include verification, push to the tracked remote, and confirm the resulting Vercel deployment for `https://find.phunnysunny.com/`.
- When behavior or workflow changes materially, update this brief in the same change.
