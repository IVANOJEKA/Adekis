import React, { createContext, useContext, useState, useEffect } from 'react';

const BrandingContext = createContext();

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};

export const BrandingProvider = ({ children }) => {
    // Default branding
    const defaultBranding = {
        name: 'Adekis Hospital',
        logo: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        accentColor: '#8B5CF6',
        fontFamily: 'Inter',
        slogan: 'Excellence in Healthcare',
        website: 'www.adekis.com',
        email: 'info@adekis.com',
        phone: '+256 700 000 000',
        address: 'Kampala, Uganda',
        footerText: '© 2024 Adekis Hospital Management System',
        reportHeaderImage: null,
        reportFooterImage: null
    };

    const [branding, setBranding] = useState(defaultBranding);
    const [loading, setLoading] = useState(false); // Initially false to show defaults immediately

    // Load branding from local storage or API on mount
    useEffect(() => {
        const loadBranding = async () => {
            // In a real app, we would fetch from API here
            // For now, we'll check localStorage to persist changes across reloads
            const savedBranding = localStorage.getItem('hospital_branding');
            if (savedBranding) {
                try {
                    setBranding({ ...defaultBranding, ...JSON.parse(savedBranding) });
                } catch (e) {
                    console.error('Failed to parse saved branding', e);
                }
            }
        };

        loadBranding();
    }, []);

    // Apply CSS variables for dynamic theming
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', branding.primaryColor);
        root.style.setProperty('--color-secondary', branding.secondaryColor);
        root.style.setProperty('--color-accent', branding.accentColor);
        // Add more CSS variables as needed
    }, [branding]);

    const updateBranding = (newSettings) => {
        const updated = { ...branding, ...newSettings };
        setBranding(updated);
        localStorage.setItem('hospital_branding', JSON.stringify(updated));

        // Here you would also make an API call to save to the backend
        // await api.updateHospitalSettings(updated);
    };

    const resetBranding = () => {
        setBranding(defaultBranding);
        localStorage.removeItem('hospital_branding');
    };

    return (
        <BrandingContext.Provider value={{ branding, updateBranding, resetBranding, loading }}>
            {children}
        </BrandingContext.Provider>
    );
};
