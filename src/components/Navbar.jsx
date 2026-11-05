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
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
        
        {/* Curix Brand Logo */}
        <a href="#home" className="inline-flex items-center group transition-transform duration-300 hover:scale-[1.02]">
          <CurixLogo size="md" showSubtitle={true} light={false} />
        </a>

        {/* Center Navigation Links with Modern Pill Hover */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-50/90 border border-slate-200/70 shadow-2xs">
          <a
            href="#home"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Home
          </a>
          <a
            href="#doctors"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Doctors
          </a>
          <a
            href="#services"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Services
          </a>
          <a
            href="#why-us"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Why Choose Us
          </a>
          <a
            href="#reviews"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Reviews
          </a>
          <a
            href="#articles"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-white hover:shadow-2xs transition-all duration-200"
          >
            Articles
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
                <span className="w-7 h-7 rounded-full bg-[#E6F8F3] flex items-center justify-center text-xs">
                  {roleMeta?.avatar}
                </span>
                <span className="text-[#0C233C] font-extrabold text-xs max-w-[110px] truncate">
                  {user.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] border font-black uppercase tracking-wider ${roleMeta?.badge}`}>
                  {user.role}
                </span>
              </div>

              <a
                href="#doctors"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-curix-primary text-xs font-bold shadow-md shadow-[#00A884]/20 cursor-pointer"
              >
                <span>Book Slot</span>
              </a>

              <button
                type="button"
                onClick={logout}
                title="Sign out of Curix"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all duration-200 cursor-pointer"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-[#00A884] hover:bg-slate-100 transition cursor-pointer"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full btn-curix-primary text-xs font-black tracking-wide cursor-pointer shadow-md shadow-[#00A884]/20"
              >
                <span>Book Appointment</span>
              </button>
            </div>
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
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Home
          </a>
          <a
            href="#doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Doctors
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Services
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Why Choose Us
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Reviews
          </a>
          <a
            href="#articles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#00A884]"
          >
            Health Articles
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
