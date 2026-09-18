import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-trinetra-bg text-neutral-200">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl text-trinetra-saffron mb-4">Contact</h1>
        <p className="text-neutral-400">Trinetra AI — Developed by Hari Vissa</p>
      </main>
      <Footer />
    </div>
  );
}
