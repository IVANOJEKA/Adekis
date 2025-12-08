export const initialPatientData = [
    { id: 'P-001', name: 'John Doe', age: 45, gender: 'Male', phone: '0700123456', lastVisit: '2024-01-15', patientCategory: 'OPD' },
    { id: 'P-002', name: 'Jane Smith', age: 32, gender: 'Female', phone: '0700234567', lastVisit: '2024-01-18', patientCategory: 'Maternity' },
    { id: 'P-003', name: 'Robert Johnson', age: 58, gender: 'Male', phone: '0700345678', lastVisit: '2024-01-19', patientCategory: 'IPD' },
];

export const initialUserData = [
    { id: 'U-001', name: 'Admin User', email: 'admin@adekisplus.com', password: 'admin123', role: 'Administrator', department: 'Administration', status: 'Active', permissions: ['*'] },
    { id: 'U-002', name: 'Dr. Sarah Wilson', email: 'doctor@adekisplus.com', password: 'doctor123', role: 'Doctor', department: 'General Medicine', status: 'Active', permissions: null },
    // Add more users as needed
];

export const initialServicesData = [
    { id: 'SRV-001', name: 'General Consultation', category: 'Consultation', department: 'General', price: 50000, insurancePrice: 40000, duration: '30 mins', status: 'Active' },
    { id: 'SRV-002', name: 'Specialist Consultation', category: 'Consultation', department: 'Specialist', price: 100000, insurancePrice: 80000, duration: '45 mins', status: 'Active' },
];

export const initialAppointmentsData = [
    { id: 'APT-001', appointmentNumber: 'A-20240122-001', patientId: 'P-001', patientName: 'John Doe', doctorName: 'Dr. Sarah Wilson', date: new Date().toISOString().split('T')[0], status: 'Scheduled' }
];

// Add other critical seed data as needed
