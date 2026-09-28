import { extractConcepts } from './openai';

export interface Entity {
  text: string;
  type: 'concept' | 'person' | 'topic' | 'entity';
  category?: string;
  importance: number;
}

/**
 * Extract entities/concepts from text using AI
 */
export async function extractEntities(content: string): Promise<Entity[]> {
  try {
    // Use AI to extract concepts
    const concepts = await extractConcepts(content);
    
    // Convert concepts to entities
    const entities: Entity[] = concepts.map((concept, index) => ({
      text: concept,
      type: 'concept',
      importance: 5,
    }));

    return entities;
  } catch (error) {
    console.error('Entity extraction error:', error);
    // Fallback: extract entities using simple regex
    return extractEntitiesFallback(content);
  }
}

/**
 * Fallback entity extraction using regex
 */
function extractEntitiesFallback(content: string): Entity[] {
  const entities: Entity[] = [];
  
  // Extract capitalized words (potential entities)
  const words = content.split(/\s+/);
  const capitalizedWords = words.filter(word => 
    /^[A-Z][a-z]+$/.test(word) && word.length > 2
  );
  
  // Remove duplicates and create entities
  const uniqueWords = [...new Set(capitalizedWords)];
  
  uniqueWords.forEach(word => {
    entities.push({
      text: word,
      type: 'entity',
      importance: 3,
    });
  });
  
  return entities.slice(0, 20); // Limit to 20 entities
}
