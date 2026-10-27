import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, LogOut, Shield, Stethoscope, User } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: <Shield size={13} className="text-indigo-600" />,
          avatar: '🛡️',
          badge: 'bg-indigo-50 border-indigo-200 text-indigo-700'
        };
      case 'DOCTOR':
        return {
          icon: <Stethoscope size={13} className="text-[#0ea5e9]" />,
          avatar: '🩺',
          badge: 'bg-sky-50 border-sky-200 text-[#0ea5e9]'
        };
      default:
        return {
          icon: <User size={13} className="text-[#1e3a5f]" />,
          avatar: '🧑‍⚕️',
          badge: 'bg-slate-100 border-slate-200 text-[#1e3a5f]'
        };
    }
  };

  const roleMeta = user ? getRoleStyle(user.role) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1e3a5f] to-[#0ea5e9] flex items-center justify-center shadow-md shadow-sky-500/15 group-hover:scale-105 transition-transform">
            <Activity className="text-white font-bold" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#1e3a5f] group-hover:text-[#0ea5e9] transition-colors">
                CURIX
              </span>
              <span className="h-2 w-2 rounded-full bg-[#0ea5e9] animate-ping"></span>
            </div>
            <p className="text-[10px] tracking-widest text-[#0ea5e9] uppercase font-bold">
              Health Ecosystem
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-[#1e3a5f] transition-colors">Specialties</a>
          <a href="#stats" className="hover:text-[#1e3a5f] transition-colors">Infrastructure</a>
          <a href="#security" className="hover:text-[#1e3a5f] transition-colors">Security & Trust</a>
        </div>

        {/* Right Action Button */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-inner">
                <span className="text-base flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-xs">
                  {roleMeta?.avatar}
                </span>
                <span className="text-[#1e3a5f] font-bold max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border font-bold uppercase tracking-wider ${roleMeta?.badge}`}>
                  {roleMeta?.icon}
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold transition-all transform active:scale-95"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] active:bg-[#152a45] text-white font-semibold text-xs tracking-wider shadow-md shadow-[#1e3a5f]/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
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