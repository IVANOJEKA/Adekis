// Shared Insurance Service for cross-module access
// This can be imported by Reception, Finance, and other modules

export const insuranceCompanies = [
    { id: 1, name: 'Jubilee Insurance', code: 'JUB', type: 'Health', status: 'Active', contactEmail: 'claims@jubilee.co.ug', contactPhone: '0800123456' },
    { id: 2, name: 'UAP Insurance', code: 'UAP', type: 'Health', status: 'Active', contactEmail: 'health@uap.co.ug', contactPhone: '0800234567' },
    { id: 3, name: 'AAR Insurance', code: 'AAR', type: 'Health', status: 'Active', contactEmail: 'support@aar.co.ug', contactPhone: '0800345678' },
    { id: 4, name: 'Britam Insurance', code: 'BRT', type: 'Health', status: 'Active', contactEmail: 'claims@britam.co.ug', contactPhone: '0800456789' },
    { id: 5, name: 'APA Insurance', code: 'APA', type: 'Health', status: 'Active', contactEmail: 'health@apa.co.ug', contactPhone: '0800567890' },
];

// Mock patient insurance data
export const patientInsurance = [
    { patientId: 'P001', companyId: 1, policyNumber: 'JUB-2024-001234', coverageLimit: 5000000, used: 250000, status: 'Active', expiryDate: '2024-12-31' },
    { patientId: 'P002', companyId: 2, policyNumber: 'UAP-2024-005678', coverageLimit: 3000000, used: 180000, status: 'Active', expiryDate: '2024-11-30' },
    { patientId: 'P003', companyId: 3, policyNumber: 'AAR-2024-009012', coverageLimit: 10000000, used: 500000, status: 'Active', expiryDate: '2025-03-31' },
];

// Mock claims data
export let insuranceClaims = [
    {
        id: 'CLM-001',
        patientId: 'P001',
        patient: 'John Smith',
        companyId: 1,
        company: 'Jubilee Insurance',
        amount: 150000,
        service: 'General Consultation + Lab Tests',
        date: '2024-01-20',
        status: 'Pending',
        claimDate: '2024-01-21',
        invoiceId: 'INV-001'
    },
    {
        id: 'CLM-002',
        patientId: 'P002',
        patient: 'Mary Johnson',
        companyId: 2,
        company: 'UAP Insurance',
        amount: 250000,
        service: 'Specialist Consultation',
        date: '2024-01-19',
        status: 'Approved',
        claimDate: '2024-01-20',
        invoiceId: 'INV-002',
        approvedAmount: 250000,
        approvalDate: '2024-01-22'
    },
];

/**
 * Verify insurance coverage for a patient
 * @param {string} policyNumber - Insurance policy number
 * @param {number} amount - Service amount to verify
 * @returns {Object} Verification result
 */
export const verifyInsurance = (policyNumber, amount) => {
    const policy = patientInsurance.find(p => p.policyNumber === policyNumber);

    if (!policy) {
        return { valid: false, message: 'Policy not found' };
    }

    if (policy.status !== 'Active') {
        return { valid: false, message: 'Policy is not active' };
    }

    const expiryDate = new Date(policy.expiryDate);
    if (expiryDate < new Date()) {
        return { valid: false, message: 'Policy has expired' };
    }

    const remaining = policy.coverageLimit - policy.used;
    if (amount > remaining) {
        return { valid: false, message: `Insufficient coverage. Remaining: UGX ${remaining.toLocaleString()}` };
    }

    const company = insuranceCompanies.find(c => c.id === policy.companyId);

    return {
        valid: true,
        message: 'Coverage verified',
        company: company?.name,
        remaining,
        coverageLimit: policy.coverageLimit
    };
};

/**
 * Get insurance company by ID
 */
export const getInsuranceCompany = (companyId) => {
    return insuranceCompanies.find(c => c.id === companyId);
};

/**
 * Get patient insurance details
 */
export const getPatientInsurance = (patientId) => {
    const policy = patientInsurance.find(p => p.patientId === patientId);
    if (!policy) return null;

    const company = getInsuranceCompany(policy.companyId);
    return { ...policy, companyName: company?.name };
};

/**
 * Submit a new insurance claim
 */
export const submitClaim = (claimData) => {
    const newClaim = {
        id: `CLM-${String(insuranceClaims.length + 1).padStart(3, '0')}`,
        ...claimData,
        status: 'Pending',
        claimDate: new Date().toISOString().split('T')[0]
    };

    insuranceClaims.push(newClaim);
    return newClaim;
};

/**
 * Get claims by status
 */
export const getClaimsByStatus = (status) => {
    return insuranceClaims.filter(c => c.status === status);
};

/**
 * Get total claims amount for finance module
 */
export const getClaimsFinancialSummary = () => {
    const pending = insuranceClaims.filter(c => c.status === 'Pending');
    const approved = insuranceClaims.filter(c => c.status === 'Approved');
    const rejected = insuranceClaims.filter(c => c.status === 'Rejected');

    return {
        pendingCount: pending.length,
        pendingAmount: pending.reduce((sum, c) => sum + c.amount, 0),
        approvedCount: approved.length,
        approvedAmount: approved.reduce((sum, c) => sum + (c.approvedAmount || c.amount), 0),
        rejectedCount: rejected.length,
        rejectedAmount: rejected.reduce((sum, c) => sum + c.amount, 0),
    };
};

/**
 * Get all insurance claims (for Finance module)
 */
export const getAllClaims = () => {
    return insuranceClaims;
};
