import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Graphzy from './pages/Graphzy';
import GraphzyDetails from './pages/GraphzyDetails';
import Forkline from './pages/Forkline';
import Services from './pages/Services';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Lattice from './pages/Lattice';
import Clampbox from './pages/Clampbox';
import Products from './pages/Products';
import ProcessPage from './pages/ProcessPage';
import About from './pages/About';
import Careers from './pages/Careers';

// Clampbox Console Pages
import CbDashboard from '../clampbox/web/Dashboard';
import CbPolicies from '../clampbox/web/Policies';
import CbGateways from '../clampbox/web/Gateways';
import CbKeys from '../clampbox/web/Keys';
import CbAuditLogs from '../clampbox/web/AuditLogs';
import CbVault from '../clampbox/web/Vault';
import CbSettings from '../clampbox/web/Settings';
import CbOnboarding from '../clampbox/web/Onboarding';
import CbDocs from '../clampbox/web/Docs';

function MainApp() {
  const location = useLocation();
  const isVisualizer = location.pathname === '/graphzy/visualizer';
  const isConsole = location.pathname.startsWith('/clampbox/');
  const hideGlobalLayout = isVisualizer || isConsole;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      {!hideGlobalLayout && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/clampbox" element={<Clampbox />} />
          <Route path="/graphzy" element={<GraphzyDetails />} />
          <Route path="/graphzy/visualizer" element={<Graphzy />} />
          <Route path="/clampbox" element={<Clampbox />} />
          <Route path="/clampbox/onboarding" element={<Navigate to="/clampbox/dashboard" replace />} />
          <Route path="/clampbox/dashboard" element={<CbDashboard />} />
          <Route path="/clampbox/policies" element={<CbPolicies />} />
          <Route path="/clampbox/gateways" element={<CbGateways />} />
          <Route path="/clampbox/keys" element={<CbKeys />} />
          <Route path="/clampbox/audit" element={<CbAuditLogs />} />
          <Route path="/clampbox/vault" element={<CbVault />} />
          <Route path="/clampbox/settings" element={<CbSettings />} />
          <Route path="/clampbox/docs" element={<CbDocs />} />
          <Route path="/forkline" element={<Forkline />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/lattice" element={<Lattice />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </div>
      {!hideGlobalLayout && <Footer />}
    </div>
  );
}

import ScrollToTop from './components/layout/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainApp />
      <Analytics />
    </Router>
  );
}
