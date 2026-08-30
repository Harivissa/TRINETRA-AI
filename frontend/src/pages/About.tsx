import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1100px] mx-auto px-8 py-16">
        <h1 className="font-display text-4xl text-trinetra-saffron mb-6">About Trinetra AI</h1>
        <p className="text-neutral-300 leading-relaxed mb-4">
          Trinetra connects military, economic, energy, infrastructure, and diplomatic
          systems to study how strategic pressure moves between nations — not only on
          the battlefield, but through supply chains, energy markets, and finance.
        </p>
        <p className="text-neutral-300 leading-relaxed">
          Every country, relationship, and prompt in this system is a standalone data
          file. Updating one nation's profile, adding a new country, or refining the
          AI's analytical instructions never requires touching the analysis engine,
          the API, or the interface.
        </p>
      </main>
      <Footer />
    </div>
  );
}
