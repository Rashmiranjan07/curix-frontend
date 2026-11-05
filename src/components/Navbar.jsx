import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CurixLogo from './CurixLogo';
import { LogIn, LogOut, Shield, Stethoscope, User, Menu, X, PhoneCall, ChevronRight } from 'lucide-react';

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
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
        
        {/* Curix Brand Logo */}
        <a href="#home" className="inline-flex items-center group transition-transform duration-300 hover:scale-[1.02]">
          <CurixLogo size="md" showSubtitle={true} light={false} />
        </a>

        {/* Center Navigation Links with Modern Pill Hover */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-50/80 border border-slate-200/60 shadow-2xs">
          <a
            href="#home"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Home
          </a>
          <a
            href="#about"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            About Us
          </a>
          <a
            href="#centres-of-excellence"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Centres of Excellence
          </a>
          <a
            href="#specialties"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Doctors
          </a>
          <a
            href="#security"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A896] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Security & Compliance
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E6F8F5] flex items-center justify-center text-xs">
                  {roleMeta?.avatar}
                </span>
                <span className="text-[#0A1C35] font-extrabold text-[11px] sm:text-xs max-w-[80px] sm:max-w-[110px] truncate">
                  {user.name}
                </span>
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9px] border font-black uppercase tracking-wider ${roleMeta?.badge}`}>
                  {user.role}
                </span>
              </div>

              <a
                href="#specialties"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-curix-primary text-xs font-bold shadow-md shadow-[#00A896]/20 cursor-pointer"
              >
                <span>Book Slot</span>
              </a>

              <button
                type="button"
                onClick={logout}
                title="Sign out of Curix"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full btn-curix-primary text-[11px] sm:text-xs font-black tracking-wide cursor-pointer shadow-md shadow-[#00A896]/20 whitespace-nowrap"
              >
                <LogIn size={13} />
                <span><span className="hidden sm:inline">Portal Access / </span>Login</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#0A1C35] hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F8F5]/60 hover:text-[#00A896] transition"
            >
              <span>Home</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F8F5]/60 hover:text-[#00A896] transition"
            >
              <span>About Us</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a
              href="#centres-of-excellence"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F8F5]/60 hover:text-[#00A896] transition"
            >
              <span>Centres of Excellence</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a
              href="#specialties"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F8F5]/60 hover:text-[#00A896] transition"
            >
              <span>Doctors & Faculty</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F8F5]/60 hover:text-[#00A896] transition"
            >
              <span>Security & Compliance</span>
              <ChevronRight size={14} className="text-slate-400" />
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:18002874922"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <PhoneCall size={13} className="text-[#00A896]" />
              <span>Call 24/7 Medical Care</span>
            </a>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-curix-primary text-xs font-extrabold text-white shadow-md shadow-[#00A896]/20 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Portal Access / Login</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Logout ({user.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
