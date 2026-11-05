import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import DashboardShell from './components/DashboardShell';
import ErrorBoundary from './components/ErrorBoundary';

function MainContent() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Conditional View: Dashboard if authenticated, Landing Page if visitor */}
      <ErrorBoundary>
        {user ? (
          <DashboardShell />
        ) : (
          <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />
        )}
      </ErrorBoundary>

      {/* Multi-Role Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialRole="PATIENT"
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
