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
  try {
    // Step 1: Retrieve relevant documents using semantic search
    const relevantDocs = await semanticSearch(userId, query, 5);

    if (relevantDocs.length === 0) {
      // No relevant documents found, generate response without context
      const response = await generateChatResponse(chatHistory);
      return {
        content: response.content,
        sources: [],
        usage: response.usage,
      };
    }

    // Step 2: Build context from relevant documents
    const context = relevantDocs
      .map((doc, index) => 
        `[Document ${index + 1}: ${doc.title}]\n${doc.content.substring(0, 1000)}...`
      )
      .join('\n\n');

    // Step 3: Generate AI response with context
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
    console.error('RAG pipeline error:', error);
    throw new Error('Failed to generate RAG response');
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
