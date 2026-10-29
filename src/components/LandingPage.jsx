import React from 'react';
import doctorImage from '../assets/doctor.png';
import { 
  Calendar, Stethoscope, ShieldCheck, CheckCircle2, 
  Heart, Activity, Lock, PhoneCall, Clock, Award, 
  FileText, ArrowRight, Search, LogIn, Check, Star,
  Sparkles, PlusCircle
} from 'lucide-react';

export default function LandingPage({ onOpenAuth = () => {} }) {
  // 6 Primary Curix Clinical Services
  const clinicalServices = [
    {
      title: 'Doctor Consultations',
      desc: 'Connect with verified physicians for outpatient appointments, follow-ups, and home clinical visits.',
      icon: <Stethoscope size={24} className="text-[#00A896]" />,
      tag: 'OPD & In-Clinic'
    },
    {
      title: 'Nursing Care',
      desc: 'Post-operative recovery, elderly assistance, wound dressing, and routine vitals tracking by qualified nurses.',
      icon: <Heart size={24} className="text-[#00A896]" />,
      tag: 'Certified Staff'
    },
    {
      title: 'Diagnostics & Lab Tests',
      desc: 'Full-body health packages, blood panels, and doorstep sample collections with fast digital reports.',
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
      desc: 'Priority slot booking, immediate doctor routing, and integrated hospital admission assistance.',
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
      title: 'Login as a Patient',
      desc: 'Sign in to your verified patient portal to safely unlock personalized health charts, records, and history.',
      icon: <LogIn size={20} className="text-[#00A896]" />
    },
    {
      step: '03',
      title: 'Find What You Need',
      desc: 'Filter attending physicians by medical specialty, qualifications, experience, and transparent consultation fees.',
      icon: <Stethoscope size={20} className="text-[#00A896]" />
    },
    {
      step: '04',
      title: 'Book an Appointment',
      desc: 'Select an open real-time calendar slot with zero double-booking and receive an instant digital confirmation.',
      icon: <Calendar size={20} className="text-[#00A896]" />
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: <Heart size={20} className="text-[#00A896]" /> },
    { name: 'Dermatology', icon: <Sparkles size={20} className="text-[#00A896]" /> },
    { name: 'Neurology', icon: <Activity size={20} className="text-[#00A896]" /> },
    { name: 'Orthopedics', icon: <Award size={20} className="text-[#00A896]" /> },
    { name: 'Pediatrics', icon: <Stethoscope size={20} className="text-[#00A896]" /> },
  ];

  return (
    <div className="relative pt-20 bg-white text-slate-700 font-sans">
      
      {/* 1. HERO SECTION (Curix Context with Antixor Geometry) */}
      <section id="home" className="relative pt-8 sm:pt-16 pb-20 overflow-hidden bg-gradient-to-b from-[#F4F8FB] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline & Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#00A896] bg-[#E6F8F5] px-3.5 py-1 rounded-full">
                HOSPITAL-GRADE HEALTHCARE AT YOUR FINGERTIPS
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0A1C35] leading-[1.12] tracking-tight">
                Hospital-quality <br />
                <span className="text-[#00A896]">Healthcare Partner</span> <br />
                for your family
              </h1>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
                From licensed doctor consultations to certified nursing care and digital prescriptions, Curix provides comprehensive healthcare management designed for clinical precision and patient convenience.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.()}
                  className="px-7 py-3 rounded-full bg-[#00A896] hover:bg-[#079181] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#00A896]/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Find & Book Doctor
                </button>

                <a
                  href="#services"
                  className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs transition"
                >
                  Explore All Services
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-200/70 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#00A896]" />
                  <span>Zero Double Booking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#0A1C35]" />
                  <span>Stateless JWT Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={16} className="text-[#00A896]" />
                  <span>Verified Medical Licenses</span>
                </div>
              </div>
            </div>

            {/* Right Doctor Visual with Mint Aura & Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-[#00A896]/15 blur-2xl pointer-events-none" />
              <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#E6F8F5] pointer-events-none" />

              <div className="relative z-10 w-full max-w-[340px] sm:max-w-[400px]">
                {doctorImage ? (
                  <img
                    src={doctorImage}
                    alt="Curix Attending Physician"
                    className="w-full h-auto object-contain filter drop-shadow-xl"
                  />
                ) : (
                  <div className="w-full h-[350px] bg-[#E6F8F5] rounded-3xl flex items-center justify-center text-[#00A896]">
                    <Stethoscope size={64} />
                  </div>
                )}

                {/* Floating Physician Badge */}
                <div className="absolute top-2 left-0 bg-white/95 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E6F8F5] flex items-center justify-center text-[#00A896]">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0A1C35]">Dr. Sarah Jenkins</p>
                    <p className="text-[10px] text-[#00A896] font-bold">Verified Attending Staff</p>
                  </div>
                </div>

                {/* Floating Vitals Badge */}
                <div className="absolute bottom-4 right-0 bg-white/95 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <Heart size={18} className="fill-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0A1C35]">Live Vitals Sync</p>
                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Activity size={12} className="text-[#00A896]" />
                      72 BPM · Optimal
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RAPID HEALTHCARE DISPATCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A1C35]">Immediate Slot Booking</h4>
              <p className="text-xs text-slate-500 mt-0.5">Verified calendar synchronization with zero booking collisions.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A1C35]">Licensed Clinical Experts</h4>
              <p className="text-xs text-slate-500 mt-0.5">Every doctor and nurse undergoes administrative credential checks.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A1C35]">Printable Digital Rx</h4>
              <p className="text-xs text-slate-500 mt-0.5">Download, store, and print official clinical prescription slips anytime.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW CURIX WORKS (Bento Process Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            A SIMPLE, GUIDED PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C35]">
            How Curix Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            From registration to verified prescriptions in four seamless clinical steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((item) => (
            <div 
              key={item.step}
              className="relative p-6 rounded-3xl bg-[#F4F8FB] border border-slate-100 hover:border-[#00A896]/30 transition group flex flex-col justify-between"
            >
              <span className="text-4xl font-extrabold text-slate-200 group-hover:text-[#00A896]/20 transition-colors block mb-4">
                {item.step}
              </span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#0A1C35] mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOSPITAL & PATIENT CARE SERVICES (Navy Bento Background) */}
      <section id="services" className="py-20 bg-[#0A1C35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00A896] block mb-1">
                COMPREHENSIVE MEDICAL SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Specialized Hospital & Patient Care
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                High-standard clinical disciplines modeled after modern home healthcare institutions to serve your entire health lifecycle.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => onOpenAuth?.()}
              className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition self-start sm:self-auto cursor-pointer"
            >
              Explore All Units
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalServices.map((srv, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00A896]/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {srv.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/10 text-teal-300 uppercase">
                      {srv.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.()}
                    className="text-xs font-bold text-[#00A896] hover:text-[#0bc2a8] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ABOUT CURIX HEALTHCARE */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block">
              ABOUT CURIX HEALTHCARE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1C35] leading-tight">
              Pioneering Accessible, Real-Time Digital Healthcare
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Modeled after leading healthcare institutions, Curix was built to eliminate queues, eradicate booking collisions, and empower patients with direct access to licensed clinicians and digital medical records.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#00A896] shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <strong className="text-[#0A1C35]">Hospital-Wide Coordination:</strong> Unites patients, doctors, and hospital administrators on an audit-backed infrastructure.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#00A896] shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <strong className="text-[#0A1C35]">Transparent Pricing:</strong> Transparent consultation fees and department breakdowns with zero hidden costs.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#00A896] shrink-0 mt-0.5" />
                <p className="text-slate-700">
                  <strong className="text-[#0A1C35]">Compliant & Secure:</strong> Stateless JWT authentication adhering to patient health data privacy laws.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#F4F8FB] border border-slate-100 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#00A896] block font-mono">10,000+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Patients Treated</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#F4F8FB] border border-slate-100 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#0A1C35] block font-mono">150+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Physicians</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#F4F8FB] border border-slate-100 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#00A896] block font-mono">25+</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Specialties</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#F4F8FB] border border-slate-100 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#0A1C35] block font-mono">99.9%</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">Satisfaction</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALLOUT: NEED IMMEDIATE ASSISTANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0A1C35] via-[#071d38] to-[#0A1C35] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00A896]">
              PRIORITY MEDICAL SUPPORT
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              Need Immediate Medical Assistance or a Home Doctor Visit?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our clinical response team and certified physicians are available 24/7 to manage acute symptoms, consultations, and post-hospitalization recovery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth?.()}
              className="px-6 py-3 rounded-full bg-[#00A896] hover:bg-[#079181] text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            >
              Book Consultation Now
            </button>
            <a
              href="tel:18002874922"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <PhoneCall size={14} />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer id="security" className="bg-[#071524] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00A896] flex items-center justify-center text-white">
                  <Heart size={18} className="fill-white/20" />
                </div>
                <span className="text-lg font-black text-white tracking-wide">CURIX</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                Better care, healthier lives. Connecting patients with verified medical experts in an integrated digital ecosystem.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <span className="text-white font-bold block mb-2">Platform</span>
              <a href="#home" className="block hover:text-white">Home</a>
              <a href="#services" className="block hover:text-white">Clinical Services</a>
              <a href="#about" className="block hover:text-white">About Curix</a>
            </div>

            <div className="md:col-span-2 space-y-2">
              <span className="text-white font-bold block mb-2">Support</span>
              <a href="#home" className="block hover:text-white">24/7 Helpline</a>
              <a href="#security" className="block hover:text-white">Security & Audit</a>
              <a href="#home" className="block hover:text-white">Privacy Policy</a>
            </div>

            <div className="md:col-span-3 space-y-3">
              <span className="text-white font-bold block">Patient Advisory</span>
              <p className="text-slate-400 leading-relaxed">
                Curix provides administrative coordination and scheduling for accredited outpatient medical facilities.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500">
            <p>© 2026 Curix Healthcare Systems. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-[#00A896]" />
              <span>HIPAA Aligned & Encrypted Health Records</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}