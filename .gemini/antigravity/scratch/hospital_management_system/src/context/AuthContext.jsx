import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth as getAuthFromApp } from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../services/firebase';

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
    Receptionist: ['dashboard', 'reception', 'queue', 'finance-billing', 'insurance-verify', 'settings', 'services'],
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
                    localStorage.removeItem('hms_auth_token');
                }
            } catch (error) {
                console.error('Error loading user session:', error);
            }
        }
        setLoading(false);
        // Listen for 401 unauthorized events from api.js
        const handleUnauthorized = () => {
            setCurrentUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('hms_auth_token');
            localStorage.removeItem('hms_auth_user');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (email, password) => {
        try {
            // Use Firebase Auth for real authentication
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Fetch user metadata from Firestore
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

            let userSession;
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userSession = {
                    id: userCredential.user.uid,
                    name: userData.name,
                    email: userCredential.user.email,
                    role: userData.role,
                    department: userData.department,
                    hospitalId: userData.hospitalId || 'H-001',
                    permissions: userData.permissions || ROLE_PERMISSIONS[userData.role] || []
                };
            } else {
                // Fallback if no Firestore doc (shouldn't happen)
                userSession = {
                    id: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: email.split('@')[0],
                    role: 'Staff',
                    department: 'General',
                    hospitalId: 'H-001',
                    permissions: []
                };
            }

            setCurrentUser(userSession);
            setIsAuthenticated(true);

            // Save to localStorage
            localStorage.setItem('hms_auth_user', JSON.stringify(userSession));
            localStorage.setItem('hms_auth_time', new Date().getTime().toString());

            return { success: true, user: userSession };
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please check your credentials.';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials. Please check your email and password.';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = async () => {
        try {
            const { authAPI } = await import('../services/api');
            await authAPI.logout();
        } catch (e) {
            console.error('Logout error:', e);
        }

        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('hms_auth_user');
        localStorage.removeItem('hms_auth_time');
        localStorage.removeItem('hms_auth_token');
    };

    const register = async (userData) => {
        try {
            // Create Firebase Auth account and sign in immediately
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

            const userSession = {
                id: userCredential.user.uid,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                department: userData.department || 'Administration',
                hospitalId: 'H-001', // Default
                permissions: ROLE_PERMISSIONS[userData.role] || []
            };

            // Store user metadata in Firestore
            await setDoc(doc(db, 'users', userSession.id), {
                ...userSession,
                status: 'Active',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            setCurrentUser(userSession);
            setIsAuthenticated(true);
            localStorage.setItem('hms_auth_user', JSON.stringify(userSession));
            localStorage.setItem('hms_auth_time', new Date().getTime().toString());

            return { success: true, user: userSession };
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    // Create new user account (for Admin use)
    const createUser = async (email, password, userData) => {
        let secondaryApp;
        try {
            // Initialize a secondary Firebase App to avoid logging out the current user
            const appName = `secondary-${Date.now()}`;
            secondaryApp = initializeApp(firebaseConfig, appName);
            const secondaryAuth = getAuthFromApp(secondaryApp);

            // Create Firebase Auth account using the secondary auth instance
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

            // Store user metadata in Firestore (using the main DB instance)
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userData.name,
                email: email,
                role: userData.role,
                department: userData.department,
                phone: userData.phone || '',
                permissions: userData.permissions || ROLE_PERMISSIONS[userData.role] || [],
                hospitalId: 'H-001', // Default hospital
                status: 'Active',
                createdAt: new Date().toISOString(),
                lastLogin: null
            });

            // Cleanup the secondary app
            await deleteApp(secondaryApp);

            return { success: true, uid: userCredential.user.uid };
        } catch (error) {
            console.error('Create user error:', error);

            // Cleanup on error
            if (secondaryApp) {
                try { await deleteApp(secondaryApp); } catch (e) { console.error('Cleanup error', e); }
            }

            let errorMessage = 'Failed to create user account.';

            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }

            return { success: false, error: errorMessage };
        }
    };

    // Update existing user (for Admin use - change role/permissions)
    const updateUser = async (userId, updates) => {
        try {
            // Update user metadata in Firestore
            await setDoc(doc(db, 'users', userId), updates, { merge: true });
            return { success: true };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Failed to update user.' };
        }
    };

    const hasPermission = (moduleOrPath) => {
        if (!currentUser) return false;

        // Administrators have all permissions
        if (currentUser.permissions.includes('*')) return true;

        // Get permission key from path
        const permissionKey = MODULE_PERMISSIONS[moduleOrPath] || moduleOrPath;

        // SPECIAL BYPASS: Receptionist always has 'services' (Price Configuration)
        if (permissionKey === 'services' && currentUser.role?.toLowerCase().includes('reception')) {
            return true;
        }

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
        register,
        createUser,
        updateUser,
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
