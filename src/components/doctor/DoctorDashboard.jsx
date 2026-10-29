import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi } from '../../services/api';
import api from '../../services/api';
import { 
  Stethoscope, Calendar, Clock, CheckCircle2, AlertCircle, 
  Plus, Search, RefreshCw, X, FileText, User, 
  Trash2, Shield, Activity, Layers, ArrowUpRight, Check, Sparkles, Filter, Printer, Download, Loader2
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
  const [loadingRxDetails, setLoadingRxDetails] = useState(false);

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

  // Helper to extract items regardless of key name or JSON stringification
  const extractItems = (rx) => {
    if (!rx) return [];
    let raw = rx.items || rx.prescriptionItems || rx.medicines || rx.medicationItems || [];
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        return raw.split(',').map((name) => ({ name: name.trim() }));
      }
    }
    return Array.isArray(raw) ? raw : [];
  };

  // Robust item normalizer ensuring dosage/frequency/instructions never evaluate to empty
  const normalizeItem = (item, idx) => {
    if (!item) return null;
    if (typeof item === 'string') {
      return {
        name: item,
        dosage: 'As directed',
        frequency: '1-0-1',
        duration: '5 days',
        instructions: 'After meals'
      };
    }
    return {
      name: item.name || item.medicineName || item.medicationName || item.drugName || item.medicine?.name || `Medication #${idx + 1}`,
      dosage: item.dosage || item.dose || item.strength || item.dosageAmount || item.mg || item.amount || 'As directed',
      frequency: item.frequency || item.freq || item.timing || item.schedule || item.dosageFrequency || '1-0-1',
      duration: item.duration || (item.durationDays ? `${item.durationDays} days` : '') || (item.days ? `${item.days} days` : '') || '5 days',
      instructions: item.instructions || item.instruction || item.notes || item.specialInstructions || item.directions || 'After meals'
    };
  };

  // Opens prescription modal and fetches complete details if line items are missing from summary list
  const handleOpenViewingRx = async (rx) => {
    setViewingRx(rx);
    const existing = extractItems(rx);

    if (rx.id && (!existing.length || !existing[0]?.dosage)) {
      setLoadingRxDetails(true);
      try {
        const res = await api.get(`/prescriptions/${rx.id}`).catch(() =>
          api.get(`/doctor/prescriptions/${rx.id}`)
        );
        const data = res?.data?.data || res?.data;
        if (data && typeof data === 'object') {
          setViewingRx((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn("Detail fetch failed, using current summary item:", err);
      } finally {
        setLoadingRxDetails(false);
      }
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
      const formattedItems = rxForm.medicines.map((m) => ({
        name: m.name.trim(),
        medicineName: m.name.trim(),
        medicationName: m.name.trim(),
        dosage: m.dosage.trim(),
        dose: m.dosage.trim(),
        frequency: m.frequency.trim(),
        timing: m.frequency.trim(),
        duration: m.duration.trim(),
        days: m.duration.trim(),
        instructions: m.instructions.trim(),
        instruction: m.instructions.trim()
      }));

      // Sends both 'items' and 'medicines' to guarantee backend DTO compatibility
      const payload = {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patient?.id || selectedAppointment.patientId,
        diagnosis: rxForm.diagnosis.trim(),
        notes: rxForm.notes.trim(),
        medicines: formattedItems,
        items: formattedItems,
        prescriptionItems: formattedItems
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

  // Direct File Download for Prescription Slip
  const handleDownloadSlip = () => {
    if (!viewingRx) return;
    const activeItems = extractItems(viewingRx).map(normalizeItem).filter(Boolean);

    const rowsHtml = activeItems.map((m, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${m.name}</td>
        <td style="padding: 10px; color: #005a5b; font-weight: bold;">${m.dosage}</td>
        <td style="padding: 10px; color: #334155;">${m.frequency}</td>
        <td style="padding: 10px; color: #334155;">${m.duration}</td>
        <td style="padding: 10px; color: #475569; font-style: italic;">${m.instructions}</td>
      </tr>
    `).join('');

    const slipDocument = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Curix-Prescription-Rx#${viewingRx.id || 'Slip'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .header { border-bottom: 2px solid #005a5b; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: 900; color: #005a5b; margin: 0; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          .seal { border-bottom: 1px solid #94a3b8; width: 180px; text-align: center; padding-bottom: 4px; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">CURIX HEALTHCARE SYSTEM</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Outpatient Department (OPD) · Official Clinical Prescription</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: bold; color: #005a5b;">Rx ID: #${viewingRx.id || 'N/A'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="box">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Patient Details</span>
            <strong style="font-size: 15px; color: #0f172a;">${viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Attending Physician</span>
            <strong style="font-size: 15px; color: #0f172a;">${doctorDisplayName}</strong>
            <div style="font-size: 12px; color: #005a5b; font-weight: 600;">LIC: ${profile?.licenseNumber || 'VERIFIED'}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Clinical Diagnosis</span>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-weight: bold; margin-top: 6px;">
            ${viewingRx.diagnosis || 'Routine Clinical Consultation'}
          </div>
        </div>

        <div>
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">℞ Prescribed Medications</span>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medication</th>
                <th>Dosage / Strength</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        ${viewingRx.notes ? `
          <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Doctor's Notes & Advice:</span>
            <p style="margin: 4px 0 0; font-size: 12px; color: #334155;">${viewingRx.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <span>This is an official system-generated electronic prescription.</span>
          <div>
            <div class="seal">Digitally Authorized</div>
            <div style="font-size: 10px; text-transform: uppercase; text-align: center; margin-top: 4px;">Attending Physician Seal</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([slipDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Curix-Prescription-Rx${viewingRx.id || 'Slip'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dedicated Hidden IFrame Native Printing Engine
  const handlePrint = () => {
    if (!viewingRx) return;
    const activeItems = extractItems(viewingRx).map(normalizeItem).filter(Boolean);

    const rowsHtml = activeItems.map((m, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${m.name}</td>
        <td style="padding: 10px; color: #005a5b; font-weight: bold;">${m.dosage}</td>
        <td style="padding: 10px; color: #334155;">${m.frequency}</td>
        <td style="padding: 10px; color: #334155;">${m.duration}</td>
        <td style="padding: 10px; color: #475569; font-style: italic;">${m.instructions}</td>
      </tr>
    `).join('');

    const printDocument = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Curix-Prescription-Rx#${viewingRx.id || 'Slip'}</title>
        <style>
          @page { size: auto; margin: 15mm; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            padding: 24px; 
            color: #1e293b; 
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .header { border-bottom: 2px solid #005a5b; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: 900; color: #005a5b; margin: 0; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          .seal { border-bottom: 1px solid #94a3b8; width: 180px; text-align: center; padding-bottom: 4px; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">CURIX HEALTHCARE SYSTEM</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Outpatient Department (OPD) · Official Clinical Prescription</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: bold; color: #005a5b;">Rx ID: #${viewingRx.id || 'N/A'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="box">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Patient Details</span>
            <strong style="font-size: 15px; color: #0f172a;">${viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Attending Physician</span>
            <strong style="font-size: 15px; color: #0f172a;">${doctorDisplayName}</strong>
            <div style="font-size: 12px; color: #005a5b; font-weight: 600;">LIC: ${profile?.licenseNumber || 'VERIFIED'}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Clinical Diagnosis</span>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-weight: bold; margin-top: 6px;">
            ${viewingRx.diagnosis || 'Routine Clinical Consultation'}
          </div>
        </div>

        <div>
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">℞ Prescribed Medications</span>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medication</th>
                <th>Dosage / Strength</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        ${viewingRx.notes ? `
          <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Doctor's Notes & Advice:</span>
            <p style="margin: 4px 0 0; font-size: 12px; color: #334155;">${viewingRx.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <span>This is an official system-generated electronic prescription.</span>
          <div>
            <div class="seal">Digitally Authorized</div>
            <div style="font-size: 10px; text-transform: uppercase; text-align: center; margin-top: 4px;">Attending Physician Seal</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printDocument);
    frameDoc.close();

    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      document.body.removeChild(printFrame);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex pt-16">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 border-r border-[#005A5B]/15 bg-gradient-to-b from-[#005A5B] via-[#004849] to-[#003839] hidden lg:flex flex-col justify-between fixed top-16 bottom-0 left-0 z-30 shadow-2xl text-slate-200">
        <div className="p-5 space-y-6">
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00A896] to-[#5eead4] text-white flex items-center justify-center shadow-lg shrink-0">
                <Stethoscope size={18} />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#5eead4] leading-none">Clinical Node</span>
                </div>
                <span className="text-xs font-black text-white tracking-wide truncate block mt-0.5">Physician Desk</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-white/60 px-3 uppercase tracking-wider block mb-2">
              Clinical Workspace
            </span>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-gradient-to-r from-teal-400/25 via-teal-400/15 to-transparent text-white border-l-4 border-[#5eead4] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'queue' ? 'bg-[#00A896] text-white shadow-md' : 'bg-white/10 text-slate-300'
                }`}>
                  <Activity size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Patient Queue</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'queue' ? 'bg-teal-400/30 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-teal-400/25 via-teal-400/15 to-transparent text-white border-l-4 border-[#5eead4] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'history' ? 'bg-[#00A896] text-white shadow-md' : 'bg-white/10 text-slate-300'
                }`}>
                  <FileText size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Rx Archives</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'history' ? 'bg-teal-400/30 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {prescriptions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-teal-400/25 via-teal-400/15 to-transparent text-white border-l-4 border-[#5eead4] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'profile' ? 'bg-[#00A896] text-white shadow-md' : 'bg-white/10 text-slate-300'
                }`}>
                  <Clock size={16} />
                </div>
                <span className="text-[13px] tracking-tight">Shift & Credentials</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#003839]/60 backdrop-blur-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-bold text-white block truncate">{doctorDisplayName}</span>
              <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Licensed Attending
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-all cursor-pointer"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 lg:ml-72 p-6 sm:p-10 max-w-7xl w-full mx-auto">
        
        {/* Mobile Horizontal Tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-4 mb-4">
          {[
            { id: 'queue', label: 'Patient Queue' },
            { id: 'history', label: 'Rx Archives' },
            { id: 'profile', label: 'Shift Schedule' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-[#00A896] text-white' : 'bg-white border border-[#005A5B]/15 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {successNotice && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button onClick={() => setSuccessNotice('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {errorNotice && (
          <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button onClick={() => setErrorNotice('')} className="text-rose-700 hover:text-rose-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* TAB 1: CLINICAL PATIENT QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black tracking-widest text-[#005A5B] uppercase">CLINICAL PRACTICE DESK</span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBF5F5] border border-[#005A5B]/15 text-[10px] font-bold text-[#005A5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Consultation Queue
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#005A5B] tracking-tight">{doctorDisplayName}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                  {profile?.specialty || 'General Medicine'} · Consultation Rate: <strong className="text-[#005A5B] font-mono">${profile?.consultationFee || '50.00'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllDoctorData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#005A5B]/20 hover:border-[#00A896] text-xs font-extrabold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-xs transition disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw size={14} className={`text-[#00A896] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Refresh Queue'}</span>
                </button>
              </div>
            </div>

            {/* METRICS STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Today's Queue</span>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#005A5B] tracking-tight font-mono mt-2 block">{totalCount}</span>
                <span className="text-[11px] font-bold text-slate-500 mt-1 block">Scheduled visits</span>
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Awaiting Review</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-amber-700 tracking-tight font-mono mt-2 block">{pendingCount}</span>
                <span className="text-[11px] font-bold text-amber-600 mt-1 block">Pending consultations</span>
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Completed</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-700 tracking-tight font-mono mt-2 block">{completedCount}</span>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Care delivered</span>
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Rx Generated</span>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00A896] flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#00A896] tracking-tight font-mono mt-2 block">{prescriptions.length}</span>
                <span className="text-[11px] font-bold text-slate-500 mt-1 block">Digital slips issued</span>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#005A5B]/15 bg-white text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div className="sm:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#005A5B]/15 bg-white text-xs font-bold text-[#005A5B] focus:outline-none focus:border-[#00A896]"
                >
                  <option value="ALL">All Statuses ({schedule.length})</option>
                  <option value="CONFIRMED">Confirmed / Active ({pendingCount})</option>
                  <option value="COMPLETED">Completed ({completedCount})</option>
                  <option value="CANCELLED">Cancelled ({cancelledCount})</option>
                </select>
              </div>
            </div>

            {/* CONSULTATION QUEUE CARDS */}
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
                        isCancelled ? 'border-slate-200 opacity-60' : 'border-[#005A5B]/15 hover:border-[#00A896]/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-[#EBF5F5] text-[#005A5B]'
                        }`}>
                          {patName.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-[#005A5B]">{patName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' :
                              isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-[#00A896]/10 text-[#00A896]'
                            }`}>
                              {appt.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                            <span>ID: #{appt.patientId || pat.id || 'N/A'}</span>
                            {pat.bloodGroup && <span>· Blood: <strong className="text-[#005A5B] font-mono">{pat.bloodGroup}</strong></span>}
                            {pat.age && <span>· Age: {pat.age} yrs</span>}
                            {pat.gender && <span>· {pat.gender}</span>}
                            {pat.contactNumber && <span>· Tel: <strong className="font-mono text-slate-700">{pat.contactNumber}</strong></span>}
                          </div>

                          {appt.reason && (
                            <p className="text-xs text-slate-600 mt-2 bg-[#F7FAF9] border border-stone-200/80 p-2.5 rounded-xl max-w-xl">
                              <strong className="text-[#005A5B]">Chief Complaint:</strong> {appt.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        <div className="sm:text-right pr-2">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Scheduled Time</span>
                          <span className="text-xs font-black text-[#005A5B] font-mono block mt-0.5">
                            {appt.appointmentDate} · {appt.appointmentTime?.slice(0, 5) || 'Slot'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleCompleteAppointment(appt.id)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <Check size={14} />
                                <span>Mark Done</span>
                              </button>
                              <button
                                onClick={() => handleOpenRxModal(appt)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A896] hover:bg-[#008476] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <FileText size={14} />
                                <span>Write Rx</span>
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <button
                              onClick={() => handleOpenRxModal(appt)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#005A5B]/20 bg-white hover:bg-[#EBF5F5]/30 text-[#005A5B] text-xs font-bold transition shadow-xs cursor-pointer"
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
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No consultations in queue</p>
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
                <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Prescription Archives</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Historical digital prescription slips issued from this node ({prescriptions.length} slips).</p>
              </div>
              <button
                onClick={fetchPrescriptionHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#005A5B]/15 text-xs font-bold text-[#005A5B] hover:bg-[#EBF5F5]/30 shadow-2xs transition cursor-pointer"
              >
                <RefreshCw size={13} className="text-[#00A896]" />
                <span>Refresh Slips</span>
              </button>
            </div>

            {prescriptions.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs overflow-hidden">
                <div className="divide-y divide-stone-100">
                  {prescriptions.map((rx) => {
                    const rawItems = extractItems(rx);
                    const itemCount = rawItems.length;

                    return (
                      <div key={rx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] text-[#005A5B] flex items-center justify-center font-bold shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#005A5B]">
                                {rx.patientName || `Patient #${rx.patientId || 'Record'}`}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                Rx-ID: #{rx.id}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              <strong className="text-[#005A5B]">Diagnosis:</strong> {rx.diagnosis || 'Routine review'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {itemCount} medication{itemCount === 1 ? '' : 's'} prescribed · Appt #{rx.appointmentId || 'Direct'}
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
                            onClick={() => handleOpenViewingRx(rx)}
                            className="px-4 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs font-bold text-[#005A5B] shadow-2xs cursor-pointer"
                          >
                            View Slip
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-[#005A5B]/10 shadow-xs">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-[#005A5B]">No digital prescriptions issued yet</p>
                <p className="text-xs text-slate-400 mt-1">Complete visits from your queue and issue digital Rx slips.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHIFTS & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#005A5B] tracking-tight">Shift & Credentials</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Your clinical profile, license details, and configured booking slots.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-[#005A5B] uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-[#005A5B]" />
                  <span>Licensed Medical Credentials</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-400">Full Name</span>
                    <span className="font-bold text-[#005A5B]">{doctorDisplayName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-400">Department</span>
                    <span className="font-bold text-[#005A5B]">{profile?.departmentName || profile?.department?.name || 'Clinical'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-400">Specialty</span>
                    <span className="font-bold text-[#00A896]">{profile?.specialty || 'General Practitioner'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-400">Medical License</span>
                    <span className="font-mono font-bold text-slate-900">{profile?.licenseNumber || 'VERIFIED'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-400">Qualifications</span>
                    <span className="font-bold text-[#005A5B]">{profile?.qualification || 'MBBS'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Consultation Fee</span>
                    <span className="font-black text-emerald-700 text-sm font-mono">${profile?.consultationFee || '50.00'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#005A5B]/10 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-[#005A5B] uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-[#00A896]" />
                  <span>Configured Shift Availability</span>
                </h3>

                {profile?.availabilities && profile.availabilities.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.availabilities.map((avail, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#EBF5F5] border border-[#005A5B]/15 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-[#005A5B]">{avail.dayOfWeek}</span>
                        </div>
                        <span className="font-mono text-slate-700 font-bold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsRxModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[10px] font-black tracking-widest text-[#005A5B] uppercase">CURIX CLINICAL DESK</span>
            </div>
            <h3 className="text-xl font-black text-[#005A5B]">Issue Electronic Prescription</h3>
            <p className="text-xs text-slate-500 mb-5">
              Generating clinical Rx for Appointment #{selectedAppointment.id}.
            </p>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Pharyngitis, Stage 1 Hypertension"
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#1A2E35] focus:outline-none focus:border-[#00A896]"
                />
              </div>

              {/* Medicine Multi-Line Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#005A5B]">Prescribed Medications</label>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#00A896] hover:underline cursor-pointer"
                  >
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {rxForm.medicines.map((med, index) => (
                    <div key={index} className="p-3.5 rounded-2xl bg-[#EBF5F5]/60 border border-[#005A5B]/15 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#005A5B] uppercase tracking-wider">
                          Medicine #{index + 1}
                        </span>
                        {rxForm.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(index)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
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
                          className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-[#1A2E35]"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Dosage (e.g. 500mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedicineField(index, 'dosage', e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-[#1A2E35]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Freq (e.g. 1-0-1)"
                          value={med.frequency}
                          onChange={(e) => updateMedicineField(index, 'frequency', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-[#1A2E35]"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 7 days)"
                          value={med.duration}
                          onChange={(e) => updateMedicineField(index, 'duration', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-[#1A2E35]"
                        />
                        <input
                          type="text"
                          placeholder="Instructions (e.g. After meals)"
                          value={med.instructions}
                          onChange={(e) => updateMedicineField(index, 'instructions', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-xs text-[#1A2E35]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Doctor's Clinical Notes / Advice</label>
                <textarea
                  rows={3}
                  placeholder="Dietary precautions, test recommendations, rest instructions..."
                  value={rxForm.notes}
                  onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#1A2E35] focus:outline-none focus:border-[#00A896] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRxModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rxSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#008476] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setViewingRx(null)}
              className="no-print absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* PRINTABLE CONTAINER */}
            <div id="printable-prescription-slip" className="space-y-6">
              
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

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#EBF5F5] border border-[#005A5B]/15 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patient Identification</span>
                  <span className="text-sm font-black text-[#005A5B] block mt-0.5">
                    {viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`}
                  </span>
                  <span className="text-slate-600 font-mono">Consultation Ref: #{viewingRx.appointmentId || 'N/A'}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Prescribing Physician</span>
                  <span className="text-sm font-black text-[#005A5B] block mt-0.5">{doctorDisplayName}</span>
                  <span className="text-slate-600 font-medium">LIC: {profile?.licenseNumber || 'VERIFIED'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-white">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Clinical Diagnosis</span>
                <p className="text-sm font-black text-[#005A5B] mt-1">
                  {viewingRx.diagnosis || 'General Clinical Review'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#005A5B]">
                    ℞ Prescribed Medications & Dosages
                  </span>
                  {loadingRxDetails && (
                    <span className="flex items-center gap-1 text-[11px] text-[#00A896] font-semibold">
                      <Loader2 size={12} className="animate-spin" /> Synchronizing full details...
                    </span>
                  )}
                </div>

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
                      {(() => {
                        const items = extractItems(viewingRx).map(normalizeItem).filter(Boolean);

                        if (items.length === 0) {
                          return (
                            <tr>
                              <td colSpan="5" className="py-6 text-center text-slate-400">
                                {loadingRxDetails ? 'Loading medication details...' : 'No line-item medications recorded.'}
                              </td>
                            </tr>
                          );
                        }

                        return items.map((m, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <span className="font-black text-[#005A5B] text-xs block">{m.name}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900">{m.dosage}</span>
                              <span className="text-[11px] text-[#00A896] block font-mono font-bold">({m.frequency})</span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-700">{m.duration}</td>
                            <td className="py-3 px-3 font-medium text-slate-700">{m.instructions}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {viewingRx.notes && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Physician Instructions</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">{viewingRx.notes}</p>
                </div>
              )}

              <div className="pt-8 flex justify-between items-end border-t border-stone-200 text-xs">
                <span className="text-[10px] text-slate-400 italic">This is an electronically generated and verified medical record.</span>
                <div className="text-center">
                  <div className="w-40 border-b border-[#005A5B] pb-1 font-mono text-[11px] font-bold text-[#005A5B]">
                    Digitally Authorized
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">Attending Physician Seal</span>
                </div>
              </div>

            </div>

            {/* Action Buttons: Close, Download, and Print */}
            <div className="no-print pt-6 mt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingRx(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-slate-600 hover:bg-stone-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadSlip}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download size={14} className="text-[#005A5B]" />
                <span>Download Slip</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-[#005A5B] hover:bg-[#004849] text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
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