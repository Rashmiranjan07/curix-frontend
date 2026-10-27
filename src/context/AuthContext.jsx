import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Controller supports both /api/v1/auth and /api/auth
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

  const login = async (email, password) => {
    // Sends { email, password } to /api/v1/auth/login
    const res = await axios.post(`${API_BASE}/login`, {
      email: email,
      password: password,
    });

    // Spring Boot wraps in ApiResponse<AuthResponse> -> res.data.data
    const authData = res.data?.data;
    const token = authData?.accessToken;

    if (!token) {
      throw new Error(res.data?.message || 'Login succeeded, but no accessToken was found.');
    }

    const cleanRole = authData.role ? authData.role.replace('ROLE_', '') : 'PATIENT';

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
    // Hits /api/v1/auth/register -> returns ApiResponse<String> with HttpStatus.CREATED (201)
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