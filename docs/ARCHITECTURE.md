# 🏛 System Architecture

## Congicore – AI Knowledge Twin Platform

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the **Congicore** application.

---

## 1. High-Level Architecture

Congicore follows a full-stack architecture using **Next.js** and **MongoDB Atlas**.

```
┌──────────────┐      HTTPS      ┌─────────────────┐        ┌──────────────────────┐        ┌──────────────┐
│     User     │ ◄─────────────► │ Next.js Frontend│ ◄────► │  Next.js Backend     │ ◄────► │   MongoDB    │
│ (Web Browser)│    JSON / JWT   │   (UI / Client) │        │ (API Route Handlers) │ Mongoose│    Atlas     │
└──────────────┘                 └─────────────────┘        └──────────┬───────────┘        └──────────────┘
                                                                       │
                                                                       ▼
                                                            ┌──────────────────────┐
                                                            │    OpenAI API        │
                                                            │ (Chat · Embeddings)  │
                                                            └──────────────────────┘
```

- **Frontend** renders all pages (Dashboard, Documents, Chat, Graph, Memories…) and stores the JWT in `localStorage` (`token` key).
- **Backend** = Next.js App Router API route handlers under `/api/*` — authentication, CRUD, RAG orchestration, file processing.
- **Database** = MongoDB Atlas via Mongoose models (`User`, `Document`, `Chat`, `Memory`, `Graph`, `Subscription`).
- **OpenAI** = optional AI layer (gpt-4o-mini chat + text-embedding-3-small). If no key is configured, the app **gracefully falls back** to keyword search + extractive answers.

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router) | UI framework |
| Language | TypeScript | Type-safe and better developer experience |
| Styling | Tailwind CSS + Radix UI + Lucide | Modern, responsive UI & components |
| State / Data | Zustand + TanStack Query | Client state & data fetching |
| Visualization | D3.js + Recharts | Knowledge graph & analytics charts |
| Backend | Next.js API Route Handlers | Backend logic and API endpoints |
| Database | MongoDB Atlas + Mongoose 8 | Data and real-time capabilities |
| Authentication | JWT (jsonwebtoken + bcryptjs) | User authentication and authorization |
| AI | OpenAI SDK (gpt-4o-mini, text-embedding-3-small) | Chat answers, embeddings, summarize, auto-tag |
| Document Processing | pdf-parse, mammoth, tesseract.js (OCR) | Extract text from PDF / DOCX / images |
| File Storage | Local filesystem (`public/uploads`) | User uploads (S3 removed) |
| Dev Tools | ESLint, PostCSS, tsx scripts | Linting, build, seed & test scripts |
| Version Control | Git + GitHub | Source code management |

## 3. Folder Structure

The project follows an **App Router–based folder structure** to keep the code organized and scalable.

```text
congicore/
├── docs/                      # 📚 Project documentation (you are here)
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── DESIGN.md
│   ├── TASKS.md
│   └── MEMORY.md
├── postman/                   # 🧪 Postman collection (38 API requests)
│   ├── postman.json
│   └── README.md
├── scripts/                   # 🔧 Automation scripts
│   ├── seed.ts                # Seed demo data (Atlas)
│   ├── smoke-test.sh          # 20-check smoke test
│   ├── verify-postman.ts      # Route coverage checker
│   └── check-atlas.ts         # Atlas connectivity diagnostic
├── public/                    # Static assets + local uploads (/uploads)
├── src/
│   ├── app/                   # Next.js app router (pages, layout)
│   │   ├── (pages)/           # dashboard, chat, documents, graph,
│   │   │                      # memories, review, voice, upload,
│   │   │                      # profile, settings, billing, support
│   │   ├── auth/              # login, register, forgot/reset password,
│   │   │                      # verify-email
│   │   └── api/               # 38 API route handlers
│   │       ├── auth/          # register, login, logout, forgot/reset, verify
│   │       ├── documents/     # CRUD + search + summarize + autotag + embed
│   │       ├── chat/          # CRUD + RAG message endpoint
│   │       ├── memories/      # CRUD + SM-2 review
│   │       ├── graph/         # knowledge graph GET/PUT
│   │       ├── billing/       # overview, subscription, checkout, verify
│   │       └── ...            # dashboard/stats, analytics, search, voice,
│   │                          # export/*, import/*, profile, settings
│   ├── components/            # Reusable UI components (ui, layout, dashboard,
│   │                          # auth, notifications)
│   ├── lib/                   # Core business logic
│   │   ├── openai.ts          # OpenAI client (env-driven models)
│   │   ├── rag.ts             # RAG pipeline + extractive fallback
│   │   ├── vector-search.ts   # Semantic search + keyword fallback
│   │   ├── embeddings.ts      # Embedding generation
│   │   ├── document-processor.ts
│   │   ├── spaced-repetition.ts  # SM-2 algorithm
│   │   ├── graph-generator.ts
│   │   ├── auth.ts            # JWT helpers
│   │   ├── storage.ts         # Local file storage (public/uploads)
│   │   └── api.ts             # Frontend API client
│   ├── models/                # Mongoose schemas (User, Document, Chat,
│   │                          # Memory, Graph, Subscription)
│   └── types/                 # Shared TypeScript types
└── .env.local                 # Environment variables (never commit)
```

## 4. Data Flow (RAG Chat Example)

1. User sends a message on `/chat` → `POST /api/chat/message` (Bearer JWT).
2. Backend embeds the question (OpenAI `text-embedding-3-small`) and runs **semantic search** over document chunk embeddings in MongoDB.
3. If OpenAI is unavailable → automatic **keyword search fallback** (term-split regex + relevance scoring).
4. Top chunks are passed to `gpt-4o-mini` with a grounding prompt → answer + source citations.
5. If the model call fails → **extractive fallback** answers directly from retrieved document snippets, still citing sources.
6. Message is persisted on the `Chat` document; dashboard/analytics reflect the new activity.

## 5. Key Design Decisions

- **JWT in localStorage + Bearer header** — simple stateless auth for the MVP; protected pages use a client `AuthGuard`.
- **Graceful AI degradation** — every OpenAI-dependent feature has a non-AI fallback so the app is fully usable without a key.
- **Local file storage** — uploads go to `public/uploads`; S3 was removed end-to-end to keep infra simple.
- **Single seed script** — `npm run seed` (or `seed:keep`) provisions a demo account with realistic data; it only wipes the demo user's data, never other users'.
- **Env-driven models** — `OPENAI_CHAT_MODEL` / `OPENAI_EMBEDDING_MODEL` env vars with sensible defaults.
