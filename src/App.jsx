import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import DashboardShell from './components/DashboardShell';

function MainContent() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Conditional View: Dashboard if logged in, Landing Page if visitor */}
      {user ? (
        <DashboardShell />
      ) : (
        <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />
      )}

      {/* Multi-Role Login / Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole="PATIENT"
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}