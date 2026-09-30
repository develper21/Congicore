# 🧠 Project Memory

## Congicore – Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions or for new contributors.

---

## 📌 Project Info

| | | |
|:---:|:---:|:---:|
| 📅 **Last Updated** | 🧑 **Current Phase** | 📈 **Overall Progress** |
| **Sep 30, 2026** | **Phase 6** | ▓▓▓▓▓▓▓▓▓░ **~93%** |
| Docs & polish | Quality, Testing & Docs | MVP nearly complete |

---

## 🎯 Current Status

- ✅ Project setup completed (Next.js, TypeScript, Tailwind, App Router)
- ✅ Git repository initialized
- ✅ Authentication (signup, login, protected routes, JWT) completed
- ✅ All pages wired to API routes (21 pages ↔ 38 API routes)
- ✅ MongoDB Atlas connected; demo data seeded (documents, chats, memories, graph, subscription)
- ✅ OpenAI twin integration with graceful fallback (keyword search + extractive answers)
- ✅ AWS S3 removed end-to-end → local file storage (`public/uploads`)
- ✅ Login issue fixed (seed was pointing to the wrong database)
- ✅ React duplicate-key error in chat page fixed
- 🔄 Creating `docs/` folder with all project documentation (this file 📚)
- ⏳ Real `OPENAI_API_KEY` needed for full AI mode (currently placeholder → fallback mode)

---

## ✅ Completed Tasks

| # | Task | Completed On |
|---|---|---|
| 1.1 | Initialize Next.js project (TypeScript, App Router, webpack) | Feb 10, 2026 |
| 1.2 | Configure Tailwind CSS with signature palette | Feb 10, 2026 |
| 1.3 | Set up folder structure (src/app, components, lib, models) | Feb 10, 2026 |
| 2.1 | Auth API routes (register, login, logout, forgot/reset, verify) | Feb 10, 2026 |
| 2.2 | JWT auth helpers + AuthGuard (`token` in localStorage) | Feb 10, 2026 |
| 2.3 | Auth pages (login, register, forgot/reset, verify-email) | Feb 10, 2026 |
| 3.1 | Documents: upload, processing (PDF/DOCX/OCR), CRUD, search | Feb 10, 2026 |
| 3.2 | Chat page + RAG message endpoint + chat history | Feb 10, 2026 |
| 3.3 | Knowledge graph: generator, D3 view, edit, export/import | Feb 10, 2026 |
| 3.4 | Memories + SM-2 spaced repetition review flow | Feb 10, 2026 |
| 3.5 | Dashboard stats + analytics + recent activity | Feb 10, 2026 |
| 4.1 | OpenAI client with env-driven models | Sep 28, 2026 |
| 4.2 | Embeddings + semantic vector search | Sep 28, 2026 |
| 4.3 | RAG pipeline with citations + extractive fallback | Sep 28, 2026 |
| 4.4 | Page ↔ API wiring for all pages (AuthGuard, api.ts fixes) | Sep 28, 2026 |
| 4.5 | Env files documented (.env.example, .env.production; .env.local untouched) | Sep 28, 2026 |
| 5.1 | S3 removed end-to-end → local storage (public/uploads) | Sep 28, 2026 |
| 5.2 | Postman collection (38 requests, 9 folders) + verify script | Sep 28, 2026 |
| 6.1 | Seed script (demo@congicore.ai with realistic Atlas data) | Sep 28, 2026 |
| 6.2 | Smoke test (20/20 passing) + Atlas check script | Sep 28, 2026 |
| 6.3 | Login fixed (seed DB mismatch) — verified live on :3000 | Sep 29, 2026 |
| 6.4 | Chat duplicate-key React error fixed (unique message keys) | Sep 29, 2026 |

---

## 🔄 In Progress

| # | Task | Started On |
|---|---|---|
| 6.5 | Create docs/ folder (PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY) | Sep 30, 2026 |

---

## 🗄 Database & Environment Notes (IMPORTANT)

- **`.env.local` values must NEVER change** — MONGO_URI points to MongoDB Atlas (`congicorecluster`), JWT_SECRET, OPENAI vars.
- `OPENAI_API_KEY` in `.env.local` is still a **placeholder** → app runs in fallback mode (keyword search + extractive answers). Summarizer / auto-tag / embeddings need a real key.
- Atlas has the owner's real account (`neha@gmail.com`) — **never touch it**.
- Seed script only wipes the **demo user's** data: `demo@congicore.ai` / `Demo@1234`.
- Seeded data: 6 documents (real content), 3 chats (10 messages), 8 memories (3 due), 1 graph (21 nodes / 23 edges), Free→Pro subscriptions.
- Document file URLs are local: `/uploads/demo/...`.

## 🧪 Verification Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (user runs it on port 3000) |
| `npm run seed` / `npm run seed:keep` | Re-seed demo data (wipes / keeps demo data) |
| `npm run smoke` | 20-check smoke test |
| `npm run verify:postman` | Verify Postman covers all API routes |
| `npx tsc --noEmit` | TypeScript check |

## 🧭 Conventions to Remember

- JWT Bearer token stored in localStorage key `token`.
- Frontend API client: `src/lib/api.ts` (all fetches go through it).
- OpenAI models come from env: `OPENAI_CHAT_MODEL` (default `gpt-4o-mini`), `OPENAI_EMBEDDING_MODEL` (default `text-embedding-3-small`).
- Every AI feature must degrade gracefully without a key.
- API responses: `{ error }` on failure; route-specific JSON on success.
- Postman collection: `postman/postman.json` — auto-captures `{{token}}`, `{{documentId}}`, `{{chatId}}`, `{{memoryId}}` from responses.
