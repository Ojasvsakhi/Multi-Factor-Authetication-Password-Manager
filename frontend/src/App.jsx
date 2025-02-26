import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';  // Add this import
import OtpFlow from './components/OtpFlow';
import Dashboard from './components/DashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Changed this line */}
        <Route path="/verify-otp" element={<OtpFlow />} />  {/* Added this route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;