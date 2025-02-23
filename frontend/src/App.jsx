import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpFlow from './components/OtpFlow';
import Dashboard from './components/DashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpFlow />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;