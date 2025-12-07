import React, { createContext, useContext, useState, useEffect } from 'react';
import { patientsAPI, bloodBankAPI, ambulanceAPI, hrAPI, insuranceAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Initial data templates
const initialPatientData = [
    { id: 'P-001', name: 'John Doe', age: 45, gender: 'Male', phone: '0700123456', lastVisit: '2024-01-15', patientCategory: 'OPD' },
    { id: 'P-002', name: 'Jane Smith', age: 32, gender: 'Female', phone: '0700234567', lastVisit: '2024-01-18', patientCategory: 'Maternity' },
    { id: 'P-003', name: 'Robert Johnson', age: 58, gender: 'Male', phone: '0700345678', lastVisit: '2024-01-19', patientCategory: 'IPD' },
];

const initialLabInventory = [
    { id: 'INV-001', name: 'Malaria Test Kit', category: 'Test Kits', stock: 150, unit: 'pcs', minStock: 20, status: 'Good' },
    { id: 'INV-002', name: 'CBC Reagent A', category: 'Reagents', stock: 5, unit: 'liters', minStock: 2, status: 'Low' },
    { id: 'INV-003', name: 'Syringes 5ml', category: 'Consumables', stock: 500, unit: 'box', minStock: 50, status: 'Good' },
    { id: 'INV-004', name: 'Urine Containers', category: 'Consumables', stock: 200, unit: 'pcs', minStock: 30, status: 'Good' },
    { id: 'INV-005', name: 'HIV Test Kit', category: 'Test Kits', stock: 80, unit: 'pcs', minStock: 15, status: 'Good' },
];

const initialLabOrders = [
    { id: 'LAB-001', patientName: 'John Doe', patientId: 'P-001', orderType: 'Doctor', requestedBy: 'Dr. Sarah Wilson', testType: 'Complete Blood Count (CBC)', date: '2024-01-20 09:30', status: 'Pending', priority: 'Routine', sampleCollected: false },
    { id: 'LAB-002', patientName: 'Jane Smith', patientId: 'P-002', orderType: 'Walk-in', requestedBy: 'Reception Desk', testType: 'Malaria Test', date: '2024-01-20 10:15', status: 'Sample Collected', priority: 'Urgent', sampleCollected: true, amount: 25000 },
];

const initialFinancialData = [
    { id: 'INV-001', patientId: 'P-001', amount: 150000, status: 'Paid', date: '2024-01-15', type: 'Consultation' },
    { id: 'INV-002', patientId: 'P-002', amount: 250000, status: 'Pending', date: '2024-01-18', type: 'Lab Tests' },
    { id: 'INV-003', patientId: 'P-003', amount: 500000, status: 'Paid', date: '2024-01-19', type: 'Surgery' },
];

const initialClinicalData = [
    { id: 'LAB-001', patientId: 'P-001', test: 'Blood Test', result: 'Normal', date: '2024-01-15' },
    { id: 'RAD-001', patientId: 'P-002', exam: 'X-Ray Chest', result: 'Clear', date: '2024-01-18' },
    { id: 'PRES-001', patientId: 'P-003', medication: 'Paracetamol', dosage: '500mg', date: '2024-01-19' },
];

const initialUserData = [
    { id: 'U-001', name: 'Admin User', email: 'admin@adekisplus.com', password: 'admin123', role: 'Administrator', department: 'Administration', status: 'Active', permissions: ['*'] },
    { id: 'U-002', name: 'Dr. Sarah Wilson', email: 'doctor@adekisplus.com', password: 'doctor123', role: 'Doctor', department: 'General Medicine', status: 'Active', permissions: null },
    { id: 'U-003', name: 'Mary Nurse', email: 'nurse@adekisplus.com', password: 'nurse123', role: 'Nurse', department: 'Nursing', status: 'Active', permissions: null },
    { id: 'U-004', name: 'John Pharmacist', email: 'pharmacist@adekisplus.com', password: 'pharma123', role: 'Pharmacist', department: 'Pharmacy', status: 'Active', permissions: null },
    { id: 'U-005', name: 'Lisa Lab Tech', email: 'lab@adekisplus.com', password: 'lab123', role: 'Lab Technician', department: 'Laboratory', status: 'Active', permissions: null },
    { id: 'U-006', name: 'Mike Reception', email: 'reception@adekisplus.com', password: 'reception123', role: 'Receptionist', department: 'Reception', status: 'Active', permissions: null },
    { id: 'U-007', name: 'Jane Finance', email: 'finance@adekisplus.com', password: 'finance123', role: 'Finance Officer', department: 'Finance', status: 'Active', permissions: null },
];

// Module Control Initial Data
const initialModules = [
    { id: 'reception', name: 'Reception', enabled: true, description: 'Patient registration and appointments' },
    { id: 'doctor', name: 'Doctor', enabled: true, description: 'Doctor dashboard and consultations' },
    { id: 'emr', name: 'EMR', enabled: true, description: 'Electronic Medical Records' },
    { id: 'pharmacy', name: 'Pharmacy', enabled: true, description: 'Medication dispensation and inventory' },
    { id: 'laboratory', name: 'Laboratory', enabled: true, description: 'Lab tests and results' },
    { id: 'radiology', name: 'Radiology', enabled: true, description: 'Imaging and reports' },
    { id: 'nursing', name: 'Nursing Care', enabled: true, description: 'Patient care and vitals' },
    { id: 'theatre', name: 'Theatre', enabled: true, description: 'Surgery and operation management' },
    { id: 'maternity', name: 'Maternity', enabled: true, description: 'Labor and delivery' },
    { id: 'finance', name: 'Finance & Insurance', enabled: true, description: 'Billing, insurance, and expenses' },
    { id: 'hr', name: 'HR Management', enabled: true, description: 'Staff, attendance, and payroll' },
    { id: 'blood-bank', name: 'Blood Bank', enabled: true, description: 'Blood inventory and requests' },
    { id: 'ambulance', name: 'Ambulance', enabled: true, description: 'Emergency response and transport' },
    { id: 'camps', name: 'Health Camps', enabled: true, description: 'Outreach programs' },
    { id: 'queue', name: 'Queue Mgmt', enabled: true, description: 'Patient queue management' },
    { id: 'triage', name: 'Triage Station', enabled: true, description: 'Patient priority assessment' },
    { id: 'bed-management', name: 'Bed Management', enabled: true, description: 'Ward and bed occupancy' },
    { id: 'reports', name: 'Reports & Records', enabled: true, description: 'System reports and analytics' },
    { id: 'communication', name: 'Communication', enabled: true, description: 'Messaging and notifications' },
    { id: 'services', name: 'Services & Prices', enabled: true, description: 'Service catalog management' },
    { id: 'wallet', name: 'HMS Wallet', enabled: true, description: 'Patient wallet system' },
];

// System Settings - Consultation Fees and Configuration
const initialSystemSettings = {
    hospitalName: 'Central Hospital',
    currency: 'UGX',
    language: 'English',
    timezone: 'EAT',
    theme: 'light',
    consultationFees: {
        OPD: 50000,  // Outpatient consultation fee
        IPD: 100000  // Inpatient consultation fee
    },
    paymentMethods: ['Cash', 'Card', 'Mobile Money', 'Insurance', 'HMS Wallet'],
    receiptPrefix: 'REC',
    hospitalAddress: 'Kampala, Uganda',
    hospitalPhone: '+256 700 000000'
};



const initialServicesData = [
    // Consultation Services
    { id: 'SRV-001', name: 'General Consultation', category: 'Consultation', department: 'General', price: 50000, insurancePrice: 40000, duration: '30 mins', status: 'Active', description: 'Standard outpatient consultation', parameters: [] },
    { id: 'SRV-002', name: 'Specialist Consultation - Cardiology', category: 'Consultation', department: 'Cardiology', price: 100000, insurancePrice: 80000, duration: '45 mins', status: 'Active', description: 'Consultation with cardiologist', parameters: [] },
    { id: 'SRV-003', name: 'Specialist Consultation - Pediatrics', category: 'Consultation', department: 'Pediatrics', price: 80000, insurancePrice: 65000, duration: '45 mins', status: 'Active', description: 'Consultation with pediatrician', parameters: [] },
    { id: 'SRV-004', name: 'Emergency Consultation', category: 'Consultation', department: 'Emergency', price: 75000, insurancePrice: 60000, duration: '30 mins', status: 'Active', description: 'Emergency room consultation', parameters: [] },

    // Theatre/Surgery Services
    { id: 'SRV-005', name: 'Minor Surgery - Theatre Charges', category: 'Surgery', department: 'General', price: 500000, insurancePrice: 400000, duration: '2 hours', status: 'Active', description: 'Minor surgical procedure including theatre time', parameters: [] },
    { id: 'SRV-006', name: 'Major Surgery - Theatre Charges', category: 'Surgery', department: 'General', price: 1500000, insurancePrice: 1200000, duration: '4 hours', status: 'Active', description: 'Major surgical procedure including theatre time', parameters: [] },
    { id: 'SRV-007', name: 'Caesarean Section (C-Section)', category: 'Surgery', department: 'Maternity', price: 1200000, insurancePrice: 950000, duration: '3 hours', status: 'Active', description: 'C-section delivery including theatre and post-op care', parameters: [] },
    { id: 'SRV-008', name: 'Appendectomy', category: 'Surgery', department: 'General', price: 1000000, insurancePrice: 800000, duration: '2 hours', status: 'Active', description: 'Appendix removal surgery', parameters: [] },
    { id: 'SRV-009', name: 'Theatre Use - Per Hour', category: 'Surgery', department: 'General', price: 200000, insurancePrice: 160000, duration: '1 hour', status: 'Active', description: 'Operating theatre hourly rate', parameters: [] },

    // Laboratory Services
    {
        id: 'SRV-010',
        name: 'Blood Test (Complete)',
        category: 'Laboratory',
        department: 'Laboratory',
        price: 35000,
        insurancePrice: 28000,
        duration: '15 mins',
        status: 'Active',
        description: 'Complete blood count with differential',
        parameters: [
            { name: 'Hemoglobin', unit: 'g/dL', range: '13.5-17.5' },
            { name: 'WBC', unit: '10^9/L', range: '4.5-11.0' },
            { name: 'Platelets', unit: '10^9/L', range: '150-450' }
        ]
    },

    // Radiology Services
    { id: 'SRV-011', name: 'X-Ray Chest', category: 'Radiology', department: 'Radiology', price: 45000, insurancePrice: 36000, duration: '20 mins', status: 'Active', description: 'Chest X-ray imaging', parameters: [] },
    { id: 'SRV-012', name: 'Ultrasound Scan', category: 'Radiology', department: 'Radiology', price: 80000, insurancePrice: 64000, duration: '30 mins', status: 'Active', description: 'Ultrasound imaging', parameters: [] },

    // Procedures
    { id: 'SRV-013', name: 'Wound Dressing', category: 'Procedure', department: 'General', price: 25000, insurancePrice: 20000, duration: '20 mins', status: 'Active', description: 'Wound cleaning and dressing', parameters: [] },
    { id: 'SRV-014', name: 'Suturing', category: 'Procedure', department: 'Emergency', price: 40000, insurancePrice: 32000, duration: '30 mins', status: 'Active', description: 'Wound suturing procedure', parameters: [] },
];

const initialDebtData = [
    { id: 'DEBT-001', patientId: 'P-001', patientName: 'John Doe', amount: 120000, dueDate: '2024-02-15', status: 'Outstanding', invoiceId: 'INV-045' },
    { id: 'DEBT-002', patientId: 'P-002', patientName: 'Jane Smith', amount: 85000, dueDate: '2024-02-20', status: 'Overdue', invoiceId: 'INV-052' },
];

const initialWalletData = [
    {
        id: 'WAL-001',
        cardNumber: '5847-2931-6482-7195',
        cardholder: 'John Doe',
        patientId: 'P-001',
        patientName: 'John Doe',
        packageType: 'platinum',
        balance: 150000,
        expiryDate: '12/27',
        status: 'Active',
        members: ['John Doe', 'Jane Doe', 'Jimmy Doe'],
        joinedDate: '2024-01-15',
        lastTransaction: '2024-01-18'
    },
    {
        id: 'WAL-002',
        cardNumber: '3294-8571-1063-4829',
        cardholder: 'Mary Johnson',
        patientId: 'P-002',
        patientName: 'Mary Johnson',
        packageType: 'premium',
        balance: 75000,
        expiryDate: '08/27',
        status: 'Active',
        members: ['Mary Johnson', 'Michael Johnson'],
        joinedDate: '2024-01-10',
        lastTransaction: '2024-01-19'
    },
];

const initialWardsData = [
    { id: 'WARD-001', name: 'General Ward A', type: 'General', gender: 'Male', basePrice: 50000, capacity: 20 },
    { id: 'WARD-002', name: 'General Ward B', type: 'General', gender: 'Female', basePrice: 50000, capacity: 20 },
    { id: 'WARD-003', name: 'ICU', type: 'Critical Care', gender: 'Mixed', basePrice: 250000, capacity: 10 },
    { id: 'WARD-004', name: 'Private Wing', type: 'Private', gender: 'Mixed', basePrice: 150000, capacity: 8 },
    { id: 'WARD-005', name: 'Maternity Ward', type: 'Specialized', gender: 'Female', basePrice: 80000, capacity: 15 },
];

const initialBedsData = [
    // General Ward A Beds (Male)
    { id: 'BED-001', wardId: 'WARD-001', number: 'A-01', type: 'Standard', status: 'Occupied', patientId: 'P-001' },
    { id: 'BED-002', wardId: 'WARD-001', number: 'A-02', type: 'Standard', status: 'Available', patientId: null },
    { id: 'BED-003', wardId: 'WARD-001', number: 'A-03', type: 'Standard', status: 'Maintenance', patientId: null },
    // General Ward B Beds (Female)
    { id: 'BED-021', wardId: 'WARD-002', number: 'B-01', type: 'Standard', status: 'Occupied', patientId: 'P-002' },
    { id: 'BED-022', wardId: 'WARD-002', number: 'B-02', type: 'Standard', status: 'Available', patientId: null },
    // ICU Beds
    { id: 'BED-041', wardId: 'WARD-003', number: 'ICU-01', type: 'ICU', status: 'Occupied', patientId: 'P-003' },
    { id: 'BED-042', wardId: 'WARD-003', number: 'ICU-02', type: 'ICU', status: 'Available', patientId: null },
];

const initialAdmissionsData = [
    { id: 'ADM-001', patientId: 'P-001', bedId: 'BED-001', wardId: 'WARD-001', admissionDate: '2024-01-15T10:00:00', diagnosis: 'Malaria', doctorId: 'U-001', status: 'Admitted' },
    { id: 'ADM-002', patientId: 'P-002', bedId: 'BED-021', wardId: 'WARD-002', admissionDate: '2024-01-18T14:30:00', diagnosis: 'Pneumonia', doctorId: 'U-001', status: 'Admitted' },
    { id: 'ADM-003', patientId: 'P-003', bedId: 'BED-041', wardId: 'WARD-003', admissionDate: '2024-01-19T09:15:00', diagnosis: 'Post-Surgery Recovery', doctorId: 'U-003', status: 'Admitted' },
];

const initialInventoryData = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 250, unit: 'strips', price: 2000, cost: 1200, minStock: 50, expiry: '2025-12-31', batch: 'PCM2024A', supplier: 'PharmaCorp' },
    { id: 2, name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 145, unit: 'boxes', price: 15000, cost: 10000, minStock: 30, expiry: '2025-06-30', batch: 'AMX2024B', supplier: 'MediSupply' },
    { id: 3, name: 'Omeprazole 20mg', category: 'Antacids', stock: 180, unit: 'strips', price: 5000, cost: 3500, minStock: 40, expiry: '2025-09-15', batch: 'OME2024C', supplier: 'PharmaCorp' },
    { id: 4, name: 'Metformin 500mg', category: 'Diabetes', stock: 95, unit: 'boxes', price: 12000, cost: 8000, minStock: 50, expiry: '2026-01-20', batch: 'MET2024D', supplier: 'HealthCare Ltd' },
    { id: 5, name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 15, unit: 'strips', price: 3000, cost: 2000, minStock: 50, expiry: '2024-08-10', batch: 'IBU2023E', supplier: 'MediSupply' },
    { id: 6, name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 200, unit: 'strips', price: 1500, cost: 900, minStock: 30, expiry: '2025-11-30', batch: 'CET2024F', supplier: 'PharmaCorp' },
    { id: 7, name: 'Cough Syrup 100ml', category: 'Cough & Cold', stock: 8, unit: 'bottles', price: 8000, cost: 5500, minStock: 20, expiry: '2025-03-25', batch: 'CSY2024G', supplier: 'HealthCare Ltd' },
];

const initialPrescriptionData = [
    { id: 'RX-001', patientName: 'John Smith', patientId: 'P001', doctor: 'Dr. Sarah Wilson', date: '2024-01-20 09:30', status: 'Pending', medications: [{ name: 'Amoxicillin 500mg', quantity: 2, dosage: '1 tab 3x daily' }, { name: 'Paracetamol 500mg', quantity: 1, dosage: '2 tabs when needed' }], total: 32000, notes: 'Patient has penicillin sensitivity history' },
    { id: 'RX-002', patientName: 'Mary Johnson', patientId: 'P002', doctor: 'Dr. Michael Brown', date: '2024-01-20 10:15', status: 'Cleared', medications: [{ name: 'Metformin 500mg', quantity: 1, dosage: '1 tab 2x daily' }], total: 12000, notes: 'Diabetes management' },
    { id: 'RX-003', patientName: 'Sarah Wilson', patientId: 'P003', doctor: 'Dr. Sarah Wilson', date: '2024-01-20 11:00', status: 'Dispensed', medications: [{ name: 'Omeprazole 20mg', quantity: 2, dosage: '1 tab before breakfast' }, { name: 'Cetirizine 10mg', quantity: 1, dosage: '1 tab at night' }], total: 11500, notes: '', dispensedBy: 'Jane Pharmacist', dispensedAt: '2024-01-20 11:30' },
    { id: 'RX-004', patientName: 'David Lee', patientId: 'P004', doctor: 'Dr. Michael Brown', date: '2024-01-19 14:20', status: 'Pending', medications: [{ name: 'Ibuprofen 400mg', quantity: 1, dosage: '1 tab 3x daily after meals' }], total: 3000, notes: 'For back pain management' },
    { id: 'RX-005', patientName: 'Emma Watson', patientId: 'P005', doctor: 'Dr. Sarah Wilson', date: '2024-01-19 15:45', status: 'Cleared', medications: [{ name: 'Cough Syrup 100ml', quantity: 1, dosage: '10ml 3x daily' }], total: 8000, notes: 'Persistent cough' },
];

// Nursing Module Data
const initialVitalSignsData = [
    { id: 'VS-001', patientId: 'P-001', admissionId: 'ADM-001', recordedBy: 'Nurse Mary', timestamp: '2024-01-20T08:00:00', bp: '120/80', hr: 72, temp: 36.5, spo2: 98, rr: 16, painScore: 2, notes: 'Stable vitals' },
    { id: 'VS-002', patientId: 'P-002', admissionId: 'ADM-002', recordedBy: 'Nurse John', timestamp: '2024-01-20T08:15:00', bp: '130/85', hr: 78, temp: 37.2, spo2: 96, rr: 18, painScore: 4, notes: 'Slight fever, monitoring' },
    { id: 'VS-003', patientId: 'P-003', admissionId: 'ADM-003', recordedBy: 'Nurse Mary', timestamp: '2024-01-20T08:30:00', bp: '118/75', hr: 68, temp: 36.8, spo2: 99, rr: 14, painScore: 3, notes: 'Post-op recovery progressing well' },
];

const initialNursingNotesData = [
    { id: 'NN-001', patientId: 'P-001', admissionId: 'ADM-001', nurseName: 'Nurse Mary Johnson', timestamp: '2024-01-20T07:30:00', category: 'Shift Assessment', note: 'Patient alert and oriented x3. No complaints overnight. Denies pain. Voiding adequately.', isPrivate: false },
    { id: 'NN-002', patientId: 'P-002', admissionId: 'ADM-002', nurseName: 'Nurse John Smith', timestamp: '2024-01-20T08:00:00', category: 'Progress Note', note: 'Patient reports 4/10 chest discomfort. Respiratory status monitored. O2 saturation stable at 96%. Antibiotics administered as ordered.', isPrivate: false },
    { id: 'NN-003', patientId: 'P-003', admissionId: 'ADM-003', nurseName: 'Nurse Mary Johnson', timestamp: '2024-01-20T09:00:00', category: 'Post-Op Note', note: 'Post-op day 1. Surgical site clean, dry, intact. No signs of infection. Pain managed with prescribed analgesics. Encouraged deep breathing exercises.', isPrivate: false },
];

const initialCarePlansData = [
    { id: 'CP-001', patientId: 'P-001', admissionId: 'ADM-001', diagnosis: 'Risk for Infection', goal: 'Patient will remain free from infection during hospital stay', interventions: ['Monitor vital signs q4h', 'Maintain aseptic technique', 'Encourage hand hygiene'], createdBy: 'Nurse Mary', createdAt: '2024-01-19T10:00:00', status: 'Active' },
    { id: 'CP-002', patientId: 'P-002', admissionId: 'ADM-002', diagnosis: 'Impaired Gas Exchange', goal: 'Patient will maintain O2 saturation >95% on room air', interventions: ['Monitor SpO2 continuously', 'Administer O2 as needed', 'Encourage incentive spirometry q2h'], createdBy: 'Nurse John', createdAt: '2024-01-18T15:00:00', status: 'Active' },
    { id: 'CP-003', patientId: 'P-003', admissionId: 'ADM-003', diagnosis: 'Acute Pain', goal: 'Patient will report pain level <4/10', interventions: ['Assess pain q2h', 'Administer analgesics as ordered', 'Position for comfort', 'Apply ice to surgical site'], createdBy: 'Nurse Mary', createdAt: '2024-01-19T10:00:00', status: 'Active' },
];

const initialHandoverReportsData = [
    {
        id: 'HO-001', shift: 'Night', date: '2024-01-20', handedOverBy: 'Nurse Sarah Night', receivedBy: 'Nurse Mary Johnson', timestamp: '2024-01-20T07:00:00', patients: [
            { patientId: 'P-001', summary: 'Stable overnight. No issues. Due for morning meds at 08:00.', pendingTasks: ['Morning vitals', 'Medication administration'], concerns: '' },
            { patientId: 'P-002', summary: 'Restless night. Complained of chest discomfort around 03:00. Vitals stable. Continue monitoring.', pendingTasks: ['Monitor respiratory status', 'Follow up on chest discomfort'], concerns: 'Watch for increasing respiratory distress' },
            { patientId: 'P-003', summary: 'Post-op night 1. Pain managed. Rested well. Surgical site checked at 04:00 - no concerns.', pendingTasks: ['Morning wound assessment', 'Pain management'], concerns: '' }
        ]
    }
];

const initialNursingTasksData = [
    { id: 'NT-001', patientId: 'P-001', admissionId: 'ADM-001', taskType: 'Medication', description: 'Administer morning medications', scheduledTime: '20 24-01-20T08:00:00', status: 'Pending', priority: 'High', assignedTo: 'Nurse Mary' },
    { id: 'NT-002', patientId: 'P-002', admissionId: 'ADM-002', taskType: 'Assessment', description: 'Respiratory assessment', scheduledTime: '2024-01-20T09:00:00', status: 'Pending', priority: 'High', assignedTo: 'Nurse John' },
    { id: 'NT-003', patientId: 'P-003', admissionId: 'ADM-003', taskType: 'Wound Care', description: 'Surgical wound dressing change', scheduledTime: '2024-01-20T10:00:00', status: 'Pending', priority: 'Medium', assignedTo: 'Nurse Mary' },
    { id: 'NT-004', patientId: 'P-001', admissionId: 'ADM-001', taskType: 'Vitals', description: 'Record vital signs', scheduledTime: '2024-01-20T12:00:00', status: 'Pending', priority: 'Routine', assignedTo: 'Nurse Mary' },
];

// HR Module Data
const initialDepartmentsData = [
    { id: 'DEPT-001', name: 'General Medicine', type: 'Clinical', headOfDepartment: 'U-001', staffCount: 25 },
    { id: 'DEPT-002', name: 'Nursing', type: 'Clinical', headOfDepartment: 'U-003', staffCount: 45 },
    { id: 'DEPT-003', name: 'Surgery', type: 'Clinical', headOfDepartment: 'U-004', staffCount: 18 },
    { id: 'DEPT-004', name: 'Pharmacy', type: 'Clinical Support', headOfDepartment: 'U-005', staffCount: 12 },
    { id: 'DEPT-005', name: 'Laboratory', type: 'Diagnostic', headOfDepartment: 'U-006', staffCount: 15 },
    { id: 'DEPT-006', name: 'Radiology', type: 'Diagnostic', headOfDepartment: 'U-007', staffCount: 10 },
    { id: 'DEPT-007', name: 'Administration', type: 'Administrative', headOfDepartment: 'U-002', staffCount: 20 },
    { id: 'DEPT-008', name: 'Human Resources', type: 'Administrative', headOfDepartment: 'U-008', staffCount: 5 },
];

// Enhanced Employee/User Data (combining auth users with HR data)
const initialEmployeesData = [
    {
        id: 'U-001',
        name: 'Dr. Sarah Wilson',
        role: 'Senior Doctor',
        department: 'DEPT-001',
        departmentName: 'General Medicine',
        email: 'sarah.wilson@hospital.com',
        phone: '0700111111',
        status: 'Active',
        joinDate: '2020-01-15',
        employmentType: 'Full-Time',
        salary: 8000000,
        leaveBalance: { annual: 18, sick: 10 },
        address: 'Kampala, Uganda'
    },
    {
        id: 'U-002',
        name: 'John Admin',
        role: 'Administrator',
        department: 'DEPT-007',
        departmentName: 'Administration',
        email: 'john.admin@hospital.com',
        phone: '0700222222',
        status: 'Active',
        joinDate: '2019-06-01',
        employmentType: 'Full-Time',
        salary: 4500000,
        leaveBalance: { annual: 21, sick: 12 },
        address: 'Kampala, Uganda'
    },
    {
        id: 'U-003',
        name: 'Mary Nurse',
        role: 'Head Nurse',
        department: 'DEPT-002',
        departmentName: 'Nursing',
        email: 'mary.nurse@hospital.com',
        phone: '0700333333',
        status: 'Active',
        joinDate: '2021-03-10',
        employmentType: 'Full-Time',
        salary: 3200000,
        leaveBalance: { annual: 15, sick: 8 },
        address: 'Entebbe, Uganda'
    },
    {
        id: 'U-004',
        name: 'Dr. Michael Brown',
        role: 'Surgeon',
        department: 'DEPT-003',
        departmentName: 'Surgery',
        email: 'michael.brown@hospital.com',
        phone: '0700444444',
        status: 'Active',
        joinDate: '2018-09-20',
        employmentType: 'Full-Time',
        salary: 12000000,
        leaveBalance: { annual: 22, sick: 14 },
        address: 'Kampala, Uganda'
    },
    {
        id: 'U-005',
        name: 'Emma Pharmacist',
        role: 'Chief Pharmacist',
        department: 'DEPT-004',
        departmentName: 'Pharmacy',
        email: 'emma.pharm@hospital.com',
        phone: '0700555555',
        status: 'Active',
        joinDate: '2020-11-05',
        employmentType: 'Full-Time',
        salary: 4000000,
        leaveBalance: { annual: 16, sick: 10 },
        address: 'Jinja, Uganda'
    },
];

const initialLeaveRequestsData = [
    {
        id: 'LV-001',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        leaveType: 'Annual Leave',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        days: 5,
        reason: 'Family vacation',
        status: 'Pending',
        requestedDate: '2024-01-20',
        approvedBy: null,
        approvedDate: null
    },
    {
        id: 'LV-002',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        leaveType: 'Sick Leave',
        startDate: '2024-01-18',
        endDate: '2024-01-19',
        days: 2,
        reason: 'Flu',
        status: 'Approved',
        requestedDate: '2024-01-17',
        approvedBy: 'U-002',
        approvedDate: '2024-01-17'
    },
];

const initialAttendanceData = [
    { id: 'ATT-001', employeeId: 'U-001', employeeName: 'Dr. Sarah Wilson', date: '2024-01-20', checkIn: '08:00', checkOut: '17:00', status: 'Present', hoursWorked: 9 },
    { id: 'ATT-002', employeeId: 'U-002', employeeName: 'John Admin', date: '2024-01-20', checkIn: '08:15', checkOut: '17:10', status: 'Present', hoursWorked: 8.92 },
    { id: 'ATT-003', employeeId: 'U-003', employeeName: 'Mary Nurse', date: '2024-01-20', checkIn: '07:45', checkOut: '16:50', status: 'Present', hoursWorked: 9.08 },
    { id: 'ATT-004', employeeId: 'U-004', employeeName: 'Dr. Michael Brown', date: '2024-01-20', checkIn: '08:30', checkOut: null, status: 'Present', hoursWorked: 0 },
    { id: 'ATT-005', employeeId: 'U-001', employeeName: 'Dr. Sarah Wilson', date: '2024-01-19', checkIn: '08:05', checkOut: '17:15', status: 'Present', hoursWorked: 9.17 },
];

const initialPayrollData = [
    {
        id: 'PAY-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        month: 'December 2023',
        basicSalary: 8000000,
        allowances: 500000,
        deductions: 800000,
        netSalary: 7700000,
        status: 'Paid',
        paidDate: '2024-01-05'
    },
    {
        id: 'PAY-002',
        employeeId: 'U-002',
        employeeName: 'John Admin',
        month: 'December 2023',
        basicSalary: 4500000,
        allowances: 200000,
        deductions: 450000,
        netSalary: 4250000,
        status: 'Paid',
        paidDate: '2024-01-05'
    },
];

const initialShiftsData = [
    { id: 'SH-001', employeeId: 'U-003', employeeName: 'Mary Nurse', shiftType: 'Day Shift', date: '2024-01-21', startTime: '08:00', endTime: '16:00', department: 'DEPT-002' },
    { id: 'SH-002', employeeId: 'U-006', employeeName: 'Jane Nurse', shiftType: 'Night Shift', date: '2024-01-21', startTime: '20:00', endTime: '08:00', department: 'DEPT-002' },
    { id: 'SH-003', employeeId: 'U-001', employeeName: 'Dr. Sarah Wilson', shiftType: 'Day Shift', date: '2024-01-21', startTime: '08:00', endTime: '17:00', department: 'DEPT-001' },
]

// Benefits Administration Data
const initialBenefitsData = [
    {
        id: 'BEN-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        package: 'Premium Healthcare',
        healthInsurance: { provider: 'AAR Health', coverage: 'Family', premium: 500000, status: 'Active' },
        pension: { scheme: 'NSSF', employeeContribution: 5, employerContribution: 10, monthlyAmount: 400000 },
        allowances: [
            { type: 'Transport', amount: 200000 },
            { type: 'Housing', amount: 500000 },
            { type: 'Medical', amount: 150000 }
        ],
        enrollmentDate: '2020-01-15',
        totalMonthlyValue: 1250000
    },
    {
        id: 'BEN-002',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        package: 'Standard Healthcare',
        healthInsurance: { provider: 'Resolution Health', coverage: 'Individual', premium: 200000, status: 'Active' },
        pension: { scheme: 'NSSF', employeeContribution: 5, employerContribution: 10, monthlyAmount: 160000 },
        allowances: [
            { type: 'Transport', amount: 100000 },
            { type: 'Lunch', amount: 50000 }
        ],
        enrollmentDate: '2021-03-10',
        totalMonthlyValue: 510000
    }
];

// Recruitment Data
const initialJobPostingsData = [
    {
        id: 'JOB-001',
        title: 'Senior Nurse',
        department: 'DEPT-002',
        departmentName: 'Nursing',
        type: 'Full-Time',
        location: 'Kampala',
        salary: { min: 2500000, max: 3500000 },
        description: 'Experienced nurse for ICU and general wards',
        requirements: ['Nursing degree', '3+ years experience', 'Valid license'],
        postedDate: '2024-01-15',
        closingDate: '2024-02-15',
        status: 'Open',
        applicationsCount: 12
    },
    {
        id: 'JOB-002',
        title: 'Lab Technician',
        department: 'DEPT-005',
        departmentName: 'Laboratory',
        type: 'Full-Time',
        location: 'Kampala',
        salary: { min: 1800000, max: 2500000 },
        description: 'Laboratory technician for pathology department',
        requirements: ['Lab tech certification', '2+ years experience'],
        postedDate: '2024-01-10',
        closingDate: '2024-02-10',
        status: 'Open',
        applicationsCount: 8
    }
];

const initialApplicationsData = [
    {
        id: 'APP-001',
        jobId: 'JOB-001',
        jobTitle: 'Senior Nurse',
        candidateName: 'Jane Doe',
        email: 'jane.doe@email.com',
        phone: '0700999888',
        experience: '5 years',
        education: 'BSc Nursing',
        appliedDate: '2024-01-18',
        status: 'Under Review',
        stage: 'Screening',
        rating: 4,
        notes: 'Strong candidate, good experience'
    },
    {
        id: 'APP-002',
        jobId: 'JOB-001',
        jobTitle: 'Senior Nurse',
        candidateName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '0700888777',
        experience: '3 years',
        education: 'Diploma Nursing',
        appliedDate: '2024-01-19',
        status: 'Interview Scheduled',
        stage: 'Interview',
        rating: 3,
        interviewDate: '2024-01-25',
        notes: 'Meets minimum requirements'
    }
];

// Onboarding Data
const initialOnboardingData = [
    {
        id: 'ONB-001',
        employeeId: 'U-005',
        employeeName: 'Emma Pharmacist',
        position: 'Chief Pharmacist',
        startDate: '2020-11-05',
        status: 'Completed',
        tasks: [
            { id: 1, task: 'Complete employment forms', status: 'Completed', dueDate: '2020-11-05' },
            { id: 2, task: 'IT systems setup', status: 'Completed', dueDate: '2020-11-06' },
            { id: 3, task: 'Department orientation', status: 'Completed', dueDate: '2020-11-10' },
            { id: 4, task: 'Safety training', status: 'Completed', dueDate: '2020-11-12' },
            { id: 5, task: 'Pharmacy protocols training', status: 'Completed', dueDate: '2020-11-15' }
        ],
        completionPercentage: 100
    }
];

// Performance Management Data
const initialPerformanceReviewsData = [
    {
        id: 'REV-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        reviewPeriod: 'Q4 2023',
        reviewDate: '2024-01-10',
        reviewerId: 'U-002',
        reviewerName: 'John Admin',
        ratings: {
            quality: 5,
            productivity: 5,
            teamwork: 4,
            communication: 5,
            leadership: 5
        },
        overallRating: 4.8,
        strengths: ['Excellent patient care', 'Strong leadership', 'Mentors junior doctors'],
        areasForImprovement: ['Time management for administrative tasks'],
        goals: ['Lead quality improvement initiative', 'Complete advanced cardiac training'],
        status: 'Completed',
        employeeComments: 'Grateful for the feedback. Will work on administrative efficiency.',
        nextReviewDate: '2024-04-10'
    },
    {
        id: 'REV-002',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        reviewPeriod: 'Q4 2023',
        reviewDate: '2024-01-12',
        reviewerId: 'U-001',
        reviewerName: 'Dr. Sarah Wilson',
        ratings: {
            quality: 4,
            productivity: 5,
            teamwork: 5,
            communication: 4,
            leadership: 4
        },
        overallRating: 4.4,
        strengths: ['Exceptional patient care', 'Great team player', 'Reliable'],
        areasForImprovement: ['Leadership development', 'Decision making under pressure'],
        goals: ['Complete nurse leadership course', 'Mentor new nurses'],
        status: 'Completed',
        employeeComments: 'Thank you for the positive feedback.',
        nextReviewDate: '2024-04-12'
    }
];

const initialGoalsData = [
    {
        id: 'GOAL-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        title: 'Lead Quality Improvement Initiative',
        description: 'Develop and implement a quality improvement program for the medicine department',
        category: 'Professional Development',
        startDate: '2024-01-15',
        targetDate: '2024-06-30',
        status: 'In Progress',
        progress: 30,
        milestones: [
            { title: 'Research best practices', completed: true },
            { title: 'Develop proposal', completed: true },
            { title: 'Get approval', completed: false },
            { title: 'Implement program', completed: false },
            { title: 'Evaluate results', completed: false }
        ]
    },
    {
        id: 'GOAL-002',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        title: 'Complete Nurse Leadership Course',
        description: 'Enroll and complete certified nurse leadership training',
        category: 'Training',
        startDate: '2024-01-01',
        targetDate: '2024-12-31',
        status: 'In Progress',
        progress: 60,
        milestones: [
            { title: 'Enroll in course', completed: true },
            { title: 'Complete modules 1-5', completed: true },
            { title: 'Complete modules 6-10', completed: false },
            { title: 'Final assessment', completed: false }
        ]
    }
];

// Self-Service Requests Data
const initialSelfServiceRequestsData = [
    {
        id: 'SSR-001',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        type: 'Document Request',
        documentType: 'Employment Certificate',
        purpose: 'Mortgage application',
        requestDate: '2024-01-18',
        status: 'Pending',
        priority: 'Normal'
    },
    {
        id: 'SSR-002',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        type: 'Profile Update',
        field: 'Phone Number',
        oldValue: '0700111111',
        newValue: '0700111222',
        requestDate: '2024-01-19',
        status: 'Approved',
        approvedBy: 'U-002',
        approvedDate: '2024-01-19'
    }
];

// Employee Documents Data
const initialEmployeeDocumentsData = [
    {
        id: 'DOC-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        type: 'License',
        title: 'Medical License',
        issuer: 'Uganda Medical Council',
        issueDate: '2015-06-15',
        expiryDate: '2025-06-15',
        status: 'Active',
        documentNumber: 'UMC-2015-1234'
    },
    {
        id: 'DOC-002',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        type: 'Certification',
        title: 'BLS Certification',
        issuer: 'Red Cross Uganda',
        issueDate: '2023-03-10',
        expiryDate: '2025-03-10',
        status: 'Active',
        documentNumber: 'BLS-2023-456'
    },
    {
        id: 'DOC-003',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        type: 'License',
        title: 'Nursing License',
        issuer: 'Uganda Nurses Council',
        issueDate: '2018-09-01',
        expiryDate: '2024-09-01',
        status: 'Expiring Soon',
        documentNumber: 'UNC-2018-789'
    }
];

// Biometric Devices Data
const initialBiometricDevicesData = [
    {
        id: 'BIO-001',
        deviceName: 'Main Entrance - Fingerprint',
        deviceType: 'Fingerprint Scanner',
        location: 'Main Entrance',
        ipAddress: '192.168.1.101',
        manufacturer: 'ZKTeco',
        model: 'F18',
        status: 'Online',
        lastSync: '2024-01-21 07:30:00',
        employeesRegistered: 45,
        todayCheckIns: 38
    },
    {
        id: 'BIO-002',
        deviceName: 'Staff Gate - Face Recognition',
        deviceType: 'Face Recognition',
        location: 'Staff Gate',
        ipAddress: '192.168.1.102',
        manufacturer: 'Hikvision',
        model: 'DS-K1T671',
        status: 'Online',
        lastSync: '2024-01-21 07:25:00',
        employeesRegistered: 45,
        todayCheckIns: 32
    },
    {
        id: 'BIO-003',
        deviceName: 'Pharmacy Dept - Card Reader',
        deviceType: 'RFID Card',
        location: 'Pharmacy Department',
        ipAddress: '192.168.1.103',
        manufacturer: 'Suprema',
        model: 'BioEntry W2',
        status: 'Online',
        lastSync: '2024-01-21 07:28:00',
        employeesRegistered: 12,
        todayCheckIns: 10
    },
    {
        id: 'BIO-004',
        deviceName: 'Emergency Exit - Backup',
        deviceType: 'Fingerprint Scanner',
        location: 'Emergency Exit',
        ipAddress: '192.168.1.104',
        manufacturer: 'ZKTeco',
        model: 'F18',
        status: 'Offline',
        lastSync: '2024-01-20 18:00:00',
        employeesRegistered: 45,
        todayCheckIns: 0
    }
];

// Enhanced Attendance Data with Biometric Info
const initialEnhancedAttendanceData = [
    {
        id: 'ATT-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        date: '2024-01-21',
        checkIn: '07:58:32',
        checkOut: '17:05:18',
        status: 'Present',
        hoursWorked: 9.11,
        deviceIdCheckIn: 'BIO-001',
        deviceIdCheckOut: 'BIO-001',
        verificationType: 'Fingerprint',
        lateMinutes: 0,
        earlyDepartureMinutes: 0,
        overtimeMinutes: 65
    },
    {
        id: 'ATT-002',
        employeeId: 'U-002',
        employeeName: 'John Admin',
        date: '2024-01-21',
        checkIn: '08:12:45',
        checkOut: '17:08:22',
        status: 'Present',
        hoursWorked: 8.93,
        deviceIdCheckIn: 'BIO-002',
        deviceIdCheckOut: 'BIO-002',
        verificationType: 'Face Recognition',
        lateMinutes: 12,
        earlyDepartureMinutes: 0,
        overtimeMinutes: 8
    },
    {
        id: 'ATT-003',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        date: '2024-01-21',
        checkIn: '07:42:15',
        checkOut: '16:55:30',
        status: 'Present',
        hoursWorked: 9.22,
        deviceIdCheckIn: 'BIO-001',
        deviceIdCheckOut: 'BIO-001',
        verificationType: 'Fingerprint',
        lateMinutes: 0,
        earlyDepartureMinutes: 5,
        overtimeMinutes: 75
    },
    {
        id: 'ATT-004',
        employeeId: 'U-004',
        employeeName: 'Dr. Michael Brown',
        date: '2024-01-21',
        checkIn: '08:25:10',
        checkOut: null,
        status: 'Present',
        hoursWorked: 0,
        deviceIdCheckIn: 'BIO-002',
        deviceIdCheckOut: null,
        verificationType: 'Face Recognition',
        lateMinutes: 25,
        earlyDepartureMinutes: 0,
        overtimeMinutes: 0
    },
    {
        id: 'ATT-005',
        employeeId: 'U-005',
        employeeName: 'Emma Pharmacist',
        date: '2024-01-21',
        checkIn: '07:55:00',
        checkOut: '17:02:45',
        status: 'Present',
        hoursWorked: 9.13,
        deviceIdCheckIn: 'BIO-003',
        deviceIdCheckOut: 'BIO-003',
        verificationType: 'RFID Card',
        lateMinutes: 0,
        earlyDepartureMinutes: 0,
        overtimeMinutes: 68
    }
];

// Attendance Policies
const initialAttendancePoliciesData = {
    workingHours: {
        standardStart: '08:00',
        standardEnd: '17:00',
        dailyHours: 9,
        weeklyHours: 45
    },
    graceperiod: {
        lateGracePeriod: 15, // minutes
        earlyDepartureGracePeriod: 10 // minutes
    },
    overtime: {
        enabled: true,
        threshold: 60, // minutes after standard hours
        rate: 1.5 // multiplier for overtime pay
    },
    penalties: {
        lateDeduction: 0.5, // hours deducted per late incident
        absentDeduction: 1 // day's pay deducted
    },
    biometricSettings: {
        autoSync: true,
        syncInterval: 5, // minutes
        allowManualEntry: false,
        requireBothCheckInOut: true,
        allowedDevices: ['BIO-001', 'BIO-002', 'BIO-003']
    }
};

// Maternity Module Data
const initialMaternityData = [
    {
        id: 'MAT-001',
        patientId: 'P-002',
        patientName: 'Jane Smith',
        age: 32,
        registrationDate: '2023-07-15',
        lmp: '2023-06-15', // Last Menstrual Period
        edd: '2024-03-22', // Expected Delivery Date
        currentWeeks: 30,
        gravida: 2, // Number of pregnancies
        para: 1, // Number of births
        abortions: 0,
        bloodGroup: 'O+',
        rhFactor: 'Positive',
        riskLevel: 'Low', // Low, Moderate, High
        riskFactors: [],
        assignedDoctor: 'Dr. Stone',
        assignedMidwife: 'Midwife Mary',
        status: 'Antenatal', // Antenatal, Labor, Delivered, Postnatal, Discharged
        phoneNumber: '0700234567',
        emergencyContact: { name: 'John Smith', relation: 'Husband', phone: '0700234568' }
    },
    {
        id: 'MAT-002',
        patientId: 'P-006',
        patientName: 'Emily Blunt',
        age: 28,
        registrationDate: '2023-05-20',
        lmp: '2023-04-10',
        edd: '2024-01-17',
        currentWeeks: 39,
        gravida: 1,
        para: 0,
        abortions: 0,
        bloodGroup: 'A+',
        rhFactor: 'Positive',
        riskLevel: 'Moderate',
        riskFactors: ['First pregnancy', 'Gestational diabetes'],
        assignedDoctor: 'Dr. Stone',
        assignedMidwife: 'Midwife Sarah',
        status: 'Labor',
        phoneNumber: '0700345678',
        emergencyContact: { name: 'James Blunt', relation: 'Husband', phone: '0700345679' }
    },
    {
        id: 'MAT-003',
        patientId: 'P-007',
        patientName: 'Sarah Connor',
        age: 35,
        registrationDate: '2023-05-01',
        lmp: '2023-03-25',
        edd: '2024-01-01',
        currentWeeks: 40,
        gravida: 3,
        para: 2,
        abortions: 0,
        bloodGroup: 'B+',
        rhFactor: 'Positive',
        riskLevel: 'High',
        riskFactors: ['Advanced maternal age', 'Previous C-section', 'Hypertension'],
        assignedDoctor: 'Dr. House',
        assignedMidwife: 'Midwife Mary',
        status: 'Labor',
        phoneNumber: '0700456789',
        emergencyContact: { name: 'Kyle Reese', relation: 'Partner', phone: '0700456790' }
    }
];

const initialANCVisitsData = [
    {
        id: 'ANC-001',
        maternityId: 'MAT-001',
        visitNumber: 1,
        visitDate: '2023-07-20',
        gestationWeeks: 5,
        weight: 65,
        bloodPressure: '120/80',
        fundalHeight: null,
        fetalHeartRate: null,
        presentation: null,
        edema: 'None',
        testsOrdered: ['Blood Type & RH', 'HIV', 'Hepatitis B', 'Syphilis', 'Hemoglobin'],
        testResults: { 'Blood Type & RH': 'O+', 'HIV': 'Negative', 'Hepatitis B': 'Negative', 'Syphilis': 'Negative', 'Hemoglobin': '12.5 g/dL' },
        vaccinationsGiven: ['Tetanus Toxoid - 1st dose'],
        complaints: ['Nausea', 'Fatigue'],
        physicalExam: 'Normal',
        advice: 'Folic acid supplementation, balanced diet',
        nextVisitDate: '2023-09-20',
        attendedBy: 'Dr. Stone'
    },
    {
        id: 'ANC-002',
        maternityId: 'MAT-001',
        visitNumber: 2,
        visitDate: '2023-09-22',
        gestationWeeks: 14,
        weight: 67,
        bloodPressure: '118/78',
        fundalHeight: 14,
        fetalHeartRate: 148,
        presentation: null,
        edema: 'None',
        testsOrdered: ['Ultrasound scan'],
        testResults: { 'Ultrasound scan': 'Single live fetus, normal development' },
        vaccinationsGiven: ['Tetanus Toxoid - 2nd dose'],
        complaints: [],
        physicalExam: 'Normal',
        advice: 'Continue iron and folic acid, regular meals',
        nextVisitDate: '2023-11-22',
        attendedBy: 'Midwife Mary'
    },
    {
        id: 'ANC-003',
        maternityId: 'MAT-001',
        visitNumber: 3,
        visitDate: '2023-11-25',
        gestationWeeks: 23,
        weight: 70,
        bloodPressure: '122/80',
        fundalHeight: 23,
        fetalHeartRate: 145,
        presentation: 'Cephalic',
        edema: 'None',
        testsOrdered: ['Glucose tolerance test'],
        testResults: { 'Glucose tolerance test': 'Normal' },
        vaccinationsGiven: [],
        complaints: ['Back pain'],
        physicalExam: 'Normal',
        advice: 'Back exercises, continue supplements',
        nextVisitDate: '2024-01-10',
        attendedBy: 'Dr. Stone'
    },
    {
        id: 'ANC-004',
        maternityId: 'MAT-002',
        visitNumber: 1,
        visitDate: '2023-05-25',
        gestationWeeks: 6,
        weight: 62,
        bloodPressure: '125/82',
        fundalHeight: null,
        fetalHeartRate: null,
        presentation: null,
        edema: 'None',
        testsOrdered: ['Blood Type & RH', 'HIV', 'Hepatitis B', 'Hemoglobin'],
        testResults: { 'Blood Type & RH': 'A+', 'HIV': 'Negative', 'Hepatitis B': 'Negative', 'Hemoglobin': '11.8 g/dL' },
        vaccinationsGiven: ['Tetanus Toxoid - 1st dose'],
        complaints: ['Morning sickness'],
        physicalExam: 'Normal',
        advice: 'Small frequent meals, folic acid',
        nextVisitDate: '2023-07-25',
        attendedBy: 'Midwife Sarah'
    }
];

const initialDeliveryRecordsData = [
    {
        id: 'DEL-001',
        maternityId: 'MAT-004',
        admissionDate: '2024-01-15T08:30:00',
        admissionReason: 'Spontaneous labor',
        deliveryDate: '2024-01-15T14:45:00',
        deliveryMethod: 'Normal Vaginal Delivery',
        presentation: 'Cephalic',
        laborOnset: 'Spontaneous',
        membranesRupture: 'Spontaneous',
        membranesRuptureTime: '2024-01-15T10:00:00',
        amnioticFluid: 'Clear',
        laborDuration: '6h 15m',
        episiotomy: false,
        perinealTear: 'None',
        placentaDelivered: 'Complete',
        placentaDeliveryMethod: 'Spontaneous',
        complications: [],
        bloodLoss: 300, // ml
        medications: ['Oxytocin 10 units IM'],
        deliveredBy: 'Dr. Stone',
        assistedBy: ['Midwife Mary', 'Nurse Jane'],
        notes: 'Uncomplicated delivery, mother and baby stable'
    }
];

const initialNewbornRecordsData = [
    {
        id: 'NB-001',
        deliveryId: 'DEL-001',
        maternityId: 'MAT-004',
        motherName: 'Grace Williams',
        birthDate: '2024-01-15T14:45:00',
        gender: 'Female',
        weight: 3.2, // kg
        length: 50, // cm
        headCircumference: 34, // cm
        chestCircumference: 33,
        apgarScore1min: 8,
        apgarScore5min: 9,
        apgarScore10min: 9,
        birthDefects: 'None observed',
        resuscitationRequired: false,
        resuscitationDetails: '',
        vitaminKGiven: true,
        eyeProphylaxis: true,
        vaccinationsGiven: ['BCG', 'OPV-0', 'Hepatitis B-0'],
        feedingInitiated: true,
        feedingMethod: 'Breastfeeding',
        urinePassedWithin24h: true,
        meconiumPassedWithin24h: true,
        status: 'Healthy',
        admittedTo: null, // null or 'NICU' or 'Special Care'
        dischargeDate: '2024-01-17T10:00:00',
        dischargeWeight: 3.1,
        notes: 'Healthy newborn, exclusive breastfeeding established'
    }
];

const initialPNCVisitsData = [
    {
        id: 'PNC-001',
        maternityId: 'MAT-004',
        newbornId: 'NB-001',
        visitDate: '2024-01-16',
        visitNumber: 1,
        visitType: 'Day 1',
        postpartumDay: 1,
        motherAssessment: {
            temperature: 36.8,
            pulse: 78,
            bloodPressure: '125/75',
            respiratoryRate: 18,
            uterusFundusHeight: 'At umbilicus',
            uterusFirmness: 'Firm',
            lochia: 'Moderate, red',
            perineum: 'Intact, no swelling',
            breasts: 'Soft, colostrum present',
            breastfeeding: 'Initiated',
            urineOutput: 'Normal',
            bowelMovement: 'Not yet',
            painLevel: 2,
            mood: 'Stable',
            mobilization: 'Assisted'
        },
        babyAssessment: {
            weight: 3.15,
            temperature: 36.7,
            respiratoryRate: 45,
            heartRate: 135,
            feeding: 'Breastfeeding 8-10 times/day',
            feedingDifficulties: 'None',
            jaundice: 'None',
            skinColor: 'Pink',
            umbilicalCord: 'Clean, no discharge',
            urineOutput: 'Yes - 4 wet diapers',
            stoolOutput: 'Meconium',
            activity: 'Active, good cry'
        },
        educationProvided: ['Breastfeeding technique', 'Cord care', 'Danger signs'],
        complications: [],
        nextVisitDate: '2024-01-18',
        attendedBy: 'Midwife Mary',
        notes: 'Mother and baby doing well, continue breastfeeding support'
    }
];




// Ambulance Module Data
const initialAmbulanceFleetData = [
    {
        id: 'AMB-001',
        vehicleNumber: 'KAA 001X',
        type: 'Advanced Life Support (ALS)',
        status: 'Available', // Available, On Mission, Maintenance, Out of Service
        location: 'Hospital Parking',
        fuel: 85, // percentage
        lastMaintenance: '2024-01-10',
        nextMaintenanceDue: '2024-02-10',
        equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Spine Board'],
        mileage: 45230,
        capacity: 2, // stretchers
        assignedDriver: null,
        assignedParamedic: null
    },
    {
        id: 'AMB-002',
        vehicleNumber: 'KAA 002X',
        type: 'Basic Life Support (BLS)',
        status: 'On Mission',
        location: 'En route to City Center',
        fuel: 65,
        lastMaintenance: '2024-01-15',
        nextMaintenanceDue: '2024-02-15',
        equipment: ['Oxygen Tank', 'Stretcher', 'First Aid Kit'],
        mileage: 38450,
        capacity: 1,
        assignedDriver: 'Driver John Kamau',
        assignedParamedic: 'Paramedic Mary Wanjiku'
    },
    {
        id: 'AMB-003',
        vehicleNumber: 'KAA 003X',
        type: 'Advanced Life Support (ALS)',
        status: 'Available',
        location: 'Hospital Parking',
        fuel: 90,
        lastMaintenance: '2024-01-18',
        nextMaintenanceDue: '2024-02-18',
        equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Spine Board', 'Ventilator'],
        mileage: 28900,
        capacity: 2,
        assignedDriver: null,
        assignedParamedic: null
    },
    {
        id: 'AMB-004',
        vehicleNumber: 'KAA 004X',
        type: 'Basic Life Support (BLS)',
        status: 'On Mission',
        location: 'Responding to emergency',
        fuel: 55,
        lastMaintenance: '2024-01-12',
        nextMaintenanceDue: '2024-02-12',
        equipment: ['Oxygen Tank', 'Stretcher', 'First Aid Kit'],
        mileage: 52100,
        capacity: 1,
        assignedDriver: 'Driver Peter Ochieng',
        assignedParamedic: 'Paramedic Sarah Njeri'
    },
    {
        id: 'AMB-005',
        vehicleNumber: 'KAA 005X',
        type: 'Advanced Life Support (ALS)',
        status: 'Available',
        location: 'Hospital Parking',
        fuel: 70,
        lastMaintenance: '2024-01-20',
        nextMaintenanceDue: '2024-02-20',
        equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Spine Board'],
        mileage: 31200,
        capacity: 2,
        assignedDriver: null,
        assignedParamedic: null
    },
    {
        id: 'AMB-006',
        vehicleNumber: 'KAA 006X',
        type: 'Basic Life Support (BLS)',
        status: 'Maintenance',
        location: 'Workshop',
        fuel: 20,
        lastMaintenance: '2024-01-21',
        nextMaintenanceDue: '2024-02-21',
        equipment: ['Oxygen Tank', 'Stretcher', 'First Aid Kit'],
        mileage: 61500,
        capacity: 1,
        assignedDriver: null,
        assignedParamedic: null
    }
];



const initialSuppliersData = [
    {
        id: 'SUP-001',
        name: 'PharmaCorp',
        contact: 'John Doe',
        email: 'john@pharmacorp.com',
        address: '123 Pharma Way, Industrial Area',
        status: 'Active',
        products: 45,
        orders: 12
    },
    {
        id: 'SUP-002',
        name: 'MediSupply',
        contact: 'Jane Smith',
        email: 'jane@medisupply.com',
        address: '456 Medical Ave, City Center',
        status: 'Active',
        products: 32,
        orders: 8
    },
    {
        id: 'SUP-003',
        name: 'HealthCare Ltd',
        contact: 'Robert Johnson',
        email: 'robert@healthcare.com',
        address: '789 Health Blvd, Westlands',
        status: 'Active',
        products: 28,
        orders: 5
    }
];

const initialDispatchRequestsData = [
    {
        id: 'REQ-001',
        requestDate: '2024-01-21T08:30:00',
        requestType: 'Emergency', // Emergency, Transfer, Scheduled
        priority: 'Critical', // Critical, High, Medium, Low
        callerName: 'John Doe',
        callerPhone: '0700123456',
        patientName: 'Jane Doe',
        patientAge: 45,
        patientGender: 'Female',
        condition: 'Cardiac arrest',
        pickupLocation: '123 Main Street, Nairobi',
        pickupCoordinates: { lat: -1.2864, lng: 36.8172 },
        destination: 'Emergency Department',
        destinationCoordinates: { lat: -1.2921, lng: 36.8219 },
        status: 'Dispatched', // Pending, Dispatched, En Route, Arrived, Completed, Cancelled
        assignedAmbulance: 'AMB-004',
        dispatchTime: '2024-01-21T08:32:00',
        responseTime: 2, // minutes
        notes: 'Patient unconscious, CPR in progress',
        dispatchedBy: 'Dispatcher Alice'
    },
    {
        id: 'REQ-002',
        requestDate: '2024-01-21T10:15:00',
        requestType: 'Transfer',
        priority: 'Medium',
        callerName: 'Dr. Smith',
        callerPhone: '0700234567',
        patientName: 'Robert Johnson',
        patientAge: 62,
        patientGender: 'Male',
        condition: 'Post-surgery transfer',
        pickupLocation: 'Ward 5, Bed 12',
        pickupCoordinates: null,
        destination: 'City General Hospital',
        destinationCoordinates: { lat: -1.3028, lng: 36.8150 },
        status: 'En Route',
        assignedAmbulance: 'AMB-002',
        dispatchTime: '2024-01-21T10:20:00',
        responseTime: 5,
        notes: 'Patient stable, requires oxygen during transfer',
        dispatchedBy: 'Dispatcher Bob'
    },
    {
        id: 'REQ-003',
        requestDate: '2024-01-21T14:45:00',
        requestType: 'Emergency',
        priority: 'High',
        callerName: 'Mary Wanjiru',
        callerPhone: '0700345678',
        patientName: 'David Kamau',
        patientAge: 28,
        patientGender: 'Male',
        condition: 'Traffic accident, suspected fractures',
        pickupLocation: 'Uhuru Highway, near Museum',
        pickupCoordinates: { lat: -1.2833, lng: 36.8167 },
        destination: 'Emergency Department',
        destinationCoordinates: { lat: -1.2921, lng: 36.8219 },
        status: 'Pending',
        assignedAmbulance: null,
        dispatchTime: null,
        responseTime: null,
        notes: 'Multiple casualties reported',
        dispatchedBy: null
    }
];

const initialAmbulanceTripsData = [
    {
        id: 'TRIP-001',
        requestId: 'REQ-001',
        ambulanceId: 'AMB-004',
        driver: 'Driver Peter Ochieng',
        paramedic: 'Paramedic Sarah Njeri',
        startTime: '2024-01-21T08:32:00',
        pickupTime: '2024-01-21T08:42:00',
        arrivalTime: null,
        endTime: null,
        distance: 8.5, // km
        status: 'In Progress', // In Progress, Completed, Cancelled
        route: ['Hospital', 'Main Street', 'Emergency Response'],
        vitalsRecorded: [
            { time: '08:43', bp: '90/60', pulse: 120, respiration: 22, spo2: 92 }
        ],
        treatmentGiven: ['CPR resumed', 'Oxygen administered', 'IV line established'],
        patientHandedTo: null,
        fuelUsed: 2.1,
        notes: 'Patient critical, continuous monitoring'
    },
    {
        id: 'TRIP-002',
        requestId: 'REQ-002',
        ambulanceId: 'AMB-002',
        driver: 'Driver John Kamau',
        paramedic: 'Paramedic Mary Wanjiku',
        startTime: '2024-01-21T10:20:00',
        pickupTime: '2024-01-21T10:25:00',
        arrivalTime: null,
        endTime: null,
        distance: 12.3,
        status: 'In Progress',
        route: ['Hospital Ward 5', 'Ring Road', 'City General Hospital'],
        vitalsRecorded: [
            { time: '10:26', bp: '130/85', pulse: 78, respiration: 16, spo2: 98 }
        ],
        treatmentGiven: ['Oxygen support maintained'],
        patientHandedTo: null,
        fuelUsed: 3.5,
        notes: 'Routine transfer, patient stable'
    }
];

const initialAmbulanceCrewData = [
    {
        id: 'CREW-001',
        name: 'Driver John Kamau',
        role: 'Driver',
        phone: '0700111222',
        licenseNumber: 'DL-12345',
        licenseExpiry: '2025-12-31',
        status: 'On Duty',
        currentAssignment: 'AMB-002',
        shiftStart: '2024-01-21T06:00:00',
        shiftEnd: '2024-01-21T18:00:00',
        certifications: ['Emergency Vehicle Operation', 'First Aid']
    },
    {
        id: 'CREW-002',
        name: 'Paramedic Mary Wanjiku',
        role: 'Paramedic',
        phone: '0700222333',
        licenseNumber: 'PM-67890',
        licenseExpiry: '2025-06-30',
        status: 'On Duty',
        currentAssignment: 'AMB-002',
        shiftStart: '2024-01-21T06:00:00',
        shiftEnd: '2024-01-21T18:00:00',
        certifications: ['Advanced Life Support', 'Pediatric Emergency Care', 'Trauma Care']
    },
    {
        id: 'CREW-003',
        name: 'Driver Peter Ochieng',
        role: 'Driver',
        phone: '0700333444',
        licenseNumber: 'DL-54321',
        licenseExpiry: '2026-03-15',
        status: 'On Duty',
        currentAssignment: 'AMB-004',
        shiftStart: '2024-01-21T06:00:00',
        shiftEnd: '2024-01-21T18:00:00',
        certifications: ['Emergency Vehicle Operation', 'First Aid', 'Defensive Driving']
    },
    {
        id: 'CREW-004',
        name: 'Paramedic Sarah Njeri',
        role: 'Paramedic',
        phone: '0700444555',
        licenseNumber: 'PM-09876',
        licenseExpiry: '2025-09-20',
        status: 'On Duty',
        currentAssignment: 'AMB-004',
        shiftStart: '2024-01-21T06:00:00',
        shiftEnd: '2024-01-21T18:00:00',
        certifications: ['Advanced Life Support', 'Cardiac Emergency Response']
    },
    {
        id: 'CREW-005',
        name: 'Driver James Mwangi',
        role: 'Driver',
        phone: '0700555666',
        licenseNumber: 'DL-11111',
        licenseExpiry: '2025-11-10',
        status: 'Off Duty',
        currentAssignment: null,
        shiftStart: null,
        shiftEnd: null,
        certifications: ['Emergency Vehicle Operation']
    },
    {
        id: 'CREW-006',
        name: 'Paramedic Grace Akinyi',
        role: 'Paramedic',
        phone: '0700666777',
        licenseNumber: 'PM-22222',
        licenseExpiry: '2026-01-05',
        status: 'Off Duty',
        currentAssignment: null,
        shiftStart: null,
        shiftEnd: null,
        certifications: ['Advanced Life Support', 'Neonatal Emergency Care']
    }
];

// Theatre/Operating Room Module Data (WHO & Joint Commission Compliant)
const initialOperatingRoomsData = [
    {
        id: 'OT-001',
        name: 'Operating Theatre 1',
        type: 'Major', // Major, Minor, Specialized
        status: 'Available', // Available, In Use, Cleaning, Maintenance, Out of Service
        capacity: 'Large',
        equipment: ['Anaesthesia Machine', 'Operating Table', 'Surgical Lights', 'Electrosurgical Unit', 'Patient Monitor', 'Defibrillator', 'Suction Unit', 'X-Ray Viewer'],
        specializations: ['General Surgery', 'Orthopedics', 'Cardiac Surgery'],
        lastCleaned: '2024-01-21T06:00:00',
        lastMaintenance: '2024-01-15',
        nextMaintenanceDue: '2024-02-15',
        temperature: 22, // Celsius
        humidity: 55, // percentage
        airChangesPerHour: 20
    },
    {
        id: 'OT-002',
        name: 'Operating Theatre 2',
        type: 'Major',
        status: 'In Use',
        capacity: 'Medium',
        equipment: ['Anaesthesia Machine', 'Operating Table', 'Surgical Lights', 'Patient Monitor', 'Suction Unit'],
        specializations: ['General Surgery', 'Gynecology'],
        lastCleaned: '2024-01-21T08:00:00',
        lastMaintenance: '2024-01-18',
        nextMaintenanceDue: '2024-02-18',
        temperature: 21,
        humidity: 50,
        airChangesPerHour: 20
    },
    {
        id: 'OT-003',
        name: 'Minor Theatre',
        type: 'Minor',
        status: 'Available',
        capacity: 'Small',
        equipment: ['Operating Table', 'Surgical Lights', 'Patient Monitor', 'Suction Unit'],
        specializations: ['Minor Procedures', 'ENT', 'Plastic Surgery'],
        lastCleaned: '2024-01-21T07:00:00',
        lastMaintenance: '2024-01-20',
        nextMaintenanceDue: '2024-02-20',
        temperature: 23,
        humidity: 52,
        airChangesPerHour: 15
    }
];

const initialSurgerySchedulesData = [
    {
        id: 'SURG-001',
        patientId: 'P-001',
        patientName: 'John Smith',
        age: 45,
        gender: 'Male',
        procedure: 'Laparoscopic Cholecystectomy',
        procedureType: 'Elective', // Emergency, Elective, Urgent
        surgeon: 'Dr. Sarah Johnson',
        assistantSurgeon: 'Dr. Michael Brown',
        anaesthetist: 'Dr. Emily White',
        nurses: ['Nurse Jane Doe', 'Nurse Mary Wilson'],
        scheduledDate: '2024-01-22',
        scheduledTime: '09:00',
        estimatedDuration: 120, // minutes
        operatingRoom: 'OT-001',
        status: 'Scheduled', // Scheduled, Pre-Op, In Progress, Post-Op, Completed, Cancelled
        priority: 'Medium', // Low, Medium, High, Critical
        diagnosis: 'Chronic cholecystitis with cholelithiasis',
        preOpChecklist: null,
        intraOpDetails: null,
        postOpDetails: null,
        anaesthesiaRecord: null,
        consentObtained: true,
        consentDate: '2024-01-20',
        bloodGroupChecked: true,
        bloodGroup: 'O+',
        allergies: ['Penicillin'],
        specialRequirements: ['Cross-match 2 units blood'],
        estimatedCost: 250000
    },
    {
        id: 'SURG-002',
        patientId: 'P-002',
        patientName: 'Mary Johnson',
        age: 32,
        gender: 'Female',
        procedure: 'Emergency Appendectomy',
        procedureType: 'Emergency',
        surgeon: 'Dr. Robert Lee',
        assistantSurgeon: 'Dr. Michael Brown',
        anaesthetist: 'Dr. Emily White',
        nurses: ['Nurse Jane Doe', 'Nurse Patricia Green'],
        scheduledDate: '2024-01-21',
        scheduledTime: '15:00',
        estimatedDuration: 60,
        operatingRoom: 'OT-002',
        status: 'In Progress',
        priority: 'Critical',
        diagnosis: 'Acute appendicitis',
        preOpChecklist: {
            signIn: { completed: true, time: '2024-01-21T14:45:00' },
            timeOut: { completed: true, time: '2024-01-21T14:58:00' },
            signOut: { completed: false, time: null }
        },
        intraOpDetails: {
            startTime: '2024-01-21T15:00:00',
            incisionTime: '2024-01-21T15:10:00',
            findings: 'Inflamed appendix, no perforation'
        },
        postOpDetails: null,
        consentObtained: true,
        consentDate: '2024-01-21',
        bloodGroupChecked: true,
        bloodGroup: 'A+',
        allergies: [],
        specialRequirements: [],
        estimatedCost: 180000
    },
    {
        id: 'SURG-003',
        patientId: 'P-003',
        patientName: 'David Williams',
        age: 58,
        gender: 'Male',
        procedure: 'Total Knee Replacement (Right)',
        procedureType: 'Elective',
        surgeon: 'Dr. James Anderson',
        assistantSurgeon: 'Dr. Sarah Johnson',
        anaesthetist: 'Dr. Thomas Clark',
        nurses: ['Nurse Mary Wilson', 'Nurse Linda Martinez'],
        scheduledDate: '2024-01-23',
        scheduledTime: '08:00',
        estimatedDuration: 180,
        operatingRoom: 'OT-001',
        status: 'Scheduled',
        priority: 'Medium',
        diagnosis: 'Severe osteoarthritis of right knee',
        preOpChecklist: null,
        intraOpDetails: null,
        postOpDetails: null,
        anaesthesiaRecord: null,
        consentObtained: true,
        consentDate: '2024-01-18',
        bloodGroupChecked: true,
        bloodGroup: 'B+',
        allergies: ['Codeine'],
        specialRequirements: ['Cross-match 4 units blood', 'Prosthesis confirmed'],
        estimatedCost: 450000
    }
];

// WHO Surgical Safety Checklist Data
const initialSurgicalChecklistsData = [
    {
        id: 'CHECK-002',
        surgeryId: 'SURG-002',
        // Sign In (Before Anaesthesia)
        signIn: {
            completed: true,
            time: '2024-01-21T14:45:00',
            confirmedBy: 'Nurse Jane Doe',
            items: {
                patientIdentityConfirmed: true,
                siteMarked: true,
                anaesthesiaCheckComplete: true,
                pulseOximeterFunctional: true,
                allergiesKnown: true,
                allergyList: [],
                aspirationRiskAssessed: true,
                aspirationRisk: 'Low',
                bloodLossRiskAssessed: true,
                bloodLossRisk: 'Minimal (<500ml)'
            }
        },
        // Time Out (Before Skin Incision)
        timeOut: {
            completed: true,
            time: '2024-01-21T14:58:00',
            confirmedBy: 'Dr. Robert Lee',
            items: {
                teamMembersIntroduced: true,
                patientNameProcedureSiteConfirmed: true,
                antibioticProphylaxisGiven: true,
                antibioticTime: '2024-01-21T14:50:00',
                essentialImagingDisplayed: true,
                anticipatedCriticalEvents: {
                    surgeon: 'Standard appendectomy, minimal blood loss expected',
                    anaesthetist: 'No specific concerns',
                    nursing: 'All equipment ready'
                },
                equipmentSterilityConfirmed: true
            }
        },
        // Sign Out (Before Patient Leaves OR)
        signOut: {
            completed: false,
            time: null,
            confirmedBy: null,
            items: {
                procedureRecorded: false,
                instrumentCountCorrect: false,
                spongeCountCorrect: false,
                needleCountCorrect: false,
                specimenLabeled: false,
                equipmentProblemsAddressed: false,
                keyRecoveryPlanReviewed: false
            }
        }
    }
];

const initialAnaesthesiaRecordsData = [
    {
        id: 'ANAES-002',
        surgeryId: 'SURG-002',
        patientId: 'P-002',
        anaesthetist: 'Dr. Emily White',
        assistantAnaesthetist: null,
        preOpAssessment: {
            date: '2024-01-21T14:30:00',
            asaClass: 'ASA I', // ASA I-VI classification
            weight: 65, // kg
            height: 165, // cm
            bmi: 23.9,
            mallampatiScore: 'Class II',
            thyromedtalDistance: '>6.5cm',
            dentition: 'Good',
            cardiovascularSystem: 'Normal',
            respiratorySystem: 'Normal',
            specialConcerns: 'None'
        },
        anaesthesiaType: 'General Anaesthesia', // General, Spinal, Epidural, Local, Sedation
        induction: {
            time: '2024-01-21T14:50:00',
            agents: ['Propofol 150mg IV', 'Fentanyl 100mcg IV', 'Rocuronium 50mg IV'],
            intubation: {
                attempted: true,
                method: 'Direct Laryngoscopy',
                tubeSize: '7.0mm cuffed ETT',
                attempts: 1,
                ease: 'Easy',
                cuffPressure: '25cmH2O'
            }
        },
        maintenance: {
            agents: ['Sevoflurane 1.5-2%', 'O2/Air mixture'],
            ventilation: {
                mode: 'Controlled',
                tidalVolume: 450,
                rate: 12,
                peep: 5,
                fio2: 40
            },
            fluidsGiven: ['Ringer Lactate 1000ml'],
            bloodProductsGiven: []
        },
        vitalsMonitoring: [
            { time: '15:00', hr: 78, bp: '120/75', spo2: 99, etco2: 35, temp: 36.8 },
            { time: '15:15', hr: 82, bp: '125/78', spo2: 98, etco2: 36, temp: 36.7 },
            { time: '15:30', hr: 80, bp: '122/76', spo2: 99, etco2: 35, temp: 36.8 }
        ],
        complications: [],
        emergence: {
            time: null,
            agents: ['Neostigmine 2.5mg', 'Glycopyrrolate 0.4mg'],
            extubationTime: null,
            condition: null
        },
        postOpOrders: 'Transfer to recovery room, Monitor vitals q15min, O2 via face mask',
        totalDuration: null
    }
];

const initialSurgicalEquipmentData = [
    {
        id: 'EQUIP-001',
        name: 'Laparoscopic Surgical Set',
        category: 'Instruments',
        status: 'Available', // Available, In Use, Sterilization, Maintenance, Damaged
        location: 'Sterile Store',
        lastSterilized: '2024-01-20T16:00:00',
        sterilizationMethod: 'Autoclave',
        sterilizationLoadNumber: 'ST-2024-0120-003',
        expiryDate: '2024-01-27',
        assignedTo: null,
        maintenanceSchedule: 'Monthly',
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-02-10'
    },
    {
        id: 'EQUIP-002',
        name: 'Orthopedic Knee Replacement Set',
        category: 'Instruments',
        status: 'Sterilization',
        location: 'CSSD',
        lastSterilized: '2024-01-21T10:00:00',
        sterilizationMethod: 'Autoclave',
        sterilizationLoadNumber: 'ST-2024-0121-001',
        expiryDate: '2024-01-28',
        assignedTo: null,
        maintenanceSchedule: 'Monthly',
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-02-05'
    },
    {
        id: 'EQUIP-003',
        name: 'General Surgery Basic Set',
        category: 'Instruments',
        status: 'In Use',
        location: 'OT-002',
        lastSterilized: '2024-01-21T08:00:00',
        sterilizationMethod: 'Autoclave',
        sterilizationLoadNumber: 'ST-2024-0121-002',
        expiryDate: '2024-01-28',
        assignedTo: 'SURG-002',
        maintenanceSchedule: 'Monthly',
        lastMaintenance: '2024-01-12',
        nextMaintenance: '2024-02-12'
    }
];


const initialCampsData = [
    {
        id: 'CAMP-001',
        name: 'Rural Eye Checkup Camp',
        location: 'Village North District',
        startDate: '2024-10-28',
        endDate: '2024-10-30',
        status: 'Upcoming', // Upcoming, Ongoing, Completed
        targetPatients: 500,
        registeredPatients: 12,
        description: 'Free cataract screening and vision tests for villagers.',
        organizer: 'Dr. Stone'
    },
    {
        id: 'CAMP-002',
        name: 'General Health Camp',
        location: 'City Community Center',
        startDate: '2024-11-05',
        endDate: '2024-11-07',
        status: 'Upcoming',
        targetPatients: 1000,
        registeredPatients: 45,
        description: 'General health checkup, BP, Sugar, and BMI tests.',
        organizer: 'Dr. Sarah Wilson'
    }
];


// Queue Management Initial Data
const initialQueueEntriesData = [
    {
        id: 'Q-001',
        queueNumber: 'A-001',
        patientId: 'P-001',
        patientName: 'John Doe',
        department: 'Doctor',
        service: 'General Consultation',
        priority: 'Normal', // Emergency, Urgent, Normal
        status: 'Waiting', // Waiting, Called, InService, Completed, Cancelled
        checkInTime: new Date().toISOString(),
        calledTime: null,
        serviceStartTime: null,
        serviceEndTime: null,
        waitTime: 0,
        estimatedWait: 15,
        assignedStaff: null,
        notes: '',
        transferredFrom: null
    },
    {
        id: 'Q-002',
        queueNumber: 'P-001',
        patientId: 'P-002',
        patientName: 'Jane Smith',
        department: 'Pharmacy',
        service: 'Prescription Collection',
        priority: 'Normal',
        status: 'InService',
        checkInTime: new Date(Date.now() - 30 * 60000).toISOString(),
        calledTime: new Date(Date.now() - 5 * 60000).toISOString(),
        serviceStartTime: new Date(Date.now() - 3 * 60000).toISOString(),
        serviceEndTime: null,
        waitTime: 25,
        estimatedWait: 5,
        assignedStaff: 'Pharmacist John',
        notes: '',
        transferredFrom: 'Doctor'
    }
];


// Appointments System Initial Data
const initialAppointmentsData = [
    {
        id: 'APT-001',
        appointmentNumber: 'A-20240122-001',
        patientId: 'P-001',
        patientName: 'John Doe',
        patientPhone: '+254 700 123 456',
        patientEmail: 'john.doe@email.com',
        doctorId: 'D-001',
        doctorName: 'Dr. Sarah Wilson',
        department: 'General Medicine',
        service: 'Consultation',
        date: new Date().toISOString().split('T')[0], // Today
        startTime: '10:00',
        endTime: '10:30',
        duration: 30,
        status: 'Scheduled', // Scheduled/Confirmed/CheckedIn/InProgress/Completed/Cancelled/NoShow
        priority: 'Regular',
        reason: 'Annual checkup',
        notes: '',
        createdAt: new Date().toISOString(),
        createdBy: 'Reception Staff',
        confirmedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationReason: '',
        reminderSent: false,
        consultationFee: 500,
        paid: false
    },
    {
        id: 'APT-002',
        appointmentNumber: 'A-20240122-002',
        patientId: 'P-002',
        patientName: 'Jane Smith',
        patientPhone: '+254 700 234 567',
        patientEmail: 'jane.smith@email.com',
        doctorId: 'D-002',
        doctorName: 'Dr. James Anderson',
        department: 'Pediatrics',
        service: 'Follow-up',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        startTime: '14:00',
        endTime: '14:30',
        duration: 30,
        status: 'Confirmed',
        priority: 'Regular',
        reason: 'Follow-up consultation',
        notes: 'Patient requested afternoon slot',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: 'Reception Staff',
        confirmedAt: new Date().toISOString(),
        completedAt: null,
        cancelledAt: null,
        cancellationReason: '',
        reminderSent: true,
        consultationFee: 500,
        paid: true
    }
];

const initialCasesData = [
    {
        id: 'CASE-2024-001',
        patientId: 'P-001',
        status: 'Open',
        startDate: '2024-01-15',
        endDate: null,
        type: 'OPD',
        department: 'General Medicine',
        chiefComplaint: 'Persistent Headache',
        assignedDoctorId: 'U-001'
    }
];

export const DataProvider = ({ children }) => {
    // Module State
    const [modules, setModules] = useState(initialModules);

    const toggleModule = (moduleId) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, enabled: !m.enabled } : m));
    };

    // Insurance Module State - USING API
    const [insuranceProviders, setInsuranceProviders] = useState([]);
    const [insuranceClaims, setInsuranceClaims] = useState([]);

    // Fetch Insurance data from API
    useEffect(() => {
        const fetchInsuranceData = async () => {
            try {
                const [providers, claims] = await Promise.all([
                    insuranceAPI.getProviders(),
                    insuranceAPI.getClaims()
                ]);
                setInsuranceProviders(providers);
                setInsuranceClaims(claims);
            } catch (error) {
                console.error('Error fetching insurance data:', error);
            }
        };
        fetchInsuranceData();
    }, []);

    const addInsuranceProvider = async (providerData) => {
        try {
            const newProvider = await insuranceAPI.addProvider(providerData);
            setInsuranceProviders(prev => [...prev, newProvider]);
            return newProvider;
        } catch (error) {
            console.error('Error adding insurance provider:', error);
            throw error;
        }
    };

    const submitInsuranceClaim = async (claimData) => {
        try {
            const newClaim = await insuranceAPI.submitClaim(claimData);
            setInsuranceClaims(prev => [newClaim, ...prev]);
            return newClaim;
        } catch (error) {
            console.error('Error submitting insurance claim:', error);
            throw error;
        }
    };

    // Load data from localStorage or use initial data
    // Load data from localStorage or use initial data
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch patients from API on mount
    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchPatients();
        }
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientsAPI.getAll();
            setPatients(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch patients:", err);
            setError("Failed to load patients. Please try again.");
            // Fallback to local storage or empty array if API fails (optional, but good for resilience during migration)
            // For now, we'll just leave it empty or show error
        } finally {
            setLoading(false);
        }
    };

    // CRUD Operations for Patients
    const addPatient = async (patientData) => {
        try {
            const newPatient = await patientsAPI.create(patientData);
            setPatients(prev => [newPatient, ...prev]);
            return { success: true, patient: newPatient };
        } catch (err) {
            console.error("Failed to add patient:", err);
            return { success: false, error: err.message };
        }
    };

    const updatePatient = async (id, patientData) => {
        try {
            const updatedPatient = await patientsAPI.update(id, patientData);
            setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
            return { success: true, patient: updatedPatient };
        } catch (err) {
            console.error("Failed to update patient:", err);
            return { success: false, error: err.message };
        }
    };

    const deletePatient = async (id) => {
        try {
            await patientsAPI.delete(id);
            setPatients(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (err) {
            console.error("Failed to delete patient:", err);
            return { success: false, error: err.message };
        }
    };

    // ==================== APPOINTMENTS (API-BACKED) ====================
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchAppointments();
        }
    }, []);

    const fetchAppointments = async () => {
        try {
            setAppointmentsLoading(true);
            const { appointmentsAPI } = await import('../services/api');
            const data = await appointmentsAPI.getAll();
            setAppointments(data);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        } finally {
            setAppointmentsLoading(false);
        }
    };

    const addAppointment = async (appointmentData) => {
        try {
            const { appointmentsAPI } = await import('../services/api');
            const newAppointment = await appointmentsAPI.create(appointmentData);
            setAppointments(prev => [newAppointment, ...prev]);
            return { success: true, appointment: newAppointment };
        } catch (err) {
            console.error("Failed to add appointment:", err);
            return { success: false, error: err.message };
        }
    };

    const updateAppointment = async (id, appointmentData) => {
        try {
            const { appointmentsAPI } = await import('../services/api');
            const updatedAppointment = await appointmentsAPI.update(id, appointmentData);
            setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a));
            return { success: true, appointment: updatedAppointment };
        } catch (err) {
            console.error("Failed to update appointment:", err);
            return { success: false, error: err.message };
        }
    };

    // ==================== BILLS (API-BACKED) ====================
    const [bills, setBills] = useState([]);
    const [billsLoading, setBillsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchBills();
        }
    }, []);

    const fetchBills = async () => {
        try {
            setBillsLoading(true);
            const { billsAPI } = await import('../services/api');
            const data = await billsAPI.getAll();
            setBills(data);
        } catch (err) {
            console.error("Failed to fetch bills:", err);
        } finally {
            setBillsLoading(false);
        }
    };

    const addBill = async (billData) => {
        try {
            const { billsAPI } = await import('../services/api');
            const newBill = await billsAPI.create(billData);
            setBills(prev => [newBill, ...prev]);
            return { success: true, bill: newBill };
        } catch (err) {
            console.error("Failed to add bill:", err);
            return { success: false, error: err.message };
        }
    };

    const updateBill = async (id, billData) => {
        try {
            const { billsAPI } = await import('../services/api');
            const updatedBill = await billsAPI.update(id, billData);
            setBills(prev => prev.map(b => b.id === id ? updatedBill : b));
            return { success: true, bill: updatedBill };
        } catch (err) {
            console.error("Failed to update bill:", err);
            return { success: false, error: err.message };
        }
    };

    // ==================== QUEUE (API-BACKED) ====================
    const [queueEntries, setQueueEntries] = useState([]);
    const [queueLoading, setQueueLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchQueue();
        }
    }, []);

    const fetchQueue = async () => {
        try {
            setQueueLoading(true);
            const { queueAPI } = await import('../services/api');
            const data = await queueAPI.getAll();
            setQueueEntries(data);
        } catch (err) {
            console.error("Failed to fetch queue:", err);
        } finally {
            setQueueLoading(false);
        }
    };

    const addQueueEntry = async (queueData) => {
        try {
            const { queueAPI } = await import('../services/api');
            const newEntry = await queueAPI.create(queueData);
            setQueueEntries(prev => [newEntry, ...prev]);
            return { success: true, entry: newEntry };
        } catch (err) {
            console.error("Failed to add queue entry:", err);
            return { success: false, error: err.message };
        }
    };

    const updateQueueEntry = async (id, queueData) => {
        try {
            const { queueAPI } = await import('../services/api');
            const updatedEntry = await queueAPI.update(id, queueData);
            setQueueEntries(prev => prev.map(q => q.id === id ? updatedEntry : q));
            return { success: true, entry: updatedEntry };
        } catch (err) {
            console.error("Failed to update queue entry:", err);
            return { success: false, error: err.message };
        }
    };

    // ==================== SERVICES (API-BACKED) ====================
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchServices();
        }
    }, []);

    const fetchServices = async () => {
        try {
            setServicesLoading(true);
            const { servicesAPI } = await import('../services/api');
            const data = await servicesAPI.getAll();
            setServices(data);
        } catch (err) {
            console.error("Failed to fetch services:", err);
        } finally {
            setServicesLoading(false);
        }
    };

    const addService = async (serviceData) => {
        try {
            const { servicesAPI } = await import('../services/api');
            const newService = await servicesAPI.create(serviceData);
            setServices(prev => [newService, ...prev]);
            return { success: true, service: newService };
        } catch (err) {
            console.error("Failed to add service:", err);
            return { success: false, error: err.message };
        }
    };

    const updateService = async (id, serviceData) => {
        try {
            const { servicesAPI } = await import('../services/api');
            const updatedService = await servicesAPI.update(id, serviceData);
            setServices(prev => prev.map(s => s.id === id ? updatedService : s));
            return { success: true, service: updatedService };
        } catch (err) {
            console.error("Failed to update service:", err);
            return { success: false, error: err.message };
        }
    };

    // Keep existing cases state (will migrate later if needed)
    const [cases, setCases] = useState(() => {
        const saved = localStorage.getItem('hms_cases');
        return saved ? JSON.parse(saved) : initialCasesData;
    });

    // Keep prescriptions from localStorage for now (already exists)
    // Will be migrated separately to avoid breaking existing functionality


    const [financialRecords, setFinancialRecords] = useState(() => {
        const saved = localStorage.getItem('hms_financial');
        return saved ? JSON.parse(saved) : initialFinancialData;
    });

    const [clinicalRecords, setClinicalRecords] = useState(() => {
        const saved = localStorage.getItem('hms_clinical');
        return saved ? JSON.parse(saved) : initialClinicalData;
    });

    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('hms_users');
        return saved ? JSON.parse(saved) : initialUserData;
    });

    const [systemSettings, setSystemSettings] = useState(() => {
        const saved = localStorage.getItem('hms_settings');
        // Merge saved settings with initial settings to ensure new properties are included
        return saved ? { ...initialSystemSettings, ...JSON.parse(saved) } : initialSystemSettings;
    });

    const [resetHistory, setResetHistory] = useState(() => {
        const saved = localStorage.getItem('hms_reset_history');
        return saved ? JSON.parse(saved) : [];
    });


    const [servicesData, setServicesData] = useState(() => {
        const saved = localStorage.getItem('hms_services');
        return saved ? JSON.parse(saved) : initialServicesData;
    });

    const [debtRecords, setDebtRecords] = useState(() => {
        const saved = localStorage.getItem('hms_debt');
        return saved ? JSON.parse(saved) : initialDebtData;
    });

    const [walletRecords, setWalletRecords] = useState(() => {
        const saved = localStorage.getItem('hms_wallet');
        return saved ? JSON.parse(saved) : initialWalletData;
    });

    const [wards, setWards] = useState(() => {
        const saved = localStorage.getItem('hms_wards');
        return saved ? JSON.parse(saved) : initialWardsData;
    });

    const [beds, setBeds] = useState(() => {
        const saved = localStorage.getItem('hms_beds');
        return saved ? JSON.parse(saved) : initialBedsData;
    });

    const [admissions, setAdmissions] = useState(() => {
        const saved = localStorage.getItem('hms_admissions');
        return saved ? JSON.parse(saved) : initialAdmissionsData;
    });

    // ==================== INVENTORY (API-BACKED) ====================
    const [inventory, setInventory] = useState([]);
    const [inventoryLoading, setInventoryLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchInventory();
        }
    }, []);

    const fetchInventory = async () => {
        try {
            setInventoryLoading(true);
            const { inventoryAPI } = await import('../services/api');
            const data = await inventoryAPI.getAll();
            setInventory(data);
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
        } finally {
            setInventoryLoading(false);
        }
    };

    const addInventoryItem = async (itemData) => {
        try {
            const { inventoryAPI } = await import('../services/api');
            const newItem = await inventoryAPI.create(itemData);
            setInventory(prev => [...prev, newItem]);
            return { success: true, item: newItem };
        } catch (err) {
            console.error("Failed to add inventory item:", err);
            return { success: false, error: err.message };
        }
    };

    const updateInventoryItem = async (id, itemData) => {
        try {
            const { inventoryAPI } = await import('../services/api');
            const updatedItem = await inventoryAPI.update(id, itemData);
            setInventory(prev => prev.map(item => item.id === id ? updatedItem : item));
            return { success: true, item: updatedItem };
        } catch (err) {
            console.error("Failed to update inventory item:", err);
            return { success: false, error: err.message };
        }
    };

    const deleteInventoryItem = async (id) => {
        try {
            const { inventoryAPI } = await import('../services/api');
            await inventoryAPI.delete(id);
            setInventory(prev => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (err) {
            console.error("Failed to delete inventory item:", err);
            return { success: false, error: err.message };
        }
    };

    // ==================== PRESCRIPTIONS (API-BACKED) ====================
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('hms_auth_token');
        if (token) {
            fetchPrescriptions();
        }
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setPrescriptionsLoading(true);
            const { prescriptionsAPI } = await import('../services/api');
            const data = await prescriptionsAPI.getAll();
            setPrescriptions(data);
        } catch (err) {
            console.error("Failed to fetch prescriptions:", err);
        } finally {
            setPrescriptionsLoading(false);
        }
    };

    const addPrescription = async (prescriptionData) => {
        try {
            const { prescriptionsAPI } = await import('../services/api');
            const newPrescription = await prescriptionsAPI.create(prescriptionData);
            setPrescriptions(prev => [newPrescription, ...prev]);
            return { success: true, prescription: newPrescription };
        } catch (err) {
            console.error("Failed to add prescription:", err);
            return { success: false, error: err.message };
        }
    };

    const updatePrescription = async (id, prescriptionData) => {
        try {
            const { prescriptionsAPI } = await import('../services/api');
            const updatedPrescription = await prescriptionsAPI.update(id, prescriptionData);
            setPrescriptions(prev => prev.map(p => p.id === id ? updatedPrescription : p));
            return { success: true, prescription: updatedPrescription };
        } catch (err) {
            console.error("Failed to update prescription:", err);
            return { success: false, error: err.message };
        }
    };


    const [suppliers, setSuppliers] = useState(() => {
        const saved = localStorage.getItem('hms_suppliers');
        return saved ? JSON.parse(saved) : initialSuppliersData;
    });

    const [camps, setCamps] = useState(() => {
        const saved = localStorage.getItem('hms_camps');
        return saved ? JSON.parse(saved) : initialCampsData;
    });

    // Nursing Module State
    const [vitalSigns, setVitalSigns] = useState(() => {
        const saved = localStorage.getItem('hms_vital_signs');
        return saved ? JSON.parse(saved) : initialVitalSignsData;
    });

    const [nursingNotes, setNursingNotes] = useState(() => {
        const saved = localStorage.getItem('hms_nursing_notes');
        return saved ? JSON.parse(saved) : initialNursingNotesData;
    });

    const [carePlans, setCarePlans] = useState(() => {
        const saved = localStorage.getItem('hms_care_plans');
        return saved ? JSON.parse(saved) : initialCarePlansData;
    });

    const [handoverReports, setHandoverReports] = useState(() => {
        const saved = localStorage.getItem('hms_handover_reports');
        return saved ? JSON.parse(saved) : initialHandoverReportsData;
    });

    const [nursingTasks, setNursingTasks] = useState(() => {
        const saved = localStorage.getItem('hms_nursing_tasks');
        return saved ? JSON.parse(saved) : initialNursingTasksData;
    });

    const [medicationLogs, setMedicationLogs] = useState(() => {
        const saved = localStorage.getItem('hms_medication_logs');
        return saved ? JSON.parse(saved) : [];
    });

    const [labOrders, setLabOrders] = useState(() => {
        const saved = localStorage.getItem('hms_lab_orders');
        return saved ? JSON.parse(saved) : initialLabOrders;
    });

    const [labInventory, setLabInventory] = useState(() => {
        const saved = localStorage.getItem('hms_lab_inventory');
        return saved ? JSON.parse(saved) : initialLabInventory;
    });

    // HR Module State
    const [departments, setDepartments] = useState(() => {
        const saved = localStorage.getItem('hms_departments');
        return saved ? JSON.parse(saved) : initialDepartmentsData;
    });

    // HR Module State - NOW USING API
    const [employees, setEmployees] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [payroll, setPayroll] = useState([]);

    // Fetch HR data from API
    useEffect(() => {
        const fetchHRData = async () => {
            const token = localStorage.getItem('hms_auth_token');
            if (!token) return;

            try {
                const [emps, leaves, att, pay] = await Promise.all([
                    hrAPI.getEmployees(),
                    hrAPI.getLeaveRequests(),
                    hrAPI.getAttendance(),
                    hrAPI.getPayroll()
                ]);
                setEmployees(emps);
                setLeaveRequests(leaves);
                setAttendance(att);
                setPayroll(pay);
            } catch (error) {
                console.error('Error fetching HR data:', error);
            }
        };
        fetchHRData();
    }, []);

    const [shifts, setShifts] = useState(() => {
        const saved = localStorage.getItem('hms_shifts');
        return saved ? JSON.parse(saved) : initialShiftsData;
    });

    const [benefits, setBenefits] = useState(() => {
        const saved = localStorage.getItem('hms_benefits');
        return saved ? JSON.parse(saved) : initialBenefitsData;
    });

    const [jobPostings, setJobPostings] = useState(() => {
        const saved = localStorage.getItem('hms_job_postings');
        return saved ? JSON.parse(saved) : initialJobPostingsData;
    });

    const [applications, setApplications] = useState(() => {
        const saved = localStorage.getItem('hms_applications');
        return saved ? JSON.parse(saved) : initialApplicationsData;
    });

    const [onboarding, setOnboarding] = useState(() => {
        const saved = localStorage.getItem('hms_onboarding');
        return saved ? JSON.parse(saved) : initialOnboardingData;
    });

    const [performanceReviews, setPerformanceReviews] = useState(() => {
        const saved = localStorage.getItem('hms_performance_reviews');
        return saved ? JSON.parse(saved) : initialPerformanceReviewsData;
    });

    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('hms_goals');
        return saved ? JSON.parse(saved) : initialGoalsData;
    });

    const [selfServiceRequests, setSelfServiceRequests] = useState(() => {
        const saved = localStorage.getItem('hms_self_service_requests');
        return saved ? JSON.parse(saved) : initialSelfServiceRequestsData;
    });

    const [employeeDocuments, setEmployeeDocuments] = useState(() => {
        const saved = localStorage.getItem('hms_employee_documents');
        return saved ? JSON.parse(saved) : initialEmployeeDocumentsData;
    });

    const [biometricDevices, setBiometricDevices] = useState(() => {
        const saved = localStorage.getItem('hms_biometric_devices');
        return saved ? JSON.parse(saved) : initialBiometricDevicesData;
    });

    const [attendancePolicies, setAttendancePolicies] = useState(() => {
        const saved = localStorage.getItem('hms_attendance_policies');
        return saved ? JSON.parse(saved) : initialAttendancePoliciesData;
    });

    // Maternity Module State
    const [maternityPatients, setMaternityPatients] = useState(() => {
        const saved = localStorage.getItem('hms_maternity_patients');
        return saved ? JSON.parse(saved) : initialMaternityData;
    });

    const [ancVisits, setANCVisits] = useState(() => {
        const saved = localStorage.getItem('hms_anc_visits');
        return saved ? JSON.parse(saved) : initialANCVisitsData;
    });

    const [deliveryRecords, setDeliveryRecords] = useState(() => {
        const saved = localStorage.getItem('hms_delivery_records');
        return saved ? JSON.parse(saved) : initialDeliveryRecordsData;
    });

    const [newbornRecords, setNewbornRecords] = useState(() => {
        const saved = localStorage.getItem('hms_newborn_records');
        return saved ? JSON.parse(saved) : initialNewbornRecordsData;
    });

    const [pncVisits, setPNCVisits] = useState(() => {
        const saved = localStorage.getItem('hms_pnc_visits');
        return saved ? JSON.parse(saved) : initialPNCVisitsData;
    });

    // Ambulance Module State - NOW USING API
    const [ambulanceFleet, setAmbulanceFleet] = useState([]);
    const [dispatchRequests, setDispatchRequests] = useState([]);
    const [ambulanceTrips, setAmbulanceTrips] = useState([]);

    // Fetch ambulance data from API
    useEffect(() => {
        const fetchAmbulanceData = async () => {
            const token = localStorage.getItem('hms_auth_token');
            if (!token) return;

            try {
                const [fleet, requests, trips] = await Promise.all([
                    ambulanceAPI.getFleet(),
                    ambulanceAPI.getRequests(),
                    ambulanceAPI.getTrips()
                ]);
                setAmbulanceFleet(fleet);
                setDispatchRequests(requests);
                setAmbulanceTrips(trips);
            } catch (error) {
                console.error('Error fetching ambulance data:', error);
            }
        };
        fetchAmbulanceData();
    }, []);

    const [ambulanceCrew, setAmbulanceCrew] = useState(() => {
        const saved = localStorage.getItem('hms_ambulance_crew');
        return saved ? JSON.parse(saved) : initialAmbulanceCrewData;
    });

    // Theatre/Operating Room Module State
    const [operatingRooms, setOperatingRooms] = useState(() => {
        const saved = localStorage.getItem('hms_operating_rooms');
        return saved ? JSON.parse(saved) : initialOperatingRoomsData;
    });

    const [surgerySchedules, setSurgerySchedules] = useState(() => {
        const saved = localStorage.getItem('hms_surgery_schedules');
        return saved ? JSON.parse(saved) : initialSurgerySchedulesData;
    });

    const [surgicalChecklists, setSurgicalChecklists] = useState(() => {
        const saved = localStorage.getItem('hms_surgical_checklists');
        return saved ? JSON.parse(saved) : initialSurgicalChecklistsData;
    });

    const [anaesthesiaRecords, setAnaesthesiaRecords] = useState(() => {
        const saved = localStorage.getItem('hms_anaesthesia_records');
        return saved ? JSON.parse(saved) : initialAnaesthesiaRecordsData;
    });

    const [surgicalEquipment, setSurgicalEquipment] = useState(() => {
        const saved = localStorage.getItem('hms_surgical_equipment');
        return saved ? JSON.parse(saved) : initialSurgicalEquipmentData;
    });

    // Triage Module State
    const [triageQueue, setTriageQueue] = useState(() => {
        const saved = localStorage.getItem('hms_triage_queue');
        return saved ? JSON.parse(saved) : [];
    });

    // Queue Management State - NOW USING API (see lines ~2064)
    // Appointments State - NOW USING API (see lines ~1974)
    // Bills - NOW USING API (see lines ~2019)


    // Admin Module State - Audit & Security
    const initialAuditLogs = [
        { id: 'AUD-001', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'John Admin', action: 'User Created', target: 'Dr. Sarah Wilson', ipAddress: '192.168.1.105', status: 'Success' },
        { id: 'AUD-002', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'System', action: 'Data Backup', target: 'Full Database', ipAddress: 'System', status: 'Success' },
        { id: 'AUD-003', timestamp: new Date(Date.now() - 10800000).toISOString(), user: 'John Admin', action: 'Settings Updated', target: 'Security Policies', ipAddress: '192.168.1.105', status: 'Success' }
    ];

    const initialLoginHistory = [
        { id: 'LOG-001', user: 'John Admin', loginTime: new Date(Date.now() - 1800000).toISOString(), ipAddress: '192.168.1.105', device: 'Chrome on Windows', status: 'Success' },
        { id: 'LOG-002', user: 'Dr. Sarah Wilson', loginTime: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.112', device: 'Safari on MacOS', status: 'Success' },
        { id: 'LOG-003', user: 'Unknown', loginTime: new Date(Date.now() - 5400000).toISOString(), ipAddress: '10.0.0.45', device: 'Firefox on Linux', status: 'Failed' }
    ];

    const initialSecuritySettings = {
        passwordStrength: true,
        sessionTimeout: 30,
        maxFailedLogins: 5,
        twoFactorAuth: false
    };

    const initialBackupHistory = [
        { id: 'BKP-001', date: new Date(Date.now() - 86400000).toISOString(), size: '256 MB', type: 'Full Backup', status: 'Completed' },
        { id: 'BKP-002', date: new Date(Date.now() - 172800000).toISOString(), size: '248 MB', type: 'Full Backup', status: 'Completed' }
    ];

    const [auditLogs, setAuditLogs] = useState(() => {
        const saved = localStorage.getItem('hms_audit_logs');
        return saved ? JSON.parse(saved) : initialAuditLogs;
    });

    const [loginHistory, setLoginHistory] = useState(() => {
        const saved = localStorage.getItem('hms_login_history');
        return saved ? JSON.parse(saved) : initialLoginHistory;
    });

    const [securitySettings, setSecuritySettings] = useState(() => {
        const saved = localStorage.getItem('hms_security_settings');
        return saved ? JSON.parse(saved) : initialSecuritySettings;
    });

    const [backupHistory, setBackupHistory] = useState(() => {
        const saved = localStorage.getItem('hms_backup_history');
        return saved ? JSON.parse(saved) : initialBackupHistory;
    });

    // User Management State
    // User Management State
    const [usersData, setUsersData] = useState(() => {
        const saved = localStorage.getItem('hms_users');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Check if data is stale (missing email field)
                if (parsed.length > 0 && !parsed[0].email) {
                    console.log('Detected stale user data, resetting to defaults...');
                    return initialUserData;
                }
                return parsed;
            } catch (e) {
                console.error('Error parsing saved users, resetting...', e);
                return initialUserData;
            }
        }
        return initialUserData;
    });

    useEffect(() => { localStorage.setItem('hms_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
    useEffect(() => { localStorage.setItem('hms_login_history', JSON.stringify(loginHistory)); }, [loginHistory]);
    useEffect(() => { localStorage.setItem('hms_security_settings', JSON.stringify(securitySettings)); }, [securitySettings]);
    useEffect(() => { localStorage.setItem('hms_backup_history', JSON.stringify(backupHistory)); }, [backupHistory]);

    // Printer Settings State
    const initialPrinterSettings = {
        defaultPrinter: 'HP LaserJet Pro',
        receiptPrinter: 'Epson TM-T20',
        labelPrinter: 'Zebra ZD220',
        paperSize: 'A4',
        orientation: 'Portrait',
        quality: 'High',
        autoPrint: {
            invoices: true,
            prescriptions: false,
            labReports: false,
            receipts: true,
            patientLabels: false
        },
        margins: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    };

    const [printerSettings, setPrinterSettings] = useState(() => {
        const saved = localStorage.getItem('hms_printer_settings');
        return saved ? JSON.parse(saved) : initialPrinterSettings;
    });

    useEffect(() => { localStorage.setItem('hms_printer_settings', JSON.stringify(printerSettings)); }, [printerSettings]);



    // useEffect(() => { localStorage.setItem('hms_patients', JSON.stringify(patients)); }, [patients]);
    useEffect(() => { localStorage.setItem('hms_financial', JSON.stringify(financialRecords)); }, [financialRecords]);
    useEffect(() => { localStorage.setItem('hms_clinical', JSON.stringify(clinicalRecords)); }, [clinicalRecords]);
    useEffect(() => { localStorage.setItem('hms_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('hms_settings', JSON.stringify(systemSettings)); }, [systemSettings]);
    useEffect(() => { localStorage.setItem('hms_reset_history', JSON.stringify(resetHistory)); }, [resetHistory]);

    useEffect(() => { localStorage.setItem('hms_services', JSON.stringify(servicesData)); }, [servicesData]);
    useEffect(() => { localStorage.setItem('hms_debt', JSON.stringify(debtRecords)); }, [debtRecords]);
    useEffect(() => { localStorage.setItem('hms_wallet', JSON.stringify(walletRecords)); }, [walletRecords]);
    useEffect(() => { localStorage.setItem('hms_wards', JSON.stringify(wards)); }, [wards]);
    useEffect(() => { localStorage.setItem('hms_beds', JSON.stringify(beds)); }, [beds]);
    useEffect(() => { localStorage.setItem('hms_admissions', JSON.stringify(admissions)); }, [admissions]);
    useEffect(() => { localStorage.setItem('hms_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('hms_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
    useEffect(() => { localStorage.setItem('hms_camps', JSON.stringify(camps)); }, [camps]);
    useEffect(() => { localStorage.setItem('hms_lab_orders', JSON.stringify(labOrders)); }, [labOrders]);
    useEffect(() => { localStorage.setItem('hms_lab_inventory', JSON.stringify(labInventory)); }, [labInventory]);

    // Nursing Module persistence
    useEffect(() => { localStorage.setItem('hms_vital_signs', JSON.stringify(vitalSigns)); }, [vitalSigns]);
    useEffect(() => { localStorage.setItem('hms_nursing_notes', JSON.stringify(nursingNotes)); }, [nursingNotes]);
    useEffect(() => { localStorage.setItem('hms_care_plans', JSON.stringify(carePlans)); }, [carePlans]);
    useEffect(() => { localStorage.setItem('hms_handover_reports', JSON.stringify(handoverReports)); }, [handoverReports]);
    useEffect(() => { localStorage.setItem('hms_nursing_tasks', JSON.stringify(nursingTasks)); }, [nursingTasks]);
    useEffect(() => { localStorage.setItem('hms_medication_logs', JSON.stringify(medicationLogs)); }, [medicationLogs]);

    // HR Module persistence
    useEffect(() => { localStorage.setItem('hms_departments', JSON.stringify(departments)); }, [departments]);
    useEffect(() => { localStorage.setItem('hms_employees', JSON.stringify(employees)); }, [employees]);
    useEffect(() => { localStorage.setItem('hms_leave_requests', JSON.stringify(leaveRequests)); }, [leaveRequests]);
    useEffect(() => { localStorage.setItem('hms_attendance', JSON.stringify(attendance)); }, [attendance]);
    useEffect(() => { localStorage.setItem('hms_payroll', JSON.stringify(payroll)); }, [payroll]);
    useEffect(() => { localStorage.setItem('hms_shifts', JSON.stringify(shifts)); }, [shifts]);
    useEffect(() => { localStorage.setItem('hms_benefits', JSON.stringify(benefits)); }, [benefits]);
    useEffect(() => { localStorage.setItem('hms_job_postings', JSON.stringify(jobPostings)); }, [jobPostings]);
    useEffect(() => { localStorage.setItem('hms_applications', JSON.stringify(applications)); }, [applications]);
    useEffect(() => { localStorage.setItem('hms_onboarding', JSON.stringify(onboarding)); }, [onboarding]);
    useEffect(() => { localStorage.setItem('hms_performance_reviews', JSON.stringify(performanceReviews)); }, [performanceReviews]);
    useEffect(() => { localStorage.setItem('hms_goals', JSON.stringify(goals)); }, [goals]);
    useEffect(() => { localStorage.setItem('hms_self_service_requests', JSON.stringify(selfServiceRequests)); }, [selfServiceRequests]);
    useEffect(() => { localStorage.setItem('hms_employee_documents', JSON.stringify(employeeDocuments)); }, [employeeDocuments]);
    useEffect(() => { localStorage.setItem('hms_biometric_devices', JSON.stringify(biometricDevices)); }, [biometricDevices]);
    useEffect(() => { localStorage.setItem('hms_attendance_policies', JSON.stringify(attendancePolicies)); }, [attendancePolicies]);

    // Maternity Module Persistence
    useEffect(() => { localStorage.setItem('hms_maternity_patients', JSON.stringify(maternityPatients)); }, [maternityPatients]);
    useEffect(() => { localStorage.setItem('hms_anc_visits', JSON.stringify(ancVisits)); }, [ancVisits]);
    useEffect(() => { localStorage.setItem('hms_delivery_records', JSON.stringify(deliveryRecords)); }, [deliveryRecords]);
    useEffect(() => { localStorage.setItem('hms_newborn_records', JSON.stringify(newbornRecords)); }, [newbornRecords]);
    useEffect(() => { localStorage.setItem('hms_pnc_visits', JSON.stringify(pncVisits)); }, [pncVisits]);

    // Ambulance Module Persistence
    useEffect(() => { localStorage.setItem('hms_ambulance_fleet', JSON.stringify(ambulanceFleet)); }, [ambulanceFleet]);
    useEffect(() => { localStorage.setItem('hms_dispatch_requests', JSON.stringify(dispatchRequests)); }, [dispatchRequests]);
    useEffect(() => { localStorage.setItem('hms_ambulance_trips', JSON.stringify(ambulanceTrips)); }, [ambulanceTrips]);
    useEffect(() => { localStorage.setItem('hms_ambulance_crew', JSON.stringify(ambulanceCrew)); }, [ambulanceCrew]);

    // Theatre/Operating Room Module Persistence
    useEffect(() => { localStorage.setItem('hms_operating_rooms', JSON.stringify(operatingRooms)); }, [operatingRooms]);
    useEffect(() => { localStorage.setItem('hms_surgery_schedules', JSON.stringify(surgerySchedules)); }, [surgerySchedules]);
    useEffect(() => { localStorage.setItem('hms_surgical_checklists', JSON.stringify(surgicalChecklists)); }, [surgicalChecklists]);
    useEffect(() => { localStorage.setItem('hms_anaesthesia_records', JSON.stringify(anaesthesiaRecords)); }, [anaesthesiaRecords]);
    useEffect(() => { localStorage.setItem('hms_surgical_equipment', JSON.stringify(surgicalEquipment)); }, [surgicalEquipment]);

    // Triage Module Persistence
    useEffect(() => { localStorage.setItem('hms_triage_queue', JSON.stringify(triageQueue)); }, [triageQueue]);

    // Queue Management Persistence
    useEffect(() => { localStorage.setItem('hms_queue_entries', JSON.stringify(queueEntries)); }, [queueEntries]);

    // Appointments Persistence
    useEffect(() => { localStorage.setItem('hms_appointments', JSON.stringify(appointments)); }, [appointments]);


    const resetAllData = () => {
        const totalRecords = patients.length + financialRecords.length + clinicalRecords.length + users.length + insuranceProviders.length + insuranceClaims.length + servicesData.length + debtRecords.length + walletRecords.length + wards.length + beds.length + admissions.length + inventory.length + prescriptions.length + Object.keys(systemSettings).length;
        setPatients([]);
        setFinancialRecords([]);
        setClinicalRecords([]);
        setUsers([]);
        setInsuranceRecords([]);
        setServicesData([]);
        setDebtRecords([]);
        setWalletRecords([]);
        setWards([]);
        setBeds([]);
        setAdmissions([]);
        setInventory([]);
        setPrescriptions([]);
        setLabOrders([]);
        setCamps([]);

        // Reset HR data
        setDepartments(initialDepartmentsData);
        setEmployees(initialEmployeesData);
        setLeaveRequests(initialLeaveRequestsData);
        setAttendance(initialEnhancedAttendanceData);
        setPayroll(initialPayrollData);
        setShifts(initialShiftsData);
        setBenefits(initialBenefitsData);
        setJobPostings(initialJobPostingsData);
        setApplications(initialApplicationsData);
        setOnboarding(initialOnboardingData);
        setPerformanceReviews(initialPerformanceReviewsData);
        setGoals(initialGoalsData);
        setSelfServiceRequests(initialSelfServiceRequestsData);
        setEmployeeDocuments(initialEmployeeDocumentsData);
        setBiometricDevices(initialBiometricDevicesData);
        setAttendancePolicies(initialAttendancePoliciesData);

        setSystemSettings(initialSystemSettings);
        return { success: true, recordsCleared: totalRecords };
    };

    // Main reset function
    const performDataReset = (selectedTypes, reason, adminUser = 'System Admin') => {
        const results = [];
        const timestamp = new Date().toISOString();

        if (selectedTypes.all) {
            const result = resetAllData();
            results.push({ type: 'All Data', ...result });
            // Also reset nursing data
            setVitalSigns(initialVitalSignsData);
            setNursingNotes(initialNursingNotesData);
            setCarePlans(initialCarePlansData);
            setHandoverReports(initialHandoverReportsData);
            setNursingTasks(initialNursingTasksData);
            setMedicationLogs([]);
        } else {
            if (selectedTypes.patients) { results.push({ type: 'Patient Records', ...resetPatients() }); }
            if (selectedTypes.financial) { results.push({ type: 'Financial Data', ...resetFinancial() }); }
            if (selectedTypes.clinical) {
                results.push({ type: 'Clinical Records', ...resetClinical() });
                setVitalSigns(initialVitalSignsData);
                setNursingNotes(initialNursingNotesData);
                setCarePlans(initialCarePlansData);
                setHandoverReports(initialHandoverReportsData);
                setNursingTasks(initialNursingTasksData);
                setMedicationLogs([]);
                setLabOrders(initialLabOrders);
            }
            if (selectedTypes.users) { results.push({ type: 'User Accounts', ...resetUsers() }); }
            if (selectedTypes.settings) { results.push({ type: 'System Settings', ...resetSettings() }); }
            if (selectedTypes.insurance) { results.push({ type: 'Insurance Records', ...resetInsurance() }); }
            if (selectedTypes.services) { results.push({ type: 'Services & Pricing', ...resetServices() }); }
            if (selectedTypes.debt) { results.push({ type: 'Debt Records', ...resetDebt() }); }
            if (selectedTypes.wallet) { results.push({ type: 'HMS Wallet Data', ...resetWallet() }); }
            if (selectedTypes.inventory) { results.push({ type: 'Pharmacy Inventory', ...resetInventory() }); }
            if (selectedTypes.prescriptions) { results.push({ type: 'Prescriptions', ...resetPrescriptions() }); }
            if (selectedTypes.camps) { results.push({ type: 'Health Camps', ...resetCamps() }); }
        }

        const resetLog = {
            id: `RESET-${Date.now()}`,
            timestamp,
            performedBy: adminUser,
            reason,
            dataTypes: selectedTypes,
            results,
            totalRecordsCleared: results.reduce((sum, r) => sum + r.recordsCleared, 0)
        };

        setResetHistory([resetLog, ...resetHistory]);

        return {
            success: true,
            results,
            totalRecordsCleared: resetLog.totalRecordsCleared,
            resetId: resetLog.id
        };
    };

    // Restore from initial data
    const restoreInitialData = (dataType) => {
        switch (dataType) {
            case 'patients': setPatients(initialPatientData); break;
            case 'financial': setFinancialRecords(initialFinancialData); break;
            case 'clinical': setClinicalRecords(initialClinicalData); break;
            case 'users': setUsers(initialUserData); break;
            case 'settings': setSystemSettings(initialSystemSettings); break;
            case 'insurance': setInsuranceRecords(initialInsuranceData); break;
            case 'services': setServicesData(initialServicesData); break;
            case 'debt': setDebtRecords(initialDebtData); break;
            case 'wallet': setWalletRecords(initialWalletData); break;
            case 'wards': setWards(initialWardsData); break;
            case 'beds': setBeds(initialBedsData); break;
            case 'admissions': setAdmissions(initialAdmissionsData); break;
            case 'inventory': setInventory(initialInventoryData); break;
            case 'prescriptions': setPrescriptions(initialPrescriptionData); break;
            case 'camps': setCamps(initialCampsData); break;
            case 'all':
                setPatients(initialPatientData);
                setFinancialRecords(initialFinancialData);
                setClinicalRecords(initialClinicalData);
                setUsers(initialUserData);
                setSystemSettings(initialSystemSettings);
                setInsuranceProviders([]);
                setInsuranceClaims([]);
                setServicesData(initialServicesData);
                setDebtRecords(initialDebtData);
                setWalletRecords(initialWalletData);
                setWards(initialWardsData);
                setBeds(initialBedsData);
                setAdmissions(initialAdmissionsData);
                setInventory(initialInventoryData);
                setPrescriptions(initialPrescriptionData);
                setCamps(initialCampsData);
                // Nursing
                setVitalSigns(initialVitalSignsData);
                setNursingNotes(initialNursingNotesData);
                setCarePlans(initialCarePlansData);
                setHandoverReports(initialHandoverReportsData);
                setNursingTasks(initialNursingTasksData);
                setMedicationLogs([]);
                setLabOrders(initialLabOrders);
                break;
            default: break;
        }
    };

    // Blood Bank Initial Data
    const initialBloodInventory = [
        { group: 'A+', units: 15, status: 'Normal' },
        { group: 'A-', units: 4, status: 'Low' },
        { group: 'B+', units: 22, status: 'Good' },
        { group: 'B-', units: 6, status: 'Normal' },
        { group: 'AB+', units: 8, status: 'Normal' },
        { group: 'AB-', units: 2, status: 'Critical' },
        { group: 'O+', units: 30, status: 'Good' },
        { group: 'O-', units: 5, status: 'Low' },
    ];

    const initialBloodDonors = [
        { id: 'D-1001', name: 'John Smith', bloodGroup: 'O+', age: 34, gender: 'Male', lastDonation: '2024-01-10', contact: '0700123456', status: 'Eligible' },
        { id: 'D-1002', name: 'Sarah Jones', bloodGroup: 'A-', age: 28, gender: 'Female', lastDonation: '2023-11-15', contact: '0700987654', status: 'Eligible' },
    ];

    const initialBloodRequests = [
        { id: 'BR-001', patientName: 'James Wilson', bloodGroup: 'A+', units: 2, status: 'Pending', requestDate: '2024-02-20', urgency: 'Urgent', doctor: 'Dr. Sarah Wilson' },
    ];

    // Blood Bank Module State - NOW USING API
    const [bloodInventory, setBloodInventory] = useState([]);
    const [bloodDonors, setBloodDonors] = useState([]);
    const [bloodRequests, setBloodRequests] = useState([]);

    // Fetch blood bank data from API
    useEffect(() => {
        const fetchBloodBankData = async () => {
            const token = localStorage.getItem('hms_auth_token');
            if (!token) return;

            try {
                const [inventory, donors, requests] = await Promise.all([
                    bloodBankAPI.getInventory(),
                    bloodBankAPI.getDonors(),
                    bloodBankAPI.getRequests()
                ]);
                setBloodInventory(inventory);
                setBloodDonors(donors);
                setBloodRequests(requests);
            } catch (error) {
                console.error('Error fetching blood bank data:', error);
            }
        };
        fetchBloodBankData();
    }, []);

    // Get data counts
    const getDataCounts = () => ({
        patients: patients.length,
        financial: financialRecords.length,
        clinical: clinicalRecords.length,
        users: users.length,
        settings: Object.keys(systemSettings).length,
        insurance: insuranceProviders.length,
        services: servicesData.length,
        debt: debtRecords.length,
        wallet: walletRecords.length,
        wards: wards.length,
        beds: beds.length,
        admissions: admissions.length,
        inventory: inventory.length,
        prescriptions: prescriptions.length,
        camps: camps.length,
        total: patients.length + financialRecords.length + clinicalRecords.length + users.length + insuranceProviders.length + insuranceClaims.length + servicesData.length + debtRecords.length + walletRecords.length + wards.length + beds.length + admissions.length + inventory.length + prescriptions.length + camps.length
    });

    // Billing Helper Functions (LEGACY - for backward compatibility)
    const addBillLegacy = (billData) => {
        const newBill = {
            id: `INV-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'Pending',
            ...billData
        };
        setFinancialRecords(prev => [newBill, ...prev]);
        return newBill;
    };

    const updateBillStatus = (billId, status, metadata = {}) => {
        setFinancialRecords(prev => prev.map(bill =>
            bill.id === billId ? { ...bill, status, ...metadata } : bill
        ));
    };

    // ==================== BLOOD BANK CRUD FUNCTIONS ====================
    const addBloodDonor = async (donorData) => {
        try {
            const donor = await bloodBankAPI.addDonor(donorData);
            setBloodDonors(prev => [donor, ...prev]);
            return donor;
        } catch (error) {
            console.error('Error adding donor:', error);
            throw error;
        }
    };

    const recordDonation = async (donorId) => {
        try {
            const donor = await bloodBankAPI.recordDonation(donorId);
            setBloodDonors(prev => prev.map(d => d.id === donorId ? donor : d));
            // Refresh inventory to get updated units
            const inventory = await bloodBankAPI.getInventory();
            setBloodInventory(inventory);
            return donor;
        } catch (error) {
            console.error('Error recording donation:', error);
            throw error;
        }
    };

    const createBloodRequest = async (requestData) => {
        try {
            const request = await bloodBankAPI.createRequest(requestData);
            setBloodRequests(prev => [request, ...prev]);
            return request;
        } catch (error) {
            console.error('Error creating blood request:', error);
            throw error;
        }
    };

    const approveBloodRequest = async (requestId) => {
        try {
            const request = await bloodBankAPI.approveRequest(requestId);
            setBloodRequests(prev => prev.map(r => r.id === requestId ? request : r));
            // Refresh inventory to reflect deduction
            const inventory = await bloodBankAPI.getInventory();
            setBloodInventory(inventory);
            return request;
        } catch (error) {
            console.error('Error approving request:', error);
            throw error;
        }
    };

    const rejectBloodRequest = async (requestId) => {
        try {
            const request = await bloodBankAPI.rejectRequest(requestId);
            setBloodRequests(prev => prev.map(r => r.id === requestId ? request : r));
            return request;
        } catch (error) {
            console.error('Error rejecting request:', error);
            throw error;
        }
    };

    const updateBloodInventory = async (id, data) => {
        try {
            const updated = await bloodBankAPI.updateInventory(id, data);
            setBloodInventory(prev => prev.map(i => i.id === id ? updated : i));
            return updated;
        } catch (error) {
            console.error('Error updating inventory:', error);
            throw error;
        }
    };

    // ==================== AMBULANCE CRUD FUNCTIONS ====================
    const addAmbulance = async (ambulanceData) => {
        try {
            const ambulance = await ambulanceAPI.addAmbulance(ambulanceData);
            setAmbulanceFleet(prev => [ambulance, ...prev]);
            return ambulance;
        } catch (error) {
            console.error('Error adding ambulance:', error);
            throw error;
        }
    };

    const updateAmbulance = async (id, data) => {
        try {
            const ambulance = await ambulanceAPI.updateAmbulance(id, data);
            setAmbulanceFleet(prev => prev.map(a => a.id === id ? ambulance : a));
            return ambulance;
        } catch (error) {
            console.error('Error updating ambulance:', error);
            throw error;
        }
    };

    const createDispatchRequest = async (requestData) => {
        try {
            const request = await ambulanceAPI.createRequest(requestData);
            setDispatchRequests(prev => [request, ...prev]);
            return request;
        } catch (error) {
            console.error('Error creating dispatch request:', error);
            throw error;
        }
    };

    const dispatchAmbulanceToRequest = async (requestId, ambulanceId) => {
        try {
            const { request, trip } = await ambulanceAPI.dispatchAmbulance(requestId, ambulanceId);
            setDispatchRequests(prev => prev.map(r => r.id === requestId ? request : r));
            setAmbulanceTrips(prev => [trip, ...prev]);
            // Refresh fleet to update ambulance status
            const fleet = await ambulanceAPI.getFleet();
            setAmbulanceFleet(fleet);
            return { request, trip };
        } catch (error) {
            console.error('Error dispatching ambulance:', error);
            throw error;
        }
    };

    const completeAmbulanceTrip = async (tripId, data) => {
        try {
            const trip = await ambulanceAPI.completeTrip(tripId, data);
            setAmbulanceTrips(prev => prev.map(t => t.id === tripId ? trip : t));
            // Refresh fleet to update ambulance status back to available
            const fleet = await ambulanceAPI.getFleet();
            setAmbulanceFleet(fleet);
            return trip;
        } catch (error) {
            console.error('Error completing trip:', error);
            throw error;
        }
    };

    // ==================== HR CRUD FUNCTIONS ====================
    const addEmployee = async (employeeData) => {
        try {
            const employee = await hrAPI.addEmployee(employeeData);
            setEmployees(prev => [employee, ...prev]);
            return employee;
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error;
        }
    };

    const updateEmployee = async (id, employeeData) => {
        try {
            const employee = await hrAPI.updateEmployee(id, employeeData);
            setEmployees(prev => prev.map(e => e.id === id ? employee : e));
            return employee;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    };

    const markEmployeeAttendance = async (attendanceData) => {
        try {
            const record = await hrAPI.markAttendance(attendanceData);
            setAttendance(prev => [record, ...prev]);
            return record;
        } catch (error) {
            console.error('Error marking attendance:', error);
            throw error;
        }
    };

    const createLeaveRequest = async (leaveData) => {
        try {
            const leave = await hrAPI.createLeaveRequest(leaveData);
            setLeaveRequests(prev => [leave, ...prev]);
            return leave;
        } catch (error) {
            console.error('Error creating leave request:', error);
            throw error;
        }
    };

    const updateLeaveRequestStatus = async (id, status, approvedBy) => {
        try {
            const leave = await hrAPI.updateLeaveRequest(id, { status, approvedBy });
            setLeaveRequests(prev => prev.map(l => l.id === id ? leave : l));
            return leave;
        } catch (error) {
            console.error('Error updating leave request:', error);
            throw error;
        }
    };

    const createPayrollEntry = async (payrollData) => {
        try {
            const payrollRecord = await hrAPI.createPayroll(payrollData);
            setPayroll(prev => [payrollRecord, ...prev]);
            return payrollRecord;
        } catch (error) {
            console.error('Error creating payroll:', error);
            throw error;
        }
    };

    const updatePayrollStatus = async (id, status, paymentDate) => {
        try {
            const payrollRecord = await hrAPI.updatePayroll(id, { status, paymentDate });
            setPayroll(prev => prev.map(p => p.id === id ? payrollRecord : p));
            return payrollRecord;
        } catch (error) {
            console.error('Error updating payroll:', error);
            throw error;
        }
    };

    const value = {
        resetHistory,
        servicesData,
        debtRecords,
        walletRecords,
        wards,
        beds,
        admissions,
        patients,
        inventory,
        prescriptions,
        camps,
        financialRecords,
        // Nursing Module Data
        vitalSigns,
        nursingNotes,
        carePlans,
        handoverReports,
        nursingTasks,
        medicationLogs,
        labOrders,
        labInventory,
        // Setters
        // Setters & CRUD
        setPatients, // Keep for backward compatibility if needed, but prefer addPatient/etc.
        addPatient,
        updatePatient,
        deletePatient,
        fetchPatients,
        setPrescriptions,
        setCamps,
        setFinancialRecords,
        // Nursing Module Setters
        setVitalSigns,
        setNursingNotes,
        setCarePlans,
        setHandoverReports,
        setNursingTasks,
        setMedicationLogs,
        setLabOrders,
        setLabInventory,

        // HR Module Data
        departments,
        employees,
        leaveRequests,
        attendance,
        payroll,
        shifts,
        benefits,
        jobPostings,
        applications,
        onboarding,
        performanceReviews,
        goals,
        selfServiceRequests,
        employeeDocuments,
        biometricDevices,
        attendancePolicies,

        // HR Module Setters
        setDepartments,
        setEmployees,
        setLeaveRequests,
        setAttendance,
        setPayroll,
        setShifts,
        setBenefits,
        setJobPostings,
        setApplications,
        setOnboarding,
        setPerformanceReviews,
        setGoals,
        setSelfServiceRequests,
        setEmployeeDocuments,
        setBiometricDevices,
        setAttendancePolicies,

        // Maternity Module Data
        maternityPatients,
        ancVisits,
        deliveryRecords,
        newbornRecords,
        pncVisits,

        // Maternity Module Setters
        setMaternityPatients,
        setANCVisits,
        setDeliveryRecords,
        setNewbornRecords,
        setPNCVisits,

        // Ambulance Module Data
        ambulanceFleet,
        dispatchRequests,
        ambulanceTrips,
        ambulanceCrew,

        // Ambulance Module Setters
        setAmbulanceFleet,
        setDispatchRequests,
        setAmbulanceTrips,
        setAmbulanceCrew,

        // Theatre/Operating Room Module Data
        operatingRooms,
        surgerySchedules,
        surgicalChecklists,
        anaesthesiaRecords,
        surgicalEquipment,

        // Theatre/Operating Room Module Setters
        setOperatingRooms,
        setSurgerySchedules,
        setSurgicalChecklists,
        setAnaesthesiaRecords,
        setSurgicalEquipment,

        // Triage Module Data
        triageQueue,
        setTriageQueue,

        // Queue Management Data (API-BACKED)
        queueEntries,
        setQueueEntries,
        addQueueEntry,
        updateQueueEntry,
        fetchQueue,
        queueLoading,

        // Appointments Data (API-BACKED)
        appointments,
        setAppointments,
        addAppointment,
        updateAppointment,
        fetchAppointments,
        appointmentsLoading,

        // Bills/Financial (API-BACKED)
        bills,
        setBills,
        addBill: addBill, // API version, shadows old helper
        updateBill,
        fetchBills,
        billsLoading,

        // Services (API-BACKED)
        services,
        setServices,
        addService,
        updateService,
        fetchServices,
        servicesLoading,

        // Pharmacy Data
        suppliers, setSuppliers,

        // Admin Module Data
        auditLogs, setAuditLogs,
        loginHistory, setLoginHistory,
        securitySettings, setSecuritySettings,
        backupHistory, setBackupHistory,

        // User Data
        usersData, setUsersData,

        // Admin Functions
        performDataReset,
        getDataCounts,
        restoreInitialData,

        // Printer Settings
        printerSettings,
        setPrinterSettings,
        approveBloodRequest,
        rejectBloodRequest,
        updateBloodInventory,

        // Ambulance Functions (API-BACKED)
        addAmbulance,
        updateAmbulance,
        createDispatchRequest,
        dispatchAmbulanceToRequest,
        completeAmbulanceTrip,

        // HR Functions (API-BACKED)
        addEmployee,
        updateEmployee,
        markEmployeeAttendance,
        createLeaveRequest,
        updateLeaveRequestStatus,
        createPayrollEntry,
        updatePayrollStatus,
        modules,
        toggleModule
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
