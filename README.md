# XMUM Physics Blog

XMUM Physics Student Council blog built with Next.js App Router and Markdown content files.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Static Export (GitHub Pages)

```bash
npm run build:static
```

## Publishing via Admin

This repository includes an in-app admin publishing panel.

- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Manage posts: `/admin/posts`

Required environment variables:

- `ENABLE_ADMIN=true`
- `ADMIN_PASSWORD=<shared-password>`
- `ADMIN_SESSION_SECRET=<long-random-secret>`

When `ENABLE_ADMIN` is not `true`, admin pages/API are disabled and the public blog still works.

For complete editor instructions, see [`docs/admin-workflow.md`](docs/admin-workflow.md).
