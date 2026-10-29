import React from 'react';
import { useAuth } from '../context/AuthContext';
import CurixLogo from './CurixLogo';
import { LogIn, LogOut, Shield, Stethoscope, User } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: <Shield size={14} className="text-[#00A896]" />,
          avatar: '🛡️',
          badge: 'bg-[#E6F8F5] border-[#00A896]/20 text-[#00A896]'
        };
      case 'DOCTOR':
        return {
          icon: <Stethoscope size={14} className="text-[#00A896]" />,
          avatar: '🩺',
          badge: 'bg-[#E6F8F5] border-[#00A896]/20 text-[#00A896]'
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Curix Brand Logo Component */}
        <a href="#home" className="inline-flex items-center">
          <CurixLogo size="md" showSubtitle={true} light={false} />
        </a>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-9 text-[13px] font-bold text-slate-600">
          <a href="#home" className="hover:text-[#00A896] transition-colors">
            Home
          </a>
          <a href="#services" className="hover:text-[#00A896] transition-colors">
            Services
          </a>
          <a href="#about" className="hover:text-[#00A896] transition-colors">
            About Us
          </a>
          <a href="#security" className="hover:text-[#00A896] transition-colors">
            Security
          </a>
        </div>

        {/* Right Authentication Action */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-xs shadow-xs">
                <span>{roleMeta?.avatar}</span>
                <span className="text-[#0A1C35] font-bold max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] border font-bold uppercase tracking-wider ${roleMeta?.badge}`}>
                  {user.role}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3b6f] hover:bg-[#142d54] text-white font-bold text-xs tracking-wide shadow-md shadow-[#1b3b6f]/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
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