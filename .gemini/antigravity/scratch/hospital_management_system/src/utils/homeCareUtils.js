// Home Care ID Generation Utilities

/**
 * Generate unique Home Care Patient ID
 * Format: HC-XXX (e.g., HC-001, HC-002)
 */
export const generateHomeCarePatientId = (existingPatients = []) => {
    const homeCarePatients = existingPatients.filter(p => p.id && p.id.startsWith('HC-'));

    const existingNumbers = homeCarePatients
        .map(p => {
            const match = p.id.match(/HC-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => !isNaN(n));

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const newNumber = maxNumber + 1;

    return `HC-${String(newNumber).padStart(3, '0')}`;
};

/**
 * Generate unique Home Care Visit ID
 * Format: HV-YYYYMMDD-XXX (e.g., HV-20240115-001)
 */
export const generateHomeCareVisitId = (existingVisits = [], date = new Date()) => {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

    const todayVisits = existingVisits.filter(v =>
        v.id && v.id.startsWith(`HV-${dateStr}`)
    );

    const existingNumbers = todayVisits
        .map(v => {
            const match = v.id.match(/HV-\d{8}-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => !isNaN(n));

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const newNumber = maxNumber + 1;

    return `HV-${dateStr}-${String(newNumber).padStart(3, '0')}`;
};

/**
 * Generate unique Home Care Plan ID
 * Format: HCP-XXX (e.g., HCP-001)
 */
export const generateHomeCarePlanId = (existingPlans = []) => {
    const existingNumbers = existingPlans
        .map(p => {
            const match = p.id.match(/HCP-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => !isNaN(n));

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const newNumber = maxNumber + 1;

    return `HCP-${String(newNumber).padStart(3, '0')}`;
};

/**
 * Calculate visit duration in minutes
 */
export const calculateVisitDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;

    return Math.round(diff / (1000 * 60)); // Convert to minutes
};

/**
 * Format visit duration for display
 */
export const formatVisitDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Get care level color
 */
export const getCareLevelColor = (careLevel) => {
    switch (careLevel) {
        case 'Intensive':
            return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' };
        case 'Standard':
            return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' };
        case 'Basic':
            return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' };
        default:
            return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700' };
    }
};

/**
 * Get visit status color
 */
export const getVisitStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-700';
        case 'In Progress':
            return 'bg-blue-100 text-blue-700';
        case 'Scheduled':
            return 'bg-amber-100 text-amber-700';
        case 'Cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};
