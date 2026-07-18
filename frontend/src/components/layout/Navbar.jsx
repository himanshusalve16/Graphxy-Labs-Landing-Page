import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LogoSvg from '../../assets/Logo.svg?react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path || (path.startsWith('/#') && location.pathname === '/' && location.hash === path.slice(1));
  };

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const id = path.slice(2);
      if (location.pathname !== '/') {
        window.location.href = path;
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <nav className={`h-[54px] px-5 md:px-10 flex items-center justify-between sticky top-0 z-[100] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || mobileMenuOpen
          ? 'bg-[#FAFAF8]/92 backdrop-blur-md border-b border-black/[0.06]' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        {/* Brand Wordmark + Logo */}
        <Link 
          to="/" 
          className="font-serif text-base font-medium tracking-tight flex items-center gap-2.5 text-[#0F0F0F] no-underline focus:ring-2 focus:ring-[#EEF3FB] rounded px-1.5 py-0.5 outline-none group"
        >
          <LogoSvg
            aria-hidden="true"
            className="w-7 h-7 flex-shrink-0 transition-opacity duration-200 group-hover:opacity-80"
            style={{ color: '#1B3A6B' }}
          />
          <span>Graphxy Labs</span>
        </Link>
        
        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
          {navLinks.map((link) => (
            <li key={link.label} className="relative flex items-center">
              <Link 
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-xs font-medium no-underline transition-colors flex items-center gap-1 focus:ring-2 focus:ring-[#EEF3FB] rounded px-2 py-1 outline-none min-h-[44px] ${
                  isActive(link.path) ? 'text-[#0F0F0F] font-semibold' : 'text-[#525252] hover:text-[#0F0F0F]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="w-1 h-1 rounded-full bg-[#1B3A6B]" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu trigger — 44×44px touch target */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 rounded-full border border-black/5 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#525252] hover:text-[#0f0f0f] cursor-pointer focus:ring-2 focus:ring-[#EEF3FB] outline-none transition-colors touch-action-manipulation"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            style={{ touchAction: 'manipulation' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[54px] bg-[#FAFAF8]/98 backdrop-blur-md z-[99] md:hidden flex flex-col p-6 animate-fade-in border-t border-black/[0.04]"
          role="dialog"
          aria-modal="true"
        >
          <ul className="flex flex-col gap-2 list-none p-0 m-0 mt-6">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-black/[0.04] last:border-0">
                <Link 
                  to={link.path}
                  onClick={(e) => {
                    handleLinkClick(e, link.path);
                    setMobileMenuOpen(false);
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className={`min-h-[56px] text-xl font-serif no-underline flex items-center justify-between px-2 ${
                    isActive(link.path) ? 'text-[#1B3A6B] font-medium' : 'text-[#525252]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom brand stamp */}
          <div className="mt-auto pt-6 border-t border-black/[0.04] flex items-center gap-2">
            <LogoSvg aria-hidden="true" className="w-5 h-5 opacity-30" />
            <span className="font-mono text-[10px] text-black/30 uppercase tracking-widest">Engineering Studio</span>
          </div>
        </div>
      )}
    </>
  );
}
