import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_STATUS } from '../utils/subscriptionPlans';

/**
 * Hook to check if current subscription allows access to a specific feature
 * @param {string} featureId - The feature/module ID to check
 * @returns {Object} - { allowed: boolean, reason: string }
 */
export const useFeatureAccess = (featureId) => {
    const { currentSubscription, hasAccess } = useSubscription();

    if (!currentSubscription) {
        return { allowed: false, reason: 'NO_SUBSCRIPTION' };
    }

    if (currentSubscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
        return { allowed: false, reason: 'SUBSCRIPTION_INACTIVE' };
    }

    // Check expiry
    if (currentSubscription.endDate) {
        const expiryDate = new Date(currentSubscription.endDate);
        const now = new Date();

        if (now > expiryDate) {
            return { allowed: false, reason: 'SUBSCRIPTION_EXPIRED' };
        }
    }

    // Check feature access
    if (!hasAccess(featureId)) {
        return { allowed: false, reason: 'FEATURE_NOT_IN_PLAN' };
    }

    return { allowed: true, reason: null };
};

/**
 * Hook to check subscription limits
 * @returns {Object} - Limit check results
 */
export const useSubscriptionLimits = () => {
    const { currentSubscription } = useSubscription();

    if (!currentSubscription) {
        return {
            canAddUser: false,
            canAddPatient: false,
            userLimitReached: true,
            patientLimitReached: true,
            warnings: []
        };
    }

    const { maxUsers, currentUsers, maxPatients, currentPatients } = currentSubscription;

    // Check user limit
    const userLimitReached = maxUsers > 0 && currentUsers >= maxUsers;
    const canAddUser = !userLimitReached;
    const userWarning = maxUsers > 0 && currentUsers >= maxUsers * 0.8;

    // Check patient limit  
    const patientLimitReached = maxPatients > 0 && currentPatients >= maxPatients;
    const canAddPatient = !patientLimitReached;
    const patientWarning = maxPatients > 0 && currentPatients >= maxPatients * 0.8;

    const warnings = [];
    if (userWarning) warnings.push('User limit approaching (80%)');
    if (patientWarning) warnings.push('Patient limit approaching (80%)');
    if (userLimitReached) warnings.push('User limit reached');
    if (patientLimitReached) warnings.push('Patient limit reached');

    return {
        canAddUser,
        canAddPatient,
        userLimitReached,
        patientLimitReached,
        warnings,
        usageInfo: {
            users: `${currentUsers}/${maxUsers === -1 ? '∞' : maxUsers}`,
            patients: `${currentPatients}/${maxPatients === -1 ? '∞' : maxPatients}`
        }
    };
};

/**
 * Component to restrict access to features based on subscription
 */
export const FeatureGate = ({ featureId, children, fallback = null }) => {
    const { allowed, reason } = useFeatureAccess(featureId);

    if (!allowed) {
        if (fallback) return fallback;

        return (
            <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Feature Not Available</h3>
                <p className="text-slate-600 mb-4">
                    {getReasonMessage(reason)}
                </p>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all">
                    Upgrade Plan
                </button>
            </div>
        );
    }

    return children;
};

/**
 * Get user-friendly message for access denial reason
 */
const getReasonMessage = (reason) => {
    switch (reason) {
        case 'NO_SUBSCRIPTION':
            return 'Your organization does not have an active subscription. Please contact your administrator.';
        case 'SUBSCRIPTION_INACTIVE':
            return 'Your subscription is currently inactive. Please renew to continue using this feature.';
        case 'SUBSCRIPTION_EXPIRED':
            return 'Your subscription has expired. Please renew to regain access to this feature.';
        case 'FEATURE_NOT_IN_PLAN':
            return 'This feature is not included in your current plan. Upgrade to access this feature.';
        default:
            return 'This feature is not available. Please contact support for assistance.';
    }
};

/**
 * Component to show subscription status banner
 */
export const SubscriptionStatusBanner = () => {
    const { currentSubscription, getSubscriptionWarnings } = useSubscription();

    if (!currentSubscription) return null;

    const warnings = getSubscriptionWarnings();
    if (warnings.length === 0) return null;

    const hasError = warnings.some(w => w.severity === 'error');
    const bgColor = hasError ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
    const textColor = hasError ? 'text-red-800' : 'text-amber-800';
    const iconColor = hasError ? 'text-red-600' : 'text-amber-600';

    return (
        <div className={`border-2 ${bgColor} rounded-xl p-4 mb-6`}>
            <div className="flex items-start gap-3">
                <svg className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className={`font-bold ${textColor} mb-2`}>Subscription Alert</p>
                    <ul className={`text-sm ${textColor} space-y-1`}>
                        {warnings.map((warning, index) => (
                            <li key={index}>{warning.message}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

/**
 * HOC to protect routes based on subscription
 */
export const withSubscriptionCheck = (Component, featureId) => {
    return (props) => {
        const { allowed, reason } = useFeatureAccess(featureId);

        if (!allowed) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Restricted</h2>
                        <p className="text-slate-600 mb-6">{getReasonMessage(reason)}</p>
                        <button
                            onClick={() => window.location.href = '/subscriptions'}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            View Subscription Details
                        </button>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
};
