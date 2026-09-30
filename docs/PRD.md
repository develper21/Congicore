# 📋 Product Requirements Document (PRD)

## Congicore – AI Knowledge Twin Platform

| | |
|---|---|
| **Version:** | 1.0 |
| **Date:** | September 30, 2026 |
| **Author:** | Team Congicore |
| **Status:** | Active Development |
| **Target Launch:** | MVP (v1.0) |

---

## 1. Product Overview

Congicore is a web application designed to create a **digital twin of your personal knowledge base**. Users upload documents (PDF, DOCX, TXT), and the platform transforms them into an intelligent, searchable, conversational knowledge system. Users can chat with their own knowledge using AI (RAG), visualize concepts in an interactive knowledge graph, and retain information long-term through a spaced-repetition memory system.

## 2. Problem Statement

Knowledge workers, students, and researchers collect large amounts of information — PDFs, notes, articles — but the knowledge stays scattered and passive. Finding an answer means re-reading files manually, and most of what is read is forgotten within days. There is no single place where your documents become **queryable, connected, and memorable**.

Congicore solves this with three pillars:

1. **Conversational Knowledge (RAG Chat)** — ask questions, get answers grounded in *your* documents with citations.
2. **Knowledge Graph** — see how concepts across your documents connect to each other.
3. **Memory & Spaced Repetition (SM-2)** — the system resurfaces knowledge at the right time so it sticks.

## 3. Goals

- Provide a simple, clean platform where users can upload and manage documents effortlessly.
- Enable natural-language Q&A over the user's own knowledge base with AI.
- Visualize knowledge as an interactive, explorable graph.
- Improve long-term retention with a science-backed (SM-2) review system.
- Offer a modern, distraction-free user experience with fast global search.
- Provide usage insights through an analytics dashboard.
- Keep AI costs flexible: works with OpenAI, and degrades gracefully (keyword search + extractive answers) without a key.

## 4. Target Users

- Students (B.Tech, BCA, BSc and similar) preparing notes and exam material.
- Researchers and educators managing papers, references, and course material.
- Knowledge workers and lifelong learners who read a lot and want to remember it.
- Anyone who wants a **personal AI that only answers from their own trusted documents**.

## 5. Core Features (MVP)

1. **User Authentication** (Signup / Login / protected routes, JWT-based)
2. **Dashboard** (knowledge stats, recent activity, retention metrics)
3. **Documents** (upload, list, view, delete, search, AI summarize, auto-tagging, embeddings)
4. **AI Chat — Knowledge Twin** (RAG conversations grounded in uploaded documents, chat history)
5. **Knowledge Graph** (auto-generated concept graph, D3 visualization, editable, export/import)
6. **Memories & Spaced Repetition** (SM-2 scheduling, due reviews, retention tracking, export/import)
7. **Global Search** (semantic + keyword search across documents, chats, memories)
8. **Voice** (speech-to-text input for chat and memory capture)
9. **Analytics** (documents, chats, graph and memory usage insights)
10. **Profile & Settings** (profile management, app preferences, notification settings)
11. **Billing** (Free / Pro plans, checkout flow, subscription overview)
12. **Export / Import** (documents, memories, and graph data portability)

## 6. Non-Goals (v1)

- Real-time multi-user collaboration.
- Mobile native apps (web is fully responsive instead).
- Fine-tuning custom AI models per user.

## 7. Success Metrics

- A new user can upload a document and ask a question about it within **2 minutes**.
- ≥ 80% of chat answers cite the user's own documents.
- Users complete weekly SM-2 reviews (retention rate tracked on dashboard).
- Zero data-loss on document upload/delete cycles.
