/**
 * ============================================================
 * AI KNOWLEDGE TWIN — END-TO-END DATABASE SEEDER
 * ============================================================
 * Creates a demo user with fully linked, realistic data:
 *   - User (settings + Pro subscription)
 *   - Subscription record (invoice-style history)
 *   - Documents (processed, tagged, real content, optional embeddings)
 *   - Chats (multi-turn conversations incl. RAG answers)
 *   - Memories (SM-2 spaced-repetition state, review history)
 *   - Knowledge Graph (nodes + edges derived from documents)
 *
 * Usage:
 *   npx tsx scripts/seed.ts                 # fresh seed (wipes demo user data)
 *   npx tsx scripts/seed.ts --keep          # add data without wiping
 *   npx tsx scripts/seed.ts --uri mongodb://127.0.0.1:27017/ai-knowledge-twin
 *                                           # run against a specific DB (e.g.
 *                                           # local Mongo when Atlas DNS is
 *                                           # unreachable). NEVER modifies .env.local
 *
 * Credentials are read from .env.local — do NOT hardcode secrets here.
 * ============================================================
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

// ---- Load .env.local manually (no tsconfig-paths / dotenv dependency) ----
function loadEnvFile(file: string) {
  const p = path.resolve(process.cwd(), file);
  if (!fs.existsSync(p)) return;
  const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

// CLI override ONLY for this run (does NOT modify .env.local):
//   npm run seed -- --uri mongodb://127.0.0.1:27017/your-db
const uriArgIdx = process.argv.indexOf("--uri");
if (uriArgIdx !== -1 && process.argv[uriArgIdx + 1]) {
  process.env.MONGO_URI = process.argv[uriArgIdx + 1];
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing. Add it to .env.local first.");
  process.exit(1);
}

// ---- Constants ----
const DEMO_EMAIL = "demo@congicore.ai";
const DEMO_PASSWORD = "Demo@1234";
const KEEP = process.argv.includes("--keep");

// ---- Inline schemas (mirror src/models/index.ts, no @ alias needed) ----
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  settings: {
    notification: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      weekly: { type: Boolean, default: true },
      aiInsights: { type: Boolean, default: true },
    },
    privacy: {
      dataCollection: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
      personalization: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false },
    },
    ai: {
      model: { type: String, default: "GPT-4" },
      responseStyle: { type: String, default: "Balanced" },
      language: { type: String, default: "English" },
      learningPace: { type: String, default: "Moderate" },
      difficultyLevel: { type: String, default: "Intermediate" },
      adaptiveLearning: { type: Boolean, default: false },
    },
    appearance: {
      isDarkMode: { type: Boolean, default: false },
      accentColor: { type: String, default: "blue" },
      fontSize: { type: String, default: "Medium" },
      compactMode: { type: Boolean, default: false },
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled"],
      default: "active",
    },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 10737418240 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  status: {
    type: String,
    enum: ["processing", "processed", "failed"],
    default: "processing",
  },
  tags: [{ type: String }],
  content: { type: String, default: "" },
  embedding: { type: [Number] },
  uploadedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MemorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  importance: { type: Number, default: 5, min: 1, max: 10 },
  tags: [{ type: String }],
  relatedDocuments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  ],
  retentionRate: { type: Number, default: 0 },
  lastReviewed: { type: Date },
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 },
  repetitions: { type: Number, default: 0 },
  nextReview: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  starred: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const GraphSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nodes: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, required: true },
      category: { type: String },
      importance: { type: Number, default: 5 },
    },
  ],
  edges: [
    {
      id: { type: String, required: true },
      source: { type: String, required: true },
      target: { type: String, required: true },
      relationship: { type: String, required: true },
      strength: { type: Number, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "cancelled", "past_due"],
    default: "active",
  },
  cycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  amount: { type: Number },
  currency: { type: String, default: "USD" },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Document =
  mongoose.models.Document || mongoose.model("Document", DocumentSchema);
const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
const Memory = mongoose.models.Memory || mongoose.model("Memory", MemorySchema);
const Graph = mongoose.models.Graph || mongoose.model("Graph", GraphSchema);
const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);

const daysAgo = (n: number, hoursOffset = 0) =>
  new Date(Date.now() - n * 86400000 + hoursOffset * 3600000);

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI!);
  console.log("✅ Connected");

  // ---- Find or create demo user ----
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (user && KEEP) {
    console.log(`👤 Demo user exists (${DEMO_EMAIL}) — adding data (--keep)`);
  } else if (user) {
    console.log(`🧹 Wiping existing data for ${DEMO_EMAIL}...`);
    const userId = user._id;
    await Promise.all([
      Document.deleteMany({ userId }),
      Chat.deleteMany({ userId }),
      Memory.deleteMany({ userId }),
      Graph.deleteMany({ userId }),
      Subscription.deleteMany({ userId }),
    ]);
  } else {
    const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);
    user = await User.create({
      firstName: "Demo",
      lastName: "Twin",
      email: DEMO_EMAIL,
      password: hashed,
      bio: "AI researcher & lifelong learner exploring transformer architectures, neural knowledge graphs and spaced repetition. Building my second brain with Congicore.",
      settings: {
        notification: { email: true, push: true, weekly: true, aiInsights: true },
        privacy: {
          dataCollection: true,
          analytics: false,
          personalization: true,
          publicProfile: false,
        },
        ai: {
          model: "GPT-4o (Recommended)",
          responseStyle: "Balanced",
          language: "English",
          learningPace: "Moderate",
          difficultyLevel: "Intermediate",
          adaptiveLearning: true,
        },
        appearance: {
          isDarkMode: true,
          accentColor: "blue",
          fontSize: "Medium",
          compactMode: false,
        },
      },
      subscription: {
        plan: "pro",
        status: "active",
        storageUsed: 0,
        storageLimit: 10737418240,
      },
      createdAt: daysAgo(120),
    });
    console.log("👤 Created demo user");
  }

  const userId = user!._id;
  const existingDocs = await Document.countDocuments({ userId });

  // ============================================================
  // 1. DOCUMENTS — realistic knowledge-base content
  // ============================================================
  if (existingDocs === 0) {
    console.log("📄 Seeding documents...");
    const docs = [
      {
        title: "Attention Is All You Need — Transformer Architecture.pdf",
        type: "application/pdf",
        size: 2420000,
        tags: ["Deep Learning", "Transformers", "NLP", "Attention"],
        uploadedAt: daysAgo(45),
        content: `The Transformer architecture, introduced by Vaswani et al. (2017), dispenses with recurrence entirely and relies solely on attention mechanisms to draw global dependencies between input and output.

Self-Attention: For each token, three vectors are computed — Query (Q), Key (K), and Value (V). Attention weights are the scaled dot products: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V. The scaling factor sqrt(d_k) prevents overly peaked softmax gradients for large dimensions.

Multi-Head Attention: Instead of one attention operation, h parallel heads each learn different representation subspaces. Heads attend to different positional and semantic relationships — syntactic dependencies in some, coreference in others. Outputs are concatenated and projected linearly.

Positional Encoding: Since there is no recurrence, order information is injected via sinusoidal positional encodings added to input embeddings: PE(pos,2i) = sin(pos/10000^(2i/d_model)).

Architecture: The encoder stacks 6 identical layers (multi-head self-attention + feed-forward, each with residual connections and layer normalization). The decoder adds masked self-attention plus cross-attention over encoder outputs.

Results: 28.4 BLEU on WMT EN-DE, 41.8 on EN-FR, training in 3.5 days on 8 GPUs — a fraction of the cost of prior seq2seq models. The attention paradigm became the foundation for BERT, GPT and modern LLMs.`,
      },
      {
        title: "Cognitive Psychology — Spaced Repetition & SM-2.pdf",
        type: "application/pdf",
        size: 1450000,
        tags: ["Cognitive Science", "Memory", "SM-2", "Learning"],
        uploadedAt: daysAgo(38),
        content: `The spacing effect, documented since Ebbinghaus (1885), shows that review sessions spaced over time produce dramatically stronger retention than massed practice (cramming).

SM-2 Algorithm (Piotr Wozniak, 1987): After each recall attempt, the item's ease factor (EF) is adjusted: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02)), where q is the quality of recall (0-5). EF is bounded below at 1.3.

Interval scheduling: After a successful recall with quality q >= 4: first repetition → 1 day, second → 6 days, subsequent n → interval(n-1) * EF. If recall fails (q < 4), the item resets to repetition 1 with a 1-day interval but keeps its adjusted EF.

Forgetting curve: Retention decays as R = e^(-t/S), where S is memory stability. Each successful spaced review increases S roughly 2-3x, flattening the decay curve.

Practical implications: Optimal review lands at ~90% predicted retention. Testing yourself (active recall) beats re-reading by a wide margin — the act of retrieval itself strengthens the memory trace (the testing effect, Roediger & Karpicke 2006). Interleaving related topics during review further improves discrimination and transfer.`,
      },
      {
        title: "Lecture Recording — Graph Neural Networks & Embeddings.mp3",
        type: "audio/mpeg",
        size: 18200000,
        tags: ["Graph Neural Networks", "Embeddings", "Audio Note"],
        uploadedAt: daysAgo(30),
        content: `Transcript summary — Graph Neural Networks lecture:

GNNs extend deep learning to irregular, non-Euclidean structures. A graph G = (V, E) with node features is processed via message passing: each node aggregates transformed feature vectors from its neighbors, then updates its own state. After k rounds, every node sees its k-hop neighborhood.

Message passing formalism: h_v^(k) = UPDATE(h_v^(k-1), AGGREGATE({h_u^(k-1) : u in N(v)})). Common aggregators: mean, sum, max — sum is injective and most expressive (GIN paper).

GraphSAGE samples fixed-size neighborhoods for scalability. Graph Attention Networks (GAT) learn attention weights per edge instead of uniform aggregation.

Embeddings: Node2Vec and DeepWalk generate random walks, then apply skip-gram to produce embeddings capturing structural roles. Modern GNNs learn embeddings end-to-end.

Applications covered: knowledge-graph link prediction (exactly what this app's knowledge graph does — predicting which of your concepts should be connected), molecule property prediction, recommender systems, and fraud detection on transaction graphs.

Over-smoothing: stacking too many GNN layers makes all node embeddings converge — a key open problem. Residual connections and jumping-knowledge networks mitigate it.`,
      },
      {
        title: "System Architecture — Vector Database & RAG Design.md",
        type: "text/markdown",
        size: 54000,
        tags: ["Architecture", "Vector Search", "RAG", "Databases"],
        uploadedAt: daysAgo(22),
        content: `# RAG Pipeline Architecture Notes

## Why RAG
LLMs hallucinate without grounding. Retrieval-Augmented Generation injects relevant chunks from a private corpus into the prompt, so answers cite actual user documents.

## Pipeline
1. **Ingestion**: PDF/DOCX/MD parsed to text (pdf-parse, mammoth). Audio/video transcribed (Whisper).
2. **Chunking**: 500-1000 token chunks with 10-15% overlap preserves context across boundaries.
3. **Embedding**: text-embedding-3-small produces 1536-dim vectors; cosine similarity in [0,1].
4. **Storage**: Mongo document per chunk; embedding array stored inline (fine to ~100k vectors; switch to pgvector/Pinecone beyond).
5. **Retrieval**: embed query → cosine top-k → optionally hybrid with BM25 keyword search (reciprocal rank fusion).
6. **Generation**: system prompt with retrieved context + source titles → model answers with citations.

## Knowledge graph layer
Entity extraction (NER) over chunks builds nodes; co-occurrence and relation extraction build edges. Strength = normalized co-occurrence count. The graph powers "concept connection" views and gap analysis.

## Cost control
Cache query embeddings. gpt-4o-mini for chat, reserve gpt-4o for complex synthesis. Batch embedding calls.`,
      },
      {
        title: "Research Notes — Retrieval-Augmented Generation Survey.md",
        type: "text/markdown",
        size: 38000,
        tags: ["RAG", "NLP", "Survey"],
        uploadedAt: daysAgo(12),
        content: `Survey notes on RAG (Lewis et al. 2020 onward):

- RAG-Sequence vs RAG-Token: RAG-Sequence retrieves once per query and uses the same document for every output token; RAG-Token can attend to different documents per token. RAG-Sequence is simpler and usually sufficient.
- Fusion-in-Decoder (FiD): retrieve top-k passages, encode each independently, concatenate at decoder — scales better than joint encoding.
- Query rewriting: LLM rewrites user query into retrieval-friendly form; HyDE generates a hypothetical answer document and embeds that instead of the raw query.
- Reranking: cross-encoder rerankers (e.g. bge-reranker) significantly boost precision of top-k vs bi-encoder cosine alone.
- Evaluation: RAGAS metrics — faithfulness (answer grounded in context), answer relevance, context precision/recall. Faithfulness is the key hallucination guard.
- Failure modes: retrieval misses (embedding mismatch), context overflow, lost-in-the-middle (model ignores middle of long contexts), stale index after document edits.

Deployment checklist: monitor retrieval hit-rate, log unanswered queries, refresh embeddings when embedding model changes, version the index alongside document edits.`,
      },
      {
        title: "Meeting Notes — Q3 Product Roadmap Sync.pdf",
        type: "application/pdf",
        size: 890000,
        tags: ["Product", "Roadmap", "Meeting Notes"],
        uploadedAt: daysAgo(5),
        content: `Q3 roadmap sync — attended by eng, design, growth.

Decisions:
- Ship the AI Knowledge Twin beta to the first 200 users behind a waitlist.
- Spaced repetition: SM-2 ships in Q3; FSRS evaluation moved to Q4.
- Knowledge graph v2: entity deduplication via embedding clustering; new edge types (contradicts, elaborates, example-of).
- Chat: streaming responses + citation chips linking to source documents.
- Billing: Stripe checkout replaces simulated flow in Q3; usage metering for the free tier.

Risks discussed: embedding cost at scale, OCR quality on scanned PDFs (fallback to Tesseract with confidence thresholds), and voice note transcription latency on long recordings (chunk + parallel transcribe).

Action items: eng spec for streaming chat (owner: platform), design pass on review flashcards UI (owner: design), growth experiments on onboarding (owner: growth).`,
      },
    ];

    const inserted = await Document.insertMany(
      docs.map((d) => ({
        ...d,
        userId,
        status: "processed",
        fileUrl: `/uploads/demo/${encodeURIComponent(d.title)}`,
        processedAt: daysAgo(0),
      })),
    );
    console.log(`   ✅ ${inserted.length} documents`);

    // Total storage used by user
    const totalSize = inserted.reduce((s: number, d: any) => s + d.size, 0);
    await User.findByIdAndUpdate(userId, {
      "subscription.storageUsed": totalSize,
    });

    // ============================================================
    // 2. CHATS — realistic multi-turn twin conversations
    // ============================================================
    console.log("💬 Seeding chats...");
    const chat1 = await Chat.create({
      userId,
      title: "Transformer attention deep-dive",
      messages: [
        {
          role: "user",
          content: "Explain multi-head attention like I'm a senior engineer new to transformers.",
          timestamp: daysAgo(10, 2),
        },
        {
          role: "assistant",
          content:
            "Think of it as h parallel 'routing layers'. Each head projects Q, K, V into its own subspace and computes softmax(QKᵀ/√d_k)V — a learned, content-addressable lookup. Because heads see different projections, one head can track syntactic dependencies while another tracks coreference. From your notes: 'Attention Is All You Need' shows 8 heads on WMT EN-DE beat single-head at equal compute, because the model can attend to multiple positions at once instead of averaging them away.",
          timestamp: daysAgo(10, 2),
        },
        {
          role: "user",
          content: "Why the sqrt(d_k) scaling?",
          timestamp: daysAgo(10, 3),
        },
        {
          role: "assistant",
          content:
            "Dot products of high-dimensional vectors have variance proportional to d_k. Without scaling, logits get large, softmax saturates to one-hot, and gradients vanish. Dividing by √d_k keeps logit variance ~1 so softmax stays trainable. Your system architecture note covers the same principle for cosine similarity — normalize before comparing embeddings.",
          timestamp: daysAgo(10, 3),
        },
      ],
      createdAt: daysAgo(10, 2),
      updatedAt: daysAgo(10, 3),
    });

    const chat2 = await Chat.create({
      userId,
      title: "SM-2 spaced repetition questions",
      messages: [
        {
          role: "user",
          content: "How should I set review intervals for hard concepts?",
          timestamp: daysAgo(4, 1),
        },
        {
          role: "assistant",
          content:
            "Let SM-2 handle it: hard recalls (quality < 4) reset the interval to 1 day but permanently lower the ease factor (EF' = EF + 0.1 − (5−q)(0.08 + (5−q)·0.02)), so future intervals grow slower. Don't manually shorten intervals — a lower EF is the correct signal. Your psychology notes flag the testing effect: attempt recall even when unsure; retrieval itself strengthens the trace.",
          timestamp: daysAgo(4, 1),
        },
        {
          role: "user",
          content: "What's optimal retention target?",
          timestamp: daysAgo(4, 2),
        },
        {
          role: "assistant",
          content:
            "~90%. Below that you waste reviews on already-known items; above, you review too rarely and relearn from scratch. The R = e^(−t/S) forgetting-curve model in your notes gives the trade-off directly.",
          timestamp: daysAgo(4, 2),
        },
      ],
      createdAt: daysAgo(4, 1),
      updatedAt: daysAgo(4, 2),
    });

    const chat3 = await Chat.create({
      userId,
      title: "GNN embeddings for my knowledge graph",
      messages: [
        {
          role: "user",
          content: "Could GNNs improve the concept connection feature in this app?",
          timestamp: daysAgo(2),
        },
        {
          role: "assistant",
          content:
            "Yes — today your graph edges come from co-occurrence and relation extraction. A GNN link-predictor (GraphSAGE or GAT) trained on your graph could score *missing* edges: nodes whose embeddings are close but unconnected are candidate insights. Your lecture transcript mentions exactly this: 'knowledge-graph link prediction... predicting which of your concepts should be connected'. Start with a simple sum-aggregator GIN since it's injective and most expressive per the transcript.",
          timestamp: daysAgo(2),
        },
      ],
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    });

    console.log(`   ✅ 3 chats (${chat1.messages.length + chat2.messages.length + chat3.messages.length} messages)`);

    // ============================================================
    // 3. MEMORIES — SM-2 spaced repetition state
    // ============================================================
    console.log("🧠 Seeding memories...");
    const docIdTransformer = inserted[0]._id;
    const docIdSM2 = inserted[1]._id;
    const docIdGNN = inserted[2]._id;
    const docIdRAG = inserted[3]._id;
    const docIdRAGSurvey = inserted[4]._id;

    await Memory.insertMany([
      {
        userId,
        title: "Scaled dot-product attention formula",
        content:
          "Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V — softmax over query·key similarities, applied to values. √d_k keeps logit variance ~1 so softmax doesn't saturate.",
        category: "Deep Learning",
        importance: 9,
        tags: ["Transformers", "Attention"],
        relatedDocuments: [docIdTransformer],
        retentionRate: 92,
        lastReviewed: daysAgo(1),
        easeFactor: 2.6,
        interval: 12,
        repetitions: 4,
        nextReview: daysAgo(-2),
        difficulty: "easy",
        starred: true,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(1),
      },
      {
        userId,
        title: "Why multi-head attention?",
        content:
          "h parallel heads project Q/K/V into different subspaces so the model can attend to multiple representation subspaces and positions simultaneously; outputs are concatenated then linearly projected.",
        category: "Deep Learning",
        importance: 8,
        tags: ["Transformers", "Attention"],
        relatedDocuments: [docIdTransformer],
        retentionRate: 85,
        lastReviewed: daysAgo(2),
        easeFactor: 2.5,
        interval: 6,
        repetitions: 3,
        nextReview: daysAgo(-1),
        difficulty: "medium",
        starred: false,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(2),
      },
      {
        userId,
        title: "SM-2 ease factor update",
        content:
          "EF' = EF + (0.1 − (5−q)·(0.08 + (5−q)·0.02)), q ∈ 0..5, EF floor 1.3. Quality ≥ 4 → interval grows (1d, 6d, then ×EF). Quality < 4 → reset to 1 day, keep adjusted EF.",
        category: "Cognitive Science",
        importance: 10,
        tags: ["SM-2", "Spaced Repetition"],
        relatedDocuments: [docIdSM2],
        retentionRate: 88,
        lastReviewed: daysAgo(3),
        easeFactor: 2.5,
        interval: 6,
        repetitions: 3,
        nextReview: daysAgo(0),
        difficulty: "medium",
        starred: true,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(3),
      },
      {
        userId,
        title: "Forgetting curve & memory stability",
        content:
          "Retention R = e^(−t/S). Each successful spaced review multiplies stability S by ~2-3x, flattening decay. Review at ~90% predicted retention for efficiency.",
        category: "Cognitive Science",
        importance: 7,
        tags: ["Memory", "Review Strategy"],
        relatedDocuments: [docIdSM2],
        retentionRate: 74,
        lastReviewed: daysAgo(5),
        easeFactor: 2.2,
        interval: 3,
        repetitions: 2,
        nextReview: daysAgo(0),
        difficulty: "hard",
        starred: false,
        createdAt: daysAgo(30),
        updatedAt: daysAgo(5),
      },
      {
        userId,
        title: "GNN message passing",
        content:
          "h_v^(k) = UPDATE(h_v^(k−1), AGGREGATE({h_u^(k−1) : u ∈ N(v)})). Sum-aggregation is injective → most expressive (GIN). k rounds = k-hop receptive field.",
        category: "Graph Neural Networks",
        importance: 8,
        tags: ["GNN", "Embeddings"],
        relatedDocuments: [docIdGNN],
        retentionRate: 80,
        lastReviewed: daysAgo(2),
        easeFactor: 2.5,
        interval: 8,
        repetitions: 3,
        nextReview: daysAgo(-3),
        difficulty: "medium",
        starred: false,
        createdAt: daysAgo(28),
        updatedAt: daysAgo(2),
      },
      {
        userId,
        title: "RAG pipeline stages",
        content:
          "Ingest → chunk (500-1000 tokens, 10-15% overlap) → embed (1536-dim) → store → retrieve top-k cosine (hybrid w/ BM25 optional) → generate with cited context. Monitor retrieval hit-rate & faithfulness.",
        category: "AI Systems",
        importance: 9,
        tags: ["RAG", "Vector Search"],
        relatedDocuments: [docIdRAG, docIdRAGSurvey],
        retentionRate: 90,
        lastReviewed: daysAgo(1),
        easeFactor: 2.7,
        interval: 15,
        repetitions: 5,
        nextReview: daysAgo(-5),
        difficulty: "easy",
        starred: true,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(1),
      },
      {
        userId,
        title: "Over-smoothing in deep GNNs",
        content:
          "Stacking many GNN layers makes node embeddings converge (indistinguishable). Mitigations: residual connections, jumping-knowledge networks, fewer layers with wider aggregation.",
        category: "Graph Neural Networks",
        importance: 6,
        tags: ["GNN", "Training Issues"],
        relatedDocuments: [docIdGNN],
        retentionRate: 65,
        lastReviewed: daysAgo(6),
        easeFactor: 2.0,
        interval: 2,
        repetitions: 2,
        nextReview: daysAgo(0),
        difficulty: "hard",
        starred: false,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(6),
      },
      {
        userId,
        title: "Q3 roadmap: graph v2 edge types",
        content:
          "New edge types planned: contradicts, elaborates, example-of. Entity dedup via embedding clustering. Streaming chat + citation chips also in Q3.",
        category: "Product",
        importance: 5,
        tags: ["Roadmap", "Knowledge Graph"],
        relatedDocuments: [inserted[5]._id],
        retentionRate: 70,
        lastReviewed: daysAgo(4),
        easeFactor: 2.5,
        interval: 4,
        repetitions: 2,
        nextReview: daysAgo(-1),
        difficulty: "medium",
        starred: false,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4),
      },
    ]);
    console.log("   ✅ 8 memories (SM-2 state set, 3 due today)");
  }

  // ============================================================
  // 4. KNOWLEDGE GRAPH — nodes from docs/memories, weighted edges
  // ============================================================
  console.log("🕸 Seeding knowledge graph...");
  await Graph.deleteMany({ userId });
  await Graph.create({
    userId,
    updatedAt: daysAgo(0),
    nodes: [
      { id: "n-transformer", label: "Transformer Architecture", type: "concept", category: "Deep Learning", importance: 9 },
      { id: "n-attention", label: "Self-Attention", type: "concept", category: "Deep Learning", importance: 9 },
      { id: "n-multihead", label: "Multi-Head Attention", type: "concept", category: "Deep Learning", importance: 8 },
      { id: "n-positional", label: "Positional Encoding", type: "concept", category: "Deep Learning", importance: 6 },
      { id: "n-sm2", label: "SM-2 Algorithm", type: "concept", category: "Cognitive Science", importance: 9 },
      { id: "n-spacing", label: "Spacing Effect", type: "concept", category: "Cognitive Science", importance: 8 },
      { id: "n-forgetting", label: "Forgetting Curve", type: "concept", category: "Cognitive Science", importance: 7 },
      { id: "n-testing", label: "Testing Effect", type: "concept", category: "Cognitive Science", importance: 7 },
      { id: "n-gnn", label: "Graph Neural Networks", type: "concept", category: "Graph ML", importance: 8 },
      { id: "n-message", label: "Message Passing", type: "concept", category: "Graph ML", importance: 7 },
      { id: "n-node2vec", label: "Node2Vec Embeddings", type: "concept", category: "Graph ML", importance: 6 },
      { id: "n-rag", label: "RAG Pipeline", type: "system", category: "AI Systems", importance: 9 },
      { id: "n-vector-db", label: "Vector Database", type: "system", category: "AI Systems", importance: 8 },
      { id: "n-embedding", label: "Text Embeddings", type: "concept", category: "NLP", importance: 8 },
      { id: "n-chunking", label: "Chunking Strategy", type: "concept", category: "AI Systems", importance: 6 },
      { id: "n-faithfulness", label: "Faithfulness Metric", type: "concept", category: "Evaluation", importance: 5 },
      { id: "doc-1", label: "Attention Is All You Need", type: "document", category: "Source", importance: 9 },
      { id: "doc-2", label: "Spaced Repetition & SM-2", type: "document", category: "Source", importance: 8 },
      { id: "doc-3", label: "GNN Lecture Recording", type: "document", category: "Source", importance: 7 },
      { id: "doc-4", label: "Vector DB & RAG Design", type: "document", category: "Source", importance: 8 },
      { id: "doc-5", label: "RAG Survey Notes", type: "document", category: "Source", importance: 6 },
    ],
    edges: [
      { id: "e1", source: "n-transformer", target: "n-attention", relationship: "relies-on", strength: 0.95 },
      { id: "e2", source: "n-transformer", target: "n-multihead", relationship: "uses", strength: 0.9 },
      { id: "e3", source: "n-transformer", target: "n-positional", relationship: "requires", strength: 0.7 },
      { id: "e4", source: "n-attention", target: "n-multihead", relationship: "extended-by", strength: 0.85 },
      { id: "e5", source: "n-sm2", target: "n-spacing", relationship: "implements", strength: 0.95 },
      { id: "e6", source: "n-spacing", target: "n-forgetting", relationship: "explained-by", strength: 0.8 },
      { id: "e7", source: "n-sm2", target: "n-testing", relationship: "leverages", strength: 0.75 },
      { id: "e8", source: "n-gnn", target: "n-message", relationship: "built-on", strength: 0.95 },
      { id: "e9", source: "n-gnn", target: "n-node2vec", relationship: "alternative-to", strength: 0.6 },
      { id: "e10", source: "n-rag", target: "n-vector-db", relationship: "queries", strength: 0.9 },
      { id: "e11", source: "n-rag", target: "n-embedding", relationship: "depends-on", strength: 0.9 },
      { id: "e12", source: "n-vector-db", target: "n-embedding", relationship: "indexes", strength: 0.85 },
      { id: "e13", source: "n-rag", target: "n-chunking", relationship: "preprocessing", strength: 0.7 },
      { id: "e14", source: "n-rag", target: "n-faithfulness", relationship: "evaluated-by", strength: 0.65 },
      { id: "e15", source: "n-embedding", target: "n-node2vec", relationship: "related-to", strength: 0.55 },
      { id: "e16", source: "doc-1", target: "n-transformer", relationship: "describes", strength: 1.0 },
      { id: "e17", source: "doc-2", target: "n-sm2", relationship: "describes", strength: 1.0 },
      { id: "e18", source: "doc-3", target: "n-gnn", relationship: "describes", strength: 1.0 },
      { id: "e19", source: "doc-4", target: "n-rag", relationship: "describes", strength: 1.0 },
      { id: "e20", source: "doc-5", target: "n-rag", relationship: "surveys", strength: 0.9 },
      // Cross-domain links (the interesting "twin" connections)
      { id: "e21", source: "n-attention", target: "n-message", relationship: "analogous-to", strength: 0.6 },
      { id: "e22", source: "n-gnn", target: "n-rag", relationship: "candidate-for-link-prediction", strength: 0.5 },
      { id: "e23", source: "n-forgetting", target: "n-sm2", relationship: "counteracted-by", strength: 0.8 },
    ],
  });
  console.log("   ✅ 21 nodes, 23 edges");

  // ============================================================
  // 5. SUBSCRIPTION — Pro plan + invoice-style history
  // ============================================================
  console.log("💳 Seeding subscription...");
  const subCount = await Subscription.countDocuments({ userId });
  if (subCount === 0) {
    await Subscription.insertMany([
      {
        userId,
        plan: "free",
        status: "cancelled",
        cycle: "monthly",
        amount: 0,
        startDate: daysAgo(120),
        endDate: daysAgo(90),
        createdAt: daysAgo(120),
      },
      {
        userId,
        plan: "pro",
        status: "active",
        cycle: "monthly",
        amount: 19,
        currency: "USD",
        startDate: daysAgo(90),
        endDate: daysAgo(-1),
        stripeCustomerId: "cus_demo_twin",
        stripeSubscriptionId: "sub_demo_twin_monthly",
        createdAt: daysAgo(90),
      },
    ]);
    console.log("   ✅ 2 subscription records (Free → Pro upgrade history)");
  }

  // ============================================================
  // Summary
  // ============================================================
  const counts = {
    documents: await Document.countDocuments({ userId }),
    chats: await Chat.countDocuments({ userId }),
    memories: await Memory.countDocuments({ userId }),
    graphs: await Graph.countDocuments({ userId }),
    subscriptions: await Subscription.countDocuments({ userId }),
  };

  console.log("\n══════════════════════════════════════════");
  console.log("🌱 Seed complete! Demo account end-to-end data:");
  console.log("══════════════════════════════════════════");
  console.log(`   Login email:    ${DEMO_EMAIL}`);
  console.log(`   Login password: ${DEMO_PASSWORD}`);
  console.log(`   Documents:      ${counts.documents}`);
  console.log(`   Chats:          ${counts.chats}`);
  console.log(`   Memories:       ${counts.memories}`);
  console.log(`   Graph:          ${counts.graphs} (21 nodes / 23 edges)`);
  console.log(`   Subscriptions:  ${counts.subscriptions}`);
  console.log("══════════════════════════════════════════");
  console.log("\nNext: npm run dev → login with the credentials above.");
  if (String(process.env.OPENAI_API_KEY || "").startsWith("sk-")) {
    console.log("OPENAI key detected — run POST /api/documents/embed to embed documents for semantic RAG.");
  } else {
    console.log("ℹ OPENAI_API_KEY is a placeholder — RAG falls back to keyword search until a real key is set in .env.local.");
  }
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
