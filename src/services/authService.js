import api from './api';

export const authService = {
  // Login for all roles (ADMIN, DOCTOR, PATIENT)
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // ApiResponse<AuthResponse>
  },

  // Patient registration with all backend fields
  registerPatient: async (patientData) => {
    const response = await api.post('/auth/register', patientData);
    return response.data; // ApiResponse<AuthResponse>
  },

  // Fetch logged in patient profile
  getPatientProfile: async () => {
    const response = await api.get('/patients/profile');
    return response.data;
  }
};