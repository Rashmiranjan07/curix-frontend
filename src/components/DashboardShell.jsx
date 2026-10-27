import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './patient/PatientDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import AdminDashboard from './admin/AdminDashboard';

export default function DashboardShell() {
  const { user } = useAuth();

  if (!user) return null;

  // Normalize role string (handles both "ADMIN" and "ROLE_ADMIN")
  const role = user.role ? user.role.replace('ROLE_', '').toUpperCase() : 'PATIENT';

  // Admin Workspace
  if (role === 'ADMIN') {
    return <AdminDashboard />;
  }

  // Doctor Clinical Workspace
  if (role === 'DOCTOR') {
    return <DoctorDashboard />;
  }

  // Patient Medical Care Portal
  return <PatientDashboard />;
}