import React, { useState } from 'react';
import { 
  X, AlertTriangle, Calendar, Clock, Stethoscope, 
  Loader2, CheckCircle2 
} from 'lucide-react';

const REASON_PRESETS = [
  'Schedule Conflict',
  'Personal Emergency',
  'Feeling Better / Resolved',
  'Need to Reschedule Later',
  'Other Reason',
];

export default function CancelAppointmentModal({ appointment, isOpen, onClose, onConfirm, loading }) {
  const [selectedPreset, setSelectedPreset] = useState(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !appointment) return null;

  const doctorName = appointment.doctorName || (appointment.doctor ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : `Doctor #${appointment.doctorId}`);

  const handleConfirm = (e) => {
    e.preventDefault();
    const finalReason = selectedPreset === 'Other Reason' 
      ? (customReason.trim() || 'Other Reason')
      : (customReason.trim() ? `${selectedPreset} - ${customReason.trim()}` : selectedPreset);

    onConfirm(appointment.id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm transition-all duration-200">
      <div className="relative w-full max-w-lg bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          type="button"
          aria-label="Close"
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-rose-600 uppercase block">
              APPOINTMENT CANCELLATION
            </span>
            <h3 className="text-xl font-black text-[#1e3a5f]">
              Cancel Consultation?
            </h3>
          </div>
        </div>

        {/* Appointment Snapshot Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="flex items-center gap-2.5 mb-2">
            <Stethoscope size={16} className="text-[#0ea5e9]" />
            <h4 className="text-sm font-bold text-[#1e3a5f]">{doctorName}</h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-[#0ea5e9]" />
              {appointment.appointmentDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#0ea5e9]" />
              {appointment.startTime || appointment.appointmentTime}
            </span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Reason Preset Badges */}
          <div>
            <label className="block text-xs font-bold text-[#1e3a5f] mb-2">
              Select Reason for Cancellation
            </label>
            <div className="flex flex-wrap gap-2">
              {REASON_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Detailed Notes */}
          <div>
            <label className="block text-xs font-bold text-[#1e3a5f] mb-1">
              Additional Details <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              maxLength={255}
              placeholder="Provide any additional context for the clinic..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e3a5f] focus:border-rose-400 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-white" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}