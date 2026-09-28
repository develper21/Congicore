import { extractEntities, Entity } from './entity-extractor';
import { mapRelationships, Relationship } from './relationship-mapper';
import { Graph } from '@/models';
import connectDB from '@/lib/mongodb';

export interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'document' | 'person' | 'topic' | 'entity';
  category?: string;
  importance: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export interface GeneratedGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Generate knowledge graph from document content
 */
export async function generateKnowledgeGraph(
  userId: string,
  documentId: string,
  content: string,
  title: string
): Promise<GeneratedGraph> {
  try {
    await connectDB();

    // Extract entities/concepts from content
    const entities = await extractEntities(content);

    // Map relationships between entities
    const relationships = await mapRelationships(entities, content);

    // Create nodes
    const nodes: GraphNode[] = entities.map((entity: Entity, index: number) => ({
      id: `node-${documentId}-${index}`,
      label: entity.text,
      type: entity.type,
      category: entity.category,
      importance: entity.importance || 5,
    }));

    // Add document node
    nodes.push({
      id: `doc-${documentId}`,
      label: title,
      type: 'document',
      importance: 8,
    });

    // Create edges
    const edges: GraphEdge[] = relationships.map((rel: Relationship, index: number) => ({
      id: `edge-${documentId}-${index}`,
      source: `node-${documentId}-${rel.sourceIndex}`,
      target: `node-${documentId}-${rel.targetIndex}`,
      relationship: rel.type,
      strength: rel.strength,
    }));

    // Connect entities to document
    entities.forEach((entity: Entity, index: number) => {
      edges.push({
        id: `edge-doc-${documentId}-${index}`,
        source: `doc-${documentId}`,
        target: `node-${documentId}-${index}`,
        relationship: 'contains',
        strength: 1,
      });
    });

    // Update or create graph in database
    const existingGraph = await Graph.findOne({ userId });
    
    if (existingGraph) {
      // Merge new nodes and edges with existing graph
      const existingNodeIds = new Set(existingGraph.nodes.map((n: { id: string }) => n.id));
      const existingEdgeIds = new Set(existingGraph.edges.map((e: { id: string }) => e.id));
      
      const newNodes = nodes.filter(n => !existingNodeIds.has(n.id));
      const newEdges = edges.filter(e => !existingEdgeIds.has(e.id));
      
      await Graph.findByIdAndUpdate(existingGraph._id, {
        nodes: [...existingGraph.nodes, ...newNodes],
        edges: [...existingGraph.edges, ...newEdges],
        updatedAt: new Date(),
      });
    } else {
      await Graph.create({
        userId,
        nodes,
        edges,
      });
    }

    return { nodes, edges };
  } catch (error) {
    console.error('Knowledge graph generation error:', error);
    throw new Error('Failed to generate knowledge graph');
  }
}

/**
 * Generate graph from multiple documents
 */
export async function generateGraphFromDocuments(
  userId: string,
  documents: Array<{ _id: string; content: string; title: string }>
): Promise<GeneratedGraph> {
  const allNodes: GraphNode[] = [];
  const allEdges: GraphEdge[] = [];

  for (const doc of documents) {
    const graph = await generateKnowledgeGraph(userId, doc._id.toString(), doc.content, doc.title);
    allNodes.push(...graph.nodes);
    allEdges.push(...graph.edges);
  }

  return { nodes: allNodes, edges: allEdges };
}
