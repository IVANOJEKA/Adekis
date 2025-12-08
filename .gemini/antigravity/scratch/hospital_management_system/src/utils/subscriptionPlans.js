// Subscription tier definitions and pricing
export const SUBSCRIPTION_TIERS = {
    FREE_TRIAL: {
        id: 'free_trial',
        name: 'Free Trial',
        duration: 30, // days
        maxUsers: 5,
        maxPatients: 100,
        features: ['dashboard', 'reception', 'emr'],
        price: 0,
        currency: 'UGX',
        description: '30-day free trial with basic features',
        popular: false
    },
    BASIC: {
        id: 'basic',
        name: 'Basic Plan',
        duration: 30, // monthly
        maxUsers: 20,
        maxPatients: 500,
        features: ['dashboard', 'reception', 'doctor', 'emr', 'pharmacy', 'laboratory'],
        price: 50000,
        currency: 'UGX',
        description: 'Essential features for small clinics',
        popular: false
    },
    PROFESSIONAL: {
        id: 'professional',
        name: 'Professional',
        duration: 30, // monthly
        maxUsers: 50,
        maxPatients: 2000,
        features: [
            'dashboard', 'reception', 'doctor', 'triage', 'emr', 'pharmacy',
            'laboratory', 'pathology', 'radiology', 'bed-management', 'nursing',
            'finance', 'insurance', 'services', 'queue', 'reports'
        ],
        price: 150000,
        currency: 'UGX',
        description: 'Full-featured for medium hospitals',
        popular: true
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise',
        duration: 365, // annual
        maxUsers: -1, // unlimited
        maxPatients: -1, // unlimited
        features: ['all-modules'],
        price: 1500000,
        currency: 'UGX',
        description: 'Unlimited access for large hospitals',
        popular: false
    }
};

// All available modules
export const ALL_MODULES = [
    { id: 'dashboard', name: 'Dashboard', category: 'Core' },
    { id: 'reception', name: 'Reception', category: 'Core' },
    { id: 'doctor', name: 'Doctor', category: 'Clinical' },
    { id: 'triage', name: 'Triage Station', category: 'Clinical' },
    { id: 'emr', name: 'EMR', category: 'Clinical' },
    { id: 'pharmacy', name: 'Pharmacy', category: 'Clinical' },
    { id: 'laboratory', name: 'Laboratory', category: 'Diagnostic' },
    { id: 'pathology', name: 'Pathology', category: 'Diagnostic' },
    { id: 'radiology', name: 'Radiology', category: 'Diagnostic' },
    { id: 'bed-management', name: 'Bed Management', category: 'Clinical' },
    { id: 'nursing', name: 'Nursing Care', category: 'Clinical' },
    { id: 'theatre', name: 'Theatre/OT', category: 'Clinical' },
    { id: 'maternity', name: 'Maternity', category: 'Clinical' },
    { id: 'blood-bank', name: 'Blood Bank', category: 'Clinical' },
    { id: 'ambulance', name: 'Ambulance', category: 'Services' },
    { id: 'finance', name: 'Finance', category: 'Administrative' },
    { id: 'insurance', name: 'Insurance', category: 'Administrative' },
    { id: 'hr', name: 'HR Management', category: 'Administrative' },
    { id: 'services', name: 'Services', category: 'Administrative' },
    { id: 'wallet', name: 'Wallet', category: 'Financial' },
    { id: 'debt', name: 'Debt Management', category: 'Financial' },
    { id: 'communication', name: 'Communication', category: 'Engagement' },
    { id: 'camps', name: 'Health Camps', category: 'Engagement' },
    { id: 'queue', name: 'Queue Management', category: 'Services' },
    { id: 'reports', name: 'Reports', category: 'Analytics' },
    { id: 'admin', name: 'Administration', category: 'System' },
    { id: 'settings', name: 'Settings', category: 'System' }
];

// Subscription status options
export const SUBSCRIPTION_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    SUSPENDED: 'suspended',
    CANCELLED: 'cancelled'
};

// Payment methods
export const PAYMENT_METHODS = {
    MOBILE_MONEY: 'mobile_money',
    BANK_TRANSFER: 'bank_transfer',
    CARD: 'card',
    MANUAL: 'manual'
};

// Helper function to check if a feature is included
export const hasFeatureAccess = (subscription, featureId) => {
    if (!subscription || subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
        return false;
    }

    // Enterprise has all modules
    if (subscription.features.includes('all-modules')) {
        return true;
    }

    return subscription.features.includes(featureId);
};

// Check if subscription is within limits
export const checkSubscriptionLimits = (subscription) => {
    const warnings = [];

    if (subscription.maxUsers > 0 && subscription.currentUsers >= subscription.maxUsers) {
        warnings.push({
            type: 'user_limit',
            message: 'User limit reached',
            severity: 'error'
        });
    } else if (subscription.maxUsers > 0 && subscription.currentUsers >= subscription.maxUsers * 0.8) {
        warnings.push({
            type: 'user_warning',
            message: '80% of user limit reached',
            severity: 'warning'
        });
    }

    if (subscription.maxPatients > 0 && subscription.currentPatients >= subscription.maxPatients) {
        warnings.push({
            type: 'patient_limit',
            message: 'Patient limit reached',
            severity: 'error'
        });
    } else if (subscription.maxPatients > 0 && subscription.currentPatients >= subscription.maxPatients * 0.8) {
        warnings.push({
            type: 'patient_warning',
            message: '80% of patient limit reached',
            severity: 'warning'
        });
    }

    // Check expiry
    const daysUntilExpiry = Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 0) {
        warnings.push({
            type: 'expired',
            message: 'Subscription expired',
            severity: 'error'
        });
    } else if (daysUntilExpiry <= 7) {
        warnings.push({
            type: 'expiring_soon',
            message: `Subscription expires in ${daysUntilExpiry} days`,
            severity: 'warning'
        });
    }

    return warnings;
};

// Generate subscription ID
export const generateSubscriptionId = () => {
    return `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Generate organization ID
export const generateOrganizationId = () => {
    return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Calculate end date based on tier
export const calculateEndDate = (startDate, tier) => {
    const start = new Date(startDate);
    const tierData = SUBSCRIPTION_TIERS[tier];
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + tierData.duration);
    return endDate.toISOString();
};
