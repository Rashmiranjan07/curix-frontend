import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Printer, FileText, Calendar, User, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';

export default function PrescriptionModal({ prescription: initialPrescription, isOpen, onClose }) {
  const [prescription, setPrescription] = useState(initialPrescription);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    setPrescription(initialPrescription);

    // If modal is opened and items are missing, fetch full details from GET /api/v1/prescriptions/{id}
    if (initialPrescription && isOpen) {
      const existingItems = 
        initialPrescription.items || 
        initialPrescription.prescriptionItems || 
        initialPrescription.medicines;

      if (!existingItems || existingItems.length === 0) {
        fetchFullPrescription(initialPrescription.id);
      }
    }
  }, [initialPrescription, isOpen]);

  const fetchFullPrescription = async (id) => {
    if (!id) return;
    setLoadingDetails(true);
    try {
      const res = await api.get(`/prescriptions/${id}`);
      const data = res.data?.data || res.data;
      if (data) {
        setPrescription((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn("Could not fetch detailed prescription by ID:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (!isOpen || !prescription) return null;

  // Extract items array from any common field name
  const items = 
    prescription.items || 
    prescription.prescriptionItems || 
    prescription.medicines || 
    prescription.medicationItems || 
    [];

  // Format date cleanly
  const rawDate = prescription.createdAt || prescription.appointmentDate || prescription.date;
  const formattedDate = rawDate ? new Date(rawDate).toLocaleString() : 'N/A';

  // Extract physician name
  const doctorName = 
    prescription.doctorName || 
    (prescription.doctor ? (prescription.doctor.name || prescription.doctor.fullName || `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}`) : 'Dr. Attending Physician');

  // Extract department / specialty
  const department = 
    prescription.departmentName || 
    prescription.doctorSpecialty || 
    prescription.specialty || 
    prescription.doctor?.specialization || 
    'General Medicine';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-3xl bg-white border border-sky-100 rounded-3xl p-6 sm:p-9 shadow-2xl max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        
        {/* Top Actions: Title, Print, Close */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              Rx
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider text-[#1e3a5f] uppercase">
                Curix Electronic Medical Prescription
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="text-slate-400 hover:text-[#1e3a5f] p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Prescription Header Card */}
        <div className="mt-6 p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Prescribing Physician
            </span>
            <h3 className="text-lg font-black text-[#1e3a5f]">
              {doctorName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">{department}</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Prescription ID
            </span>
            <span className="text-sm font-black text-[#0ea5e9]">
              #{prescription.id}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5 sm:justify-end">
              <Calendar size={12} className="text-[#0ea5e9]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div className="mt-6">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Clinical Diagnosis
          </h4>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-sm font-bold text-[#1e3a5f]">
              {prescription.diagnosis || 'No formal clinical diagnosis recorded.'}
            </p>
          </div>
        </div>

        {/* Prescribed Regimen (Line-Items Table) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Prescribed Regimen (Line-Items)
            </h4>
            {loadingDetails && (
              <span className="flex items-center gap-1 text-[11px] text-[#0ea5e9] font-semibold">
                <Loader2 size={12} className="animate-spin" /> Loading medications...
              </span>
            )}
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Medication</th>
                  <th className="py-3 px-3">Dosage</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-4">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items && items.length > 0 ? (
                  items.map((item, index) => {
                    // Extract medication name
                    const medName = 
                      item.medicationName || 
                      item.medicineName || 
                      item.name || 
                      item.drugName || 
                      `Medication #${index + 1}`;

                    // Extract duration
                    const dur = 
                      item.duration || 
                      (item.durationDays ? `${item.durationDays} days` : 'As directed');

                    // Extract instructions
                    const inst = 
                      item.instructions || 
                      item.specialInstructions || 
                      '-';

                    return (
                      <tr key={index} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 font-bold text-[#1e3a5f]">
                          {medName}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {item.dosage || '-'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {item.frequency || '-'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {dur}
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic">
                          {inst}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      {loadingDetails ? 'Retrieving prescription line items...' : 'No individual line items registered. Please refer to physician notes.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Instructions & Advice */}
        {(prescription.notes || prescription.instructions) && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-900">
                Special Instructions & Precautionary Advice
              </h5>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {prescription.notes || prescription.instructions}
              </p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>This is an official system-generated electronic prescription.</span>
          <span className="font-mono text-[#0ea5e9]">Verified by Curix Health Systems</span>
        </div>

      </div>
    </div>
  );
}