import { generateEmbedding } from './openai';

/**
 * Generate embeddings for a document
 */
export async function generateDocumentEmbedding(content: string): Promise<number[]> {
  try {
    // Truncate content to avoid exceeding token limits
    const truncatedContent = content.substring(0, 8000);
    return await generateEmbedding(truncatedContent);
  } catch (error) {
    console.error('Document embedding generation error:', error);
    throw new Error('Failed to generate document embedding');
  }
}

/**
 * Generate embeddings for a query
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  try {
    return await generateEmbedding(query);
  } catch (error) {
    console.error('Query embedding generation error:', error);
    throw new Error('Failed to generate query embedding');
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Find most similar documents based on embeddings
 */
export async function findSimilarDocuments(
  queryEmbedding: number[],
  documentEmbeddings: Array<{ embedding: number[]; documentId: string }>
): Promise<Array<{ documentId: string; similarity: number }>> {
  const similarities = documentEmbeddings.map(({ embedding, documentId }) => ({
    documentId,
    similarity: cosineSimilarity(queryEmbedding, embedding),
  }));

  // Sort by similarity (descending) and return top results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .filter(item => item.similarity > 0.5) // Only return results with >50% similarity
    .slice(0, 10); // Return top 10 results
}
