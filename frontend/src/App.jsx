import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PersistentDrawerRight from "../components/navbar";
import Map from "../components/Map";
import Home from "../components/Home";
import Marketplace from "../components/Marketplace";
import GovtSchemes from "../components/GovtSchemes";
function App() {
  const updatePage = (text) => {
    setPage(text);
  };
  return (
    <>
      <PersistentDrawerRight changePage={updatePage} />
      <div className="hero">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Profile Page Route */}
          <Route path="/govtschemes" element={<GovtSchemes />} />
          {/* Add any other routes you need */}
          <Route path="/analyseplant" element={<Map />} />
          <Route path="/pestpurchase" element={<Map />} />
          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
