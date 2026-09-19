import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-trinetra-border bg-[#070707] text-neutral-400 py-12">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-trinetra-saffron" />
              <span className="font-display text-lg text-neutral-100 font-semibold tracking-wider">
                TRINETRA AI
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
              Autonomous geopolitical and strategic intelligence framework. Data, analytical logic, user interface, and AI reasoning operate in strictly isolated, verifiable tiers.
            </p>
            <div className="font-mono text-xs text-neutral-500">
              Evidence Policy: No simulated or fabricated intelligence. Missing metrics render as unavailable.
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-200 mb-3">
              Strategic Domains
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/countries" className="hover:text-trinetra-saffron transition-colors">
                  Country Dossiers
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-trinetra-saffron transition-colors">
                  Bilateral Rivalry Matrix
                </Link>
              </li>
              <li>
                <Link to="/network" className="hover:text-trinetra-saffron transition-colors">
                  Strategic Network Graph
                </Link>
              </li>
              <li>
                <Link to="/groups" className="hover:text-trinetra-saffron transition-colors">
                  Multilateral Alliances
                </Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-trinetra-saffron transition-colors">
                  Intelligence Modules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-trinetra-saffron transition-colors">
                  Architecture & Evidence
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-trinetra-saffron transition-colors">
                  Semantic Search Engine
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-trinetra-saffron transition-colors">
                  Operations & Briefings
                </Link>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  System Health API <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-trinetra-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div>
            TRINETRA AI Strategic Intelligence System © {new Date().getFullYear()}. All intelligence dossiers verified against canonical references.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-emerald-500">SYSTEM SECURE</span>
            <span>DATA TIER v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
