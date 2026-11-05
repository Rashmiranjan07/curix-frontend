import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { patientApi, adminApi } from '../../services/api';
import maleDoctor3d from '../../assets/male_doctor_3d.jpg';
import femaleDoctor3d from '../../assets/female_doctor_3d.jpg';
import { 
  Heart, Calendar, Stethoscope, Clock, FileText, User, 
  Search, CheckCircle2, AlertCircle, X, ChevronRight, 
  RefreshCw, Building2, DollarSign, Printer, Download, ArrowUpRight, 
  Sparkles, Check, MapPin, Phone, Loader2, LogOut, LayoutDashboard,
  Shield, ChevronLeft
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';


// 14 Verified Hospital Faculty Doctors
const defaultFacultyDoctors = [
  { id: 1, firstName: 'Edward', lastName: 'Smith', fullName: 'Dr. Edward Smith', specialty: 'Interventional Cardiology', departmentName: 'Cardiology', departmentId: 1, gender: 'MALE', consultationFee: 50.00 },
  { id: 2, firstName: 'Sarah', lastName: 'Conor', fullName: 'Dr. Sarah Conor', specialty: 'Neurologist', departmentName: 'Neurology', departmentId: 2, gender: 'FEMALE', consultationFee: 55.00 },
  { id: 3, firstName: 'Arjun', lastName: 'Sharma', fullName: 'Dr. Arjun Sharma', specialty: 'General Physician & Diabetologist', departmentName: 'General Medicine', departmentId: 3, gender: 'MALE', consultationFee: 40.00 },
  { id: 4, firstName: 'Vikram', lastName: 'Singh', fullName: 'Dr. Vikram Singh', specialty: 'ENT Surgeon', departmentName: 'ENT', departmentId: 4, gender: 'MALE', consultationFee: 45.00 },
  { id: 5, firstName: 'Aditi', lastName: 'Das', fullName: 'Dr. Aditi Das', specialty: 'Orthodontist & Dental Specialist', departmentName: 'Dentistry', departmentId: 5, gender: 'FEMALE', consultationFee: 35.00 },
  { id: 6, firstName: 'Kishan', lastName: 'Malhotra', fullName: 'Dr. Kishan Malhotra', specialty: 'Clinical Nephrologist', departmentName: 'Nephrology', departmentId: 6, gender: 'MALE', consultationFee: 60.00 },
  { id: 7, firstName: 'Sanya', lastName: 'Patel', fullName: 'Dr. Sanya Patel', specialty: 'Respiratory Medicine Specialist', departmentName: 'Pulmonology', departmentId: 7, gender: 'FEMALE', consultationFee: 50.00 },
  { id: 8, firstName: 'Rajesh', lastName: 'Iyer', fullName: 'Dr. Rajesh Iyer', specialty: 'Senior Joint Replacement Surgeon', departmentName: 'Orthopaedics', departmentId: 8, gender: 'MALE', consultationFee: 65.00 },
  { id: 9, firstName: 'Meera', lastName: 'Nair', fullName: 'Dr. Meera Nair', specialty: 'Gastroenterologist & Hepatologist', departmentName: 'Gastrosciences', departmentId: 9, gender: 'FEMALE', consultationFee: 55.00 },
  { id: 10, firstName: 'Amitav', lastName: 'Roy', fullName: 'Dr. Amitav Roy', specialty: 'Precision Oncology Specialist', departmentName: 'Oncology', departmentId: 10, gender: 'MALE', consultationFee: 70.00 },
  { id: 11, firstName: 'Pooja', lastName: 'Verma', fullName: 'Dr. Pooja Verma', specialty: 'High-Risk Obstetrics & Gynaecology', departmentName: 'Mother & Child', departmentId: 11, gender: 'FEMALE', consultationFee: 50.00 },
  { id: 12, firstName: 'Devendra', lastName: 'Joshi', fullName: 'Dr. Devendra Joshi', specialty: 'Emergency & Critical Trauma Surgeon', departmentName: 'Emergency Medicine', departmentId: 12, gender: 'MALE', consultationFee: 60.00 },
  { id: 13, firstName: 'Ananya', lastName: 'Sen', fullName: 'Dr. Ananya Sen', specialty: 'Dermatologist & Cosmetologist', departmentName: 'Dermatology', departmentId: 13, gender: 'FEMALE', consultationFee: 45.00 },
  { id: 14, firstName: 'Farhan', lastName: 'Akhtar', fullName: 'Dr. Farhan Akhtar', specialty: 'Multi-Organ Transplant Surgeon', departmentName: 'Transplant Surgery', departmentId: 14, gender: 'MALE', consultationFee: 75.00 }
];


// Gender & 3D Emoji Avatar Resolvers
const getDoctorGender = (doc) => {
  if (!doc) return 'MALE';
  if (doc.gender) {
    const g = String(doc.gender).toUpperCase();
    if (g.includes('FEMALE') || g === 'F') return 'FEMALE';
    if (g.includes('MALE') || g === 'M') return 'MALE';
  }
  const name = `${doc.firstName || ''} ${doc.name || ''} ${doc.doctorName || ''} ${doc.fullName || ''}`.toLowerCase();
  const femaleNames = [
    'sarah', 'priya', 'emily', 'anita', 'mary', 'jessica', 'claire', 'elizabeth',
    'lisa', 'emma', 'olivia', 'sophia', 'rachel', 'neha', 'pooja', 'sneha', 'anjali',
    'aarti', 'kavita', 'sunita', 'meera', 'deepa', 'conor', 'fatima', 'aisha', 'maya', 'aditi', 'sanya', 'ananya'
  ];
  if (femaleNames.some((fn) => name.includes(fn))) return 'FEMALE';
  return 'MALE';
};

const getDoctor3dImage = (doc) => {
  if (doc?.image && typeof doc.image === 'string' && (doc.image.startsWith('http') || doc.image.startsWith('data:') || doc.image.startsWith('/src/'))) {
    return doc.image;
  }
  if (doc?.profileImage && typeof doc.profileImage === 'string' && (doc.profileImage.startsWith('http') || doc.profileImage.startsWith('data:') || doc.profileImage.startsWith('/src/'))) {
    return doc.profileImage;
  }
  return getDoctorGender(doc) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
};

const getDoctor3dEmoji = (doc) => {
  return getDoctorGender(doc) === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️';
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'appointments' | 'prescriptions' | 'profile'
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. Booking State
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [doctorSearch, setDoctorSearch] = useState('');

  // Merge live registered doctors from backend with faculty roster so all 14 official doctors are always listed
  const allAvailableDoctors = React.useMemo(() => {
    if (doctors && doctors.length >= 14) return doctors;
    if (doctors && doctors.length > 0) {
      const existingNames = new Set(doctors.map(d => getDoctorName(d).toLowerCase().replace(/^dr\.\s*/i, '')));
      const extra = defaultFacultyDoctors.filter(d => !existingNames.has(d.fullName.toLowerCase().replace(/^dr\.\s*/i, '')));
      return [...doctors, ...extra];
    }
    return defaultFacultyDoctors;
  }, [doctors]);


  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // 2. Appointments State
  const [myAppointments, setMyAppointments] = useState([]);

  // 3. Cancellation Modal
  const [cancellingAppt, setCancellingAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule Conflict');
  const [customCancelText, setCustomCancelText] = useState('');
  const [cancelSaving, setCancelSaving] = useState(false);

  // 4. Prescriptions State
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [viewingRx, setViewingRx] = useState(null);
  const [loadingRxDetails, setLoadingRxDetails] = useState(false);
  const [loadingApptRxId, setLoadingApptRxId] = useState(null);
  const [pendingRxNotice, setPendingRxNotice] = useState(null);

  // 5. Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    age: '',
    gender: 'OTHER',
    address: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    loadAllPatientData();
  }, []);

  const loadAllPatientData = async () => {
    setIsSyncing(true);
    setErrorNotice('');
    try {
      await Promise.all([
        fetchDepartments(),
        fetchDoctors(),
        fetchMyAppointments(),
        fetchMyPrescriptions(),
        fetchMyProfile()
      ]);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await adminApi.getDepartments();
      const list = res.data?.data || res.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load departments:", err);
    }
  };

  const fetchDoctors = async (deptId = null) => {
    try {
      const res = await patientApi.getDoctors(deptId === 'ALL' ? null : deptId);
      const list = res.data?.data || res.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load doctors:", err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await patientApi.getMyAppointments();
      const list = res.data?.data || res.data;
      setMyAppointments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load appointments:", err);
    }
  };

  const fetchMyPrescriptions = async () => {
    try {
      const res = await patientApi.getMyPrescriptions();
      const list = res.data?.data || res.data;
      setMyPrescriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Could not load prescriptions:", err);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await patientApi.getMyProfile();
      const data = res.data?.data || res.data;
      if (data) {
        setProfile({
          firstName: data.firstName || data.user?.firstName || '',
          lastName: data.lastName || data.user?.lastName || '',
          email: data.email || data.user?.email || '',
          phone: data.phone || data.contactNumber || '',
          bloodGroup: data.bloodGroup || '',
          age: data.age || '',
          gender: data.gender || 'OTHER',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.warn("Could not load profile:", err);
    }
  };

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

  const handleOpenViewingRx = async (rx) => {
    setViewingRx(rx);
    const existing = extractItems(rx);

    if (rx.id && (!existing.length || !existing[0]?.dosage)) {
      setLoadingRxDetails(true);
      try {
        const res = await api.get(`/prescriptions/${rx.id}`).catch(() =>
          api.get(`/patient/prescriptions/${rx.id}`)
        );
        const data = res?.data?.data || res?.data;
        if (data && typeof data === 'object') {
          setViewingRx((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn("Prescription detail fetch fallback: using summary data", err);
      } finally {
        setLoadingRxDetails(false);
      }
    }
  };

  const handleViewAppointmentPrescription = async (appt) => {
    if (!appt) return;

    // Check if prescription already linked on appt or present in loaded myPrescriptions
    let foundRx = appt.prescription || myPrescriptions.find(
      (rx) => Number(rx.appointmentId) === Number(appt.id) ||
              Number(rx.appointment?.id) === Number(appt.id) ||
              (appt.prescriptionId && Number(rx.id) === Number(appt.prescriptionId))
    );

    if (!foundRx) {
      setLoadingApptRxId(appt.id);
      try {
        const res = await patientApi.getPrescriptionByAppointment(appt.id).catch(() =>
          api.get(`/prescriptions?appointmentId=${appt.id}`).catch(() =>
            api.get(`/prescriptions/by-appointment/${appt.id}`)
          )
        );
        const data = res?.data?.data || res?.data;
        if (data && (data.id || data.diagnosis || (Array.isArray(data) && data.length > 0))) {
          foundRx = Array.isArray(data) ? data[0] : data;
        }
      } catch (err) {
        console.warn("Could not retrieve prescription for consultation:", err);
      }

      // If still not found, try refreshing myPrescriptions list just in case
      if (!foundRx) {
        try {
          const rxListRes = await patientApi.getMyPrescriptions();
          const list = rxListRes.data?.data || rxListRes.data;
          if (Array.isArray(list)) {
            setMyPrescriptions(list);
            foundRx = list.find(
              (rx) => Number(rx.appointmentId) === Number(appt.id) ||
                      Number(rx.appointment?.id) === Number(appt.id) ||
                      (appt.prescriptionId && Number(rx.id) === Number(appt.prescriptionId))
            );
          }
        } catch (e) {
          console.warn("Vault refresh fallback failed:", e);
        }
      }
      setLoadingApptRxId(null);
    }

    if (foundRx) {
      const doctorName = getDoctorName(appt) || getDoctorName(foundRx);
      const deptName = appt.specialty || appt.departmentName || appt.doctor?.specialty || appt.doctor?.department?.name || foundRx.departmentName || foundRx.specialty || 'General Consultation';

      const enrichedRx = {
        ...foundRx,
        appointmentId: foundRx.appointmentId || appt.id,
        doctorName: foundRx.doctorName || doctorName,
        doctor: foundRx.doctor || appt.doctor,
        departmentName: deptName,
        appointmentDate: appt.appointmentDate || foundRx.appointmentDate,
        appointmentTime: appt.startTime || appt.appointmentTime
      };

      if (enrichedRx.id) {
        setMyPrescriptions((prev) => {
          if (prev.some((p) => Number(p.id) === Number(enrichedRx.id))) return prev;
          return [enrichedRx, ...prev];
        });
      }

      handleOpenViewingRx(enrichedRx);
    } else {
      setPendingRxNotice({
        appointmentId: appt.id,
        doctorName: getDoctorName(appt),
        date: appt.appointmentDate,
        time: appt.startTime || appt.appointmentTime || ''
      });
    }
  };

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setBookingDate('');
    setAvailableSlots([]);
    setSelectedSlot('');
    setBookingReason('');
  };

  const handleDateChange = async (date) => {
    setBookingDate(date);
    setSelectedSlot('');
    if (!selectedDoctor || !date) return;

    setSlotsLoading(true);
    try {
      const res = await patientApi.getAvailableSlots(selectedDoctor.id, date);
      const slots = res.data?.data || res.data;
      setAvailableSlots(Array.isArray(slots) ? slots : []);
    } catch (err) {
      console.warn("Could not load slots:", err);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !selectedSlot) return;

    setIsBookingSubmitting(true);
    setErrorNotice('');

    try {
      const formattedTime = selectedSlot.length === 5 ? `${selectedSlot}:00` : selectedSlot;

      const payload = {
        doctorId: Number(selectedDoctor.id),
        appointmentDate: bookingDate,
        startTime: formattedTime,
        reasonForVisit: bookingReason.trim() || 'General Clinical Consultation'
      };

      await patientApi.bookAppointment(payload);
      setSuccessNotice(`Consultation booked with ${getDoctorName(selectedDoctor)} on ${bookingDate} at ${selectedSlot}. A confirmation email has been sent to your registered email address.`);
      setSelectedDoctor(null);
      await fetchMyAppointments();
      setActiveTab('appointments');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || 'Input validation failed for one or more fields';
      setErrorNotice(serverMsg);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingAppt) return;
    setCancelSaving(true);
    setErrorNotice('');

    try {
      const finalReason = cancelReason === 'Other' ? customCancelText : cancelReason;
      await patientApi.cancelAppointment(cancellingAppt.id, finalReason);
      setSuccessNotice(`Consultation #${cancellingAppt.id} has been cancelled.`);
      setCancellingAppt(null);
      await fetchMyAppointments();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setErrorNotice('');

    try {
      await patientApi.updateMyProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
        bloodGroup: profile.bloodGroup.trim(),
        age: profile.age ? Number(profile.age) : null,
        gender: profile.gender,
        address: profile.address.trim()
      });
      setSuccessNotice('Your personal health chart has been successfully updated.');
      await fetchMyProfile();
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Robust Doctor Name Resolver supporting all backend response formats
  const getDoctorName = (input) => {
    if (!input) return 'Attending Physician';
    const doc = input.doctor || input.physician || input;

    if (typeof doc === 'string') return doc.startsWith('Dr.') ? doc : `Dr. ${doc}`;
    if (doc.firstName && doc.lastName) return `Dr. ${doc.firstName} ${doc.lastName}`;
    if (doc.fullName) return doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
    if (doc.doctorName) return doc.doctorName.startsWith('Dr.') ? doc.doctorName : `Dr. ${doc.doctorName}`;
    if (doc.name) return doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`;
    if (doc.user && doc.user.firstName) return `Dr. ${doc.user.firstName} ${doc.user.lastName || ''}`;
    if (doc.email) return `Dr. ${doc.email.split('@')[0]}`;
    if (input.doctorName) return input.doctorName.startsWith('Dr.') ? input.doctorName : `Dr. ${input.doctorName}`;
    
    return `Doctor #${doc.id || input.doctorId || 'Specialist'}`;
  };

  const filteredDoctors = allAvailableDoctors.filter((doc) => {
    const nameMatch = getDoctorName(doc).toLowerCase().includes(doctorSearch.toLowerCase()) ||
                    (doc.specialty || '').toLowerCase().includes(doctorSearch.toLowerCase());
    const deptMatch = selectedDept === 'ALL' || String(doc.departmentId || doc.department?.id) === String(selectedDept);
    return nameMatch && deptMatch;
  });

  const handleDownloadSlip = () => {
    if (!viewingRx) return;
    const activeItems = extractItems(viewingRx).map(normalizeItem).filter(Boolean);

    const docName = getDoctorName(viewingRx);
    const patName = profile.firstName ? `${profile.firstName} ${profile.lastName}` : (viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`);
    const deptName = viewingRx.departmentName || viewingRx.department?.name || viewingRx.doctorSpecialty || viewingRx.specialty || 'General Medicine';

    const rowsHtml = activeItems.map((m, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${m.name}</td>
        <td style="padding: 10px; color: #00A896; font-weight: bold;">${m.dosage}</td>
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
          .header { border-bottom: 2px solid #00A896; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: 900; color: #0A1C35; margin: 0; }
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
            <div style="font-size: 14px; font-weight: bold; color: #00A896;">Rx ID: #${viewingRx.id || 'N/A'}</div>
            ${viewingRx.appointmentId ? `<div style="font-size: 11px; font-family: monospace; color: #64748b; margin-top: 2px;">Consultation Ref: #${viewingRx.appointmentId}</div>` : ''}
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="box">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Patient Record</span>
            <strong style="font-size: 15px; color: #0f172a;">${patName}</strong>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              ${profile.bloodGroup ? `Blood: ${profile.bloodGroup} · ` : ''}
              ${profile.age ? `Age: ${profile.age} yrs` : ''}
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Attending Physician</span>
            <strong style="font-size: 15px; color: #0f172a;">${docName}</strong>
            <div style="font-size: 12px; color: #00A896; font-weight: 600;">${deptName}</div>
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
    link.download = `Curix-Prescription-Rx${viewingRx.id || 'Slip'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!viewingRx) return;
    const activeItems = extractItems(viewingRx).map(normalizeItem).filter(Boolean);

    const docName = getDoctorName(viewingRx);
    const patName = profile.firstName ? `${profile.firstName} ${profile.lastName}` : (viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`);
    const deptName = viewingRx.departmentName || viewingRx.department?.name || viewingRx.doctorSpecialty || viewingRx.specialty || 'General Medicine';

    const rowsHtml = activeItems.map((m, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${m.name}</td>
        <td style="padding: 10px; color: #00A896; font-weight: bold;">${m.dosage}</td>
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
          .header { border-bottom: 2px solid #00A896; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: 900; color: #0A1C35; margin: 0; }
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
            <div style="font-size: 14px; font-weight: bold; color: #00A896;">Rx ID: #${viewingRx.id || 'N/A'}</div>
            ${viewingRx.appointmentId ? `<div style="font-size: 11px; font-family: monospace; color: #64748b; margin-top: 2px;">Consultation Ref: #${viewingRx.appointmentId}</div>` : ''}
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Date: ${viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="box">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Patient Record</span>
            <strong style="font-size: 15px; color: #0f172a;">${patName}</strong>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              ${profile.bloodGroup ? `Blood: ${profile.bloodGroup} · ` : ''}
              ${profile.age ? `Age: ${profile.age} yrs` : ''}
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block;">Attending Physician</span>
            <strong style="font-size: 15px; color: #0f172a;">${docName}</strong>
            <div style="font-size: 12px; color: #00A896; font-weight: 600;">${deptName}</div>
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
            <div style="font-size: 10px; text-transform: uppercase; text-align: center; margin-top: 4px;">Medical Officer Seal</div>
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

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-[#0A1C35] flex font-sans selection:bg-[#00A896] selection:text-white">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden lg:flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Header */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#079181] text-white flex items-center justify-center font-black shadow-md shadow-[#00A896]/25">
              C
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#0A1C35] block">CURIX</span>
              <span className="text-[10px] text-[#00A896] font-extrabold uppercase tracking-wider block">Patient Portal</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="p-4 space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-3 block mb-2">Patient Services</span>
            {[
              { id: 'book', label: 'Find & Book', icon: Stethoscope },
              { id: 'appointments', label: 'My Consultations', icon: Calendar, count: myAppointments.length },
              { id: 'prescriptions', label: 'Digital Rx Vault', icon: FileText, count: myPrescriptions.length },
              { id: 'profile', label: 'Health Chart', icon: User }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00A896] to-[#079181] text-white shadow-lg shadow-[#00A896]/25'
                      : 'text-slate-600 hover:bg-[#E6F8F5]/80 hover:text-[#00A896]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="truncate mr-2">
            <span className="text-xs font-bold text-[#0A1C35] block truncate">
              {profile.firstName ? `${profile.firstName} ${profile.lastName}` : user?.email}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block">Verified Patient</span>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* 2. CENTER CONTENT & TOP HEADER BAR */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search physicians, departments, or records..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F8FB] border border-slate-200/90 rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllPatientData}
              disabled={isSyncing}
              title="Sync Data"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#E6F8F5] to-teal-100/60 hover:from-teal-100/80 hover:to-teal-200/60 text-[#00A896] text-xs font-extrabold transition shadow-2xs cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>Sync Node</span>
            </button>
          </div>
        </header>

        {/* MOBILE HORIZONTAL TABS */}
        <div className="flex lg:hidden overflow-x-auto gap-2 p-4 bg-white border-b border-slate-200">
          {[
            { id: 'book', label: 'Find Doctors' },
            { id: 'appointments', label: 'Consultations' },
            { id: 'prescriptions', label: 'Rx Vault' },
            { id: 'profile', label: 'Health Chart' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-[#00A896] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* WORKSPACE CONTENT AREA WITH RIGHT-HAND WIDGETS */}
        <div className="flex-1 p-6 sm:p-8 grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* Main Content Column (Span 3) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Notifications */}
            {successNotice && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#00A896] shrink-0" />
                  <span>{successNotice}</span>
                </div>
                <button onClick={() => setSuccessNotice('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer"><X size={14} /></button>
              </div>
            )}

            {errorNotice && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
                <button onClick={() => setErrorNotice('')} className="text-rose-700 hover:text-rose-900 cursor-pointer"><X size={14} /></button>
              </div>
            )}

            {/* TAB 1: FIND & BOOK DOCTORS */}
            {activeTab === 'book' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">CURIX CLINICAL NETWORK</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C35] tracking-tight">Find & Book a Physician</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Select a medical specialty, choose your preferred physician, and reserve an appointment slot.</p>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search physician by name or clinical specialty..."
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs focus:outline-none focus:border-[#00A896] shadow-2xs"
                    />
                  </div>
                  <div className="sm:w-60">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-bold text-[#0A1C35] focus:outline-none focus:border-[#00A896] shadow-2xs"
                    >
                      <option value="ALL">All Departments ({departments.length})</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DOCTORS GRID */}
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDoctors.map((doc) => {
                      const docName = getDoctorName(doc);
                      return (
                        <div 
                          key={doc.id} 
                          className="relative p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-[#00A896]/50 transition-all duration-400 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                        >
                          {/* Top Animated Glowing Accent Line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A896] via-[#0BC2A8] to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Shimmer Light Sweep on Hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

                          <div>
                            {/* Card Header: 3D Doctor Avatar with Emoji + Verified Badge */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3.5">
                                <div className="relative">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-100 group-hover:border-[#00A896]/40 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105">
                                    <img
                                      src={getDoctor3dImage(doc)}
                                      alt={docName}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                  {/* 3D Gender Emoji Badge */}
                                  <span className="absolute -bottom-1 -right-1 text-xs bg-white/95 backdrop-blur-xs rounded-full px-1.5 py-0.5 shadow-xs border border-slate-100 flex items-center justify-center">
                                    {getDoctor3dEmoji(doc)}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-base font-extrabold text-[#0A1C35] group-hover:text-[#00A896] transition-colors truncate">
                                    {docName}
                                  </h4>
                                  <span className="text-xs text-[#00A896] font-bold block mt-0.5 truncate">
                                    {doc.specialty || doc.departmentName || 'General Practitioner'}
                                  </span>
                                </div>
                              </div>

                              {/* Verified Specialist Badge */}
                              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F8F5] text-[#00A896] text-[10px] font-extrabold shadow-2xs shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                                </span>
                                <span>Verified</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 font-medium">
                              {doc.qualification || 'MBBS, MD'} · {doc.experienceYears || 5} years practice
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
                              <span className="text-base font-black text-[#00A896] font-mono">
                                {formatCurrency(doc.consultationFee, '50.00')}
                              </span>
                            </div>

                            <button
                              onClick={() => handleOpenBooking(doc)}
                              className="px-5 py-2.5 rounded-xl btn-curix-primary text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00A896]/20 active:scale-95"
                            >
                              <Calendar size={13} />
                              <span>Book Slot</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/85 shadow-sm">
                    <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-[#0A1C35]">No physicians match your filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try selecting another department or clearing search parameters.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MY APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0A1C35] tracking-tight">My Consultations</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">History of booked hospital appointments and consultation status.</p>
                  </div>
                  <button
                    onClick={fetchMyAppointments}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Refresh Visits
                  </button>
                </div>

                {myAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {myAppointments.map((appt) => {
                      const docName = getDoctorName(appt);
                      const isCompleted = appt.status === 'COMPLETED';
                      const isCancelled = appt.status === 'CANCELLED';
                      const isPending = !isCompleted && !isCancelled;

                      return (
                        <div key={appt.id} className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCompleted ? 'bg-emerald-50 text-emerald-700' :
                              isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-[#E6F8F5] text-[#00A896]'
                            }`}>
                              <Stethoscope size={18} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-extrabold text-[#0A1C35]">{docName}</h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800' :
                                  isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-[#E6F8F5] text-[#00A896]'
                                }`}>
                                  {appt.status}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 font-medium mt-1">
                                {appt.doctor?.specialty || appt.specialty || 'Specialist'} · Fee: <strong className="font-mono text-[#0A1C35]">${appt.consultationFee || appt.doctor?.consultationFee || '50.00'}</strong>
                              </p>

                              {appt.reasonForVisit || appt.reason ? (
                                <p className="text-xs text-slate-600 mt-1.5 italic">"{appt.reasonForVisit || appt.reason}"</p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="sm:text-right">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Appointment Slot</span>
                              <span className="text-xs font-black text-[#0A1C35] font-mono block mt-0.5">
                                {appt.appointmentDate} · {String(appt.startTime || appt.appointmentTime || '').slice(0, 5)}
                              </span>
                            </div>

                            {isPending && (
                              <button
                                onClick={() => setCancellingAppt(appt)}
                                className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}

                            {isCompleted && (
                              <button
                                onClick={() => handleViewAppointmentPrescription(appt)}
                                disabled={loadingApptRxId === appt.id}
                                className="px-4 py-2 rounded-xl bg-[#00A896] hover:bg-[#079181] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                                title="Open Official Prescription Slip"
                              >
                                {loadingApptRxId === appt.id ? (
                                  <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Loading Slip...</span>
                                  </>
                                ) : (
                                  <>
                                    <FileText size={13} />
                                    <span>View Prescription</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/85 shadow-sm">
                    <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-[#0A1C35]">No consultations booked</p>
                    <p className="text-xs text-slate-400 mt-1">Switch to "Find & Book Doctor" to reserve your first slot.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DIGITAL RX VAULT */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0A1C35] tracking-tight">Digital Prescription Vault</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Official medical prescriptions issued by your attending physicians.</p>
                  </div>
                  <button
                    onClick={fetchMyPrescriptions}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Refresh Vault
                  </button>
                </div>

                {myPrescriptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {myPrescriptions.map((rx) => {
                      const itemsCount = extractItems(rx).length;
                      return (
                        <div key={rx.id} className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-10 h-10 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center font-bold">
                                <FileText size={18} />
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 block">
                                  Rx-ID: #{rx.id}
                                </span>
                                {rx.appointmentId && (
                                  <span className="text-[10px] font-mono font-semibold text-slate-400 block mt-1">
                                    Ref: #{rx.appointmentId}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis</span>
                            <h4 className="text-sm font-extrabold text-[#0A1C35] mt-0.5">{rx.diagnosis || 'Clinical Consultation'}</h4>

                            <div className="mt-2 text-xs text-slate-600 font-medium flex items-center gap-1.5">
                              <Stethoscope size={13} className="text-[#00A896]" />
                              <span>{getDoctorName(rx)}</span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1 font-medium">
                              {itemsCount} medication{itemsCount === 1 ? '' : 's'} prescribed · Issued {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : 'Recent'}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Official Record</span>
                            <button
                              onClick={() => handleOpenViewingRx(rx)}
                              className="px-4 py-2 rounded-xl bg-[#00A896] hover:bg-[#079181] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText size={13} />
                              <span>View / Download Slip</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/85 shadow-sm">
                    <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-[#0A1C35]">No prescriptions found</p>
                    <p className="text-xs text-slate-400 mt-1">Prescriptions issued by doctors after consultations will appear here automatically.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PERSONAL HEALTH CHART */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0A1C35] tracking-tight">Personal Health Chart</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Maintain your emergency contact, blood group, and demographic vitals.</p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/85 shadow-sm">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 000-0000"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">Blood Group</label>
                        <select
                          value={profile.bloodGroup}
                          onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-bold"
                        >
                          <option value="">-- Select Blood Group --</option>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">Age</label>
                        <input
                          type="number"
                          min={0}
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A1C35] mb-1">Gender</label>
                        <select
                          value={profile.gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-bold"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1C35] mb-1">Residential Address</label>
                      <textarea
                        rows={2}
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-2xl text-xs resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {profileSaving ? 'Saving...' : 'Update Health Chart'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>

          {/* Right-Hand Column: Calendar & Available Physicians Widget */}
          <div className="space-y-6">
            
            {/* Interactive Calendar Widget */}
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

            {/* Available Physicians Widget - ALL 14 FACULTY SPECIALISTS */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-[#0A1C35] tracking-wider">Available Physicians</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{allAvailableDoctors.length} Hospital Specialists</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="text-[11px] text-[#00A896] hover:text-[#079181] font-bold cursor-pointer hover:underline"
                >
                  Book Slot &rarr;
                </button>
              </div>

              {/* Scrollable List of ALL Doctors */}
              <div className="max-h-[390px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100">
                {allAvailableDoctors.map((doc, idx) => {
                  const name = getDoctorName(doc);
                  const initials = name.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';
                  const specialty = doc.specialty || doc.specialization || doc.departmentName || 'Specialist';
                  return (
                    <div 
                      key={doc.id || `doc-${idx}`} 
                      onClick={() => handleOpenBooking(doc)}
                      className="pt-2 first:pt-0 flex items-center justify-between group cursor-pointer hover:bg-[#E6F8F5]/50 -mx-1.5 px-2 py-1.5 rounded-2xl transition-all"
                      title={`Click to book appointment with ${name}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full p-0.5 bg-slate-50 border border-slate-200 group-hover:border-[#00A896]/50 shadow-2xs overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                            <img
                              src={getDoctor3dImage(doc)}
                              alt={name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-[10px] bg-white rounded-full px-1 shadow-2xs border border-slate-100 flex items-center justify-center">
                            {getDoctor3dEmoji(doc)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#0A1C35] group-hover:text-[#00A896] block truncate transition-colors max-w-[135px]">{name}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[135px]">{specialty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-extrabold text-[#00A896] opacity-0 group-hover:opacity-100 transition-opacity">Book</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title="Available for consultation" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: BOOKING & SLOT SELECTION */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button onClick={() => setSelectedDoctor(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={18} /></button>

            <span className="text-[10px] font-black text-[#00A896] tracking-widest uppercase block mb-1">SLOT RESERVATION</span>
            <h3 className="text-xl font-black text-[#0A1C35] mb-1">Book with {getDoctorName(selectedDoctor)}</h3>
            <p className="text-xs text-slate-500 mb-6">{selectedDoctor.specialty} · Fee: {formatCurrency(selectedDoctor.consultationFee, '50.00')}</p>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Consultation Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-bold text-[#0A1C35]"
                />
              </div>

              {bookingDate && (
                <div>
                  <label className="block text-xs font-bold text-[#0A1C35] mb-2">Select Available Consultation Slot *</label>
                  {slotsLoading ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-bold">Checking physician calendar slots...</div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const slotTime = typeof slot === 'string' ? slot : slot.time || slot.startTime;
                        const isSelected = selectedSlot === slotTime;
                        return (
                          <button
                            key={slotTime}
                            type="button"
                            onClick={() => setSelectedSlot(slotTime)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#00A896] text-white shadow-md'
                                : 'bg-[#E6F8F5] text-[#00A896] hover:bg-[#d5f5ee]'
                            }`}
                          >
                            {slotTime?.slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                      No open slots on this date. Please pick another working day.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Reason for Visit / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Describe symptoms, concerns, or checkup reason..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedDoctor(null)} className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={!selectedSlot || isBookingSubmitting} className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full text-xs font-bold shadow-md cursor-pointer disabled:opacity-50">Confirm Consultation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL APPOINTMENT */}
      {cancellingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-black text-[#0A1C35] mb-2">Cancel Consultation</h3>
            <p className="text-xs text-slate-500 mb-6">Are you sure you want to cancel consultation #{cancellingAppt.id}?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A1C35] mb-1">Cancellation Reason</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-bold"
                >
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Feeling Better">Feeling Better / Resolved</option>
                  <option value="Doctor Reschedule Request">Doctor Reschedule</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter reason..."
                  value={customCancelText}
                  onChange={(e) => setCustomCancelText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCancellingAppt(null)} className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold cursor-pointer">Keep Visit</button>
                <button type="button" disabled={cancelSaving} onClick={handleConfirmCancel} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-md cursor-pointer">Confirm Cancellation</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW & DOWNLOAD DIGITAL PRESCRIPTION */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <button onClick={() => setViewingRx(null)} className="no-print absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={18} /></button>

            <div className="border-b-2 border-[#00A896] pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-[#0A1C35]">CURIX HEALTHCARE SYSTEM</h1>
                <p className="text-xs text-slate-500">Outpatient Department (OPD) · Clinical Prescription</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#00A896] block">Rx ID: #{viewingRx.id}</span>
                {viewingRx.appointmentId && (
                  <span className="text-[11px] font-mono font-semibold text-slate-500 block">Consultation Ref: #{viewingRx.appointmentId}</span>
                )}
                <span className="text-xs text-slate-500">Date: {viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#E6F8F5] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Record</span>
                <strong className="text-sm font-extrabold text-[#0A1C35] block mt-0.5">
                  {profile.firstName ? `${profile.firstName} ${profile.lastName}` : (viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`)}
                </strong>
                <span className="text-slate-600">{profile.bloodGroup ? `Blood: ${profile.bloodGroup} · ` : ''}{profile.age ? `Age: ${profile.age} yrs` : ''}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attending Physician</span>
                <strong className="text-sm font-extrabold text-[#0A1C35] block mt-0.5">
                  {viewingRx.doctorName || viewingRx.doctor?.fullName || viewingRx.doctor?.name || 'Attending Physician'}
                </strong>
                <span className="text-[#00A896] font-bold">{viewingRx.departmentName || viewingRx.department?.name || viewingRx.doctor?.specialty || 'General Medicine'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Clinical Diagnosis</span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-[#0A1C35]">
                {viewingRx.diagnosis || 'Routine General Consultation'}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">℞ Prescribed Medications</span>
              <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-3">#</th>
                      <th className="p-3">Medication</th>
                      <th className="p-3">Dosage / Strength</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const items = extractItems(viewingRx).map(normalizeItem).filter(Boolean);
                      if (items.length === 0) {
                        return (
                          <tr><td colSpan="6" className="p-6 text-center text-slate-400">{loadingRxDetails ? 'Loading medication details...' : 'No line-item medications recorded.'}</td></tr>
                        );
                      }
                      return items.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-extrabold text-[#0A1C35]">{m.name}</td>
                          <td className="p-3 font-bold text-[#00A896]">{m.dosage}</td>
                          <td className="p-3 text-slate-600">{m.frequency}</td>
                          <td className="p-3 text-slate-600">{m.duration}</td>
                          <td className="p-3 italic text-slate-500">{m.instructions}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {viewingRx.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Doctor's Notes & Advice</span>
                <p className="font-medium text-slate-700">{viewingRx.notes}</p>
              </div>
            )}

            <div className="no-print pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setViewingRx(null)} className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold cursor-pointer">Close</button>
              <button type="button" onClick={handleDownloadSlip} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs">
                <Download size={14} className="text-[#00A896]" />
                <span>Download Slip</span>
              </button>
              <button type="button" onClick={handlePrint} className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer">
                <Printer size={14} />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PENDING PRESCRIPTION NOTICE */}
      {pendingRxNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0A1C35]">Prescription Pending Finalization</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {pendingRxNotice.doctorName} has not published a finalized digital prescription slip for Consultation <span className="font-mono font-bold text-[#0A1C35]">#{pendingRxNotice.appointmentId}</span> yet.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-bold text-[#0A1C35]">{pendingRxNotice.doctorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Consultation Date:</span>
                <span className="font-bold text-[#0A1C35]">
                  {pendingRxNotice.date} {pendingRxNotice.time ? `· ${String(pendingRxNotice.time).slice(0, 5)}` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vault Status:</span>
                <span className="font-semibold text-amber-600">Awaiting Physician Upload</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPendingRxNotice(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPendingRxNotice(null);
                  setActiveTab('prescriptions');
                }}
                className="px-4 py-2 bg-[#0A1C35] hover:bg-[#132d4e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Go to Rx Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}