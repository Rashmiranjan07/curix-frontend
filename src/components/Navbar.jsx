import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, LogOut, Shield, Stethoscope, User, Heart } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: <Shield size={13} className="text-[#005A5B]" />,
          avatar: '🛡️',
          badge: 'bg-[#EBF5F5] border-[#005A5B]/20 text-[#005A5B]'
        };
      case 'DOCTOR':
        return {
          icon: <Stethoscope size={13} className="text-[#005A5B]" />,
          avatar: '🩺',
          badge: 'bg-[#EBF5F5] border-[#005A5B]/20 text-[#005A5B]'
        };
      default:
        return {
          icon: <User size={13} className="text-[#F26522]" />,
          avatar: '🧑‍⚕️',
          badge: 'bg-[#F26522]/10 border-[#F26522]/20 text-[#F26522]'
        };
    }
  };

  const roleMeta = user ? getRoleStyle(user.role) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#005A5B]/10 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#005A5B] to-[#007A7B] flex items-center justify-center shadow-md shadow-[#005A5B]/20 group-hover:scale-105 transition-transform">
            <Heart className="text-white fill-white/20" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-[#005A5B] group-hover:text-[#F26522] transition-colors">
                CURIX
              </span>
              <span className="h-2 w-2 rounded-full bg-[#F26522] animate-ping" />
            </div>
            <p className="text-[10px] tracking-widest text-[#005A5B]/80 uppercase font-bold">
              Health Ecosystem
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-[#005A5B] transition-colors">Specialties</a>
          <a href="#stats" className="hover:text-[#005A5B] transition-colors">Infrastructure</a>
          <a href="#security" className="hover:text-[#005A5B] transition-colors">Security & Trust</a>
        </div>

        {/* Right Action Button */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F7FAF9] border border-[#005A5B]/15 text-xs shadow-inner">
                <span className="text-base flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-xs">
                  {roleMeta?.avatar}
                </span>
                <span className="text-[#005A5B] font-bold max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border font-bold uppercase tracking-wider ${roleMeta?.badge}`}>
                  {roleMeta?.icon}
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-all transform active:scale-95"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F26522] hover:bg-[#D95316] active:bg-[#C2460F] text-white font-bold text-xs tracking-wider shadow-md shadow-[#F26522]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn size={15} />
              <span>Register / Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}