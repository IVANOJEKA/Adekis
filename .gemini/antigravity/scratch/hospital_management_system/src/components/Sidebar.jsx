import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, isAuthenticated, hasPermission, logout } = useAuth();
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
    { path: '/debt', label: 'Debt Management', permission: 'debt' },
    { path: '/communication', label: 'Communication', permission: 'communication' },
    { path: '/camps', label: 'Health Camps', permission: 'camps' },
    { path: '/queue', label: 'Queue Mgmt', permission: 'queue' },
    { path: '/reports', label: 'Reports & Records', permission: 'reports' },
    { path: '/admin', label: 'Administration', permission: 'admin' },
    { path: '/settings', label: 'Settings', permission: 'settings' },
  ];

  // Filter menu items based on user permissions
  const menuItems = useMemo(() => {
    if (!isAuthenticated) return allMenuItems;
    return allMenuItems.filter(item => hasPermission(item.permission));
  }, [isAuthenticated, currentUser]);

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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white">A+</span>
            </div>
            <span>Adekis+</span>
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          {isAuthenticated && currentUser ? (
            <>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">Guest User</p>
                <p className="text-xs text-slate-500 truncate">Not logged in</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
