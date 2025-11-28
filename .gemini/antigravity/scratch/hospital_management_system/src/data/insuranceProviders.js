/**
 * Insurance Providers Database for Uganda and East Africa
 * Comprehensive list of major health insurance companies operating in the region
 */

export const insuranceProviders = {
    uganda: [
        {
            id: 'UG001',
            name: 'AAR Insurance Uganda',
            shortName: 'AAR',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.aar insurance.com/ug/v1',
            contactEmail: 'claims@aaruganda.com',
            contactPhone: '+256 414 344500',
            website: 'https://aarinsurance.co.ug',
            status: 'Active',
            claimSubmissionEmail: 'medicalaims@aaruganda.com',
            requiresPreAuth: true,
            averageProcessingDays: 5,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental', 'Optical']
        },
        {
            id: 'UG002',
            name: 'UAP Insurance Uganda',
            shortName: 'UAP',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.uapinsurance.com/ug/v1',
            contactEmail: 'claims@uapinsurance.co.ug',
            contactPhone: '+256 414 236969',
            website: 'https://uapoldmutual.com/ug',
            status: 'Active',
            claimSubmissionEmail: 'health.claims@uapinsurance.co.ug',
            requiresPreAuth: true,
            averageProcessingDays: 4,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Emergency', 'Chronic Care']
        },
        {
            id: 'UG003',
            name: 'Jubilee Health Insurance',
            shortName: 'Jubilee',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.jubileeinsurance.com/ug/v1',
            contactEmail: 'info@jubileeinsurance.co.ug',
            contactPhone: '+256 414 344290',
            website: 'https://jubileeinsurance.com/ug',
            status: 'Active',
            claimSubmissionEmail: 'claims.health@jubileeinsurance.co.ug',
            requiresPreAuth: true,
            averageProcessingDays: 6,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental', 'Optical', 'Cancer Care']
        },
        {
            id: 'UG004',
            name: 'Britam Insurance Uganda',
            shortName: 'Britam',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'info@britam.com',
            contactPhone: '+256 417 122000',
            website: 'https://ke.britam.com',
            status: 'Active',
            claimSubmissionEmail: 'claims@britam.co.ug',
            requiresPreAuth: false,
            averageProcessingDays: 7,
            coverageTypes: ['Outpatient', 'Inpatient', 'Emergency']
        },
        {
            id: 'UG005',
            name: 'APA Insurance Uganda',
            shortName: 'APA',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.apainsurance.com/ug/v1',
            contactEmail: 'customerservice@apainsurance.co.ug',
            contactPhone: '+256 417 344000',
            website: 'https://apainsurance.org/ug',
            status: 'Active',
            claimSubmissionEmail: 'medical.claims@apainsurance.co.ug',
            requiresPreAuth: true,
            averageProcessingDays: 5,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental']
        },
        {
            id: 'UG006',
            name: 'ICEA LION Uganda',
            shortName: 'ICEA LION',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'info@icealion.co.ug',
            contactPhone: '+256 414 230000',
            website: ' https://www.icealion.co.ug',
            status: 'Active',
            claimSubmissionEmail: 'claims@icealion.co.ug',
            requiresPreAuth: true,
            averageProcessingDays: 6,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity']
        },
        {
            id: 'UG007',
            name: 'Prudential Uganda',
            shortName: 'Prudential',
            country: 'Uganda',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'customerservices@prudential.co.ug',
            contactPhone: '+256 414 340340',
            website: 'https://www.prudential.co.ug',
            status: 'Active',
            claimSubmissionEmail: 'health.claims@prudential.co.ug',
            requiresPreAuth: true,
            averageProcessingDays: 7,
            coverageTypes: ['Outpatient', 'Inpatient']
        }
    ],
    kenya: [
        {
            averageProcessingDays: 3,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental', 'Optical', 'Wellness']
        },
        {
            id: 'KE002',
            name: 'CIC Insurance Group',
            shortName: 'CIC',
            country: 'Kenya',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.cic.co.ke/v1',
            contactEmail: 'info@cic.co.ke',
            contactPhone: '+254 709 912000',
            website: 'https://www.cic.co.ke',
            status: 'Active',
            claimSubmissionEmail: 'medicalclaims@cic.co.ke',
            requiresPreAuth: true,
            averageProcessingDays: 4,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Cancer Care', 'Chronic Diseases']
        },
        {
            id: 'KE003',
            name: 'Madison Insurance',
            shortName: 'Madison',
            country: 'Kenya',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.madison.co.ke/v1',
            contactEmail: 'info@madison.co.ke',
            contactPhone: '+254 709 982000',
            website: 'https://www.madison.co.ke',
            status: 'Active',
            claimSubmissionEmail: 'claims@madison.co.ke',
            requiresPreAuth: true,
            averageProcessingDays: 4,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental']
        },
        {
            id: 'KE004',
            name: 'Britam Kenya',
            shortName: 'Britam',
            country: 'Kenya',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.britam.com/ke/v1',
            contactEmail: 'contactcentre@britam.com',
            contactPhone: '+254 711 066000',
            website: 'https://ke.britam.com',
            status: 'Active',
            claimSubmissionEmail: 'medical.claims@britam.com',
            requiresPreAuth: true,
            averageProcessingDays: 5,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Dental', 'Optical']
        }
    ],
    tanzania: [
        {
            id: 'TZ001',
            name: 'AAR Insurance Tanzania',
            shortName: 'AAR',
            country: 'Tanzania',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.aarinsurance.com/tz/v1',
            contactEmail: 'info@aar-insurance.co.tz',
            contactPhone: '+255 22 2135579',
            website: 'https://aarinsurance.co.tz',
            status: 'Active',
            claimSubmissionEmail: 'claims@aar-insurance.co.tz',
            requiresPreAuth: true,
            averageProcessingDays: 5,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Emergency']
        },
        {
            id: 'TZ002',
            name: 'Jubilee Insurance Tanzania',
            shortName: 'Jubilee',
            country: 'Tanzania',
            type: 'Health',
            apiEnabled: true,
            apiEndpoint: 'https://api.jubileeinsurance.com/tz/v1',
            contactEmail: 'info@jubileeinsurance.co.tz',
            contactPhone: '+255 22 2117463',
            website: 'https://jubileeinsurance.com/tz',
            status: 'Active',
            claimSubmissionEmail: 'health.claims@jubileeinsurance.co.tz',
            requiresPreAuth: true,
            averageProcessingDays: 6,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity', 'Chronic Care']
        },
        {
            id: 'TZ003',
            name: 'Strategis Insurance Tanzania',
            shortName: 'Strategis',
            country: 'Tanzania',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'info@strategis-insurance.com',
            contactPhone: '+255 22 2668990',
            website: 'https://strategis-insurance.com',
            status: 'Active',
            claimSubmissionEmail: 'claims@strategis-insurance.com',
            requiresPreAuth: false,
            averageProcessingDays: 7,
            coverageTypes: ['Outpatient', 'Inpatient']
        }
    ],
    rwanda: [
        {
            id: 'RW001',
            name: 'SONARWA General Insurance',
            shortName: 'SONARWA',
            country: 'Rwanda',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'info@sonarwa.co.rw',
            contactPhone: '+250 252 576237',
            website: 'https://www.sonarwa.co.rw',
            status: 'Active',
            claimSubmissionEmail: 'claims@sonarwa.co.rw',
            requiresPreAuth: true,
            averageProcessingDays: 5,
            coverageTypes: ['Outpatient', 'Inpatient', 'Maternity']
        },
        {
            id: 'RW002',
            name: 'Radiant Insurance Rwanda',
            shortName: 'Radiant',
            country: 'Rwanda',
            type: 'Health',
            apiEnabled: false,
            apiEndpoint: null,
            contactEmail: 'info@radiant.rw',
            contactPhone: '+250 788 300300',
            website: 'https://www.radiant.rw',
            status: 'Active',
            claimSubmissionEmail: 'medical@radiant.rw',
            requiresPreAuth: true,
            averageProcessingDays: 6,
            coverageTypes: ['Outpatient', 'Inpatient']
        }
    ]
};

// Helper function to get all providers
export const getAllProviders = () => {
    return [
        ...insuranceProviders.uganda,
        ...insuranceProviders.kenya,
        ...insuranceProviders.tanzania,
        ...insuranceProviders.rwanda
    ];
};

// Helper function to get providers by country
export const getProvidersByCountry = (country) => {
    return insuranceProviders[country.toLowerCase()] || [];
};

// Helper function to get provider by ID
export const getProviderById = (id) => {
    const allProviders = getAllProviders();
    return allProviders.find(provider => provider.id === id);
};

// Helper function to get API-enabled providers
export const getAPIEnabledProviders = () => {
    return getAllProviders().filter(provider => provider.apiEnabled);
};

// Helper function to get providers by status
export const getProvidersByStatus = (status) => {
    return getAllProviders().filter(provider => provider.status === status);
};

export default {
    insuranceProviders,
    getAllProviders,
    getProvidersByCountry,
    getProviderById,
    getAPIEnabledProviders,
    getProvidersByStatus
};
