import { semanticSearch } from './vector-search';
import { generateChatResponse, ChatMessage } from './openai';

export interface RAGResponse {
  content: string;
  sources: Array<{
    documentId: string;
    title: string;
    similarity: number;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * RAG (Retrieval-Augmented Generation) pipeline
 * Retrieves relevant documents and uses them as context for AI responses
 */
export async function ragResponse(
  userId: string,
  query: string,
  chatHistory: ChatMessage[]
): Promise<RAGResponse> {
  // Step 1: Retrieve relevant documents using semantic search
  // (falls back to keyword search internally when OpenAI is unavailable)
  const relevantDocs = await semanticSearch(userId, query, 5);

  // Step 2: Build context from relevant documents
  const context = relevantDocs
    .map((doc, index) => 
      `[Document ${index + 1}: ${doc.title}]\n${doc.content.substring(0, 1000)}...`
    )
    .join('\n\n');

  // Step 3: Generate AI response with context.
  // If OpenAI is unavailable (missing/placeholder key), return an extractive
  // fallback answer built from the retrieved documents so the twin still works.
  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an AI Knowledge Twin assistant. Use the following context from the user's knowledge base to answer questions accurately. If the context doesn't contain relevant information, say so honestly.\n\nContext:\n${context}\n\nWhen referencing information from the documents, cite the source by mentioning the document title.`,
    };

    const response = await generateChatResponse([systemMessage, ...chatHistory]);

    // Step 4: Return response with sources
    return {
      content: response.content,
      sources: relevantDocs.map(doc => ({
        documentId: doc.documentId,
        title: doc.title,
        similarity: doc.similarity,
      })),
      usage: response.usage,
    };
  } catch (error) {
    console.warn(
      'AI generation unavailable, using extractive fallback:',
      error instanceof Error ? error.message : error,
    );
    // Extractive fallback: surface the most relevant passages from the user's
    // own documents. This keeps the twin useful without an OpenAI key.
    const fallbackParts = relevantDocs.slice(0, 3).map((doc, i) => {
      const snippet = doc.content.replace(/\s+/g, ' ').trim().substring(0, 350);
      return `${i + 1}. From "${doc.title}" (relevance ${(doc.similarity * 100).toFixed(0)}%):\n"${snippet}…"`;
    });

    const fallbackContent = relevantDocs.length
      ? `Here's what I found in your knowledge base for "${query}":\n\n${fallbackParts.join('\n\n')}\n\n(Connect a real OPENAI_API_KEY in .env.local to unlock full AI-synthesized answers — retrieval is already working.)`
      : `I couldn't find anything in your knowledge base about "${query}". Try uploading related documents first.`;

    return {
      content: fallbackContent,
      sources: relevantDocs.map(doc => ({
        documentId: doc.documentId,
        title: doc.title,
        similarity: doc.similarity,
      })),
    };
  }
}

/**
 * Generate context-aware response with document references
 */
export async function generateContextualResponse(
  userId: string,
  query: string,
  chatHistory: ChatMessage[],
  maxContextLength: number = 3000
): Promise<RAGResponse> {
  try {
    // Retrieve relevant documents
    const relevantDocs = await semanticSearch(userId, query, 3);

    if (relevantDocs.length === 0) {
      const response = await generateChatResponse(chatHistory);
      return {
        content: response.content,
        sources: [],
        usage: response.usage,
      };
    }

    // Build context with length limit
    let context = '';
    let totalLength = 0;
    const includedDocs: Array<{ documentId: string; title: string; similarity: number }> = [];

    for (const doc of relevantDocs) {
      const docContent = `[${doc.title}]\n${doc.content.substring(0, 500)}`;
      if (totalLength + docContent.length <= maxContextLength) {
        context += docContent + '\n\n';
        totalLength += docContent.length;
        includedDocs.push({
          documentId: doc.documentId,
          title: doc.title,
          similarity: doc.similarity,
        });
      }
    }

    // Generate response with context
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Use this context to answer: ${context}\n\nCite sources when using information.`,
    };

    const response = await generateChatResponse([systemMessage, ...chatHistory]);

    return {
      content: response.content,
      sources: includedDocs,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Contextual response generation error:', error);
    throw new Error('Failed to generate contextual response');
  }
}
