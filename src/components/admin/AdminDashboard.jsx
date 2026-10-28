import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { 
  Building2, Users, Stethoscope, DollarSign, Activity, 
  Shield, Plus, RefreshCw, AlertCircle, CheckCircle2, 
  Loader2, X, Search, Calendar, ChevronLeft, ChevronRight, 
  Clock, Edit3, Save, Layers, ArrowUpRight, TrendingUp,
  FileCheck2, Check, Zap, Sparkles
} from 'lucide-react';

const WEEKDAYS = [
  { id: 'MONDAY', label: 'Mon' },
  { id: 'TUESDAY', label: 'Tue' },
  { id: 'WEDNESDAY', label: 'Wed' },
  { id: 'THURSDAY', label: 'Thu' },
  { id: 'FRIDAY', label: 'Fri' },
  { id: 'SATURDAY', label: 'Sat' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'departments' | 'doctors' | 'audit'
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // 1. Analytics Data
  const [metrics, setMetrics] = useState(null);

  // 2. Departments Data
  const [departments, setDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState('');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', description: '', active: true });
  const [deptSaving, setDeptSaving] = useState(false);

  // 3. Doctors Data & Provisioning
  const [doctors, setDoctors] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorSaving, setDoctorSaving] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    departmentId: '',
    licenseNumber: '',
    specialty: '',
    qualification: '',
    experienceYears: 3,
    consultationFee: 50.00,
  });

  // Shift & Availability Config for New Doctor
  const [selectedDays, setSelectedDays] = useState(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
  const [shiftStartTime, setShiftStartTime] = useState('09:00');
  const [shiftEndTime, setShiftEndTime] = useState('17:00');
  const [slotMinutes, setSlotMinutes] = useState(30);

  // Doctor Edit Modal State
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDoctorSaving, setEditDoctorSaving] = useState(false);
  const [editDoctorForm, setEditDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    specialty: '',
    qualification: '',
    experienceYears: 0,
    consultationFee: 50.00,
    licenseNumber: ''
  });

  // 4. Audit Logs Data with Pagination
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditPage, setAuditPage] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditTotalElements, setAuditTotalElements] = useState(0);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setIsSyncing(true);
    setErrorNotice('');
    try {
      await Promise.all([
        fetchMetrics(),
        fetchDepartments(),
        fetchDoctors(),
        fetchAuditLogs(0)
      ]);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await adminApi.getDashboardMetrics();
      setMetrics(res.data?.data || res.data);
    } catch (err) {
      console.warn("Could not load dashboard metrics:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await adminApi.getDepartments();
      const list = res.data?.data || res.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load departments:", err);
      setDepartments([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await adminApi.getAllDoctors();
      const list = res.data?.data || res.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load doctors:", err);
      setDoctors([]);
    }
  };

  const fetchAuditLogs = async (page = 0) => {
    setAuditLoading(true);
    try {
      const res = await adminApi.getAuditLogs(page, 15);
      const pageData = res.data?.data || res.data;
      if (pageData && pageData.content) {
        setAuditLogs(pageData.content);
        setAuditTotalPages(pageData.totalPages || 1);
        setAuditPage(pageData.number || 0);
        setAuditTotalElements(pageData.totalElements || pageData.content.length);
      } else if (Array.isArray(pageData)) {
        setAuditLogs(pageData);
        setAuditTotalPages(1);
        setAuditPage(0);
        setAuditTotalElements(pageData.length);
      }
    } catch (err) {
      console.warn("Could not load audit logs:", err);
      setAuditLogs([]);
    } finally {
      setAuditLoading(false);
    }
  };

  const getDoctorDisplayName = (doc) => {
    if (!doc) return 'Attending Physician';
    if (doc.firstName && doc.lastName) return `Dr. ${doc.firstName} ${doc.lastName}`;
    if (doc.fullName) return doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
    if (doc.doctorName) return doc.doctorName.startsWith('Dr.') ? doc.doctorName : `Dr. ${doc.doctorName}`;
    if (doc.name) return doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`;
    if (doc.user && doc.user.firstName) return `Dr. ${doc.user.firstName} ${doc.user.lastName || ''}`;
    if (doc.email) return doc.email.split('@')[0];
    return `Doctor #${doc.id}`;
  };

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length <= 1) return;
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setDeptSaving(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      const payload = {
        name: deptForm.name.trim(),
        description: deptForm.description.trim(),
        active: Boolean(deptForm.active)
      };

      await adminApi.createDepartment(payload);
      setSuccessNotice(`Department "${payload.name}" registered successfully.`);
      setIsDeptModalOpen(false);
      setDeptForm({ name: '', description: '', active: true });
      await fetchDepartments();
      await fetchMetrics();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to create department.');
    } finally {
      setDeptSaving(false);
    }
  };

  const handleProvisionDoctor = async (e) => {
    e.preventDefault();
    setDoctorSaving(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      const formattedAvailabilities = selectedDays.map((day) => ({
        dayOfWeek: day,
        startTime: shiftStartTime.length === 5 ? `${shiftStartTime}:00` : shiftStartTime,
        endTime: shiftEndTime.length === 5 ? `${shiftEndTime}:00` : shiftEndTime,
        slotMinutes: Number(slotMinutes),
        active: true,
      }));

      const payload = {
        email: doctorForm.email.trim(),
        password: doctorForm.password,
        firstName: doctorForm.firstName.trim(),
        lastName: doctorForm.lastName.trim(),
        departmentId: Number(doctorForm.departmentId),
        licenseNumber: doctorForm.licenseNumber.trim(),
        specialty: doctorForm.specialty.trim(),
        qualification: doctorForm.qualification.trim(),
        experienceYears: Number(doctorForm.experienceYears),
        consultationFee: parseFloat(doctorForm.consultationFee),
        availabilities: formattedAvailabilities
      };

      await adminApi.provisionDoctor(payload);
      setSuccessNotice(`Physician credentials for Dr. ${payload.firstName} ${payload.lastName} provisioned successfully.`);
      setIsDoctorModalOpen(false);
      setDoctorForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        departmentId: '',
        licenseNumber: '',
        specialty: '',
        qualification: '',
        experienceYears: 3,
        consultationFee: 50.00,
      });
      await fetchDoctors();
      await fetchMetrics();
      await fetchAuditLogs(0);
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to provision doctor account.');
    } finally {
      setDoctorSaving(false);
    }
  };

  const handleOpenEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setEditDoctorForm({
      firstName: doc.firstName || doc.user?.firstName || '',
      lastName: doc.lastName || doc.user?.lastName || '',
      email: doc.email || doc.user?.email || '',
      departmentId: doc.departmentId || doc.department?.id || '',
      specialty: doc.specialty || doc.specialization || '',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 0,
      consultationFee: doc.consultationFee !== undefined ? doc.consultationFee : 50.00,
      licenseNumber: doc.licenseNumber || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveDoctorEdit = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;

    setEditDoctorSaving(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      const payload = {
        firstName: editDoctorForm.firstName.trim(),
        lastName: editDoctorForm.lastName.trim(),
        email: editDoctorForm.email.trim(),
        departmentId: Number(editDoctorForm.departmentId),
        specialty: editDoctorForm.specialty.trim(),
        qualification: editDoctorForm.qualification.trim(),
        experienceYears: Number(editDoctorForm.experienceYears),
        consultationFee: parseFloat(editDoctorForm.consultationFee),
        licenseNumber: editDoctorForm.licenseNumber.trim(),
        password: '',
      };

      await adminApi.updateDoctor(editingDoctor.id, payload);
      setSuccessNotice(`Profile for Dr. ${payload.firstName} ${payload.lastName} updated successfully.`);
      setIsEditModalOpen(false);
      setEditingDoctor(null);
      await fetchDoctors();
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Could not update doctor profile.';
      setErrorNotice(serverMessage);
    } finally {
      setEditDoctorSaving(false);
    }
  };

  // Search & Filter
  const filteredDepartments = departments.filter((d) => 
    d.name?.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.description?.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = getDoctorDisplayName(doc).toLowerCase().includes(doctorSearch.toLowerCase()) ||
                      doc.specialty?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                      doc.licenseNumber?.toLowerCase().includes(doctorSearch.toLowerCase());
    const deptMatch = selectedDeptFilter === 'ALL' || String(doc.departmentId || doc.department?.id) === String(selectedDeptFilter);
    return nameMatch && deptMatch;
  });

  // Computed Metrics
  const completedAppts = Number(metrics?.completedAppointments ?? metrics?.statusCounts?.COMPLETED ?? 0);
  const activeAppts = Number(metrics?.pendingOrConfirmedAppointments ?? metrics?.statusCounts?.CONFIRMED ?? 0);
  const cancelledAppts = Number(metrics?.cancelledAppointments ?? metrics?.statusCounts?.CANCELLED ?? 0);
  const totalAppts = Number(metrics?.totalAppointments ?? (completedAppts + activeAppts + cancelledAppts) ?? 0);

  const completedPct = totalAppts > 0 ? Math.round((completedAppts / totalAppts) * 100) : 0;
  const activePct = totalAppts > 0 ? Math.round((activeAppts / totalAppts) * 100) : 0;
  const cancelledPct = totalAppts > 0 ? Math.round((cancelledAppts / totalAppts) * 100) : 0;

  const totalRev = Number(metrics?.totalRevenue ?? metrics?.estimatedRevenue ?? 0);
  const avgFeePerCompleted = completedAppts > 0 ? (totalRev / completedAppts).toFixed(0) : '0';
  const totalPrescriptions = Number(metrics?.totalPrescriptions ?? 0);
  const prescriptionRate = completedAppts > 0 ? Math.round((totalPrescriptions / completedAppts) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-slate-800 flex pt-16">
      
      {/* SIDEBAR NAVIGATION - PORTEA DEEP PINE THEME */}
      <aside className="w-72 border-r border-[#005A5B]/15 bg-gradient-to-b from-[#005A5B] via-[#004849] to-[#003839] hidden lg:flex flex-col justify-between fixed top-16 bottom-0 left-0 z-30 shadow-2xl text-slate-200">
        
        <div className="p-5 space-y-6">
          
          {/* Node Status Card */}
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F26522] to-[#FF7E47] text-white flex items-center justify-center shadow-lg shadow-[#F26522]/30 shrink-0">
                <Shield size={18} />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FF9E6C] leading-none">Security Node</span>
                </div>
                <span className="text-xs font-black text-white tracking-wide truncate block mt-0.5">Super Admin Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-white/60 px-3 uppercase tracking-wider block mb-2">
              Operational Control
            </span>

            {/* 1. Analytics Button */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Activity size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Executive Analytics</span>
              </div>
              {activeTab === 'analytics' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26522]" />
              )}
            </button>

            {/* 2. Departments Button */}
            <button
              onClick={() => setActiveTab('departments')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'departments'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'departments'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Building2 size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Clinical Units</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'departments'
                  ? 'bg-[#F26522]/30 text-white border border-[#F26522]/40'
                  : 'bg-white/10 text-slate-300 group-hover:text-white'
              }`}>
                {departments.length}
              </span>
            </button>

            {/* 3. Doctors Button */}
            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'doctors'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'doctors'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Stethoscope size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Physician Roster</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'doctors'
                  ? 'bg-[#F26522]/30 text-white border border-[#F26522]/40'
                  : 'bg-white/10 text-slate-300 group-hover:text-white'
              }`}>
                {doctors.length}
              </span>
            </button>

            {/* 4. Audit Trail Button */}
            <button
              onClick={() => {
                setActiveTab('audit');
                fetchAuditLogs(0);
              }}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-[#F26522]/25 via-[#F26522]/15 to-transparent text-white border-l-4 border-[#F26522] shadow-md shadow-black/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'audit'
                    ? 'bg-[#F26522] text-white shadow-md shadow-[#F26522]/30'
                    : 'bg-white/10 text-slate-300 group-hover:text-[#F26522] group-hover:bg-white/15'
                }`}>
                  <Layers size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Audit Trail</span>
              </div>
              {activeTab === 'audit' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26522]" />
              )}
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/10 bg-[#003839]/60 backdrop-blur-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-bold text-white block truncate">{user?.email}</span>
              <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Verified Node
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-all"
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
          {['analytics', 'departments', 'doctors', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize ${
                activeTab === tab ? 'bg-[#F26522] text-white' : 'bg-white border border-[#005A5B]/15 text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Global Notifications */}
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

        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black tracking-widest text-[#005A5B] uppercase">CURIX EXECUTIVE SUITE</span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBF5F5] border border-[#005A5B]/15 text-[10px] font-bold text-[#005A5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live System Telemetry
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#005A5B] tracking-tight">Executive Intelligence</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Real-time consultation velocity, clinical throughput, and departmental capacity overview.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllAdminData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#005A5B]/20 hover:border-[#F26522] text-xs font-extrabold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-xs transition disabled:opacity-60"
                >
                  <RefreshCw size={14} className={`text-[#F26522] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Synchronizing...' : 'Sync Node'}</span>
                </button>
              </div>
            </div>

            {/* ROW 1: 4 STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Registered Patients</span>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-black text-[#005A5B] tracking-tight font-mono">
                    {metrics?.totalPatients !== undefined ? metrics.totalPatients : '0'}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <Check size={13} className="text-emerald-500" />
                  <span>Active E-Charts Verified</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005A5B]" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Medical Staff</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Stethoscope size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-black text-[#005A5B] tracking-tight font-mono">
                    {metrics?.totalDoctors !== undefined ? metrics.totalDoctors : '0'}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#F26522]">
                  <Sparkles size={13} className="text-[#F26522]" />
                  <span>Licensed Attending Staff</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Consultations</span>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-black text-[#005A5B] tracking-tight font-mono">
                    {totalAppts}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <TrendingUp size={13} className="text-[#005A5B]" />
                  <span>Lifetime Clinical Visits</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005A5B]" />
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Consultation Volume</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-black text-emerald-700 tracking-tight font-mono">
                    ${totalRev}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <Zap size={13} className="text-emerald-500" />
                  <span>Gross System Fees Collected</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
              </div>

            </div>

            {/* ROW 2: LIFECYCLE & WORKLOAD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              <div className="p-6 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center">
                        <Activity size={16} />
                      </div>
                      <h3 className="text-xs font-black text-[#005A5B] uppercase tracking-wider">
                        Consultation Lifecycle Breakdown
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-100">
                      Total: {totalAppts}
                    </span>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                        </span>
                        <span className="text-slate-700 font-mono font-bold">{completedAppts} <span className="text-slate-400">({completedPct}%)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                          style={{ width: `${completedPct}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-[#F26522] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F26522]" /> Confirmed / Active
                        </span>
                        <span className="text-slate-700 font-mono font-bold">{activeAppts} <span className="text-slate-400">({activePct}%)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F26522] rounded-full transition-all duration-700" 
                          style={{ width: `${activePct}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-rose-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" /> Cancelled
                        </span>
                        <span className="text-slate-700 font-mono font-bold">{cancelledAppts} <span className="text-slate-400">({cancelledPct}%)</span></span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rose-500 rounded-full transition-all duration-700" 
                          style={{ width: `${cancelledPct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-5 mt-5 border-t border-stone-100">
                  <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rx Slips</span>
                    <span className="text-base font-black text-[#F26522] font-mono mt-0.5 block">{totalPrescriptions}</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Recorded</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success Rate</span>
                    <span className="text-base font-black text-emerald-700 font-mono mt-0.5 block">{completedPct}%</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Completion</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attrition</span>
                    <span className="text-base font-black text-rose-700 font-mono mt-0.5 block">{cancelledPct}%</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Cancellations</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Department Workload */}
              <div className="p-6 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <h3 className="text-xs font-black text-[#005A5B] uppercase tracking-wider">
                        Unit Workload & Distribution
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#005A5B] bg-[#EBF5F5] px-2.5 py-1 rounded-full border border-[#005A5B]/15">
                      {departments.length} Units Active
                    </span>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {departments.map((dept) => {
                      const deptAppointments = Number(metrics?.appointmentsByDepartment?.[dept.name] || 0);
                      const shareOfTotal = totalAppts > 0 ? Math.round((deptAppointments / totalAppts) * 100) : 0;
                      const hasTraffic = deptAppointments > 0;

                      return (
                        <div key={dept.id} className="p-3 rounded-xl bg-stone-50/70 border border-stone-100 hover:bg-stone-50 transition">
                          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[#005A5B] font-bold">{dept.name}</span>
                              {!hasTraffic && (
                                <span className="px-2 py-0.5 rounded-md bg-stone-200 text-slate-600 text-[10px] font-semibold">
                                  Standby
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-slate-700">
                              {deptAppointments} <span className="text-slate-400 font-sans font-normal">consultations ({shareOfTotal}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                hasTraffic 
                                  ? 'bg-gradient-to-r from-[#005A5B] to-[#F26522]' 
                                  : 'bg-stone-300'
                              }`}
                              style={{ width: `${Math.max(hasTraffic ? shareOfTotal : 5, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">Total Bed/Slot Capacity:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    100% Operational
                  </span>
                </div>

              </div>

            </div>

            {/* ROW 3: EFFICIENCY & COMMAND LAUNCHPAD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp size={14} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#005A5B]">Financial Efficiency</h4>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-slate-500">Avg Fee / Visit</span>
                    <span className="font-black text-[#005A5B] font-mono">${avgFeePerCompleted}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-slate-500">Rx Issuance Velocity</span>
                    <span className="font-black text-[#F26522] font-mono">{prescriptionRate}%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Total Run-Rate</span>
                    <span className="font-black text-emerald-700 font-mono">${totalRev}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center">
                    <Shield size={14} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#005A5B]">Security Telemetry</h4>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-slate-500">Auth Token Guard</span>
                    <span className="font-bold text-emerald-600 font-mono">JWT-STRICT</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-slate-500">Role Isolation</span>
                    <span className="font-bold text-[#F26522] font-mono">RBAC-ACTIVE</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Latest Audit Event</span>
                    <span className="font-mono text-slate-700 truncate max-w-[140px] text-right font-bold">
                      {auditLogs[0]?.action || 'SYSTEM_SYNCD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Command Launchpad */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#005A5B] to-[#003839] text-white shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-[#FF9E6C] flex items-center justify-center">
                      <Zap size={14} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">Command Launchpad</h4>
                  </div>
                  <p className="text-[11px] text-slate-200 mb-3 font-medium">Rapid administrative provisioning shortcuts.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsDoctorModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs"
                  >
                    <Plus size={13} />
                    <span>+ Physician</span>
                  </button>
                  <button
                    onClick={() => setIsDeptModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10"
                  >
                    <Plus size={13} />
                    <span>+ Unit</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('audit');
                      fetchAuditLogs(0);
                    }}
                    className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition border border-white/10"
                  >
                    <Layers size={13} />
                    <span>Inspect Security Audit Logs</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Clinical Departments</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage hospital specialties and operational units.</p>
              </div>
              <button
                onClick={() => setIsDeptModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus size={15} />
                <span>Add Department</span>
              </button>
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search departments by name or description..."
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#F26522]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepartments.map((dept) => (
                <div key={dept.id} className="p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs flex flex-col justify-between hover:border-stone-300 transition">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold">
                        <Building2 size={18} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        dept.active !== false 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-stone-100 text-slate-500 border-stone-200'
                      }`}>
                        {dept.active !== false ? 'Operational' : 'Disabled'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#005A5B]">{dept.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {dept.description || 'Specialized clinical discipline.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>ID: #{dept.id}</span>
                    <span className="text-[#F26522] font-sans font-bold">Unit Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PHYSICIANS */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Physician Directory</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Provision medical credentials, manage shift schedules, and update fees.</p>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus size={15} />
                <span>Provision Doctor</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by physician name, specialty, or license..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div className="sm:w-60">
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-[#005A5B] focus:outline-none focus:border-[#F26522]"
                >
                  <option value="ALL">All Departments ({doctors.length})</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 bg-[#EBF5F5]/60 text-[10px] uppercase font-bold text-[#005A5B] tracking-wider">
                        <th className="py-3 px-5">Physician Details</th>
                        <th className="py-3 px-5">Specialty & License</th>
                        <th className="py-3 px-5">Consultation Fee</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      {filteredDoctors.map((doc) => {
                        const docDisplayName = getDoctorDisplayName(doc);
                        return (
                          <tr key={doc.id} className="hover:bg-stone-50/60 transition">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold text-xs shrink-0">
                                  {docDisplayName.replace('Dr. ', '').charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-[#005A5B] block">{docDisplayName}</span>
                                  <span className="text-[11px] text-slate-400 font-normal">{doc.qualification || 'Physician'} · {doc.experienceYears || 0} yrs exp</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F26522]/10 text-[#F26522] border border-[#F26522]/20 uppercase inline-block">
                                {doc.specialty || 'General Practitioner'}
                              </span>
                              <span className="text-[11px] text-slate-400 block font-mono mt-1">LIC: {doc.licenseNumber || 'VERIFIED'}</span>
                            </td>

                            <td className="py-4 px-5">
                              <span className="font-black text-[#005A5B] text-sm font-mono">
                                ${doc.consultationFee !== undefined ? doc.consultationFee : '50.00'}
                              </span>
                            </td>

                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => handleOpenEditDoctor(doc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 text-xs font-bold transition shadow-2xs"
                              >
                                <Edit3 size={12} />
                                <span>Edit</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No physicians found</p>
                <p className="text-xs text-slate-400 mt-1">Adjust search parameters or provision a new physician account.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Security Audit Trail</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Chronological record of administrative events ({auditTotalElements} total events).</p>
              </div>
              <button
                onClick={() => fetchAuditLogs(auditPage)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-slate-700 hover:bg-stone-50 shadow-2xs transition"
              >
                <RefreshCw size={13} className="text-[#F26522]" />
                <span>Refresh Log</span>
              </button>
            </div>

            {auditLoading ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#F26522] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading audit records...</p>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {auditLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-stone-50/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          <Shield size={14} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#005A5B]">
                              {log.action || log.eventType || 'SYSTEM_ACTION'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-slate-700">
                              {log.userRole || log.principal || 'ADMIN'}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            {log.details || log.description || log.message || 'Administrative operation recorded.'}
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-400 text-right shrink-0">
                        <span className="text-[11px] font-mono">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500 bg-stone-50/50">
                  <span>Page {auditPage + 1} of {Math.max(1, auditTotalPages)}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchAuditLogs(auditPage - 1)}
                      disabled={auditPage <= 0 || auditLoading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 transition font-bold"
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={() => fetchAuditLogs(auditPage + 1)}
                      disabled={auditPage + 1 >= auditTotalPages || auditLoading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 transition font-bold"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <Shield size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No audit records logged</p>
                <p className="text-xs text-slate-400 mt-1">Actions performed on the console will automatically appear here.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: ADD DEPARTMENT */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsDeptModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-stone-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#005A5B] mb-1">Add Clinical Department</h3>
            <p className="text-xs text-slate-500 mb-5">Register a specialized hospital department for physician assignment.</p>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Cardiology, Neurology, Pediatrics"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35] focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Clinical functions, diagnostic scope, or unit specifics..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#F26522] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deptSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {deptSaving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Unit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROVISION DOCTOR */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsDoctorModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-stone-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#005A5B] mb-1">Provision Physician Credentials</h3>
            <p className="text-xs text-slate-500 mb-5">Assign medical specialty, consultation fee, and active working shifts.</p>

            <form onSubmit={handleProvisionDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah"
                    value={doctorForm.firstName}
                    onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Connor"
                    value={doctorForm.lastName}
                    onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="dr.connor@curix.com"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Temporary Password * (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={40}
                    placeholder="••••••••"
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Department *</label>
                  <select
                    required
                    value={doctorForm.departmentId}
                    onChange={(e) => setDoctorForm({ ...doctorForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#005A5B]"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="MED-LIC-98214"
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interventional Cardiology"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MD, FACC"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#005A5B]"
                  />
                </div>
              </div>

              {/* Working Shifts */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-[#F26522]" />
                  <span className="text-xs font-bold text-[#005A5B] uppercase tracking-wider">
                    Working Shifts & Available Consultation Days
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Select Active Consultation Days
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((day) => {
                      const isSelected = selectedDays.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDaySelection(day.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#F26522] text-white shadow-xs'
                              : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-100'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={shiftStartTime}
                      onChange={(e) => setShiftStartTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-semibold text-[#005A5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={shiftEndTime}
                      onChange={(e) => setShiftEndTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-semibold text-[#005A5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Slot Duration</label>
                    <select
                      value={slotMinutes}
                      onChange={(e) => setSlotMinutes(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-semibold text-[#005A5B]"
                    >
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={doctorSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {doctorSaving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT DOCTOR PROFILE */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border border-[#005A5B]/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-stone-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#005A5B] mb-1">Edit Physician Profile</h3>
            <p className="text-xs text-slate-500 mb-5">Update qualifications, department, and consultation rate.</p>

            <form onSubmit={handleSaveDoctorEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.firstName}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.lastName}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Department *</label>
                  <select
                    required
                    value={editDoctorForm.departmentId}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#005A5B]"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.specialty}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.qualification}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, qualification: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">License Number</label>
                  <input
                    type="text"
                    value={editDoctorForm.licenseNumber}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    value={editDoctorForm.experienceYears}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#1A2E35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={editDoctorForm.consultationFee}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, consultationFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#005A5B]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editDoctorSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#D95316] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {editDoctorSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}