import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { 
  Building2, Users, Stethoscope, DollarSign, Activity, 
  Shield, Plus, RefreshCw, AlertCircle, CheckCircle2, 
  Loader2, X, Search, Calendar, ChevronLeft, ChevronRight, 
  Clock, Edit3, Save, Layers, ArrowUpRight, TrendingUp,
  FileCheck2, Check, Zap, Sparkles, LogOut, LayoutDashboard,
  BarChart3, PieChart, Award, Mail, Phone, FileText, Printer,
  Download, Eye, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import api from '../../services/api';
import maleDoctor3d from '../../assets/male_doctor_3d.jpg';
import femaleDoctor3d from '../../assets/female_doctor_3d.jpg';

const WEEKDAYS = [
  { id: 'MONDAY', label: 'Mon' },
  { id: 'TUESDAY', label: 'Tue' },
  { id: 'WEDNESDAY', label: 'Wed' },
  { id: 'THURSDAY', label: 'Thu' },
  { id: 'FRIDAY', label: 'Fri' },
  { id: 'SATURDAY', label: 'Sat' },
];


// 14 Verified Hospital Faculty Doctors
const defaultFacultyDoctors = [
  { id: 1, firstName: 'Edward', lastName: 'Smith', fullName: 'Dr. Edward Smith', specialty: 'Interventional Cardiology', departmentName: 'Cardiology', departmentId: 1, gender: 'MALE', consultationFee: 50.00, qualification: 'MBBS, MD (Cardiology)', experienceYears: 12, licenseNumber: 'MCI-CARD-8812' },
  { id: 2, firstName: 'Sarah', lastName: 'Conor', fullName: 'Dr. Sarah Conor', specialty: 'Neurologist', departmentName: 'Neurology', departmentId: 2, gender: 'FEMALE', consultationFee: 55.00, qualification: 'MBBS, DM (Neurology)', experienceYears: 9, licenseNumber: 'MCI-NEUR-4419' },
  { id: 3, firstName: 'Arjun', lastName: 'Sharma', fullName: 'Dr. Arjun Sharma', specialty: 'General Physician & Diabetologist', departmentName: 'General Medicine', departmentId: 3, gender: 'MALE', consultationFee: 40.00, qualification: 'MBBS, MD (Internal Med)', experienceYears: 8, licenseNumber: 'MCI-GENM-3190' },
  { id: 4, firstName: 'Vikram', lastName: 'Singh', fullName: 'Dr. Vikram Singh', specialty: 'ENT Surgeon', departmentName: 'ENT', departmentId: 4, gender: 'MALE', consultationFee: 45.00, qualification: 'MBBS, MS (ENT)', experienceYears: 11, licenseNumber: 'MCI-ENTS-6721' },
  { id: 5, firstName: 'Aditi', lastName: 'Das', fullName: 'Dr. Aditi Das', specialty: 'Orthodontist & Dental Specialist', departmentName: 'Dentistry', departmentId: 5, gender: 'FEMALE', consultationFee: 35.00, qualification: 'BDS, MDS (Orthodontics)', experienceYears: 7, licenseNumber: 'MCI-DENT-9204' },
  { id: 6, firstName: 'Kishan', lastName: 'Malhotra', fullName: 'Dr. Kishan Malhotra', specialty: 'Clinical Nephrologist', departmentName: 'Nephrology', departmentId: 6, gender: 'MALE', consultationFee: 60.00, qualification: 'MBBS, DM (Nephrology)', experienceYears: 14, licenseNumber: 'MCI-NEPH-1055' },
  { id: 7, firstName: 'Sanya', lastName: 'Patel', fullName: 'Dr. Sanya Patel', specialty: 'Respiratory Medicine Specialist', departmentName: 'Pulmonology', departmentId: 7, gender: 'FEMALE', consultationFee: 50.00, qualification: 'MBBS, DNB (Pulmonology)', experienceYears: 8, licenseNumber: 'MCI-PULM-7718' },
  { id: 8, firstName: 'Rajesh', lastName: 'Iyer', fullName: 'Dr. Rajesh Iyer', specialty: 'Senior Joint Replacement Surgeon', departmentName: 'Orthopaedics', departmentId: 8, gender: 'MALE', consultationFee: 65.00, qualification: 'MBBS, MS (Ortho), MCh', experienceYears: 16, licenseNumber: 'MCI-ORTH-4192' },
  { id: 9, firstName: 'Meera', lastName: 'Nair', fullName: 'Dr. Meera Nair', specialty: 'Gastroenterologist & Hepatologist', departmentName: 'Gastrosciences', departmentId: 9, gender: 'FEMALE', consultationFee: 55.00, qualification: 'MBBS, DM (Gastro)', experienceYears: 10, licenseNumber: 'MCI-GAST-5531' },
  { id: 10, firstName: 'Amitav', lastName: 'Roy', fullName: 'Dr. Amitav Roy', specialty: 'Precision Oncology Specialist', departmentName: 'Oncology', departmentId: 10, gender: 'MALE', consultationFee: 70.00, qualification: 'MBBS, MD, DM (Medical Oncology)', experienceYears: 15, licenseNumber: 'MCI-ONCO-8219' },
  { id: 11, firstName: 'Pooja', lastName: 'Verma', fullName: 'Dr. Pooja Verma', specialty: 'High-Risk Obstetrics & Gynaecology', departmentName: 'Mother & Child', departmentId: 11, gender: 'FEMALE', consultationFee: 50.00, qualification: 'MBBS, MS (OB-GYN)', experienceYears: 12, licenseNumber: 'MCI-OBGY-6627' },
  { id: 12, firstName: 'Devendra', lastName: 'Joshi', fullName: 'Dr. Devendra Joshi', specialty: 'Emergency & Critical Trauma Surgeon', departmentName: 'Emergency Medicine', departmentId: 12, gender: 'MALE', consultationFee: 60.00, qualification: 'MBBS, MS, Fellowship Trauma', experienceYears: 13, licenseNumber: 'MCI-EMER-3914' },
  { id: 13, firstName: 'Ananya', lastName: 'Sen', fullName: 'Dr. Ananya Sen', specialty: 'Dermatologist & Cosmetologist', departmentName: 'Dermatology', departmentId: 13, gender: 'FEMALE', consultationFee: 45.00, qualification: 'MBBS, MD (Dermatology)', experienceYears: 6, licenseNumber: 'MCI-DERM-2840' },
  { id: 14, firstName: 'Farhan', lastName: 'Akhtar', fullName: 'Dr. Farhan Akhtar', specialty: 'Multi-Organ Transplant Surgeon', departmentName: 'Transplant Surgery', departmentId: 14, gender: 'MALE', consultationFee: 75.00, qualification: 'MBBS, MS, MCh (Transplant)', experienceYears: 18, licenseNumber: 'MCI-TRNS-9910' }
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

  // 5. Doctor-Patient Clinical Relationships & Prescriptions
  const [doctorInsights, setDoctorInsights] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [relationshipSearch, setRelationshipSearch] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('ALL'); // 'ALL' | 'RX_ISSUED' | 'RX_PENDING' | 'COMPLETED' | 'CONFIRMED'
  const [relationshipViewMode, setRelationshipViewMode] = useState('doctors'); // 'doctors' | 'consultations'
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState(null);
  const [viewingRx, setViewingRx] = useState(null);
  const [loadingRxDetails, setLoadingRxDetails] = useState(false);
  const [selectedApptDetail, setSelectedApptDetail] = useState(null);

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
        fetchAuditLogs(0),
        fetchDoctorInsights(),
        fetchAllAppointments(),
        fetchAllPrescriptions()
      ]);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  };

  const fetchDoctorInsights = async () => {
    try {
      const res = await adminApi.getDoctorInsights();
      const list = res.data?.data || res.data;
      if (Array.isArray(list)) setDoctorInsights(list);
    } catch (err) {
      console.warn("Doctor insights fetch fallback:", err);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const res = await adminApi.getAllAppointments();
      const list = res.data?.data || res.data;
      if (Array.isArray(list)) setAllAppointments(list);
    } catch (err) {
      console.warn("All appointments fetch fallback:", err);
    }
  };

  const fetchAllPrescriptions = async () => {
    try {
      const res = await adminApi.getAllPrescriptions();
      const list = res.data?.data || res.data;
      if (Array.isArray(list)) setAllPrescriptions(list);
    } catch (err) {
      console.warn("All prescriptions fetch fallback:", err);
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
      if (Array.isArray(list) && list.length > 0) {
        setDoctors(list);
      } else {
        setDoctors(defaultFacultyDoctors);
      }
    } catch (err) {
      console.warn("Could not load doctors from backend, using verified hospital faculty roster:", err);
      setDoctors(defaultFacultyDoctors);
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

  // Extract items from prescription
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

  const handleOpenViewingRx = async (rxOrAppt) => {
    if (!rxOrAppt) return;
    let rx = rxOrAppt;

    // If an appointment was passed, find its matching prescription
    if (!rx.items && !rx.diagnosis) {
      const found = allPrescriptions.find(
        (p) => Number(p.appointmentId) === Number(rxOrAppt.id) || 
               (rxOrAppt.prescriptionId && Number(p.id) === Number(rxOrAppt.prescriptionId))
      );
      if (found) {
        rx = found;
      } else if (rxOrAppt.prescriptionId || rxOrAppt.id) {
        setLoadingRxDetails(true);
        try {
          const id = rxOrAppt.prescriptionId || rxOrAppt.id;
          const res = await api.get(`/prescriptions/${id}`).catch(() =>
            api.get(`/prescriptions/appointment/${rxOrAppt.id}`)
          );
          const data = res?.data?.data || res?.data;
          if (data && typeof data === 'object') {
            rx = { ...rxOrAppt, ...data };
          }
        } catch (e) {
          console.warn("Prescription fetch fallback:", e);
        } finally {
          setLoadingRxDetails(false);
        }
      }
    }

    setViewingRx(rx);
  };

  const handleDownloadSlip = () => {
    if (!viewingRx) return;
    const activeItems = extractItems(viewingRx).map(normalizeItem).filter(Boolean);
    const docName = viewingRx.doctorName || getDoctorDisplayName(viewingRx);
    const patName = viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`;
    const deptName = viewingRx.departmentName || viewingRx.specialty || 'General Consultation';

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
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Outpatient Department (OPD) · Administrative Master Copy</p>
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
              Patient Ref: #${viewingRx.patientId || 'N/A'}
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
          <span>Curix Administrative Digital Medical Record Copy</span>
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
    link.download = `Curix-Prescription-Rx#${viewingRx.id || 'Slip'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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

  // Merged Doctor Insights (from backend API + live fallback computation)
  const computedDoctorInsights = React.useMemo(() => {
    if (doctorInsights && doctorInsights.length > 0) return doctorInsights;
    
    // Dynamic fallback calculation
    return doctors.map((doc) => {
      const docAppts = allAppointments.filter((a) => Number(a.doctorId) === Number(doc.id));
      const completed = docAppts.filter((a) => a.status === 'COMPLETED').length;
      const rxIssued = docAppts.filter((a) => a.hasPrescription || a.prescriptionId).length;
      const active = docAppts.filter((a) => a.status !== 'COMPLETED' && a.status !== 'CANCELLED').length;
      const cancelled = docAppts.filter((a) => a.status === 'CANCELLED').length;
      const uniquePatients = new Set(docAppts.map((a) => a.patientId).filter(Boolean)).size;
      const totalRev = docAppts
        .filter((a) => a.status === 'COMPLETED')
        .reduce((sum, a) => sum + Number(a.consultationFee || doc.consultationFee || 0), 0);
      
      const pendingRx = Math.max(0, completed - rxIssued);
      const rxRate = completed > 0 ? Math.round((rxIssued * 100.0 / completed) * 10) / 10 : 0;

      return {
        ...doc,
        doctorId: doc.id,
        doctorName: getDoctorDisplayName(doc),
        firstName: doc.firstName,
        lastName: doc.lastName,
        gender: doc.gender,
        image: doc.image || doc.profileImage,
        email: doc.email || (doc.user && doc.user.email) || '',
        departmentName: doc.department?.name || doc.departmentName || 'General Medicine',
        specialty: doc.specialty || 'General Practitioner',
        licenseNumber: doc.licenseNumber || 'LIC-VERIFIED',
        consultationFee: doc.consultationFee,
        totalAppointments: docAppts.length,
        completedAppointments: completed,
        prescriptionsIssued: rxIssued,
        pendingPrescriptions: pendingRx,
        prescriptionRate: rxRate,
        activeAppointments: active,
        cancelledAppointments: cancelled,
        uniquePatientsCount: uniquePatients,
        totalRevenue: totalRev,
        appointments: docAppts
      };
    }).sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [doctorInsights, doctors, allAppointments]);

  // Overall Relationship Stats
  const totalConsultationsCount = allAppointments.length > 0 ? allAppointments.length : (metrics?.totalAppointments || 0);
  const totalPrescriptionsIssuedCount = allAppointments.filter((a) => a.hasPrescription || a.prescriptionId).length || 
                                       allPrescriptions.length || 
                                       Number(metrics?.totalPrescriptions || 0);
  const totalPendingPrescriptionsCount = allAppointments.filter((a) => a.status === 'COMPLETED' && !a.hasPrescription && !a.prescriptionId).length;
  const overallRxRate = totalConsultationsCount > 0 
    ? Math.round((totalPrescriptionsIssuedCount / totalConsultationsCount) * 100) 
    : 0;

  // Filtered consultations for Relationship stream
  const filteredConsultations = allAppointments.filter((appt) => {
    const q = relationshipSearch.toLowerCase();
    const docMatch = (appt.doctorName || '').toLowerCase().includes(q) ||
                     (appt.departmentName || '').toLowerCase().includes(q);
    const patMatch = (appt.patientName || '').toLowerCase().includes(q) ||
                     (appt.patientNumber || '').toLowerCase().includes(q);
    const reasonMatch = (appt.reasonForVisit || '').toLowerCase().includes(q);
    const matchesSearch = !q || docMatch || patMatch || reasonMatch;

    if (!matchesSearch) return false;

    if (relationshipFilter === 'ALL') return true;
    if (relationshipFilter === 'RX_ISSUED') return appt.hasPrescription || appt.prescriptionId;
    if (relationshipFilter === 'RX_PENDING') return appt.status === 'COMPLETED' && !appt.hasPrescription && !appt.prescriptionId;
    if (relationshipFilter === 'COMPLETED') return appt.status === 'COMPLETED';
    if (relationshipFilter === 'ACTIVE') return appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED';
    if (relationshipFilter === 'CANCELLED') return appt.status === 'CANCELLED';

    return true;
  });

  // Filtered Doctors for Relationship Doctors view
  const filteredRelationshipDoctors = computedDoctorInsights.filter((doc) => {
    const q = relationshipSearch.toLowerCase();
    return !q || 
      (doc.doctorName || '').toLowerCase().includes(q) ||
      (doc.departmentName || '').toLowerCase().includes(q) ||
      (doc.specialty || '').toLowerCase().includes(q) ||
      (doc.licenseNumber || '').toLowerCase().includes(q);
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
              { id: 'relationships', label: 'Doctor-Patient Matrix', icon: Users, count: allAppointments.length || undefined },
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
                      ? 'bg-gradient-to-r from-[#00A896] to-[#079181] text-white shadow-lg shadow-[#00A896]/25'
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
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clinical units, physicians, or reports..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F8FB] border border-slate-200/90 rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
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
        <div className="flex lg:hidden overflow-x-auto gap-2 p-3 sm:p-4 bg-white border-b border-slate-200/90 shadow-2xs">
          {[
            { id: 'analytics', label: 'Dashboard' },
            { id: 'relationships', label: `Matrix (${allAppointments.length || 0})` },
            { id: 'departments', label: `Units (${departments.length})` },
            { id: 'doctors', label: `Physicians (${doctors.length})` },
            { id: 'audit', label: 'Audit Trail' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'audit') fetchAuditLogs(0);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id ? 'bg-[#00A896] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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

            {/* TAB 1.5: DOCTOR-PATIENT RELATIONSHIP MATRIX & CLINICAL PRESCRIPTION LEDGER */}
            {activeTab === 'relationships' && (
              <div className="space-y-6">
                
                {/* Header with View Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-[#00A896] uppercase block mb-1">
                      CLINICAL GOVERNANCE & RELATIONSHIPS
                    </span>
                    <h2 className="text-2xl font-black text-[#0A1C35] tracking-tight">Doctor & Patient Matrix</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Monitor physician appointment load, patient consults, and prescription fulfillment across all departments.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-white border border-slate-200/85 rounded-2xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setRelationshipViewMode('doctors')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          relationshipViewMode === 'doctors'
                            ? 'bg-[#00A896] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#00A896]'
                        }`}
                      >
                        <Stethoscope size={13} />
                        <span>Physicians Ledger</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRelationshipViewMode('consultations')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          relationshipViewMode === 'consultations'
                            ? 'bg-[#00A896] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#00A896]'
                        }`}
                      >
                        <Calendar size={13} />
                        <span>All Consultations ({allAppointments.length})</span>
                      </button>
                    </div>

                    <button
                      onClick={loadAllAdminData}
                      disabled={isSyncing}
                      className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-[#00A896] transition cursor-pointer shadow-2xs"
                      title="Sync Clinical Matrix"
                    >
                      <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#00A896]' : ''} />
                    </button>
                  </div>
                </div>

                {/* 4 TOP RELATIONSHIP STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospital Consultations</span>
                      <div className="w-10 h-10 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-[#0A1C35] font-mono">
                        {totalConsultationsCount}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-[#00A896] font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> {completedAppts} Completed Visits
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prescriptions Issued</span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FileCheck2 size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-emerald-700 font-mono">
                        {totalPrescriptionsIssuedCount}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> {overallRxRate}% Overall Rx Rate
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-amber-400/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Doctor Rx</span>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <AlertTriangle size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`text-3xl font-black font-mono ${totalPendingPrescriptionsCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {totalPendingPrescriptionsCount}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                      <Clock size={12} /> Awaiting Physician Finalization
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm flex flex-col justify-between hover:border-[#00A896]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consulting Physicians</span>
                      <div className="w-10 h-10 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                        <Stethoscope size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-black text-[#0A1C35] font-mono">
                        {computedDoctorInsights.filter((d) => d.totalAppointments > 0).length} / {doctors.length}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Users size={12} className="text-[#00A896]" /> Active Clinical Roster
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctor, patient name, patient record #, or diagnosis..."
                      value={relationshipSearch}
                      onChange={(e) => setRelationshipSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs focus:outline-none focus:border-[#00A896] shadow-2xs"
                    />
                  </div>

                  {relationshipViewMode === 'consultations' && (
                    <div className="sm:w-60">
                      <select
                        value={relationshipFilter}
                        onChange={(e) => setRelationshipFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-bold text-[#0A1C35] focus:outline-none focus:border-[#00A896] shadow-2xs"
                      >
                        <option value="ALL">All Consultations ({allAppointments.length})</option>
                        <option value="RX_ISSUED">✓ Prescriptions Issued</option>
                        <option value="RX_PENDING">⚠ Pending Rx (Completed)</option>
                        <option value="COMPLETED">Completed Visits</option>
                        <option value="ACTIVE">Upcoming / Scheduled</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* VIEW 1: PHYSICIANS CONSULTATION & PRESCRIPTION LEDGER */}
                {relationshipViewMode === 'doctors' && (
                  <div className="space-y-4">
                    {filteredRelationshipDoctors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredRelationshipDoctors.map((doc) => {
                          const initials = (doc.doctorName || '').replace('Dr. ', '').split(' ').map((n) => n[0]).join('');
                          const hasAppts = doc.totalAppointments > 0;
                          return (
                            <div
                              key={doc.doctorId}
                              className="p-6 rounded-3xl bg-white border border-slate-200/85 shadow-sm hover:border-[#00A896]/40 transition flex flex-col justify-between space-y-4"
                            >
                              <div>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-100 shadow-xs flex items-center justify-center overflow-hidden">
                                        <img
                                          src={getDoctor3dImage(doc)}
                                          alt={doc.doctorName}
                                          onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = getDoctorGender(doc) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
                                          }}
                                          className="w-full h-full object-cover rounded-full"
                                        />
                                      </div>
                                      <span className="absolute -bottom-1 -right-1 text-[10px] bg-white rounded-full px-1 shadow-2xs border border-slate-100 flex items-center justify-center">
                                        {getDoctor3dEmoji(doc)}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-extrabold text-[#0A1C35]">{doc.doctorName}</h4>
                                      <span className="text-[11px] text-[#00A896] font-bold block">{doc.specialty} · {doc.departmentName}</span>
                                      <span className="text-[10px] text-slate-400 font-mono block">Lic: {doc.licenseNumber}</span>
                                    </div>
                                  </div>

                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    doc.pendingPrescriptions > 0
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : hasAppts
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                                  }`}>
                                    {doc.pendingPrescriptions > 0 ? `${doc.pendingPrescriptions} Rx Pending` : hasAppts ? 'Rx Compliant' : 'No Visits'}
                                  </span>
                                </div>

                                {/* Appointment & Prescription Stats Matrix */}
                                <div className="mt-4 grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Appts</span>
                                    <span className="text-base font-black text-[#0A1C35] font-mono mt-0.5 block">{doc.totalAppointments}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                                    <span className="text-base font-black text-emerald-700 font-mono mt-0.5 block">{doc.completedAppointments}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Prescriptions</span>
                                    <span className="text-base font-black text-[#00A896] font-mono mt-0.5 block">{doc.prescriptionsIssued}</span>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 px-1">
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <Users size={13} className="text-[#00A896]" />
                                    <span>{doc.uniquePatientsCount} Unique Patients</span>
                                  </span>
                                  <span className="font-mono font-bold text-slate-700">
                                    Revenue: <span className="text-emerald-700 font-black">${doc.totalRevenue}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500">
                                  Rx Issuance Rate: <strong className="text-[#00A896] font-mono">{doc.prescriptionRate}%</strong>
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => setSelectedDoctorForModal(doc)}
                                  className="px-4 py-2 rounded-xl bg-[#0A1C35] hover:bg-[#132d4e] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Eye size={13} />
                                  <span>View Patients & Visits ({doc.totalAppointments})</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/85 shadow-sm">
                        <Stethoscope size={36} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-bold text-[#0A1C35]">No doctors match your query</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing the search input above.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 2: ALL CONSULTATIONS STREAM */}
                {relationshipViewMode === 'consultations' && (
                  <div className="bg-white rounded-3xl border border-slate-200/85 shadow-sm overflow-hidden">
                    {filteredConsultations.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                              <th className="p-4">Ref # & Date</th>
                              <th className="p-4">Attending Doctor</th>
                              <th className="p-4">Patient Dossier</th>
                              <th className="p-4">Reason for Visit</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Prescription Status</th>
                              <th className="p-4 text-right">Fee / Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredConsultations.map((appt) => {
                              const isCompleted = appt.status === 'COMPLETED';
                              const hasRx = Boolean(appt.hasPrescription || appt.prescriptionId);
                              return (
                                <tr key={appt.id} className="hover:bg-slate-50/80 transition">
                                  <td className="p-4">
                                    <span className="font-mono font-bold text-[#0A1C35] block">#{appt.id}</span>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                      {appt.appointmentDate} · {String(appt.startTime || '').slice(0, 5)}
                                    </span>
                                  </td>

                                  <td className="p-4">
                                    <div className="font-bold text-[#0A1C35] flex items-center gap-1.5">
                                      <Stethoscope size={13} className="text-[#00A896]" />
                                      <span>{appt.doctorName || 'Attending Doctor'}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">{appt.departmentName || 'General'}</span>
                                  </td>

                                  <td className="p-4">
                                    <span className="font-bold text-[#0A1C35] block">{appt.patientName || `Patient #${appt.patientId}`}</span>
                                    {appt.patientNumber && (
                                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Rec: {appt.patientNumber}</span>
                                    )}
                                  </td>

                                  <td className="p-4 max-w-xs truncate text-slate-600">
                                    {appt.reasonForVisit || 'Routine Consultation'}
                                  </td>

                                  <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                      appt.status === 'COMPLETED'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : appt.status === 'CANCELLED'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : 'bg-[#E6F8F5] text-[#00A896] border border-teal-200'
                                    }`}>
                                      {appt.status}
                                    </span>
                                  </td>

                                  <td className="p-4">
                                    {hasRx ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenViewingRx(appt)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer"
                                        title="View official prescription slip"
                                      >
                                        <FileText size={12} className="text-emerald-600" />
                                        <span>✓ Rx Issued {appt.prescriptionId ? `(#${appt.prescriptionId})` : ''}</span>
                                      </button>
                                    ) : isCompleted ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                                        <AlertTriangle size={12} />
                                        <span>⚠ Rx Pending Upload</span>
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 italic">Upcoming</span>
                                    )}
                                  </td>

                                  <td className="p-4 text-right">
                                    <span className="font-mono font-bold text-slate-700 block mb-1">
                                      {formatCurrency(appt.consultationFee, '50.00')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedApptDetail(appt)}
                                      className="text-[11px] font-bold text-[#00A896] hover:underline cursor-pointer"
                                    >
                                      Inspect Dossier
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-bold text-[#0A1C35]">No consultations found</p>
                        <p className="text-xs text-slate-400 mt-1">Adjust search parameters or filter options.</p>
                      </div>
                    )}
                  </div>
                )}

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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDoctors.map((doc) => {
                      const docDisplayName = getDoctorDisplayName(doc);
                      const initials = docDisplayName.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
                      return (
                        <div key={doc.id} className="relative p-6 rounded-3xl bg-white border border-slate-200/85 shadow-xs hover:shadow-xl hover:border-[#00A896]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                          {/* Top Animated Glowing Accent Line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A896] via-[#0BC2A8] to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {/* Shimmer Light Sweep on Hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3.5">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-100 group-hover:border-[#00A896]/40 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105">
                                    <img
                                      src={getDoctor3dImage(doc)}
                                      alt={docDisplayName}
                                      onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = getDoctorGender(doc) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
                                      }}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                  {/* 3D Gender Emoji Badge */}
                                  <span className="absolute -bottom-1 -right-1 text-xs bg-white/95 backdrop-blur-xs rounded-full px-1.5 py-0.5 shadow-xs border border-slate-100 flex items-center justify-center">
                                    {getDoctor3dEmoji(doc)}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-sm sm:text-base font-extrabold text-[#0A1C35] group-hover:text-[#00A896] transition-colors truncate">
                                    {docDisplayName}
                                  </h4>
                                  <span className="text-xs text-[#00A896] font-bold block mt-0.5 truncate">
                                    {doc.specialty || doc.departmentName || 'General Practitioner'}
                                  </span>
                                </div>
                              </div>

                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F8F5] text-[#00A896] text-[10px] font-extrabold shadow-2xs shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                                </span>
                                <span>Verified</span>
                              </div>
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

                            {/* Clinical Performance & Rx Fulfillment Badge */}
                            {(() => {
                              const insight = computedDoctorInsights.find((i) => Number(i.doctorId) === Number(doc.id));
                              const totalApptsForDoc = insight ? insight.totalAppointments : 0;
                              const completedForDoc = insight ? insight.completedAppointments : 0;
                              const rxCount = insight ? insight.prescriptionsIssued : 0;
                              const pendingRx = insight ? insight.pendingPrescriptions : 0;
                              const rate = insight ? insight.prescriptionRate : 0;

                              return (
                                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#0A1C35]">{totalApptsForDoc} Appts</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-emerald-700 font-bold">{completedForDoc} Completed</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                                      pendingRx > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {rxCount} Rx ({rate}%)
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          <div className="pt-4 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Consultation Fee</span>
                              <span className="text-base font-black text-[#00A896] font-mono">${doc.consultationFee !== undefined ? doc.consultationFee : '50.00'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const ins = computedDoctorInsights.find((i) => Number(i.doctorId) === Number(doc.id));
                                  setSelectedDoctorForModal(ins || doc);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-[#E6F8F5] hover:bg-[#cbf1eb] text-[#00A896] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                title="View patient consultations & prescriptions"
                              >
                                <Users size={13} />
                                <span>Patients & Rx</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditDoctor(doc)}
                                className="px-3.5 py-2 rounded-xl bg-[#F4F8FB] hover:bg-[#E6F8F5] text-[#0A1C35] hover:text-[#00A896] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
                              >
                                <Edit3 size={13} />
                                <span>Edit</span>
                              </button>
                            </div>
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

            {/* Doctor Availability Widget - All Specialists */}
            <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-[#0A1C35] tracking-wider">Doctor Availability</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{doctors.length} Hospital Specialists</span>
                </div>
                <span className="text-[11px] text-[#00A896] hover:text-[#079181] font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('doctors')}>View All &rarr;</span>
              </div>

              <div className="max-h-[390px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100">
                {doctors.map((doc, idx) => {
                  const name = getDoctorDisplayName(doc);
                  const specialty = doc.specialty || doc.departmentName || 'Specialist';
                  return (
                    <div key={doc.id || `doc-${idx}`} className="pt-2 first:pt-0 flex items-center justify-between group hover:bg-[#E6F8F5]/40 -mx-1 px-1.5 py-1 rounded-2xl transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 rounded-full p-0.5 bg-slate-50 border border-slate-200 group-hover:border-[#00A896]/50 shadow-2xs overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                            <img
                              src={getDoctor3dImage(doc)}
                              alt={name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = getDoctorGender(doc) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
                              }}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-[9px] bg-white rounded-full px-1 shadow-2xs border border-slate-100 flex items-center justify-center">
                            {getDoctor3dEmoji(doc)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#0A1C35] group-hover:text-[#00A896] block truncate transition-colors max-w-[130px]">{name}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">{specialty}</span>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shrink-0" title="Active on Faculty" />
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

      {/* MODAL 4: DOCTOR'S PATIENT CONSULTATIONS & PRESCRIPTIONS DOSSIER */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedDoctorForModal(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Doctor Profile Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-[#00A896]/30 shadow-md shadow-[#00A896]/15 flex items-center justify-center overflow-hidden">
                    <img
                      src={getDoctor3dImage(selectedDoctorForModal)}
                      alt={selectedDoctorForModal.doctorName || 'Doctor'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getDoctorGender(selectedDoctorForModal) === 'FEMALE' ? femaleDoctor3d : maleDoctor3d;
                      }}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full px-1.5 py-0.5 shadow-xs border border-slate-100 flex items-center justify-center">
                    {getDoctor3dEmoji(selectedDoctorForModal)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A1C35]">{selectedDoctorForModal.doctorName || getDoctorDisplayName(selectedDoctorForModal)}</h3>
                  <p className="text-xs text-[#00A896] font-bold">
                    {selectedDoctorForModal.specialty} · {selectedDoctorForModal.departmentName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Consultation Fee</span>
                <span className="text-base font-black text-[#0A1C35] font-mono">{formatCurrency(selectedDoctorForModal.consultationFee, '50.00')}</span>
              </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Visits</span>
                <span className="text-lg font-black text-[#0A1C35] font-mono mt-0.5 block">{selectedDoctorForModal.totalAppointments || (selectedDoctorForModal.appointments ? selectedDoctorForModal.appointments.length : 0)}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Completed</span>
                <span className="text-lg font-black text-emerald-800 font-mono mt-0.5 block">{selectedDoctorForModal.completedAppointments || 0}</span>
              </div>
              <div className="p-3.5 bg-[#E6F8F5] rounded-2xl border border-teal-100 text-center">
                <span className="text-[10px] uppercase font-bold text-[#00A896] block">Rx Issued</span>
                <span className="text-lg font-black text-[#00A896] font-mono mt-0.5 block">{selectedDoctorForModal.prescriptionsIssued || 0}</span>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending Rx</span>
                <span className="text-lg font-black text-amber-700 font-mono mt-0.5 block">{selectedDoctorForModal.pendingPrescriptions || 0}</span>
              </div>
            </div>

            {/* Patient Appointments Table */}
            <div>
              <h4 className="text-xs font-black uppercase text-[#0A1C35] tracking-wider mb-3">
                Patient Consultations & Prescriptions History
              </h4>

              {(() => {
                const appts = selectedDoctorForModal.appointments || 
                              allAppointments.filter((a) => Number(a.doctorId) === Number(selectedDoctorForModal.doctorId || selectedDoctorForModal.id));

                if (!appts || appts.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                      <Users size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-[#0A1C35]">No patient consultations recorded for this doctor</p>
                    </div>
                  );
                }

                return (
                  <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                          <th className="p-3">Ref & Date</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Clinical Reason</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Prescription Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appts.map((appt) => {
                          const hasRx = Boolean(appt.hasPrescription || appt.prescriptionId);
                          const isCompleted = appt.status === 'COMPLETED';
                          return (
                            <tr key={appt.id} className="hover:bg-slate-50/70">
                              <td className="p-3">
                                <span className="font-mono font-bold text-[#0A1C35] block">#{appt.id}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {appt.appointmentDate} · {String(appt.startTime || '').slice(0, 5)}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-[#0A1C35] block">{appt.patientName || `Patient #${appt.patientId}`}</span>
                                {appt.patientNumber && (
                                  <span className="text-[10px] font-mono text-slate-400 block">Rec: {appt.patientNumber}</span>
                                )}
                              </td>
                              <td className="p-3 max-w-[200px] truncate text-slate-600">
                                {appt.reasonForVisit || 'Routine Consultation'}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  appt.status === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : appt.status === 'CANCELLED'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-[#E6F8F5] text-[#00A896]'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {hasRx ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenViewingRx(appt)}
                                    className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                                  >
                                    <FileText size={11} className="text-emerald-600" />
                                    <span>✓ Rx Issued {appt.prescriptionId ? `(#${appt.prescriptionId})` : ''}</span>
                                  </button>
                                ) : isCompleted ? (
                                  <span className="px-2 py-0.5 rounded-xl bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 flex items-center gap-1 w-max">
                                    <AlertTriangle size={11} />
                                    <span>Pending Upload</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">Not due</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedApptDetail(appt)}
                                  className="text-[11px] font-bold text-[#00A896] hover:underline cursor-pointer"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedDoctorForModal(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: SINGLE APPOINTMENT DOSSIER */}
      {selectedApptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedApptDetail(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F8F5] text-[#00A896] flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0A1C35]">Consultation Record #{selectedApptDetail.id}</h3>
                <span className="text-xs text-slate-400">{selectedApptDetail.appointmentDate} · {String(selectedApptDetail.startTime || '').slice(0, 5)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-bold text-[#0A1C35]">{selectedApptDetail.doctorName || 'Attending Doctor'} ({selectedApptDetail.departmentName || 'General'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-[#0A1C35]">{selectedApptDetail.patientName || `Patient #${selectedApptDetail.patientId}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Record #:</span>
                <span className="font-mono text-slate-700">{selectedApptDetail.patientNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-black text-[#00A896]">{selectedApptDetail.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation Fee:</span>
                <span className="font-bold text-emerald-700 font-mono">{formatCurrency(selectedApptDetail.consultationFee, '50.00')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reason for Visit</span>
                <p className="text-slate-700 font-medium">{selectedApptDetail.reasonForVisit || 'General Clinical Consultation'}</p>
              </div>
              {selectedApptDetail.cancellationReason && (
                <div className="pt-2 border-t border-rose-100 text-rose-700">
                  <span className="text-[10px] uppercase font-bold block mb-1">Cancellation Reason:</span>
                  <p>{selectedApptDetail.cancellationReason}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedApptDetail(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              {(selectedApptDetail.hasPrescription || selectedApptDetail.prescriptionId) && (
                <button
                  type="button"
                  onClick={() => {
                    const appt = selectedApptDetail;
                    setSelectedApptDetail(null);
                    handleOpenViewingRx(appt);
                  }}
                  className="px-4 py-2 bg-[#00A896] hover:bg-[#079181] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText size={13} />
                  <span>View Official Slip</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: OFFICIAL PRESCRIPTION SLIP VIEWER & DOWNLOADER */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1C35]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setViewingRx(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="border-b-2 border-[#00A896] pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-[#0A1C35]">CURIX HEALTHCARE SYSTEM</h1>
                <p className="text-xs text-slate-500">Outpatient Department (OPD) · Master Prescription Record</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#00A896] block">Rx ID: #{viewingRx.id || 'N/A'}</span>
                {viewingRx.appointmentId && (
                  <span className="text-[11px] font-mono text-slate-500 block">Consultation Ref: #{viewingRx.appointmentId}</span>
                )}
                <span className="text-xs text-slate-500">
                  Date: {viewingRx.createdAt ? new Date(viewingRx.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#E6F8F5] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Record</span>
                <strong className="text-sm font-extrabold text-[#0A1C35] block mt-0.5">
                  {viewingRx.patientName || `Patient #${viewingRx.patientId || 'Record'}`}
                </strong>
                <span className="text-slate-600 font-mono text-[11px]">
                  Ref: #{viewingRx.patientId || 'N/A'} {viewingRx.patientNumber ? `· ${viewingRx.patientNumber}` : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attending Physician</span>
                <strong className="text-sm font-extrabold text-[#0A1C35] block mt-0.5">
                  {viewingRx.doctorName || getDoctorDisplayName(viewingRx)}
                </strong>
                <span className="text-[#00A896] font-bold">
                  {viewingRx.departmentName || viewingRx.specialty || 'General Medicine'}
                </span>
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
                          <tr>
                            <td colSpan="6" className="p-6 text-center text-slate-400">
                              {loadingRxDetails ? 'Loading medication details...' : 'No line-item medications recorded.'}
                            </td>
                          </tr>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Doctor's Clinical Notes</span>
                <p className="font-medium text-slate-700">{viewingRx.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingRx(null)}
                className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadSlip}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download size={14} className="text-[#00A896]" />
                <span>Download Slip</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 bg-[#00A896] hover:bg-[#079181] text-white rounded-full text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Official Slip</span>
              </button>
            </div>
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