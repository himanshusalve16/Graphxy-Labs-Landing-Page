import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import LogoSvg from '../../assets/Logo.svg?react';

export default function Footer() {
  return (
    <footer className="py-10 bg-[#FAFAF8] border-t border-black/[0.06] mt-auto">
      <Container className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <Link to="/" className="font-serif text-base font-medium tracking-tight flex items-center gap-2.5 text-[#0F0F0F] no-underline mb-2 group">
            <LogoSvg
              aria-hidden="true"
              className="w-7 h-7 flex-shrink-0 transition-opacity duration-200 group-hover:opacity-70"
            />
            <span>Graphxy Labs</span>
          </Link>
          <p className="text-[10px] font-mono font-semibold tracking-wider uppercase text-black/35 mb-0.5">Engineering Studio</p>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link to="/" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Home</Link>
          <Link to="/services" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Services</Link>
          <Link to="/products" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Products</Link>
          <Link to="/contact" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Contact</Link>
          <Link to="/privacy-policy" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline font-medium">Terms of Service</Link>
        </div>
      </Container>
      
      <Container className="mt-8 pt-6 border-t border-black/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-black/40">
        <div>
          &copy; 2026 Graphxy Labs. All rights reserved.
        </div>
        <div className="opacity-60">
          Designed & Engineered with Restraint
        </div>
      </Container>
    </footer>
  );
}
