import React, { useState, useEffect } from 'react';
import { patientApi } from '../../services/api';
import { 
  X, Calendar as CalendarIcon, Clock, Stethoscope, 
  CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

export default function DoctorBookingModal({ doctor, isOpen, onClose, onBookingSuccess }) {
  if (!isOpen || !doctor) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlotTime, setSelectedSlotTime] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Extract numeric ID safely from doctor object
  const validDoctorId = Number(doctor.id || doctor.doctorId || doctor.userId);

  // Extract doctor name from any common DTO field
  const doctorDisplayName = 
    doctor.fullName || 
    doctor.doctorName || 
    (doctor.firstName && doctor.lastName ? `Dr. ${doctor.firstName} ${doctor.lastName}` : null) ||
    doctor.name || 
    (doctor.user ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` : `Doctor #${validDoctorId}`);

  useEffect(() => {
    if (validDoctorId) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, validDoctorId]);

  const fetchSlots = async (date) => {
    setLoadingSlots(true);
    setSelectedSlotTime('');
    setError('');
    try {
      const res = await patientApi.getAvailableSlots(validDoctorId, date);
      const slotList = res.data?.data || res.data;
      if (Array.isArray(slotList)) {
        setAvailableSlots(slotList);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Failed to load doctor slots:", err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Parses any slot input into strict LocalTime format "HH:mm:ss"
  const normalizeToLocalTime = (rawTime) => {
    if (!rawTime) return '09:00:00';

    // If it's an object with startTime or time property
    if (typeof rawTime === 'object') {
      if (rawTime.startTime) rawTime = rawTime.startTime;
      else if (rawTime.time) rawTime = rawTime.time;
      else if (Array.isArray(rawTime)) {
        // Jackson array [hour, minute]
        const h = String(rawTime[0]).padStart(2, '0');
        const m = String(rawTime[1] || 0).padStart(2, '0');
        return `${h}:${m}:00`;
      }
    }

    const str = String(rawTime).trim();

    // Already "HH:mm:ss"
    if (/^\d{2}:\d{2}:\d{2}$/.test(str)) return str;

    // "HH:mm" -> "HH:mm:00"
    if (/^\d{2}:\d{2}$/.test(str)) return `${str}:00`;

    // "9:00" -> "09:00:00"
    if (/^\d{1}:\d{2}$/.test(str)) return `0${str}:00`;

    // "09:30 AM" or "02:30 PM"
    const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3]?.toUpperCase();

      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }

    return `${str}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotTime) {
      setError('Please choose a time slot for your consultation.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formattedTime = normalizeToLocalTime(selectedSlotTime);

      // Matches BookAppointmentRequest.java exactly:
      // Long doctorId, LocalDate appointmentDate, LocalTime startTime, String reasonForVisit
      const payload = {
        doctorId: validDoctorId,
        appointmentDate: selectedDate,
        startTime: formattedTime,
        reasonForVisit: reasonForVisit.trim() || 'General Consultation',
      };

      console.log("Submitting BookAppointmentRequest payload:", payload);

      await patientApi.bookAppointment(payload);
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      console.error("Booking error response:", err.response?.data);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Could not book appointment. That slot might have been taken.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-xl bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 text-slate-400 hover:text-[#1e3a5f] p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <div className="inline-block mb-1">
            <span className="text-[11px] font-black tracking-widest text-[#0ea5e9] uppercase pb-0.5 border-b border-[#0ea5e9]">
              RESERVATION DESK
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1e3a5f]">
            Schedule Consultation
          </h2>
          
          <div className="mt-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-[#0ea5e9] shadow-xs">
                <Stethoscope size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1e3a5f]">{doctorDisplayName}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {doctor.specialty || doctor.specialization || doctor.departmentName || 'Specialist'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Consultation Fee</span>
              <span className="text-base font-extrabold text-[#1e3a5f]">
                ${doctor.consultationFee !== undefined ? doctor.consultationFee : '50.00'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5 flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-[#0ea5e9]" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#1e3a5f] font-semibold focus:border-[#0ea5e9] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#0ea5e9]" />
                <span>Available Shift Slots</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {selectedSlotTime ? `Selected: ${selectedSlotTime}` : 'Choose slot'}
              </span>
            </label>

            {loadingSlots ? (
              <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#0ea5e9]" />
                <span className="text-xs font-medium">Calculating available slots from database...</span>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {availableSlots.map((slotObj, idx) => {
                  const displayTime = 
                    typeof slotObj === 'string' ? slotObj : 
                    (slotObj.startTime || slotObj.slot || slotObj.time || JSON.stringify(slotObj));

                  const isAvailable = 
                    slotObj.isAvailable !== undefined ? slotObj.isAvailable : 
                    (slotObj.available !== undefined ? slotObj.available : !slotObj.booked);

                  const isSelected = selectedSlotTime === displayTime;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlotTime(displayTime)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        !isAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/20 scale-95'
                          : 'bg-sky-50/60 hover:bg-sky-100/70 border border-sky-100 text-[#1e3a5f]'
                      }`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs">
                No shift slots found for this doctor on {selectedDate}.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e3a5f] mb-1.5">
              Reason for Visit (max 500 characters)
            </label>
            <textarea
              rows={2}
              maxLength={500}
              placeholder="Symptoms, routine follow-up, or clinical concern..."
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#1e3a5f] placeholder:text-slate-400 focus:border-[#0ea5e9] focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedSlotTime}
              className="w-full py-3.5 rounded-full bg-[#1e3a5f] hover:bg-[#284d7a] text-white font-bold text-sm tracking-wide shadow-md shadow-[#1e3a5f]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Reserving Slot in Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm Appointment Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}