# XMUM Physics Blog Audit Report

## Summary
This implementation focused on high-impact Tier 1 improvements: SEO metadata baseline, crawlability files, keyboard accessibility, typography loading optimization, and post heading semantics.

## Key Issues Found
- Missing canonical/OG/Twitter metadata and no site URL configuration.
- No `robots.txt`/`sitemap.xml` generation.
- Duplicate `<h1>` on blog post pages.
- Navbar controls missing accessibility attributes and skip-link navigation.
- External Google Fonts `<link>` usage instead of optimized `next/font`.

## Prioritized Plan
### Tier 1 (implemented now)
1. Metadata foundation with canonical + OG/Twitter defaults.
2. Add `robots.ts` and `sitemap.ts`.
3. Ensure one `<h1>` per post page.
4. Improve navbar and keyboard accessibility.
5. Migrate to `next/font/google`.

### Tier 2 (next)
1. Slugify category/tag URLs with compatibility redirects.
2. Move markdown rendering off client where feasible.
3. Add post JSON-LD `BlogPosting`.
4. Extend branded 404 content/state handling.

### Tier 3 (later)
1. Events/announcements content model + pages.
2. Shared site shell layout refactor.
3. Search and archive UX enhancements.

## What Was Changed
- Added site metadata helpers in `lib/site.ts` for env-based canonical URL generation.
- Upgraded root metadata in `app/layout.tsx` with:
  - `metadataBase`
  - canonical root alternate
  - OpenGraph and Twitter defaults
- Migrated typography loading from manual Google Fonts links to `next/font/google`.
- Added keyboard skip link and global focus-visible outline styles.
- Improved navbar accessibility:
  - search field labels
  - button `aria-label`
  - mobile menu `aria-expanded` + `aria-controls`
- Added route-level canonical metadata:
  - home/blog/search/category/tag/post pages
- Added `app/robots.ts` and `app/sitemap.ts` (static-export compatible).
- Fixed duplicate `<h1>` by demoting markdown `h1` to `h2` in post content renderer.
- Added branded custom 404 page in `app/not-found.tsx`.
- Added `NEXT_PUBLIC_SITE_URL` guidance to `.env.example`.

## Verification Performed
- `npm run build` ✅
- `npm run build:static` ✅
- Verified post page has exactly one `<h1>` in generated HTML ✅
- Verified canonical tag is emitted in generated HTML ✅
- Verified `out/robots.txt` and `out/sitemap.xml` are generated ✅

## Commands Run (Implementation Phase)
- `ls -la && ls -la docs 2>/dev/null || true`
- `git status --short`
- `npm run build` (initial parallel run hit lock)
- `npm run build:static` (initial run surfaced static export metadata-route config issue)
- `npm run build` (rerun, pass)
- `npm run build:static` (rerun, pass)
- `node -e "...h1/canonical checks..."`
- `sed -n '1,140p' out/robots.txt`
- `sed -n '1,220p' out/sitemap.xml`

## Files Modified
- `.env.example`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/search/page.tsx`
- `app/category/[name]/page.tsx`
- `app/tag/[name]/page.tsx`
- `components/Navbar.tsx`
- `components/PostContent.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/not-found.tsx`
- `lib/site.ts`

## Next Steps
1. Set `NEXT_PUBLIC_SITE_URL` in production to your real domain before deployment.
2. Implement Tier 2 URL slugification with compatibility redirects.
3. Add JSON-LD (`BlogPosting`) on post pages.
