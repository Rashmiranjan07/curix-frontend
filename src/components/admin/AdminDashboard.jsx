import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { 
  Building2, Users, Stethoscope, DollarSign, Activity, 
  FileText, Shield, Plus, RefreshCw, AlertCircle, CheckCircle2, 
  Loader2, X, Search, Calendar, ChevronLeft, ChevronRight, Clock, Edit3, Save
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
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'departments' | 'doctors' | 'audit'
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // 1. Analytics Data
  const [metrics, setMetrics] = useState(null);

  // 2. Departments Data
  const [departments, setDepartments] = useState([]);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', description: '', active: true });
  const [deptSaving, setDeptSaving] = useState(false);

  // 3. Doctors Data & Provisioning
  const [doctors, setDoctors] = useState([]);
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
    setLoading(true);
    setErrorNotice('');
    try {
      await Promise.all([
        fetchMetrics(),
        fetchDepartments(),
        fetchDoctors(),
        fetchAuditLogs(0)
      ]);
    } finally {
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
    if (doc.firstName && doc.lastName) {
      return `Dr. ${doc.firstName} ${doc.lastName}`;
    }
    if (doc.fullName) {
      return doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
    }
    if (doc.doctorName) {
      return doc.doctorName.startsWith('Dr.') ? doc.doctorName : `Dr. ${doc.doctorName}`;
    }
    if (doc.name) {
      return doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`;
    }
    if (doc.user) {
      if (doc.user.firstName && doc.user.lastName) {
        return `Dr. ${doc.user.firstName} ${doc.user.lastName}`;
      }
      if (doc.user.name) {
        return doc.user.name.startsWith('Dr.') ? doc.user.name : `Dr. ${doc.user.name}`;
      }
    }
    if (doc.firstName) return `Dr. ${doc.firstName}`;
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
      setSuccessNotice(`Department "${payload.name}" created successfully!`);
      setIsDeptModalOpen(false);
      setDeptForm({ name: '', description: '', active: true });
      await fetchDepartments();
      await fetchMetrics();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || err.response?.data?.error || 'Failed to create department.');
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
      setSuccessNotice(`Doctor Dr. ${payload.firstName} ${payload.lastName} provisioned with ${selectedDays.length} active shift days!`);
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
      setErrorNotice(err.response?.data?.message || err.response?.data?.error || 'Failed to provision doctor account.');
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
      setSuccessNotice(`Doctor profile for Dr. ${payload.firstName} ${payload.lastName} updated successfully!`);
      setIsEditModalOpen(false);
      setEditingDoctor(null);
      await fetchDoctors();
    } catch (err) {
      const serverMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response ? `HTTP ${err.response.status}: ${err.response.statusText}` : 'Could not update doctor profile.');
      setErrorNotice(serverMessage);
    } finally {
      setEditDoctorSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fb] via-[#f3f9fd] to-white pt-24 pb-16 text-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block mb-1">
              <span className="text-[11px] font-black tracking-widest text-[#0ea5e9] uppercase pb-0.5 border-b border-[#0ea5e9]">
                CURIX HOSPITAL ADMINISTRATION
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#1e3a5f]">
              Administrative Operations Console
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Clinical department lifecycle, medical staff provisioning, real-time analytics, and security audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 text-xs font-bold text-[#1e3a5f] shadow-xs hover:bg-slate-50 transition"
            >
              <RefreshCw size={14} className="text-[#0ea5e9]" />
              <span>Sync System</span>
            </button>
            <div className="px-5 py-2 rounded-2xl bg-[#1e3a5f] text-white shadow-xs text-center">
              <span className="text-[10px] text-sky-200 block font-bold uppercase tracking-wider">Access</span>
              <span className="text-xs font-black tracking-wider">SUPER ADMIN</span>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {successNotice && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {errorNotice && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md rounded-full border border-sky-100 mb-8 max-w-2xl shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'departments' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'doctors' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Medical Staff ({doctors.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              fetchAuditLogs(0);
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Security Audit Trail
          </button>
        </div>

        {/* TAB 1: ANALYTICS & METRICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Patients</span>
                  <span className="text-2xl font-black text-[#1e3a5f] mt-1 block">
                    {metrics?.totalPatients !== undefined ? metrics.totalPatients : '0'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center">
                  <Users size={22} />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Physicians</span>
                  <span className="text-2xl font-black text-[#1e3a5f] mt-1 block">
                    {metrics?.totalDoctors !== undefined ? metrics.totalDoctors : '0'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Stethoscope size={22} />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Consultations</span>
                  <span className="text-2xl font-black text-[#1e3a5f] mt-1 block">
                    {metrics?.totalAppointments !== undefined ? metrics.totalAppointments : '0'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar size={22} />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Revenue</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block">
                    ${metrics?.totalRevenue || metrics?.estimatedRevenue || '0.00'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={22} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xs">
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-[#0ea5e9]" />
                  <span>Consultation Lifecycle Breakdown</span>
                </h3>

                {(() => {
                  const completed = Number(metrics?.completedAppointments ?? metrics?.statusCounts?.COMPLETED ?? 0);
                  const pending = Number(metrics?.pendingOrConfirmedAppointments ?? metrics?.statusCounts?.CONFIRMED ?? 0);
                  const cancelled = Number(metrics?.cancelledAppointments ?? metrics?.statusCounts?.CANCELLED ?? 0);
                  const total = completed + pending + cancelled || 1;

                  const completedPct = Math.round((completed / total) * 100);
                  const pendingPct = Math.round((pending / total) * 100);
                  const cancelledPct = Math.round((cancelled / total) * 100);

                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-emerald-700">Completed Consultations</span>
                          <span className="text-slate-500">{completed} ({completedPct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${completedPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#1e3a5f]">Pending / Confirmed</span>
                          <span className="text-slate-500">{pending} ({pendingPct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
                            style={{ width: `${pendingPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-rose-700">Cancelled Bookings</span>
                          <span className="text-slate-500">{cancelled} ({cancelledPct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${cancelledPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Total Digital Rx Slips Issued:</span>
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                          {metrics?.totalPrescriptions ?? 0} Slips
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xs">
                <h3 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-[#0ea5e9]" />
                  <span>Department Consultation Distribution</span>
                </h3>

                {metrics?.appointmentsByDepartment && Object.keys(metrics.appointmentsByDepartment).length > 0 ? (
                  <div className="space-y-3.5">
                    {(() => {
                      const deptEntries = Object.entries(metrics.appointmentsByDepartment);
                      const maxVisits = Math.max(...deptEntries.map(([, count]) => Number(count)), 1);

                      return deptEntries.map(([dept, count]) => {
                        const countNum = Number(count);
                        const relativeWidth = Math.max(10, Math.round((countNum / maxVisits) * 100));

                        return (
                          <div key={dept}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-[#1e3a5f]">{dept}</span>
                              <span className="text-[#0ea5e9] font-mono">{countNum} visits</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-sky-400 to-[#1e3a5f] rounded-full transition-all duration-500"
                                style={{ width: `${relativeWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No departmental appointment distribution registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEPARTMENTS MANAGEMENT */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#1e3a5f]">Clinical Department Roster</h3>
              <button
                onClick={() => setIsDeptModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus size={14} />
                <span>Add Department</span>
              </button>
            </div>

            {loading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading departments...</p>
              </div>
            ) : departments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-5 rounded-3xl bg-white border border-sky-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center font-bold">
                          <Building2 size={20} />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          dept.active !== false 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {dept.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#1e3a5f]">{dept.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {dept.description || 'General clinical specialty department.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Dept ID: #{dept.id}</span>
                      <span className="text-[#0ea5e9] font-bold">Operational</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No clinical departments found</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Department" to register your first clinical unit.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDICAL STAFF DIRECTORY */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#1e3a5f]">Provisioned Physician Directory</h3>
              <button
                onClick={() => setIsDoctorModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold shadow-xs transition"
              >
                <Plus size={14} />
                <span>Provision Doctor</span>
              </button>
            </div>

            {doctors.length > 0 ? (
              <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
                {doctors.map((doc) => {
                  const docDisplayName = getDoctorDisplayName(doc);
                  return (
                    <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#1e3a5f]">{docDisplayName}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0ea5e9] border border-sky-200 uppercase">
                              {doc.specialty || doc.specialization || 'Clinical'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {doc.qualification || 'Physician'} {doc.experienceYears ? `· ${doc.experienceYears} Years Experience` : ''} · License: <span className="font-mono text-slate-700">{doc.licenseNumber || 'VERIFIED'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Consultation Fee</span>
                          <span className="text-sm font-black text-[#1e3a5f]">
                            ${doc.consultationFee !== undefined ? doc.consultationFee : '50.00'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenEditDoctor(doc)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#1e3a5f] hover:text-white text-slate-700 text-xs font-bold transition shadow-xs"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No medical staff registered</p>
                <p className="text-xs text-slate-400 mt-1">Use "Provision Doctor" to register credentials directly into MySQL.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYSTEM AUDIT LOGS WITH PAGINATION */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">System Security & Action Logs</h3>
                <p className="text-xs text-slate-400">Total recorded events: {auditTotalElements}</p>
              </div>
              <button
                onClick={() => fetchAuditLogs(auditPage)}
                className="flex items-center gap-1.5 text-xs text-[#0ea5e9] font-bold hover:underline"
              >
                <RefreshCw size={12} /> Refresh Logs
              </button>
            </div>

            {auditLoading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading audit records...</p>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {auditLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          <Shield size={14} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1e3a5f]">
                              {log.action || log.eventType || 'SYSTEM_ACTION'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                              {log.userRole || log.principal || 'ADMIN'}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-0.5 font-medium">
                            {log.details || log.description || log.message || 'Administrative operation performed.'}
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-400 sm:text-right shrink-0">
                        <span className="text-[11px] font-mono">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                  <span>Page {auditPage + 1} of {Math.max(1, auditTotalPages)}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchAuditLogs(auditPage - 1)}
                      disabled={auditPage <= 0 || auditLoading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition font-bold"
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={() => fetchAuditLogs(auditPage + 1)}
                      disabled={auditPage + 1 >= auditTotalPages || auditLoading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition font-bold"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Shield size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No audit logs registered yet</p>
                <p className="text-xs text-slate-400 mt-1">Actions such as doctor provisioning and user modifications will be logged here automatically.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: ADD DEPARTMENT */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsDeptModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#1e3a5f] mb-1">Create Clinical Department</h3>
            <p className="text-xs text-slate-400 mb-5">Register a medical department to organize specialized physicians.</p>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Cardiology, Neurology, Pediatrics"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#1e3a5f] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Clinical functions, diagnostic equipment, or unit specifics..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] focus:outline-none focus:border-[#0ea5e9] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deptSaving}
                  className="px-6 py-2.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {deptSaving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROVISION DOCTOR (With Shift & Availability Configurator) */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsDoctorModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#1e3a5f] mb-1">Provision Physician Credentials</h3>
            <p className="text-xs text-slate-400 mb-5">Assign clinical credentials and working shifts directly into MySQL.</p>

            <form onSubmit={handleProvisionDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah"
                    value={doctorForm.firstName}
                    onChange={(e) => setDoctorForm({ ...doctorForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Connor"
                    value={doctorForm.lastName}
                    onChange={(e) => setDoctorForm({ ...doctorForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Doctor Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="dr.connor@curix.com"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Temporary Password * (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={40}
                    placeholder="••••••••"
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Department *</label>
                  <select
                    required
                    value={doctorForm.departmentId}
                    onChange={(e) => setDoctorForm({ ...doctorForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#1e3a5f]"
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="MED-LIC-98214"
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interventional Cardiology"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MD, FACC"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#1e3a5f]"
                  />
                </div>
              </div>

              {/* Working Shifts & Availability Configurator */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#0ea5e9]" />
                  <span className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
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
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#1e3a5f] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
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
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={shiftEndTime}
                      onChange={(e) => setShiftEndTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Slot Duration</label>
                    <select
                      value={slotMinutes}
                      onChange={(e) => setSlotMinutes(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-[#1e3a5f]"
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
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={doctorSaving}
                  className="px-6 py-2.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {doctorSaving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
                  <span>Provision Physician Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT DOCTOR PROFILE */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#1e3a5f] mb-1">Edit Physician Profile</h3>
            <p className="text-xs text-slate-400 mb-5">Update clinical qualifications, department, and consultation fees.</p>

            <form onSubmit={handleSaveDoctorEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.firstName}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.lastName}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Department *</label>
                  <select
                    required
                    value={editDoctorForm.departmentId}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#1e3a5f]"
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.specialty}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    value={editDoctorForm.qualification}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, qualification: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">License Number</label>
                  <input
                    type="text"
                    value={editDoctorForm.licenseNumber}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    value={editDoctorForm.experienceYears}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={editDoctorForm.consultationFee}
                    onChange={(e) => setEditDoctorForm({ ...editDoctorForm, consultationFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editDoctorSaving}
                  className="px-6 py-2.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
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