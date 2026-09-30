# 📄 Development Rules

## Congicore – Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards, and best practices for the Congicore application. These rules ensure consistency, maintainability, security, and quality across the project. Both AI assistants and human contributors must follow these guidelines.

---

## 1. General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before making changes.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.
- ✅ **Never modify `.env.local` values** — they are the single source of truth for local secrets (Mongo URI, JWT secret, OpenAI key).
- ✅ Never commit `.env.local` or any secrets to Git.
- ✅ Never hardcode credentials, user emails, or connection strings in code.
- ✅ Verify every change: run `npx tsc --noEmit` and the relevant smoke tests before considering work done.
- ✅ The seed script must only wipe the **demo user's** data — never touch real users (e.g. the owner's account).

## 2. Technology & Coding Standards

Rules related to the tech stack and coding style.

| | Area | Rule |
|---|---|---|
| 📘 | **Language** | Use TypeScript. Avoid `any` unless absolutely necessary. |
| 🏗 | **Framework** | Follow Next.js best practices (App Router). |
| 🎨 | **Styling** | Use Tailwind CSS and follow the design system in [DESIGN.md](DESIGN.md). |
| 🔍 | **Linting** | Follow ESLint (eslint-config-next) rules. |
| ✨ | **Formatting** | Consistent formatting; 2-space indent, double quotes as per existing code style. |
| 📦 | **Dependencies** | Use stable, well-maintained packages only. Ask before adding a new dependency. |
| 📄 | **File Naming** | Use kebab-case for all files and folders (`vector-search.ts`, `recent-activity.tsx`). Components end in `.tsx`; page files stay `page.tsx` / `route.ts`. |
| 🔐 | **Auth** | All protected API routes must validate the JWT Bearer token via `src/lib/auth.ts` helpers. |
| 🧠 | **AI calls** | All OpenAI calls must use the models from `src/lib/openai.ts` (env-driven) and must have a graceful fallback path. |
| 🌿 | **API responses** | Consistent JSON shape: success → `{ data }` or route-specific object; error → `{ error: "message" }` with proper status codes. |
| 🗃 | **Database** | All schema changes go through Mongoose models in `src/models/`. Never run raw ad-hoc writes in route handlers. |

## 3. Project Structure

Follow the defined folder structure in [ARCHITECTURE.md](ARCHITECTURE.md) to keep the project organized.

- ✅ Reusable UI components live in `/components` (ui, layout, dashboard, auth, notifications).
- ✅ Feature-specific code stays close to its page under `src/app/<feature>/`.
- ✅ Database and external service logic sits in `/lib` (mongodb, openai, storage, rag…).
- ✅ Common utilities should be in `/lib` and reused, not copy-pasted.
- ✅ Types and interfaces should be placed in `/types` or co-located with their feature.
- ✅ Do not create new folders without a clear structural reason.
- ✅ New API routes must be added to `postman/postman.json` and pass `npm run verify:postman`.

## 4. Git & Delivery Rules

- ✅ Do not commit or push unless explicitly asked.
- ✅ Small, descriptive commits (when requested) — one concern per commit.
- ✅ Run the smoke test (`bash scripts/smoke-test.sh`) after backend changes.
- ✅ Keep `.env.example` and `.env.production` documented whenever a new env var is introduced.

## 5. AI Assistant Workflow

When an AI assistant works on this repo, it must:

1. Read [MEMORY.md](MEMORY.md) first for current project state.
2. Read [TASKS.md](TASKS.md) to understand what is being built.
3. Make changes following the rules in this document.
4. Update [MEMORY.md](MEMORY.md) and [TASKS.md](TASKS.md) after completing work.
