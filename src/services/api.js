import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token
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

// Session expiry handler
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
  // Doctors
  getDoctors: (departmentId, specialty) => 
    api.get('/doctors', { params: { departmentId, specialty } }),
  getDoctorById: (id) => 
    api.get(`/doctors/${id}`),

  // Appointment Slots (From AppointmentController)
  getAvailableSlots: (doctorId, date) => 
    api.get('/appointments/slots', { params: { doctorId, date } }),

  // Appointments (From AppointmentController)
  bookAppointment: (payload) => 
    api.post('/appointments/book', payload),
  getMyAppointments: () => 
    api.get('/appointments/my-appointments'),
  cancelAppointment: (id, reason) => 
    api.put(`/appointments/${id}/cancel`, reason ? { reason } : {}),

  // Prescriptions (From PrescriptionController)
  getMyPrescriptions: () => 
    api.get('/prescriptions/my-prescriptions'),
  getPrescriptionByAppointment: (appointmentId) => 
    api.get(`/prescriptions/appointment/${appointmentId}`),

  // Patient Profile (From PatientController)
  getMyProfile: () => 
    api.get('/patient/profile'),
  updateMyProfile: (data) => 
    api.put('/patient/profile', data),
};

export const doctorApi = {
  // Doctor Profile (From DoctorController)
  getMyProfile: () => 
    api.get('/doctors/me'),

  // Doctor Schedule (From AppointmentController)
  getMySchedule: () => 
    api.get('/appointments/doctor/my-schedule'),
  completeAppointment: (id) => 
    api.put(`/appointments/${id}/complete`),
  cancelAppointment: (id, reason) => 
    api.put(`/appointments/${id}/cancel`, reason ? { reason } : {}),

  // Doctor Prescriptions (From PrescriptionController)
  createPrescription: (payload) => 
    api.post('/prescriptions', payload),
  getDoctorPrescriptionHistory: () => 
    api.get('/prescriptions/doctor-history'),
};

export default api;