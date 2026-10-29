import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Shield, Stethoscope, User, Heart, PhoneCall } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: <Shield size={14} className="text-[#005A5B]" />,
          avatar: '🛡️',
          badge: 'bg-slate-100 border-slate-300 text-slate-800'
        };
      case 'DOCTOR':
        return {
          icon: <Stethoscope size={14} className="text-[#005A5B]" />,
          avatar: '🩺',
          badge: 'bg-slate-100 border-slate-300 text-slate-800'
        };
      default:
        return {
          icon: <User size={14} className="text-[#F26522]" />,
          avatar: '🧑‍⚕️',
          badge: 'bg-orange-50 border-orange-200 text-[#F26522]'
        };
    }
  };

  const roleMeta = user ? getRoleStyle(user.role) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#005A5B] to-[#007A7B] flex items-center justify-center shadow-md shadow-[#005A5B]/20 group-hover:scale-105 transition-transform">
            <Heart className="text-white fill-white/20" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#005A5B] group-hover:text-[#F26522] transition-colors">
                CURIX
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#F26522] animate-ping" />
            </div>
            <p className="text-[11px] tracking-wider text-slate-500 uppercase font-bold">
              Healthcare Ecosystem
            </p>
          </div>
        </a>

        {/* Updated Nav Links: Home, Services, About Us */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
          <a href="#home" className="hover:text-[#F26522] transition-colors">
            Home
          </a>
          <a href="#services" className="hover:text-[#F26522] transition-colors">
            Services
          </a>
          <a href="#about" className="hover:text-[#F26522] transition-colors">
            About Us
          </a>
        </div>

        {/* Right Action Button & Helpline */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
            <PhoneCall size={14} className="text-[#F26522]" />
            <span>24/7 Helpline: <strong className="text-slate-900 font-mono">1800-CURIX-CARE</strong></span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm shadow-xs">
                <span className="text-base flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-xs border border-slate-100">
                  {roleMeta?.avatar}
                </span>
                <span className="text-slate-900 font-bold max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-extrabold uppercase tracking-wider ${roleMeta?.badge}`}>
                  {roleMeta?.icon}
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all transform active:scale-95"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#F26522] hover:bg-[#D95316] active:bg-[#C2460F] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#F26522]/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn size={17} />
              <span>Register / Login</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}