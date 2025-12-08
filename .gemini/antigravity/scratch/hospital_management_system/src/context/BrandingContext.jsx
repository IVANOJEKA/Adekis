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
        footerText: '© 2024 Adekis+ | Powered by Adekis Technology',
        reportHeaderImage: null,
        reportFooterImage: null,
        // Website Configuration
        websiteConfig: {
            showTopBar: true,
            heroTitle: 'Compassionate Care, Advanced Technology',
            heroSubtitle: 'We provide world-class medical services with a personal touch. Check your lab results online or visit us for comprehensive healthcare solutions.',
            heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80',
            showStats: true,
            stats: [
                { value: '15k+', label: 'Patients Served' },
                { value: '50+', label: 'Medical Staff' },
                { value: '24/7', label: 'Emergency Care' },
                { value: '10+', label: 'Specialties' }
            ],
            services: [
                { title: "General Consultation", description: "Expert medical consultation for all your health concerns with experienced doctors.", icon: "Stethoscope" },
                { title: "Advanced Laboratory", description: "State-of-the-art diagnostic laboratory services with quick turnaround times.", icon: "Microscope" },
                { title: "24/7 Pharmacy", description: "Fully stocked pharmacy available round the clock for your medication needs.", icon: "Pill" },
                { title: "Emergency Care", description: "Immediate emergency response and critical care services when every second counts.", icon: "Activity" },
                { title: "Maternity Services", description: "Comprehensive antenatal and postnatal care for mothers and newborns.", icon: "Heart" },
                { title: "Health Insurance", description: "We verify and accept major insurance providers for cashless treatments.", icon: "Shield" }
            ],
            emergencyPhone: '+256 700 999 999',
            welcomeMessage: 'Welcome to Adekis+',
            // New CMS Content
            promotions: [
                {
                    id: 1,
                    title: "Free Dental Checkup Camp",
                    description: "Join us this weekend for comprehensive dental screenings for the whole family.",
                    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
                    active: true
                },
                {
                    id: 2,
                    title: "Heart Health Month",
                    description: "50% off on all cardiac profile tests throughout February.",
                    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80",
                    active: true
                }
            ],
            healthCamps: [
                {
                    id: 1,
                    title: "Community Eye Care Camp",
                    date: "2024-03-15",
                    time: "09:00 AM - 04:00 PM",
                    location: "Main Hospital Grounds",
                    description: "Free cataract surgeries and vision testing for seniors.",
                    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80",
                    slots: 50
                }
            ],
            walletPackages: [
                {
                    id: 1,
                    name: "Silver Saver",
                    price: "50,000 UGX/yr",
                    benefits: ["5% off consultations", "Priority booking", "Digital health records"],
                    color: "slate"
                },
                {
                    id: 2,
                    name: "Gold Guardian",
                    price: "150,000 UGX/yr",
                    benefits: ["15% off consultations", "Free annual checkup", "Family coverage (up to 4)", "24/7 Tele-medicine"],
                    color: "amber",
                    recommended: true
                },
                {
                    id: 3,
                    name: "Platinum Premier",
                    price: "300,000 UGX/yr",
                    benefits: ["100% cashless OP treatments", "Private room upgrades", "Unlimited consultations", "Home sample collection"],
                    color: "cyan"
                }
            ]
        }
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
