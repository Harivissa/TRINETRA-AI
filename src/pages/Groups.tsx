import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Users, Globe2, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import { api } from "../services/api";

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    api
      .getGroups()
      .then((data) => {
        setGroups(data || []);
        if (data && data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Groups load error:", err);
        setError("Failed to load strategic groups from backend.");
        setLoading(false);
      });
  }, []);

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0] || null;

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <div className="section-kicker">MULTILATERAL ARCHITECTURE</div>
          <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-1">
            Strategic Alliances & Coalitions
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Key multilateral alliances, regional security dialogues, and economic blocs shaping the multipolar order.
          </p>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-950/20 p-6 rounded-md mb-8 text-center text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 animate-pulse bg-trinetra-panel rounded border border-trinetra-border" />
            <div className="h-64 animate-pulse bg-trinetra-panel rounded border border-trinetra-border md:col-span-2" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Group Navigation Column */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block mb-2">
                Alliances & Coalitions ({groups.length})
              </span>
              {groups.map((group) => {
                const isSelected = activeGroup?.id === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full p-4 rounded-md border text-left transition-all ${
                      isSelected
                        ? "border-trinetra-saffron bg-trinetra-panel text-white shadow-lg"
                        : "border-trinetra-border bg-black/20 text-neutral-300 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-xl font-medium">{group.name}</span>
                      <span className="font-mono text-xs text-neutral-500">
                        {group.members?.length || 0} States
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {group.description || group.strategic_purpose || "Strategic security coalition"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Group Dossier */}
            <div className="lg:col-span-2 border border-trinetra-border bg-trinetra-panel p-6 sm:p-8 rounded-lg">
              {activeGroup ? (
                <div className="space-y-8">
                  <div className="border-b border-trinetra-border pb-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-trinetra-saffron mb-1">
                      <ShieldCheck className="size-4" /> Strategic Bloc Dossier
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-neutral-100">
                      {activeGroup.name}
                    </h2>
                    <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                      {activeGroup.description || activeGroup.strategic_purpose || "Strategic alliance"}
                    </p>
                  </div>

                  {/* Strategic Focus */}
                  {activeGroup.focus && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
                        Core Focus Areas
                      </h4>
                      <p className="text-sm text-neutral-300 bg-black/30 p-4 rounded border border-trinetra-border/60">
                        {activeGroup.focus}
                      </p>
                    </div>
                  )}

                  {/* Members Grid */}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center justify-between">
                      <span>Participating States ({activeGroup.members?.length || 0})</span>
                      <span className="text-[11px] text-neutral-500">Click state to view dossier</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(activeGroup.members || []).map((m: string) => (
                        <Link
                          key={m}
                          to={`/country?id=${m}`}
                          className="group p-3 border border-trinetra-border rounded bg-black/30 hover:border-trinetra-saffron transition-colors flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <span className="font-mono text-xs text-trinetra-saffron block">
                              {m}
                            </span>
                            <span className="text-xs text-neutral-300 font-medium truncate block">
                              {m} State
                            </span>
                          </div>
                          <ArrowRight className="size-3 text-neutral-500 group-hover:text-trinetra-saffron group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-neutral-500 py-16">
                  Select an alliance or strategic group to review composition.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
