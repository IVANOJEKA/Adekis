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
        return response.data.patients || response.data;
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

    // Delete patient
    delete: async (id) => {
        const response = await api.delete(`/patients/${id}`);
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

// ==================== INSURANCE API ====================

export const insuranceAPI = {
    getProviders: async () => {
        const response = await api.get('/insurance');
        return response.data;
    },

    addProvider: async (providerData) => {
        const response = await api.post('/insurance', providerData);
        return response.data;
    },

    verifyCoverage: async (verificationData) => {
        const response = await api.post('/insurance/verify', verificationData);
        return response.data;
    },

    getClaims: async () => {
        const response = await api.get('/insurance/claims');
        return response.data;
    },

    submitClaim: async (claimData) => {
        const response = await api.post('/insurance/claims', claimData);
        return response.data;
    },

    updateClaimStatus: async (id, statusData) => {
        const response = await api.put(`/insurance/claims/${id}/status`, statusData);
        return response.data;
    }
};

// ==================== WALLET API ====================

export const walletAPI = {
    getAll: async () => {
        const response = await api.get('/wallet');
        return response.data;
    },

    create: async (walletData) => {
        const response = await api.post('/wallet', walletData);
        return response.data;
    },

    topUp: async (id, topUpData) => {
        const response = await api.post(`/wallet/${id}/topup`, topUpData);
        return response.data;
    },

    getTransactions: async (id) => {
        const response = await api.get(`/wallet/${id}/transactions`);
        return response.data;
    }
};

// ==================== BED MANAGEMENT API ====================

export const bedManagementAPI = {
    getWards: async () => {
        const response = await api.get('/bed-management/wards');
        return response.data;
    },

    createWard: async (wardData) => {
        const response = await api.post('/bed-management/wards', wardData);
        return response.data;
    },

    getBeds: async () => {
        const response = await api.get('/bed-management/beds');
        return response.data;
    },

    addBed: async (bedData) => {
        const response = await api.post('/bed-management/beds', bedData);
        return response.data;
    },

    admitPatient: async (admissionData) => {
        const response = await api.post('/bed-management/admit', admissionData);
        return response.data;
    },

    dischargePatient: async (dischargeData) => {
        const response = await api.post('/bed-management/discharge', dischargeData);
        return response.data;
    }
};

// ==================== THEATRE API ====================

export const theatreAPI = {
    getRooms: async () => {
        const response = await api.get('/theatre/rooms');
        return response.data;
    },

    addRoom: async (roomData) => {
        const response = await api.post('/theatre/rooms', roomData);
        return response.data;
    },

    getSurgeries: async () => {
        const response = await api.get('/theatre/surgeries');
        return response.data;
    },

    scheduleSurgery: async (surgeryData) => {
        const response = await api.post('/theatre/surgeries', surgeryData);
        return response.data;
    },

    updateSurgeryStatus: async (id, statusData) => {
        const response = await api.put(`/theatre/surgeries/${id}/status`, statusData);
        return response.data;
    }
};

// ==================== EMR API ====================

export const emrAPI = {
    getRecords: async (patientId) => {
        const response = await api.get('/emr/records', {
            params: patientId ? { patientId } : {}
        });
        return response.data;
    },

    getRecordsByPatient: async (patientId) => {
        const response = await api.get(`/emr/records/${patientId}`);
        return response.data;
    },

    createRecord: async (recordData) => {
        const response = await api.post('/emr/records', recordData);
        return response.data;
    },

    updateRecord: async (id, recordData) => {
        const response = await api.put(`/emr/records/${id}`, recordData);
        return response.data;
    },

    getNotes: async (patientId) => {
        const response = await api.get('/emr/notes', {
            params: patientId ? { patientId } : {}
        });
        return response.data;
    },

    createNote: async (noteData) => {
        const response = await api.post('/emr/notes', noteData);
        return response.data;
    }
};

// ==================== MATERNITY API ====================

export const maternityAPI = {
    getPatients: async () => {
        const response = await api.get('/maternity/patients');
        return response.data;
    },

    registerPatient: async (patientData) => {
        const response = await api.post('/maternity/patients', patientData);
        return response.data;
    },

    recordANCVisit: async (visitData) => {
        const response = await api.post('/maternity/anc', visitData);
        return response.data;
    },

    getDeliveries: async () => {
        const response = await api.get('/maternity/deliveries');
        return response.data;
    },

    recordDelivery: async (deliveryData) => {
        const response = await api.post('/maternity/deliveries', deliveryData);
        return response.data;
    },

    recordPNCVisit: async (visitData) => {
        const response = await api.post('/maternity/pnc', visitData);
        return response.data;
    }
};

// ==================== TRIAGE API ====================

export const triageAPI = {
    getRecords: async (params) => {
        const response = await api.get('/triage', { params });
        return response.data;
    },

    createRecord: async (recordData) => {
        const response = await api.post('/triage', recordData);
        return response.data;
    },

    getRecordById: async (id) => {
        const response = await api.get(`/triage/${id}`);
        return response.data;
    }
};

// ==================== LABORATORY API ====================

export const labAPI = {
    getTests: async (params) => {
        const response = await api.get('/lab', { params });
        return response.data;
    },

    orderTest: async (testData) => {
        const response = await api.post('/lab', testData);
        return response.data;
    },

    updateResults: async (id, resultData) => {
        const response = await api.put(`/lab/${id}/results`, resultData);
        return response.data;
    },

    getTestById: async (id) => {
        const response = await api.get(`/lab/${id}`);
        return response.data;
    },

    validateResults: async (id, notes) => {
        const response = await api.put(`/lab/${id}/validate`, { notes });
        return response.data;
    },

    logPrint: async (id) => {
        const response = await api.post(`/lab/${id}/log-print`);
        return response.data;
    },

    getPendingTests: async () => {
        const response = await api.get('/lab/pending');
        return response.data;
    },

    getDoctorOrders: async (doctorName) => {
        const response = await api.get('/lab/my-orders', { params: { doctorName } });
        return response.data;
    },

    notifyDoctor: async (id, message) => {
        const response = await api.post(`/lab/${id}/notify-doctor`, { message });
        return response.data;
    }
};

// ==================== LAB INVENTORY API ====================

export const labInventoryAPI = {
    getAll: async (params) => {
        const response = await api.get('/lab-inventory', { params });
        return response.data;
    },

    add: async (itemData) => {
        const response = await api.post('/lab-inventory', itemData);
        return response.data;
    },

    update: async (id, itemData) => {
        const response = await api.put(`/lab-inventory/${id}`, itemData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/lab-inventory/${id}`);
        return response.data;
    },

    recordTransaction: async (transactionData) => {
        const response = await api.post('/lab-inventory/transaction', transactionData);
        return response.data;
    },

    getTransactions: async (id) => {
        const response = await api.get(`/lab-inventory/${id}/transactions`);
        return response.data;
    },

    getLowStock: async () => {
        const response = await api.get('/lab-inventory/alerts/low-stock');
        return response.data;
    }
};


// ==================== BLOOD BANK API ====================

export const bloodBankAPI = {
    // Inventory
    getInventory: async () => {
        const response = await api.get('/bloodbank/inventory');
        return response.data;
    },

    updateInventory: async (id, data) => {
        const response = await api.put(`/bloodbank/inventory/${id}`, data);
        return response.data;
    },

    initializeInventory: async () => {
        const response = await api.post('/bloodbank/inventory/initialize');
        return response.data;
    },

    // Donors
    getDonors: async () => {
        const response = await api.get('/bloodbank/donors');
        return response.data;
    },

    addDonor: async (donorData) => {
        const response = await api.post('/bloodbank/donors', donorData);
        return response.data;
    },

    recordDonation: async (donorId) => {
        const response = await api.post(`/bloodbank/donors/${donorId}/donate`);
        return response.data;
    },

    // Requests
    getRequests: async () => {
        const response = await api.get('/bloodbank/requests');
        return response.data;
    },

    createRequest: async (requestData) => {
        const response = await api.post('/bloodbank/requests', requestData);
        return response.data;
    },

    approveRequest: async (requestId) => {
        const response = await api.post(`/bloodbank/requests/${requestId}/approve`);
        return response.data;
    },

    rejectRequest: async (requestId) => {
        const response = await api.post(`/bloodbank/requests/${requestId}/reject`);
        return response.data;
    }
};

// ==================== AMBULANCE API ====================

export const ambulanceAPI = {
    // Fleet
    getFleet: async () => {
        const response = await api.get('/ambulance/fleet');
        return response.data;
    },

    addAmbulance: async (ambulanceData) => {
        const response = await api.post('/ambulance/fleet', ambulanceData);
        return response.data;
    },

    updateAmbulance: async (id, data) => {
        const response = await api.put(`/ambulance/fleet/${id}`, data);
        return response.data;
    },

    // Requests
    getRequests: async () => {
        const response = await api.get('/ambulance/requests');
        return response.data;
    },

    createRequest: async (requestData) => {
        const response = await api.post('/ambulance/requests', requestData);
        return response.data;
    },

    dispatchAmbulance: async (requestId, ambulanceId) => {
        const response = await api.post(`/ambulance/requests/${requestId}/dispatch`, { ambulanceId });
        return response.data;
    },

    // Trips
    getTrips: async () => {
        const response = await api.get('/ambulance/trips');
        return response.data;
    },

    completeTrip: async (tripId, data) => {
        const response = await api.put(`/ambulance/trips/${tripId}/complete`, data);
        return response.data;
    }
};

// ==================== HR API ====================

export const hrAPI = {
    // Employees
    getEmployees: async () => {
        const response = await api.get('/hr/employees');
        return response.data;
    },

    getEmployee: async (id) => {
        const response = await api.get(`/hr/employees/${id}`);
        return response.data;
    },

    addEmployee: async (employeeData) => {
        const response = await api.post('/hr/employees', employeeData);
        return response.data;
    },

    updateEmployee: async (id, data) => {
        const response = await api.put(`/hr/employees/${id}`, data);
        return response.data;
    },

    // Attendance
    getAttendance: async (params = {}) => {
        const response = await api.get('/hr/attendance', { params });
        return response.data;
    },

    markAttendance: async (attendanceData) => {
        const response = await api.post('/hr/attendance', attendanceData);
        return response.data;
    },

    updateAttendance: async (id, data) => {
        const response = await api.put(`/hr/attendance/${id}`, data);
        return response.data;
    },

    // Leave Requests
    getLeaveRequests: async () => {
        const response = await api.get('/hr/leaves');
        return response.data;
    },

    createLeaveRequest: async (leaveData) => {
        const response = await api.post('/hr/leaves', leaveData);
        return response.data;
    },

    updateLeaveRequest: async (id, data) => {
        const response = await api.put(`/hr/leaves/${id}`, data);
        return response.data;
    },

    // Payroll
    getPayroll: async (params = {}) => {
        const response = await api.get('/hr/payroll', { params });
        return response.data;
    },

    createPayroll: async (payrollData) => {
        const response = await api.post('/hr/payroll', payrollData);
        return response.data;
    },

    updatePayroll: async (id, data) => {
        const response = await api.put(`/hr/payroll/${id}`, data);
        return response.data;
    }
};

// Export the api instance for custom calls
export default api;

