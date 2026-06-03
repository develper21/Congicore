import mongoose from "mongoose";

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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
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
  relatedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  retentionRate: { type: Number, default: 0 },
  lastReviewed: { type: Date },
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
  plan: { type: String, enum: ["free", "pro", "enterprise"], required: true },
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

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Document =
  mongoose.models.Document || mongoose.model("Document", DocumentSchema);
export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export const Memory =
  mongoose.models.Memory || mongoose.model("Memory", MemorySchema);
export const Graph =
  mongoose.models.Graph || mongoose.model("Graph", GraphSchema);
export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
