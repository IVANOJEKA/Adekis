import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { useData } from '../context/DataContext';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, isAuthenticated, hasPermission, logout } = useAuth();
  const { branding } = useBranding();
  const { modules } = useData();
  const navigate = useNavigate();

  const allMenuItems = [
    { path: '/', label: 'Dashboard', permission: 'dashboard' },
    { path: '/reception', label: 'Reception', permission: 'reception' },
    { path: '/doctor', label: 'Doctor', permission: 'doctor' },
    { path: '/triage', label: 'Triage Station', permission: 'triage' },
    { path: '/emr', label: 'EMR', permission: 'emr' },
    { path: '/pharmacy', label: 'Pharmacy', permission: 'pharmacy' },
    { path: '/laboratory', label: 'Laboratory', permission: 'laboratory' },
    { path: '/pathology', label: 'Pathology', permission: 'pathology' },
    { path: '/radiology', label: 'Radiology', permission: 'radiology' },
    { path: '/bed-management', label: 'Bed Management', permission: 'bed-management' },
    { path: '/nursing', label: 'Nursing Care', permission: 'nursing' },
    { path: '/theatre', label: 'Theatre', permission: 'theatre' },
    { path: '/maternity', label: 'Maternity', permission: 'maternity' },
    { path: '/blood-bank', label: 'Blood Bank', permission: 'blood-bank' },
    { path: '/ambulance', label: 'Ambulance', permission: 'ambulance' },
    { path: '/finance', label: 'Finance & Insurance', permission: 'finance' },
    { path: '/insurance', label: 'Insurance Management', permission: 'insurance' },
    { path: '/hr', label: 'HR Management', permission: 'hr' },
    { path: '/services', label: 'Services & Prices', permission: 'services' },
    { path: '/wallet', label: 'HMS Wallet', permission: 'wallet' },
    { path: '/communication', label: 'Communication', permission: 'communication' },
    { path: '/camps', label: 'Health Camps', permission: 'camps' },
    { path: '/queue', label: 'Queue Mgmt', permission: 'queue' },
    { path: '/reports', label: 'Reports & Records', permission: 'reports' },
    { path: '/admin', label: 'Administration', permission: 'admin' },
    { path: '/settings', label: 'Settings', permission: 'settings' },
  ];

  // Filter menu items based on user permissions and enabled modules
  const menuItems = useMemo(() => {
    if (!isAuthenticated) return allMenuItems;

    return allMenuItems.filter(item => {
      // 1. Check User Permission
      if (!hasPermission(item.permission)) return false;

      // 2. Check if Module is Enabled
      // Find module by ID matching the permission (e.g., 'pharmacy', 'doctor')
      const module = modules.find(m => m.id === item.permission);

      // If module exists in configuration and is disabled, hide it
      // Items without a corresponding module (e.g., Dashboard) are always shown (if permission allows)
      if (module && !module.enabled) return false;

      return true;
    });
  }, [isAuthenticated, currentUser, modules]);

  const handleLogout = () => {
    logout();
    navigate('/staff-login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 text-slate-800 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col h-screen`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide text-slate-800">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm overflow-hidden"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {branding.logo && branding.logo.startsWith('data:image') ? (
                <img src={branding.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{branding.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <span>{branding.name}</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-700">
            <span className="font-bold">X</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium
                ${isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-3 pb-2 pt-2 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              A+
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">Powered by Adekis +</p>
              <p className="text-xs text-slate-500 truncate">Adekis+</p>
            </div>
          </div>
        </div>
      </aside >
    </>
  );
};

export default Sidebar;
