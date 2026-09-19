import { useState } from "react";
import { Send, Shield, Mail, CheckCircle, Terminal } from "lucide-react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    subject: "Strategic Briefing Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-10 text-center sm:text-left">
          <div className="section-kicker">STRATEGIC OPERATIONS / LIAISON</div>
          <h1 className="font-display text-4xl sm:text-5xl text-neutral-100 mt-2 mb-4">
            Operations & Research Liaison
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            Inquire regarding custom bilateral models, geopolitical dataset contributions, or institutional briefings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Inquiry Form */}
          <div className="md:col-span-2 border border-trinetra-border bg-trinetra-panel p-6 sm:p-8 rounded-lg">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="size-12 text-emerald-400 mx-auto" />
                <h3 className="font-display text-2xl text-neutral-100">
                  Briefing Request Dispatched
                </h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                  Your inquiry has been logged in the operations registry. Our research team will review your parameters.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded border border-trinetra-border text-xs text-neutral-300 hover:border-trinetra-saffron"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                      Name / Call Sign
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. A. Varma"
                      className="w-full bg-black/40 border border-trinetra-border rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-trinetra-saffron"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                      Institution / Think Tank
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Centre for Strategic Studies"
                      className="w-full bg-black/40 border border-trinetra-border rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-trinetra-saffron"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="analyst@domain.org"
                    className="w-full bg-black/40 border border-trinetra-border rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-trinetra-saffron"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                    Subject Domain
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/40 border border-trinetra-border rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-trinetra-saffron"
                  >
                    <option value="Strategic Briefing Inquiry">Strategic Briefing Inquiry</option>
                    <option value="Bilateral Dataset Contribution">Bilateral Dataset Contribution</option>
                    <option value="Chokepoint Security Assessment">Chokepoint Security Assessment</option>
                    <option value="Academic Collaboration">Academic Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                    Briefing Details & Scope
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Outline theatre requirements, actors involved, or data verification requests..."
                    className="w-full bg-black/40 border border-trinetra-border rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-trinetra-saffron resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-trinetra-saffron text-black font-semibold text-xs hover:bg-trinetra-saffronDim transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="size-3.5" />
                  Transmit Briefing Request
                </button>
              </form>
            )}
          </div>

          {/* Secure Registry Details */}
          <div className="space-y-6">
            <div className="border border-trinetra-border bg-trinetra-panel p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-trinetra-saffron">
                <Terminal className="size-4" /> Secure Channel
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All communications and empirical submissions are verified according to peer-reviewed methodology and public intelligence standards.
              </p>

              <div className="pt-2 border-t border-trinetra-border text-xs text-neutral-400 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-neutral-500" />
                  <span>ops@trinetra.ai</span>
                </div>
                <div className="font-mono text-[10px] text-neutral-500">
                  PGP: 4A8F 90C1 22E0 BB45
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
