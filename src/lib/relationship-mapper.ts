import { Entity } from './entity-extractor';

export interface Relationship {
  sourceIndex: number;
  targetIndex: number;
  type: 'related' | 'contains' | 'references' | 'similar';
  strength: number;
}

/**
 * Map relationships between entities using co-occurrence analysis
 */
export async function mapRelationships(
  entities: Entity[],
  content: string
): Promise<Relationship[]> {
  const relationships: Relationship[] = [];
  const contentLower = content.toLowerCase();

  // Analyze co-occurrence of entities in the text
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const entity1 = entities[i];
      const entity2 = entities[j];

      // Check if entities appear near each other (within 100 characters)
      const index1 = contentLower.indexOf(entity1.text.toLowerCase());
      const index2 = contentLower.indexOf(entity2.text.toLowerCase());

      if (index1 !== -1 && index2 !== -1) {
        const distance = Math.abs(index1 - index2);
        
        if (distance < 100) {
          // Entities are close - likely related
          relationships.push({
            sourceIndex: i,
            targetIndex: j,
            type: 'related',
            strength: Math.max(0.1, 1 - distance / 100),
          });
        } else if (distance < 500) {
          // Entities are somewhat close - possibly related
          relationships.push({
            sourceIndex: i,
            targetIndex: j,
            type: 'references',
            strength: Math.max(0.05, 0.5 - distance / 1000),
          });
        }
      }
    }
  }

  // Filter weak relationships and limit count
  const strongRelationships = relationships
    .filter(r => r.strength > 0.2)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 50);

  return strongRelationships;
}
