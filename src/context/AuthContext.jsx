import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = 'http://localhost:8080/api/v1/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, expectedRole = null) => {
    // 1. Authenticate credentials against backend
    const res = await axios.post(`${API_BASE}/login`, {
      email: email,
      password: password,
    });

    const authData = res.data?.data;
    const token = authData?.accessToken;

    if (!token) {
      throw new Error(res.data?.message || 'Login succeeded, but no accessToken was found.');
    }

    // Clean role format (e.g. "ROLE_DOCTOR" -> "DOCTOR")
    const cleanRole = authData.role ? authData.role.replace('ROLE_', '') : 'PATIENT';

    // 2. Strict Role Enforcement Check
    if (expectedRole && cleanRole !== expectedRole) {
      const roleDisplayName = 
        cleanRole === 'DOCTOR' ? 'Doctor' : 
        cleanRole === 'ADMIN' ? 'Admin' : 'Patient';

      throw new Error(
        `Access Denied: This account is registered as a ${roleDisplayName}. Please switch to the "${roleDisplayName}" tab above to sign in.`
      );
    }

    const userData = {
      id: authData.userId,
      email: authData.email,
      name: authData.email.split('@')[0],
      role: cleanRole,
    };

    // 3. Save to localStorage only after role validation passes
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const registerPatient = async (patientPayload) => {
    const res = await axios.post(`${API_BASE}/register`, patientPayload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerPatient, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);