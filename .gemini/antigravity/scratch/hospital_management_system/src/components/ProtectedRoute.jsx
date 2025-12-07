import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
    const { isAuthenticated, hasPermission, loading } = useAuth();
    const { modules } = useData();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with return URL
        return <Navigate to="/staff-login" state={{ from: location }} replace />;
    }

    // If a specific permission is required, check it
    if (requiredPermission) {
        // 1. Check User Permission
        if (!hasPermission(requiredPermission)) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-3xl">🚫</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                        <p className="text-slate-600 mb-4">
                            You don't have permission to access this module.
                        </p>
                        <p className="text-sm text-slate-500">
                            Contact your administrator if you believe this is an error.
                        </p>
                    </div>
                </div>
            );
        }

        // 2. Check Module Status
        if (modules) {
            const module = modules.find(m => m.id === requiredPermission);
            if (module && !module.enabled) {
                return (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-amber-600 text-3xl">🔒</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Disabled</h2>
                            <p className="text-slate-600 mb-4">
                                The <strong>{module.name}</strong> module is currently disabled.
                            </p>
                            <p className="text-sm text-slate-500">
                                An administrator can enable this module in System Settings.
                            </p>
                        </div>
                    </div>
                );
            }
        }
    }

    return children;
};

export default ProtectedRoute;
