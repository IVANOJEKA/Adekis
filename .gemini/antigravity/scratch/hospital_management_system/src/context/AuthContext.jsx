import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Role-based permission mapping
const ROLE_PERMISSIONS = {
    Administrator: ['*'], // All modules
    Doctor: ['dashboard', 'doctor', 'emr', 'triage', 'laboratory', 'radiology', 'pathology', 'pharmacy-view', 'reports', 'settings'],
    Nurse: ['dashboard', 'nursing', 'bed-management', 'triage', 'emr-limited', 'theatre', 'maternity', 'ambulance', 'reports', 'settings'],
    Pharmacist: ['dashboard', 'pharmacy', 'emr-prescriptions', 'reports', 'settings'],
    'Lab Technician': ['dashboard', 'laboratory', 'pathology', 'emr-tests', 'reports', 'settings'],
    Radiologist: ['dashboard', 'radiology', 'emr-imaging', 'reports', 'settings'],
    Receptionist: ['dashboard', 'reception', 'queue', 'finance-billing', 'insurance-verify', 'settings'],
    'Finance Officer': ['dashboard', 'finance', 'debt', 'insurance', 'hr-payroll', 'reports', 'settings'],
    'HR Manager': ['dashboard', 'hr', 'reports', 'settings'],
    'Blood Bank Officer': ['dashboard', 'blood-bank', 'emr-blood', 'reports', 'settings']
};

// Module to permission mapping
const MODULE_PERMISSIONS = {
    '/': 'dashboard',
    '/reception': 'reception',
    '/doctor': 'doctor',
    '/triage': 'triage',
    '/emr': 'emr',
    '/pharmacy': 'pharmacy',
    '/laboratory': 'laboratory',
    '/pathology': 'pathology',
    '/radiology': 'radiology',
    '/bed-management': 'bed-management',
    '/nursing': 'nursing',
    '/theatre': 'theatre',
    '/maternity': 'maternity',
    '/blood-bank': 'blood-bank',
    '/ambulance': 'ambulance',
    '/finance': 'finance',
    '/insurance': 'insurance',
    '/hr': 'hr',
    '/services': 'services',
    '/wallet': 'wallet',
    '/debt': 'debt',
    '/communication': 'communication',
    '/camps': 'camps',
    '/queue': 'queue',
    '/reports': 'reports',
    '/admin': 'admin',
    '/settings': 'settings'
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('hms_auth_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Check if session is still valid (24 hours)
                const loginTime = localStorage.getItem('hms_auth_time');
                const now = new Date().getTime();
                const twentyFourHours = 24 * 60 * 60 * 1000;

                if (loginTime && (now - parseInt(loginTime)) < twentyFourHours) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                } else {
                    // Session expired
                    localStorage.removeItem('hms_auth_user');
                    localStorage.removeItem('hms_auth_time');
                }
            } catch (error) {
                console.error('Error loading user session:', error);
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password, users) => {
        // Find user by email
        const user = users.find(u => u.email === email && u.status === 'Active');

        if (!user) {
            return { success: false, error: 'Invalid email or user is inactive' };
        }

        // Check password (in production, this should be hashed)
        if (user.password !== password) {
            return { success: false, error: 'Invalid password' };
        }

        // Create user session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            permissions: user.permissions || ROLE_PERMISSIONS[user.role] || []
        };

        setCurrentUser(userSession);
        setIsAuthenticated(true);

        // Save to localStorage
        localStorage.setItem('hms_auth_user', JSON.stringify(userSession));
        localStorage.setItem('hms_auth_time', new Date().getTime().toString());

        return { success: true, user: userSession };
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('hms_auth_user');
        localStorage.removeItem('hms_auth_time');
    };

    const hasPermission = (moduleOrPath) => {
        if (!currentUser) return false;

        // Administrators have all permissions
        if (currentUser.permissions.includes('*')) return true;

        // Get permission key from path
        const permissionKey = MODULE_PERMISSIONS[moduleOrPath] || moduleOrPath;

        // Check if user has this permission
        return currentUser.permissions.some(perm => {
            if (perm === permissionKey) return true;
            // Check for partial matches (e.g., 'emr' matches 'emr-limited')
            if (permissionKey.startsWith(perm) || perm.startsWith(permissionKey)) return true;
            return false;
        });
    };

    const hasRole = (role) => {
        return currentUser?.role === role;
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        hasPermission,
        hasRole,
        ROLE_PERMISSIONS
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
