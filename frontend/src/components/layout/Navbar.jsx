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

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path || (path.startsWith('/#') && location.pathname === '/' && location.hash === path.slice(1));
  };

  const navLinks = [
    { label: 'Verticals', path: '/services' },
    { label: 'Products', path: '/products' },
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
      <nav className={`h-[54px] px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
          <span className="flex items-center gap-1.5">
            Graphxy Labs
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
          </span>
        </Link>
        
        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
          {navLinks.map((link) => (
            <li key={link.label} className="relative flex items-center">
              <Link 
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`text-xs font-medium no-underline transition-colors flex items-center gap-1 focus:ring-2 focus:ring-[#EEF3FB] rounded px-2 py-1 outline-none ${
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

        {/* Mobile menu trigger */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 rounded-full border border-black/5 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#525252] hover:text-[#0f0f0f] cursor-pointer focus:ring-2 focus:ring-[#EEF3FB] outline-none transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[54px] bg-[#FAFAF8]/98 backdrop-blur-md z-45 md:hidden flex flex-col p-6 animate-fade-in border-t border-black/[0.04]"
          role="dialog"
          aria-modal="true"
        >
          <ul className="flex flex-col gap-6 list-none p-0 m-0 mt-8">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-black/[0.04] pb-4 last:border-0">
                <Link 
                  to={link.path}
                  onClick={(e) => {
                    handleLinkClick(e, link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xl font-serif no-underline flex items-center justify-between ${
                    isActive(link.path) ? 'text-[#1B3A6B] font-medium' : 'text-[#525252]'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
