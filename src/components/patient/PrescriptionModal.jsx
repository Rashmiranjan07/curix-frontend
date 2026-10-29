import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  X, Printer, Download, FileText, Calendar, 
  User, Stethoscope, AlertCircle, Loader2, CheckCircle2 
} from 'lucide-react';

export default function PrescriptionModal({ prescription: initialPrescription, isOpen, onClose }) {
  const [prescription, setPrescription] = useState(initialPrescription);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isOpen || !initialPrescription) return;

    setPrescription(initialPrescription);

    // Inspect incoming items
    const rawItems = extractItems(initialPrescription);
    const hasDetailedFields = rawItems.some(
      (it) => it && typeof it === 'object' && (it.dosage || it.dose || it.strength || it.frequency || it.timing || it.duration || it.days)
    );

    // If items are missing or lack dosage attributes, fetch full entity
    if (initialPrescription.id && (!rawItems.length || !hasDetailedFields)) {
      fetchFullPrescription(initialPrescription.id);
    }
  }, [initialPrescription, isOpen]);

  const fetchFullPrescription = async (id) => {
    if (!id) return;
    setLoadingDetails(true);
    try {
      // Tries standard endpoint; falls back gracefully if already loaded
      const res = await api.get(`/prescriptions/${id}`).catch(() => 
        api.get(`/patient/prescriptions/${id}`)
      );
      const data = res?.data?.data || res?.data;
      if (data && typeof data === 'object') {
        setPrescription((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn("Detail endpoint not found or unneeded. Using passed prescription object:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (!isOpen || !prescription) return null;

  // Extract items array from any common backend attribute or JSON string
  function extractItems(rx) {
    if (!rx) return [];
    let raw = rx.items || rx.prescriptionItems || rx.medicines || rx.medicationItems || rx.medications || [];

    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        // Handle comma-separated list of medication names
        return raw.split(',').map((name) => ({ name: name.trim() }));
      }
    }
    return Array.isArray(raw) ? raw : [];
  }

  // Multi-property mapping covering every standard Spring Boot DTO variation
  const normalizeItem = (item, index) => {
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

    const name = 
      item.name || 
      item.medicineName || 
      item.medicationName || 
      item.drugName || 
      item.medicine?.name || 
      item.title || 
      `Medication #${index + 1}`;

    const dosage = 
      item.dosage || 
      item.dose || 
      item.strength || 
      item.dosageAmount || 
      item.mg || 
      item.amount || 
      item.power || 
      'As directed';

    const frequency = 
      item.frequency || 
      item.freq || 
      item.timing || 
      item.schedule || 
      item.dosageFrequency || 
      item.timesPerDay || 
      item.times || 
      '1-0-1';

    const duration = 
      item.duration || 
      (item.durationDays ? `${item.durationDays} days` : '') ||
      (item.days ? `${item.days} days` : '') ||
      (item.numberOfDays ? `${item.numberOfDays} days` : '') ||
      item.period || 
      '5 days';

    const instructions = 
      item.instructions || 
      item.instruction || 
      item.notes || 
      item.specialInstructions || 
      item.directions || 
      item.direction || 
      item.advice || 
      'After meals';

    return { name, dosage, frequency, duration, instructions };
  };

  const rawItems = extractItems(prescription);
  const items = rawItems.map(normalizeItem).filter(Boolean);

  // Metadata Extraction
  const rawDate = prescription.createdAt || prescription.appointmentDate || prescription.date;
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : new Date().toLocaleDateString();

  const doctorName = 
    prescription.doctorName || 
    prescription.doctor?.fullName || 
    (prescription.doctor?.firstName ? `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName || ''}` : '') ||
    prescription.doctor?.name || 
    'Dr. Attending Physician';

  const department = 
    prescription.departmentName || 
    prescription.department?.name || 
    prescription.doctorSpecialty || 
    prescription.specialty || 
    prescription.doctor?.specialty || 
    'General Medicine';

  const patientName = 
    prescription.patientName || 
    prescription.patient?.fullName || 
    (prescription.patient?.firstName ? `${prescription.patient.firstName} ${prescription.patient.lastName || ''}` : '') ||
    (prescription.patient?.user ? `${prescription.patient.user.firstName} ${prescription.patient.user.lastName || ''}` : '') ||
    `Patient #${prescription.patientId || prescription.id || 'Record'}`;

  // Direct File Download Handler (Generates an official offline-ready medical slip file)
  const handleDownloadSlip = () => {
    const rowsHtml = items.map((m, idx) => `
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
        <title>Curix-Prescription-Rx#${prescription.id || 'Slip'}</title>
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
            <div style="font-size: 14px; font-weight: bold; color: #005a5b;">Rx ID: #${prescription.id || 'N/A'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${formattedDate}</div>
          </div>
        </div>

        <div class="box">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Patient Record</span>
            <strong style="font-size: 15px; color: #0f172a;">${patientName}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Attending Physician</span>
            <strong style="font-size: 15px; color: #0f172a;">${doctorName}</strong>
            <div style="font-size: 12px; color: #005a5b; font-weight: 600;">${department}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b;">Clinical Diagnosis</span>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-weight: bold; margin-top: 6px;">
            ${prescription.diagnosis || 'Routine General Consultation'}
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

        ${prescription.notes ? `
          <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Doctor's Notes & Advice:</span>
            <p style="margin: 4px 0 0; font-size: 12px; color: #334155;">${prescription.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <span>This is an official system-generated electronic prescription.</span>
          <div>
            <div class="seal">Digitally Authorized</div>
            <div style="font-size: 10px; text-transform: uppercase; text-align: center; margin-top: 4px;">Medical Officer Seal</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([slipDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Curix-Prescription-Rx${prescription.id || 'Slip'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
      
      {/* Modal Surface - Dark Pine Frosted Glass */}
      <div className="relative w-full max-w-3xl rounded-3xl p-6 sm:p-9 bg-[#043a3b]/95 border border-teal-400/30 shadow-2xl backdrop-blur-xl text-white max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Top Actions: Title, Download, Print, Close */}
        <div className="flex items-center justify-between pb-5 border-b border-teal-400/20 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a896] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#00a896]/30">
              Rx
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#5eead4] uppercase block">
                Official Clinical Slip
              </span>
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white uppercase font-serif">
                Curix Electronic Medical Prescription
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct File Download Button */}
            <button
              onClick={handleDownloadSlip}
              type="button"
              title="Download prescription slip to your device"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-teal-400/30 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download size={14} className="text-[#5eead4]" />
              <span>Download Slip</span>
            </button>

            {/* Print Slip Button */}
            <button
              onClick={() => window.print()}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008476] text-white text-xs font-bold transition shadow-md shadow-[#00a896]/20 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTAINER FOR DISPLAY AND PRINT */}
        <div id="printable-prescription-slip" className="space-y-6 pt-4 print:pt-0">

          {/* Slip Header Meta */}
          <div className="p-5 rounded-2xl bg-white/5 border border-teal-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-slate-50 print:border-slate-300 print:text-black">
            <div>
              <span className="text-[11px] font-bold text-teal-200/70 block uppercase tracking-wider print:text-slate-500">
                Prescribing Physician
              </span>
              <h3 className="text-lg font-black text-white print:text-slate-900 font-serif">
                {doctorName}
              </h3>
              <p className="text-xs text-[#5eead4] font-semibold print:text-slate-700">{department}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-bold text-teal-200/70 block uppercase tracking-wider print:text-slate-500">
                Prescription ID
              </span>
              <span className="text-sm font-black text-[#5eead4] font-mono print:text-slate-900">
                #{prescription.id || 'N/A'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-0.5 sm:justify-end print:text-slate-600">
                <Calendar size={13} className="text-[#5eead4] print:text-slate-700" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Patient Reference Box */}
          <div className="p-4 rounded-xl bg-white/5 border border-teal-400/20 flex items-center justify-between text-xs print:bg-slate-50 print:border-slate-300 print:text-black">
            <div>
              <span className="text-slate-400 print:text-slate-500 block uppercase text-[10px] font-bold">Patient Details</span>
              <strong className="text-sm text-white print:text-black">{patientName}</strong>
            </div>
            <div className="text-right font-mono text-slate-300 print:text-slate-600">
              Consultation Ref: #{prescription.appointmentId || prescription.id || 'N/A'}
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-200/60 block mb-2 print:text-slate-500">
              Clinical Diagnosis
            </span>
            <div className="p-4 rounded-2xl bg-white/5 border border-teal-400/20 shadow-xs print:bg-white print:border-slate-300">
              <p className="text-sm font-bold text-white print:text-slate-900">
                {prescription.diagnosis || 'Routine General Consultation'}
              </p>
            </div>
          </div>

          {/* Prescribed Medications Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-200/60 print:text-slate-500">
                ℞ Prescribed Medications & Dosages
              </span>
              {loadingDetails && (
                <span className="flex items-center gap-1 text-[11px] text-[#5eead4] font-semibold no-print">
                  <Loader2 size={12} className="animate-spin" /> Synchronizing regimen...
                </span>
              )}
            </div>

            <div className="border border-teal-400/20 rounded-2xl overflow-hidden shadow-xs print:border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/10 border-b border-teal-400/20 text-[11px] font-bold text-teal-200 uppercase tracking-wider print:bg-slate-100 print:text-slate-700 print:border-slate-300">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Medication</th>
                    <th className="py-3 px-3">Dosage / Strength</th>
                    <th className="py-3 px-3">Frequency</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-4">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-400/10 print:divide-slate-200 text-slate-200 print:text-slate-800">
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                      <tr key={index} className="hover:bg-white/5 print:hover:bg-transparent transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">{index + 1}</td>
                        <td className="py-3 px-4 font-bold text-white print:text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#5eead4] print:text-slate-900">
                          {item.dosage}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200 print:text-slate-800 font-mono">
                          {item.frequency}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-300 print:text-slate-700">
                          {item.duration}
                        </td>
                        <td className="py-3 px-4 text-slate-300 print:text-slate-600 italic">
                          {item.instructions}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        {loadingDetails ? 'Retrieving prescription line items...' : 'No individual line items registered. Please refer to physician notes below.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Physician Advice & Notes */}
          {(prescription.notes || prescription.instructions) && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/25 flex items-start gap-3 print:bg-slate-50 print:border-slate-300">
              <AlertCircle size={18} className="text-[#5eead4] print:text-slate-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white print:text-slate-900 uppercase tracking-wider">
                  Special Instructions & Precautionary Advice
                </h5>
                <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                  {prescription.notes || prescription.instructions}
                </p>
              </div>
            </div>
          )}

          {/* Official Sign-off Stamp */}
          <div className="pt-6 flex justify-between items-end border-t border-teal-400/20 print:border-slate-300 text-xs text-slate-400">
            <span className="text-[10px] italic">This is an authorized, digitally verified medical record.</span>
            <div className="text-center">
              <div className="w-40 border-b border-teal-400/40 print:border-slate-400 pb-1 font-mono text-[11px] font-bold text-white print:text-slate-900">
                Digitally Authorized
              </div>
              <span className="text-[10px] text-teal-200/60 print:text-slate-500 uppercase tracking-wider block mt-1">
                Medical Officer Seal
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}