import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// import { Menu, Bell, Search, User } from 'lucide-react'; // Icons removed
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-4 lg:px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        >
                            <span className="font-bold">Menu</span>
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <span className="text-slate-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search patients, files..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <span>🔔</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">Dr. Sarah Smith</span>
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                <span className="text-xs font-bold">DR</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
