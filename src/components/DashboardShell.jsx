import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './patient/PatientDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import { Shield } from 'lucide-react';

export default function DashboardShell() {
  const { user } = useAuth();

  if (!user) return null;

  // Patient Workspace
  if (user.role === 'PATIENT') {
    return <PatientDashboard />;
  }

  // Doctor Workspace
  if (user.role === 'DOCTOR') {
    return <DoctorDashboard />;
  }

  // Admin Workspace
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fb] via-[#f3f9fd] to-white pt-28 pb-16 px-4 text-[#1e3a5f]">
      <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-3xl border border-sky-100 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#1e3a5f]">Hospital Administrator Console</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Logged in as <strong>{user.email}</strong>. Manage departments, verify doctors, and inspect audit logs.
        </p>
      </div>
    </div>
  );
}