import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { branding } = useBranding();

    // Don't show layout for login pages
    if (location.pathname === '/staff-login' || location.pathname === '/patient-login' || location.pathname === '/patient-portal') {
        return <Outlet />;
    }

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Get page title based on path
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patients, files..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2 hover:bg-slate-100 rounded-full relative text-slate-600">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-700">{currentUser?.name || 'Guest User'}</p>
                                <div className="flex items-center justify-end gap-1">
                                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                                        {currentUser?.role || 'Visitor'}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-6 custom-scrollbar">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;
