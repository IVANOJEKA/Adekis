/**
 * Enhanced Payroll Data Structures
 * Sample data demonstrating the new comprehensive payroll format
 */

// Sample enhanced payroll records
export const sampleEnhancedPayrollData = [
    {
        id: 'PAY-2024-01-001',
        payrollPeriodId: 'PP-2024-01',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        department: 'DEPT-001',
        departmentName: 'General Medicine',
        month: '2024-01',

        // Earnings
        earnings: {
            basicSalary: 8000000,
            allowances: {
                housing: 2000000,
                transport: 500000,
                medical: 300000,
                lunch: 200000,
                total: 3000000
            },
            bonuses: {
                performance: 500000,
                holiday: 0,
                total: 500000
            },
            overtime: {
                hours: 10,
                rate: 50000,
                total: 500000
            },
            grossSalary: 12000000
        },

        // Deductions
        deductions: {
            statutory: {
                paye: 2400000,
                nssf: 800000,
                nhif: 0,
                total: 3200000
            },
            other: {
                advanceLoan: 500000,
                insurance: 100000,
                welfare: 50000,
                total: 650000
            },
            totalDeductions: 3850000
        },

        // Net Pay
        netSalary: 8150000,

        // Metadata
        payrollStatus: 'Paid',
        processedDate: '2024-01-25',
        approvedBy: 'U-002',
        approvedDate: '2024-01-26',
        paidDate: '2024-01-30',
        paymentMethod: 'Bank Transfer',
        bankAccount: '****1234',

        // Attendance Impact
        daysWorked: 22,
        daysAbsent: 0,
        unpaidLeaveDays: 0,
        lateDays: 0,

        // Notes
        notes: '',
        payslipGenerated: true,
        payslipUrl: null
    },
    {
        id: 'PAY-2024-01-002',
        payrollPeriodId: 'PP-2024-01',
        employeeId: 'U-002',
        employeeName: 'John Admin',
        department: 'DEPT-007',
        departmentName: 'Administration',
        month: '2024-01',

        earnings: {
            basicSalary: 4500000,
            allowances: {
                housing: 1000000,
                transport: 300000,
                lunch: 150000,
                total: 1450000
            },
            bonuses: {
                performance: 0,
                total: 0
            },
            overtime: {
                hours: 0,
                rate: 0,
                total: 0
            },
            grossSalary: 5950000
        },

        deductions: {
            statutory: {
                paye: 950000,
                nssf: 450000,
                nhif: 0,
                total: 1400000
            },
            other: {
                insurance: 50000,
                total: 50000
            },
            totalDeductions: 1450000
        },

        netSalary: 4500000,

        payrollStatus: 'Paid',
        processedDate: '2024-01-25',
        approvedBy: 'U-001',
        approvedDate: '2024-01-26',
        paidDate: '2024-01-30',
        paymentMethod: 'Bank Transfer',
        bankAccount: '****5678',

        daysWorked: 22,
        daysAbsent: 0,
        unpaidLeaveDays: 0,
        lateDays: 0,

        notes: '',
        payslipGenerated: true,
        payslipUrl: null
    },
    {
        id: 'PAY-2024-01-003',
        payrollPeriodId: 'PP-2024-01',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        department: 'DEPT-002',
        departmentName: 'Nursing',
        month: '2024-01',

        earnings: {
            basicSalary: 3200000,
            allowances: {
                housing: 800000,
                transport: 250000,
                medical: 200000,
                lunch: 150000,
                total: 1400000
            },
            bonuses: {
                performance: 200000,
                total: 200000
            },
            overtime: {
                hours: 15,
                rate: 20000,
                total: 300000
            },
            grossSalary: 5100000
        },

        deductions: {
            statutory: {
                paye: 765000,
                nssf: 320000,
                nhif: 0,
                total: 1085000
            },
            other: {
                welfare: 30000,
                total: 30000
            },
            totalDeductions: 1115000
        },

        netSalary: 3985000,

        payrollStatus: 'Paid',
        processedDate: '2024-01-25',
        approvedBy: 'U-002',
        approvedDate: '2024-01-26',
        paidDate: '2024-01-30',
        paymentMethod: 'Bank Transfer',
        bankAccount: '****9012',

        daysWorked: 22,
        daysAbsent: 0,
        unpaidLeaveDays: 0,
        lateDays: 0,

        notes: '',
        payslipGenerated: true,
        payslipUrl: null
    }
];

// Sample payroll periods
export const samplePayrollPeriodsData = [
    {
        id: 'PP-2024-01',
        month: '2024-01',
        year: 2024,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        processingDate: '2024-01-25',
        status: 'Paid',
        totalEmployees: 3,
        processedEmployees: 3,
        totalGross: 23050000,
        totalDeductions: 6415000,
        totalNet: 16635000,
        approvedBy: 'U-002',
        approvedDate: '2024-01-26',
        paidDate: '2024-01-30',
        notes: 'Regular monthly payroll processing'
    },
    {
        id: 'PP-2024-02',
        month: '2024-02',
        year: 2024,
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        processingDate: null,
        status: 'Draft',
        totalEmployees: 0,
        processedEmployees: 0,
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        approvedBy: null,
        approvedDate: null,
        paidDate: null,
        notes: ''
    }
];

// Sample salary structures
export const sampleSalaryStructuresData = [
    {
        id: 'SAL-001',
        employeeId: 'U-001',
        employeeName: 'Dr. Sarah Wilson',
        effectiveFrom: '2024-01-01',
        basicSalary: 8000000,
        allowances: {
            housing: { amount: 2000000, taxable: false },
            transport: { amount: 500000, taxable: true },
            medical: { amount: 300000, taxable: false },
            lunch: { amount: 200000, taxable: true }
        },
        overtimeRate: 50000,  // Per hour
        paymentFrequency: 'Monthly',
        currency: 'UGX',
        bankDetails: {
            bankName: 'Stanbic Bank Uganda',
            accountNumber: '9040012341234',
            branch: 'Kampala Main',
            accountName: 'Dr. Sarah Wilson'
        },
        taxRelief: 235000,
        status: 'Active',
        lastUpdated: '2024-01-01'
    },
    {
        id: 'SAL-002',
        employeeId: 'U-002',
        employeeName: 'John Admin',
        effectiveFrom: '2024-01-01',
        basicSalary: 4500000,
        allowances: {
            housing: { amount: 1000000, taxable: false },
            transport: { amount: 300000, taxable: true },
            lunch: { amount: 150000, taxable: true }
        },
        overtimeRate: 28125,
        paymentFrequency: 'Monthly',
        currency: 'UGX',
        bankDetails: {
            bankName: 'Equity Bank Uganda',
            accountNumber: '1234567890',
            branch: 'Kampala',
            accountName: 'John Admin'
        },
        taxRelief: 235000,
        status: 'Active',
        lastUpdated: '2024-01-01'
    },
    {
        id: 'SAL-003',
        employeeId: 'U-003',
        employeeName: 'Mary Nurse',
        effectiveFrom: '2024-01-01',
        basicSalary: 3200000,
        allowances: {
            housing: { amount: 800000, taxable: false },
            transport: { amount: 250000, taxable: true },
            medical: { amount: 200000, taxable: false },
            lunch: { amount: 150000, taxable: true }
        },
        overtimeRate: 20000,
        paymentFrequency: 'Monthly',
        currency: 'UGX',
        bankDetails: {
            bankName: 'Centenary Bank',
            accountNumber: '0987654321',
            branch: 'Entebbe',
            accountName: 'Mary Nurse'
        },
        taxRelief: 235000,
        status: 'Active',
        lastUpdated: '2024-01-01'
    }
];

// Payroll status options
export const PAYROLL_STATUS_OPTIONS = {
    DRAFT: 'Draft',
    PROCESSING: 'Processing',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    PAID: 'Paid',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled'
};

// Payment methods
export const PAYMENT_METHODS = {
    BANK_TRANSFER: 'Bank Transfer',
    MOBILE_MONEY: 'Mobile Money',
    CASH: 'Cash',
    CHEQUE: 'Cheque'
};

// Period status options
export const PERIOD_STATUS_OPTIONS = {
    DRAFT: 'Draft',
    PROCESSING: 'Processing',
    APPROVED: 'Approved',
    PAID: 'Paid',
    CLOSED: 'Closed'
};
