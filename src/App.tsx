import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RivalryAnalysis from "./pages/RivalryAnalysis";
import CountryIntelligence from "./pages/CountryIntelligence";
import CountriesGrid from "./pages/CountriesGrid";
import About from "./pages/About";
import Modules from "./pages/Modules";
import NetworkView from "./pages/NetworkView";
import Contact from "./pages/Contact";
import SearchPage from "./pages/Search";
import Groups from "./pages/Groups";
import EntryExperience from "./components/entry/EntryExperience";

export default function App() {
  const [entryComplete, setEntryComplete] = useState(false);
  return (
    <BrowserRouter>
      {!entryComplete && <EntryExperience onComplete={() => setEntryComplete(true)} />}
      {entryComplete && <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<RivalryAnalysis />} />
        <Route path="/compare" element={<RivalryAnalysis />} />
        <Route path="/countries" element={<CountriesGrid />} />
        <Route path="/country" element={<CountryIntelligence />} />
        <Route path="/about" element={<About />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/network" element={<NetworkView />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>}
    </BrowserRouter>
  );
}
