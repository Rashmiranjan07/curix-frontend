import React from 'react';
import doctorImage from '../assets/doctor.png';
import { 
  Calendar, Stethoscope, ShieldCheck, 
  CheckCircle2, Heart, Activity, Lock 
} from 'lucide-react';

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#EBF5F5]/60 via-[#F7FAF9] to-white text-[#1A2E35]">
      
      {/* Portea Warm Ambient Light Blends */}
      <div className="absolute top-0 left-0 w-[55%] h-[600px] bg-gradient-to-br from-[#005A5B]/10 via-[#00A896]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[45%] h-[550px] bg-gradient-to-bl from-[#F26522]/10 via-[#EBF5F5]/50 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-black tracking-widest text-[#005A5B] uppercase pb-1 border-b-2 border-[#F26522]">
                WELCOME TO CURIX HEALTH
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#005A5B] tracking-tight leading-[1.15]">
              Most trusted <br />
              <span className="text-[#F26522]">
                HEALTHCARE partner for
              </span> <br />
              <span>your life</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Curix streamlines doctor bookings, generates verified digital prescriptions, and unites hospital departments under a secure, real-time clinical architecture.
            </p>

            {/* Pill-Shaped CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAuth}
                className="px-8 py-3.5 rounded-full bg-[#F26522] hover:bg-[#D95316] active:bg-[#C2460F] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#F26522]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Find Doctor
              </button>

              <a
                href="#services"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#EBF5F5]/40 active:bg-[#EBF5F5] border border-[#005A5B]/20 text-[#005A5B] text-sm font-bold shadow-xs transition-all duration-200"
              >
                Book Appointment
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#005A5B]/10 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#00A896]" />
                <span className="text-slate-700 font-semibold">Zero Double Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#005A5B]" />
                <span className="text-slate-700 font-semibold">Stateless JWT Security</span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Frame with Portea Green & Coral Auras */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]">
            
            {/* Outer Soft Ambient Ring */}
            <div 
              className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#00A896]/15 blur-2xl pointer-events-none" 
            />

            {/* Middle Solid Aura Ring */}
            <div 
              className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#005A5B]/20 via-[#F26522]/15 to-transparent pointer-events-none" 
              style={{ animation: 'pulseAura 5s ease-in-out infinite' }}
            />

            {/* Inner Rounded Frame Housing the Doctor */}
            <div className="relative w-[280px] h-[340px] sm:w-[330px] sm:h-[400px] rounded-[36px] bg-gradient-to-b from-[#EBF5F5] via-white to-white border border-[#005A5B]/15 shadow-2xl shadow-[#005A5B]/10 overflow-hidden flex items-end justify-center group z-10">
              <img
                src={doctorImage}
                alt="Curix Specialist Doctor"
                className="w-full h-full object-cover object-top filter contrast-[1.02] transform transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom Subtle Fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#005A5B]/15 to-transparent pointer-events-none" />
            </div>

            {/* Floating Live Badge 1: Verified Specialist */}
            <div 
              className="absolute -top-1 -left-2 sm:left-2 bg-white/95 backdrop-blur-md border border-[#005A5B]/15 p-3 rounded-2xl shadow-lg shadow-[#005A5B]/10 flex items-center gap-3 z-20"
              style={{ animation: 'floatSlow 4.5s ease-in-out infinite' }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#EBF5F5] border border-[#005A5B]/20 flex items-center justify-center text-[#005A5B] shadow-xs">
                <Stethoscope size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#005A5B]">Dr. Sarah Jenkins</p>
                <p className="text-[10px] text-[#F26522] font-bold">
                  Verified Specialist
                </p>
              </div>
            </div>

            {/* Floating Live Badge 2: Pulse Indicator */}
            <div 
              className="absolute -bottom-2 right-0 sm:right-2 bg-white/95 backdrop-blur-md border border-rose-100 p-3 rounded-2xl shadow-lg shadow-rose-900/10 flex items-center gap-3 z-20"
              style={{ animation: 'floatDelayed 4.5s ease-in-out 2.25s infinite' }}
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-xs">
                <Heart size={18} className="fill-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#005A5B]">Live Vitals Sync</p>
                <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                  <Activity size={12} className="text-[#00A896]" />
                  72 BPM · Optimal
                </p>
              </div>
            </div>

            <style>{`
              @keyframes pulseAura {
                0%, 100% { transform: scale(0.96); opacity: 0.5; }
                50% { transform: scale(1.04); opacity: 0.85; }
              }
              @keyframes floatSlow {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              @keyframes floatDelayed {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(8px); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Hospital Credentials & Key Metrics Strip */}
      <div id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#005A5B]/15 shadow-sm">
          <div className="text-center p-4 border-r border-slate-100 last:border-none">
            <div className="text-3xl font-black text-[#005A5B]">99.9%</div>
            <div className="text-xs text-[#F26522] mt-1 uppercase font-bold tracking-wider">System Availability</div>
          </div>
          <div className="text-center p-4 border-r border-slate-100 last:border-none">
            <div className="text-3xl font-black text-[#00A896]">&lt; 30s</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Slot Allocation</div>
          </div>
          <div className="text-center p-4 border-r border-slate-100 last:border-none">
            <div className="text-3xl font-black text-[#005A5B]">256-bit</div>
            <div className="text-xs text-[#F26522] mt-1 uppercase font-bold tracking-wider">JWT Cryptography</div>
          </div>
          <div className="text-center p-4 last:border-none">
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Audit Traceability</div>
          </div>
        </div>
      </div>

      {/* Specialties & Role Modules */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#005A5B]">Specialized Hospital Ecosystem</h2>
          <p className="text-slate-500 text-sm mt-2">Unified digital infrastructure designed for patients, doctors, and clinical administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#005A5B]/10 hover:border-[#F26522]/40 shadow-xs hover:shadow-md transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F5] border border-[#005A5B]/15 flex items-center justify-center text-[#005A5B] mb-6 group-hover:scale-105 group-hover:bg-[#F26522]/10 group-hover:text-[#F26522] transition-all">
              <Calendar size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#005A5B] mb-2">Patients Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Explore medical departments, view doctor fees, choose verified available time slots without collisions, and access digital prescriptions anytime.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#005A5B]/10 hover:border-[#F26522]/40 shadow-xs hover:shadow-md transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F5] border border-[#005A5B]/15 flex items-center justify-center text-[#005A5B] mb-6 group-hover:scale-105 group-hover:bg-[#F26522]/10 group-hover:text-[#F26522] transition-all">
              <Stethoscope size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#005A5B] mb-2">Physician Workspace</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Real-time consultation queues, dynamic weekly shift availability configurator, and direct prescription builder with line-item medicines and dosage instructions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#005A5B]/10 hover:border-[#F26522]/40 shadow-xs hover:shadow-md transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF5F5] border border-[#005A5B]/15 flex items-center justify-center text-[#005A5B] mb-6 group-hover:scale-105 group-hover:bg-[#F26522]/10 group-hover:text-[#F26522] transition-all">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#005A5B] mb-2">Hospital Administration</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Hospital-wide throughput analytics, doctor credential onboarding, medical department creation, and immutable system audit logging.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Certifications Footer */}
      <footer id="security" className="mt-16 border-t border-[#005A5B]/10 pt-10 pb-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={15} className="text-[#F26522]" />
          <span className="text-[#005A5B] font-semibold">HIPAA & Digital Data Protection Aligned Infrastructure</span>
        </div>
        <p>© 2026 Curix Healthcare Systems. Designed for precision and reliability.</p>
      </footer>
    </div>
  );
}