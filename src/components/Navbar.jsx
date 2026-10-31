import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CurixLogo from './CurixLogo';
import { LogIn, LogOut, Shield, Stethoscope, User, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: <Shield size={14} className="text-[#00A896]" />,
          avatar: '🛡️',
          badge: 'bg-[#E6F8F5] border-[#00A896]/30 text-[#00A896]'
        };
      case 'DOCTOR':
        return {
          icon: <Stethoscope size={14} className="text-[#00A896]" />,
          avatar: '🩺',
          badge: 'bg-[#E6F8F5] border-[#00A896]/30 text-[#00A896]'
        };
      default:
        return {
          icon: <User size={14} className="text-[#0A1C35]" />,
          avatar: '🧑‍⚕️',
          badge: 'bg-slate-100 border-slate-200 text-[#0A1C35]'
        };
    }
  };

  const roleMeta = user ? getRoleStyle(user.role) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Curix Brand Logo */}
        <a href="#home" className="inline-flex items-center group transition-transform duration-300 hover:scale-[1.02]">
          <CurixLogo size="md" showSubtitle={true} light={false} />
        </a>

        {/* Center Navigation Links with Modern Pill Hover */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-50/80 border border-slate-200/60 shadow-2xs">
          <a
            href="#home"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Home
          </a>
          <a
            href="#services"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Clinical Services
          </a>
          <a
            href="#about"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            About Us
          </a>
          <a
            href="#security"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Compliance & Security
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Support Badge (Desktop) */}
          <a
            href="tel:18002874922"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-600 hover:text-[#00A896] bg-slate-50 border border-slate-200/60 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <PhoneCall size={12} className="text-[#00A896]" />
            <span>24/7 Medical Care</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <span className="w-7 h-7 rounded-full bg-[#E6F8F5] flex items-center justify-center text-xs">
                  {roleMeta?.avatar}
                </span>
                <span className="text-[#0A1C35] font-extrabold text-xs max-w-[110px] truncate">
                  {user.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] border font-black uppercase tracking-wider ${roleMeta?.badge}`}>
                  {user.role}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign out of Curix"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full btn-curix-primary text-xs font-extrabold tracking-wide cursor-pointer"
            >
              <LogIn size={14} className="stroke-[2.5]" />
              <span>Portal Access / Login</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#0A1C35] hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A896]"
          >
            Home
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A896]"
          >
            Clinical Services
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A896]"
          >
            About Us
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A896]"
          >
            Security & Compliance
          </a>
        </div>
      )}
    </nav>
  );
}
