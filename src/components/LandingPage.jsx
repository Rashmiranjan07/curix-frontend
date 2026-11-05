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
    <div className="relative pt-20 bg-white text-slate-700 font-sans selection:bg-[#00A884] selection:text-white">
      
      {/* Self-contained CSS Animations */}
      <style>{`
        @keyframes floatDoctor {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlowSlow {
          0%, 100% { opacity: 0.35; transform: scale(0.98); }
          50% { opacity: 0.75; transform: scale(1.05); }
        }
        .anim-doctor-float {
          animation: floatDoctor 5s ease-in-out infinite;
        }
        .anim-pulse-glow {
          animation: pulseGlowSlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. HERO SECTION (Emerald-Teal & Clean Clinical Aesthetic) */}
      <section id="home" className="relative pt-8 sm:pt-14 lg:pt-18 pb-16 sm:pb-20 lg:pb-24 overflow-hidden bg-white">
        {/* Ambient Halo behind Doctor */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E6F8F3]/80 via-[#D6F4EC]/50 to-transparent blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Headline & Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Kicker Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F8F3] border border-[#00A884]/30 text-[#00A884] text-xs font-black tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-pulse" />
                <span>Trusted Healthcare, Anytime, Anywhere</span>
              </div>

              {/* Masterful Two-Tone Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black text-[#0C233C] leading-[1.12] tracking-tight">
                Your Health <br />
                <span className="text-[#00A884]">Our Priority</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                Connect with certified doctors, get expert medical advice, and book appointments — all online. Fast, secure and hassle-free.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#doctors"
                  className="px-7 py-3.5 rounded-full btn-curix-primary text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00A884]/25"
                >
                  <span>Find a Doctor</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-sm transition-all duration-200"
                >
                  How it Works
                </a>
              </div>

              {/* Quick Social Proof Metrics */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-8 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E6F8F3] text-[#00A884] flex items-center justify-center font-bold">
                    <User size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#0C233C] font-mono block">10K+</span>
                    <span className="text-slate-400 text-[11px] font-semibold block">Happy Patients</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E6F8F3] text-[#00A884] flex items-center justify-center font-bold">
                    <Award size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#0C233C] font-mono block">500+</span>
                    <span className="text-slate-400 text-[11px] font-semibold block">Verified Doctors</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#0C233C] font-mono block">4.8 / 5</span>
                    <span className="text-slate-400 text-[11px] font-semibold block">Patient Rating</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Doctor Visual Canvas */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px]">
              
              {/* Doctor Container */}
              <div className="relative z-10 anim-doctor-float flex flex-col items-center">
                
                {/* Soft Mint Circular Halo */}
                <div className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] rounded-full p-2.5 bg-gradient-to-br from-[#E6F8F3] via-[#D8F4EC] to-[#C7EFE3] shadow-2xl border-4 border-white flex items-center justify-center">
                  
                  {/* Subtle Inner Border */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#FAF5F0] to-[#EFE2D8] relative flex items-center justify-center">
                    {doctorImage ? (
                      <img
                        src={doctorImage}
                        alt="Curix Medical Doctor"
                        style={{ transform: 'scale(1.28) translateY(6%)' }}
                        className="w-full h-full object-cover object-center select-none pointer-events-none"
                      />
                    ) : (
                      <Stethoscope size={64} className="text-[#00A884]" />
                    )}
                  </div>

                  {/* Floating Top-Right Badge: Better Care, Brighter Future */}
                  <div className="absolute top-4 -right-4 sm:top-6 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-lg flex items-center gap-2 text-xs font-bold text-[#0C233C]">
                    <span className="w-5 h-5 rounded-full bg-[#E6F8F3] text-[#00A884] flex items-center justify-center">
                      <Heart size={11} fill="currentColor" />
                    </span>
                    <span>Better Care, Brighter Future</span>
                  </div>

                  {/* Floating Bottom Badge: Dr. Sarah Khan Lead Specialist */}
                  <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-full bg-slate-100 p-0.5 border border-[#00A884]/40 overflow-hidden shrink-0">
                      <img src={femaleDoctor3d} alt="Lead Doctor" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-[#0C233C]">Dr. Sarah Khan</h4>
                        <CheckCircle2 size={12} className="text-[#00A884]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#00A884] block">Lead Specialist · 4.9 ★</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. FLOATING "FIND THE RIGHT DOCTOR" SEARCH HUB (Deep Navy Card) */}
      <section id="search-hub" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-[#0C233C] text-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/10">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Find the Right Doctor for Your Needs
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                Search by specialty, doctor name, or medical condition and get connected in minutes.
              </p>
            </div>

            {/* Live Search Input with Green Button */}
            <div className="flex-1 max-w-xl">
              <div className="bg-white rounded-full p-1.5 pl-4 flex items-center shadow-lg">
                <Search size={16} className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by specialty, doctor name, or condition..."
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer font-bold"
                  >
                    Clear
                  </button>
                )}
                <a
                  href="#doctors"
                  className="px-6 py-2.5 rounded-full btn-curix-primary text-xs font-black shrink-0 flex items-center gap-1.5 shadow-md shadow-[#00A884]/30"
                >
                  <span>Search</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Specialty Icon Pills */}
          <div className="pt-6">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold mb-3">
              Quick Filter by Specialty
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { name: 'General Physician', icon: Stethoscope, query: 'General' },
                { name: 'Cardiology', icon: Heart, query: 'Cardiology' },
                { name: 'Dermatologist', icon: Activity, query: 'Dermatology' },
                { name: 'Pediatrician', icon: User, query: 'Pediatrics' },
                { name: 'Gynecologist', icon: ShieldCheck, query: 'Mother' },
                { name: 'Orthopedic', icon: Award, query: 'Orthopaedics' }
              ].map((spec) => {
                const Icon = spec.icon;
                const isSelected = searchQuery.toLowerCase() === spec.query.toLowerCase();
                return (
                  <button
                    key={spec.name}
                    onClick={() => {
                      setSearchQuery(isSelected ? '' : spec.query);
                      const docSec = document.getElementById('doctors');
                      if (docSec) docSec.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-xs font-bold cursor-pointer ${
                      isSelected
                        ? 'bg-[#00A884] border-[#00A884] text-white shadow-lg shadow-[#00A884]/30'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-[#00A884]/50'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-[#00A884]'} />
                    <span className="truncate">{spec.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE CURIX DOCTORS (4 Clean White Value Proposition Cards) */}
      <section id="why-us" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0C233C] tracking-tight">
            Why Choose Curix Doctors?
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            We make healthcare simple, accessible and reliable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Verified Doctors',
              desc: 'All doctors are certified, medical license verified, and experienced across top specialties.',
              icon: ShieldCheck,
              iconBg: 'bg-emerald-50 text-emerald-600'
            },
            {
              title: 'Online Consultation',
              desc: 'Get expert medical advice and digital prescription slips from the comfort of home.',
              icon: Video,
              iconBg: 'bg-sky-50 text-sky-600'
            },
            {
              title: 'Easy Booking',
              desc: 'Book verified consultation slots in seconds with zero double-booking and instant email alerts.',
              icon: Calendar,
              iconBg: 'bg-teal-50 text-teal-600'
            },
            {
              title: 'Secure & Private',
              desc: 'Your health records and consultation history are 100% private, encrypted, and HIPAA aligned.',
              icon: Lock,
              iconBg: 'bg-indigo-50 text-indigo-600'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xs hover:shadow-xl hover:border-[#00A884]/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-extrabold text-[#0C233C] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 3D CARDIAC CLINICAL EXCELLENCE & ABOUT US SECTION */}
      <section id="about" className="scroll-mt-20 w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-[#F1F9F6] to-[#E6F8F3] p-8 sm:p-12 lg:p-16 border border-slate-200/70">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8F3] border border-[#00A884]/30 text-[#00A884] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Activity size={14} />
              <span>Tertiary Clinical Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0C233C] tracking-tight leading-tight">
              Anatomical Precision & <br />
              <span className="text-[#00A884]">World-Class Clinical Outcomes</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mt-3">
              Curix is an accredited multi-specialty tertiary healthcare institution engineered to harmonize high-precision clinical outcomes with compassionate, zero-friction patient care. By integrating specialized Centres of Excellence with an atomic digital health infrastructure, we eliminate waiting bottlenecks and booking collisions.
            </p>
          </div>

          {/* 2-Column Showcase: 3D Cardiac Anatomical Portal (Left) + Clinical Pillars (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left Column: High-Definition 3D Cardiac Medical Portal */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[460px] sm:max-w-[500px] flex flex-col items-center">
                
                {/* Outer Floating Animation Frame */}
                <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[450px] md:h-[450px] anim-doctor-float flex items-center justify-center z-10">
                  
                  {/* Ambient Soft Glow Behind the Portal */}
                  <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-tr from-[#00A896]/20 via-[#0BC2A8]/15 to-rose-400/15 blur-3xl pointer-events-none anim-pulse-glow" />

                  {/* Concentric Dashed Orbit Ring with Orbiting Glowing Markers */}
                  <div className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-dashed border-[#00A884]/40 pointer-events-none anim-orbit-spin flex items-center justify-between p-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#F43F5E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A884] shadow-[0_0_10px_#00A896]" />
                  </div>

                  {/* The Round Shape: Clean Gradient Rim + Bevel Border + Mask */}
                  <div className="w-full h-full rounded-full p-2.5 sm:p-3 bg-gradient-to-b from-[#00A884] via-[#0BC2A8] to-slate-200/60 shadow-[0_20px_50px_rgba(10,28,53,0.16)] ring-8 ring-[#00A884]/15 flex items-center justify-center relative group overflow-hidden">
                    
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
                          stroke="#00A884"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="anim-scan-wave drop-shadow-[0_0_8px_#00A884]"
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
                    <span className="text-[10px] sm:text-[11px] font-black text-[#0C233C]">
                      72 BPM · Sinus Rhythm
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-0 sm:-right-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Heart size={12} className="text-[#00A884] fill-[#00A884]/20" />
                    <span className="text-[10px] sm:text-[11px] font-black text-[#0C233C]">
                      99.8% Cardiac Vitality
                    </span>
                  </div>

                  <div className="absolute bottom-1 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Award size={13} className="text-[#00A884]" />
                    <span className="text-[10px] sm:text-[11px] font-black text-[#0C233C]">
                      NABH & JCI Accredited
                    </span>
                  </div>

                </div>

                {/* Soft Dynamic Floor Breathing Shadow */}
                <div className="w-[280px] sm:w-[360px] md:w-[380px] h-7 rounded-full bg-slate-900/20 blur-md pointer-events-none anim-shadow-breath mt-4 z-0" />
              </div>
            </div>

            {/* Right Column: 4 Clinical Pillars with Spacious Bento Cards & CTAs */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A884]/50 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#E6F8F3] text-[#00A884] flex items-center justify-center mb-4">
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0C233C] mb-1.5">JCI & NABH Aligned</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      International gold standard infection control, clinical safety protocols, and certified hospital care.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A884]/50 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Activity size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0C233C] mb-1.5">Robotic Surgical Suites</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Mako robotic articulated arm and LINAC 6MV radiation suites for 0.1mm sub-millimeter surgical precision.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A884]/50 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0C233C] mb-1.5">Atomic Slot Locking</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Direct calendar synchronization locks your consultation slot instantly across hospital systems.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#00A884]/50 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                    <PhoneCall size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0C233C] mb-1.5">24/7 Level-1 Trauma</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Golden-hour acute resuscitation, dedicated multi-bed surgical ICU, and mobile telemetry life-support fleet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#doctors"
                  className="px-7 py-3.5 rounded-full btn-curix-primary text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>Meet Our Specialists</span>
                  <ArrowRight size={14} />
                </a>
                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-full bg-white border border-slate-200/90 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ChevronRight size={14} className="text-[#00A884]" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. POPULAR SPECIALTIES GRID */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C233C] tracking-tight">
              Popular Specialties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Find the right specialist for your health needs.</p>
          </div>
          <a href="#doctors" className="text-xs font-bold text-[#00A884] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={13} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Cardiology', desc: 'Heart Health', icon: Heart, iconBg: 'bg-rose-50 text-rose-500', query: 'Cardiology' },
            { name: 'Dermatology', desc: 'Skin & Hair', icon: Activity, iconBg: 'bg-emerald-50 text-emerald-500', query: 'Dermatology' },
            { name: 'Neurology', desc: 'Brain & Nerves', icon: Brain, iconBg: 'bg-indigo-50 text-indigo-500', query: 'Neurology' },
            { name: 'Orthopedics', desc: 'Bones & Joints', icon: Bone, iconBg: 'bg-amber-50 text-amber-500', query: 'Orthopaedics' },
            { name: 'Pediatrics', desc: 'Child Health', icon: Baby, iconBg: 'bg-pink-50 text-pink-500', query: 'Pediatrics' },
            { name: 'General Care', desc: 'Everyday Health', icon: Stethoscope, iconBg: 'bg-teal-50 text-teal-500', query: 'General' }
          ].map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.name}
                onClick={() => {
                  setSearchQuery(spec.query);
                  const el = document.getElementById('doctors');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-lg hover:border-[#00A884]/40 hover:-translate-y-1 transition-all duration-200 text-center cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${spec.iconBg} mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <h4 className="text-xs font-extrabold text-[#0C233C] group-hover:text-[#00A884] transition-colors">{spec.name}</h4>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{spec.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. "NEED A DOCTOR CONSULTATION? IT'S JUST A CLICK AWAY" (Deep Navy Banner) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
        <div className="bg-[#0C233C] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80"
                alt="Doctor consultation"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Need a Doctor Consultation? <br />
                <span className="text-[#00A884]">It's Just a Click Away</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md font-medium">
                Book your appointment online and get expert care from certified doctors, anytime, anywhere.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenAuth?.()}
            className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0C233C] text-xs font-black shrink-0 shadow-lg cursor-pointer transition hover:scale-105"
          >
            Book an Appointment
          </button>
        </div>
      </section>

      {/* 7. MEET OUR TOP DOCTORS (CONTINUOUS 14-DOCTOR INFINITE CAROUSEL) */}
      <section id="specialties" className="scroll-mt-20 w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 border-t border-slate-100 relative overflow-hidden">
        <span id="doctors" className="scroll-mt-24 absolute -top-10" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8F3] text-[#00A884] text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-[#00A884]/30">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>Certified Faculty Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0C233C] tracking-tight">
              Meet Our Top Doctors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Highly rated specialists. Always here for your clinical care.
            </p>
          </div>

          {/* Carousel Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDoctorSlide}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs hover:shadow-sm cursor-pointer"
              title="Previous Doctor"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextDoctorSlide}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs hover:shadow-sm cursor-pointer"
              title="Next Doctor"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* The Infinite Slider Viewport */}
        <div
          className="relative overflow-hidden w-full py-4"
          onMouseEnter={() => setIsDoctorSliderHovered(true)}
          onMouseLeave={() => setIsDoctorSliderHovered(false)}
        >
          <div
            className="flex transition-transform ease-out will-change-transform"
            style={{
              transform: `translateX(-${doctorSlideIndex * (100 / itemsPerView)}%)`,
              transitionDuration: isSlideTransitioning ? '500ms' : '0ms'
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
                  <div className="relative bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-[#00A884]/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer h-full justify-between">
                    
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A884] via-[#0E9F6E] to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

                    <div>
                      {/* Avatar with 3D Dynamics */}
                      <div className="relative mb-4 mx-auto w-24 h-24 sm:w-28 sm:h-28">
                        <div className="w-full h-full rounded-full p-1 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-100 group-hover:border-[#00A884]/40 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105">
                          <img
                            src={getDoctor3dImage(doc)}
                            alt={docName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        {/* 3D Emoji Pill */}
                        <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full px-1.5 py-0.5 shadow-xs border border-slate-100">
                          {getDoctor3dEmoji(doc)}
                        </span>
                      </div>

                      {/* Doctor Name */}
                      <h4 className="text-base font-extrabold text-[#0C233C] group-hover:text-[#00A884] transition-colors truncate max-w-[220px]">
                        {docName}
                      </h4>

                      {/* Specialty */}
                      <span className="text-xs font-bold text-[#00A884] block mt-0.5 truncate max-w-[220px]">
                        {specialty}
                      </span>

                      {/* Rating Stars */}
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-amber-500">
                        <div className="flex text-amber-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="font-bold text-slate-700 ml-1">4.9</span>
                        <span className="text-[11px] text-slate-400">(120+)</span>
                      </div>
                    </div>

                    {/* Footer: Fee & Book Now Pill Button */}
                    <div className="w-full pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Fee</span>
                        <span className="text-sm font-black text-[#0C233C] font-mono">
                          {formatCurrency(doc.consultationFee, '100.00')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(doc);
                        }}
                        className="px-4 py-2 rounded-full btn-curix-primary text-xs font-bold shadow-md shadow-[#00A884]/20 transition active:scale-95 cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. COMPREHENSIVE HEALTHCARE SERVICES FOR YOU (Deep Navy Banner + 6 White Cards) */}
      <section id="services" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        
        {/* Dark Header Banner */}
        <div className="bg-[#0A233F] text-white rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            <span className="text-[11px] font-mono text-[#00A884] font-bold uppercase tracking-wider block mb-2">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Comprehensive Healthcare <br />
              Services for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              From online consultations to specialized clinical care, we offer a wide range of services to meet your medical needs.
            </p>
          </div>

          <a
            href="#doctors"
            className="px-6 py-3 rounded-full bg-white text-[#0A233F] text-xs font-black shadow-lg hover:bg-slate-100 transition shrink-0"
          >
            Explore All Services
          </a>
        </div>

        {/* 6 Clinical Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Online Consultation',
              desc: 'Talk to certified specialists from anywhere via secure video calls.',
              icon: Video,
              iconBg: 'bg-emerald-50 text-emerald-600'
            },
            {
              title: 'Lab Tests & Diagnostics',
              desc: 'Book hospital-grade diagnostic tests and get online reports quickly.',
              icon: Microscope,
              iconBg: 'bg-teal-50 text-teal-600'
            },
            {
              title: 'Prescription Delivery',
              desc: 'Get your verified medications delivered safely to your home.',
              icon: Pill,
              iconBg: 'bg-sky-50 text-sky-600'
            },
            {
              title: 'Follow-up Care',
              desc: 'Stay on track with personalized recovery plans and doctor reviews.',
              icon: Heart,
              iconBg: 'bg-rose-50 text-rose-600'
            },
            {
              title: 'Mental Health Support',
              desc: 'Compassionate licensed therapy and clinical counseling for peace of mind.',
              icon: Brain,
              iconBg: 'bg-indigo-50 text-indigo-600'
            },
            {
              title: 'Chronic Care Management',
              desc: 'Long-term disease management, blood pressure & glucose tracking.',
              icon: Activity,
              iconBg: 'bg-amber-50 text-amber-600'
            }
          ].map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="p-7 rounded-3xl bg-white border border-slate-100 shadow-xs hover:shadow-xl hover:border-[#00A884]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${srv.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0C233C] mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{srv.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00A884] group-hover:underline flex items-center gap-1 cursor-pointer">
                    <span>Learn More</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. WHAT OUR PATIENTS SAY (3 Review Cards) */}
      <section id="reviews" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16 text-center">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-slate-100">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0C233C] tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Real stories. Real people. Real care.</p>
          </div>
          <span className="text-xs font-bold text-[#00A884] flex items-center gap-1">
            <span>Verified Reviews</span>
            <CheckCircle2 size={13} />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              quote: 'The consultation was quick, professional and very helpful. I booked within 2 minutes and got my prescription delivered right away!',
              name: 'Sarah Johnson',
              location: 'Patient · New York',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            },
            {
              quote: 'Easy to book, great doctors, and excellent support. Dr. Smith explained everything so thoroughly. Highly recommended!',
              name: 'Michael Tan',
              location: 'Patient · Chicago',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            },
            {
              quote: 'The best healthcare experience I have had. Simple, fast, and very reliable. The digital health chart keeps all my visits organized.',
              name: 'Ayesha Rahman',
              location: 'Patient · Dallas',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
            }
          ].map((rev) => (
            <div
              key={rev.name}
              className="p-7 rounded-3xl bg-white border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-3 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-black text-[#0C233C]">{rev.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. "YOUR HEALTH, OUR MISSION" (Mid-Page Story Card) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="bg-[#0C233C] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Health, Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Get expert medical care anytime, anywhere. Start your journey to a healthier, happier life today with Curix.
            </p>
            <div className="pt-2">
              <a
                href="#doctors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-curix-primary text-xs font-black shadow-md shadow-[#00A884]/30"
              >
                <span>Find a Doctor</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          <div className="w-full md:w-80 h-48 rounded-2xl overflow-hidden border border-white/20 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
              alt="Medical technology tablet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 11. LATEST HEALTH ARTICLES (Blog Preview) */}
      <section id="articles" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-slate-100">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0C233C] tracking-tight">
              Latest Health Articles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Stay informed with the latest health tips and expert medical advice.
            </p>
          </div>
          <a href="#articles" className="text-xs font-bold text-[#00A884] hover:underline flex items-center gap-1">
            <span>View All Articles</span>
            <ArrowRight size={13} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: '10 Simple Habits for a Healthier Heart',
              tag: 'Cardiology',
              date: 'May 10, 2026 · 4 min read',
              image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80'
            },
            {
              title: 'Best Foods for Stronger Immunity Daily',
              tag: 'Nutrition',
              date: 'May 08, 2026 · 5 min read',
              image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80'
            },
            {
              title: 'How to Manage Stress and Anxiety Daily',
              tag: 'Mental Health',
              date: 'May 05, 2026 · 6 min read',
              image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=80'
            }
          ].map((art) => (
            <div
              key={art.title}
              className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-mono text-[#00A884] font-bold uppercase tracking-wider bg-[#E6F8F3] px-2.5 py-0.5 rounded-full">
                    {art.tag}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0C233C] group-hover:text-[#00A884] transition-colors mt-2 leading-snug">
                    {art.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-2 font-medium">{art.date}</span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-bold text-[#00A884] flex items-center gap-1 cursor-pointer">
                  <span>Read More</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. DOWNLOAD OUR MOBILE APP (Deep Emerald Banner) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#064E48] via-[#0A5750] to-[#043F3A] text-white p-8 sm:p-12 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="space-y-4 max-w-xl text-left relative z-10">
            <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Mobile Healthcare Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Download Our Mobile App
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Get 24/7 access to doctors, appointment booking, digital prescriptions, and health records — right from your smartphone.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-bold flex items-center gap-2.5 transition cursor-pointer"
              >
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Download on the</span>
                  <span className="text-xs font-bold">App Store</span>
                </div>
              </button>

              <button
                type="button"
                className="px-5 py-3 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-bold flex items-center gap-2.5 transition cursor-pointer"
              >
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Get it on</span>
                  <span className="text-xs font-bold">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="relative z-10 w-52 sm:w-60 rounded-[32px] bg-slate-900 border-4 border-slate-700 shadow-2xl p-2.5 text-center shrink-0">
            <div className="rounded-[24px] bg-white p-3.5 text-left text-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black text-[#00A884]">CURIX APP</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="p-2 rounded-xl bg-[#E6F8F3] text-[10px] font-bold text-[#00A884]">
                Next Appointment: Today, 4:00 PM
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Dr. Edward Smith · Interventional Cardiology
              </div>
              <div className="pt-2">
                <button className="w-full py-1.5 rounded-xl btn-curix-primary text-[10px] font-bold text-center">
                  Join Video Call
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 13. MODERN DEEP NAVY FOOTER */}
      <footer id="security" className="bg-[#071A2E] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00A884] flex items-center justify-center text-white font-black text-sm">
                  +
                </div>
                <span className="text-xl font-black text-white tracking-tight">Curix</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">
                Accredited outpatient healthcare management, verified specialist directories, and secure consultation booking. Better care, brighter future.
              </p>
              <div className="flex items-center gap-2.5 pt-2">
                {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#doctors" className="hover:text-white transition">Our Doctors</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#why-us" className="hover:text-white transition">Why Choose Us</a></li>
                <li><a href="#reviews" className="hover:text-white transition">Reviews</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition">FAQs</a></li>
                <li><a href="#home" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#security" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#security" className="hover:text-white transition">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Stay Informed</h4>
              <p className="text-xs text-slate-400">Subscribe to our newsletter for health tips and updates.</p>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 pl-3">
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert('Thank you for subscribing to Curix updates!')}
                  className="px-4 py-2 rounded-full btn-curix-primary text-xs font-bold shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500">
            <p>© 2026 Curix Healthcare Systems. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Lock size={13} className="text-[#00A884]" />
              <span>HIPAA Aligned & Encrypted Health Records</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
