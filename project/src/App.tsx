import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CampaignEditor from './pages/CampaignEditor';
import SubscriberManagement from './pages/SubscriberManagement';
import Analytics from './pages/Analytics';
import Templates from './pages/Templates';
import Automation from './pages/Automation';
import Integration from './pages/Integration';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns/*" element={<CampaignEditor />} />
            <Route path="/subscribers" element={<SubscriberManagement />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;