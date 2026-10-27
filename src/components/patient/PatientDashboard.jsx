import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi } from '../../services/api';
import api from '../../services/api';
import DoctorBookingModal from './DoctorBookingModal';
import PrescriptionModal from './PrescriptionModal';
import { 
  Calendar, Stethoscope, Search, Clock, FileText, 
  XCircle, CheckCircle2, AlertCircle, Loader2, Filter, 
  RefreshCw, User, Edit3, Save, X
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'appointments' | 'prescriptions' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');
  
  // Database states
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Profile states
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bloodGroup: 'O+',
    emergencyContact: '',
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modals
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadAllPatientData();
    fetchPatientProfile();
  }, []);

  const loadAllPatientData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDepartmentsFromDb(),
        fetchDoctorsFromDb(),
        fetchAppointmentsFromDb(),
        fetchPrescriptionsFromDb(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentsFromDb = async () => {
    try {
      const res = await api.get('/departments');
      const list = res.data?.data || res.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch {
      setDepartments([]);
    }
  };

  const fetchDoctorsFromDb = async () => {
    try {
      const res = await patientApi.getDoctors();
      const list = res.data?.data || res.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch {
      setDoctors([]);
    }
  };

  const fetchAppointmentsFromDb = async () => {
    try {
      const res = await patientApi.getMyAppointments();
      const list = res.data?.data || res.data;
      setAppointments(Array.isArray(list) ? list : []);
    } catch {
      setAppointments([]);
    }
  };

  const fetchPrescriptionsFromDb = async () => {
    try {
      const res = await patientApi.getMyPrescriptions();
      const list = res.data?.data || res.data;
      setPrescriptions(Array.isArray(list) ? list : []);
    } catch {
      setPrescriptions([]);
    }
  };

  // GET /api/v1/patient/profile
  const fetchPatientProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await patientApi.getMyProfile();
      const data = res.data?.data || res.data;
      if (data) {
        setProfile(data);
        setProfileForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || data.user?.phone || '',
          bloodGroup: data.bloodGroup || 'O+',
          emergencyContact: data.emergencyContact || '',
        });
      }
    } catch (err) {
      console.warn("Could not load patient profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // PUT /api/v1/patient/profile (Mapped to UpdatePatientProfileRequest)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const payload = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
        bloodGroup: profileForm.bloodGroup,
        emergencyContact: profileForm.emergencyContact ? profileForm.emergencyContact.trim() : '',
      };

      const res = await patientApi.updateMyProfile(payload);
      const updated = res.data?.data || res.data;
      if (updated) {
        setProfile(updated);
      }
      setProfileSuccess('Profile updated successfully in hospital records!');
      setIsEditingProfile(false);
      fetchPatientProfile();
    } catch (err) {
      console.error("Profile update failed:", err);
      setProfileError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to update profile. Please verify your phone number format.'
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // PUT /api/v1/appointments/{id}/cancel
  const handleCancelAppointment = async (id) => {
    const reason = window.prompt(
      'Please state a reason for cancelling this appointment (optional):', 
      'Schedule conflict'
    );
    if (reason === null) return;

    setActionLoading(id);
    try {
      await patientApi.cancelAppointment(id, reason);
      await fetchAppointmentsFromDb();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation request failed.');
    } finally {
      setActionLoading(null);
    }
  };

  // GET /api/v1/prescriptions/appointment/{appointmentId}
  const handleViewPrescriptionForAppointment = async (appointmentId) => {
    try {
      const res = await patientApi.getPrescriptionByAppointment(appointmentId);
      const rxData = res.data?.data || res.data;
      if (rxData) {
        setSelectedPrescription(rxData);
      } else {
        alert("No prescription record found for this appointment.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not retrieve prescription for this appointment.");
    }
  };

  const getDoctorDisplayName = (doc) => {
    if (!doc) return 'Attending Physician';
    if (doc.fullName) return doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
    if (doc.doctorName) return doc.doctorName.startsWith('Dr.') ? doc.doctorName : `Dr. ${doc.doctorName}`;
    if (doc.firstName && doc.lastName) return `Dr. ${doc.firstName} ${doc.lastName}`;
    if (doc.name) return doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`;
    if (doc.user) {
      if (doc.user.firstName && doc.user.lastName) return `Dr. ${doc.user.firstName} ${doc.user.lastName}`;
      if (doc.user.name) return doc.user.name.startsWith('Dr.') ? doc.user.name : `Dr. ${doc.user.name}`;
    }
    return `Doctor #${doc.id || doc.doctorId || ''}`;
  };

  const getAppointmentDoctorName = (apt) => {
    if (!apt) return 'Attending Physician';
    if (apt.doctorName) return apt.doctorName.startsWith('Dr.') ? apt.doctorName : `Dr. ${apt.doctorName}`;
    if (apt.doctorFullName) return apt.doctorFullName.startsWith('Dr.') ? apt.doctorFullName : `Dr. ${apt.doctorFullName}`;
    if (apt.doctor) return getDoctorDisplayName(apt.doctor);
    return `Doctor #${apt.doctorId || ''}`;
  };

  const filteredDoctors = doctors.filter((doc) => {
    const name = getDoctorDisplayName(doc).toLowerCase();
    const specialty = (doc.specialty || doc.specialization || '').toLowerCase();
    const deptName = (doc.departmentName || doc.department?.name || '').toLowerCase();
    const deptId = String(doc.departmentId || doc.department?.id || '');

    const matchesSearch = 
      name.includes(searchQuery.toLowerCase()) || 
      specialty.includes(searchQuery.toLowerCase()) ||
      deptName.includes(searchQuery.toLowerCase());

    const matchesDept = 
      selectedDeptId === 'ALL' || 
      deptId === String(selectedDeptId) || 
      deptName === String(selectedDeptId).toLowerCase();

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fb] via-[#f3f9fd] to-white pt-24 pb-16 text-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block mb-1">
              <span className="text-[11px] font-black tracking-widest text-[#0ea5e9] uppercase pb-0.5 border-b border-[#0ea5e9]">
                PATIENT MEDICAL CARE PORTAL
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#1e3a5f]">
              Welcome back, {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.name || user?.email)}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Live consultation scheduling, electronic prescription archives, and personal health records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-2xl bg-white border border-sky-100 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Appointments</span>
              <span className="text-lg font-black text-[#1e3a5f]">{appointments.length}</span>
            </div>
            <div className="px-5 py-2.5 rounded-2xl bg-white border border-sky-100 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Prescriptions</span>
              <span className="text-lg font-black text-[#0ea5e9]">{prescriptions.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md rounded-full border border-sky-100 mb-8 max-w-xl shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'browse' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Find & Book Doctor
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'appointments' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            My Appointments
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'prescriptions' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              fetchPatientProfile();
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            My Profile
          </button>
        </div>

        {/* TAB 1: BROWSE REAL DOCTORS */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-4 rounded-3xl border border-sky-100 shadow-xs">
              <div className="md:col-span-7 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name or clinical specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-[#1e3a5f] placeholder:text-slate-400 focus:border-[#0ea5e9] focus:outline-none"
                />
              </div>

              <div className="md:col-span-5 flex items-center gap-2">
                <Filter size={15} className="text-[#0ea5e9] shrink-0" />
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-[#1e3a5f] focus:border-[#0ea5e9] focus:outline-none"
                >
                  <option value="ALL">All Clinical Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id || d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading specialist directory from database...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDoctors.map((doc) => {
                  const docDisplayName = getDoctorDisplayName(doc);
                  const departmentDisplay = doc.departmentName || doc.department?.name || doc.specialty || doc.specialization || 'Clinical Specialist';
                  const fee = doc.consultationFee !== undefined && doc.consultationFee !== null ? doc.consultationFee : '50.00';

                  return (
                    <div 
                      key={doc.id || doc.doctorId}
                      className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0ea5e9] group-hover:scale-105 transition-transform">
                            <Stethoscope size={24} />
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0ea5e9] border border-sky-100">
                            {departmentDisplay}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1e3a5f] mb-1">
                          {docDisplayName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-4">
                          {doc.qualification || doc.specialization || 'Licensed Practitioner'} 
                          {doc.experienceYears ? ` · ${doc.experienceYears} Years Exp.` : ''}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Consultation Fee</span>
                          <span className="text-base font-black text-[#1e3a5f]">
                            ${fee}
                          </span>
                        </div>

                        <button
                          onClick={() => setBookingDoctor(doc)}
                          className="px-5 py-2 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold shadow-xs transition-all transform active:scale-95"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <AlertCircle size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No doctors found in database</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchQuery || selectedDeptId !== 'ALL'
                    ? 'No doctors matched your filter criteria.'
                    : 'Registered and verified physicians will appear here automatically.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#1e3a5f]">Your Consultation Schedule</h3>
              <button
                onClick={fetchAppointmentsFromDb}
                className="flex items-center gap-1.5 text-xs text-[#0ea5e9] font-bold hover:underline"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading your appointments...</p>
              </div>
            ) : appointments.length > 0 ? (
              <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
                {appointments.map((apt) => {
                  const status = apt.status || 'PENDING';
                  const isConfirmed = status === 'CONFIRMED' || status === 'COMPLETED';
                  const isCancelled = status === 'CANCELLED';
                  const isCompleted = status === 'COMPLETED';
                  const doctorName = getAppointmentDoctorName(apt);

                  return (
                    <div 
                      key={apt.id} 
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#1e3a5f] shrink-0 mt-0.5">
                          <Calendar size={18} className="text-[#0ea5e9]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#1e3a5f]">
                              {doctorName}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isCancelled
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-[#0ea5e9]" />
                              {apt.appointmentDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-[#0ea5e9]" />
                              {apt.startTime || apt.appointmentTime}
                            </span>
                          </p>

                          {apt.reasonForVisit && (
                            <p className="text-xs text-slate-400 mt-1 italic">
                              "{apt.reasonForVisit}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Cancel and Direct View Rx */}
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <button
                            onClick={() => handleViewPrescriptionForAppointment(apt.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0ea5e9] border border-sky-200 text-xs font-bold transition shadow-xs"
                          >
                            <FileText size={13} />
                            <span>View Rx</span>
                          </button>
                        )}

                        {!isCancelled && !isCompleted && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            disabled={actionLoading === apt.id}
                            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {actionLoading === apt.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No appointments scheduled yet</p>
                <p className="text-xs text-slate-400 mt-1">Book your first doctor consultation from the "Find & Book Doctor" tab.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#1e3a5f]">Verified Electronic Prescriptions</h3>
              <button
                onClick={fetchPrescriptionsFromDb}
                className="flex items-center gap-1.5 text-xs text-[#0ea5e9] font-bold hover:underline"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading prescription archives...</p>
              </div>
            ) : prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((p) => {
                  const doctorName = p.doctorName || (p.doctor ? getDoctorDisplayName(p.doctor) : 'Attending Physician');

                  return (
                    <div 
                      key={p.id}
                      className="p-5 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0ea5e9] flex items-center justify-center font-bold">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-[#0ea5e9]">RX-{p.id}</p>
                          <h4 className="text-sm font-bold text-[#1e3a5f]">
                            {doctorName}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {p.createdAt || p.date || 'Recent Clinical Note'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPrescription(p)}
                        className="px-4 py-2 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        View Slip
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No electronic prescriptions on record</p>
                <p className="text-xs text-slate-400 mt-1">Prescriptions issued by your physician during consultations will appear here automatically.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY MEDICAL PROFILE (GET & PUT /api/v1/patient/profile) */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6">
            {profileSuccess && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {profileLoading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading your health profile from database...</p>
              </div>
            ) : isEditingProfile ? (
              /* PROFILE EDIT MODE (Submits UpdatePatientProfileRequest) */
              <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#1e3a5f]">Edit Patient Medical Profile</h3>
                    <p className="text-xs text-slate-400">Update your personal and emergency contact details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1e3a5f] mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] font-semibold focus:border-[#0ea5e9] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] font-semibold focus:border-[#0ea5e9] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] font-semibold focus:border-[#0ea5e9] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Blood Group</label>
                      <select
                        value={profileForm.bloodGroup}
                        onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#1e3a5f] focus:border-[#0ea5e9] focus:outline-none"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1e3a5f] mb-1">Emergency Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+91 9123456789"
                      value={profileForm.emergencyContact}
                      onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] font-semibold focus:border-[#0ea5e9] focus:outline-none"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save size={13} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* PROFILE VIEW MODE */
              <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#1e3a5f] font-bold">
                      <User size={28} className="text-[#0ea5e9]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#1e3a5f]">
                        {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.name || user?.email)}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Patient ID: <span className="font-mono text-[#0ea5e9]">#{profile?.id || user?.id}</span>
                        {profile?.patientNumber && ` · Reg: ${profile.patientNumber}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setProfileSuccess('');
                      setProfileError('');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold shadow-xs transition"
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Profile Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-bold text-[#1e3a5f] mt-1 block truncate">
                      {profile?.email || profile?.user?.email || user?.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Phone</span>
                    <span className="text-xs font-bold text-[#1e3a5f] mt-1 block">
                      {profile?.phone || profile?.user?.phone || 'Not recorded'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Blood Group</span>
                    <span className="text-sm font-black text-rose-900 mt-1 block">
                      🩸 {profile?.bloodGroup || 'O+'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender & DOB</span>
                    <span className="text-xs font-bold text-[#1e3a5f] mt-1 block">
                      {profile?.gender || 'N/A'} · {profile?.dateOfBirth || 'Recorded on registration'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 sm:col-span-2">
                    <span className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-wider block">Emergency Contact</span>
                    <span className="text-xs font-extrabold text-[#1e3a5f] mt-1 block">
                      {profile?.emergencyContact || 'Not recorded'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Booking Slot Modal */}
      <DoctorBookingModal
        doctor={bookingDoctor}
        isOpen={Boolean(bookingDoctor)}
        onClose={() => setBookingDoctor(null)}
        onBookingSuccess={() => {
          fetchAppointmentsFromDb();
          setActiveTab('appointments');
        }}
      />

      {/* Prescription Slip Viewer Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={Boolean(selectedPrescription)}
        onClose={() => setSelectedPrescription(null)}
      />

    </div>
  );
}