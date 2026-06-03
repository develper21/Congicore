"use client";

import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import {
  Filter,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Network,
  Loader2,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: "concept" | "document" | "person" | "topic";
  size: number;
  color: string;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  type: "related" | "contains" | "references";
}

export default function GraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGraph();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      drawGraph();
    }
  }, [zoom, showLabels, filterType, nodes, edges]);

  const fetchGraph = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getGraph();
      const graphData = response.graph;
      setNodes(graphData.nodes || []);
      setEdges(graphData.edges || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch graph data");
    } finally {
      setLoading(false);
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);

    // Draw edges
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = `rgba(156, 163, 175, ${edge.weight})`;
        ctx.lineWidth = edge.weight * 2;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      if (filterType !== "all" && node.type !== filterType) return;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw labels
      if (showLabels) {
        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.size + 15);
      }
    });

    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2),
      );
      return distance <= node.size;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Knowledge Graph
            </h1>
            <p className="text-muted-foreground">
              Visualize connections between your knowledge and concepts
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interactive Graph</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLabels(!showLabels)}
                    >
                      {showLabels ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchGraph}>Retry</Button>
                  </div>
                ) : nodes.length === 0 ? (
                  <EmptyState
                    icon={Network}
                    title="No graph data found"
                    description="Upload documents to build your knowledge graph"
                    action={{
                      label: "Upload Documents",
                      onClick: () => {/* TODO: Navigate to upload */},
                    }}
                  />
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="w-full cursor-pointer"
                      onClick={handleCanvasClick}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Node Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="all">All Types</option>
                    <option value="concept">Concepts</option>
                    <option value="document">Documents</option>
                    <option value="person">People</option>
                    <option value="topic">Topics</option>
                  </select>
                </div>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </CardContent>
            </Card>

            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">
                        {selectedNode.label}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {selectedNode.type}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Connections</span>
                      <span className="font-medium">
                        {selectedNode.connections}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">{selectedNode.size}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Related Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Nodes</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Edges</span>
                  <span className="font-medium">{edges.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Connections</span>
                  <span className="font-medium">
                    {nodes.length > 0 ? ((edges.length * 2) / nodes.length).toFixed(1) : "0"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
