import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    SUBSCRIPTION_TIERS,
    SUBSCRIPTION_STATUS,
    hasFeatureAccess,
    checkSubscriptionLimits,
    generateSubscriptionId,
    generateOrganizationId,
    calculateEndDate
} from '../utils/subscriptionPlans';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within SubscriptionProvider');
    }
    return context;
};

export const SubscriptionProvider = ({ children }) => {
    // Subscription data
    const [subscriptions, setSubscriptions] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [currentOrganization, setCurrentOrganization] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    // Initialize with sample data for testing
    useEffect(() => {
        const sampleOrg = {
            id: generateOrganizationId(),
            name: 'Adekis Hospital',
            type: 'Hospital',
            location: 'Kampala, Uganda',
            contactName: 'Hospital Administrator',
            email: 'admin@adekis.com',
            phone: '+256700000000',
            createdAt: new Date().toISOString()
        };

        const sampleSubscription = {
            id: generateSubscriptionId(),
            organizationId: sampleOrg.id,
            organizationName: sampleOrg.name,
            tier: 'ENTERPRISE',
            status: SUBSCRIPTION_STATUS.ACTIVE,
            startDate: new Date().toISOString(),
            endDate: calculateEndDate(new Date(), 'ENTERPRISE'),
            autoRenew: true,
            maxUsers: -1, // unlimited
            currentUsers: 1,
            maxPatients: -1, // unlimited
            currentPatients: 0,
            features: ['all-modules'],
            billing: {
                amount: SUBSCRIPTION_TIERS.ENTERPRISE.price,
                currency: 'UGX',
                frequency: 'annual',
                lastPayment: new Date().toISOString(),
                nextPayment: calculateEndDate(new Date(), 'ENTERPRISE'),
                paymentMethod: 'bank_transfer'
            },
            contacts: {
                primaryContact: sampleOrg.contactName,
                email: sampleOrg.email,
                phone: sampleOrg.phone
            },
            approvedBy: 'SUPER_ADMIN',
            approvalDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        setOrganizations([sampleOrg]);
        setSubscriptions([sampleSubscription]);
        setCurrentOrganization(sampleOrg);
        setCurrentSubscription(sampleSubscription);
    }, []);

    // Request new subscription
    const requestSubscription = (organizationData, tier) => {
        const org = {
            id: generateOrganizationId(),
            ...organizationData,
            createdAt: new Date().toISOString()
        };

        const tierData = SUBSCRIPTION_TIERS[tier];
        const subscription = {
            id: generateSubscriptionId(),
            organizationId: org.id,
            organizationName: org.name,
            tier,
            status: SUBSCRIPTION_STATUS.PENDING,
            startDate: new Date().toISOString(),
            endDate: null, // Set when approved
            autoRenew: false,
            maxUsers: tierData.maxUsers,
            currentUsers: 0,
            maxPatients: tierData.maxPatients,
            currentPatients: 0,
            features: tierData.features,
            billing: {
                amount: tierData.price,
                currency: tierData.currency,
                frequency: tier === 'ENTERPRISE' ? 'annual' : 'monthly',
                lastPayment: null,
                nextPayment: null,
                paymentMethod: null
            },
            contacts: {
                primaryContact: organizationData.contactName,
                email: organizationData.email,
                phone: organizationData.phone
            },
            approvedBy: null,
            approvalDate: null,
            createdAt: new Date().toISOString()
        };

        setOrganizations(prev => [...prev, org]);
        setSubscriptions(prev => [...prev, subscription]);

        return { organization: org, subscription };
    };

    // Approve subscription
    const approveSubscription = (subscriptionId, approvedBy = 'SUPER_ADMIN') => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                const endDate = calculateEndDate(new Date(), sub.tier);
                return {
                    ...sub,
                    status: SUBSCRIPTION_STATUS.ACTIVE,
                    endDate,
                    approvedBy,
                    approvalDate: new Date().toISOString(),
                    billing: {
                        ...sub.billing,
                        nextPayment: endDate
                    }
                };
            }
            return sub;
        }));
    };

    // Reject subscription
    const rejectSubscription = (subscriptionId, reason) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                return {
                    ...sub,
                    status: SUBSCRIPTION_STATUS.CANCELLED,
                    rejectionReason: reason,
                    rejectionDate: new Date().toISOString()
                };
            }
            return sub;
        }));
    };

    // Suspend subscription
    const suspendSubscription = (subscriptionId, reason) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                return {
                    ...sub,
                    status: SUBSCRIPTION_STATUS.SUSPENDED,
                    suspensionReason: reason,
                    suspensionDate: new Date().toISOString()
                };
            }
            return sub;
        }));
    };

    // Reactivate subscription
    const reactivateSubscription = (subscriptionId) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                return {
                    ...sub,
                    status: SUBSCRIPTION_STATUS.ACTIVE,
                    suspensionReason: null,
                    suspensionDate: null
                };
            }
            return sub;
        }));
    };

    // Extend subscription
    const extendSubscription = (subscriptionId, days) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                const currentEnd = new Date(sub.endDate);
                const newEnd = new Date(currentEnd);
                newEnd.setDate(newEnd.getDate() + days);

                return {
                    ...sub,
                    endDate: newEnd.toISOString(),
                    billing: {
                        ...sub.billing,
                        nextPayment: newEnd.toISOString()
                    }
                };
            }
            return sub;
        }));
    };

    // Upgrade/Downgrade subscription
    const changeTier = (subscriptionId, newTier) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                const tierData = SUBSCRIPTION_TIERS[newTier];
                return {
                    ...sub,
                    tier: newTier,
                    maxUsers: tierData.maxUsers,
                    maxPatients: tierData.maxPatients,
                    features: tierData.features,
                    billing: {
                        ...sub.billing,
                        amount: tierData.price,
                        frequency: newTier === 'ENTERPRISE' ? 'annual' : 'monthly'
                    }
                };
            }
            return sub;
        }));
    };

    // Record payment
    const recordPayment = (subscriptionId, paymentData) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                const endDate = calculateEndDate(new Date(), sub.tier);
                return {
                    ...sub,
                    endDate,
                    billing: {
                        ...sub.billing,
                        lastPayment: new Date().toISOString(),
                        nextPayment: endDate,
                        paymentMethod: paymentData.method
                    }
                };
            }
            return sub;
        }));
    };

    // Check if current user has feature access
    const hasAccess = (featureId) => {
        if (!currentSubscription) return false;
        return hasFeatureAccess(currentSubscription, featureId);
    };

    // Get subscription warnings/limits
    const getSubscriptionWarnings = () => {
        if (!currentSubscription) return [];
        return checkSubscriptionLimits(currentSubscription);
    };

    // Update user count
    const updateUserCount = (subscriptionId, count) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                return { ...sub, currentUsers: count };
            }
            return sub;
        }));
    };

    // Update patient count
    const updatePatientCount = (subscriptionId, count) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === subscriptionId) {
                return { ...sub, currentPatients: count };
            }
            return sub;
        }));
    };

    // Get subscription statistics
    const getStats = () => {
        const total = subscriptions.length;
        const active = subscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.ACTIVE).length;
        const pending = subscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.PENDING).length;
        const expired = subscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.EXPIRED).length;
        const suspended = subscriptions.filter(s => s.status === SUBSCRIPTION_STATUS.SUSPENDED).length;

        const revenue = subscriptions
            .filter(s => s.status === SUBSCRIPTION_STATUS.ACTIVE)
            .reduce((sum, s) => sum + s.billing.amount, 0);

        return { total, active, pending, expired, suspended, revenue };
    };

    const value = {
        // State
        subscriptions,
        organizations,
        currentOrganization,
        currentSubscription,

        // Setters
        setCurrentOrganization,
        setCurrentSubscription,

        // Actions
        requestSubscription,
        approveSubscription,
        rejectSubscription,
        suspendSubscription,
        reactivateSubscription,
        extendSubscription,
        changeTier,
        recordPayment,
        updateUserCount,
        updatePatientCount,

        // Utilities
        hasAccess,
        getSubscriptionWarnings,
        getStats,

        // Constants
        SUBSCRIPTION_TIERS,
        SUBSCRIPTION_STATUS
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};
