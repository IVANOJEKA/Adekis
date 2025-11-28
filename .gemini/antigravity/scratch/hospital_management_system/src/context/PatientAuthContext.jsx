import React, { createContext, useContext, useState, useEffect } from 'react';

const PatientAuthContext = createContext();

export const usePatientAuth = () => {
    const context = useContext(PatientAuthContext);
    if (!context) {
        throw new Error('usePatientAuth must be used within a PatientAuthProvider');
    }
    return context;
};

export const PatientAuthProvider = ({ children }) => {
    const [currentPatient, setCurrentPatient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());

    const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('patientSession');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            const now = Date.now();

            // Check if session is still valid
            if (now - session.lastActivity < SESSION_TIMEOUT) {
                setCurrentPatient(session.patient);
                setIsAuthenticated(true);
                setLastActivity(session.lastActivity);
            } else {
                // Session expired
                localStorage.removeItem('patientSession');
            }
        }
    }, []);

    // Auto-logout on inactivity
    useEffect(() => {
        if (!isAuthenticated) return;

        const checkActivity = setInterval(() => {
            const now = Date.now();
            if (now - lastActivity > SESSION_TIMEOUT) {
                logout();
                alert('Your session has expired due to inactivity. Please log in again.');
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkActivity);
    }, [isAuthenticated, lastActivity]);

    // Update activity timestamp
    const updateActivity = () => {
        const now = Date.now();
        setLastActivity(now);

        if (isAuthenticated && currentPatient) {
            const session = {
                patient: currentPatient,
                lastActivity: now
            };
            localStorage.setItem('patientSession', JSON.stringify(session));
        }
    };

    // Track user activity
    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        events.forEach(event => {
            document.addEventListener(event, updateActivity);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, updateActivity);
            });
        };
    }, [isAuthenticated]);

    /**
     * Simulate sending OTP to patient's phone
     * In production, this would call an SMS API
     */
    const requestOTP = async (phoneNumber) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For development, return a fixed OTP
        // In production, this would be generated server-side and sent via SMS
        const otp = '123456';

        console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);

        return {
            success: true,
            message: 'OTP sent to your phone number',
            // In production, don't return the OTP
            devOTP: otp
        };
    };

    /**
     * Verify OTP and log in patient
     */
    const verifyOTP = async (phoneNumber, otp, patientData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // For development, accept '123456' as valid OTP
        if (otp === '123456') {
            const patient = {
                id: patientData.id,
                name: patientData.name,
                phone: phoneNumber,
                email: patientData.email,
                age: patientData.age,
                gender: patientData.gender
            };

            setCurrentPatient(patient);
            setIsAuthenticated(true);

            const now = Date.now();
            setLastActivity(now);

            // Save session
            const session = {
                patient,
                lastActivity: now
            };
            localStorage.setItem('patientSession', JSON.stringify(session));

            return {
                success: true,
                patient
            };
        } else {
            return {
                success: false,
                message: 'Invalid OTP. Please try again.'
            };
        }
    };

    /**
     * Logout patient
     */
    const logout = () => {
        setCurrentPatient(null);
        setIsAuthenticated(false);
        setLastActivity(Date.now());
        localStorage.removeItem('patientSession');
    };

    /**
     * Check if current patient matches the given patient ID
     */
    const isCurrentPatient = (patientId) => {
        return isAuthenticated && currentPatient && currentPatient.id === patientId;
    };

    const value = {
        currentPatient,
        isAuthenticated,
        requestOTP,
        verifyOTP,
        logout,
        isCurrentPatient,
        updateActivity
    };

    return (
        <PatientAuthContext.Provider value={value}>
            {children}
        </PatientAuthContext.Provider>
    );
};

export default PatientAuthContext;
