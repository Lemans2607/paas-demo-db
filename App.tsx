import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudentPage from './pages/Student';
import SMEPage from './pages/SME';
import AdminPage from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<StudentPage />} />
          <Route path="/business" element={<SMEPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
