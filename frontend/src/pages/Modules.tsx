import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

const MODULES = [
  "Military", "Economy", "Energy", "Infrastructure", "Trade",
  "Technology", "Geopolitics", "Scenarios",
];

export default function Modules() {
  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-[1400px] mx-auto px-8 py-16">
        <h1 className="font-display text-4xl text-trinetra-saffron mb-8">Analysis Modules</h1>
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map((m) => (
            <div key={m} className="border border-trinetra-border rounded p-6 bg-trinetra-panel">
              <div className="font-display text-xl text-trinetra-saffron">{m}</div>
              <div className="text-sm text-neutral-500 mt-1">Independent engine — swappable without touching the rest of the platform.</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
