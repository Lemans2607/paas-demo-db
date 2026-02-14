import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudentPage from './pages/Student';
import SMEPage from './pages/SME';
import AdminPage from './pages/Admin';
import StudioPage from './pages/Studio';
import BrainPage from './pages/Brain';
import FAQPage from './pages/FAQ';
import LegalPage from './pages/Legal';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<StudentPage />} />
          <Route path="/business" element={<SMEPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/brain" element={<BrainPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;