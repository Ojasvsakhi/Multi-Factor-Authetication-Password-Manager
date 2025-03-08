import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MasterKeyAuth from './components/MasterKeyAuth';
import Login from './components/Login';
import OtpFlow from './components/OtpFlow';
import Dashboard from './components/DashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MasterKeyAuth />} />  {/* Changed this line */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpFlow />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;