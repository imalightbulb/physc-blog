# CLAUDE.md — XMUM Physics Blog

Project instructions for Claude Code. These apply to every session.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — config is CSS-first (`app/globals.css`), uses `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`
- **better-sqlite3** — SQLite DB at `./phy-blog.db` (auto-created on first run, git-ignored)
- **react-markdown** with `remark-gfm`, `remark-math`, `rehype-highlight`, `rehype-slug`, `rehype-katex` for rendering post content
- **jose** for JWT auth
- **Next.js 16 calls middleware "proxy"** — the file is `proxy.ts` at root, exported function must be named `proxy`

## Key Files

| File | Purpose |
|------|---------|
| `lib/db.ts` | DB singleton; creates schema + seeds 3 demo posts + admin on first run |
| `lib/posts.ts` | All DB helpers: `getAllPosts`, `getPostBySlug`, `createPost`, `updatePost`, `deletePost`, `getAllTags`, `getAllCategories`, etc. |
| `lib/auth.ts` | JWT sign/verify with jose |
| `proxy.ts` | Auth guard for `/admin/*` routes |
| `components/PostContent.tsx` | Renders markdown post content — add new remark/rehype plugins here |
| `components/BlogCard.tsx` | Blog post card for grids |
| `components/TagBadge.tsx` | Clickable tag pill linking to `/tag/[name]` |
| `app/globals.css` | Tailwind v4 config, highlight.js CSS, KaTeX CSS, animation keyframes |

## Commands

```bash
npm run dev           # dev server at http://localhost:3000
npm run build         # production build (uses SQLite at build time)
npm run build:static  # static export to ./out (sets STATIC_EXPORT=true BASE_PATH=/repo-name in CI)
```

## Database

- Schema: `posts` table (id, title, slug, excerpt, content, cover_image, author, category, tags, published, views, created_at, updated_at, published_at) and `admins` table
- `tags` is stored as a JSON array string, e.g. `'["quantum mechanics","education"]'`
- `published`: 0 = draft, 1 = published
- DB is auto-created + seeded from `lib/db.ts` on first `getDb()` call
- All seed inserts use `INSERT OR IGNORE` for concurrent-build safety
- To reset: delete `phy-blog.db` and restart the dev server

## Admin

- URL: `/admin` (guarded by `proxy.ts` JWT check)
- Default credentials (dev): `admin` / `physics2024` (set via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars)
- JWT secret: `JWT_SECRET` in `.env.local`

## Static Export (GitHub Pages)

- Triggered by `STATIC_EXPORT=true` env var → sets `output: 'export'` in `next.config.ts`
- `BASE_PATH` env var sets the Next.js `basePath` (e.g. `/physc-blog` for GitHub Pages project pages)
- `NEXT_PUBLIC_BASE_PATH` is exposed to client for resolving static asset paths in markdown images
- **All API routes must have** `export const dynamic = 'force-static'`
- **All dynamic page segments must have** `generateStaticParams()` — return raw (not URL-encoded) values
- DB is queried at build time using seed data; the static `./out` folder has no server

## Conventions

- Post content is **Markdown** stored in the `posts.content` DB column — not file-based
- LaTeX: use `$...$` for inline math and `$$...$$` for display math (rendered via KaTeX)
- No code blocks in posts — the blog targets a general physics audience
- Cover images: use picsum.photos URLs for demos (`https://picsum.photos/seed/<key>/1200/600`)
- Image uploads: `POST /api/upload` → saves to `public/uploads/`, returns `/uploads/<filename>`
- Post slugs are auto-generated from title via `slugify` on create (admin panel)
- Tags are comma-separated in the admin form and stored as a JSON array in the DB
- `generateStaticParams` for tag/category pages must return **non-encoded** segment values

## Adding a New Post (Admin Panel)

See the user-facing guide at the end of this file.

## Important Constraints

- Do **not** use `encodeURIComponent` in `generateStaticParams` — pass raw values; Next.js handles encoding
- Do **not** add `@import` for Google Fonts in CSS (causes Tailwind v4 ordering warnings) — use `<link>` in `app/layout.tsx`
- Do **not** commit `phy-blog.db`, `.env*`, or `public/uploads/*` (all git-ignored)
- The `proxy.ts` export must be named `proxy` (not `middleware`) — Next.js 16 renamed it

---

## How to Add a New Blog Post

Blog content lives in the **SQLite database**, not in files. There are two ways to add posts:

### Option A — Admin panel (recommended)

1. Run `npm run dev`
2. Go to `http://localhost:3000/admin` and log in
3. Click **New Post**
4. Fill in the form:
   - **Title** — the slug is auto-generated from this
   - **Category** — single word or phrase (e.g. "Research", "Education")
   - **Tags** — comma-separated (e.g. `quantum mechanics, education`)
   - **Content** — write in Markdown; supports LaTeX with `$...$` and `$$...$$`
   - **Cover Image** — paste a URL or use the upload button
   - **Published** — toggle to make it live immediately
5. Click **Save**

### Option B — Edit the seed in `lib/db.ts`

Add a new object to the `posts` array inside `seedPostsIfEmpty()`. Use this only for permanent demo content that should always appear on a fresh install. After editing, delete `phy-blog.db` and restart dev to re-seed.

### Markdown cheat sheet for posts

```
# Heading 1
## Heading 2

**bold**, *italic*, `inline code`

- bullet list
1. numbered list

> blockquote

| Column | Column |
|--------|--------|
| cell   | cell   |

$E = mc^2$           ← inline LaTeX
$$\hat{H}\psi = E\psi$$  ← display LaTeX

![Alt text](/uploads/my-image.png)
```
