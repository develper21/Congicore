import OpenAI from 'openai';

// ------------------------------------------------------------------
// OpenAI client — all knobs come from environment variables.
// See .env.example for documented variables. The twin engine uses:
//   OPENAI_API_KEY        -> auth
//   OPENAI_CHAT_MODEL     -> twin reasoning model (default gpt-4o-mini)
//   OPENAI_EMBEDDING_MODEL-> vector embeddings (default text-embedding-3-small)
// ------------------------------------------------------------------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not found in environment variables');
}

export const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';
export const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate AI chat response
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  context?: string
): Promise<AIResponse> {
  try {
    // Add context as system message if provided
    const systemMessage: ChatMessage = context
      ? {
          role: 'system',
          content: `You are an AI Knowledge Twin assistant. Use the following context from the user's knowledge base to answer questions:\n\n${context}\n\nIf the context doesn't contain relevant information, say so honestly. Be helpful, accurate, and concise.`,
        }
      : {
          role: 'system',
          content: 'You are an AI Knowledge Twin assistant. Help users learn and remember information from their knowledge base. Be helpful, accurate, and concise.',
        };

    const allMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return {
      content: response,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate embeddings for semantic search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embeddings error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Summarize document content
 */
export async function summarizeDocument(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes documents concisely while preserving key information.',
        },
        {
          role: 'user',
          content: `Please summarize the following document:\n\n${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Failed to summarize';
  } catch (error) {
    console.error('OpenAI summarization error:', error);
    throw new Error('Failed to summarize document');
  }
}

/**
 * Extract key concepts from text
 */
export async function extractConcepts(content: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Extract key concepts from the given text. Return only a JSON array of concept strings.',
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    const concepts = JSON.parse(responseText);
    return Array.isArray(concepts) ? concepts : [];
  } catch (error) {
    console.error('OpenAI concept extraction error:', error);
    return [];
  }
}

/**
 * Auto-tag document with categories
 */
export async function autoTagDocument(content: string, title: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Generate relevant tags for a document. Return only a JSON array of tag strings (max 5 tags). Tags should be: Machine Learning, Programming, Web Development, Data Science, AI, Cloud Computing, DevOps, Security, Database, etc.',
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.substring(0, 2000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    const tags = JSON.parse(responseText);
    return Array.isArray(tags) ? tags.slice(0, 5) : [];
  } catch (error) {
    console.error('OpenAI auto-tagging error:', error);
    return [];
  }
}

export default openai;
