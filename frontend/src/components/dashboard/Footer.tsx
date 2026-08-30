import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-trinetra-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="font-display text-lg text-trinetra-saffron">Trinetra AI</div>
          <div className="text-xs text-neutral-600">Geopolitical Intelligence Platform · Demo/research data — see per-country sources</div>
        </div>

        <div className="flex items-center gap-5 text-sm text-neutral-500">
          <span>Developed by <span className="text-neutral-300">Hari Vissa</span></span>
          <a
            href="https://github.com/Harivissa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-trinetra-saffron transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/harivissa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-trinetra-saffron transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
