import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Share2, Shield, Users, Filter, ArrowRight, Eye, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";

interface NetworkNode {
  id: string;
  label: string;
  type: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  type: "alliance" | "rivalry" | string;
}

export default function NetworkView() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string>("IND");
  const [edgeFilter, setEdgeFilter] = useState<"all" | "alliance" | "rivalry">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadNetwork = () => {
    setLoading(true);
    setError(null);
    api
      .getNetwork()
      .then((data) => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network load error:", err);
        setError("Failed to load strategic network data from backend.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNetwork();
  }, []);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  }, [nodes, selectedNodeId]);

  const filteredEdges = useMemo(() => {
    return edges.filter((edge) => {
      if (edgeFilter !== "all" && edge.type !== edgeFilter) return false;
      return true;
    });
  }, [edges, edgeFilter]);

  const nodeConnections = useMemo(() => {
    if (!selectedNode) return { alliances: [] as string[], rivalries: [] as string[] };
    const alliances = new Set<string>();
    const rivalries = new Set<string>();

    for (const edge of edges) {
      if (edge.source === selectedNode.id) {
        if (edge.type === "alliance") alliances.add(edge.target);
        if (edge.type === "rivalry") rivalries.add(edge.target);
      } else if (edge.target === selectedNode.id) {
        if (edge.type === "alliance") alliances.add(edge.source);
        if (edge.type === "rivalry") rivalries.add(edge.source);
      }
    }

    return {
      alliances: Array.from(alliances),
      rivalries: Array.from(rivalries),
    };
  }, [edges, selectedNode]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase();
    return nodes.filter((n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
  }, [nodes, searchQuery]);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="section-kicker">STRATEGIC GRAPH / TOPOLOGY</div>
            <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-1">
              Geopolitical Network
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              Canonical bilateral alliance structures and adversarial rivalries mapping interconnected state behavior.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="view-switch" role="group" aria-label="Edge filter">
              <button
                aria-selected={edgeFilter === "all"}
                onClick={() => setEdgeFilter("all")}
              >
                All Edges
              </button>
              <button
                aria-selected={edgeFilter === "alliance"}
                onClick={() => setEdgeFilter("alliance")}
              >
                Alliances
              </button>
              <button
                aria-selected={edgeFilter === "rivalry"}
                onClick={() => setEdgeFilter("rivalry")}
              >
                Rivalries
              </button>
            </div>

            <button
              onClick={loadNetwork}
              className="control-button hover:border-trinetra-saffron"
              title="Refresh Network"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync
            </button>
          </div>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-950/20 p-6 rounded-md mb-8 text-center text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Node Grid Selector */}
          <div className="lg:col-span-2 border border-trinetra-border bg-trinetra-panel p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                Network Nodes ({nodes.length})
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter nodes..."
                className="bg-black/50 border border-trinetra-border text-xs px-3 py-1.5 rounded focus:outline-none focus:border-trinetra-saffron text-neutral-200"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-trinetra-saffron bg-trinetra-saffron/10 text-white"
                        : "border-trinetra-border bg-black/30 text-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-neutral-500">{n.id}</span>
                    <span className="font-medium text-xs mt-1 truncate">{n.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Edge Legend */}
            <div className="mt-6 pt-4 border-t border-trinetra-border flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" /> Alliance Tie
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" /> Strategic Rivalry
                </span>
              </div>
              <span className="font-mono text-[11px]">{filteredEdges.length} Active Ties</span>
            </div>
          </div>

          {/* Focused Node Intelligence Card */}
          <div className="border border-trinetra-border bg-trinetra-panel p-6 rounded-lg flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-trinetra-saffron mb-1">
                    Focused Node
                  </div>
                  <h2 className="font-display text-3xl text-neutral-100">
                    {selectedNode.label}
                  </h2>
                  <span className="font-mono text-xs text-neutral-500">
                    ISO Code: {selectedNode.id}
                  </span>
                </div>

                {/* Alliances List */}
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-emerald-400 mb-2">
                    <Users className="size-3.5" /> Alliances ({nodeConnections.alliances.length})
                  </div>
                  {nodeConnections.alliances.length === 0 ? (
                    <div className="text-xs text-neutral-500 italic">No formal alliances recorded in primary dataset.</div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {nodeConnections.alliances.map((allyId) => {
                        const ally = nodes.find((n) => n.id === allyId);
                        return (
                          <button
                            key={allyId}
                            onClick={() => setSelectedNodeId(allyId)}
                            className="text-xs font-mono px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition-colors"
                          >
                            {ally ? ally.label : allyId}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Rivalries List */}
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-rose-400 mb-2">
                    <Shield className="size-3.5" /> Strategic Rivals ({nodeConnections.rivalries.length})
                  </div>
                  {nodeConnections.rivalries.length === 0 ? (
                    <div className="text-xs text-neutral-500 italic">No active structural rivalries recorded.</div>
                  ) : (
                    <div className="space-y-2">
                      {nodeConnections.rivalries.map((rivalId) => {
                        const rival = nodes.find((n) => n.id === rivalId);
                        return (
                          <div
                            key={rivalId}
                            className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-500/30 text-xs"
                          >
                            <span className="text-neutral-200 font-medium">
                              {rival ? rival.label : rivalId}
                            </span>
                            <Link
                              to={`/compare?a=${selectedNode.id}&b=${rivalId}`}
                              className="text-rose-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              Analyze Rivalry →
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-trinetra-border">
                  <Link
                    to={`/country?id=${selectedNode.id}`}
                    className="w-full py-2.5 rounded border border-trinetra-border text-center text-xs text-neutral-200 hover:border-trinetra-saffron hover:text-trinetra-saffron transition-colors block"
                  >
                    View Complete {selectedNode.label} Dossier →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-500 py-12">
                Select a nation node to inspect network connectivity.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
