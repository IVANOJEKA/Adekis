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
}

// ==================== WALLET API ====================

export const walletAPI = {
    // Get all wallets
    getAll: async (params) => {
        const response = await api.get('/wallet', { params });
        return response.data.wallets || response.data;
    },

    // Get wallet by ID
    getById: async (id) => {
        const response = await api.get(`/wallet/${id}`);
        return response.data.wallet;
    },

    // Create wallet
    create: async (walletData) => {
        const response = await api.post('/wallet', walletData);
        return response.data;
    },

    // Top up wallet
    topUp: async (id, data) => {
        const response = await api.post(`/wallet/${id}/topup`, data);
        return response.data;
    },

    // Deduct from wallet
    deduct: async (id, data) => {
        const response = await api.post(`/wallet/${id}/deduct`, data);
        return response.data;
    },

    // Get wallet transactions
    getTransactions: async (id, params) => {
        const response = await api.get(`/wallet/${id}/transactions`, { params });
        return response.data.transactions || response.data;
    },

    // Update wallet status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/wallet/${id}/status`, { status });
        return response.data;
    }
}

// ==================== BED MANAGEMENT API ====================

export const bedMgmtAPI = {
    // Get all wards
    getWards: async (params) => {
        const response = await api.get('/bed-management/wards', { params });
        return response.data.wards || response.data;
    },

    // Create ward
    createWard: async (wardData) => {
        const response = await api.post('/bed-management/wards', wardData);
        return response.data;
    },

    // Get beds
    getBeds: async (params) => {
        const response = await api.get('/bed-management/beds', { params });
        return response.data.beds || response.data;
    },

    // Add bed
    addBed: async (bedData) => {
        const response = await api.post('/bed-management/beds', bedData);
        return response.data;
    },

    // Update bed status
    updateBedStatus: async (id, status) => {
        const response = await api.patch(`/bed-management/beds/${id}`, { status });
        return response.data;
    },

    // Admit patient
    admitPatient: async (admissionData) => {
        const response = await api.post('/bed-management/admit', admissionData);
        return response.data;
    },

    // Discharge patient
    dischargePatient: async (dischargeData) => {
        const response = await api.post('/bed-management/discharge', dischargeData);
        return response.data;
    },

    // Get active admissions
    getAdmissions: async (params) => {
        const response = await api.get('/bed-management/admissions', { params });
        return response.data.admissions || response.data;
    }
};

// ==================== FINANCE API ====================

export const financeAPI = {
    // Get expenses
    getExpenses: async (params) => {
        const response = await api.get('/finance/expenses', { params });
        return response.data.expenses || response.data;
    },

    // Create expense
    createExpense: async (expenseData) => {
        const response = await api.post('/finance/expenses', expenseData);
        return response.data;
    },

    // Approve expense
    approveExpense: async (id) => {
        const response = await api.patch(`/finance/expenses/${id}/approve`);
        return response.data;
    },

    // Mark expense as paid
    payExpense: async (id, paymentData) => {
        const response = await api.patch(`/finance/expenses/${id}/pay`, paymentData);
        return response.data;
    },

    // Get financial summary
    getSummary: async (period = 'month') => {
        const response = await api.get('/finance/summary', { params: { period } });
        return response.data.summary;
    },

    // Get revenue by category
    getRevenueByCategory: async (startDate, endDate) => {
        const response = await api.get('/finance/revenue-by-category', {
            params: { startDate, endDate }
        });
        return response.data.revenueByCategory;
    },

    // Get all transactions
    getTransactions: async (params) => {
        const response = await api.get('/finance/transactions', { params });
        return response.data.transactions;
    }
};

// ==================== SETTINGS API ====================

export const settingsAPI = {
    // Get hospital settings
    getHospitalSettings: async () => {
        const response = await api.get('/settings/hospital');
        return response.data.hospital;
    },

    // Update hospital settings
    updateHospitalSettings: async (settings) => {
        const response = await api.patch('/settings/hospital', settings);
        return response.data;
    },

    // Get service pricing
    getPricing: async (params) => {
        const response = await api.get('/settings/pricing', { params });
        return response.data.services;
    },

    // Create service price
    createPricing: async (pricingData) => {
        const response = await api.post('/settings/pricing', pricingData);
        return response.data;
    },

    // Update service price
    updatePricing: async (id, pricingData) => {
        const response = await api.patch(`/settings/pricing/${id}`, pricingData);
        return response.data;
    },

    // Delete service price
    deletePricing: async (id) => {
        const response = await api.delete(`/settings/pricing/${id}`);
        return response.data;
    },

    // Get preferences
    getPreferences: async () => {
        const response = await api.get('/settings/preferences');
        return response.data.preferences;
    },

    // Update preferences
    updatePreferences: async (preferences) => {
        const response = await api.patch('/settings/preferences', preferences);
        return response.data;
    },

    // Get users
    getUsers: async (params) => {
        const response = await api.get('/settings/users', { params });
        return response.data.users;
    },

    // Update user status
    updateUserStatus: async (id, status) => {
        const response = await api.patch(`/settings/users/${id}/status`, { status });
        return response.data;
    }
};

// ==================== REPORTS API ====================

export const reportsAPI = {
    // Get patient statistics
    getPatientStatistics: async (startDate, endDate) => {
        const response = await api.get('/reports/patient-statistics', {
            params: { startDate, endDate }
        });
        return response.data.report;
    },

    // Get revenue report
    getRevenueReport: async (startDate, endDate, groupBy = 'day') => {
        const response = await api.get('/reports/revenue', {
            params: { startDate, endDate, groupBy }
        });
        return response.data.report;
    },

    // Get appointments report
    getAppointmentsReport: async (startDate, endDate) => {
        const response = await api.get('/reports/appointments', {
            params: { startDate, endDate }
        });
        return response.data.report;
    },

    // Get lab report
    getLabReport: async (startDate, endDate) => {
        const response = await api.get('/reports/lab', {
            params: { startDate, endDate }
        });
        return response.data.report;
    },

    // Get inventory report
    getInventoryReport: async () => {
        const response = await api.get('/reports/inventory');
        return response.data.report;
    },

    // Get bed occupancy report
    getBedOccupancyReport: async () => {
        const response = await api.get('/reports/bed-occupancy');
        return response.data.report;
    },

    // Get dashboard summary
    getDashboardSummary: async () => {
        const response = await api.get('/reports/dashboard-summary');
        return response.data.summary;
    }
};

// ==================== CAMPS API ====================

export const campsAPI = {
    // Get all medical camps
    getAll: async (params) => {
        const response = await api.get('/camps', { params });
        return response.data.camps || response.data;
    },

    // Create medical camp
    create: async (campData) => {
        const response = await api.post('/camps', campData);
        return response.data;
    },

    // Update camp
    update: async (id, campData) => {
        const response = await api.patch(`/camps/${id}`, campData);
        return response.data;
    },

    // Register patient to camp
    registerPatient: async (id, patientData) => {
        const response = await api.post(`/camps/${id}/register-patient`, patientData);
        return response.data;
    },

    // Get camp patients
    getCampPatients: async (id) => {
        const response = await api.get(`/camps/${id}/patients`);
        return response.data.patients;
    }
};

// ==================== PATHOLOGY API ====================

export const pathologyAPI = {
    // Get pathology tests
    getTests: async (params) => {
        const response = await api.get('/pathology/tests', { params });
        return response.data.tests || response.data;
    },

    // Order pathology test
    orderTest: async (testData) => {
        const response = await api.post('/pathology/tests', testData);
        return response.data;
    },

    // Update test results
    updateResults: async (id, resultsData) => {
        const response = await api.patch(`/pathology/tests/${id}/results`, resultsData);
        return response.data;
    },

    // Get specific test
    getTest: async (id) => {
        const response = await api.get(`/pathology/tests/${id}`);
        return response.data.test;
    }
};

// Export the api instance for custom calls
export default api;

