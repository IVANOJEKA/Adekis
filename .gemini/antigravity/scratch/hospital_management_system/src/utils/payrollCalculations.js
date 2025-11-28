/**
 * Payroll Calculations
 * Handles all payroll-related calculations including PAYE, NSSF, and salary computations
 */

// Uganda PAYE Tax Bands (2024)
const PAYE_TAX_BANDS = [
    { min: 0, max: 235000, rate: 0 },           // Tax-free (relief)
    { min: 235001, max: 335000, rate: 10 },     // 10%
    { min: 335001, max: 410000, rate: 20 },     // 20%
    { min: 410001, max: 10000000, rate: 30 },   // 30%
    { min: 10000001, max: Infinity, rate: 40 }  // 40%
];

// Tax relief amount (monthly)
const TAX_RELIEF = 235000;

// NSSF Configuration
const NSSF_RATE = 0.10;  // 10% employee contribution
const NSSF_CEILING = 2000000;  // Maximum salary for NSSF calculation

/**
 * Calculate PAYE (Pay As You Earn) Tax
 * Uses Uganda tax bands and progressive taxation
 */
export const calculatePAYE = (taxableIncome) => {
    let tax = 0;

    for (const band of PAYE_TAX_BANDS) {
        if (taxableIncome <= band.min) break;

        const applicableIncome = Math.min(
            taxableIncome,
            band.max
        ) - band.min;

        if (applicableIncome > 0) {
            tax += (applicableIncome * band.rate) / 100;
        }
    }

    return Math.round(tax);
};

/**
 * Calculate NSSF Contribution
 * 10% of basic salary up to ceiling
 */
export const calculateNSSF = (basicSalary) => {
    const applicableSalary = Math.min(basicSalary, NSSF_CEILING);
    return Math.round(applicableSalary * NSSF_RATE);
};

/**
 * Calculate total allowances
 */
export const calculateTotalAllowances = (allowances) => {
    if (!allowances) return 0;

    return Object.values(allowances).reduce((total, allowance) => {
        if (typeof allowance === 'object' && allowance.amount) {
            return total + allowance.amount;
        }
        return total + (allowance || 0);
    }, 0);
};

/**
 * Calculate taxable allowances only
 */
export const calculateTaxableAllowances = (allowances) => {
    if (!allowances) return 0;

    return Object.values(allowances).reduce((total, allowance) => {
        if (typeof allowance === 'object') {
            return total + (allowance.taxable ? allowance.amount : 0);
        }
        return total;
    }, 0);
};

/**
 * Calculate total bonuses
 */
export const calculateTotalBonuses = (bonuses) => {
    if (!bonuses) return 0;

    if (typeof bonuses === 'object') {
        return Object.values(bonuses).reduce((total, bonus) => {
            return total + (bonus || 0);
        }, 0);
    }

    return bonuses || 0;
};

/**
 * Calculate overtime pay
 */
export const calculateOvertimePay = (overtimeHours, hourlyRate) => {
    if (!overtimeHours || !hourlyRate) return 0;
    return Math.round(overtimeHours * hourlyRate);
};

/**
 * Calculate gross salary
 * Gross = Basic + Allowances + Bonuses + Overtime
 */
export const calculateGrossSalary = (basicSalary, allowances, bonuses, overtime) => {
    const totalAllowances = calculateTotalAllowances(allowances);
    const totalBonuses = calculateTotalBonuses(bonuses);
    const overtimePay = overtime || 0;

    return basicSalary + totalAllowances + totalBonuses + overtimePay;
};

/**
 * Calculate taxable income
 * Taxable = Basic + Taxable Allowances + Bonuses - Tax Relief
 */
export const calculateTaxableIncome = (basicSalary, allowances, bonuses) => {
    const taxableAllowances = calculateTaxableAllowances(allowances);
    const totalBonuses = calculateTotalBonuses(bonuses);

    const grossTaxable = basicSalary + taxableAllowances + totalBonuses;
    return Math.max(0, grossTaxable - TAX_RELIEF);
};

/**
 * Calculate total statutory deductions
 */
export const calculateStatutoryDeductions = (basicSalary, taxableIncome) => {
    const paye = calculatePAYE(taxableIncome);
    const nssf = calculateNSSF(basicSalary);

    return {
        paye,
        nssf,
        nhif: 0,  // Can be added if needed
        total: paye + nssf
    };
};

/**
 * Calculate total other deductions
 */
export const calculateOtherDeductions = (deductions) => {
    if (!deductions) return 0;

    return Object.values(deductions).reduce((total, deduction) => {
        return total + (deduction || 0);
    }, 0);
};

/**
 * Calculate net salary
 * Net = Gross - All Deductions
 */
export const calculateNetSalary = (grossSalary, statutoryDeductions, otherDeductions) => {
    const totalStatutory = statutoryDeductions.total || 0;
    const totalOther = otherDeductions || 0;

    return grossSalary - totalStatutory - totalOther;
};

/**
 * Calculate complete payroll for an employee
 * Returns full earnings and deductions breakdown
 */
export const calculateEmployeePayroll = (employee, salaryStructure, attendanceData = {}) => {
    // Extract salary components
    const basicSalary = salaryStructure.basicSalary || employee.salary || 0;
    const allowances = salaryStructure.allowances || {};
    const bonuses = salaryStructure.bonuses || {};
    const overtimeHours = attendanceData.overtimeHours || 0;
    const overtimeRate = salaryStructure.overtimeRate || (basicSalary / 160); // Assuming 160 hours/month

    // Calculate earnings
    const totalAllowances = calculateTotalAllowances(allowances);
    const totalBonuses = calculateTotalBonuses(bonuses);
    const overtimePay = calculateOvertimePay(overtimeHours, overtimeRate);
    const grossSalary = calculateGrossSalary(basicSalary, allowances, bonuses, overtimePay);

    // Calculate deductions
    const taxableIncome = calculateTaxableIncome(basicSalary, allowances, bonuses);
    const statutory = calculateStatutoryDeductions(basicSalary, taxableIncome);
    const otherDeductions = salaryStructure.otherDeductions || {};
    const totalOtherDeductions = calculateOtherDeductions(otherDeductions);

    // Calculate net
    const netSalary = calculateNetSalary(grossSalary, statutory, totalOtherDeductions);

    // Prepare detailed breakdown
    return {
        earnings: {
            basicSalary,
            allowances: {
                ...allowances,
                total: totalAllowances
            },
            bonuses: {
                ...bonuses,
                total: totalBonuses
            },
            overtime: {
                hours: overtimeHours,
                rate: overtimeRate,
                total: overtimePay
            },
            grossSalary
        },
        deductions: {
            statutory: {
                paye: statutory.paye,
                nssf: statutory.nssf,
                nhif: statutory.nhif || 0,
                total: statutory.total
            },
            other: {
                ...otherDeductions,
                total: totalOtherDeductions
            },
            totalDeductions: statutory.total + totalOtherDeductions
        },
        netSalary,
        taxableIncome
    };
};

/**
 * Adjust salary for attendance
 * Deducts for absent days and unpaid leave
 */
export const adjustForAttendance = (basicSalary, daysWorked, totalWorkingDays) => {
    if (daysWorked >= totalWorkingDays) return basicSalary;

    const dailyRate = basicSalary / totalWorkingDays;
    return Math.round(dailyRate * daysWorked);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'UGX') => {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
};

/**
 * Calculate payroll summary for multiple employees
 */
export const calculatePayrollSummary = (payrollRecords) => {
    return payrollRecords.reduce((summary, record) => {
        return {
            totalGross: summary.totalGross + (record.earnings?.grossSalary || 0),
            totalDeductions: summary.totalDeductions + (record.deductions?.totalDeductions || 0),
            totalNet: summary.totalNet + (record.netSalary || 0),
            totalPAYE: summary.totalPAYE + (record.deductions?.statutory?.paye || 0),
            totalNSSF: summary.totalNSSF + (record.deductions?.statutory?.nssf || 0),
            employeeCount: summary.employeeCount + 1
        };
    }, {
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        totalPAYE: 0,
        totalNSSF: 0,
        employeeCount: 0
    });
};
