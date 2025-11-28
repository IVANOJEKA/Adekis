// Employee ID Generation Utilities for HR Module

/**
 * Generate unique employee ID
 * @param {Array} allEmployees - All existing employees
 * @param {String} type - Employee type: 'permanent', 'contract', 'intern', 'temporary'
 * @returns {String} Unique employee ID
 */
export const generateEmployeeId = (allEmployees, type = 'permanent') => {
    const prefixMap = {
        permanent: 'EMP',
        contract: 'CNT',
        intern: 'INT',
        temporary: 'TMP'
    };

    const prefix = prefixMap[type] || 'EMP';

    // Get all employees with this prefix
    const employeeNumbers = allEmployees
        .filter(e => e.id && e.id.startsWith(`${prefix}-`))
        .map(e => {
            const parts = e.id.split('-');
            return parseInt(parts[1]);
        })
        .filter(n => !isNaN(n));

    // Find the maximum number and increment
    const maxNumber = employeeNumbers.length > 0 ? Math.max(...employeeNumbers) : 0;
    const newNumber = maxNumber + 1;

    // Format with zero padding (4 digits for employees)
    return `${prefix}-${String(newNumber).padStart(4, '0')}`;
};

/**
 * Search employee by ID
 * @param {Array} allEmployees - All employees
 * @param {String} searchId - Employee ID to search for
 * @returns {Object|null} Employee object or null
 */
export const findEmployeeById = (allEmployees, searchId) => {
    return allEmployees.find(e => e.id === searchId) || null;
};

/**
 * Get employee type from ID prefix
 * @param {String} employeeId - Employee ID
 * @returns {String} Employee type
 */
export const getEmployeeTypeFromId = (employeeId) => {
    if (!employeeId) return 'Unknown';

    if (employeeId.startsWith('EMP-')) return 'Permanent';
    if (employeeId.startsWith('CNT-')) return 'Contract';
    if (employeeId.startsWith('INT-')) return 'Intern';
    if (employeeId.startsWith('TMP-')) return 'Temporary';

    return 'Unknown';
};

/**
 * Validate employee ID format
 * @param {String} employeeId - Employee ID to validate
 * @returns {Boolean} True if valid
 */
export const isValidEmployeeId = (employeeId) => {
    const pattern = /^(EMP|CNT|INT|TMP)-\d{4}$/;
    return pattern.test(employeeId);
};

/**
 * Get employee display info with ID
 * @param {Object} employee - Employee object
 * @returns {String} Formatted employee info
 */
export const getEmployeeDisplayInfo = (employee) => {
    if (!employee) return 'N/A';
    return `${employee.name} (${employee.id})`;
};

/**
 * Generate next employee ID based on existing employees
 * This is the main function to use when adding new employees
 * @param {Array} employees - All existing employees
 * @param {String} employmentType - Employment type (Full-Time, Part-Time, Contr act, Intern)
 * @returns {String} Generated employee ID
 */
export const generateNextEmployeeId = (employees, employmentType = 'Full-Time') => {
    const typeMap = {
        'Full-Time': 'permanent',
        'Part-Time': 'permanent',
        'Contract': 'contract',
        'Intern': 'intern',
        'Temporary': 'temporary'
    };

    const type = typeMap[employmentType] || 'permanent';
    return generateEmployeeId(employees, type);
};

export default {
    generateEmployeeId,
    findEmployeeById,
    getEmployeeTypeFromId,
    isValidEmployeeId,
    getEmployeeDisplayInfo,
    generateNextEmployeeId
};
