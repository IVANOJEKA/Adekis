import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, FileText, TestTube, Pill, DollarSign, Calendar,
    LogOut, Shield, Bell, Activity, ChevronRight, Clock,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { usePatientAuth } from '../context/PatientAuthContext';
import { useData } from '../context/DataContext';

// Import portal components (we'll create these next)
import PatientProfile from '../modules/PatientPortal/PatientProfile';
import MedicalHistory from '../modules/PatientPortal/MedicalHistory';
import LabResults from '../modules/PatientPortal/LabResults';
import Prescriptions from '../modules/PatientPortal/Prescriptions';
import BillingHistory from '../modules/PatientPortal/BillingHistory';
import Appointments from '../modules/PatientPortal/Appointments';

const PatientPortal = () => {
    const navigate = useNavigate();
    const { currentPatient, logout, isAuthenticated } = usePatientAuth();
    const { patients, financialRecords, labOrders, prescriptions, appointments } = useData();

    const [activeSection, setActiveSection] = useState('dashboard');

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/patient-login');
        }
    }, [isAuthenticated, navigate]);

    if (!currentPatient) {
        return null;
    }

    // Get patient-specific data
    const patientBills = financialRecords.filter(record => record.patientId === currentPatient.id);
    const pendingBills = patientBills.filter(bill => bill.status === 'Pending');
    const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

    const patientLabs = labOrders?.filter(lab => lab.patientId === currentPatient.id) || [];
    const recentLabs = patientLabs.slice(0, 3);

    const patientPrescriptions = prescriptions?.filter(rx => rx.patientId === currentPatient.id) || [];
    const activePrescriptions = patientPrescriptions.filter(rx => rx.status === 'Active');

    const patientAppointments = appointments?.filter(apt => apt.patientId === currentPatient.id) || [];
    const upcomingAppointments = patientAppointments
        .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'Cancelled')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
            navigate('/patient-login');
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'history', label: 'Medical History', icon: FileText },
        { id: 'labs', label: 'Lab Results', icon: TestTube },
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
        { id: 'billing', label: 'Billing', icon: DollarSign },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <PatientProfile patient={currentPatient} />;
            case 'history':
                return <MedicalHistory patientId={currentPatient.id} />;
            case 'labs':
                return <LabResults patientId={currentPatient.id} />;
            case 'prescriptions':
                return <Prescriptions patientId={currentPatient.id} />;
            case 'billing':
                return <BillingHistory patientId={currentPatient.id} />;
            case 'appointments':
                return <Appointments patientId={currentPatient.id} />;
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, {currentPatient.name}!</h2>
                <p className="text-slate-600">Here's an overview of your health records</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar size={24} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Upcoming</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{upcomingAppointments.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Appointments</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <TestTube size={24} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Lab Results</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{recentLabs.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Recent tests</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Pill size={24} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Active Meds</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{activePrescriptions.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Prescriptions</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <DollarSign size={24} className="text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Pending Bills</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">UGX {totalPending.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{pendingBills.length} unpaid</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
                        <button
                            onClick={() => setActiveSection('appointments')}
                            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="p-6">
                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingAppointments.slice(0, 3).map(apt => (
                                    <div key={apt.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Calendar size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{apt.doctorName}</p>
                                            <p className="text-sm text-slate-600">{apt.department}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <Clock size={12} />
                                                {apt.date} at {apt.startTime}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No upcoming appointments</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Lab Results */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Recent Lab Results</h3>
                        <button
                            onClick={() => setActiveSection('labs')}
                            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="p-6">
                        {recentLabs.length > 0 ? (
                            <div className="space-y-3">
                                {recentLabs.map(lab => (
                                    <div key={lab.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                            <TestTube size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{lab.testName}</p>
                                            <p className="text-sm text-slate-600">{lab.orderDate}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${lab.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                lab.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {lab.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <TestTube size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No recent lab results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield size={24} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800">Patient Portal</h1>
                            <p className="text-xs text-slate-500">ID: {currentPatient.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-24">
                            <div className="space-y-1">
                                {menuItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                                            ? 'bg-primary text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
