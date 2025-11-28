/**
 * Payroll ID Utilities
 * Generates unique IDs for payroll records and periods
 */

/**
 * Generate payroll record ID
 * Format: PAY-YYYY-MM-XXX
 * Example: PAY-2024-01-001
 */
export const generatePayrollId = (existingPayrolls, month, year) => {
    // Filter payrolls for the same period
    const periodPayrolls = existingPayrolls.filter(p => {
        const [, pYear, pMonth] = p.id.split('-');
        return pYear === String(year) && pMonth === String(month).padStart(2, '0');
    });

    // Find the highest sequence number
    let maxSequence = 0;
    periodPayrolls.forEach(p => {
        const parts = p.id.split('-');
        const sequence = parseInt(parts[parts.length - 1]);
        if (sequence > maxSequence) {
            maxSequence = sequence;
        }
    });

    const nextSequence = maxSequence + 1;
    const monthPadded = String(month).padStart(2, '0');
    const sequencePadded = String(nextSequence).padStart(3, '0');

    return `PAY-${year}-${monthPadded}-${sequencePadded}`;
};

/**
 * Generate payroll period ID
 * Format: PP-YYYY-MM
 * Example: PP-2024-01
 */
export const generatePayrollPeriodId = (month, year) => {
    const monthPadded = String(month).padStart(2, '0');
    return `PP-${year}-${monthPadded}`;
};

/**
 * Format month/year for display
 * Input: month (1-12), year (2024)
 * Output: "January 2024"
 */
export const formatPayrollPeriod = (month, year) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[month - 1]} ${year}`;
};

/**
 * Parse payroll period from ID
 * Input: "PP-2024-01"
 * Output: { month: 1, year: 2024 }
 */
export const parsePayrollPeriodId = (periodId) => {
    const [, year, month] = periodId.split('-');
    return {
        month: parseInt(month),
        year: parseInt(year)
    };
};

/**
 * Get current period info
 */
export const getCurrentPeriod = () => {
    const now = new Date();
    return {
        month: now.getMonth() + 1,
        year: now.getFullYear()
    };
};

/**
 * Check if period is in the future
 */
export const isFuturePeriod = (month, year) => {
    const current = getCurrentPeriod();
    if (year > current.year) return true;
    if (year === current.year && month > current.month) return true;
    return false;
};

/**
 * Get period date range
 */
export const getPeriodDateRange = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
};
