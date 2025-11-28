// Hospital Branding Configuration
export const hospitalConfig = {
    name: "General Hospital & Medical Center",
    shortName: "General Hospital",
    tagline: "Excellence in Healthcare",

    // Registration & Legal
    registrationNumber: "HRB-2024-00123",
    licenseNumber: "MED-LIC-2024-456",
    taxId: "TIN-789456123",

    // Contact Information
    contact: {
        phone: "+256 414 123 456",
        emergencyHotline: "+256 414 999 000",
        fax: "+256 414 123 457",
        email: "info@generalhospital.com",
        website: "www.generalhospital.com"
    },

    // Address
    address: {
        street: "123 Medical Plaza",
        city: "Kampala",
        district: "Central Division",
        country: "Uganda",
        postalCode: "P.O. Box 12345"
    },

    // Operating Hours
    hours: {
        weekdays: "24/7 Emergency Services",
        outpatient: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 1:00 PM"
    },

    // Branding Colors
    colors: {
        primary: "#2563eb", // Blue
        secondary: "#059669", // Green
        accent: "#dc2626" // Red for emergency
    },

    // Social Media
    social: {
        facebook: "@GeneralHospitalUG",
        twitter: "@GenHospitalUG",
        instagram: "@generalhospital_ug"
    },

    // Accreditations
    accreditations: [
        "Ministry of Health Uganda",
        "East African Medical Council",
        "International Hospital Accreditation"
    ],

    // Services
    specialties: [
        "Emergency Medicine",
        "Surgery",
        "Pediatrics",
        "Obstetrics & Gynecology",
        "Internal Medicine",
        "Radiology",
        "Laboratory Services",
        "Intensive Care Unit"
    ]
};

// Logo SVG (Hospital Cross Symbol)
export const hospitalLogoSVG = `
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
    <rect x="35" y="20" width="10" height="40" fill="white" rx="2"/>
    <rect x="20" y="35" width="40" height="10" fill="white" rx="2"/>
    <circle cx="40" cy="40" r="6" fill="#1e40af"/>
</svg>
`;

// Watermark SVG
export const watermarkSVG = `
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.03">
    <circle cx="200" cy="200" r="150" fill="#2563eb"/>
    <rect x="175" y="100" width="50" height="200" fill="white" rx="8"/>
    <rect x="100" y="175" width="200" height="50" fill="white" rx="8"/>
    <text x="200" y="320" font-family="Arial" font-size="24" fill="#2563eb" text-anchor="middle" font-weight="bold">
        GENERAL HOSPITAL
    </text>
</svg>
`;

export default hospitalConfig;
