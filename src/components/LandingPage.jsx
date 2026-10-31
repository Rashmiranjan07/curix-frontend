import React from 'react';
import doctorImage from '../assets/doctor.png';
import { 
  Calendar, Stethoscope, ShieldCheck, CheckCircle2, 
  Heart, Activity, Lock, PhoneCall, Clock, Award, 
  FileText, ArrowRight, Search, LogIn, Star,
  Sparkles, Check, ChevronRight, Zap
} from 'lucide-react';

export default function LandingPage({ onOpenAuth = () => {} }) {
  // 6 Primary Curix Clinical Services
  const clinicalServices = [
    {
      title: 'Doctor Consultations',
      desc: 'Connect with verified physicians for outpatient appointments, follow-ups, and specialized clinical visits.',
      icon: <Stethoscope size={24} className="text-[#00A896]" />,
      tag: 'OPD & In-Clinic'
    },
    {
      title: 'Nursing Care',
      desc: 'Post-operative recovery, elderly assistance, wound dressing, and routine vitals tracking by certified nurses.',
      icon: <Heart size={24} className="text-[#00A896]" />,
      tag: 'Certified Staff'
    },
    {
      title: 'Diagnostics & Lab Tests',
      desc: 'Full-body health packages, blood panels, and doorstep sample collections with tamper-proof digital records.',
      icon: <Activity size={24} className="text-[#00A896]" />,
      tag: 'NABL Aligned'
    },
    {
      title: 'Critical Care & ICU Setup',
      desc: 'Hospital-grade bedside patient monitors, oxygen concentrators, and specialized palliative care protocols.',
      icon: <ShieldCheck size={24} className="text-[#00A896]" />,
      tag: '24/7 Monitoring'
    },
    {
      title: 'Digital Prescriptions',
      desc: 'Access verified clinical prescription slips with line-item dosages directly from your digital health vault.',
      icon: <FileText size={24} className="text-[#00A896]" />,
      tag: 'Tamper-Proof'
    },
    {
      title: 'Emergency Medical Support',
      desc: 'Priority slot booking, immediate doctor routing, and integrated outpatient medical facilities assistance.',
      icon: <PhoneCall size={24} className="text-[#00A896]" />,
      tag: 'Rapid Response'
    }
  ];

  // 4 Steps: How Curix Works
  const processSteps = [
    {
      step: '01',
      title: 'Visit Curix',
      desc: 'Access our secure digital healthcare platform on any device to explore accredited hospital units and specialists.',
      icon: <Search size={20} className="text-[#00A896]" />
    },
    {
      step: '02',
      title: 'Sign In as a Patient',
      desc: 'Log in to your verified patient portal to safely unlock personalized health charts, records, and history.',
      icon: <LogIn size={20} className="text-[#00A896]" />
    },
    {
      step: '03',
      title: 'Choose Your Specialist',
      desc: 'Filter attending physicians by clinical specialty, qualifications, experience, and transparent consultation fees.',
      icon: <Stethoscope size={20} className="text-[#00A896]" />
    },
    {
      step: '04',
      title: 'Confirm Appointment',
      desc: 'Reserve a real-time calendar slot with zero double-booking and receive an instant digital confirmation.',
      icon: <Calendar size={20} className="text-[#00A896]" />
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: Heart, count: '12 Specialists' },
    { name: 'Dermatology', icon: Sparkles, count: '8 Specialists' },
    { name: 'Neurology', icon: Activity, count: '6 Specialists' },
    { name: 'Orthopedics', icon: Award, count: '9 Specialists' },
    { name: 'Pediatrics', icon: Stethoscope, count: '14 Specialists' },
  ];

  return (
    <div className="relative pt-20 bg-white text-slate-700 font-sans selection:bg-[#00A896] selection:text-white">
      
      {/* 1. HERO SECTION (Luminous Aurora Backdrop & Modern 3D Layout) */}
      <section id="home" className="relative pt-8 sm:pt-16 pb-24 overflow-hidden bg-mesh-aurora">
        {/* Subtle decorative grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0A1C35 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Headline & Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Live Status Pill Beacon */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E6F8F5] border border-[#00A896]/30 text-[#00A896] text-[11px] font-extrabold tracking-wider uppercase shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                </span>
                <span>Next-Gen Healthcare Management</span>
              </div>

              {/* Masterful Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-[#0A1C35] leading-[1.08] tracking-tight">
                Hospital-grade <br />
                <span className="bg-gradient-to-r from-[#00A896] via-[#0BC2A8] to-[#0ea5e9] bg-clip-text text-transparent">
                  Healthcare Partner
                </span> <br />
                for your family
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                From licensed doctor consultations to certified nursing care and tamper-proof digital prescriptions, Curix delivers comprehensive outpatient clinical workflows built for reliability and patient comfort.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.()}
                  className="px-7 py-3.5 rounded-full btn-curix-primary text-xs font-extrabold tracking-wide flex items-center gap-2 group cursor-pointer"
                >
                  <span>Find & Book Doctor</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-sm transition-all duration-200"
                >
                  Explore All Services
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                    <CheckCircle2 size={13} className="stroke-[2.5]" />
                  </div>
                  <span>Zero Double-Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-[#0A1C35] flex items-center justify-center">
                    <ShieldCheck size={13} className="stroke-[2.5]" />
                  </div>
                  <span>Stateless JWT Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                    <Award size={13} className="stroke-[2.5]" />
                  </div>
                  <span>Verified Medical Licenses</span>
                </div>
              </div>

            </div>

            {/* Right Doctor Visual Canvas with Floating Holographic Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Radial Aura Backgrounds */}
              <div className="absolute w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#00A896]/20 via-[#0BC2A8]/15 to-sky-300/20 blur-3xl pointer-events-none" />
              <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#E6F8F5]/80 pointer-events-none" />

              <div className="relative z-10 w-full max-w-[340px] sm:max-w-[420px]">
                {doctorImage ? (
                  <img
                    src={doctorImage}
                    alt="Curix Attending Physician"
                    className="w-full h-auto object-contain filter drop-shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
                  />
                ) : (
                  <div className="w-full h-[360px] bg-[#E6F8F5] rounded-3xl flex items-center justify-center text-[#00A896]">
                    <Stethoscope size={64} />
                  </div>
                )}

                {/* Floating Physician Badge (Top Left) */}
                <div className="absolute -top-2 -left-4 sm:left-0 bg-white/95 backdrop-blur-md border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A896] to-[#0BC2A8] flex items-center justify-center text-white shadow-sm shadow-[#00A896]/30">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-black text-[#0A1C35]">Dr. Sarah Jenkins</p>
                      <CheckCircle2 size={12} className="text-[#00A896] fill-[#00A896]/10" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex text-amber-400">
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">4.9 (140+ reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Vitals Sync Badge (Bottom Right) */}
                <div className="absolute -bottom-3 -right-4 sm:right-0 bg-white/95 backdrop-blur-md border border-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                    <Heart size={18} className="fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0A1C35]">Real-Time Vitals Sync</p>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-emerald-700">72 BPM · Optimal Rhythm</span>
                    </p>
                  </div>
                </div>

                {/* Floating Digital Rx Vault Chip (Bottom Left) */}
                <div className="hidden sm:flex absolute bottom-20 -left-6 bg-white/90 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-full shadow-lg items-center gap-2 text-[10px] font-black text-[#0A1C35]">
                  <FileText size={12} className="text-[#00A896]" />
                  <span>Digital Rx Vault Aligned</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RAPID HEALTHCARE DISPATCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl glass-card grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6F8F5] to-teal-100/60 text-[#00A896] flex items-center justify-center shrink-0 shadow-2xs">
              <Clock size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0A1C35]">Immediate Slot Booking</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                Direct calendar synchronization with zero booking collisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6F8F5] to-teal-100/60 text-[#00A896] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0A1C35]">Licensed Clinical Experts</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                Every doctor and nurse undergoes administrative credential checks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6F8F5] to-teal-100/60 text-[#00A896] flex items-center justify-center shrink-0 shadow-2xs">
              <FileText size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#0A1C35]">Printable Digital Rx</h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                Download and print official hospital prescription slips on demand.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. MEDICAL SPECIALTIES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block">
              CLINICAL DISCIPLINES
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0A1C35] tracking-tight">
              Consult Across Key Specialties
            </h3>
          </div>
          <button 
            type="button"
            onClick={() => onOpenAuth?.()}
            className="text-xs font-bold text-[#00A896] hover:text-[#079181] flex items-center gap-1 transition cursor-pointer"
          >
            <span>View All Doctors</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {specialties.map((spec) => {
            const Icon = spec.icon;
            return (
              <button
                key={spec.name}
                type="button"
                onClick={() => onOpenAuth?.()}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#00A896]/40 hover:bg-[#E6F8F5]/30 transition-all duration-200 text-left group shadow-2xs cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[#E6F8F5] text-slate-600 group-hover:text-[#00A896] flex items-center justify-center transition-colors">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1C35] group-hover:text-[#00A896] transition-colors">{spec.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{spec.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. HOW CURIX WORKS (Connected Process Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            SEAMLESS OUTPATIENT WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A1C35] tracking-tight">
            How Curix Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto font-medium">
            From registration to verified digital prescriptions in four simple, guided steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((item) => (
            <div 
              key={item.step}
              className="relative p-7 rounded-3xl bg-slate-50/70 border border-slate-200/70 hover:border-[#00A896]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Step number watermark */}
              <span className="text-5xl font-black text-slate-200 group-hover:text-[#00A896]/20 transition-colors block mb-4 font-mono select-none">
                {item.step}
              </span>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#E6F8F5] text-[#00A896] flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-extrabold text-[#0A1C35] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center gap-1 text-[11px] font-bold text-[#00A896] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Next Step</span>
                <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SPECIALIZED HOSPITAL & PATIENT CARE (Luxury Dark Navy Bento Grid) */}
      <section id="services" className="py-24 bg-[#0A1C35] text-white relative overflow-hidden bg-mesh-dark">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#00A896]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0BC2A8] block mb-2">
                COMPREHENSIVE MEDICAL SERVICES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Specialized Hospital & Patient Care
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
                Hospital-grade clinical disciplines modeled after modern home healthcare institutions to serve your entire family's health lifecycle.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => onOpenAuth?.()}
              className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all self-start sm:self-auto cursor-pointer"
            >
              Explore All Units
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalServices.map((srv, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl glass-card-dark flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-white/10 text-[#0BC2A8] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#00A896]/20 transition-all duration-300">
                      {srv.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/10 text-teal-300 uppercase tracking-wider border border-white/10">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-teal-200 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{srv.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.()}
                    className="text-xs font-bold text-[#0BC2A8] hover:text-white flex items-center gap-1.5 transition cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. ABOUT CURIX HEALTHCARE & TRUST METRICS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block">
              CLINICAL EXCELLENCE AT SCALE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1C35] leading-tight tracking-tight">
              Pioneering Accessible, Real-Time Digital Healthcare
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Modeled after leading healthcare institutions, Curix was built to eliminate hospital queues, eradicate booking collisions, and empower patients with direct access to licensed clinicians and tamper-proof digital medical records.
            </p>

            <div className="space-y-4 pt-2 text-xs sm:text-sm font-medium">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="w-6 h-6 rounded-lg bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong className="text-[#0A1C35] block font-extrabold text-sm">Hospital-Wide Coordination</strong>
                  <p className="text-slate-600 text-xs mt-0.5">Unites patients, doctors, and hospital administrators on an audit-backed infrastructure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="w-6 h-6 rounded-lg bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong className="text-[#0A1C35] block font-extrabold text-sm">Transparent Pricing</strong>
                  <p className="text-slate-600 text-xs mt-0.5">Clear consultation fees and department breakdowns with zero hidden administrative costs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="w-6 h-6 rounded-lg bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong className="text-[#0A1C35] block font-extrabold text-sm">Stateless JWT Security & Compliance</strong>
                  <p className="text-slate-600 text-xs mt-0.5">Adhering to strict international patient health data privacy protocols.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00A896]/40 transition text-center shadow-2xs">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-[#00A896] to-[#079181] bg-clip-text text-transparent block font-mono">10k+</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mt-2 block">Patients Treated</span>
            </div>
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#0A1C35]/40 transition text-center shadow-2xs">
              <span className="text-4xl sm:text-5xl font-black text-[#0A1C35] block font-mono">150+</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mt-2 block">Specialist Physicians</span>
            </div>
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00A896]/40 transition text-center shadow-2xs">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-[#00A896] to-[#079181] bg-clip-text text-transparent block font-mono">25+</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mt-2 block">Clinical Specialties</span>
            </div>
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#0A1C35]/40 transition text-center shadow-2xs">
              <span className="text-4xl sm:text-5xl font-black text-[#0A1C35] block font-mono">99.9%</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mt-2 block">Patient Satisfaction</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. PRIORITY MEDICAL CALLOUT (Emergency & Home Visit) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-[#0A1C35] via-[#0d274c] to-[#0A1C35] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow aura */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#00A896]/20 blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0BC2A8] bg-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PRIORITY MEDICAL SUPPORT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Need Immediate Medical Assistance or a Home Doctor Visit?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Our clinical response team and certified physicians are available 24/7 to manage acute symptoms, consultations, and post-hospitalization care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 relative z-10">
            <button
              type="button"
              onClick={() => onOpenAuth?.()}
              className="px-7 py-3.5 rounded-full btn-curix-primary text-white font-extrabold text-xs tracking-wide shadow-lg cursor-pointer"
            >
              Book Consultation Now
            </button>
            <a
              href="tel:18002874922"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <PhoneCall size={14} className="text-[#0BC2A8]" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="security" className="bg-[#071524] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
            
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A896] to-[#079181] flex items-center justify-center text-white shadow-md shadow-[#00A896]/30">
                  <Heart size={18} className="fill-white/30" />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-wider block">CURIX</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#0BC2A8] font-black block -mt-1">Healthcare</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm font-medium">
                Hospital-grade digital healthcare platform connecting patients with verified medical experts in an integrated, HIPAA-aligned ecosystem.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2.5 font-medium">
              <span className="text-white font-black uppercase text-[11px] tracking-wider block mb-2">Platform</span>
              <a href="#home" className="block hover:text-white transition">Home</a>
              <a href="#services" className="block hover:text-white transition">Clinical Services</a>
              <a href="#about" className="block hover:text-white transition">About Curix</a>
            </div>

            <div className="md:col-span-2 space-y-2.5 font-medium">
              <span className="text-white font-black uppercase text-[11px] tracking-wider block mb-2">Support</span>
              <a href="#home" className="block hover:text-white transition">24/7 Helpline</a>
              <a href="#security" className="block hover:text-white transition">Security & Audit</a>
              <a href="#home" className="block hover:text-white transition">Privacy Policy</a>
            </div>

            <div className="md:col-span-3 space-y-3 font-medium">
              <span className="text-white font-black uppercase text-[11px] tracking-wider block">Patient Advisory</span>
              <p className="text-slate-400 leading-relaxed text-xs">
                Curix provides administrative coordination and scheduling for accredited outpatient medical facilities.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 font-medium">
            <p>© 2026 Curix Healthcare Systems. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Lock size={13} className="text-[#0BC2A8]" />
              <span>HIPAA Aligned & Encrypted Health Records</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
