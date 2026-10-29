import React from 'react';
import doctorImage from '../assets/doctor.png';
import { 
  Calendar, Stethoscope, ShieldCheck, CheckCircle2, 
  Heart, Activity, Lock, PhoneCall, Clock, Award, 
  FileText, ArrowRight, Search, LogIn, Check
} from 'lucide-react';

export default function LandingPage({ onOpenAuth }) {
  // 6 Primary Clinical Services
  const clinicalServices = [
    {
      title: 'Doctor Consultations',
      desc: 'Connect with verified physicians for outpatient appointments, follow-ups, and home clinical visits.',
      icon: <Stethoscope size={28} className="text-[#005A5B]" />,
      tag: 'OPD & In-Clinic'
    },
    {
      title: 'Nursing Care',
      desc: 'Post-operative recovery, elderly assistance, wound dressing, and routine vitals tracking by qualified nurses.',
      icon: <Heart size={28} className="text-[#005A5B]" />,
      tag: 'Certified Staff'
    },
    {
      title: 'Diagnostics & Lab Tests',
      desc: 'Full-body health packages, blood panels, and doorstep sample collections with fast digital reports.',
      icon: <Activity size={28} className="text-[#005A5B]" />,
      tag: 'NABL Aligned'
    },
    {
      title: 'Critical Care & ICU Setup',
      desc: 'Hospital-grade bedside patient monitors, oxygen concentrators, and specialized palliative care protocols.',
      icon: <ShieldCheck size={28} className="text-[#005A5B]" />,
      tag: '24/7 Monitoring'
    },
    {
      title: 'Digital Prescriptions',
      desc: 'Access verified clinical prescription slips with line-item dosages directly from your digital health vault.',
      icon: <FileText size={28} className="text-[#005A5B]" />,
      tag: 'Tamper-Proof'
    },
    {
      title: 'Emergency Medical Support',
      desc: 'Priority slot booking, immediate doctor routing, and integrated hospital admission assistance.',
      icon: <PhoneCall size={28} className="text-[#005A5B]" />,
      tag: 'Rapid Response'
    }
  ];

  // 4 Steps: How Curix Works
  const processSteps = [
    {
      step: '1',
      title: 'Visit Curix',
      desc: 'Access our secure digital healthcare platform on any device to explore accredited hospital units and specialists.',
      icon: <Search size={18} className="text-[#5eead4]" />
    },
    {
      step: '2',
      title: 'Login as a Patient',
      desc: 'Sign in to your verified patient portal to safely unlock personalized health charts, records, and history.',
      icon: <LogIn size={18} className="text-[#5eead4]" />
    },
    {
      step: '3',
      title: 'Find What You Need',
      desc: 'Filter attending physicians by medical specialty, qualifications, experience, and transparent consultation fees.',
      icon: <Stethoscope size={18} className="text-[#5eead4]" />
    },
    {
      step: '4',
      title: 'Book an Appointment',
      desc: 'Select an open real-time calendar slot with zero double-booking and receive an instant digital confirmation.',
      icon: <Calendar size={18} className="text-[#5eead4]" />
    }
  ];

  return (
    <div className="relative pt-20 pb-16 bg-[#F8FAFC] text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-[#EBF5F5]/60 via-[#F8FAFC] to-white">
        
        {/* Soft Ambient Auras */}
        <div className="absolute top-0 left-0 w-[55%] h-[600px] bg-gradient-to-br from-[#005A5B]/10 via-[#00A896]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-[45%] h-[550px] bg-gradient-to-bl from-[#F26522]/10 via-slate-100/40 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Exact Headline Layout & Colors */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <div className="inline-block">
                <div className="w-12 h-1 bg-[#005A5B] mb-2.5 rounded-full" />
                <span className="text-xs sm:text-sm font-black tracking-widest text-[#005A5B] uppercase block">
                  PORT-GRADE HEALTHCARE AT YOUR FINGERTIPS
                </span>
              </div>

              {/* Exact 4-Line Headline Matching Reference */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight leading-[1.08] select-none">
                <span className="text-[#005A5B] block">
                  Hospital-quality
                </span>
                <span className="text-[#F26522] block mt-1">
                  HEALTHCARE partner
                </span>
                <span className="text-[#F26522] block mt-1">
                  for
                </span>
                <span className="text-[#005A5B] block mt-1">
                  your family
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium pt-1">
                From licensed doctor consultations to certified nursing care and digital prescriptions, Curix provides comprehensive healthcare management designed for precision and patient convenience.
              </p>

              {/* Pill-Shaped CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenAuth}
                  className="px-9 py-4 rounded-full bg-[#F26522] hover:bg-[#D95316] active:bg-[#C2460F] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-[#F26522]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Find & Book Doctor
                </button>

                <a
                  href="#services"
                  className="px-9 py-4 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 text-slate-800 text-sm sm:text-base font-bold shadow-xs transition-all duration-200"
                >
                  Explore All Services
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm text-slate-700 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#00A896]" />
                  <span>Zero Double Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#005A5B]" />
                  <span>Stateless JWT Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#F26522]" />
                  <span>Verified Medical Licenses</span>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor Frame with Reference Peach Backdrop */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px]">
              <div className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#00A896]/15 blur-2xl pointer-events-none" />
              <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#005A5B]/20 via-[#F26522]/15 to-transparent pointer-events-none animate-pulse" />

              {/* Peach Rectangle Container Card */}
              <div className="relative w-[300px] h-[360px] sm:w-[340px] sm:h-[410px] rounded-[36px] bg-[#f9dfd2] border border-[#f0cfbe] shadow-2xl shadow-slate-900/10 overflow-hidden flex items-end justify-center group z-10">
                <img
                  src={doctorImage}
                  alt="Curix Specialist Doctor"
                  className="w-full h-full object-cover object-top filter contrast-[1.02] transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-2 left-0 sm:left-2 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#005A5B] shadow-xs">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Dr. Sarah Jenkins</p>
                  <p className="text-xs text-[#F26522] font-extrabold">Verified Attending Staff</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-2 right-0 sm:right-2 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-xs">
                  <Heart size={20} className="fill-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Live Vitals Sync</p>
                  <p className="text-xs text-slate-600 font-bold flex items-center gap-1">
                    <Activity size={14} className="text-[#00A896]" />
                    72 BPM · Optimal
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RAPID HEALTHCARE DISPATCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F26522] flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Immediate Slot Booking</h4>
              <p className="text-xs text-slate-500 font-medium">Verified calendar synchronization with zero booking collisions.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#005A5B] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Licensed Clinical Experts</h4>
              <p className="text-xs text-slate-500 font-medium">Every doctor and nurse undergoes administrative credential checks.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Printable Digital Rx</h4>
              <p className="text-xs text-slate-500 font-medium">Download, store, and print official clinical prescription slips anytime.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW CURIX WORKS (EXACT PORTEA DEEP PINE & GLITTERY DOT MATRIX) */}
      <section className="mt-16 py-20 bg-[#022b2c] text-white relative overflow-hidden">
        
        {/* Deep Vignette Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#09494a_0%,_#022e2f_45%,_#011e1f_100%)] pointer-events-none" />

        {/* Luminous Particle Grid Pattern (Glittery Dot Matrix) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: `radial-gradient(rgba(94, 234, 212, 0.45) 1.25px, transparent 1.25px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Compact, Narrow Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#5eead4] block mb-2">
              A SIMPLE, GUIDED PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              How Curix Works
            </h2>
          </div>

          {/* 4 Cards: Compact Width & Transparent Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {processSteps.map((item) => (
              <div 
                key={item.step}
                className="relative rounded-2xl p-5 sm:p-6 bg-[#043a3b]/55 border border-teal-400/20 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Large Ghost Step Number */}
                <span className="absolute top-2 right-4 text-6xl font-serif font-black text-teal-100/[0.08] select-none pointer-events-none">
                  {item.step}
                </span>

                <div>
                  {/* Rounded Squircle Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-300/25 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HOSPITAL SERVICES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#F26522] uppercase">
            COMPREHENSIVE MEDICAL SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#005A5B] mt-1.5">
            Specialized Hospital & Patient Care
          </h2>
          <p className="text-slate-600 text-base font-medium mt-2 max-w-2xl mx-auto">
            High-standard clinical disciplines modeled after modern home healthcare institutions to serve your entire health lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicalServices.map((srv, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#F26522]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#EBF5F5] border border-[#005A5B]/15 flex items-center justify-center group-hover:scale-105 group-hover:bg-orange-50 group-hover:text-[#F26522] transition-all">
                    {srv.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 uppercase">
                    {srv.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#005A5B] mb-2.5">{srv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{srv.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-black text-[#F26522] hover:text-[#D95316] flex items-center gap-1.5 group-hover:translate-x-1 transition-all cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT US SECTION */}
      <section id="about" className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black tracking-widest text-[#F26522] uppercase">
                ABOUT CURIX HEALTHCARE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#005A5B] leading-tight">
                Pioneering Accessible, Real-Time Digital Healthcare
              </h2>
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                Modeled after leading healthcare institutions, Curix was built to eliminate queues, eradicate booking collisions, and empower patients with direct access to licensed clinicians and digital medical records.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-[#005A5B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} className="text-[#005A5B]" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">
                    <strong className="text-slate-900">Hospital-Wide Coordination:</strong> Unites patients, doctors, and hospital administrators on an audit-backed infrastructure.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-[#005A5B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} className="text-[#005A5B]" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">
                    <strong className="text-slate-900">Transparent Pricing:</strong> Transparent consultation fees and department breakdowns with zero hidden costs.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-[#005A5B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} className="text-[#005A5B]" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">
                    <strong className="text-slate-900">Compliant & Secure:</strong> State-of-the-art stateless JWT token security adhering to HIPAA and digital health protection laws.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-4xl font-black text-[#005A5B] block font-mono">10,000+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Patients Treated</span>
              </div>
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-4xl font-black text-[#F26522] block font-mono">150+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Physicians</span>
              </div>
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-4xl font-black text-[#00A896] block font-mono">25+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Specialties</span>
              </div>
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-4xl font-black text-slate-900 block font-mono">99.9%</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Satisfaction</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. QUICK EMERGENCY & CONSULTATION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#005A5B] via-[#004849] to-[#002f30] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF9E6C]">
              PRIORITY MEDICAL SUPPORT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Need Immediate Medical Assistance or a Home Doctor Visit?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl font-medium">
              Our clinical response team and certified physicians are available 24/7 to manage acute symptoms, consultations, and post-hospitalization recovery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenAuth}
              className="px-8 py-3.5 rounded-full bg-[#F26522] hover:bg-[#D95316] text-white font-extrabold text-sm tracking-wide shadow-md transition-all cursor-pointer"
            >
              Book Consultation Now
            </button>
            <a
              href="tel:18002874922"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <PhoneCall size={16} />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. TRUST & CERTIFICATIONS FOOTER */}
      <footer id="security" className="border-t border-slate-200 pt-10 pb-8 text-center text-sm text-slate-500 font-medium">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-[#F26522]" />
          <span className="text-slate-800 font-bold">HIPAA & Digital Health Data Protection Aligned</span>
        </div>
        <p>© 2026 Curix Healthcare Systems.</p>
      </footer>

    </div>
  );
}