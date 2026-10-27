import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const patientApi = {
  getDoctors: (departmentId, specialty) => 
    api.get('/doctors', { params: { departmentId, specialty } }),
  getDoctorById: (id) => 
    api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId, date) => 
    api.get('/appointments/slots', { params: { doctorId, date } }),
  bookAppointment: (payload) => 
    api.post('/appointments/book', payload),
  getMyAppointments: () => 
    api.get('/appointments/my-appointments'),
  cancelAppointment: (id, reason) => 
    api.put(`/appointments/${id}/cancel`, reason ? { reason } : {}),
  getMyPrescriptions: () => 
    api.get('/prescriptions/my-prescriptions'),
  getPrescriptionByAppointment: (appointmentId) => 
    api.get(`/prescriptions/appointment/${appointmentId}`),
  getMyProfile: () => 
    api.get('/patient/profile'),
  updateMyProfile: (data) => 
    api.put('/patient/profile', data),
};

export const doctorApi = {
  getMyProfile: () => 
    api.get('/doctors/me'),
  getMySchedule: () => 
    api.get('/appointments/doctor/my-schedule'),
  completeAppointment: (id) => 
    api.put(`/appointments/${id}/complete`),
  cancelAppointment: (id, reason) => 
    api.put(`/appointments/${id}/cancel`, reason ? { reason } : {}),
  createPrescription: (payload) => 
    api.post('/prescriptions', payload),
  getDoctorPrescriptionHistory: () => 
    api.get('/prescriptions/doctor-history'),
};

export const adminApi = {
  // Analytics
  getDashboardMetrics: () => 
    api.get('/admin/analytics/dashboard'),

  // Doctor Provisioning
  provisionDoctor: (payload) => 
    api.post('/admin/doctors', payload),
  getAllDoctors: () => 
    api.get('/doctors'),

  // Departments
  getDepartments: () => 
    api.get('/departments'),
  createDepartment: (payload) => 
    api.post('/departments', payload),

  // Audit Logs (Pageable)
  getAuditLogs: (page = 0, size = 20) => 
    api.get('/admin/audit-logs', { params: { page, size } }),
};

export default api;