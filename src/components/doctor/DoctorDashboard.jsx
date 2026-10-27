import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi } from '../../services/api';
import api from '../../services/api';
import PrescriptionModal from '../patient/PrescriptionModal';
import { 
  Stethoscope, Calendar, Clock, CheckCircle2, 
  XCircle, FileText, User, RefreshCw, AlertCircle, 
  Loader2, Pill, Plus, Trash2, HeartPulse, AlertTriangle, 
  Search, History, Printer
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'prescribe' | 'history'

  // Selected Consultation & Associated Patient Data
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  // Prescription Modal Viewer for History
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([
    { medicationName: '', dosage: '', frequency: '', duration: '5 days', instructions: '' }
  ]);
  const [prescribing, setPrescribing] = useState(false);
  const [prescribeSuccess, setPrescribeSuccess] = useState('');
  const [prescribeError, setPrescribeError] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    setError('');
    try {
      try {
        const profRes = await doctorApi.getMyProfile();
        setProfile(profRes.data?.data || profRes.data);
      } catch (err) {
        console.warn("Could not load doctor profile:", err);
      }

      // GET /api/v1/appointments/doctor/my-schedule
      const schedRes = await doctorApi.getMySchedule();
      const list = schedRes.data?.data || schedRes.data;
      setSchedule(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load doctor schedule:", err);
      setError(err.response?.data?.message || 'Could not load consultation roster from database.');
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptionHistory = async () => {
    setLoadingHistory(true);
    try {
      // Calls GET /api/v1/prescriptions/doctor-history
      const res = await doctorApi.getDoctorPrescriptionHistory();
      const list = res.data?.data || res.data;
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load prescription history:", err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectAppointment = async (apt) => {
    setSelectedAppointment(apt);
    setPatientDetails(null);
    if (!apt || !apt.patientId) return;

    try {
      const res = await api.get(`/patients/${apt.patientId}`);
      const data = res.data?.data || res.data;
      if (data) setPatientDetails(data);
    } catch {
      setPatientDetails(null);
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await doctorApi.completeAppointment(id);
      fetchDoctorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    const reason = window.prompt('Reason for cancellation:', 'Physician emergency');
    if (reason === null) return;
    try {
      await doctorApi.cancelAppointment(id, reason);
      fetchDoctorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} yrs` : 'Infant';
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines, 
      { medicationName: '', dosage: '', frequency: '', duration: '5 days', instructions: '' }
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    setPrescribeError('');
    setPrescribeSuccess('');

    if (!selectedAppointment) {
      setPrescribeError('Please select a patient appointment from your schedule.');
      return;
    }

    if (!diagnosis.trim()) {
      setPrescribeError('Clinical Diagnosis is required.');
      return;
    }

    const validItems = medicines
      .filter((m) => m.medicationName && m.medicationName.trim() !== '')
      .map((m) => {
        let cleanDuration = m.duration ? String(m.duration).trim() : '5 days';
        if (/^\d+$/.test(cleanDuration)) {
          cleanDuration = `${cleanDuration} days`;
        }

        return {
          medicationName: m.medicationName.trim(),
          dosage: m.dosage.trim(),
          frequency: m.frequency.trim(),
          duration: cleanDuration,
          instructions: m.instructions ? m.instructions.trim() : '',
        };
      });

    if (validItems.length === 0) {
      setPrescribeError('Prescription must contain at least one medication item.');
      return;
    }

    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];
      if (!item.dosage || !item.frequency) {
        setPrescribeError(`Item #${i + 1} (${item.medicationName}) requires dosage and frequency.`);
        return;
      }
    }

    setPrescribing(true);

    try {
      const payload = {
        appointmentId: Number(selectedAppointment.id),
        diagnosis: diagnosis.trim(),
        notes: notes.trim() || '',
        items: validItems,
      };

      await doctorApi.createPrescription(payload);
      setPrescribeSuccess('Prescription issued successfully and archived in database!');

      setDiagnosis('');
      setNotes('');
      setMedicines([
        { medicationName: '', dosage: '', frequency: '', duration: '5 days', instructions: '' }
      ]);
      setSelectedAppointment(null);
      setPatientDetails(null);

      fetchDoctorData();
      if (activeTab === 'history') fetchPrescriptionHistory();
    } catch (err) {
      console.error("Prescription error response:", err.response?.data);
      const backendMsg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Validation failed for one or more fields. Check your inputs.';
      setPrescribeError(backendMsg);
    } finally {
      setPrescribing(false);
    }
  };

  const doctorDisplayName = 
    profile?.name || 
    (profile?.user ? `Dr. ${profile.user.firstName} ${profile.user.lastName}` : user?.name || user?.email);

  const filteredHistory = history.filter((p) => {
    const diag = (p.diagnosis || '').toLowerCase();
    const patName = (p.patientName || '').toLowerCase();
    const q = searchHistoryQuery.toLowerCase();
    return diag.includes(q) || patName.includes(q) || String(p.id).includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fb] via-[#f3f9fd] to-white pt-24 pb-16 text-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block mb-1">
              <span className="text-[11px] font-black tracking-widest text-[#0ea5e9] uppercase pb-0.5 border-b border-[#0ea5e9]">
                PHYSICIAN CLINICAL WORKSPACE
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#1e3a5f]">
              {doctorDisplayName}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Specialty: <strong>{profile?.specialty || profile?.specialization || 'Clinical Specialist'}</strong> · Fee: <strong>${profile?.consultationFee || '50.00'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchDoctorData();
                if (activeTab === 'history') fetchPrescriptionHistory();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 text-xs font-bold text-[#1e3a5f] shadow-xs hover:bg-slate-50 transition"
            >
              <RefreshCw size={14} className="text-[#0ea5e9]" />
              <span>Refresh</span>
            </button>
            <div className="px-5 py-2.5 rounded-2xl bg-white border border-sky-100 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Queue</span>
              <span className="text-lg font-black text-[#0ea5e9]">{schedule.length} Patients</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md rounded-full border border-sky-100 mb-8 max-w-lg shadow-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'queue' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Consultation Roster
          </button>
          <button
            onClick={() => setActiveTab('prescribe')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'prescribe' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Review & Prescribe
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchPrescriptionHistory();
            }}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-[#1e3a5f] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a5f]'
            }`}
          >
            Rx Archives
          </button>
        </div>

        {/* TAB 1: CONSULTATION ROSTER */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading appointments from database...</p>
              </div>
            ) : schedule.length > 0 ? (
              <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
                {schedule.map((apt) => {
                  const status = apt.status || 'PENDING';
                  const isCompleted = status === 'COMPLETED';
                  const isCancelled = status === 'CANCELLED';

                  return (
                    <div key={apt.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-[#1e3a5f] shrink-0 font-bold">
                          <User size={22} className="text-[#0ea5e9]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-sm font-bold text-[#1e3a5f]">
                              {apt.patientName || `Patient #${apt.patientId}`}
                            </h4>
                            
                            {apt.patientNumber && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                                {apt.patientNumber}
                              </span>
                            )}

                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              isCancelled ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-sky-50 text-[#0ea5e9] border-sky-200'
                            }`}>
                              {status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-[#0ea5e9]" />
                              {apt.appointmentDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} className="text-[#0ea5e9]" />
                              {apt.startTime || apt.appointmentTime}
                            </span>
                          </p>

                          {apt.reasonForVisit && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              Clinical Reason: "{apt.reasonForVisit}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Doctor Actions */}
                      <div className="flex items-center gap-2">
                        {!isCompleted && !isCancelled && (
                          <>
                            <button
                              onClick={() => handleCompleteAppointment(apt.id)}
                              className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            handleSelectAppointment(apt);
                            setActiveTab('prescribe');
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                        >
                          <Pill size={13} />
                          <span>Review & Prescribe</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No patient consultations scheduled</p>
                <p className="text-xs text-slate-400 mt-1">Bookings made by patients will appear directly in this schedule.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVIEW PATIENT CHART & PRESCRIBE */}
        {activeTab === 'prescribe' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs max-w-4xl">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-1">
              Clinical Examination & Prescription
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Review patient clinical details before dispensing medications.
            </p>

            {prescribeSuccess && (
              <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{prescribeSuccess}</span>
              </div>
            )}

            {prescribeError && (
              <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{prescribeError}</span>
              </div>
            )}

            {/* Consultation Selector Dropdown */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5">
                Select Patient Consultation from Queue *
              </label>
              <select
                value={selectedAppointment?.id || ''}
                onChange={(e) => {
                  const chosen = schedule.find(a => String(a.id) === e.target.value);
                  handleSelectAppointment(chosen || null);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#1e3a5f] focus:outline-none"
              >
                <option value="">-- Choose Patient --</option>
                {schedule.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.patientName || `Patient #${a.patientId}`} — {a.appointmentDate} ({a.startTime || a.appointmentTime})
                  </option>
                ))}
              </select>
            </div>

            {/* PATIENT CLINICAL SUMMARY & VITALS CARD */}
            {selectedAppointment && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-sky-50/90 to-blue-50/50 border border-sky-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-200">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center font-black text-sm">
                      <HeartPulse size={22} className="text-[#0ea5e9]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9] block">
                        PATIENT MEDICAL RECORD
                      </span>
                      <h4 className="text-base font-black text-[#1e3a5f]">
                        {selectedAppointment.patientName || `Patient #${selectedAppointment.patientId}`}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Patient ID: <span className="font-mono text-[#1e3a5f]">#{selectedAppointment.patientId}</span>
                        {selectedAppointment.patientNumber && ` · Reg: ${selectedAppointment.patientNumber}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center gap-2 shadow-xs">
                      <span className="text-rose-600">🩸 Blood Group:</span>
                      <span className="text-sm font-extrabold text-rose-900">
                        {patientDetails?.bloodGroup || selectedAppointment.bloodGroup || 'O+'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                  <div className="p-3 rounded-xl bg-white/90 border border-sky-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Gender</span>
                    <span className="font-extrabold text-[#1e3a5f]">
                      {patientDetails?.gender || selectedAppointment.gender || 'MALE'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 border border-sky-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Age / DOB</span>
                    <span className="font-extrabold text-[#1e3a5f]">
                      {calculateAge(patientDetails?.dateOfBirth) 
                        ? `${calculateAge(patientDetails?.dateOfBirth)} (${patientDetails?.dateOfBirth})` 
                        : (patientDetails?.dateOfBirth || 'Recorded in profile')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 border border-sky-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Patient Contact</span>
                    <span className="font-extrabold text-[#1e3a5f] truncate block">
                      {patientDetails?.phone || selectedAppointment.patientNumber || 'On Record'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 border border-sky-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Emergency Contact</span>
                    <span className="font-extrabold text-[#0ea5e9] truncate block">
                      {patientDetails?.emergencyContact || 'Verified'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-white/90 border border-sky-100 flex items-start gap-2">
                  <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Chief Clinical Complaint / Reason for Visit:</span>
                    <p className="text-[#1e3a5f] font-semibold mt-0.5">
                      "{selectedAppointment.reasonForVisit || 'Routine follow-up / general checkup'}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PRESCRIPTION FORM */}
            <form onSubmit={handleCreatePrescription} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5">
                  Clinical Diagnosis * (max 255 chars)
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  placeholder="e.g. Type 2 Diabetes Mellitus / Acute Bronchitis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] focus:border-[#0ea5e9] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1e3a5f]">
                    Medication Items * (at least 1 required)
                  </label>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="flex items-center gap-1 text-xs font-bold text-[#0ea5e9] hover:underline"
                  >
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2.5">
                  {medicines.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Medication Name (e.g. Metformin)"
                          value={m.medicationName}
                          onChange={(e) => handleMedicineChange(idx, 'medicationName', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#1e3a5f]"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Dosage (500mg)"
                          value={m.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#1e3a5f]"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Frequency (1-0-1)"
                          value={m.frequency}
                          onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#1e3a5f]"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Duration (5 days)"
                          value={m.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-[#1e3a5f]"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-1">
                        <input
                          type="text"
                          placeholder="After meals"
                          value={m.instructions}
                          onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#1e3a5f]"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          disabled={medicines.length <= 1}
                          onClick={() => removeMedicineRow(idx)}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-20 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5">
                  Doctor Notes & Advice (max 2000 chars)
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Additional patient guidance, dietary caution, hydration advice, or follow-up schedule..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] resize-none focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={prescribing || !selectedAppointment}
                className="w-full py-3.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {prescribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Saving Prescription to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm & Dispatch Prescription to Patient</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: RX ARCHIVES (PRESCRIPTION HISTORY) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search past prescriptions by patient name, diagnosis, or Rx ID..."
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-[#1e3a5f] focus:outline-none"
                />
              </div>

              <button
                onClick={fetchPrescriptionHistory}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-sky-50 text-[#0ea5e9] text-xs font-bold hover:bg-sky-100 transition self-start sm:self-auto"
              >
                <RefreshCw size={13} />
                <span>Refresh Archives</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <Loader2 size={24} className="animate-spin text-[#0ea5e9] mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400">Loading prescription archives from database...</p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistory.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0ea5e9] flex items-center justify-center font-bold">
                            <FileText size={20} />
                          </div>
                          <div>
                            <span className="text-[11px] font-mono font-bold text-[#0ea5e9]">
                              RX-#{p.id}
                            </span>
                            <h4 className="text-sm font-bold text-[#1e3a5f]">
                              {p.patientName || `Patient #${p.patientId}`}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[10px] font-medium text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recorded'}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 mb-3 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnosis:</span>
                        <p className="font-bold text-[#1e3a5f] truncate mt-0.5">
                          {p.diagnosis || 'Clinical Prescription'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {(p.items || p.prescriptionItems || []).length} Medications Prescribed
                      </span>
                      <button
                        onClick={() => setViewingPrescription(p)}
                        className="px-4 py-1.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white text-xs font-bold transition shadow-xs"
                      >
                        Inspect Slip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 shadow-xs">
                <History size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#1e3a5f]">No past prescriptions found</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchHistoryQuery
                    ? 'No prescriptions matched your search query.'
                    : 'Prescriptions you issue to patients will be archived here automatically.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Prescription Viewer Modal */}
      <PrescriptionModal
        prescription={viewingPrescription}
        isOpen={Boolean(viewingPrescription)}
        onClose={() => setViewingPrescription(null)}
      />

    </div>
  );
}