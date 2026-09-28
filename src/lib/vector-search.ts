import { Document } from '@/models';
import { generateQueryEmbedding, findSimilarDocuments } from './embeddings';
import connectDB from '@/lib/mongodb';

export interface SearchResult {
  documentId: string;
  title: string;
  content: string;
  similarity: number;
}

/**
 * Perform semantic search across user's documents
 */
export async function semanticSearch(
  userId: string,
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    await connectDB();

    // Generate embedding for the query. If OpenAI is unavailable (missing or
    // placeholder key), fall back to keyword-only search so the twin keeps
    // working — retrieval quality just degrades gracefully.
    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateQueryEmbedding(query);
    } catch (embedErr) {
      console.warn(
        'Query embedding unavailable, falling back to keyword search:',
        embedErr instanceof Error ? embedErr.message : embedErr,
      );
      return keywordSearch(userId, query, limit);
    }

    // Get all documents with embeddings for the user
    const documents = await Document.find({ 
      userId,
      embedding: { $exists: true, $ne: null }
    }).select('_id title content embedding');

    if (documents.length === 0) {
      return [];
    }

    // Prepare document embeddings for comparison
    const documentEmbeddings = documents.map(doc => ({
      embedding: doc.embedding,
      documentId: doc._id.toString(),
    }));

    // Find similar documents
    const similarDocuments = await findSimilarDocuments(queryEmbedding, documentEmbeddings);

    // Get full document details for results
    const results: SearchResult[] = [];
    for (const similar of similarDocuments) {
      const doc = documents.find(d => d._id.toString() === similar.documentId);
      if (doc) {
        results.push({
          documentId: doc._id.toString(),
          title: doc.title,
          content: doc.content,
          similarity: similar.similarity,
        });
      }
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error('Semantic search error:', error);
    throw new Error('Failed to perform semantic search');
  }
}

/**
 * Keyword-only fallback used when OpenAI embeddings are unavailable
 * (missing/placeholder API key). Splits the query into terms so partial
 * matches still surface relevant documents.
 */
async function keywordSearch(
  userId: string,
  query: string,
  limit: number
): Promise<SearchResult[]> {
  await connectDB();

  const terms = query
    .split(/\s+/)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter((t) => t.length > 1)
    .slice(0, 6);

  if (terms.length === 0) return [];

  const docs = await Document.find({
    userId,
    $or: terms.flatMap((term) => [
      { title: { $regex: term, $options: 'i' } },
      { content: { $regex: term, $options: 'i' } },
      { tags: { $in: [new RegExp(term, 'i')] } },
    ]),
  })
    .select('_id title content')
    .limit(limit);

  // Score by number of matching terms (simple BM25-ish relevance)
  const lowerQuery = query.toLowerCase();
  return docs
    .map((doc) => {
      const haystack = `${doc.title} ${doc.content}`.toLowerCase();
      const matches = terms.filter((t) =>
        haystack.includes(t.replace(/\\/g, '')),
      ).length;
      return {
        documentId: doc._id.toString(),
        title: doc.title,
        content: doc.content,
        similarity: Math.min(0.9, 0.4 + matches * 0.15),
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Hybrid search combining keyword and semantic search
 */
export async function hybridSearch(
  userId: string,
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    await connectDB();

    // Perform keyword search
    const keywordResults = await Document.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .select('_id title content')
      .limit(limit);

    // Perform semantic search. If embeddings are unavailable, this already
    // fell back to keywordSearch — do NOT call semanticSearch here to avoid
    // infinite recursion (hybrid -> semantic -> hybrid -> ...).
    const semanticResults = await semanticSearch(userId, query, limit);

    // Combine and deduplicate results
    const combinedResults = new Map<string, SearchResult>();

    // Add semantic results
    semanticResults.forEach(result => {
      combinedResults.set(result.documentId, result);
    });

    // Add keyword results (boost their similarity score)
    keywordResults.forEach(doc => {
      const existing = combinedResults.get(doc._id.toString());
      if (existing) {
        // Boost similarity if found by both methods
        combinedResults.set(doc._id.toString(), {
          ...existing,
          similarity: Math.min(1, existing.similarity + 0.2),
        });
      } else {
        // Add keyword-only result with moderate similarity
        combinedResults.set(doc._id.toString(), {
          documentId: doc._id.toString(),
          title: doc.title,
          content: doc.content,
          similarity: 0.6,
        });
      }
    });

    // Sort by similarity and return top results
    return Array.from(combinedResults.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  } catch (error) {
    console.error('Hybrid search error:', error);
    throw new Error('Failed to perform hybrid search');
  }
}
