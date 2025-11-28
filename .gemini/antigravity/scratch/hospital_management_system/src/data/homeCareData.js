// Sample Home Care Data

export const sampleHomeCarePatients = [
    {
        id: "HC-001",
        patientId: "P-001",
        patientName: "Sarah Johnson",
        age: 65,
        gender: "Female",
        address: "123 Kampala Road, Kampala",
        phone: "0756123456",
        emergencyContact: {
            name: "Michael Johnson",
            phone: "0756789012",
            relationship: "Son"
        },
        diagnosis: "Post-surgical recovery - Hip replacement",
        careLevel: "Intensive",
        startDate: "2024-01-10",
        endDate: "2024-02-10",
        status: "Active",
        assignedNurseId: "EMP-045",
        assignedNurseName: "Nurse Mary",
        visitFrequency: "Daily",
        specialInstructions: "Monitor wound healing, assist with mobility exercises",
        createdDate: "2024-01-08T10:00:00"
    },
    {
        id: "HC-002",
        patientId: "P-015",
        patientName: "James Wilson",
        age: 72,
        gender: "Male",
        address: "456 Jinja Road, Kampala",
        phone: "0757234567",
        emergencyContact: {
            name: "Emily Wilson",
            phone: "0757890123",
            relationship: "Daughter"
        },
        diagnosis: "Diabetes management and wound care",
        careLevel: "Standard",
        startDate: "2024-01-05",
        endDate: "2024-03-05",
        status: "Active",
        assignedNurseId: "EMP-046",
        assignedNurseName: "Nurse Jane",
        visitFrequency: "Twice Daily",
        specialInstructions: "Monitor blood sugar levels, administer insulin",
        createdDate: "2024-01-03T14:30:00"
    },
    {
        id: "HC-003",
        patientId: "P-023",
        patientName: "Mary Nakato",
        age: 58,
        gender: "Female",
        address: "789 Entebbe Road, Kampala",
        phone: "0758345678",
        emergencyContact: {
            name: "Peter Nakato",
            phone: "0758901234",
            relationship: "Husband"
        },
        diagnosis: "Stroke recovery - physical therapy",
        careLevel: "Intensive",
        startDate: "2023-12-20",
        endDate: "2024-02-20",
        status: "Active",
        assignedNurseId: "EMP-045",
        assignedNurseName: "Nurse Mary",
        visitFrequency: "Daily",
        specialInstructions: "Assist with physiotherapy exercises, monitor vital signs",
        createdDate: "2023-12-18T09:15:00"
    }
];

export const sampleHomeCareVisits = [
    {
        id: "HV-20240124-001",
        homeCarePatientId: "HC-001",
        patientName: "Sarah Johnson",
        patientAddress: "123 Kampala Road, Kampala",
        nurseId: "EMP-045",
        nurseName: "Nurse Mary",
        scheduledDate: "2024-01-24",
        scheduledTime: "09:00 AM",
        actualStartTime: "2024-01-24T09:15:00",
        actualEndTime: "2024-01-24T10:00:00",
        status: "Completed",
        visitType: "Routine",
        servicesRendered: ["Wound dressing", "Vital signs check", "Mobility assistance"],
        vitalSigns: {
            bloodPressure: "135/85",
            temperature: "36.8°C",
            pulse: "78 bpm",
            respiration: "18/min",
            oxygenSaturation: "97%"
        },
        medications: [
            {
                name: "Paracetamol",
                dosage: "500mg",
                route: "Oral",
                time: "09:30 AM"
            }
        ],
        notes: "Patient recovering well. Wound healing properly, no signs of infection. Mobility improving.",
        nextVisitDate: "2024-01-25",
        completedDate: "2024-01-24T10:00:00",
        billAmount: 75000
    },
    {
        id: "HV-20240124-002",
        homeCarePatientId: "HC-002",
        patientName: "James Wilson",
        patientAddress: "456 Jinja Road, Kampala",
        nurseId: "EMP-046",
        nurseName: "Nurse Jane",
        scheduledDate: "2024-01-24",
        scheduledTime: "10:30 AM",
        actualStartTime: null,
        actualEndTime: null,
        status: "In Progress",
        visitType: "Routine",
        servicesRendered: [],
        vitalSigns: null,
        medications: [],
        notes: "",
        nextVisitDate: "2024-01-24",
        completedDate: null,
        billAmount: 65000
    },
    {
        id: "HV-20240124-003",
        homeCarePatientId: "HC-003",
        patientName: "Mary Nakato",
        patientAddress: "789 Entebbe Road, Kampala",
        nurseId: "EMP-045",
        nurseName: "Nurse Mary",
        scheduledDate: "2024-01-24",
        scheduledTime: "02:00 PM",
        actualStartTime: null,
        actualEndTime: null,
        status: "Scheduled",
        visitType: "Routine",
        servicesRendered: [],
        vitalSigns: null,
        medications: [],
        notes: "",
        nextVisitDate: null,
        completedDate: null,
        billAmount: 75000
    }
];

export const sampleHomeCarePlans = [
    {
        id: "HCP-001",
        homeCarePatientId: "HC-001",
        patientName: "Sarah Johnson",
        careGoals: [
            "Complete wound healing within 4 weeks",
            "Regain full mobility and independence",
            "Pain management and comfort"
        ],
        interventions: [
            {
                id: "I-001",
                description: "Wound dressing change",
                frequency: "Daily",
                instructions: "Clean with normal saline, apply antibiotic ointment, cover with sterile dressing"
            },
            {
                id: "I-002",
                description: "Mobility exercises",
                frequency: "Twice daily",
                instructions: "Assisted walking 10 minutes morning and evening, range of motion exercises"
            },
            {
                id: "I-003",
                description: "Vital signs monitoring",
                frequency: "Daily",
                instructions: "Record BP, temperature, pulse during each visit"
            }
        ],
        medications: [
            {
                name: "Paracetamol",
                dosage: "500mg",
                frequency: "3 times daily",
                route: "Oral",
                purpose: "Pain management"
            },
            {
                name: "Amoxicillin",
                dosage: "500mg",
                frequency: "3 times daily",
                route: "Oral",
                purpose: "Infection prevention"
            }
        ],
        dietaryInstructions: "High protein diet to promote healing. Ensure adequate hydration (8 glasses of water daily).",
        activityRestrictions: "Avoid heavy lifting for 6 weeks. Use walker for mobility support.",
        reviewDate: "2024-01-25",
        createdDate: "2024-01-10T10:00:00"
    },
    {
        id: "HCP-002",
        homeCarePatientId: "HC-002",
        patientName: "James Wilson",
        careGoals: [
            "Maintain blood sugar levels between 80-120 mg/dL",
            "Wound healing on left foot",
            "Prevent complications of diabetes"
        ],
        interventions: [
            {
                id: "I-004",
                description: "Blood sugar monitoring",
                frequency: "4 times daily",
                instructions: "Check fasting, before lunch, before dinner, and at bedtime"
            },
            {
                id: "I-005",
                description: "Insulin administration",
                frequency: "3 times daily",
                instructions: "10 units before each meal, adjust based on blood sugar readings"
            },
            {
                id: "I-006",
                description: "Foot wound care",
                frequency: "Daily",
                instructions: "Clean wound, apply prescribed ointment, monitor for signs of infection"
            }
        ],
        medications: [
            {
                name: "Insulin",
                dosage: "10 units",
                frequency: "3 times daily",
                route: "Subcutaneous injection",
                purpose: "Blood sugar control"
            },
            {
                name: "Metformin",
                dosage: "850mg",
                frequency: "Twice daily",
                route: "Oral",
                purpose: "Diabetes management"
            }
        ],
        dietaryInstructions: "Diabetic diet - low sugar, high fiber. Regular meal times. No sugary drinks.",
        activityRestrictions: "Light walking encouraged. Avoid prolonged standing.",
        reviewDate: "2024-01-26",
        createdDate: "2024-01-05T14:30:00"
    }
];
