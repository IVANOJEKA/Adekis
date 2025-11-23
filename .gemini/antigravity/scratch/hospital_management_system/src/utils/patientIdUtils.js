// Centralized Patient ID Generation Utilities
// Used across all HMS modules: Finance, EMR, Billing, Admitting, Reports, etc.

/**
 * Generate unique patient ID based on type
 * @param {Array} allPatients - All existing patients
 * @param {String} type - Patient type: 'regular', 'walkin', 'maternity', 'pediatric', 'emergency'
 * @returns {String} Unique patient ID
 */
export const generatePatientId = (allPatients, type = 'regular') => {
    const prefixMap = {
        regular: 'P',
        walkin: 'W',
        maternity: 'M',
        pediatric: 'PD',
        emergency: 'E'
    };

    const prefix = prefixMap[type] || 'P';

    // Get all patients with this prefix
    const patientNumbers = allPatients
        .filter(p => p.id && p.id.startsWith(`${prefix}-`))
        .map(p => {
            const parts = p.id.split('-');
            return parseInt(parts[1]);
        })
        .filter(n => !isNaN(n));

    // Find the maximum number and increment
    const maxNumber = patientNumbers.length > 0 ? Math.max(...patientNumbers) : 0;
    const newNumber = maxNumber + 1;

    // Format with zero padding
    return `${prefix}-${String(newNumber).padStart(3, '0')}`;
};

/**
 * Search patients by ID across the entire system
 * @param {Array} allPatients - All patients
 * @param {String} searchId - Patient ID to search for
 * @returns {Object|null} Patient object or null
 */
export const findPatientById = (allPatients, searchId) => {
    return allPatients.find(p => p.id === searchId) || null;
};

/**
 * Get patient type from ID prefix
 * @param {String} patientId - Patient ID
 * @returns {String} Patient type
 */
export const getPatientTypeFromId = (patientId) => {
    if (!patientId) return 'Unknown';

    if (patientId.startsWith('P-')) return 'Regular';
    if (patientId.startsWith('W-')) return 'Walk-in';
    if (patientId.startsWith('M-')) return 'Maternity';
    if (patientId.startsWith('PD-')) return 'Pediatric';
    if (patientId.startsWith('E-')) return 'Emergency';

    return 'Unknown';
};

/**
 * Validate patient ID format
 * @param {String} patientId - Patient ID to validate
 * @returns {Boolean} True if valid
 */
export const isValidPatientId = (patientId) => {
    const validPrefixes = ['P-', 'W-', 'M-', 'PD-', 'E-'];
    const pattern = /^(P|W|M|PD|E)-\d{3}$/;

    return pattern.test(patientId);
};

/**
 * Get patient display info with ID
 * @param {Object} patient - Patient object
 * @returns {String} Formatted patient info
 */
export const getPatientDisplayInfo = (patient) => {
    if (!patient) return 'N/A';
    return `${patient.name} (${patient.id})`;
};

/**
 * Link financial record to patient
 * Creates a standardized financial record with patient ID reference
 * @param {String} patientId - Patient ID
 * @param {Object} recordData - Financial record data
 * @returns {Object} Standardized financial record
 */
export const createFinancialRecord = (patientId, recordData) => {
    return {
        ...recordData,
        patientId,
        patientType: getPatientTypeFromId(patientId),
        recordDate: recordData.recordDate || new Date().toISOString(),
        id: `FIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
};

/**
 * Get all financial records for a patient
 * @param {Array} financialRecords - All financial records
 * @param {String} patientId - Patient ID
 * @returns {Array} Patient's financial records
 */
export const getPatientFinancialRecords = (financialRecords, patientId) => {
    return financialRecords.filter(record => record.patientId === patientId);
};

/**
 * Calculate patient balance
 * @param {Array} financialRecords - All financial records
 * @param {String} patientId - Patient ID
 * @returns {Object} {totalBills, totalPayments, balance}
 */
export const calculatePatientBalance = (financialRecords, patientId) => {
    const records = getPatientFinancialRecords(financialRecords, patientId);

    const totalBills = records
        .filter(r => r.type === 'bill' || r.type === 'charge')
        .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalPayments = records
        .filter(r => r.type === 'payment' || r.status === 'Paid')
        .reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
        totalBills,
        totalPayments,
        balance: totalBills - totalPayments
    };
};

export default {
    generatePatientId,
    findPatientById,
    getPatientTypeFromId,
    isValidPatientId,
    getPatientDisplayInfo,
    createFinancialRecord,
    getPatientFinancialRecords,
    calculatePatientBalance
};
