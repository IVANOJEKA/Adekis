/**
 * Insurance API Service
 * Handles communication with external insurance provider APIs
 * Reads configuration from system settings/localStorage
 */

import { insuranceProviders } from '../data/insuranceProviders';

// Helper to get API configuration
const getProviderConfig = (providerId) => {
    const savedConfig = localStorage.getItem('apiIntegrations');
    if (!savedConfig) return null;

    const config = JSON.parse(savedConfig);

    // Map internal provider IDs to config keys
    const configMap = {
        'UG001': 'aarInsurance', // AAR
        'UG002': 'uapInsurance', // UAP
        'UG003': 'jubileeInsurance', // Jubilee
        'UG004': 'britamInsurance', // Britam
        // Add others as needed
    };

    const configKey = configMap[providerId];
    return configKey ? config[configKey] : null;
};

class InsuranceService {
    /**
     * Verify patient insurance coverage
     * @param {string} providerId - Internal Provider ID (e.g., UG001)
     * @param {string} memberNumber - Patient's insurance member number
     * @returns {Promise<Object>} - Verification result
     */
    async verifyPatient(providerId, memberNumber) {
        const config = getProviderConfig(providerId);
        const provider = insuranceProviders.uganda.find(p => p.id === providerId) ||
            insuranceProviders.kenya.find(p => p.id === providerId);

        console.log(`Verifying patient ${memberNumber} with ${provider?.name}...`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!config || !config.enabled) {
            console.warn(`API integration not enabled for ${provider?.name}. Using local mock data.`);
            // Fallback to mock success for demo purposes if not configured
            return {
                isValid: true,
                status: 'Active',
                memberName: 'Verified Patient',
                plan: 'Gold Scheme',
                limit: 5000000,
                balance: 4500000,
                expiryDate: '2025-12-31',
                exclusions: ['Cosmetic Surgery']
            };
        }

        // In a real implementation, this would be a fetch call to config.apiEndpoint
        // const response = await fetch(`${provider.apiEndpoint}/verify/${memberNumber}`, {
        //     headers: { 'Authorization': `Bearer ${config.apiKey}` }
        // });

        // Simulating API Response based on environment
        if (config.environment === 'test') {
            // Simulate different scenarios based on member number pattern
            if (memberNumber.endsWith('00')) {
                return { isValid: false, status: 'Expired', message: 'Policy expired on 2023-12-31' };
            }
            if (memberNumber.endsWith('99')) {
                return { isValid: false, status: 'Suspended', message: 'Policy suspended due to non-payment' };
            }

            return {
                isValid: true,
                status: 'Active',
                memberName: 'Test Patient',
                plan: 'Corporate Platinum',
                limit: 10000000,
                balance: 8500000,
                expiryDate: '2025-06-30',
                exclusions: ['Fertility Treatment']
            };
        }

        throw new Error('Live environment not yet connected');
    }

    /**
     * Submit a claim to the insurance provider
     * @param {Object} claimData - Full claim details
     * @returns {Promise<Object>} - Submission result
     */
    async submitClaim(claimData) {
        const { providerId, amount, service, patientId } = claimData;
        const config = getProviderConfig(providerId);

        console.log(`Submitting claim of UGX ${amount} to provider ${providerId}...`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!config || !config.enabled) {
            return {
                success: true,
                claimId: `CLM-${Math.floor(Math.random() * 10000)}`,
                status: 'Pending',
                message: 'Claim recorded locally (API not configured)'
            };
        }

        // Simulate API processing
        if (config.environment === 'test') {
            if (amount > 5000000) {
                return {
                    success: false,
                    status: 'Rejected',
                    message: 'Amount exceeds auto-approval limit. Pre-authorization required.'
                };
            }

            return {
                success: true,
                claimId: `API-${Math.floor(Math.random() * 100000)}`,
                status: 'Submitted',
                trackingNumber: `TRK-${Date.now()}`,
                message: 'Claim successfully submitted to provider'
            };
        }

        throw new Error('Live environment not yet connected');
    }

    /**
     * Check status of a submitted claim
     * @param {string} providerId 
     * @param {string} claimId 
     */
    async checkClaimStatus(providerId, claimId) {
        const config = getProviderConfig(providerId);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!config || !config.enabled) return { status: 'Unknown', message: 'Local claim' };

        // Mock status rotation
        const statuses = ['Processing', 'Approved', 'Pending Review', 'Settled'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            status: randomStatus,
            lastUpdated: new Date().toISOString(),
            remarks: 'Processing normally'
        };
    }
}

export const insuranceService = new InsuranceService();
