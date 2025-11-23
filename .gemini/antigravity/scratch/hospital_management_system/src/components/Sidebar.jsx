import React from 'react';
import { NavLink } from 'react-router-dom';
// import { ... } from 'lucide-react'; // Icons removed

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/reception', label: 'Reception' },
    { path: '/doctor', label: 'Doctor' },
    { path: '/triage', label: 'Triage Station' },
    { path: '/emr', label: 'EMR' },
    { path: '/pharmacy', label: 'Pharmacy' },
    { path: '/laboratory', label: 'Laboratory' },
    { path: '/pathology', label: 'Pathology' },
    { path: '/radiology', label: 'Radiology' },
    { path: '/bed-management', label: 'Bed Management' },
    { path: '/nursing', label: 'Nursing Care' },
    { path: '/theatre', label: 'Theatre' },
    { path: '/maternity', label: 'Maternity' },
    { path: '/blood-bank', label: 'Blood Bank' },
    { path: '/ambulance', label: 'Ambulance' },
    { path: '/finance', label: 'Finance & Insurance' },
    { path: '/insurance', label: 'Insurance Management' },
    { path: '/hr', label: 'HR Management' },
    { path: '/services', label: 'Services & Prices' },
    { path: '/wallet', label: 'HMS Wallet' },
    { path: '/debt', label: 'Debt Management' },
    { path: '/communication', label: 'Communication' },
    { path: '/camps', label: 'Health Camps' },
    { path: '/queue', label: 'Queue Mgmt' },
    { path: '/reports', label: 'Reports & Records' },
    { path: '/admin', label: 'Administration' },
    { path: '/settings', label: 'Settings' },
  ];

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
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@adekisplus.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
