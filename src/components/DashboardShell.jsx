import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './patient/PatientDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ErrorBoundary from './ErrorBoundary';

export default function DashboardShell() {
  const { user } = useAuth();

  if (!user) return null;

  // Normalize role string (handles both "ADMIN" and "ROLE_ADMIN")
  const role = user.role ? user.role.replace('ROLE_', '').toUpperCase() : 'PATIENT';

  return (
    <div className="min-h-screen bg-[#F4F8FB]">
      <ErrorBoundary>
        {role === 'ADMIN' && <AdminDashboard />}
        {role === 'DOCTOR' && <DoctorDashboard />}
        {role === 'PATIENT' && <PatientDashboard />}
      </ErrorBoundary>
    </div>
  );
}
