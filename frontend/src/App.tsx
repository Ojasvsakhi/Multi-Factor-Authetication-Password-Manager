import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrimaryLogin from "./pages/PrimaryLogin";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PasswordVault from "./pages/PasswordVault";
import EncryptionSettings from "./pages/EncryptionSettings";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { HexGrid } from "./components/HexGrid";
import { RippleEffect } from "./components/RippleEffect";
import { MatrixRain } from "./components/MatrixRain";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <Router>
      <SpeedInsights />
      <div className="min-h-screen bg-black overflow-hidden relative">
        {/* Background Effects Layer */}
        <div className="fixed inset-0 z-0">
          {isMounted && (
            <>
              <MatrixRain />
              <ParticlesBackground />
              <HexGrid />
              <RippleEffect />
            </>
          )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<PrimaryLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<OTPVerification />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vault" element={<PasswordVault />} />
            <Route path="/settings" element={<EncryptionSettings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;