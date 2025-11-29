import axios from 'axios';

// API Base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and redirect to login
            localStorage.removeItem('hms_auth_token');
            localStorage.removeItem('hms_auth_user');
            window.location.href = '/staff-login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH API ====================

export const authAPI = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('hms_auth_token', response.data.token);
            localStorage.setItem('hms_auth_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('hms_auth_token', response.data.token);
            localStorage.setItem('hms_auth_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Get current user
    me: async () => {
        const response = await api.get('/auth/me');
        return response.data.user;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('hms_auth_token');
        localStorage.removeItem('hms_auth_user');
    }
};

// ==================== PATIENTS API ====================

export const patientsAPI = {
    // Get all patients with optional search and pagination
    getAll: async (params = {}) => {
        const response = await api.get('/patients', { params });
        return response.data;
    },

    // Get single patient by ID
    getById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data.patient;
    },

    // Create new patient
    create: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data.patient;
    },

    // Update patient
    update: async (id, patientData) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data.patient;
    },

    // Delete patient (soft delete)
    delete: async (id) => {
        const response = await api.delete(`/patients/${id}`);
        return response.data;
    }
};

// ==================== USERS API ====================

export const usersAPI = {
    // Get all users (for admin)
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Create user
    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Update user
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    }
};

// ==================== APPOINTMENTS API ====================

export const appointmentsAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/appointments', { params });
        return response.data.appointments || response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data.appointment;
    },

    create: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data.appointment;
    },

    update: async (id, appointmentData) => {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        return response.data.appointment;
    },

    delete: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    }
};

// ==================== PRESCRIPTIONS API ====================

export const prescriptionsAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/prescriptions', { params });
        return response.data.prescriptions || response.data;
    },

    create: async (prescriptionData) => {
        const response = await api.post('/prescriptions', prescriptionData);
        return response.data.prescription;
    },

    update: async (id, prescriptionData) => {
        const response = await api.put(`/prescriptions/${id}`, prescriptionData);
        return response.data.prescription;
    }
};

// ==================== BILLS API ====================

export const billsAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/bills', { params });
        return response.data.bills || response.data;
    },

    create: async (billData) => {
        const response = await api.post('/bills', billData);
        return response.data.bill;
    },

    update: async (id, billData) => {
        const response = await api.put(`/bills/${id}`, billData);
        return response.data.bill;
    }
};

// ==================== SERVICES API ====================

export const servicesAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/services', { params });
        return response.data.services || response.data;
    },

    create: async (serviceData) => {
        const response = await api.post('/services', serviceData);
        return response.data.service;
    },

    update: async (id, serviceData) => {
        const response = await api.put(`/services/${id}`, serviceData);
        return response.data.service;
    }
};

// ==================== QUEUE API ====================

export const queueAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/queue', { params });
        return response.data.queue || response.data;
    },

    create: async (queueData) => {
        const response = await api.post('/queue', queueData);
        return response.data.entry;
    },

    update: async (id, queueData) => {
        const response = await api.put(`/queue/${id}`, queueData);
        return response.data.entry;
    }
};

// ==================== CASES API ====================

export const casesAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/cases', { params });
        return response.data.cases || response.data;
    },

    create: async (caseData) => {
        const response = await api.post('/cases', caseData);
        return response.data.case;
    },

    update: async (id, caseData) => {
        const response = await api.put(`/cases/${id}`, caseData);
        return response.data.case;
    }
};

// Export the api instance for custom calls
export default api;

