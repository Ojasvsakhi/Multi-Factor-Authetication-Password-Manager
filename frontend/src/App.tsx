import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import PasswordVault from './pages/PasswordVault';
import EncryptionSettings from './pages/EncryptionSettings';
import { ParticlesBackground } from './components/ParticlesBackground';
import { HexGrid } from './components/HexGrid';
import { RippleEffect } from './components/RippleEffect';
import { MatrixRain } from './components/MatrixRain';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <MatrixRain />
        <ParticlesBackground />
        <HexGrid />
        <RippleEffect />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/verify" element={<OTPVerification />} />
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