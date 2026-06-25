import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Network, 
  Key, 
  FileText, 
  Lock, 
  Settings as SettingsIcon,
  Menu,
  X,
} from 'lucide-react';
import LogoSvg from '../../src/assets/Logo.svg?react';

export default function CbLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      title: 'Console',
      items: [
        { label: 'Overview', path: '/clampbox/dashboard', icon: LayoutDashboard },
        { label: 'Policies', path: '/clampbox/policies', icon: ShieldAlert },
        { label: 'Gateways', path: '/clampbox/gateways', icon: Network },
        { label: 'Gateway Keys', path: '/clampbox/keys', icon: Key },
      ]
    },
    {
      title: 'Governance',
      items: [
        { label: 'Audit Logs', path: '/clampbox/audit', icon: FileText },
        { label: 'Vault', path: '/clampbox/vault', icon: Lock },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Settings', path: '/clampbox/settings', icon: SettingsIcon },
      ]
    }
  ];

  const allItems = navSections.flatMap(section => section.items);
  const currentItem = allItems.find(item => item.path === location.pathname) || allItems[0];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-zinc-700 font-sans border-r border-zinc-200 relative overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-zinc-100 flex items-center gap-3 relative z-10">
        <LogoSvg
          aria-hidden="true"
          className="w-7 h-7 flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="font-serif text-sm font-semibold tracking-wide text-zinc-900 leading-tight">Clampbox</span>
          <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest leading-none mt-0.5">by Graphxy Labs</span>
        </div>
      </div>

      {/* Workspace Status */}
      <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Workspace Active</span>
        </div>
        <span className="text-[8px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 uppercase">V1.0 MVP</span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-5 overflow-y-auto relative z-10">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 block">
              {section.title}
            </span>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all outline-none group nav-focus ${
                    isActive
                      ? 'text-[#0D9488] bg-teal-50'
                      : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-line"
                      className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#0D9488] rounded-r"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={15}
                    className={isActive ? 'text-[#0D9488]' : 'text-zinc-400 group-hover:text-zinc-600'}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAFAF8] text-zinc-900 overflow-hidden font-sans relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-white text-zinc-900 border-b border-zinc-200 px-5 flex items-center justify-between sticky top-0 z-[90]">
          <div className="flex items-center gap-2.5">
            <LogoSvg
              aria-hidden="true"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="font-serif text-sm font-semibold tracking-wide text-zinc-900">Clampbox</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{currentItem.label}</span>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-500 hover:text-zinc-900 rounded border border-zinc-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-0 top-14 bg-zinc-900/20 backdrop-blur-sm z-[80] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div 
                className="w-60 h-full bg-white" 
                onClick={e => e.stopPropagation()}
              >
                {sidebarContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Console Page Content */}
        <main className="flex-1 min-w-0 bg-[#FAFAF8] relative overflow-hidden min-h-screen">
          {/* Animated Radial Glows */}
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-[#0D9488]/10 to-transparent blur-3xl pointer-events-none rounded-full animate-glow-1" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#1B3A6B]/10 to-transparent blur-3xl pointer-events-none rounded-full animate-glow-2" />
          
          {/* Grid Lines Overlay - Matching Graphxy Homepage 20px intervals */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Procedural Noise Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.012
          }} />

          {/* Page Content */}
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
