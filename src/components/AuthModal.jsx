import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, User, Stethoscope, Shield, AlertCircle, ArrowRight, 
  Loader2, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'PATIENT' }) {
  if (!isOpen) return null;

  const [activeRole, setActiveRole] = useState(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, registerPatient } = useAuth();

  const emptyForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    emergencyContact: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'O+',
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    setActiveRole(initialRole);
    setIsRegisterMode(false);
    setFormData(emptyForm);
    setError('');
    setSuccessMsg('');
  }, [isOpen, initialRole]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const switchRole = (role) => {
    setActiveRole(role);
    setIsRegisterMode(false);
    setFormData(emptyForm);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeRole === 'PATIENT' && isRegisterMode) {
        await registerPatient({
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone.trim(),
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact.trim(),
        });

        try {
          await login(formData.email.trim(), formData.password, 'PATIENT');
          onClose();
        } catch {
          setSuccessMsg('Account registered successfully! Please sign in below.');
          setIsRegisterMode(false);
          setFormData(emptyForm);
        }
      } else {
        await login(formData.email.trim(), formData.password, activeRole);
        onClose();
      }
    } catch (err) {
      console.error("Auth action failed:", err);
      const serverMessage = 
        err.message || 
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Authentication failed. Please verify your credentials.';

      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'PATIENT', label: 'Patient', icon: User },
    { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
    { id: 'ADMIN', label: 'Admin', icon: Shield },
  ];

  const getEmailPlaceholder = () => {
    if (activeRole === 'PATIENT') return 'e.g. patient@gmail.com';
    if (activeRole === 'DOCTOR') return 'e.g. dr.smith@curix.com';
    return 'e.g. admin@curix.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005A5B]/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg bg-white border border-[#005A5B]/15 rounded-3xl p-7 sm:p-9 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-6 right-6 text-slate-400 hover:text-[#005A5B] p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-7 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#005A5B]">
            {isRegisterMode && activeRole === 'PATIENT' ? 'Create Patient Account' : `Sign In as ${activeRole.charAt(0) + activeRole.slice(1).toLowerCase()}`}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1.5">
            {isRegisterMode
              ? 'Fill in your details to create an account'
              : `Access your verified ${activeRole.toLowerCase()} workspace`}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex p-1 bg-[#EBF5F5] rounded-full border border-[#005A5B]/10 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => switchRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#005A5B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#005A5B]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {isRegisterMode && activeRole === 'PATIENT' ? (
            <>
              {/* Registration Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john.doe@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      minLength={6}
                      placeholder="Password123"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Emergency Contact *</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    required
                    placeholder="+91 9123456789"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">DOB *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-slate-800 focus:border-[#F26522] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-800 focus:border-[#F26522] focus:outline-none transition-all"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#005A5B] mb-1">Blood Group *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-2 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-800 focus:border-[#F26522] focus:outline-none transition-all"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sign In Fields */}
              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">
                  {activeRole} Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  required
                  placeholder={getEmailPlaceholder()}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#005A5B] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-white border border-stone-200 text-sm text-[#1A2E35] placeholder:text-slate-400 focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-[#F26522] hover:bg-[#D95316] active:bg-[#C2460F] text-white font-bold text-sm tracking-wide shadow-md shadow-[#F26522]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Validating {activeRole.toLowerCase()} credentials...</span>
              </>
            ) : (
              <>
                <span>
                  {isRegisterMode && activeRole === 'PATIENT' ? 'Register Patient Account' : `Sign In as ${activeRole}`}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        {activeRole === 'PATIENT' ? (
          <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-slate-500">
            {isRegisterMode ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setFormData(emptyForm); setError(''); setSuccessMsg(''); }}
                  className="text-[#F26522] font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                First time patient?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setFormData(emptyForm); setError(''); setSuccessMsg(''); }}
                  className="text-[#F26522] font-bold hover:underline ml-1"
                >
                  Register Account
                </button>
              </p>
            )}
          </div>
        ) : (
          <p className="mt-5 text-center text-[11px] text-slate-400">
            {activeRole} accounts must match the active portal tab to access the dashboard.
          </p>
        )}

      </div>
    </div>
  );
}