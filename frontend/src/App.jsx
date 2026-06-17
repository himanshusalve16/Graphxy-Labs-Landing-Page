import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Graphzy from './pages/Graphzy';
import Forkline from './pages/Forkline';
import Services from './pages/Services';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Lattice from './pages/Lattice';
import Products from './pages/Products';

function MainApp() {
  const location = useLocation();
  const isGraphzy = location.pathname.startsWith('/graphzy');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/graphzy" element={<Graphzy />} />
          <Route path="/forkline" element={<Forkline />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/lattice" element={<Lattice />} />
        </Routes>
      </div>
      {!isGraphzy && <Footer />}
    </div>
  );
}

import ScrollToTop from './components/layout/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainApp />
    </Router>
  );
}
