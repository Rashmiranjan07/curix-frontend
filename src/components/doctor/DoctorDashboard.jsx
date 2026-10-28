import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi } from '../../services/api';
import { 
  Stethoscope, Calendar, Clock, CheckCircle2, AlertCircle, 
  Plus, Search, RefreshCw, X, FileText, User, 
  Trash2, Shield, Activity, Layers, ArrowUpRight, Check, Sparkles, Filter, Printer
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'history' | 'profile'
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Rx Modal State
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rxSaving, setRxSaving] = useState(false);
  const [rxForm, setRxForm] = useState({
    diagnosis: '',
    notes: '',
    medicines: [
      { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
    ]
  });

  // View Prescription Modal State
  const [viewingRx, setViewingRx] = useState(null);

  useEffect(() => {
    loadAllDoctorData();
  }, []);

  const loadAllDoctorData = async () => {
    setIsSyncing(true);
    setErrorNotice('');
    try {
      await Promise.all([
        fetchDoctorProfile(),
        fetchSchedule(),
        fetchPrescriptionHistory()
      ]);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const fetchDoctorProfile = async () => {
    try {
      const res = await doctorApi.getMyProfile();
      setProfile(res.data?.data || res.data);
    } catch (err) {
      console.warn("Could not load doctor profile:", err);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await doctorApi.getMySchedule();
      const list = res.data?.data || res.data;
      setSchedule(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load schedule:", err);
      setSchedule([]);
    }
  };

  const fetchPrescriptionHistory = async () => {
    try {
      const res = await doctorApi.getDoctorPrescriptionHistory();
      const list = res.data?.data || res.data;
      setPrescriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load prescriptions:", err);
      setPrescriptions([]);
    }
  };

  const handleCompleteAppointment = async (id) => {
    setErrorNotice('');
    try {
      await doctorApi.completeAppointment(id);
      setSuccessNotice(`Consultation #${id} marked as completed.`);
      await fetchSchedule();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to complete consultation.');
    }
  };

  // Medicine Builder Handlers
  const addMedicineRow = () => {
    setRxForm({
      ...rxForm,
      medicines: [
        ...rxForm.medicines,
        { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
      ]
    });
  };

  const removeMedicineRow = (index) => {
    if (rxForm.medicines.length <= 1) return;
    setRxForm({
      ...rxForm,
      medicines: rxForm.medicines.filter((_, i) => i !== index)
    });
  };

  const updateMedicineField = (index, field, value) => {
    const updated = [...rxForm.medicines];
    updated[index][field] = value;
    setRxForm({ ...rxForm, medicines: updated });
  };

  const handleOpenRxModal = (appt) => {
    setSelectedAppointment(appt);
    setRxForm({
      diagnosis: '',
      notes: '',
      medicines: [
        { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
      ]
    });
    setIsRxModalOpen(true);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setRxSaving(true);
    setErrorNotice('');

    try {
      const payload = {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patient?.id || selectedAppointment.patientId,
        diagnosis: rxForm.diagnosis.trim(),
        notes: rxForm.notes.trim(),
        medicines: rxForm.medicines.map((m) => ({
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          frequency: m.frequency.trim(),
          duration: m.duration.trim(),
          instructions: m.instructions.trim()
        }))
      };

      await doctorApi.createPrescription(payload);
      setSuccessNotice(`Official Prescription issued for Patient #${payload.patientId}.`);
      setIsRxModalOpen(false);
      setSelectedAppointment(null);
      await fetchSchedule();
      await fetchPrescriptionHistory();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to generate digital prescription.');
    } finally {
      setRxSaving(false);
    }
  };

  // Metrics
  const pendingCount = schedule.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length;
  const completedCount = schedule.filter(a => a.status === 'COMPLETED').length;
  const cancelledCount = schedule.filter(a => a.status === 'CANCELLED').length;
  const totalCount = schedule.length;

  // Filtered Queue
  const filteredSchedule = schedule.filter((appt) => {
    const statusMatch = statusFilter === 'ALL' || appt.status === statusFilter;
    const patName = (appt.patient?.fullName || appt.patientName || appt.patient?.user?.firstName || '').toLowerCase();
    const reasonMatch = (appt.reason || '').toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && (patName.includes(searchQuery.toLowerCase()) || reasonMatch);
  });

  const doctorDisplayName = profile?.firstName && profile?.lastName 
    ? `Dr. ${profile.firstName} ${profile.lastName}`
    : profile?.name || 'Attending Physician';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex pt-16">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 border-r border-slate-800/80 bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#070d1e] hidden lg:flex flex-col justify-between fixed top-16 bottom-0 left-0 z-30 shadow-2xl text-slate-300">
        
        <div className="p-5 space-y-6">
          
          {/* Node Status Indicator Card */}
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/20 backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                <Stethoscope size={18} />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 leading-none">Clinical Node</span>
                </div>
                <span className="text-xs font-black text-white tracking-wide truncate block mt-0.5">Physician Desk</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-slate-400 px-3 uppercase tracking-wider block mb-2">
              Clinical Workspace
            </span>

            {/* 1. Queue Button */}
            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'queue'
                  ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/15 to-transparent text-white border-l-4 border-emerald-400 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'queue'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-800'
                }`}>
                  <Activity size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Patient Queue</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'queue'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
              }`}>
                {pendingCount}
              </span>
            </button>

            {/* 2. Prescriptions History Button */}
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-sky-500/20 via-sky-500/15 to-transparent text-white border-l-4 border-[#0ea5e9] shadow-md shadow-sky-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky-500/30'
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-sky-400 group-hover:bg-slate-800'
                }`}>
                  <FileText size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Rx Archives</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
              }`}>
                {prescriptions.length}
              </span>
            </button>

            {/* 3. Shifts & Credentials Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-indigo-500/20 via-indigo-500/15 to-transparent text-white border-l-4 border-indigo-400 shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'profile'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800'
                }`}>
                  <Clock size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Shift & Credentials</span>
              </div>
            </button>
          </div>
        </div>

        {/* Doctor Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f20]/60 backdrop-blur-xs">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-bold text-white block truncate">{doctorDisplayName}</span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Licensed Attending
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
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
            { id: 'queue', label: 'Patient Queue' },
            { id: 'history', label: 'Rx Archives' },
            { id: 'profile', label: 'Shift Schedule' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {successNotice && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
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
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-800 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button onClick={() => setErrorNotice('')} className="text-rose-700 hover:text-rose-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* TAB 1: CLINICAL PATIENT QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black tracking-widest text-emerald-600 uppercase">CLINICAL PRACTICE DESK</span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Consultation Queue
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{doctorDisplayName}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                  {profile?.specialty || 'General Medicine'} · Consultation Rate: <strong className="text-slate-800 font-mono">${profile?.consultationFee || '50.00'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllDoctorData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-extrabold text-slate-700 hover:bg-slate-50 shadow-xs transition disabled:opacity-60"
                >
                  <RefreshCw size={14} className={`text-emerald-500 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Refresh Queue'}</span>
                </button>
              </div>
            </div>

            {/* METRICS STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Today's Queue</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono mt-2 block">{totalCount}</span>
                <span className="text-[11px] font-bold text-slate-500 mt-1 block">Scheduled visits</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-[#0ea5e9]" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Awaiting Review</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-amber-700 tracking-tight font-mono mt-2 block">{pendingCount}</span>
                <span className="text-[11px] font-bold text-amber-600 mt-1 block">Pending consultations</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Completed</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-700 tracking-tight font-mono mt-2 block">{completedCount}</span>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Care delivered</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Rx Generated</span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-indigo-700 tracking-tight font-mono mt-2 block">{prescriptions.length}</span>
                <span className="text-[11px] font-bold text-indigo-600 mt-1 block">Digital slips issued</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
              </div>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient name, contact, or clinical complaint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Statuses ({schedule.length})</option>
                  <option value="CONFIRMED">Confirmed / Active ({pendingCount})</option>
                  <option value="COMPLETED">Completed ({completedCount})</option>
                  <option value="CANCELLED">Cancelled ({cancelledCount})</option>
                </select>
              </div>
            </div>

            {/* CONSULTATION CARDS */}
            {filteredSchedule.length > 0 ? (
              <div className="space-y-3.5">
                {filteredSchedule.map((appt) => {
                  const pat = appt.patient || {};
                  const patName = pat.fullName || appt.patientName || (pat.user ? `${pat.user.firstName} ${pat.user.lastName}` : `Patient #${appt.patientId || appt.id}`);
                  const isCompleted = appt.status === 'COMPLETED';
                  const isCancelled = appt.status === 'CANCELLED';
                  const isPending = !isCompleted && !isCancelled;

                  return (
                    <div 
                      key={appt.id} 
                      className={`p-5 rounded-2xl bg-white border transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCompleted ? 'border-emerald-200/80 bg-emerald-50/20' : 
                        isCancelled ? 'border-slate-200 opacity-60' : 'border-slate-200/90 hover:border-emerald-300'
                      }`}
                    >
                      {/* Patient Details & Clinical Vitals */}
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-[#0ea5e9]'
                        }`}>
                          {patName.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900">{patName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' :
                              isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-[#0ea5e9]'
                            }`}>
                              {appt.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                            <span>ID: #{appt.patientId || pat.id || 'N/A'}</span>
                            {pat.bloodGroup && <span>· Blood: <strong className="text-slate-800 font-mono">{pat.bloodGroup}</strong></span>}
                            {pat.age && <span>· Age: {pat.age} yrs</span>}
                            {pat.gender && <span>· {pat.gender}</span>}
                            {pat.contactNumber && <span>· Tel: <strong className="font-mono text-slate-700">{pat.contactNumber}</strong></span>}
                          </div>

                          {appt.reason && (
                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl max-w-xl">
                              <strong className="text-slate-800">Chief Complaint:</strong> {appt.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Slot Info & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        <div className="sm:text-right pr-2">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Scheduled Time</span>
                          <span className="text-xs font-black text-slate-800 font-mono block mt-0.5">
                            {appt.appointmentDate} · {appt.appointmentTime?.slice(0, 5) || 'Slot'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleCompleteAppointment(appt.id)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                              >
                                <Check size={14} />
                                <span>Mark Done</span>
                              </button>
                              <button
                                onClick={() => handleOpenRxModal(appt)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                              >
                                <FileText size={14} />
                                <span>Write Rx</span>
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <button
                              onClick={() => handleOpenRxModal(appt)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
                            >
                              <Plus size={14} />
                              <span>Prescribe</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-800">No consultations in queue</p>
                <p className="text-xs text-slate-400 mt-1">Select another filter or refresh your clinical roster.</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PRESCRIPTION ARCHIVES */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Archives</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Historical digital prescription slips issued from this node ({prescriptions.length} slips).</p>
              </div>
              <button
                onClick={fetchPrescriptionHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              >
                <RefreshCw size={13} className="text-[#0ea5e9]" />
                <span>Refresh Slips</span>
              </button>
            </div>

            {prescriptions.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              Patient #{rx.patientId || rx.patient?.id || 'Record'}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                              Rx-ID: #{rx.id}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">
                            <strong className="text-slate-900">Diagnosis:</strong> {rx.diagnosis || 'Routine review'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {rx.medicines?.length || 0} line-item medications prescribed · Appt #{rx.appointmentId || 'Direct'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Prescribed On</span>
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'Recorded'}
                          </span>
                        </div>
                        <button
                          onClick={() => setViewingRx(rx)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs"
                        >
                          View Slip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-800">No digital prescriptions issued yet</p>
                <p className="text-xs text-slate-400 mt-1">Complete visits from your queue and issue digital Rx slips.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHIFTS & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shift & Credentials</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Your clinical profile, license details, and configured booking slots.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Credentials Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <span>Licensed Medical Credentials</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Full Name</span>
                    <span className="font-bold text-slate-900">{doctorDisplayName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Department</span>
                    <span className="font-bold text-slate-900">{profile?.departmentName || profile?.department?.name || 'Clinical'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Specialty</span>
                    <span className="font-bold text-[#0ea5e9]">{profile?.specialty || 'General Practitioner'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Medical License</span>
                    <span className="font-mono font-bold text-slate-900">{profile?.licenseNumber || 'VERIFIED'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Qualifications</span>
                    <span className="font-bold text-slate-900">{profile?.qualification || 'MBBS'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Consultation Fee</span>
                    <span className="font-black text-emerald-700 text-sm font-mono">${profile?.consultationFee || '50.00'}</span>
                  </div>
                </div>
              </div>

              {/* Working Shifts Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-[#0ea5e9]" />
                  <span>Configured Shift Availability</span>
                </h3>

                {profile?.availabilities && profile.availabilities.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.availabilities.map((avail, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-900">{avail.dayOfWeek}</span>
                        </div>
                        <span className="font-mono text-slate-600 font-bold">
                          {avail.startTime?.slice(0, 5)} - {avail.endTime?.slice(0, 5)} ({avail.slotMinutes || 30}m slots)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No custom shifts assigned. Contact the Hospital Admin Console to configure consultation days.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: WRITE PRESCRIPTION */}
      {isRxModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsRxModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">CURIX CLINICAL DESK</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">Issue Electronic Prescription</h3>
            <p className="text-xs text-slate-500 mb-5">
              Generating clinical Rx for Appointment #{selectedAppointment.id}.
            </p>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Pharyngitis, Stage 1 Hypertension"
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Medicine Multi-Line Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">Prescribed Medications</label>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {rxForm.medicines.map((med, index) => (
                    <div key={index} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Medicine #{index + 1}
                        </span>
                        {rxForm.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(index)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          placeholder="Medicine Name (e.g. Amoxicillin)"
                          value={med.name}
                          onChange={(e) => updateMedicineField(index, 'name', e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Dosage (e.g. 500mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedicineField(index, 'dosage', e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Freq (e.g. 1-0-1)"
                          value={med.frequency}
                          onChange={(e) => updateMedicineField(index, 'frequency', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 7 days)"
                          value={med.duration}
                          onChange={(e) => updateMedicineField(index, 'duration', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Instructions (e.g. After meals)"
                          value={med.instructions}
                          onChange={(e) => updateMedicineField(index, 'instructions', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor's Clinical Notes / Advice</label>
                <textarea
                  rows={3}
                  placeholder="Dietary precautions, test recommendations, rest instructions..."
                  value={rxForm.notes}
                  onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRxModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rxSaving}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {rxSaving ? <Loader2 size={13} className="animate-spin" /> : <FileText size={14} />}
                  <span>Sign & Issue Prescription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW & PRINT PRESCRIPTION SLIP */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setViewingRx(null)}
              className="no-print absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            {/* PRINTABLE CONTAINER */}
            <div id="printable-prescription-slip" className="space-y-6">
              
              <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-xl font-black text-slate-900 tracking-tight">CURIX HEALTHCARE SYSTEM</span>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Outpatient Department (OPD) · Clinical Prescription</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-900 block">Rx ID: #{viewingRx.id}</span>
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Date: {viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patient Identification</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`}
                  </span>
                  <span className="text-slate-600 font-mono">Consultation Ref: #{viewingRx.appointmentId || 'N/A'}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Prescribing Physician</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">{doctorDisplayName}</span>
                  <span className="text-slate-600 font-medium">LIC: {profile?.licenseNumber || 'VERIFIED'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Clinical Diagnosis</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {viewingRx.diagnosis || 'General Clinical Review'}
                </p>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block mb-2.5">
                  ℞ Prescribed Medications
                </span>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Medicine & Strength</th>
                        <th className="py-2.5 px-3">Dosage / Frequency</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {(viewingRx.medicines || []).map((m, idx) => {
                        const medName = m.name || m.medicineName || 'Medication';
                        const medDose = m.dosage || m.dose || m.strength || 'As directed';
                        const medFreq = m.frequency || m.freq || m.timing || '1-0-1';
                        const medDuration = m.duration || m.days || '5 days';
                        const medInstructions = m.instructions || m.instruction || m.notes || 'After meals';

                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <span className="font-black text-slate-900 text-xs block">{medName}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900">{medDose}</span>
                              <span className="text-[11px] text-slate-600 block font-mono font-bold">({medFreq})</span>
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

              {viewingRx.notes && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Physician Instructions</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">{viewingRx.notes}</p>
                </div>
              )}

              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs">
                <span className="text-[10px] text-slate-400 italic">This is an electronically generated and verified medical record.</span>
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 pb-1 font-mono text-[11px] font-bold text-slate-800">
                    Digitally Authorized
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">Attending Physician Seal</span>
                </div>
              </div>

            </div>

            <div className="no-print pt-6 mt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingRx(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
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