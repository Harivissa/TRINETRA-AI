import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RivalryAnalysis from "./pages/RivalryAnalysis";
import CountryIntelligence from "./pages/CountryIntelligence";
import CountriesGrid from "./pages/CountriesGrid";
import About from "./pages/About";
import Modules from "./pages/Modules";
import NetworkView from "./pages/NetworkView";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<RivalryAnalysis />} />
        <Route path="/countries" element={<CountriesGrid />} />
        <Route path="/country" element={<CountryIntelligence />} />
        <Route path="/about" element={<About />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/network" element={<NetworkView />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
