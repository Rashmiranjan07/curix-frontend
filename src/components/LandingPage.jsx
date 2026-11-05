import React, { useState, useEffect } from 'react';
import doctorImage from '../assets/doctor.png';
import heart3dImage from '../assets/heart3d.jpg';
import maleDoctor3d from '../assets/male_doctor_3d.jpg';
import femaleDoctor3d from '../assets/female_doctor_3d.jpg';
import { 
  cancerImage, orthoImage, cardiacImage, gastroImage, 
  neuroImage, renalImage, transplantImage, motherChildImage, emergencyImage 
} from '../assets/centresImages';
import { patientApi, adminApi } from '../services/api';
import { 
  Calendar, Stethoscope, Building2, ShieldCheck, CheckCircle2, 
  Heart, Activity, Lock, PhoneCall, Clock, Award, 
  FileText, ArrowRight, Search, LogIn, Star,
  Sparkles, Check, ChevronLeft, ChevronRight, Zap, ChevronDown,
  HelpCircle, UserCheck, CheckCircle, Video, Home,
  RefreshCw, AlertCircle, Filter, ChevronUp, Play, Pause,
  User, Brain, Bone, Baby, Microscope, Pill
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function LandingPage({ onOpenAuth = () => {} }) {
  // Real Registered Doctors & Departments from Backend (Admin Registered)
  const [registeredDoctors, setRegisteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Horizontal Doctor Slider States (Infinite Loop)
  const [doctorSlideIndex, setDoctorSlideIndex] = useState(14);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(true);
  const [isDoctorSliderHovered, setIsDoctorSliderHovered] = useState(false);
  const [doctorSliderAutoPlay, setDoctorSliderAutoPlay] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive Items Per View Listener
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) setItemsPerView(1);
        else if (window.innerWidth < 1024) setItemsPerView(2);
        else setItemsPerView(4);
      }
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Interactive Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStepTab, setActiveStepTab] = useState('01');
  const [selectedPlanTab, setSelectedPlanTab] = useState('clinic');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Fetch real doctors and departments on mount
  useEffect(() => {
    fetchRegisteredDoctors();
    fetchRegisteredDepartments();
  }, []);

  const fetchRegisteredDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await patientApi.getDoctors();
      const list = res.data?.data || res.data;
      setRegisteredDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load registered doctors via patientApi:", err);
      try {
        const fallbackRes = await adminApi.getAllDoctors();
        const fallbackList = fallbackRes.data?.data || fallbackRes.data;
        setRegisteredDoctors(Array.isArray(fallbackList) ? fallbackList : []);
      } catch (e) {
        setRegisteredDoctors([]);
      }
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchRegisteredDepartments = async () => {
    try {
      const res = await adminApi.getDepartments();
      const list = res.data?.data || res.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load departments:", err);
      setDepartments([]);
    }
  };

  // Helper: Resolve Doctor Name from registered record
  const getDoctorDisplayName = (doc) => {
    if (!doc) return 'Attending Physician';
    const target = doc.doctor || doc.physician || doc;
    if (typeof target === 'string') return target.startsWith('Dr.') ? target : `Dr. ${target}`;
    if (target.firstName && target.lastName) return `Dr. ${target.firstName} ${target.lastName}`;
    if (target.fullName) return target.fullName.startsWith('Dr.') ? target.fullName : `Dr. ${target.fullName}`;
    if (target.doctorName) return target.doctorName.startsWith('Dr.') ? target.doctorName : `Dr. ${target.doctorName}`;
    if (target.name) return target.name.startsWith('Dr.') ? target.name : `Dr. ${target.name}`;
    if (target.user && target.user.firstName) return `Dr. ${target.user.firstName} ${target.user.lastName || ''}`;
    if (target.email) return `Dr. ${target.email.split('@')[0]}`;
    return `Doctor #${target.id || 'Specialist'}`;
  };

  // Helper: Extract Initials for Doctor Avatar
  const getDoctorInitials = (doc) => {
    const name = getDoctorDisplayName(doc).replace(/^Dr\.\s*/i, '');
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0]) return parts[0].slice(0, 2).toUpperCase();
    return 'DR';
  };

  // Helper: Resolve Doctor Gender for 3D Emoji Avatar
  const getDoctorGender = (doc) => {
    if (!doc) return 'MALE';
    if (doc.gender) {
      const g = String(doc.gender).toUpperCase();
      if (g.includes('FEMALE') || g === 'F') return 'FEMALE';
      if (g.includes('MALE') || g === 'M') return 'MALE';
    }
    const name = `${doc.firstName || ''} ${doc.name || ''} ${doc.doctorName || ''} ${doc.fullName || ''}`.toLowerCase();
    const femaleNames = [
      'sarah', 'priya', 'emily', 'anita', 'mary', 'jessica', 'claire', 'elizabeth',
      'lisa', 'emma', 'olivia', 'sophia', 'rachel', 'neha', 'pooja', 'sneha', 'anjali',
      'aarti', 'kavita', 'sunita', 'meera', 'deepa', 'conor', 'fatima', 'aisha', 'maya', 'aditi', 'sanya', 'ananya'
    ];
    if (femaleNames.some((fn) => name.includes(fn))) return "FEMALE";
    return 'MALE';
  };

  const getDoctor3dImage = (doc) => {
    if (doc?.image || doc?.profileImage) return doc.image || doc.profileImage;
    return getDoctorGender(doc) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
  };

  const getDoctor3dEmoji = (doc) => {
    return getDoctorGender(doc) === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️';
  };

  // Website's Official Doctors (Complete 14 Doctors Faculty matching the website database)
  const defaultSampleDoctors = [
    {
      id: 1,
      firstName: 'Edward',
      lastName: 'Smith',
      fullName: 'Dr. Edward Smith',
      specialty: 'Interventional Cardiology',
      departmentName: 'Cardiology',
      gender: 'MALE',
      qualification: 'MBBS, MD (Cardiology)',
      experienceYears: 12
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Conor',
      fullName: 'Dr. Sarah Conor',
      specialty: 'Neurologist',
      departmentName: 'Neurology',
      gender: 'FEMALE',
      qualification: 'MBBS, DM (Neurology)',
      experienceYears: 9
    },
    {
      id: 3,
      firstName: 'Arjun',
      lastName: 'Sharma',
      fullName: 'Dr. Arjun Sharma',
      specialty: 'General Physician',
      departmentName: 'General Medicine',
      gender: 'MALE',
      qualification: 'MBBS, MD (Internal Medicine)',
      experienceYears: 8
    },
    {
      id: 4,
      firstName: 'Vikram',
      lastName: 'Singh',
      fullName: 'Dr. Vikram Singh',
      specialty: 'ENT Surgeon',
      departmentName: 'ENT',
      gender: 'MALE',
      qualification: 'MS (ENT), DNB',
      experienceYears: 14
    },
    {
      id: 5,
      firstName: 'Aditi',
      lastName: 'Das',
      fullName: 'Dr. Aditi Das',
      specialty: 'Orthodontist & Dental Surgeon',
      departmentName: 'Dentistry',
      gender: 'FEMALE',
      qualification: 'BDS, MDS (Orthodontics)',
      experienceYears: 7
    },
    {
      id: 6,
      firstName: 'Kishan',
      lastName: 'Malhotra',
      fullName: 'Dr. Kishan Malhotra',
      specialty: 'Clinical Nephrologist',
      departmentName: 'Nephrology',
      gender: 'MALE',
      qualification: 'MBBS, DM (Nephrology)',
      experienceYears: 11
    },
    {
      id: 7,
      firstName: 'Sanya',
      lastName: 'Patel',
      fullName: 'Dr. Sanya Patel',
      specialty: 'Respiratory Medicine Specialist',
      departmentName: 'Pulmonology',
      gender: 'FEMALE',
      qualification: 'MBBS, MD (Pulmonary Medicine)',
      experienceYears: 10
    },
    {
      id: 8,
      firstName: 'Rajesh',
      lastName: 'Iyer',
      fullName: 'Dr. Rajesh Iyer',
      specialty: 'Orthopaedic & Joint Replacement',
      departmentName: 'Orthopaedics',
      gender: 'MALE',
      qualification: 'MS (Ortho), M.Ch',
      experienceYears: 15
    },
    {
      id: 9,
      firstName: 'Meera',
      lastName: 'Nair',
      fullName: 'Dr. Meera Nair',
      specialty: 'Gastroenterologist & Hepatologist',
      departmentName: 'Gastrosciences',
      gender: 'FEMALE',
      qualification: 'MBBS, DM (Gastroenterology)',
      experienceYears: 11
    },
    {
      id: 10,
      firstName: 'Amitav',
      lastName: 'Roy',
      fullName: 'Dr. Amitav Roy',
      specialty: 'Precision Oncology Specialist',
      departmentName: 'Oncology',
      gender: 'MALE',
      qualification: 'MD, DM (Medical Oncology)',
      experienceYears: 13
    },
    {
      id: 11,
      firstName: 'Pooja',
      lastName: 'Verma',
      fullName: 'Dr. Pooja Verma',
      specialty: 'High-Risk Obstetrics & Gynaecology',
      departmentName: 'Mother & Child',
      gender: 'FEMALE',
      qualification: 'MS (OBG), FICOG',
      experienceYears: 9
    },
    {
      id: 12,
      firstName: 'Devendra',
      lastName: 'Joshi',
      fullName: 'Dr. Devendra Joshi',
      specialty: 'Emergency & Critical Trauma Surgeon',
      departmentName: 'Emergency Medicine',
      gender: 'MALE',
      qualification: 'MBBS, MEM (Emergency)',
      experienceYears: 12
    },
    {
      id: 13,
      firstName: 'Ananya',
      lastName: 'Sen',
      fullName: 'Dr. Ananya Sen',
      specialty: 'Dermatologist & Cosmetologist',
      departmentName: 'Dermatology',
      gender: 'FEMALE',
      qualification: 'MD (Dermatology), DNB',
      experienceYears: 8
    },
    {
      id: 14,
      firstName: 'Farhan',
      lastName: 'Akhtar',
      fullName: 'Dr. Farhan Akhtar',
      specialty: 'Multi-Organ Transplant Surgeon',
      departmentName: 'Transplant Surgery',
      gender: 'MALE',
      qualification: 'MS, M.Ch (Surgical Gastroenterology)',
      experienceYears: 16
    }
  ];

  // Helper: Get Doctor Specialty display
  const getDoctorSpecialtyDisplay = (doc) => {
    if (doc?.specialty) return doc.specialty;
    if (doc?.specialization) return doc.specialization;
    if (doc?.departmentName) return doc.departmentName;
    if (doc?.department?.name) return doc.department.name;
    return 'General Physician';
  };

  // Real doctors present in the website: when registeredDoctors are loaded from the database, use ONLY those doctors!
  const allDoctorsList = React.useMemo(() => {
    if (registeredDoctors && registeredDoctors.length > 0) {
      return registeredDoctors;
    }
    return defaultSampleDoctors;
  }, [registeredDoctors]);

  // Filtered doctors if hero search query entered
  const displayDoctorsList = React.useMemo(() => {
    if (!searchQuery.trim()) return allDoctorsList;
    const q = searchQuery.toLowerCase();
    const matches = allDoctorsList.filter((doc) => {
      const name = getDoctorDisplayName(doc).toLowerCase();
      const spec = getDoctorSpecialtyDisplay(doc).toLowerCase();
      const dept = (doc.departmentName || doc.department?.name || '').toLowerCase();
      return name.includes(q) || spec.includes(q) || dept.includes(q);
    });
    return matches.length > 0 ? matches : allDoctorsList;
  }, [searchQuery, allDoctorsList]);

  const docCount = displayDoctorsList.length;

  // Infinite repeating doctors buffer: 3 sets [0..N-1, 0..N-1, 0..N-1]
  const infiniteDoctors = React.useMemo(() => {
    if (docCount === 0) return [];
    return [...displayDoctorsList, ...displayDoctorsList, ...displayDoctorsList];
  }, [displayDoctorsList, docCount]);

  // Initialize slideIndex to the middle set (docCount) so we can loop infinitely in both directions
  useEffect(() => {
    if (docCount > 0) {
      setIsSlideTransitioning(false);
      setDoctorSlideIndex(docCount);
    }
  }, [docCount, searchQuery]);

  // Re-enable CSS transition after a seamless jump
  useEffect(() => {
    if (!isSlideTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSlideTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isSlideTransitioning]);

  // Handle transition end on the sliding track for seamless continuous loop (11-14 -> 12-1 -> 13-2 -> 14-3 -> 1-4)
  const handleSlideTransitionEnd = () => {
    if (docCount <= itemsPerView) return;
    if (doctorSlideIndex >= 2 * docCount) {
      setIsSlideTransitioning(false);
      setDoctorSlideIndex(doctorSlideIndex - docCount);
    } else if (doctorSlideIndex < docCount) {
      setIsSlideTransitioning(false);
      setDoctorSlideIndex(doctorSlideIndex + docCount);
    }
  };

  // Auto-play timer for infinite continuous loop
  useEffect(() => {
    if (!doctorSliderAutoPlay || isDoctorSliderHovered || docCount <= itemsPerView) return;
    const interval = setInterval(() => {
      setIsSlideTransitioning(true);
      setDoctorSlideIndex((prev) => prev + 1);
    }, 3800);
    return () => clearInterval(interval);
  }, [doctorSliderAutoPlay, isDoctorSliderHovered, docCount, itemsPerView]);

  const handleNextDoctorSlide = () => {
    if (docCount <= itemsPerView) return;
    setIsSlideTransitioning(true);
    setDoctorSlideIndex((prev) => prev + 1);
  };

  const handlePrevDoctorSlide = () => {
    if (docCount <= itemsPerView) return;
    setIsSlideTransitioning(true);
    setDoctorSlideIndex((prev) => prev - 1);
  };

  // 9 Centres of Excellence & Specialized Clinical Care
  const centresOfExcellence = [
    {
      id: 'cancer',
      title: 'Cancer Institute',
      categoryTag: 'Tertiary Oncology',
      description: 'Comprehensive medical, surgical & precision nuclear oncology with robotic tumour resection.',
      servicePill: 'In-Patient & Outpatient Care',
      equipmentBadge: 'LINAC 6MV · PRECISION',
      bgGradient: 'from-[#E3F2FB] via-[#E8F4FC] to-[#D0E7F7]',
      border: 'border-[#BDDDF4]/80',
      badgeColor: 'text-sky-800 bg-sky-100/90 border-sky-200'
    },
    {
      id: 'ortho',
      title: 'Institute of Orthopaedics & Joint Replacement',
      categoryTag: 'Robotic Surgery',
      description: 'Mako robotic total knee and hip replacement, arthroscopic repair, and spine surgery.',
      servicePill: 'Rapid Rehab & Physio Care',
      equipmentBadge: 'ROBOTIC MAKO · 0.1mm',
      bgGradient: 'from-[#E3F6EF] via-[#EAF8F3] to-[#CDEFE4]',
      border: 'border-[#BCE7D8]/80',
      badgeColor: 'text-emerald-800 bg-emerald-100/90 border-emerald-200'
    },
    {
      id: 'cardiac',
      title: 'Institute of Cardiac Sciences',
      categoryTag: 'Cath Lab & CTVS',
      description: '24/7 primary angioplasty, heart failure clinic, valve reconstruction, and arrhythmia care.',
      servicePill: 'Emergency Cath Lab 24/7',
      equipmentBadge: 'CATH LAB · 72 BPM ECG',
      bgGradient: 'from-[#FDECEC] via-[#FDF1F0] to-[#FCE0D4]',
      border: 'border-[#F8D4C8]/80',
      badgeColor: 'text-rose-800 bg-rose-100/90 border-rose-200'
    },
    {
      id: 'gastro',
      title: 'Institute of Gastrosciences',
      categoryTag: 'GI Surgery & 4K Endo',
      description: 'Advanced diagnostic 4K endoscopy, liver disease protocols, and laparoscopic HPB surgery.',
      servicePill: 'Daycare Endoscopy Suite',
      equipmentBadge: '4K ENDO · 60fps',
      bgGradient: 'from-[#E8F1FB] via-[#EDF5FC] to-[#D6E9F7]',
      border: 'border-[#C2E0F5]/80',
      badgeColor: 'text-blue-800 bg-blue-100/90 border-blue-200'
    },
    {
      id: 'neuro',
      title: 'Institute of Neurosciences',
      categoryTag: 'Neuro & Brain Surgery',
      description: 'Golden-hour stroke interventions, stereotactic brain tumour navigation, and spine care.',
      servicePill: 'Comprehensive Stroke Unit',
      equipmentBadge: 'NEURO-NAV · 120Hz',
      bgGradient: 'from-[#E6F3FC] via-[#ECF6FD] to-[#CEE7F8]',
      border: 'border-[#BFE0F7]/80',
      badgeColor: 'text-sky-800 bg-sky-100/90 border-sky-200'
    },
    {
      id: 'renal',
      title: 'Institute of Renal Sciences',
      categoryTag: 'Nephrology & Urology',
      description: 'Continuous renal replacement therapy, laser stone removal, and comprehensive urology.',
      servicePill: '24/7 Dialysis Stations',
      equipmentBadge: 'CRRT · 150ml/min',
      bgGradient: 'from-[#F3EDFB] via-[#F6F1FD] to-[#E3D9F8]',
      border: 'border-[#D9CAF4]/80',
      badgeColor: 'text-purple-800 bg-purple-100/90 border-purple-200'
    },
    {
      id: 'transplant',
      title: 'Institute of Transplant',
      categoryTag: 'Multi-Organ Transplant',
      description: 'Dedicated post-transplant cleanroom ICUs, ex-vivo organ perfusion, and stem cell therapy.',
      servicePill: 'Sterile Isolation ICU',
      equipmentBadge: 'ORGAN POD · 4.0°C',
      bgGradient: 'from-[#E9F4FA] via-[#EEF7FB] to-[#D6EBF6]',
      border: 'border-[#C2E3F4]/80',
      badgeColor: 'text-teal-800 bg-teal-100/90 border-teal-200'
    },
    {
      id: 'mother-child',
      title: 'Institute of Mother & Child',
      categoryTag: 'Maternal & Level-3 NICU',
      description: 'High-risk obstetrics, neonatal intensive care incubators, and specialized paediatric care.',
      servicePill: 'Level-3 Neonatal ICU',
      equipmentBadge: 'NICU POD · 36.8°C',
      bgGradient: 'from-[#FDEFF3] via-[#FEF3F6] to-[#FCDCE6]',
      border: 'border-[#F8CCD9]/80',
      badgeColor: 'text-pink-800 bg-pink-100/90 border-pink-200'
    },
    {
      id: 'emergency',
      title: 'Institute of Emergency & Critical Care',
      categoryTag: '24/7 Trauma & Critical ICU',
      description: 'Rapid resuscitation bays, telemetry-equipped life support ambulances, and multi-bed ICU.',
      servicePill: 'Priority Zero-Wait Triage',
      equipmentBadge: 'BIPHASIC · 200J 24/7',
      bgGradient: 'from-[#ECF7F6] via-[#EFF9F8] to-[#D6EEEB]',
      border: 'border-[#C1E6E1]/80',
      badgeColor: 'text-teal-900 bg-teal-100/90 border-teal-200'
    }
  ];

  const handleCentreClick = (centre) => {
    const deptMap = {
      cancer: 'Oncology',
      ortho: 'Orthopaedics',
      cardiac: 'Cardiology',
      gastro: 'Gastroenterology',
      neuro: 'Neurology',
      renal: 'Nephrology',
      transplant: 'Surgery',
      'mother-child': 'Pediatrics',
      emergency: 'Emergency'
    };
    const targetDept = deptMap[centre.id];
    if (targetDept) {
      const match = departments.find(d => 
        (d.name || d.departmentName || '').toLowerCase().includes(targetDept.toLowerCase())
      );
      if (match) {
        setSelectedDeptFilter(match.id || match.name);
      } else {
        setDoctorSearchTerm(targetDept);
      }
    }
    const el = document.getElementById('specialties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // 3D Animated Hospital Equipment Design Component
  const renderHospitalEquipment = (type, badge) => {
    switch (type) {
      case 'cancer':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(2,132,199,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-sky-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-teal-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8"/>
                  <stop offset="100%" stopColor="#0284C7"/>
                </linearGradient>
                <linearGradient id="dnaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399"/>
                  <stop offset="100%" stopColor="#00A896"/>
                </linearGradient>
                <radialGradient id="linacGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45"/>
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Outer LINAC Radiation Collimator Ring */}
              <circle cx="50" cy="50" r="44" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.45" />
              <circle cx="50" cy="50" r="37" stroke="url(#dnaGrad2)" strokeWidth="2" opacity="0.65" />
              <circle cx="50" cy="50" r="28" fill="url(#linacGlow)" />
              {/* Rotating Radiation Reticle */}
              <g className="anim-orbit-spin" style={{ transformOrigin: '50px 50px' }}>
                <line x1="50" y1="12" x2="50" y2="24" stroke="#00A896" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="76" x2="50" y2="88" stroke="#00A896" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="50" x2="24" y2="50" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="76" y1="50" x2="88" y2="50" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="18" r="2" fill="#38BDF8" />
                <circle cx="50" cy="82" r="2" fill="#38BDF8" />
              </g>
              {/* 3D Double Helix DNA Molecular Architecture */}
              <path d="M28 20 C42 34, 58 34, 72 20" stroke="url(#dnaGrad2)" strokeWidth="3" strokeLinecap="round" />
              <path d="M28 50 C42 34, 58 34, 72 50" stroke="url(#dnaGrad1)" strokeWidth="3" strokeLinecap="round" />
              <path d="M28 50 C42 66, 58 66, 72 50" stroke="url(#dnaGrad2)" strokeWidth="3" strokeLinecap="round" />
              <path d="M28 80 C42 66, 58 66, 72 80" stroke="url(#dnaGrad1)" strokeWidth="3" strokeLinecap="round" />
              {/* Cross Hydrogen Bonds */}
              <line x1="36" y1="28" x2="64" y2="28" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <circle cx="50" cy="28" r="3" fill="#00A896" />
              <line x1="38" y1="42" x2="62" y2="42" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="38" y1="58" x2="62" y2="58" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="36" y1="72" x2="64" y2="72" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <circle cx="50" cy="72" r="3" fill="#0284C7" />
              {/* High-Energy Stereotactic Center Emitter */}
              <circle cx="50" cy="50" r="7" fill="#00A896" className="drop-shadow-[0_0_8px_#00A896]" />
              <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-sky-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              <span>LINAC · 6MV</span>
            </div>
          </div>
        );

      case 'ortho':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(16,185,129,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-emerald-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="titaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94A3B8"/>
                  <stop offset="50%" stopColor="#64748B"/>
                  <stop offset="100%" stopColor="#334155"/>
                </linearGradient>
                <linearGradient id="implantGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981"/>
                  <stop offset="50%" stopColor="#059669"/>
                  <stop offset="100%" stopColor="#047857"/>
                </linearGradient>
              </defs>
              {/* Robotic Base Platform */}
              <rect x="20" y="80" width="60" height="11" rx="4" fill="url(#titaniumGrad)" stroke="#10B981" strokeWidth="1.5" />
              {/* 3D Articulated Robotic Arm Segment 1 */}
              <circle cx="34" cy="74" r="6.5" fill="#047857" stroke="#10B981" strokeWidth="2" />
              <line x1="34" y1="74" x2="48" y2="48" stroke="url(#titaniumGrad)" strokeWidth="6" strokeLinecap="round" />
              {/* Joint Elbow Bearing */}
              <circle cx="48" cy="48" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Segment 2 Arm to Surgical Tool */}
              <line x1="48" y1="48" x2="68" y2="30" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
              {/* Precision Tool Knuckle & Calibration Laser */}
              <circle cx="68" cy="30" r="4.5" fill="#059669" />
              <line x1="68" y1="30" x2="78" y2="20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              {/* Laser Beam to 3D Knee Implant */}
              <line x1="68" y1="30" x2="40" y2="22" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 2" className="anim-scan-wave" />
              {/* 3D Bionic Titanium Femoral & Tibial Component */}
              <path d="M22 18 C30 14, 46 14, 52 24 C50 34, 38 38, 28 36 Z" fill="url(#implantGrad)" stroke="#A7F3D0" strokeWidth="1.5" />
              <rect x="24" y="38" width="26" height="5" rx="2" fill="#64748B" />
              <line x1="37" y1="43" x2="37" y2="54" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
              {/* Alignment Radar Rings */}
              <circle cx="68" cy="30" r="12" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-emerald-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ROBOTIC · 0.1mm</span>
            </div>
          </div>
        );

      case 'cardiac':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(225,29,72,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-rose-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <radialGradient id="heart3DGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FB7185"/>
                  <stop offset="45%" stopColor="#E11D48"/>
                  <stop offset="90%" stopColor="#881337"/>
                  <stop offset="100%" stopColor="#4C0519"/>
                </radialGradient>
                <linearGradient id="aortaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDA4AF"/>
                  <stop offset="100%" stopColor="#BE123C"/>
                </linearGradient>
              </defs>
              {/* Cath Lab Background Waveform Grid */}
              <circle cx="50" cy="50" r="42" stroke="#FDA4AF" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              {/* 3D Anatomical Heart with Organic Beating Motion */}
              <g className="anim-heartbeat">
                {/* Aorta Arch & Great Vessels */}
                <path d="M42 26 C42 12, 58 12, 58 24" stroke="url(#aortaGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <line x1="46" y1="14" x2="46" y2="8" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
                <line x1="52" y1="13" x2="54" y2="8" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="16" x2="62" y2="10" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M58 24 C62 20, 68 20, 68 28" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                {/* 3D Ventricle Muscle Silhouette */}
                <path 
                  d="M50 82 C22 62, 14 42, 22 28 C28 18, 42 18, 50 28 C58 18, 72 18, 78 28 C86 42, 78 62, 50 82 Z" 
                  fill="url(#heart3DGrad)" 
                  stroke="#9F1239" 
                  strokeWidth="2" 
                />
                {/* Coronary Arterial Arborization Branches */}
                <path d="M48 34 Q42 46, 38 56 Q34 62, 32 68" stroke="#FFE4E6" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none" />
                <path d="M44 44 Q50 50, 56 60 Q60 66, 62 70" stroke="#FFE4E6" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" fill="none" />
                <circle cx="50" cy="82" r="3" fill="#E11D48" />
              </g>
              {/* Active High-Definition ECG Waveform Trace */}
              <path 
                d="M10 52 L26 52 L30 52 L34 45 L38 62 L44 32 L50 68 L54 48 L58 52 L88 52" 
                stroke="#10B981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]"
              />
              <circle cx="88" cy="52" r="3.5" fill="#34D399" className="drop-shadow-[0_0_8px_#34D399] animate-ping" />
              <circle cx="88" cy="52" r="2.5" fill="#FFFFFF" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-rose-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>72 BPM · ECG</span>
            </div>
          </div>
        );

      case 'gastro':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(30,58,138,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-blue-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="endoTowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A"/>
                  <stop offset="100%" stopColor="#0F172A"/>
                </linearGradient>
                <linearGradient id="probeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* 3D Endoscopy Mobile Cart & Tower Chassis */}
              <rect x="22" y="14" width="56" height="68" rx="8" fill="url(#endoTowerGrad)" stroke="#3B82F6" strokeWidth="2" />
              {/* Main 4K Ultra-HD Diagnostic Screen */}
              <rect x="28" y="20" width="44" height="28" rx="4" fill="#020617" stroke="#60A5FA" strokeWidth="1.5" />
              {/* High-Contrast Digestive Lumen Display Wave */}
              <path d="M32 34 Q40 25, 50 34 T68 34" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <ellipse cx="50" cy="34" rx="8" ry="5" fill="#38BDF8" opacity="0.3" />
              <circle cx="58" cy="30" r="2.5" fill="#34D399" className="animate-pulse" />
              {/* Control Panel Shelf with Illumination Dials */}
              <rect x="28" y="52" width="44" height="24" rx="4" fill="#1E293B" />
              <circle cx="36" cy="62" r="3" fill="#60A5FA" />
              <circle cx="46" cy="62" r="3" fill="#34D399" />
              <circle cx="56" cy="62" r="3" fill="#F59E0B" />
              <rect x="63" y="58" width="6" height="8" rx="1.5" fill="#94A3B8" />
              {/* Flexible Fiber-Optic Probe Cable */}
              <path d="M46 76 C46 90, 78 88, 78 72 C78 58, 86 52, 90 52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* 4K Sapphire Lens with Active Emitting Light Cone */}
              <polygon points="90,52 98,44 98,60" fill="url(#probeBeam)" />
              <circle cx="90" cy="52" r="4.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" className="drop-shadow-[0_0_8px_#38BDF8]" />
              <circle cx="90" cy="52" r="2" fill="#38BDF8" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-blue-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>4K ENDO · 60fps</span>
            </div>
          </div>
        );

      case 'neuro':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(2,132,199,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-sky-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-indigo-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <radialGradient id="neuroHoloGrad" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#BAE6FD"/>
                  <stop offset="60%" stopColor="#38BDF8"/>
                  <stop offset="100%" stopColor="#0369A1"/>
                </radialGradient>
              </defs>
              {/* Stereotactic 3D Coordinate Grid */}
              <ellipse cx="50" cy="50" rx="43" ry="34" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
              <line x1="50" y1="12" x2="50" y2="88" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <line x1="8" y1="50" x2="92" y2="50" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              {/* 3D Translucent Holographic Brain Hemisphere */}
              <path 
                d="M32 48 C24 40, 26 26, 38 22 C46 20, 50 26, 50 34 C50 26, 54 20, 62 22 C74 26, 76 40, 68 48 C76 56, 74 72, 60 74 C54 74, 52 70, 50 64 C48 70, 46 74, 40 74 C26 72, 24 56, 32 48 Z" 
                fill="url(#neuroHoloGrad)" 
                stroke="#0284C7" 
                strokeWidth="2" 
                opacity="0.9"
              />
              {/* Active Synaptic Action Potentials & Neural Firing Network */}
              <g className="anim-synapse">
                <circle cx="36" cy="34" r="3.5" fill="#FACC15" className="drop-shadow-[0_0_6px_#FACC15]" />
                <circle cx="64" cy="34" r="3.5" fill="#FACC15" className="drop-shadow-[0_0_6px_#FACC15]" />
                <circle cx="42" cy="52" r="3" fill="#FFFFFF" className="drop-shadow-[0_0_6px_#FFFFFF]" />
                <circle cx="58" cy="52" r="3" fill="#FFFFFF" className="drop-shadow-[0_0_6px_#FFFFFF]" />
                <circle cx="50" cy="40" r="4" fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
                <line x1="36" y1="34" x2="50" y2="40" stroke="#FACC15" strokeWidth="2" />
                <line x1="64" y1="34" x2="50" y2="40" stroke="#FACC15" strokeWidth="2" />
                <line x1="42" y1="52" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="58" y1="52" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="42" y1="52" x2="58" y2="52" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />
              </g>
              {/* Target Navigation Reticle */}
              <circle cx="50" cy="40" r="10" stroke="#00A896" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-sky-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              <span>NEURO-NAV · 120Hz</span>
            </div>
          </div>
        );

      case 'renal':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(168,85,247,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-purple-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-indigo-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="dialyzerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#581C87"/>
                  <stop offset="100%" stopColor="#2E1065"/>
                </linearGradient>
                <linearGradient id="filterFiberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E9D5FF"/>
                  <stop offset="50%" stopColor="#C084FC"/>
                  <stop offset="100%" stopColor="#9333EA"/>
                </linearGradient>
              </defs>
              {/* Dialysis Machine Tower Frame */}
              <rect x="22" y="16" width="56" height="72" rx="8" fill="url(#dialyzerGrad)" stroke="#A855F7" strokeWidth="2" />
              {/* Dual Transparent High-Flux Dialyzer Columns */}
              <rect x="28" y="24" width="18" height="46" rx="4" fill="url(#filterFiberGrad)" stroke="#D8B4FE" strokeWidth="1.5" />
              <line x1="37" y1="26" x2="37" y2="68" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
              <rect x="54" y="24" width="18" height="46" rx="4" fill="url(#filterFiberGrad)" stroke="#D8B4FE" strokeWidth="1.5" />
              <line x1="63" y1="26" x2="63" y2="68" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Arterial (Red) & Venous (Blue) Extracorporeal Blood Lines with Fluid Flow */}
              <path d="M37 24 C37 12, 63 12, 63 24" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none" className="anim-fluid-flow" />
              <path d="M37 70 C37 84, 63 84, 63 70" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" className="anim-fluid-flow" />
              {/* Peristaltic Roller Pump & Digital Pressure Transducer */}
              <circle cx="50" cy="50" r="7.5" fill="#FAF5FF" stroke="#7E22CE" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="3" fill="#9333EA" />
              <line x1="50" y1="43" x2="50" y2="57" stroke="#7E22CE" strokeWidth="1.5" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-purple-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>CRRT · 150ml/min</span>
            </div>
          </div>
        );

      case 'transplant':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(13,148,136,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-teal-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-cyan-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="perfusionDome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#CCFBF1" stopOpacity="0.85"/>
                  <stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.2"/>
                </linearGradient>
                <linearGradient id="organGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2DD4BF"/>
                  <stop offset="100%" stopColor="#0F766E"/>
                </linearGradient>
              </defs>
              {/* 3D Hypothermic Perfusion Pod Base Console */}
              <rect x="20" y="66" width="60" height="20" rx="5" fill="#0F766E" stroke="#14B8A6" strokeWidth="2" />
              <circle cx="32" cy="76" r="3.5" fill="#2DD4BF" />
              <circle cx="44" cy="76" r="3.5" fill="#38BDF8" />
              <rect x="54" y="73" width="18" height="6" rx="2" fill="#042F2E" />
              {/* Sterile Cryogenic Glass Preservation Dome */}
              <path d="M24 66 C24 30, 76 30, 76 66 Z" fill="url(#perfusionDome)" stroke="#0D9488" strokeWidth="2" />
              {/* Glass Specular Glare Reflection */}
              <path d="M30 60 C30 38, 48 34, 48 34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none" />
              {/* Suspended Living Donor Graft Hologram */}
              <ellipse cx="50" cy="50" rx="15" ry="11" fill="url(#organGlow)" stroke="#5EEAD4" strokeWidth="1.5" />
              <path d="M42 50 Q50 44, 58 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Oxygenation Nutrient Micro-Cannula Tubes */}
              <line x1="36" y1="66" x2="44" y2="55" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="64" y1="66" x2="56" y2="55" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="48" cy="46" r="1.5" fill="#FFFFFF" className="animate-ping" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-teal-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>ORGAN POD · 4.0°C</span>
            </div>
          </div>
        );

      case 'mother-child':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(244,63,94,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-pink-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-rose-300/10 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <radialGradient id="warmthGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Radiant Warmer Overhead Lamp Canopy */}
              <path d="M28 20 C28 14, 72 14, 72 20 L78 26 L22 26 Z" fill="#F43F5E" stroke="#BE185D" strokeWidth="1.5" />
              {/* Infrared Gentle Warming Rays */}
              <line x1="36" y1="28" x2="36" y2="38" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="50" y1="28" x2="50" y2="38" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="64" y1="28" x2="64" y2="38" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* 3D Acrylic Infant Incubator Isolette Bassinet */}
              <rect x="20" y="38" width="60" height="28" rx="8" fill="#FCE7F3" stroke="#F43F5E" strokeWidth="2" />
              <circle cx="50" cy="52" r="22" fill="url(#warmthGlow)" />
              {/* Dual Silicone Hand Access Port Grommets */}
              <circle cx="34" cy="52" r="6.5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="66" cy="52" r="6.5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Neonatal Mattress Bed */}
              <rect x="28" y="58" width="44" height="5" rx="2" fill="#FDA4AF" />
              {/* Heavy Duty Mobile Pedestal Base & Wheels */}
              <line x1="50" y1="66" x2="50" y2="76" stroke="#9D174D" strokeWidth="4" />
              <rect x="26" y="76" width="48" height="8" rx="3" fill="#831843" />
              <circle cx="32" cy="87" r="3.5" fill="#9D174D" />
              <circle cx="68" cy="87" r="3.5" fill="#9D174D" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-pink-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span>NICU · 36.8°C</span>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="w-[110px] sm:w-[120px] h-[110px] sm:h-[120px] rounded-2xl relative flex items-center justify-center p-1.5 shrink-0 bg-white/90 shadow-[0_4px_16px_rgba(239,68,68,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-teal-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/15 via-teal-300/15 to-transparent anim-equipment-pulse" />
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent anim-laser-vertical pointer-events-none z-10" />
            <svg className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] relative z-10" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="defibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#134E4A"/>
                  <stop offset="100%" stopColor="#042F2E"/>
                </linearGradient>
              </defs>
              {/* 24/7 Red ER Emergency Beacon Dome with Active Strobe */}
              <g className="anim-radar-sweep" style={{ transformOrigin: '50px 18px' }}>
                <circle cx="50" cy="18" r="7" fill="#EF4444" className="drop-shadow-[0_0_10px_#EF4444]" />
                <polygon points="50,18 70,8 70,28" fill="#EF4444" opacity="0.4" />
              </g>
              <circle cx="50" cy="18" r="4.5" fill="#FCA5A5" />
              {/* 3D Ruggedized Defibrillator Main Chassis */}
              <rect x="20" y="24" width="60" height="58" rx="8" fill="url(#defibGrad)" stroke="#0D9488" strokeWidth="2" />
              {/* High-Contrast Vital Signs Monitor */}
              <rect x="26" y="30" width="48" height="26" rx="4" fill="#020617" stroke="#14B8A6" strokeWidth="1.5" />
              {/* Rapid Defib Wave Rhythm Strip */}
              <path d="M30 43 L38 43 L42 35 L45 50 L49 38 L53 45 L68 45" stroke="#34D399" strokeWidth="2" strokeLinecap="round" fill="none" className="drop-shadow-[0_0_6px_#34D399]" />
              {/* Dual Shock Discharge Paddles with Ergonomic Grips */}
              <rect x="28" y="62" width="18" height="14" rx="3" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="37" cy="69" r="2.5" fill="#FFFFFF" />
              <rect x="54" y="62" width="18" height="14" rx="3" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="63" cy="69" r="2.5" fill="#FFFFFF" />
              {/* Heavy Coiled Cable Connections */}
              <path d="M37 76 C37 84, 46 84, 46 76" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M63 76 C63 84, 54 84, 54 76" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-slate-950/85 text-white font-mono text-[7.5px] font-bold tracking-wider z-20 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>BIPHASIC · 200J</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
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
        @keyframes medicalPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes scanWave {
          0% {
            stroke-dashoffset: 80;
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
        }
        .anim-equipment-pulse {
          animation: medicalPulse 3.5s ease-in-out infinite;
        }
        @keyframes heartbeatBeat {
          0%, 100% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.14);
          }
          70% {
            transform: scale(1);
          }
        }
        @keyframes radarSweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes laserScanVertical {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.15;
          }
          50% {
            transform: translateY(90px);
            opacity: 0.85;
          }
        }
        @keyframes synapseFlicker {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 6px #38BDF8);
          }
        }
        @keyframes fluidFlow {
          0% {
            stroke-dashoffset: 40;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .anim-heartbeat {
          transform-origin: 50px 50px;
          animation: heartbeatBeat 1.8s ease-in-out infinite;
        }
        .anim-radar-sweep {
          animation: radarSweep 4s linear infinite;
        }
        .anim-laser-vertical {
          animation: laserScanVertical 2.6s ease-in-out infinite;
        }
        .anim-synapse {
          animation: synapseFlicker 1.8s ease-in-out infinite;
        }
        .anim-fluid-flow {
          stroke-dasharray: 8 4;
          animation: fluidFlow 1.4s linear infinite;
        }
        .anim-scan-wave {
          stroke-dasharray: 40;
          animation: scanWave 2.2s linear infinite;
        }
        @keyframes heartPulse3d {
          0%, 100% {
            transform: scale(1.02);
          }
          14% {
            transform: scale(1.08);
          }
          28% {
            transform: scale(1.02);
          }
          42% {
            transform: scale(1.12);
          }
          70% {
            transform: scale(1.02);
          }
        }
        .anim-heart-pulse-3d {
          animation: heartPulse3d 2.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          transform-origin: center center;
        }
      `}</style>

{/* 1. HERO SECTION (With High-Tech Animated Aura & Doctor Image Fitted on Rounding Bracket) */}
      <section id="home" className="relative pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 overflow-hidden bg-mesh-aurora">
        {/* Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0A1C35 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
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

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                From licensed doctor consultations to certified nursing care and tamper-proof digital prescriptions, Curix delivers comprehensive outpatient clinical workflows built for precision and patient trust.
              </p>

              {/* Interactive Quick-Search Bar */}
              <div className="pt-1 max-w-xl">
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
                  <a
                    href="#specialties"
                    className="px-5 py-2.5 rounded-full btn-curix-primary text-xs font-extrabold tracking-wide shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Find</span>
                    <ArrowRight size={13} />
                  </a>
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
                  Explore Physicians
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
                <div className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] lg:w-[430px] lg:h-[430px] flex items-center justify-center">
                  
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
                <div className="w-[230px] sm:w-[300px] lg:w-[320px] h-6 rounded-full bg-slate-900/30 blur-md pointer-events-none anim-shadow-breath mt-4 z-0" />
              </div>

            </div>

          </div>
        </div>
      </section>

{/* 2. RAPID HEALTHCARE DISPATCH BAR */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 -mt-6 sm:-mt-8 mb-10 sm:mb-14 lg:mb-16 relative z-20">
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

      {/* 2. ABOUT US SECTION (UN-SQUEEZED, SPACIOUS & FULL-WIDTH ARCHITECTURE) */}
      <section id="about" className="scroll-mt-20 w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-20 relative overflow-hidden border-t border-slate-100/80">
        {/* Subtle Ambient Background Watermark */}
        <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#00A896]/10 blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

        {/* 2-Column Showcase: 3D Heart Image (Left) + All Written Description & Pillars (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: ONLY the 3D Cardiac Medical Portal (Expanded & Clean White on Left) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] flex flex-col items-center">
              
              {/* Outer Floating Animation Frame - Fluid Scaled Portal */}
              <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[340px] md:h-[340px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] 2xl:w-[520px] 2xl:h-[520px] anim-doctor-float flex items-center justify-center z-10">
                
                {/* Ambient Soft Glow Behind the Portal */}
                <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-tr from-[#00A896]/20 via-[#0BC2A8]/15 to-rose-400/15 blur-3xl pointer-events-none anim-pulse-glow" />

                {/* Concentric Dashed Orbit Ring with Orbiting Glowing Markers */}
                <div className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-dashed border-[#00A896]/40 pointer-events-none anim-orbit-spin flex items-center justify-between p-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#F43F5E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A896] shadow-[0_0_10px_#00A896]" />
                </div>

                {/* The Round Shape: Clean Gradient Rim + Bevel Border + Mask (Matching Doctor Portal) */}
                <div className="w-full h-full rounded-full p-2.5 sm:p-3 bg-gradient-to-b from-[#00A896] via-[#0BC2A8] to-slate-200/60 shadow-[0_20px_50px_rgba(10,28,53,0.16)] ring-8 ring-[#00A896]/15 flex items-center justify-center relative group overflow-hidden">
                  
                  {/* Inner Circular Portal Framing 3D Anatomical Heart with Pure White Background */}
                  <div className="w-full h-full rounded-full overflow-hidden border-[5px] sm:border-[6px] border-white shadow-inner bg-white relative flex items-center justify-center">
                    
                    {/* High-Definition 3D Human Heart Image with Realistic Heartbeat Pulse */}
                    <img
                      src={heart3dImage}
                      alt="Curix 3D Clinical Cardiac Model"
                      className="w-full h-full object-cover object-center select-none pointer-events-none anim-heart-pulse-3d transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dynamic ECG Cardiac Waveform Across Lower Portal */}
                    <svg className="absolute bottom-6 left-0 right-0 w-full h-10 px-8 z-10 pointer-events-none opacity-85" viewBox="0 0 300 40" fill="none">
                      <path
                        d="M0 20 L70 20 L80 10 L90 32 L100 6 L110 26 L120 20 L160 20 L170 10 L180 32 L190 6 L200 26 L210 20 L300 20"
                        stroke="#00A896"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="anim-scan-wave drop-shadow-[0_0_8px_#00A896]"
                      />
                    </svg>

                    {/* Subtle Top Specular Lighting Reflection for Depth */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-slate-900/5 pointer-events-none" />
                  </div>
                </div>

                {/* Floating Telemetry Status Chips Anchored Around the 3D Heart Portal */}
                <div className="absolute -top-1 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <Activity size={12} className="text-rose-500" />
                  <span className="text-[10px] sm:text-[11px] font-black text-[#0A1C35]">
                    72 BPM · Sinus Rhythm
                  </span>
                </div>

                <div className="absolute bottom-2 right-0 sm:-right-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Heart size={12} className="text-[#00A896] fill-[#00A896]/20" />
                  <span className="text-[10px] sm:text-[11px] font-black text-[#0A1C35]">
                    99.8% Cardiac Vitality
                  </span>
                </div>

                <div className="absolute bottom-1 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Award size={13} className="text-[#00A896]" />
                  <span className="text-[10px] sm:text-[11px] font-black text-[#0A1C35]">
                    NABH & JCI Accredited
                  </span>
                </div>

              </div>

              {/* Synchronized Floor Shadow Breathing Under 3D Heart Structure */}
              <div className="w-[260px] sm:w-[320px] md:w-[300px] lg:w-[380px] xl:w-[420px] h-7 rounded-full bg-slate-900/25 blur-md pointer-events-none anim-shadow-breath mt-4 z-0" />
            </div>
          </div>

          {/* Right Column: Header Story, Narrative Writing Description, 4 Clinical Pillars & CTAs */}
          <div className="md:col-span-7 space-y-6 lg:space-y-7">
            
            {/* Header Block: Badges, Title & Narrative Paragraph */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] bg-[#E6F8F5] px-3.5 py-1.5 rounded-full border border-[#00A896]/20 shadow-2xs">
                  ABOUT CURIX HEALTHCARE
                </span>
                <span className="text-[10.5px] font-extrabold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Est. 2018 · Tertiary Medical Campus
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1C35] tracking-tight leading-[1.18] mb-4">
                Transforming Healthcare Through{' '}
                <span className="bg-gradient-to-r from-[#00A896] via-[#0BC2A8] to-sky-500 bg-clip-text text-transparent">
                  Clinical Excellence
                </span>{' '}
                & Digital Precision
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                Curix is an accredited multi-specialty tertiary healthcare institution engineered to harmonize high-precision clinical outcomes with compassionate, zero-friction patient care. By integrating 9 specialized Centres of Excellence with an atomic digital health infrastructure, we eliminate waiting bottlenecks and booking collisions while providing seamless outpatient-to-inpatient transitions.
              </p>
            </div>

            {/* 4 Clinical Pillars with Spacious Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A896]/50 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center mb-4">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1C35] mb-1.5">JCI & NABH Aligned</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    International gold standard infection control, clinical safety protocols, and certified hospital care.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A896]/50 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Activity size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1C35] mb-1.5">Robotic Surgical Suites</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Mako robotic articulated arm and LINAC 6MV radiation suites for 0.1mm sub-millimeter surgical precision.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A896]/50 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1C35] mb-1.5">Atomic Slot Locking</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Direct calendar synchronization locks your consultation slot instantly across hospital systems.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A896]/50 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1C35] mb-1.5">24/7 Level-1 Trauma</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Golden-hour acute resuscitation, dedicated multi-bed surgical ICU, and mobile telemetry life-support fleet.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#centres-of-excellence"
                className="px-7 py-3.5 rounded-full btn-curix-primary text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>Explore Centres of Excellence</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#specialties"
                className="px-6 py-3.5 rounded-full bg-white border border-slate-200/90 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Meet Medical Faculty</span>
                <ChevronRight size={14} className="text-[#00A896]" />
              </a>
            </div>

          </div>

        </div>
      </section>

{/* CENTRES OF EXCELLENCE & SPECIALIZED HOSPITAL CARE (MERGED FLAGSHIP SECTION) */}
      <section id="centres-of-excellence" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
        <span id="services" className="scroll-mt-24 absolute -top-10" />

        {/* Curix UI Themed Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] bg-[#E6F8F5] px-3.5 py-1 rounded-full border border-[#00A896]/20 shadow-2xs">
                TERTIARY HUBS & SPECIALIZED CARE
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Hospital Grade Care
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1C35] tracking-tight">
              Centres of <span className="text-[#00A896]">Excellence</span> & Specialized Care
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              World-class tertiary clinical institutes and specialized hospital care disciplines equipped with next-gen robotic systems, precision diagnostics, and 24/7 intensive monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Award size={14} className="text-[#00A896]" />
              <span>9 Tertiary Institutes</span>
            </span>
          </div>
        </div>

        {/* Core Hospital Care Capabilities Banner (Combined from Specialized Care) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 sm:mb-10">
          {[
            { icon: <Stethoscope size={16} className="text-[#00A896]" />, title: 'Doctor OPD', tag: 'In-Clinic' },
            { icon: <Heart size={16} className="text-[#00A896]" />, title: 'Nursing Care', tag: 'Certified Staff' },
            { icon: <Activity size={16} className="text-[#00A896]" />, title: 'Diagnostics & Labs', tag: 'NABL Aligned' },
            { icon: <ShieldCheck size={16} className="text-[#00A896]" />, title: 'Critical Care ICU', tag: '24/7 Monitoring' },
            { icon: <FileText size={16} className="text-[#00A896]" />, title: 'Digital Rx Slips', tag: 'Tamper-Proof' },
            { icon: <PhoneCall size={16} className="text-[#00A896]" />, title: '24/7 Emergency', tag: 'Rapid Response' }
          ].map((srv, sIdx) => (
            <div key={sIdx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A896]/40 hover:shadow-xs transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F8F5] flex items-center justify-center shrink-0">
                  {srv.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#00A896] bg-[#E6F8F5]/80 px-2 py-0.5 rounded-md">
                  {srv.tag}
                </span>
              </div>
              <span className="text-xs font-bold text-[#0A1C35] truncate">{srv.title}</span>
            </div>
          ))}
        </div>

        {/* 3x3 Equal Height Grid (Combined Design: Clean, Balanced, 3D Animated Equipment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {centresOfExcellence.map((centre) => (
            <div
              key={centre.id}
              onClick={() => handleCentreClick(centre)}
              className={`h-full min-h-[220px] sm:min-h-[230px] relative overflow-hidden rounded-[24px] border ${centre.border} bg-gradient-to-r ${centre.bgGradient} p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
            >
              {/* Header Title & Clinical Scope on Left, 3D Equipment Visual on Right */}
              <div className="flex justify-between items-start gap-2.5 flex-1">
                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between h-full">
                  <div>
                    {/* Clinical Category Tag */}
                    <span className={`inline-flex items-center text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border mb-2 ${centre.badgeColor}`}>
                      {centre.categoryTag}
                    </span>

                    {/* Fixed Height Title Container */}
                    <div className="h-10 sm:h-11 flex items-start mb-1.5">
                      <h3 className="text-sm sm:text-[15px] font-bold text-[#0A1C35] leading-snug group-hover:text-[#00A896] transition-colors line-clamp-2">
                        {centre.title}
                      </h3>
                    </div>

                    {/* Unified Clinical Care Description */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 mb-2.5">
                      {centre.description}
                    </p>
                  </div>

                  {/* Specialized Care Unit Badge */}
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600 bg-white/80 border border-slate-200/60 px-2.5 py-0.5 rounded-lg self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                    <span>{centre.servicePill}</span>
                  </span>
                </div>

                {/* 3D Animated Hospital Equipment Visual Module */}
                <div className="shrink-0 self-center pl-1">
                  {renderHospitalEquipment(centre.id, centre.equipmentBadge)}
                </div>
              </div>

              {/* Bottom Interactive Touchpoint Bar */}
              <div className="pt-3 mt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#00A896]">
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Consult Specialists</span>
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500/90 font-extrabold bg-white/70 px-2 py-0.5 rounded-md border border-slate-200/50">
                  {centre.equipmentBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MEET OUR TOP DOCTORS (HORIZONTAL CAROUSEL SLIDER: 4 CARDS WITH SMOOTH SLIDE) */}
      <section id="specialties" className="scroll-mt-20 w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 lg:py-24 border-t border-slate-100/80 relative overflow-hidden">
        <span id="doctors" className="scroll-mt-24 absolute -top-10" />

        {/* Ambient Glow in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[#00A896]/5 blur-3xl rounded-full pointer-events-none" />

        {/* Section Header: Title + Subtitle on Left; Controls & View All Doctors on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F8F5] text-[#00A896] text-[11px] font-extrabold uppercase tracking-wider mb-2.5 border border-[#00A896]/20">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>Medical Faculty ({displayDoctorsList.length} Verified Doctors)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1C35] tracking-tight">
              Meet Our Top Doctors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              Browse all {displayDoctorsList.length} certified medical specialists across our hospital departments. Always here for your family.
            </p>
          </div>

          {/* Right Controls: Prev / Next Slide Arrows + AutoPlay Toggle + View All */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* Slide Navigation Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevDoctorSlide}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#E6F8F5] text-slate-600 hover:text-[#00A896] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Slide Previous (Left)"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Doctor Position & Total Doctors Indicator: e.g. 1–4 of 14 Doctors */}
              <div className="px-3 py-1 text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
                <span className="text-[#00A896] font-black">
                  {doctorSlideIndex + 1}–{Math.min(doctorSlideIndex + itemsPerView, displayDoctorsList.length)}
                </span>
                <span className="text-slate-400">of</span>
                <span className="text-[#0A1C35] font-black">{displayDoctorsList.length} Doctors</span>
              </div>

              <button
                type="button"
                onClick={handleNextDoctorSlide}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#E6F8F5] text-slate-600 hover:text-[#00A896] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Slide Next (Right)"
              >
                <ChevronRight size={18} />
              </button>

              {/* Autoplay Pause/Play button */}
              <button
                type="button"
                onClick={() => setDoctorSliderAutoPlay(!doctorSliderAutoPlay)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  doctorSliderAutoPlay
                    ? 'bg-[#E6F8F5] text-[#00A896]'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                }`}
                title={doctorSliderAutoPlay ? 'Pause auto-sliding' : 'Resume auto-sliding'}
              >
                {doctorSliderAutoPlay ? <Pause size={14} /> : <Play size={14} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenAuth?.()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#E6F8F5] text-xs sm:text-sm font-bold text-[#00A896] border border-[#00A896]/30 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Viewport Container */}
        <div 
          className="relative group/carousel"
          onMouseEnter={() => setIsDoctorSliderHovered(true)}
          onMouseLeave={() => setIsDoctorSliderHovered(false)}
        >
          {/* Floating Left Nav Arrow */}
          <button
            type="button"
            onClick={handlePrevDoctorSlide}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-xl text-slate-700 hover:text-[#00A896] items-center justify-center transition-all hover:scale-110 cursor-pointer active:scale-95"
            title="Previous Doctor"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Floating Right Nav Arrow */}
          <button
            type="button"
            onClick={handleNextDoctorSlide}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-xl text-slate-700 hover:text-[#00A896] items-center justify-center transition-all hover:scale-110 cursor-pointer active:scale-95"
            title="Next Doctor"
          >
            <ChevronRight size={20} />
          </button>

          {/* Overflow Window */}
          <div className="overflow-hidden -mx-3 py-4">
            {/* Sliding Track: Continuous Infinite Loop (1..14 -> 1..14) */}
            <div
              className="flex"
              style={{
                transform: `translateX(-${doctorSlideIndex * (100 / itemsPerView)}%)`,
                transition: isSlideTransitioning ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
              }}
              onTransitionEnd={handleSlideTransitionEnd}
            >
              {infiniteDoctors.map((doc, idx) => {
                const docName = getDoctorDisplayName(doc);
                const specialty = getDoctorSpecialtyDisplay(doc);

                return (
                  <div
                    key={`doc-infinite-${idx}-${doc.id || docName}`}
                    className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-3"
                  >
                    <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 hover:border-[#00A896]/60 shadow-xs hover:shadow-2xl hover:shadow-[#00A896]/15 hover:-translate-y-2.5 transition-all duration-400 ease-out flex flex-col items-center text-center group cursor-pointer overflow-hidden h-full">
                      {/* Shimmer Light Sweep on Hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

                      {/* Top Animated Glowing Border Accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A896] via-[#0BC2A8] to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Ambient Soft Glow Behind Card */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#00A896]/5 group-hover:bg-[#00A896]/15 blur-2xl transition-all duration-500 pointer-events-none" />

                      {/* Centered Circular Doctor Avatar with 3D Dynamics */}
                      <div className="relative mb-4">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-100 group-hover:border-[#00A896]/40 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-400 group-hover:shadow-lg group-hover:shadow-[#00A896]/20">
                          <img
                            src={getDoctor3dImage(doc)}
                            alt={docName}
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 ease-out"
                          />
                        </div>

                        {/* 3D Emoji Avatar Pill with Hover Scale */}
                        <span className="absolute -bottom-1 -right-1 text-xs sm:text-sm bg-white/95 backdrop-blur-xs rounded-full px-1.5 py-0.5 shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {getDoctor3dEmoji(doc)}
                        </span>
                      </div>

                      {/* Doctor Name */}
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0A1C35] mb-1 group-hover:text-[#00A896] transition-colors duration-300 truncate w-full">
                        {docName}
                      </h3>

                      {/* Specification / Specialty */}
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-3 truncate w-full">
                        {specialty}
                      </p>

                      {/* Animated Verified Specialist Badge (No Ratings) */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F5] text-[#00A896] text-[11px] font-extrabold mb-6 group-hover:bg-[#00A896] group-hover:text-white transition-all duration-300 shadow-2xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] group-hover:bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896] group-hover:bg-white"></span>
                        </span>
                        <span>Verified Specialist</span>
                      </div>

                      {/* Rounded Pill Book Now Button with Sliding Arrow */}
                      <button
                        type="button"
                        onClick={() => onOpenAuth?.()}
                        className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-[#00A896] hover:bg-[#079181] group-hover:shadow-lg group-hover:shadow-[#00A896]/30 text-white text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-300 cursor-pointer active:scale-95 mt-auto flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Book Now</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots for all Doctors in Seamless Loop */}
          {docCount > 1 && (
            <div className="flex flex-col items-center gap-2 pt-5">
              <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-lg">
                {displayDoctorsList.map((doc, dotIdx) => {
                  const currentDoctorActive = (((doctorSlideIndex % docCount) + docCount) % docCount) === dotIdx;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => {
                        setIsSlideTransitioning(true);
                        setDoctorSlideIndex(docCount + dotIdx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentDoctorActive
                          ? 'w-6 bg-[#00A896] shadow-xs'
                          : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                      title={`Doctor ${dotIdx + 1}: ${getDoctorDisplayName(doc)}`}
                    ></button>
                  );
                })}
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Doctor {(((doctorSlideIndex % docCount) + docCount) % docCount) + 1} of all {docCount} Doctors · Continuous Loop
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW CURIX WORKS (Interactive Step Switcher) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 border-t border-slate-100">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            SEAMLESS OUTPATIENT WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A1C35] tracking-tight">
            How Curix Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto font-medium">
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

      {/* 5. INTERACTIVE CARE PLANS & ESTIMATOR */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14 sm:py-16 lg:py-18">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">
            TRANSPARENT CLINICAL PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1C35] tracking-tight">
            Clear Healthcare Fees, Zero Hidden Costs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto font-medium">
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
                      <Icon size={24} />
                    </div>
                    {plan.popular && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#00A896] to-[#0BC2A8] text-white shadow-2xs">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[#0A1C35] mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{plan.desc}</p>

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

      {/* 6. INTERACTIVE FAQ ACCORDION */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="text-center mb-12">
          <span className="text-[11px] font-black tracking-widest uppercase text-[#00A896] block mb-1">
            PATIENT KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1C35] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto font-medium">
            Everything you need to know about booking, prescriptions, and digital patient security.
          </p>
        </div>

        <div className="space-y-3.5 max-w-4xl mx-auto">
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
                    size={16}
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

      {/* 7. PRIORITY MEDICAL CALLOUT (Emergency & Home Visit) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-[#0A1C35] via-[#0d274c] to-[#0A1C35] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow aura */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#00A896]/20 blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0BC2A8] bg-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PRIORITY MEDICAL SUPPORT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
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
              href="tel:+18002874900"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <PhoneCall size={14} className="text-[#0BC2A8]" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. DEEP DARK NAVY COMPLIANCE & SECURITY FOOTER */}
      <footer id="security" className="bg-[#071524] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
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
