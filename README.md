# XMUM Physics Blog

A Next.js 16 blog for the Physics Department at Xiamen University Malaysia.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · SQLite (better-sqlite3) · GitHub Pages

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env.local
# Edit .env.local — set JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

# 3. Start the dev server (DB is auto-created and seeded on first run)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin).

### Build

```bash
npm run build          # production build (Node.js server)
npm run build:static   # static export → ./out  (for GitHub Pages)
```

---

## Project structure

```
app/              Next.js App Router pages and API routes
  admin/          Admin panel (server-only; excluded from static export)
  api/            REST API routes
  blog/           Public blog pages
components/       Shared React components
lib/              Server utilities (DB, auth, post helpers)
proxy.ts          Next.js 16 middleware (auth guard for /admin/*)
public/           Static assets
.continue/        Continue AI assistant config (committed)
.github/          CI/CD workflows
```

Full architecture reference: [CLAUDE.md](CLAUDE.md)
AI assistant rules: [AGENT_RULES.md](AGENT_RULES.md)

---

## Deployment

The blog deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. The workflow runs `npm run build:static` and publishes the `./out` directory.

> **Note:** The admin panel is excluded from the static export. Use `npm run dev` locally to manage posts.

---

## AI Assistant Setup

This repo is configured for [Continue](https://continue.dev) — a VS Code extension that lets you switch between Claude and GPT-4o in a single chat panel.

### 1. Install the extension

In VS Code: open the Extensions panel (`Ctrl+Shift+X`), search for **Continue**, install **Continue.continue**.

Alternatively from the command line:
```bash
code --install-extension Continue.continue
```

VS Code will also prompt you automatically because `Continue.continue` is listed in `.vscode/extensions.json`.

### 2. Set your API keys

Continue reads API keys from your **shell environment**. Add these to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # get from console.anthropic.com
export OPENAI_API_KEY="sk-..."          # get from platform.openai.com
```

Then restart your terminal (or `source ~/.zshrc`) and reopen VS Code so the integrated terminal inherits the variables.

> The keys are **never committed** — `.env.local` and `.env.*.local` are gitignored. The `.env.example` file contains placeholder descriptions only.

### 3. Workspace config

The repo ships with `.continue/config.yaml` which is auto-loaded when you open this folder in VS Code. It configures:

| Model | Provider | Best for |
|-------|----------|----------|
| **Claude Sonnet 4.6** | Anthropic | Chat · Planning · Code review · Architecture |
| **GPT-4o** | OpenAI | Inline edits · Implementation · Generate-and-apply |

Project-specific rules are in `.continue/rules/project-rules.md` and are loaded automatically by Continue.

### 4. Selecting a model

In the Continue panel (open with **Ctrl+L**), click the model name shown in the bottom-left corner of the chat panel. A dropdown appears with both models. Select the one you want for the current task.

### 5. Recommended workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Plan        Ctrl+L → type /plan → describe the task         │
│                 (use Claude — best at architecture reasoning)    │
│                                                                  │
│  2. Implement   Ctrl+I on selected code / files                  │
│                 (switch to GPT-4o — faster edits)                │
│                                                                  │
│  3. Review      Ctrl+L → type /review → select changed files    │
│                 (use Claude — catches security & logic issues)   │
│                                                                  │
│  4. Build       npm run build  (fix any TS errors)               │
│                                                                  │
│  5. Push        git push  (CI deploys to GitHub Pages)           │
└─────────────────────────────────────────────────────────────────┘
```

Custom slash commands available: `/plan`, `/review`, `/explain`
Context you can `@`-mention: `@codebase`, `@diff`, `@terminal`, `@problems`, `@file`, `@folder`

---

## Adding a blog post

Posts are stored in SQLite, not files. Two ways to add them:

**Via the admin panel (recommended):**
1. Run `npm run dev`
2. Go to [http://localhost:3000/admin](http://localhost:3000/admin) and log in
3. Click **New Post** and write in Markdown

**Markdown features supported in posts:**
- `$...$` inline LaTeX and `$$...$$` display math (rendered by KaTeX)
- Tables, blockquotes, images, bold, italic
- `![caption](/uploads/file.png)` for uploaded images

See [CLAUDE.md — How to Add a New Blog Post](CLAUDE.md) for the full guide.
