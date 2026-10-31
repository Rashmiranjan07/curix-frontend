import React, { useState } from 'react';
import doctorImage from '../assets/doctor.png';
import { 
  Calendar, Stethoscope, ShieldCheck, CheckCircle2, 
  Heart, Activity, Lock, PhoneCall, Clock, Award, 
  FileText, ArrowRight, Search, LogIn, Star,
  Sparkles, Check, ChevronRight, Zap, ChevronDown,
  HelpCircle, UserCheck, CheckCircle, Video, Home
} from 'lucide-react';

export default function LandingPage({ onOpenAuth = () => {} }) {
  // Interactive Search & Specialty Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiology');
  const [activeStepTab, setActiveStepTab] = useState('01');
  const [selectedPlanTab, setSelectedPlanTab] = useState('clinic');
  const [expandedFaq, setExpandedFaq] = useState(0);

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

  // Specialties with Interactive Data
  const specialties = [
    {
      id: 'Cardiology',
      name: 'Cardiology',
      icon: Heart,
      count: '12 Specialists',
      doctor: 'Dr. Sarah Jenkins, MD',
      hospital: 'Curix Cardiovascular Institute',
      fee: '$50.00',
      rating: '4.95',
      slots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:15 PM'],
      bio: 'Comprehensive cardiovascular evaluations, ECG telemetry reviews, and preventive hypertension plans.'
    },
    {
      id: 'Dermatology',
      name: 'Dermatology',
      icon: Sparkles,
      count: '8 Specialists',
      doctor: 'Dr. Marcus Vance, FAAD',
      hospital: 'Center for Clinical Dermatology',
      fee: '$45.00',
      rating: '4.91',
      slots: ['10:00 AM', '01:15 PM', '03:45 PM', '05:30 PM'],
      bio: 'Clinical dermatology, acute allergen analysis, eczema management, and digital skin mapping.'
    },
    {
      id: 'Neurology',
      name: 'Neurology',
      icon: Activity,
      count: '6 Specialists',
      doctor: 'Dr. Elena Rostova, PhD',
      hospital: 'Neuroscience & Stroke Care Unit',
      fee: '$60.00',
      rating: '4.98',
      slots: ['09:00 AM', '11:45 AM', '02:00 PM', '04:30 PM'],
      bio: 'Migraine care, neuro-muscular diagnostics, cranial health screening, and cognitive assessments.'
    },
    {
      id: 'Orthopedics',
      name: 'Orthopedics',
      icon: Award,
      count: '9 Specialists',
      doctor: 'Dr. Liam Montgomery, MS',
      hospital: 'Orthopedic & Joint Recovery Desk',
      fee: '$55.00',
      rating: '4.93',
      slots: ['10:30 AM', '01:00 PM', '03:15 PM', '05:00 PM'],
      bio: 'Joint mobility, post-fracture physical rehabilitation, arthritic relief, and sports injury consultations.'
    },
    {
      id: 'Pediatrics',
      name: 'Pediatrics',
      icon: Stethoscope,
      count: '14 Specialists',
      doctor: 'Dr. Chloe Adams, FAAP',
      hospital: 'Child Wellness & Neonatal Care',
      fee: '$40.00',
      rating: '4.97',
      slots: ['08:45 AM', '11:15 AM', '01:45 PM', '04:00 PM'],
      bio: 'Developmental milestones, pediatric nutrition, immunization scheduling, and acute childhood illnesses.'
    }
  ];

  const currentSpecialtyData = specialties.find(s => s.id === selectedSpecialty) || specialties[0];

  // 4 Steps: How Curix Works
  const processSteps = [
    {
      step: '01',
      title: 'Visit & Explore Curix',
      desc: 'Browse accredited medical departments and verified doctors on any smartphone, tablet, or desktop.',
      badge: 'Zero Account Required to Browse',
      preview: 'Real-time directory indexing 150+ hospital-grade specialists and available clinic slots.'
    },
    {
      step: '02',
      title: 'Sign In as a Patient',
      desc: 'Access your encrypted patient profile to unlock your personal health charts, history, and vitals.',
      badge: 'Stateless 256-Bit JWT Security',
      preview: 'Compliant with international patient health data regulations with instant biometric or token login.'
    },
    {
      step: '03',
      title: 'Choose Specialist & Slot',
      desc: 'Review transparent consultation fees, doctor credentials, and select your preferred real-time calendar slot.',
      badge: 'Zero Booking Collisions',
      preview: 'Atomic database slot locking ensures zero double-booking and immediate confirmation slips.'
    },
    {
      step: '04',
      title: 'Receive Digital Rx Slip',
      desc: 'Consult your attending physician and instantly retrieve official line-item digital prescriptions.',
      badge: 'Tamper-Proof & Printable',
      preview: 'Official OPD prescription slips formatted for pharmacy verification and lifelong patient vaults.'
    }
  ];

  // Interactive Care Plans
  const carePlans = [
    {
      id: 'clinic',
      name: 'In-Clinic Specialist OPD',
      price: '$50.00',
      icon: Stethoscope,
      popular: true,
      features: [
        'Face-to-face physician consultation',
        'Hospital vitals check & physical exam',
        'Official tamper-proof prescription slip',
        'Free digital follow-up review within 7 days',
        'Zero queue priority reception badge'
      ]
    },
    {
      id: 'video',
      name: 'Virtual Telehealth Consult',
      price: '$35.00',
      icon: Video,
      popular: false,
      features: [
        'Instant HD video connection on mobile/PC',
        'Direct doctor consultation from home',
        'Electronic prescription sent to health vault',
        'Integrated lab test order recommendations',
        'Available 7 days a week, 8am - 10pm'
      ]
    },
    {
      id: 'nurse',
      name: 'Certified Home Nursing',
      price: '$65.00',
      icon: Home,
      popular: false,
      features: [
        'Registered nurse arrives at your home',
        'Post-operative wound dressing & care',
        'Routine vitals, BP & glucose monitoring',
        'Direct coordination with attending doctor',
        'IV administration & medication support'
      ]
    }
  ];

  // Interactive FAQs
  const faqs = [
    {
      q: 'How does the Curix Zero Double-Booking Guarantee work?',
      a: 'Curix uses atomic slot-locking at the database level. When you view or book an appointment time, that exact calendar slot is reserved in real-time across the hospital system, preventing any chance of conflicting appointments.'
    },
    {
      q: 'Are digital prescriptions issued on Curix accepted at local pharmacies?',
      a: 'Yes. Every prescription generated on Curix includes official attending physician license credentials, diagnosis details, structured dosage line-items, and digital authorization seals compliant with outpatient pharmacy requirements.'
    },
    {
      q: 'Can I cancel or reschedule my consultation if my schedule changes?',
      a: 'Absolutely. Patients can cancel or reschedule any pending consultation directly from their personal dashboard with one click, releasing the slot back to the clinic queue.'
    },
    {
      q: 'How is my private personal health data protected?',
      a: 'Curix operates on stateless JWT encryption architecture and strictly adheres to HIPAA and international health data standards. Your medical charts, vitals, and prescription slips are inaccessible to unauthorized third parties.'
    },
    {
      q: 'What should I do if I need urgent or emergency care?',
      a: 'For acute emergencies, call our priority 24/7 hotline at 1-800-287-4922 or visit the nearest emergency room immediately. Curix also provides rapid hospital routing assistance for urgent outpatient cases.'
    }
  ];

  const filteredServices = clinicalServices.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative pt-20 bg-white text-slate-700 font-sans selection:bg-[#00A896] selection:text-white">
      
      {/* Self-contained CSS Animations for Background and Doctor Visuals */}
      <style>{`
        @keyframes floatDoctor {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes pulseGlowSlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.06);
          }
        }
        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitRotateReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes shadowBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.28;
          }
          50% {
            transform: scale(0.85);
            opacity: 0.16;
          }
        }
        .anim-doctor-float {
          animation: floatDoctor 5.5s ease-in-out infinite;
        }
        .anim-pulse-glow {
          animation: pulseGlowSlow 4s ease-in-out infinite;
        }
        .anim-orbit-spin {
          animation: orbitRotate 24s linear infinite;
        }
        .anim-orbit-reverse {
          animation: orbitRotateReverse 30s linear infinite;
        }
        .anim-shadow-breath {
          animation: shadowBreath 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. HERO SECTION (With High-Tech Animated Aura & Doctor Image Fitted on Rounding Bracket) */}
      <section id="home" className="relative pt-8 sm:pt-14 pb-20 overflow-hidden bg-mesh-aurora">
        {/* Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0A1C35 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Headline & Clinical Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Live Status Pill Beacon */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E6F8F5] border border-[#00A896]/30 text-[#00A896] text-[11px] font-extrabold tracking-wider uppercase shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                </span>
                <span>Next-Gen Clinical Healthcare Management</span>
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
                From licensed doctor consultations to certified nursing care and tamper-proof digital prescriptions, Curix delivers comprehensive outpatient clinical workflows built for precision and patient trust.
              </p>

              {/* Interactive Quick-Search Bar */}
              <div className="pt-1 max-w-lg">
                <div className="relative flex items-center shadow-md shadow-slate-900/5 rounded-full bg-white border border-slate-200/90 focus-within:border-[#00A896] focus-within:ring-4 focus-within:ring-[#00A896]/10 transition-all p-1.5">
                  <Search size={18} className="ml-3 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search symptoms or service (e.g. Heart, Skin, Lab)..."
                    className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.()}
                    className="px-5 py-2.5 rounded-full btn-curix-primary text-xs font-extrabold tracking-wide shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Find</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.()}
                  className="px-7 py-3.5 rounded-full btn-curix-primary text-xs font-extrabold tracking-wide flex items-center gap-2 group cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Reserve Doctor Slot</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#specialties"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-sm transition-all duration-200"
                >
                  Explore Specialties
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-7 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-bold">
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

            {/* Right Doctor Visual Canvas: Doctor Image Perfectly Fitted into the Rounding Bracket */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px]">
              
              {/* Animated Floating Container */}
              <div className="relative z-10 anim-doctor-float flex flex-col items-center">
                
                {/* Core Round Shape Frame Container (Unified Size) */}
                <div className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] flex items-center justify-center">
                  
                  {/* Pulsing Core Glow Behind the Round Shape */}
                  <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-[#00A896]/30 via-[#0BC2A8]/20 to-cyan-400/20 blur-3xl pointer-events-none anim-pulse-glow" />

                  {/* Outer Concentric Dashed Orbit Bracket (Tightly hugging the round shape with zero gap) */}
                  <div className="absolute -inset-3 sm:-inset-4 rounded-full border-2 border-dashed border-[#00A896]/50 pointer-events-none anim-orbit-spin flex items-center justify-between p-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00A896] shadow-[0_0_12px_#00A896]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0BC2A8] shadow-[0_0_10px_#0BC2A8]" />
                  </div>

                  {/* The Round Shape: Sleek Gradient Rim + Bevel Border + Mask */}
                  <div className="w-full h-full rounded-full p-2 sm:p-2.5 bg-gradient-to-b from-[#00A896] via-[#0BC2A8] to-slate-200/60 shadow-[0_20px_50px_rgba(10,28,53,0.22)] ring-8 ring-[#00A896]/15 flex items-center justify-center relative group">
                    
                    {/* Inner Circular Portal Framing Doctor */}
                    <div className="w-full h-full rounded-full overflow-hidden border-[5px] sm:border-[6px] border-white shadow-inner bg-gradient-to-b from-[#f7ede5] via-[#f5e6dc] to-[#eed9ce] relative flex items-center justify-center">
                      {doctorImage ? (
                        <img
                          src={doctorImage}
                          alt="Curix Medical Doctor"
                          style={{ transform: 'scale(1.32) translateY(5.5%)' }}
                          className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.36]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#00A896]">
                          <Stethoscope size={64} />
                        </div>
                      )}

                      {/* Subtle Vignette Overlay for Depth */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#0A1C35]/12 via-transparent to-white/10 pointer-events-none" />
                    </div>
                  </div>

                  {/* Minimalist On-Duty Status Chip (Tightly anchored to the lower-right curve of the round bracket) */}
                  <div className="absolute bottom-1 right-1 sm:bottom-3 sm:right-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-black text-[#0A1C35]">
                      Attending Staff Active
                    </span>
                  </div>

                </div>

                {/* Synchronized Floor Shadow Breathing Under the Round Shape */}
                <div className="w-[230px] sm:w-[300px] h-6 rounded-full bg-slate-900/30 blur-md pointer-events-none anim-shadow-breath mt-4 z-0" />
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

      {/* 3. INTERACTIVE CLINICAL SPECIALTIES & REAL-TIME SLOT EXPLORER */}
      <section id="specialties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
              INTERACTIVE SPECIALTY EXPLORER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1C35] tracking-tight">
              Select Specialty & Preview Available Today Slots
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-medium">
              Click any clinical discipline below to preview attending physicians and real-time open calendar slots.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => onOpenAuth?.()}
            className="text-xs font-bold text-[#00A896] hover:text-[#079181] flex items-center gap-1 transition self-start md:self-auto cursor-pointer"
          >
            <span>View Full Physician Directory</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Specialty Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          {specialties.map((spec) => {
            const Icon = spec.icon;
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 text-left group shadow-2xs cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#0A1C35] border-[#0A1C35] text-white shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-[#00A896]/40 hover:bg-[#E6F8F5]/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                  isSelected ? 'bg-white/10 text-[#0BC2A8]' : 'bg-slate-50 text-slate-600 group-hover:text-[#00A896] group-hover:bg-[#E6F8F5]'
                }`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className={`text-xs font-black transition-colors ${isSelected ? 'text-white' : 'text-[#0A1C35] group-hover:text-[#00A896]'}`}>
                    {spec.name}
                  </h4>
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {spec.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Live Slot Booking Card Preview */}
        <div className="p-7 sm:p-9 rounded-[32px] bg-gradient-to-br from-white via-slate-50/50 to-[#E6F8F5]/30 border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E6F8F5] text-[#00A896] border border-[#00A896]/20">
                Active Department: {currentSpecialtyData.name}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                ★ {currentSpecialtyData.rating} Clinical Rating
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#0A1C35]">
              {currentSpecialtyData.doctor}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {currentSpecialtyData.hospital} · Standard Fee: <strong className="text-[#00A896] font-mono text-sm">{currentSpecialtyData.fee}</strong>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              {currentSpecialtyData.bio}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                Today's Open Consultation Slots (Instant Booking):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {currentSpecialtyData.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onOpenAuth?.()}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#00A896] hover:bg-[#E6F8F5] text-[#0A1C35] hover:text-[#00A896] font-mono font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-1.5 group"
                  >
                    <Clock size={12} className="text-[#00A896]" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-[#0A1C35] flex items-center gap-2">
              <CheckCircle size={16} className="text-[#00A896]" />
              <span>Curix Verified Outpatient Assurance</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                Zero waiting queue with real-time arrival check-in
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                Downloadable electronic prescription with dosage instructions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                Full integration with hospital diagnostic labs
              </li>
            </ul>

            <button
              type="button"
              onClick={() => onOpenAuth?.()}
              className="w-full py-3.5 rounded-full btn-curix-primary text-white font-extrabold text-xs tracking-wide shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book Appointment in {currentSpecialtyData.name}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW CURIX WORKS (Interactive Step Switcher) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            SEAMLESS OUTPATIENT WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A1C35] tracking-tight">
            How Curix Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto font-medium">
            From registration to verified digital prescriptions in four guided clinical stages.
          </p>
        </div>

        {/* Interactive Step Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {processSteps.map((item) => {
            const isTabActive = activeStepTab === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStepTab(item.step)}
                className={`p-6 rounded-3xl border transition-all duration-200 text-left cursor-pointer flex flex-col justify-between ${
                  isTabActive
                    ? 'bg-white border-[#00A896] shadow-xl ring-2 ring-[#00A896]/20'
                    : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl font-black font-mono select-none ${isTabActive ? 'text-[#00A896]' : 'text-slate-300'}`}>
                    {item.step}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isTabActive ? 'bg-[#E6F8F5] text-[#00A896]' : 'bg-white text-slate-400'
                  }`}>
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1C35] mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Spotlight Preview Banner */}
        {(() => {
          const currentStep = processSteps.find(s => s.step === activeStepTab) || processSteps[0];
          return (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#E6F8F5]/60 border border-[#00A896]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {currentStep.step}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#00A896] tracking-wider block">
                    {currentStep.badge}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#0A1C35] mt-0.5">
                    {currentStep.preview}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth?.()}
                className="px-5 py-2.5 rounded-full bg-[#0A1C35] hover:bg-[#122847] text-white text-xs font-bold transition shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Try It on Curix Portal
              </button>
            </div>
          );
        })()}
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
                Hospital-grade clinical disciplines modeled after modern healthcare institutions to serve your entire family's health lifecycle.
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
            {filteredServices.map((srv, idx) => (
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

      {/* 6. INTERACTIVE CARE PLANS & ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">
            TRANSPARENT CLINICAL PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1C35] tracking-tight">
            Clear Healthcare Fees, Zero Hidden Costs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto font-medium">
            Choose the consultation channel that best fits your medical needs and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {carePlans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlanTab === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanTab(plan.id)}
                className={`p-8 rounded-[32px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#00A896] shadow-2xl ring-2 ring-[#00A896]/20 -translate-y-1'
                    : 'bg-white/90 border-slate-200/80 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    {plan.popular && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00A896] to-[#0BC2A8] text-white shadow-2xs">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[#0A1C35] mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-black text-[#0A1C35] font-mono">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ consultation</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="text-[#00A896] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAuth?.();
                    }}
                    className={`w-full py-3.5 rounded-full text-xs font-extrabold tracking-wide transition shadow-sm cursor-pointer ${
                      isSelected
                        ? 'btn-curix-primary text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            PATIENT KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1C35] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto font-medium">
            Everything you need to know about booking, prescriptions, and digital patient security.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? -1 : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-sm font-extrabold text-[#0A1C35]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#00A896] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. PRIORITY MEDICAL CALLOUT (Emergency & Home Visit) */}
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

      {/* 9. FOOTER */}
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
              <a href="#specialties" className="block hover:text-white transition">Specialties</a>
              <a href="#services" className="block hover:text-white transition">Clinical Services</a>
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
