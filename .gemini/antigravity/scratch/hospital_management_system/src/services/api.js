import { db, auth } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    setDoc
} from 'firebase/firestore';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

// Helper for standardize response
const getList = async (collectionName, constraints = []) => {
    try {
        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error getting ${collectionName}:`, error);
        throw error;
    }
};

const getOne = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const createItem = async (collectionName, data) => {
    try {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, { ...data, createdAt: new Date().toISOString() });
        return { id: docRef.id, ...data };
    } catch (error) {
        throw error;
    }
};

const updateItem = async (collectionName, id, data) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
        return { id, ...data };
    } catch (error) {
        throw error;
    }
};

const deleteItem = async (collectionName, id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        return { success: true, id };
    } catch (error) {
        throw error;
    }
};
// ==================== AUTH API ====================
export const authAPI = {
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get user profile
            const profile = await getOne('users', user.uid);

            return {
                token: await user.getIdToken(),
                user: { uid: user.uid, email: user.email, ...profile }
            };
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            // Create auth user
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: userData.name,
                email: userData.email,
                role: userData.role || 'Staff',
                department: userData.department,
                createdAt: new Date().toISOString()
            });

            return {
                token: await user.getIdToken(),
                user: { uid: user.uid, email: user.email, name: userData.name }
            };
        } catch (error) {
            throw error;
        }
    },

    me: async () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (user) {
                    // Get profile
                    const profile = await getOne('users', user.uid);
                    resolve({ uid: user.uid, email: user.email, ...profile });
                } else {
                    reject('Not authenticated');
                }
            });
        });
    },

    logout: async () => {
        await signOut(auth);
        localStorage.removeItem('hms_auth_token');
    }
};

// ==================== PATIENTS API ====================
export const patientsAPI = {
    getAll: (params) => getList('patients'),
    getById: (id) => getOne('patients', id),
    create: (data) => createItem('patients', data),
    update: (id, data) => updateItem('patients', id, data),
    delete: (id) => deleteItem('patients', id)
};

// ==================== APPOINTMENTS API ====================
export const appointmentsAPI = {
    getAll: () => getList('appointments'),
    getById: (id) => getOne('appointments', id),
    create: (data) => createItem('appointments', data),
    update: (id, data) => updateItem('appointments', id, data),
    delete: (id) => deleteItem('appointments', id)
};

// ==================== PRESCRIPTIONS API ====================
export const prescriptionsAPI = {
    getAll: () => getList('prescriptions'),
    create: (data) => createItem('prescriptions', data),
    update: (id, data) => updateItem('prescriptions', id, data)
};

// ==================== QUEUE API ====================
export const queueAPI = {
    getAll: () => getList('queue', [orderBy('checkInTime', 'asc')]),
    create: (data) => createItem('queue', data),
    update: (id, data) => updateItem('queue', id, data),
    delete: (id) => deleteItem('queue', id)
};

// ==================== BILLS API ====================
export const billsAPI = {
    getAll: () => getList('bills'),
    create: (data) => createItem('bills', data),
    update: (id, data) => updateItem('bills', id, data)
};

// ==================== SERVICES API ====================
export const servicesAPI = {
    getAll: () => getList('services'),
    create: (data) => createItem('services', data),
    update: (id, data) => updateItem('services', id, data)
};

// ==================== CASES API ====================
export const casesAPI = {
    getAll: () => getList('cases'),
    create: (data) => createItem('cases', data),
    update: (id, data) => updateItem('cases', id, data)
};

// ==================== INSURANCE API ====================
export const insuranceAPI = {
    getProviders: () => getList('insurance_providers'),
    addProvider: (data) => createItem('insurance_providers', data),
    verifyCoverage: async (data) => {
        // Mock verification logic on client side for now, or use Cloud Function later
        return { valid: true, coverage: 0.8, message: "Verified via Firebase (Mock)" };
    },
    getClaims: () => getList('insurance_claims'),
    submitClaim: (data) => createItem('insurance_claims', data),
    updateClaimStatus: (id, data) => updateItem('insurance_claims', id, data)
};

// ==================== THEATRE API ====================
export const theatreAPI = {
    getRooms: () => getList('theatre_rooms'),
    addRoom: (data) => createItem('theatre_rooms', data),
    getSurgeries: () => getList('surgeries'),
    scheduleSurgery: (data) => createItem('surgeries', data),
    updateSurgeryStatus: (id, data) => updateItem('surgeries', id, data)
};

// ==================== EMR API ====================
export const emrAPI = {
    getRecords: (patientId) => {
        const constraints = patientId ? [where('patientId', '==', patientId)] : [];
        return getList('emr_records', constraints);
    },
    createRecord: (data) => createItem('emr_records', data),
    updateRecord: (id, data) => updateItem('emr_records', id, data),
    getNotes: (patientId) => {
        const constraints = patientId ? [where('patientId', '==', patientId)] : [];
        return getList('emr_notes', constraints);
    },
    createNote: (data) => createItem('emr_notes', data)
};

// ==================== MATERNITY API ====================
export const maternityAPI = {
    getPatients: () => getList('maternity_patients'),
    registerPatient: (data) => createItem('maternity_patients', data),
    recordANCVisit: (data) => createItem('maternity_anc', data),
    getDeliveries: () => getList('maternity_deliveries'),
    recordDelivery: (data) => createItem('maternity_deliveries', data),
    recordPNCVisit: (data) => createItem('maternity_pnc', data)
};

// ==================== TRIAGE API ====================
export const triageAPI = {
    getRecords: () => getList('triage_records'),
    createRecord: (data) => createItem('triage_records', data),
    getRecordById: (id) => getOne('triage_records', id)
};

// ==================== LABORATORY API ====================
export const labAPI = {
    getTests: () => getList('lab_tests'),
    orderTest: (data) => createItem('lab_tests', { ...data, status: 'Pending' }),
    updateResults: (id, data) => updateItem('lab_tests', id, { ...data, status: 'Completed' }),
    getTestById: (id) => getOne('lab_tests', id),
    validateResults: (id, notes) => updateItem('lab_tests', id, { status: 'Validated', notes }),
    logPrint: (id) => updateItem('lab_tests', id, { printedAt: new Date().toISOString() }),
    getPendingTests: () => getList('lab_tests', [where('status', '==', 'Pending')]),
    getDoctorOrders: (doctorName) => getList('lab_tests', [where('requestedBy', '==', doctorName)]),
    notifyDoctor: async (id, message) => { console.log('Notification sent', id, message); return true; }
};

// ==================== LAB INVENTORY API ====================
export const labInventoryAPI = {
    getAll: () => getList('lab_inventory'),
    add: (data) => createItem('lab_inventory', data),
    update: (id, data) => updateItem('lab_inventory', id, data),
    delete: (id) => deleteItem('lab_inventory', id),
    recordTransaction: (data) => createItem('lab_inventory_transactions', data),
    getTransactions: (id) => getList('lab_inventory_transactions', [where('itemId', '==', id)]),
    getLowStock: () => getList('lab_inventory', [where('status', '==', 'Low')])
};

// ==================== BLOOD BANK API ====================
export const bloodBankAPI = {
    getInventory: () => getList('blood_inventory'),
    updateInventory: (id, data) => updateItem('blood_inventory', id, data),
    getDonors: () => getList('blood_donors'),
    addDonor: (data) => createItem('blood_donors', data),
    recordDonation: (id) => createItem('blood_donations', { donorId: id, date: new Date().toISOString() }),
    getRequests: () => getList('blood_requests'),
    createRequest: (data) => createItem('blood_requests', data),
    approveRequest: (id) => updateItem('blood_requests', id, { status: 'Approved' }),
    rejectRequest: (id) => updateItem('blood_requests', id, { status: 'Rejected' })
};

// ==================== AMBULANCE API ====================
export const ambulanceAPI = {
    getFleet: () => getList('ambulance_fleet'),
    addAmbulance: (data) => createItem('ambulance_fleet', data),
    updateAmbulance: (id, data) => updateItem('ambulance_fleet', id, data),
    getRequests: () => getList('ambulance_requests'),
    createRequest: (data) => createItem('ambulance_requests', data),
    dispatchAmbulance: (requestId, { ambulanceId }) => updateItem('ambulance_requests', requestId, { status: 'Dispatched', ambulanceId }),
    getTrips: () => getList('ambulance_trips'),
    completeTrip: (id, data) => updateItem('ambulance_trips', id, { ...data, status: 'Completed' })
};

// ==================== HR API ====================
export const hrAPI = {
    getEmployees: () => getList('hr_employees'),
    getEmployee: (id) => getOne('hr_employees', id),
    addEmployee: (data) => createItem('hr_employees', data),
    updateEmployee: (id, data) => updateItem('hr_employees', id, data),
    getAttendance: () => getList('hr_attendance'),
    markAttendance: (data) => createItem('hr_attendance', data),
    updateAttendance: (id, data) => updateItem('hr_attendance', id, data),
    getLeaveRequests: () => getList('hr_leaves'),
    createLeaveRequest: (data) => createItem('hr_leaves', data),
    updateLeaveRequest: (id, data) => updateItem('hr_leaves', id, data),
    getPayroll: () => getList('hr_payroll'),
    createPayroll: (data) => createItem('hr_payroll', data),
    updatePayroll: (id, data) => updateItem('hr_payroll', id, data)
};

// ==================== WALLET API ====================
export const walletAPI = {
    getAll: () => getList('wallets'),
    getById: (id) => getOne('wallets', id),
    create: (data) => createItem('wallets', data),
    topUp: (id, { amount }) => createItem('wallet_transactions', { walletId: id, type: 'Credit', amount }), // Simplified
    deduct: (id, { amount }) => createItem('wallet_transactions', { walletId: id, type: 'Debit', amount }),
    getTransactions: (id) => getList('wallet_transactions', [where('walletId', '==', id)]),
    updateStatus: (id, status) => updateItem('wallets', id, { status })
};

// ==================== BED MANAGEMENT API ====================
export const bedManagementAPI = {
    getWards: () => getList('wards'),
    createWard: (data) => createItem('wards', data),
    getBeds: () => getList('beds'),
    addBed: (data) => createItem('beds', data),
    updateBedStatus: (id, status) => updateItem('beds', id, { status }),
    admitPatient: (data) => createItem('bed_admissions', data),
    dischargePatient: (data) => createItem('bed_discharges', data),
    getAdmissions: () => getList('bed_admissions')
};

// ==================== FINANCE API ====================
export const financeAPI = {
    getExpenses: () => getList('finance_expenses'),
    createExpense: (data) => createItem('finance_expenses', data),
    approveExpense: (id) => updateItem('finance_expenses', id, { status: 'Approved' }),
    payExpense: (id, data) => updateItem('finance_expenses', id, { status: 'Paid', ...data }),
    getSummary: async () => ({}) // Mock summary for now
};

//Inventory
export const inventoryAPI = {
    getAll: () => getList('inventory'),
    create: (data) => createItem('inventory', data),
    update: (id, data) => updateItem('inventory', id, data),
    delete: (id) => deleteItem('inventory', id)
};
