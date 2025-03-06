import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import PersistentDrawerRight from "../components/navbar";
import Maps from "../components/Maps";
import Home from "../components/Home";
import Marketplace from "../components/Marketplace";
import GovtSchemes from "../components/GovtSchemes";
import AnalysePlant from "../components/AnalysePlant";
import PestPurchase from "../components/PestPurchase";
import Contacts from "../components/Contacts";
function App() {
  const updatePage = (text) => {
    setPage(text);
  };
  return (
    <>
      <PersistentDrawerRight changePage={updatePage} />
      <div className="pages">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Profile Page Route */}
          <Route path="/govtschemes" element={<GovtSchemes />} />
          {/* Add any other routes you need */}
          <Route path="/analyseplant" element={<AnalysePlant />} />
          <Route path="/pestpurchase" element={<PestPurchase />} />
          <Route path="/contacts" element={<Contacts />} />

          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
