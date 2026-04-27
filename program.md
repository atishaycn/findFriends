# Friend Graph Operating Brief

## Purpose
- Build and ship a mobile-first web app where friends pass invite links through chat, grow a round-specific graph, and unlock the full connection map when a valid loop closes the round.

## Stack And Boundaries
- Frontend: Next.js App Router with TypeScript and Tailwind v4.
- Auth: Supabase magic-link email auth.
- Data: Supabase Postgres accessed from server code through `postgres`.
- Email: Resend for the completion message only.
- Auth email branding: Supabase auth email subjects/templates live in `supabase/config.toml` and `supabase/templates/`.
- Keep repo-tracked source under `src/`, SQL in `supabase/`, and helper scripts in `scripts/`.

## Important Files
- `src/app/`: pages, layouts, route handlers.
- `src/lib/`: auth, database, validation, query, email, and route helpers.
- `src/components/`: client and server UI building blocks.
- `supabase/config.toml`: local/self-hosted Supabase auth config, including branded auth email subjects.
- `supabase/schema.sql`: canonical database schema for rounds, participants, invites, and connections.
- `supabase/templates/`: Supabase auth email HTML templates.
- `scripts/apply-schema.mjs`: applies the SQL schema to `DATABASE_URL`.

## Run And Verify
- `npm run dev`: local app.
- `npm run lint`: ESLint.
- `npm run test`: Vitest unit coverage for core round logic.
- `npm run build`: production build verification.
- `npm run db:push`: apply `supabase/schema.sql` to the configured database.
- Vercel Production must define `NEXT_PUBLIC_SUPABASE_URL` plus one matching public browser key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Working Rules
- Preserve the round invariant: a round is a tree plus one valid closing edge.
- Direct returns to the inviter's parent are warnings, not loops.
- Do not expose private emails in the UI or graph payloads.
- Keep pages server-first and push interactivity into focused client components.
- Treat Supabase browser auth config as valid when the URL is set and either supported public key is present.
- Every commit that changes shipped behavior must include verification, push to the tracked remote, and confirm the resulting Vercel deployment for `https://find.phunnysunny.com/`.
- When behavior or workflow changes materially, update this brief in the same change.
