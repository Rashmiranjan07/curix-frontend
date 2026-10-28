import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_BASE = `${BASE_URL}/auth`;

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
    const res = await axios.post(`${API_BASE}/login`, {
      email: email,
      password: password,
    });

    const authData = res.data?.data;
    const token = authData?.accessToken;

    if (!token) {
      throw new Error(res.data?.message || 'Login succeeded, but no accessToken was found.');
    }

    const cleanRole = authData.role ? authData.role.replace('ROLE_', '') : 'PATIENT';

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