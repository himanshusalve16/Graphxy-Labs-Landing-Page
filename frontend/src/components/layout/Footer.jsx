import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import LogoSvg from '../../assets/Logo.svg?react';

export default function Footer() {
  return (
    <footer className="py-14 bg-[#FAFAF8] border-t border-black/[0.06] mt-auto">
      <Container className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-12">
        <div className="sm:col-span-2">
          <Link to="/" className="font-serif text-base font-medium tracking-tight flex items-center gap-2.5 text-[#0F0F0F] no-underline mb-3 group">
            <LogoSvg
              aria-hidden="true"
              className="w-8 h-8 flex-shrink-0 transition-opacity duration-200 group-hover:opacity-70"
            />
            <span className="flex items-center gap-1.5">
              Graphxy Labs
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
            </span>
          </Link>
          <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-black/30 mb-2 pl-0.5">Engineering Studio</p>
          <p className="text-xs text-[#A3A3A3] leading-[1.65] max-w-[220px]">
            Building the next generation of visual tools and business systems.
          </p>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] font-semibold tracking-wider uppercase text-black/40 mb-4">Products</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li><Link to="/graphzy" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Graphzy</Link></li>
            <li><Link to="/mesa" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Mesa</Link></li>
            <li><Link to="/ventureflow" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">VentureFlow</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] font-semibold tracking-wider uppercase text-black/40 mb-4">Verticals</h4>
          <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
            <li><Link to="/services#management-systems" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Management Systems</Link></li>
            <li><Link to="/services#web-development" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Web Development</Link></li>
            <li><Link to="/services#mobile-apps" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Mobile App Dev</Link></li>
            <li><Link to="/services#ai-ml" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">AI & Machine Learning</Link></li>
            <li><Link to="/services#data-science" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Data Science & Analytics</Link></li>
            <li><Link to="/services#custom-software" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Custom Software</Link></li>
            <li><Link to="/services#automation" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Automation & Workflow</Link></li>
            <li><Link to="/services#scalable-products" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Scalable Tech Products</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-mono text-[10px] font-semibold tracking-wider uppercase text-black/40 mb-4">Company</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li><Link to="/contact" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Contact</Link></li>
            <li><Link to="/privacy-policy" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-xs text-[#525252] hover:text-[#0F0F0F] no-underline">Terms of Service</Link></li>
          </ul>
        </div>
      </Container>
      
      <Container className="pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[11px] font-mono text-black/40">
          &copy; 2026 Graphxy Labs. All rights reserved.
        </div>
        <div className="text-[11px] font-mono text-black/40 opacity-60">
          Designed & Engineered with Restraint
        </div>
      </Container>
    </footer>
  );
}
