import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { 
  Building2, Users, Stethoscope, DollarSign, Activity, 
  Shield, Plus, RefreshCw, AlertCircle, CheckCircle2, 
  Loader2, X, Search, Calendar, ChevronLeft, ChevronRight, 
  Clock, Edit3, Save, Layers, ArrowUpRight, TrendingUp,
  FileCheck2, Check, Zap, Sparkles, LogOut, LayoutDashboard,
  BarChart3, PieChart, Award, Mail, Phone
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

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

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
  const totalPrescriptions = Number(metrics?.totalPrescriptions ?? 0);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-[#0A1C35] flex font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden lg:flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Header */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-[#00A896] text-white flex items-center justify-center font-black shadow-md shadow-[#00A896]/20">
              C
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#0A1C35] block">CURIX</span>
              <span className="text-[10px] text-[#00A896] font-bold block">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="p-4 space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-3 block mb-2">Main Menu</span>
            {[
              { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'departments', label: 'Clinical Units', icon: Building2, count: departments.length },
              { id: 'doctors', label: 'Physicians', icon: Stethoscope, count: doctors.length },
              { id: 'audit', label: 'Audit Trail', icon: Layers }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'audit') fetchAuditLogs(0);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/25'
                      : 'text-slate-600 hover:bg-[#E6F8F5] hover:text-[#00A896]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sign-out Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <span>Sign Out</span>
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* 2. CENTER CONTENT & TOP HEADER BAR */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clinical units, physicians, or reports..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F8FB] border border-slate-200 rounded-full text-xs focus:outline-none focus:bg-white focus:border-[#00A896] transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              disabled={isSyncing}
              title="Sync Data"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E6F8F5] hover:bg-[#d5f5ee] text-[#00A896] text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sync Node</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 p-6 sm:p-8 grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* Main Content Column (Span 3) */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Notifications */}
            {successNotice && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#00A896] shrink-0" />
                  <span>{successNotice}</span>
                </div>
                <button onClick={() => setSuccessNotice('')} className="text-emerald-700 hover:text-emerald-900 p-1"><X size={14} /></button>
              </div>
            )}

            {errorNotice && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
                <button onClick={() => setErrorNotice('')} className="text-rose-700 hover:text-rose-900 p-1"><X size={14} /></button>
              </div>
            )}

            {/* TAB 1: DASHBOARD ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                
                {/* Title & Quick Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">
                      CURIX EXECUTIVE SUITE
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C35] tracking-tight">Executive Intelligence</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{currentDate.toDateString()} · Real-time telemetry</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDoctorModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-[#00A896] hover:bg-[#079181] text-white font-bold text-xs shadow-lg shadow-[#00A896]/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Provision Physician</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeptModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-[#0A1C35] hover:bg-[#132d4e] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Unit</span>
                    </button>
                  </div>
                </div>

                {/* 4 TOP STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Patients</span>
                      <div className="w-10 h-10 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                        <Users size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-[#0A1C35] font-mono">
                        {metrics?.totalPatients !== undefined ? metrics.totalPatients : '2,584'}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-[#00A896] font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active E-Charts Verified
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medical Staff</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Stethoscope size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-[#0A1C35] font-mono">{doctors.length || 18}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-[#00A896] font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> Licensed Attending Staff
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultations</span>
                      <div className="w-9 h-9 rounded-xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-[#0A1C35] font-mono">{totalAppts}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <TrendingUp size={12} className="text-[#00A896]" /> Lifetime Clinical Visits
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Volume</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <DollarSign size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-emerald-700 font-mono">${totalRev}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Zap size={12} /> Gross System Fees Collected
                    </div>
                  </div>

                </div>

                {/* GRAPH SECTION */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200/85 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                        <BarChart3 size={16} />
                      </div>
                      <h3 className="text-xs font-black text-[#0A1C35] uppercase tracking-wider">Consultation Lifecycle Analysis Graph</h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#00A896] bg-[#E6F8F5] px-3.5 py-1 rounded-full">Total Volume: {totalAppts}</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-700">Completed Visits</span>
                        <span className="font-mono">{completedAppts} ({completedPct}%)</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${completedPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-[#00A896]">Active / Confirmed</span>
                        <span className="font-mono">{activeAppts} ({activePct}%)</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-[#00A896] rounded-full transition-all duration-700" style={{ width: `${activePct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-rose-600">Cancelled Attrition</span>
                        <span className="font-mono">{cancelledAppts} ({cancelledPct}%)</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `${cancelledPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DEPARTMENTS */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#0A1C35] tracking-tight">Clinical Departments</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage hospital specialties and operational units.</p>
                  </div>
                  <button onClick={() => setIsDeptModalOpen(true)} className="px-5 py-2.5 rounded-full bg-[#00A896] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <Plus size={14} /> Add Department
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.id} className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm">
                      <h4 className="text-sm font-bold text-[#0A1C35]">{dept.name}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{dept.description || 'Specialized unit.'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PHYSICIANS (Completely Restructured into Modern Cards) */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">
                      ATTENDING MEDICAL STAFF
                    </span>
                    <h2 className="text-2xl font-black text-[#0A1C35] tracking-tight">Physicians Directory</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Provision medical credentials, manage shift schedules, and update fees.</p>
                  </div>
                  <button onClick={() => setIsDoctorModalOpen(true)} className="px-5 py-2.5 rounded-full bg-[#00A896] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00A896]/20">
                    <Plus size={14} /> Provision Doctor
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by physician name, specialty, or license..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs focus:outline-none focus:border-[#00A896] shadow-2xs"
                    />
                  </div>
                  <div className="sm:w-60">
                    <select
                      value={selectedDeptFilter}
                      onChange={(e) => setSelectedDeptFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-bold text-[#0A1C35] focus:outline-none focus:border-[#00A896] shadow-2xs"
                    >
                      <option value="ALL">All Departments ({doctors.length})</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Restructured Physician Cards Grid */}
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredDoctors.map((doc) => {
                      const docDisplayName = getDoctorDisplayName(doc);
                      const initials = docDisplayName.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
                      return (
                        <div key={doc.id} className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm hover:border-[#00A896]/40 transition flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center font-extrabold text-sm shadow-xs">
                                  {initials || 'DR'}
                                </div>
                                <div>
                                  <h4 className="text-sm font-extrabold text-[#0A1C35]">{docDisplayName}</h4>
                                  <span className="text-[11px] text-[#00A896] font-bold block">{doc.specialty || 'General Practitioner'}</span>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                Verified
                              </span>
                            </div>

                            <div className="space-y-2 text-xs text-slate-600 py-3 border-y border-slate-100">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Qualification:</span>
                                <span className="font-bold text-[#0A1C35]">{doc.qualification || 'MBBS, MD'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Experience:</span>
                                <span className="font-bold text-[#0A1C35]">{doc.experienceYears || 3} Years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">License ID:</span>
                                <span className="font-mono text-slate-700">{doc.licenseNumber || 'LIC-VERIFIED'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Consultation Fee</span>
                              <span className="text-base font-black text-[#00A896] font-mono">${doc.consultationFee !== undefined ? doc.consultationFee : '50.00'}</span>
                            </div>
                            <button
                              onClick={() => handleOpenEditDoctor(doc)}
                              className="px-4 py-2 rounded-xl bg-[#F4F8FB] hover:bg-[#E6F8F5] text-[#0A1C35] hover:text-[#00A896] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
                            >
                              <Edit3 size={13} />
                              <span>Edit Profile</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/85 shadow-sm">
                    <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-[#0A1C35]">No physicians found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search parameters or provision a new physician account.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-[#0A1C35] tracking-tight">Security Audit Trail</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Chronological record of administrative events ({auditTotalElements} total events).</p>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200/85 divide-y divide-slate-100 text-xs shadow-sm overflow-hidden">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#00A896]">{log.action || 'SYSTEM_EVENT'}</span>
                        <p className="text-slate-500 mt-1">{log.details || 'Audit record'}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right-Hand Column: Calendar & Doctor Availability Widget */}
          <div className="space-y-6">
            
            {/* Interactive Month/Day Calendar Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-[#0A1C35] tracking-wider">
                  {monthNames[month]} {year}
                </h4>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"><ChevronLeft size={16} /></button>
                  <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"><ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  return (
                    <div 
                      key={`day-${dayNum}`}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl font-bold text-xs ${
                        isToday ? 'bg-[#00A896] text-white shadow-md shadow-[#00A896]/30' : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                      }`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doctor Availability Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-[#0A1C35] tracking-wider">Doctor Availability</h4>
                <span className="text-[11px] text-[#00A896] font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('doctors')}>View All</span>
              </div>

              <div className="space-y-3.5">
                {doctors.slice(0, 4).map((doc, idx) => {
                  const name = getDoctorDisplayName(doc);
                  const initials = name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
                  return (
                    <div key={doc.id || idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#E6F8F5] text-[#00A896] font-bold text-xs flex items-center justify-center">
                          {initials || 'DR'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#0A1C35] block truncate max-w-[130px]">{name}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">{doc.specialty || 'General Practitioner'}</span>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title="Available" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODALS */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
            <button onClick={() => setIsDeptModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            <h3 className="text-xl font-black text-[#0A1C35] mb-2">Add Clinical Department</h3>
            <p className="text-xs text-slate-500 mb-6">Register a specialized hospital department for physician assignment.</p>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Department Name *</label>
                <input type="text" required placeholder="e.g. Cardiology" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Description</label>
                <textarea rows={3} placeholder="Description" value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl text-xs resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsDeptModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={deptSaving} className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full text-xs font-bold shadow-md cursor-pointer">Save Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsDoctorModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            <h3 className="text-xl font-black text-[#0A1C35] mb-2">Provision Physician Credentials</h3>
            <p className="text-xs text-slate-500 mb-6">Assign medical specialty, consultation fee, and active working shifts.</p>
            <form onSubmit={handleProvisionDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">First Name *</label>
                  <input type="text" required placeholder="First Name" value={doctorForm.firstName} onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Last Name *</label>
                  <input type="text" required placeholder="Last Name" value={doctorForm.lastName} onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Email *</label>
                  <input type="email" required placeholder="Email Address" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Password *</label>
                  <input type="password" required minLength={8} placeholder="Temp Password" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Department *</label>
                <select required value={doctorForm.departmentId} onChange={(e) => setDoctorForm({ ...doctorForm, departmentId: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl font-bold">
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">License Number *</label>
                <input type="text" required placeholder="License Number" value={doctorForm.licenseNumber} onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Specialty *</label>
                  <input type="text" required placeholder="Specialty" value={doctorForm.specialty} onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Qualification *</label>
                  <input type="text" required placeholder="Qualification" value={doctorForm.qualification} onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Experience Years *</label>
                  <input type="number" min={0} required placeholder="Experience Years" value={doctorForm.experienceYears} onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Consultation Fee ($) *</label>
                  <input type="number" min={0} step="0.01" required placeholder="Consultation Fee ($)" value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl font-bold" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsDoctorModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-full font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={doctorSaving} className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full font-bold shadow-md cursor-pointer">Provision Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            <h3 className="text-xl font-black text-[#0A1C35] mb-2">Edit Physician Profile</h3>
            <p className="text-xs text-slate-500 mb-6">Update qualifications, department, and consultation rate.</p>
            <form onSubmit={handleSaveDoctorEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">First Name *</label>
                  <input type="text" required value={editDoctorForm.firstName} onChange={(e) => setEditDoctorForm({ ...editDoctorForm, firstName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-1">Last Name *</label>
                  <input type="text" required value={editDoctorForm.lastName} onChange={(e) => setEditDoctorForm({ ...editDoctorForm, lastName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Department *</label>
                <select required value={editDoctorForm.departmentId} onChange={(e) => setEditDoctorForm({ ...editDoctorForm, departmentId: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl font-bold">
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Specialty *</label>
                <input type="text" required value={editDoctorForm.specialty} onChange={(e) => setEditDoctorForm({ ...editDoctorForm, specialty: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Consultation Fee ($) *</label>
                <input type="number" min={0} step="0.01" required value={editDoctorForm.consultationFee} onChange={(e) => setEditDoctorForm({ ...editDoctorForm, consultationFee: e.target.value })} className="w-full p-3 border border-slate-200 rounded-2xl font-bold" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-full font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={editDoctorSaving} className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full font-bold shadow-md cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}