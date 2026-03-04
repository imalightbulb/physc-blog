# AGENT_RULES.md — XMUM Physics Blog

Project rules for AI coding assistants (Continue, Claude Code, Cursor, etc.).
See also: [CLAUDE.md](CLAUDE.md) for the full project reference.

---

## 1. Stack & key files

| Concern | File(s) |
|---------|---------|
| DB schema + seed | `lib/db.ts` |
| Post CRUD queries | `lib/posts.ts` |
| JWT auth helpers | `lib/auth.ts` |
| Route guard (middleware) | `proxy.ts` |
| Post content renderer | `components/PostContent.tsx` |
| Global CSS + animations | `app/globals.css` |
| Next.js config | `next.config.ts` |
| GitHub Actions deploy | `.github/workflows/deploy.yml` |

## 2. Coding conventions

### TypeScript
- Strict mode is on — no implicit `any`, no unchecked casts
- Use `type` for shape aliases, `interface` for extendable object shapes
- All function parameters and return types must be explicitly typed (except trivially-inferred locals)

### React / Next.js
- Server Components by default; add `'use client'` only for state, effects, or browser APIs
- Never import `better-sqlite3` or other server-only packages in client components
- `generateStaticParams` must return **raw, non-URL-encoded** values
- All API routes in `app/api/` need `export const dynamic = 'force-static'` for static-export compatibility

### SQL
- **Never** concatenate user input into SQL strings
- Use `better-sqlite3` parameterised queries (`?` or `@name` placeholders) exclusively

### Style
- Tailwind classes only — no inline `style={{}}` except for dynamic values that Tailwind can't express
- No `console.log` in committed code; `console.error` is OK for caught exceptions

### Markdown / LaTeX in posts
- Content is stored as Markdown in the `posts.content` DB column
- Inline math: `$E = mc^2$`
- Display math: `$$\hat{H}\psi = E\psi$$`
- No fenced code blocks in blog posts (they can't run; use pre-computed visuals instead)

## 3. Do NOT touch

| Path | Reason |
|------|--------|
| `phy-blog.db` | Runtime artefact; gitignored |
| `public/uploads/*` | User uploads; gitignored |
| `.env.local` | Secrets; gitignored |
| `.claude/settings.local.json` | Machine-local Claude Code config; gitignored |
| `node_modules/` | Package directory |

## 4. Running the project

```bash
# Development (hot reload, full server + DB)
npm run dev

# Type check (no emit — use before any push)
npx tsc --noEmit

# Production build
npm run build

# Static export for GitHub Pages (outputs ./out/)
npm run build:static
# Requires: STATIC_EXPORT=true   BASE_PATH=/physc-blog   (set by CI)
```

No automated test suite currently. Manual verification: `npx tsc --noEmit` + `npm run build`.

## 5. PR / commit expectations

- **One logical change per commit** (don't mix formatting and logic changes)
- **Imperative subject line**, ≤72 chars (e.g. `fix: exclude admin from static export`)
- No `Co-Authored-By: Claude` trailers (configured in `.claude/settings.local.json`)
- Run `npx tsc --noEmit` before pushing
- Do **not** force-push to `main` without confirming with the human

## 6. Admin panel specifics

- URL: `http://localhost:3000/admin` (dev only)
- Auth: `proxy.ts` redirects unauthenticated requests to `/admin/login`
- Secondary guard: `app/admin/layout.tsx` verifies the JWT cookie server-side
- **Excluded from static export**: the layout calls `notFound()` when `STATIC_EXPORT=true`
- Default credentials (dev): `admin` / `physics2024` (override via `.env.local`)

## 7. Recommended AI workflow

```
1. Plan   →  /plan  or ask Claude to outline the approach before any code
2. Implement  →  switch to GPT-4o for inline edits / code generation
3. Review     →  /review  or ask Claude to check the diff for issues
4. Build      →  npm run build  (catch type errors before pushing)
5. Push       →  git push (CI runs the static build + GitHub Pages deploy)
```
