# Postman Collection — AI Knowledge Twin (Congicore)

Complete Postman collection for testing **every API route** in this project (38 requests across 9 folders).

## Import

1. Open Postman → **Import** → **File** → select `postman/postman.json`
2. The collection comes pre-configured with:
   - Collection-level Bearer auth (`{{token}}` variable)
   - `baseUrl` variable (default `http://localhost:3000`)
   - Auto-capture test scripts for `token`, `documentId`, `chatId`, `memoryId`

## Quick Start

```bash
# 1. Seed the demo account (if not done already)
npx tsx scripts/seed.ts --uri "mongodb://127.0.0.1:27017/ai-knowledge-twin"

# 2. Start the dev server
npm run dev

# 3. Verify collection coverage anytime
npx tsx scripts/verify-postman.ts
```

Then in Postman:

1. Set `baseUrl` if your server runs on another port.
2. Run **Auth → Login (seeds token)** — the JWT is saved automatically to `{{token}}`.
3. Run **Documents → List Documents**, **Chat → List Chats**, **Memories → List Memories** to auto-capture the `{{documentId}}`, `{{chatId}}`, `{{memoryId}}` variables.
4. Or just hit **Run** in the Collection Runner — the folder order executes top-to-bottom cleanly.

## Demo Account

| Field | Value |
|---|---|
| Email | `demo@congicore.ai` |
| Password | `Demo@1234` |

## Folders

| Folder | Routes | Notes |
|---|---|---|
| **Auth** | register, login, forgot/reset password, verify email, logout | Login auto-saves the JWT |
| **Dashboard & Analytics** | `/api/dashboard/stats`, `/api/analytics`, `/api/search` | Stats include `recentActivities` |
| **Documents** | CRUD, search, summarize (AI), autotag (AI), embed (AI), upload (multipart), export/import | `documentId` auto-captured |
| **Chat (RAG Twin)** | CRUD + `POST /api/chat/message` | Full RAG pipeline; needs `OPENAI_API_KEY` for AI answers |
| **Memories & Spaced Repetition** | CRUD, SM-2 review, export/import | `quality` 0–5 in review |
| **Knowledge Graph** | GET/PUT graph, export/import | PUT replaces the whole graph |
| **Profile & Settings** | profile, settings, settings/profile, notifications | Settings use `notification` (singular) |
| **Billing** | overview, subscription, checkout, verify, cancel, change plan | Simulated Stripe flow |
| **Voice** | `POST /api/voice/transcribe` | multipart `audio` field |

## OpenAI-Powered Requests

These require a real `OPENAI_API_KEY` in `.env.local` (currently a placeholder):

- `POST /api/chat/message` — RAG twin answers (falls back to keyword search without a key)
- `POST /api/documents/{id}/summarize` — AI summary
- `POST /api/documents/{id}/autotag` — AI tags
- `POST /api/documents/embed` — vector embeddings for semantic search

## Coverage Verification

```bash
npx tsx scripts/verify-postman.ts
```

Compares `src/app/api/**/route.ts` against the collection and fails if any route is missing. The dynamic params (`[id]` → `{{id}}`) are matched positionally.

## Variables Reference

| Variable | Set by | Used in |
|---|---|---|
| `baseUrl` | You (default `http://localhost:3000`) | Every request |
| `token` | Login/Register test script | Collection Bearer auth |
| `documentId` | List/Create/Upload documents | Document detail + AI actions |
| `chatId` | List/Create chats | Chat detail + send message |
| `memoryId` | List/Create memories | Memory detail + SM-2 review |
| `query` | You (default `attention`) | Search endpoints |
