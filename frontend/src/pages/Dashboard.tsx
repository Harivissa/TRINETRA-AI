import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";
import StatRow from "../components/dashboard/StatRow";
import { api } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [countryCount, setCountryCount] = useState<number | null>(null);

  useEffect(() => {
    api.getCountries().then((c) => setCountryCount(c.length)).catch(() => setCountryCount(null));
  }, []);

  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />

      <main className="max-w-[1800px] mx-auto px-8">
        <section className="text-center pt-20 pb-14">
          <h1 className="font-display text-6xl text-trinetra-saffron mb-6">
            The Third Eye of Global Intelligence
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Structured, layered geopolitical analysis across military, economic, energy,
            infrastructure, and diplomatic dimensions — connecting how strategic pressure
            moves from the battlefield to the balance sheet.
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => navigate("/country")}
              className="bg-trinetra-saffron text-black font-semibold px-6 py-3 rounded hover:bg-trinetra-saffronDim transition-colors"
            >
              Explore a Nation
            </button>
            <button
              onClick={() => navigate("/network")}
              className="border border-trinetra-border text-trinetra-saffron px-6 py-3 rounded hover:border-trinetra-saffron transition-colors"
            >
              Global Map
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="border border-trinetra-border text-neutral-400 px-6 py-3 rounded hover:border-trinetra-saffron hover:text-trinetra-saffron transition-colors"
            >
              Compare Two Nations
            </button>
          </div>
        </section>

        <StatRow
          stats={[
            { value: String(countryCount ?? "20"), label: "Nations" },
            { value: "8", label: "Analysis Modules" },
            { value: "Demo", label: "Data Mode" },
            { value: "Live", label: "Engine" },
          ]}
        />

        <section className="py-16">
          <h2 className="font-display text-3xl text-trinetra-saffron mb-6">About Trinetra AI</h2>
          <div className="border border-trinetra-border border-l-4 border-l-trinetra-saffron rounded p-8 bg-trinetra-panel text-neutral-300 leading-relaxed">
            Trinetra AI is a geopolitical intelligence platform for research and public
            awareness. It studies strategic competition between nations — not only military
            balance, but how pressure moves through energy, infrastructure, trade, and
            economic systems. Every country and relationship is modular data; adding a
            nation or updating a fact never requires touching the analysis engine or the
            interface. Current data is clearly-marked demo data pending sourced datasets.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
