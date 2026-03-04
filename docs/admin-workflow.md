# Admin Publishing Workflow

## 1) Enable Admin Mode

Set these env vars in your dynamic deployment:

- `ENABLE_ADMIN=true`
- `ADMIN_PASSWORD=...`
- `ADMIN_SESSION_SECRET=...`

If admin is disabled, `/admin` shows a disabled notice and API endpoints return 404.

## 2) Login

1. Open `/admin/login`
2. Enter the shared password
3. You will be redirected to the publishing dashboard

## 3) Create a Post

1. Go to `/admin/posts/new`
2. Fill metadata: title, excerpt, author, category, tags, date
3. Add a cover image:
   - external URL (`https://...`) or
   - upload file (stored under `/public/uploads/YYYY/MM/`)
4. Write content in Markdown
5. Choose:
   - **Save Draft** (`published: false`)
   - **Publish Now** (`published: true`)

## 4) Edit / Publish / Unpublish / Delete

- Open `/admin/posts`
- Use search and status filters
- Quick actions per post:
  - Edit
  - Publish / Unpublish
  - Delete (with confirm)

## 5) Validation Rules

Required fields:

- title
- excerpt
- author
- category
- at least one tag
- content
- valid slug

Date must be in `YYYY-MM-DD` format.

Cover image must be either:

- an absolute path (e.g. `/uploads/2026/03/photo.webp`), or
- an `http(s)` URL.

## 6) Upload Limits

Supported types:

- JPEG
- PNG
- WebP
- SVG

Max upload size: 5MB.

## Troubleshooting

- **401 Unauthorized**: Sign in again via `/admin/login`.
- **Admin disabled**: Ensure `ENABLE_ADMIN=true` in deployment env.
- **Admin config missing**: Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- **Slug conflict**: System auto-adjusts slug with numeric suffix.
