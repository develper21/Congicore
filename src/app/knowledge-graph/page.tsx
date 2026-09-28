/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Download,
  Network,
  Sparkles,
  Layers,
  Info,
  Maximize2,
} from "lucide-react";
import * as d3 from "d3";

interface Node {
  id: string;
  label: string;
  category?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  value?: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const defaultDemoGraph: GraphData = {
  nodes: [
    { id: "1", label: "Artificial Intelligence", category: "topic" },
    { id: "2", label: "Neural Networks", category: "concept" },
    { id: "3", label: "Transformer Architecture", category: "concept" },
    { id: "4", label: "Attention Mechanism", category: "concept" },
    { id: "5", label: "Knowledge Graphs", category: "topic" },
    { id: "6", label: "Spaced Repetition (SM-2)", category: "entity" },
    { id: "7", label: "Long-Term Memory Vault", category: "entity" },
    { id: "8", label: "Vector Embeddings", category: "concept" },
    { id: "9", label: "Retrieval Augmented Gen (RAG)", category: "topic" },
    { id: "10", label: "Cognitive Load Theory", category: "entity" },
  ],
  links: [
    { source: "1", target: "2" },
    { source: "2", target: "3" },
    { source: "3", target: "4" },
    { source: "3", target: "8" },
    { source: "8", target: "9" },
    { source: "9", target: "5" },
    { source: "5", target: "7" },
    { source: "6", target: "7" },
    { source: "6", target: "10" },
    { source: "4", target: "9" },
    { source: "1", target: "5" },
  ],
};

export default function KnowledgeGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGraphData();
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0 && svgRef.current) {
      renderGraph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch("/api/graph", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch graph data");
      }

      const data = await response.json();
      if (data && data.nodes && data.nodes.length > 0) {
        setGraphData(data);
      } else {
        // Fallback to rich demo graph so the user has immediate value
        setGraphData(defaultDemoGraph);
      }
    } catch {
      // Fallback gracefully to demo graph
      setGraphData(defaultDemoGraph);
    } finally {
      setLoading(false);
    }
  };

  const getNodeColor = (category?: string): string => {
    const colors: Record<string, string> = {
      concept: "#5F2CFF", // Chrome Violet
      entity: "#D6FFCB",  // Mint Foam
      topic: "#0038FF",   // Hyper Cobalt
      vault: "#FFD8B8",   // Skin Sand
      default: "#DFF6FF", // Glass Blue
    };
    return colors[category || ""] || colors.default;
  };

  const renderGraph = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 900;
    const height = 620;

    // Filter glow effect definition
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Grid pattern background
    const pattern = defs
      .append("pattern")
      .attr("id", "grid")
      .attr("width", 40)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse");

    pattern
      .append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "rgba(232, 236, 241, 0.03)")
      .attr("stroke-width", 1);

    svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#grid)");

    // Zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    const g = svg.append("g");

    // Force simulation
    const simulation = d3
      .forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(graphData.links)
          .id((d: d3.SimulationNodeDatum) => (d as Node).id)
          .distance(120)
          .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(95, 44, 255, 0.35)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4 2");

    // Nodes container
    const node = g
      .append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        setSelectedNode(d);
      })
      .call(
        d3
          .drag<SVGGElement, d3.SimulationNodeDatum>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Node outer ambient ring
    node
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d: Node) => getNodeColor(d.category))
      .attr("opacity", 0.2)
      .attr("filter", "url(#glow)");

    // Node main circle
    node
      .append("circle")
      .attr("r", 14)
      .attr("fill", (d: Node) => getNodeColor(d.category))
      .attr("stroke", "#E8ECF1")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.85);

    // Node labels
    node
      .append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-family", "inherit")
      .attr("font-weight", "600")
      .attr("fill", "#E8ECF1")
      .style("text-shadow", "0 2px 4px rgba(2, 22, 24, 0.9)")
      .text((d: Node) => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x || 0)
        .attr("y1", (d: any) => d.source.y || 0)
        .attr("x2", (d: any) => d.target.x || 0)
        .attr("y2", (d: any) => d.target.y || 0);

      node.attr("transform", (d: any) => `translate(${d.x || 0},${d.y || 0})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const handleRefresh = () => {
    fetchGraphData();
  };

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(d3.zoom().scaleBy as any, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(d3.zoom().scaleBy as any, 0.8);
    }
  };

  const handleDownload = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "congicore-knowledge-graph.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mintFoam/15 text-mintFoam border border-mintFoam/30 mb-2 shadow-glow-mint">
                <Network className="h-3.5 w-3.5" /> 3D Semantic Constellation
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-softChrome">
                Knowledge Graph
              </h1>
              <p className="text-xs sm:text-sm text-softChrome/60 mt-0.5">
                Explore dynamic semantic connections between documents, memories, and concepts.
              </p>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5 text-xs border-softChrome/15 text-softChrome hover:text-glassBlue">
                <RefreshCw className="h-3.5 w-3.5" /> Reset View
              </Button>
              <div className="flex items-center rounded-xl border border-softChrome/15 bg-carbonTeal/60 p-0.5">
                <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-lg text-softChrome hover:text-glassBlue">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-lg text-softChrome hover:text-glassBlue">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 text-xs border-softChrome/15 text-softChrome hover:text-glassBlue">
                <Download className="h-3.5 w-3.5" /> Export SVG
              </Button>
            </div>
          </div>

          {/* Interactive Graph Canvas Card */}
          <Card className="relative overflow-hidden border-softChrome/15 bg-carbonTeal-dark/95 shadow-2xl p-0">
            {/* Ambient canvas glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-chromeViolet/15 rounded-full blur-3xl pointer-events-none" />

            <div ref={containerRef} className="w-full h-[620px] relative">
              <svg
                ref={svgRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />

              {/* Selected Node Floating HUD */}
              {selectedNode && (
                <div className="absolute top-4 left-4 p-4 rounded-2xl glass-panel border-softChrome/15 max-w-xs space-y-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-carbonTeal/90">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-softChrome/50">
                      Node Details
                    </span>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-xs text-softChrome/50 hover:text-softChrome"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-softChrome">{selectedNode.label}</h4>
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: getNodeColor(selectedNode.category) }}
                    />
                    <span className="text-xs text-softChrome/70 capitalize font-medium">
                      {selectedNode.category || "concept"} node
                    </span>
                  </div>
                  <p className="text-[11px] text-softChrome/60 leading-relaxed pt-1">
                    Connected across semantic vector clusters in your knowledge vault.
                  </p>
                </div>
              )}

              {/* Floating Legend */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3.5 py-2 rounded-xl glass-panel border-softChrome/10 text-xs bg-carbonTeal/80">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-chromeViolet shadow-glow-violet" />
                  <span className="text-softChrome/70">Concept</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-hyperCobalt shadow-glow-cobalt" />
                  <span className="text-softChrome/70">Topic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-mintFoam shadow-glow-mint" />
                  <span className="text-softChrome/70">Entity</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    </AuthGuard>
  );
}
