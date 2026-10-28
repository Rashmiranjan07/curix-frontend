import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi, adminApi } from '../../services/api';
import { 
  Heart, Calendar, Stethoscope, Clock, FileText, User, 
  Search, CheckCircle2, AlertCircle, X, ChevronRight, 
  RefreshCw, Building2, DollarSign, Printer, ArrowUpRight, 
  Sparkles, Check, MapPin, Phone
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'appointments' | 'prescriptions' | 'profile'
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // 1. Booking State
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // 2. Appointments State
  const [myAppointments, setMyAppointments] = useState([]);

  // 3. Cancellation Modal
  const [cancellingAppt, setCancellingAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule Conflict');
  const [customCancelText, setCustomCancelText] = useState('');
  const [cancelSaving, setCancelSaving] = useState(false);

  // 4. Prescriptions State
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [viewingRx, setViewingRx] = useState(null);

  // 5. Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    bloodGroup: '',
    age: '',
    gender: 'OTHER',
    address: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    loadAllPatientData();
  }, []);

  const loadAllPatientData = async () => {
    setIsSyncing(true);
    setErrorNotice('');
    try {
      await Promise.all([
        fetchDepartments(),
        fetchDoctors(),
        fetchMyAppointments(),
        fetchMyPrescriptions(),
        fetchMyProfile()
      ]);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await adminApi.getDepartments();
      const list = res.data?.data || res.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load departments:", err);
    }
  };

  const fetchDoctors = async (deptId = null) => {
    try {
      const res = await patientApi.getDoctors(deptId === 'ALL' ? null : deptId);
      const list = res.data?.data || res.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load doctors:", err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await patientApi.getMyAppointments();
      const list = res.data?.data || res.data;
      setMyAppointments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load appointments:", err);
    }
  };

  const fetchMyPrescriptions = async () => {
    try {
      const res = await patientApi.getMyPrescriptions();
      const list = res.data?.data || res.data;
      setMyPrescriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load prescriptions:", err);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await patientApi.getMyProfile();
      const data = res.data?.data || res.data;
      if (data) {
        setProfile({
          firstName: data.firstName || data.user?.firstName || '',
          lastName: data.lastName || data.user?.lastName || '',
          email: data.email || data.user?.email || '',
          contactNumber: data.contactNumber || '',
          bloodGroup: data.bloodGroup || '',
          age: data.age || '',
          gender: data.gender || 'OTHER',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.warn("Could not load profile:", err);
    }
  };

  // Doctor & Slot Lookup
  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setBookingDate('');
    setAvailableSlots([]);
    setSelectedSlot('');
    setBookingReason('');
  };

  const handleDateChange = async (date) => {
    setBookingDate(date);
    setSelectedSlot('');
    if (!selectedDoctor || !date) return;

    setSlotsLoading(true);
    try {
      const res = await patientApi.getAvailableSlots(selectedDoctor.id, date);
      const slots = res.data?.data || res.data;
      setAvailableSlots(Array.isArray(slots) ? slots : []);
    } catch (err) {
      console.warn("Could not load slots:", err);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !selectedSlot) return;

    setIsBookingSubmitting(true);
    setErrorNotice('');

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        appointmentDate: bookingDate,
        appointmentTime: selectedSlot.length === 5 ? `${selectedSlot}:00` : selectedSlot,
        reason: bookingReason.trim() || 'General Clinical Consultation'
      };

      await patientApi.bookAppointment(payload);
      setSuccessNotice(`Consultation booked with ${getDoctorName(selectedDoctor)} on ${bookingDate} at ${selectedSlot}.`);
      setSelectedDoctor(null);
      await fetchMyAppointments();
      setActiveTab('appointments');
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to complete booking.');
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  // Cancellation
  const handleConfirmCancel = async () => {
    if (!cancellingAppt) return;
    setCancelSaving(true);
    setErrorNotice('');

    try {
      const finalReason = cancelReason === 'Other' ? customCancelText : cancelReason;
      await patientApi.cancelAppointment(cancellingAppt.id, finalReason);
      setSuccessNotice(`Consultation #${cancellingAppt.id} has been cancelled.`);
      setCancellingAppt(null);
      await fetchMyAppointments();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelSaving(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setErrorNotice('');

    try {
      await patientApi.updateMyProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        contactNumber: profile.contactNumber.trim(),
        bloodGroup: profile.bloodGroup.trim(),
        age: profile.age ? Number(profile.age) : null,
        gender: profile.gender,
        address: profile.address.trim()
      });
      setSuccessNotice('Your personal health chart has been successfully updated.');
      await fetchMyProfile();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const getDoctorName = (doc) => {
    if (!doc) return 'Specialist';
    if (doc.firstName && doc.lastName) return `Dr. ${doc.firstName} ${doc.lastName}`;
    if (doc.fullName) return doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
    if (doc.doctorName) return doc.doctorName;
    return `Doctor #${doc.id}`;
  };

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = getDoctorName(doc).toLowerCase().includes(doctorSearch.toLowerCase()) ||
                      (doc.specialty || '').toLowerCase().includes(doctorSearch.toLowerCase());
    const deptMatch = selectedDept === 'ALL' || String(doc.departmentId || doc.department?.id) === String(selectedDept);
    return nameMatch && deptMatch;
  });

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-slate-800 flex pt-16">
      
      {/* SIDEBAR NAVIGATION - PORTEA DEEP PINE THEME */}
      <aside className="w-72 border-r border-[#005A5B]/15 bg-gradient-to-b from-[#005A5B] via-[#004849] to-[#003839] hidden lg:flex flex-col justify-between fixed top-16 bottom-0 left-0 z-30 shadow-2xl text-slate-200">
        
        <div className="p-5 space-y-6">
          
          {/* Node Status Indicator Card */}
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F26522] to-[#FF7E47] text-white flex items-center justify-center shadow-lg shadow-[#F26522]/30 shrink-0">
                <Heart size={18} className="fill-white/20" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FF9E6C] leading-none">Patient Portal</span>
                </div>
                <span className="text-xs font-black text-white tracking-wide truncate block mt-0.5">Care Management</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-white/60 px-3 uppercase tracking-wider block mb-2">
              Healthcare Services
            </span>

            {/* 1. Book Consultation */}
            <button
              onClick={() => setActiveTab('book')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'book'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'book'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Stethoscope size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Find & Book Doctor</span>
              </div>
            </button>

            {/* 2. My Appointments */}
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Calendar size={16} />
                </div>
                <span className="text-[13px] tracking-tight">My Consultations</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'appointments'
                  ? 'bg-[#F26522]/30 text-white border border-[#F26522]/40'
                  : 'bg-white/10 text-slate-300 group-hover:text-white'
              }`}>
                {myAppointments.length}
              </span>
            </button>

            {/* 3. My Prescriptions */}
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'prescriptions'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'prescriptions'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <FileText size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Digital Rx Vault</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'prescriptions'
                  ? 'bg-[#F26522]/30 text-white border border-[#F26522]/40'
                  : 'bg-white/10 text-slate-300 group-hover:text-white'
              }`}>
                {myPrescriptions.length}
              </span>
            </button>

            {/* 4. Health Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <User size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Health Chart</span>
              </div>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/10 bg-[#003839]/60 backdrop-blur-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-bold text-white block truncate">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : user?.email}
              </span>
              <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Patient
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl border border-transparent transition-all"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 lg:ml-72 p-6 sm:p-10 max-w-7xl w-full mx-auto">
        
        {/* MOBILE HORIZONTAL TABS */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-4 mb-4">
          {[
            { id: 'book', label: 'Find Doctors' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'prescriptions', label: 'Prescriptions' },
            { id: 'profile', label: 'My Chart' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#F26522] text-white' : 'bg-white border border-[#005A5B]/15 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {successNotice && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button onClick={() => setSuccessNotice('')} className="text-emerald-700 hover:text-emerald-900">
              <X size={14} />
            </button>
          </div>
        )}

        {errorNotice && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button onClick={() => setErrorNotice('')} className="text-rose-700 hover:text-rose-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* TAB 1: FIND & BOOK DOCTORS */}
        {activeTab === 'book' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black tracking-widest text-[#005A5B] uppercase">CURIX CLINICAL NETWORK</span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBF5F5] border border-[#005A5B]/15 text-[10px] font-bold text-[#005A5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896] animate-pulse" />
                    Available Specialist Network
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#005A5B] tracking-tight">Find & Book a Physician</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Select a medical specialty, choose your preferred physician, and reserve an appointment slot.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllPatientData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#005A5B]/20 hover:border-[#F26522] text-xs font-extrabold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-xs transition disabled:opacity-60"
                >
                  <RefreshCw size={14} className={`text-[#F26522] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Refreshing...' : 'Refresh Network'}</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search physician by name or clinical specialty..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#005A5B]/15 bg-white text-xs focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div className="sm:w-60">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#005A5B]/15 bg-white text-xs font-bold text-[#005A5B] focus:outline-none focus:border-[#F26522]"
                >
                  <option value="ALL">All Departments ({departments.length})</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DOCTORS GRID */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doc) => {
                  const docName = getDoctorName(doc);
                  return (
                    <div key={doc.id} className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col justify-between hover:border-[#F26522]/50 hover:shadow-md transition group">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold text-sm shrink-0">
                            {docName.replace('Dr. ', '').charAt(0)}
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            Available
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-[#005A5B] group-hover:text-[#F26522] transition-colors">{docName}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5F5] text-[#005A5B] border border-[#005A5B]/15 uppercase inline-block mt-1">
                          {doc.specialty || 'Specialist'}
                        </span>

                        <p className="text-xs text-slate-500 font-medium mt-2">
                          {doc.qualification || 'Physician'} · {doc.experienceYears || 0} years practice
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Consultation Fee</span>
                          <span className="text-base font-black text-[#005A5B] font-mono mt-1 block">
                            ${doc.consultationFee !== undefined ? doc.consultationFee : '50.00'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenBooking(doc)}
                          className="px-5 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-md shadow-[#F26522]/20 flex items-center gap-1.5"
                        >
                          <Calendar size={13} />
                          <span>Book Slot</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No physicians match your filter</p>
                <p className="text-xs text-slate-400 mt-1">Try selecting another department or clearing search parameters.</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">My Consultations</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">History of booked hospital appointments and consultation status.</p>
              </div>
              <button
                onClick={fetchMyAppointments}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#005A5B]/15 text-xs font-bold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-2xs transition"
              >
                <RefreshCw size={13} className="text-[#F26522]" />
                <span>Refresh Visits</span>
              </button>
            </div>

            {myAppointments.length > 0 ? (
              <div className="space-y-3">
                {myAppointments.map((appt) => {
                  const doc = appt.doctor || {};
                  const docName = getDoctorName(doc);
                  const isCompleted = appt.status === 'COMPLETED';
                  const isCancelled = appt.status === 'CANCELLED';
                  const isPending = !isCompleted && !isCancelled;

                  return (
                    <div 
                      key={appt.id} 
                      className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#005A5B]/30 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-[#EBF5F5] text-[#005A5B]'
                        }`}>
                          <Stethoscope size={18} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-[#005A5B]">{docName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' :
                              isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-[#F26522]/10 text-[#F26522]'
                            }`}>
                              {appt.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {doc.specialty || 'Specialist'} · Fee: <strong className="font-mono text-[#005A5B]">${appt.consultationFee || doc.consultationFee || '50.00'}</strong>
                          </p>

                          {appt.reason && (
                            <p className="text-xs text-slate-600 mt-1.5 italic">
                              "{appt.reason}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="sm:text-right pr-2">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Appointment Slot</span>
                          <span className="text-xs font-black text-[#005A5B] font-mono block mt-0.5">
                            {appt.appointmentDate} · {appt.appointmentTime?.slice(0, 5)}
                          </span>
                        </div>

                        {isPending && (
                          <button
                            onClick={() => setCancellingAppt(appt)}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                          >
                            Cancel
                          </button>
                        )}

                        {isCompleted && (
                          <button
                            onClick={() => setActiveTab('prescriptions')}
                            className="px-4 py-2 rounded-xl bg-[#005A5B] hover:bg-[#004849] text-white text-xs font-bold transition shadow-xs"
                          >
                            View Prescription
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No consultations booked</p>
                <p className="text-xs text-slate-400 mt-1">Switch to "Find & Book Doctor" to reserve your first slot.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL RX VAULT */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Digital Prescription Vault</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Official medical prescriptions issued by your attending physicians.</p>
              </div>
              <button
                onClick={fetchMyPrescriptions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#005A5B]/15 text-xs font-bold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-2xs transition"
              >
                <RefreshCw size={13} className="text-[#F26522]" />
                <span>Refresh Vault</span>
              </button>
            </div>

            {myPrescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPrescriptions.map((rx) => (
                  <div key={rx.id} className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col justify-between hover:border-[#005A5B]/30 transition">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold">
                          <FileText size={18} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Rx-ID: #{rx.id}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis</span>
                      <h4 className="text-sm font-black text-[#005A5B] mt-0.5">{rx.diagnosis || 'Clinical Consultation'}</h4>

                      <p className="text-xs text-slate-500 mt-2">
                        {rx.medicines?.length || 0} medications prescribed · Issued {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Official Record</span>
                      <button
                        onClick={() => setViewingRx(rx)}
                        className="px-4 py-2 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <Printer size={13} />
                        <span>View / Print Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No prescriptions found</p>
                <p className="text-xs text-slate-400 mt-1">Prescriptions issued by doctors after consultations will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PERSONAL HEALTH CHART */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Personal Health Chart</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Maintain your emergency contact, blood group, and demographic vitals.</p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs max-w-2xl">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35] focus:outline-none focus:border-[#F26522]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35] focus:outline-none focus:border-[#F26522]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={profile.contactNumber}
                      onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#F26522]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">Blood Group</label>
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#F26522]"
                    >
                      <option value="">-- Select Blood Group --</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">Age</label>
                    <input
                      type="number"
                      min={0}
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#F26522]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#005A5B] mb-1">Gender</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#F26522]"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#F26522] resize-none"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Update Health Chart'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: BOOKING & SLOT SELECTION */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-black text-[#F26522] tracking-widest uppercase">SLOT RESERVATION</span>
            <h3 className="text-xl font-black text-[#005A5B] mt-0.5">Book with {getDoctorName(selectedDoctor)}</h3>
            <p className="text-xs text-slate-500 mb-5">{selectedDoctor.specialty} · Fee: ${selectedDoctor.consultationFee || '50.00'}</p>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Consultation Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#F26522]"
                />
              </div>

              {/* Slot Grid */}
              {bookingDate && (
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1.5">
                    Select Available Consultation Slot *
                  </label>

                  {slotsLoading ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-bold">
                      Checking physician calendar slots...
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const slotTime = typeof slot === 'string' ? slot : slot.time || slot.startTime;
                        const isSelected = selectedSlot === slotTime;
                        return (
                          <button
                            key={slotTime}
                            type="button"
                            onClick={() => setSelectedSlot(slotTime)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                              isSelected
                                ? 'bg-[#F26522] text-white shadow-xs'
                                : 'bg-[#EBF5F5] border border-[#005A5B]/15 text-[#005A5B] hover:bg-[#005A5B]/10'
                            }`}
                          >
                            {slotTime?.slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                      No open slots on this date. Please pick another working day.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Reason for Visit / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Describe symptoms, concerns, or checkup reason..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#F26522] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot || isBookingSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {isBookingSubmitting ? 'Reserving...' : 'Confirm Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL APPOINTMENT */}
      {cancellingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-black text-[#005A5B] mb-1">Cancel Consultation</h3>
            <p className="text-xs text-slate-500 mb-4">Are you sure you want to cancel consultation #{cancellingAppt.id}?</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Cancellation Reason</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-800"
                >
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Feeling Better">Feeling Better / Resolved</option>
                  <option value="Doctor Reschedule Request">Doctor Reschedule</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter reason..."
                  value={customCancelText}
                  onChange={(e) => setCustomCancelText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                />
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingAppt(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50"
                >
                  Keep Visit
                </button>
                <button
                  type="button"
                  disabled={cancelSaving}
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                >
                  {cancelSaving ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW & PRINT DIGITAL PRESCRIPTION */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setViewingRx(null)}
              className="no-print absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            {/* PRINTABLE CONTAINER */}
            <div id="printable-prescription-slip" className="space-y-6">
              
              {/* Slip Header */}
              <div className="border-b-2 border-[#005A5B] pb-4 flex items-start justify-between">
                <div>
                  <span className="text-xl font-black text-[#005A5B] tracking-tight">CURIX HEALTHCARE SYSTEM</span>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Outpatient Department (OPD) · Clinical Prescription</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#005A5B] block">Rx ID: #{viewingRx.id}</span>
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Date: {viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Patient & Doctor Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#EBF5F5] border border-[#005A5B]/15 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patient Identification</span>
                  <span className="text-sm font-black text-[#005A5B] block mt-0.5">
                    {profile.firstName ? `${profile.firstName} ${profile.lastName}` : `Patient #${viewingRx.patientId || 'Record'}`}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {profile.bloodGroup ? `Blood: ${profile.bloodGroup} · ` : ''}
                    {profile.age ? `Age: ${profile.age} yrs · ` : ''}
                    {profile.gender || ''}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Attending Physician</span>
                  <span className="text-sm font-black text-[#005A5B] block mt-0.5">
                    {viewingRx.doctorName || viewingRx.doctor?.name || 'Attending Physician'}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {viewingRx.departmentName || viewingRx.doctor?.specialty || 'General Medicine'}
                  </span>
                </div>
              </div>

              {/* Clinical Diagnosis */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Clinical Diagnosis</span>
                <p className="text-sm font-black text-[#005A5B] mt-1">
                  {viewingRx.diagnosis || 'Routine General Consultation'}
                </p>
              </div>

              {/* Prescribed Medications Table */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#005A5B] block mb-2.5">
                  ℞ Prescribed Medications
                </span>

                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#EBF5F5] border-b border-[#005A5B]/15 text-[10px] uppercase font-bold text-[#005A5B] tracking-wider">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Medicine & Strength</th>
                        <th className="py-2.5 px-3">Dosage / Frequency</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-slate-800">
                      {(viewingRx.medicines || []).map((m, idx) => {
                        const medName = m.name || m.medicineName || 'Medication';
                        const medDose = m.dosage || m.dose || m.strength || 'As directed';
                        const medFreq = m.frequency || m.freq || m.timing || '1-0-1';
                        const medDuration = m.duration || m.days || '5 days';
                        const medInstructions = m.instructions || m.instruction || m.notes || 'After meals';

                        return (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <span className="font-black text-[#005A5B] text-xs block">{medName}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900">{medDose}</span>
                              <span className="text-[11px] text-[#F26522] block font-mono font-bold">({medFreq})</span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-700">{medDuration}</td>
                            <td className="py-3 px-3 font-medium text-slate-700">{medInstructions}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dietary & Clinical Advice */}
              {viewingRx.notes && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Doctor's Dietary & Clinical Notes</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">{viewingRx.notes}</p>
                </div>
              )}

              {/* Official Stamp / Signature Line */}
              <div className="pt-8 flex justify-between items-end border-t border-stone-200 text-xs">
                <span className="text-[10px] text-slate-400 italic">This is an electronically generated and verified medical record.</span>
                <div className="text-center">
                  <div className="w-40 border-b border-[#005A5B] pb-1 font-mono text-[11px] font-bold text-[#005A5B]">
                    Digitally Authorized
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">Medical Officer Seal</span>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="no-print pt-6 mt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingRx(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print Official Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}