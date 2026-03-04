# XMUM Physics Blog — AI Assistant Rules

These rules apply to every AI assistant session in this repository.
For the full project reference see [CLAUDE.md](../../CLAUDE.md) and [AGENT_RULES.md](../../AGENT_RULES.md).

## Stack (quick reference)

- **Next.js 16** App Router, TypeScript strict mode, Tailwind CSS v4
- **better-sqlite3** — SQLite at `./phy-blog.db` (server-only, never import in client components)
- **react-markdown** with `remark-math` + `rehype-katex` (LaTeX), `rehype-highlight` (syntax), `rehype-slug`
- **jose** for JWT; **bcryptjs** for password hashing
- **proxy.ts** at root — Next.js 16's renamed middleware (function must be named `proxy`)

## Coding conventions

- TypeScript: no `any`, no `as unknown as X` chains, no implicit `any` params
- Prefer `const` and early returns over deeply nested `if/else`
- Server Components by default; add `'use client'` only when state/effects are needed
- API routes: always return typed `NextResponse.json(...)` with explicit status codes
- SQL: never concatenate user input — always use parameterised queries (better-sqlite3 `?` placeholders)
- No `console.log` left in committed code; use `console.error` for caught exceptions only
- No inline styles; use Tailwind classes

## Directories / files — do NOT touch

- `phy-blog.db` — auto-generated at runtime; gitignored; never commit
- `public/uploads/` — user-uploaded files; gitignored (except `.gitkeep`)
- `.env.local` — secrets; gitignored; never read or commit
- `.claude/settings.local.json` — gitignored machine config
- `node_modules/` — obviously

## Running the project

```bash
npm run dev          # dev server → http://localhost:3000
npm run build        # production build (uses live SQLite)
npm run build:static # STATIC_EXPORT=true — outputs ./out for GitHub Pages
```

There are no automated tests currently. Before suggesting changes, check TypeScript:

```bash
npx tsc --noEmit
```

## Database

- Schema lives in `lib/db.ts` — do not add migrations; modify `initializeDb()` directly (drop & re-seed in dev)
- Tags: stored as a JSON array string in the `tags` column — always use `JSON.stringify([...])` to write, `JSON.parse(...)` to read
- To reset: `rm phy-blog.db` then restart dev server

## Admin panel

- Protected by `proxy.ts` (primary) + `app/admin/layout.tsx` server-side auth check (secondary)
- Excluded from static export entirely (`STATIC_EXPORT=true` → `notFound()` in layout)
- Login: `admin` / `physics2024` (dev default, set via `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env.local`)

## Static export (GitHub Pages)

- Set `STATIC_EXPORT=true` + `BASE_PATH=/repo-name` (handled by GitHub Actions workflow)
- All API routes must have `export const dynamic = 'force-static'`
- `generateStaticParams` must return **raw, non-encoded** segment values
- No admin pages, no API mutations — static hosting only

## Commit / PR expectations

- Single-concern commits: one logical change per commit
- Commit messages: imperative tense, ≤72 chars subject line, no emoji
- No `Co-Authored-By: Claude` (set in `.claude/settings.local.json`)
- Do not force-push to `main` without confirming with the user
- Run `npx tsc --noEmit` and `npm run build` before pushing
