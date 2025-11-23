import React, { useState } from 'react';
import {
    UserPlus,
    Users,
    Clock,
    CreditCard,
    Activity,
    Phone,
    Search,
    Filter,
    CheckCircle,
    AlertCircle,
    FileText,
    Baby,
    DollarSign,
    Siren
} from 'lucide-react';

// Import Sub-components
import PatientManager from './components/PatientManager';
import BillingManager from './components/BillingManager';
import QueueDisplay from './components/QueueDisplay';
import MaternityCare from './components/MaternityCare';
import PediatricCare from './components/PediatricCare';
import EmergencyCare from './components/EmergencyCare';
import ServiceList from './components/ServiceList';
import WalkInRegistrationModal from './components/WalkInRegistrationModal';
import PatientCategoryView from './components/PatientCategoryView';
import { useData } from '../../context/DataContext';

const ReceptionDashboard = () => {
    const { patients: allPatients, setPatients, addBill } = useData();
    const [activeTab, setActiveTab] = useState('walk-in-services');
    const [showWalkInModal, setShowWalkInModal] = useState(false);

    // Filter for walk-in patients only
    const walkInPatients = allPatients.filter(p => p.id.startsWith('W-'));

    // Generate unique walk-in patient ID
    const generateWalkInId = () => {
        const walkInNumbers = allPatients
            .filter(p => p.id.startsWith('W-'))
            .map(p => parseInt(p.id.split('-')[1]))
            .filter(n => !isNaN(n));

        const maxNumber = walkInNumbers.length > 0 ? Math.max(...walkInNumbers) : 0;
        const newNumber = maxNumber + 1;
        return `W-${String(newNumber).padStart(3, '0')}`;
    };

    // Mock Data for Stats
    const stats = [
        { label: 'Regular Patients', value: allPatients.filter(p => p.id.startsWith('P-')).length, icon: Users, color: 'blue' },
        { label: 'Walk-in + Ins', value: walkInPatients.length, icon: UserPlus, color: 'emerald' },
        { label: 'Maternity', value: allPatients.filter(p => p.type === 'Maternity').length, icon: Baby, color: 'pink' },
        { label: 'Pediatric', value: allPatients.filter(p => p.type === 'Pediatric').length, icon: Baby, color: 'purple' },
        { label: 'Emergency', value: allPatients.filter(p => p.type === 'Emergency').length, icon: Siren, color: 'red' },
        { label: 'Pending Payments', value: '3', icon: CreditCard, color: 'amber' },
        { label: 'Completed', value: '0', icon: CheckCircle, color: 'teal' },
        { label: 'Revenue Today', value: 'UGX 115,000', icon: DollarSign, color: 'slate', isMoney: true },
    ];

    const handleWalkInSubmit = (data) => {
        const newPatient = {
            id: generateWalkInId(),
            name: data.name,
            phone: data.phone || 'N/A',
            email: data.email || 'N/A',
            age: data.age || 'N/A',
            gender: data.gender || 'N/A',
            visitDate: new Date().toLocaleString(),
            lastVisit: new Date().toLocaleDateString(),
            status: 'WAITING',
            paymentStatus: 'PENDING',
            total: `UGX ${data.totalAmount?.toLocaleString() || '0'}`,
            paymentMethod: '-',
            services: data.services?.map(s => s.name) || [],
            patientCategory: 'OPD', // Default category for walk-ins
            type: 'Walk-in'
        };
        setPatients([...allPatients, newPatient]);

        // Generate Bill
        addBill({
            patientId: newPatient.id,
            amount: 50000, // Standard Walk-in Consultation Fee
            type: 'Consultation',
            description: 'Walk-in Consultation Fee',
            status: 'Pending'
        });

        setShowWalkInModal(false);

        if (window.confirm('Patient registered successfully. Process consultation payment now?')) {
            setActiveTab('payments');
        }
    };

    // Helper Component for Stat Card
    const StatCard = ({ label, value, icon: Icon, color, isMoney }) => (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
                <span className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                    <Icon size={18} />
                </span>
                {isMoney && <span className="text-xs font-medium text-slate-400">Today</span>}
            </div>
            <div>
                <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</h3>
                <p className={`font-bold text-slate-800 ${isMoney ? 'text-lg' : 'text-2xl'}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reception Module</h1>
                    <p className="text-slate-500 text-sm mt-1">Patient registration, walk-in services, maternity care, payments, and doctor coordination</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('patients')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-lg shadow-slate-200">
                        <UserPlus size={16} />
                        Register Patient
                    </button>
                    <button onClick={() => setActiveTab('walk-in-services')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <Activity size={16} />
                        Walk-in Service
                    </button>
                    <button onClick={() => setActiveTab('payments')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <CreditCard size={16} />
                        Process Payment
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'patients' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        All Patients
                    </button>
                    <button
                        onClick={() => setActiveTab('walk-in-services')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'walk-in-services' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        Walk-in Services
                    </button>
                    <button
                        onClick={() => setActiveTab('maternity')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'maternity' ? 'bg-white text-pink-600 shadow-sm ring-1 ring-pink-200' : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50'}`}
                    >
                        Maternity
                    </button>
                    <button
                        onClick={() => setActiveTab('pediatric')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'pediatric' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-purple-200' : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'}`}
                    >
                        Pediatric
                    </button>
                    <button
                        onClick={() => setActiveTab('emergency')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'emergency' ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-200' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
                    >
                        Emergency
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'payments' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        Payments
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('doctor-calls')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'doctor-calls' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        Doctor Calls
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'patients' && <PatientManager />}
                    {activeTab === 'maternity' && <MaternityCare />}
                    {activeTab === 'pediatric' && <PediatricCare />}
                    {activeTab === 'emergency' && <EmergencyCare />}
                    {activeTab === 'categories' && <PatientCategoryView />}
                    {activeTab === 'payments' && <BillingManager />}
                    {activeTab === 'doctor-calls' && <QueueDisplay />}
                    {activeTab === 'service-catalog' && <ServiceList />}

                    {activeTab === 'walk-in-services' && (
                        <div className="space-y-6">
                            {/* Search and Filter Toolbar */}
                            <div className="flex justify-between items-center">
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search walk-in patients..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm">
                                        <Filter size={16} />
                                        Filter
                                    </button>
                                    <button
                                        onClick={() => setShowWalkInModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-bold shadow-lg shadow-primary/30"
                                    >
                                        <UserPlus size={18} />
                                        New Walk-in Patient
                                    </button>
                                </div>
                            </div>

                            {/* Patient Cards */}
                            <div className="space-y-4">
                                {walkInPatients.map((patient) => (
                                    <div key={patient.id} className="border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow bg-white group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                    <UserPlus size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-slate-800 text-lg">{patient.name}</h3>
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{patient.id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${patient.status === 'IN SERVICE' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {patient.status}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${patient.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {patient.paymentStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                                        <span>{patient.phone}</span>
                                                        <span>•</span>
                                                        <span>{patient.email}</span>
                                                        <span>•</span>
                                                        <span>{patient.visitDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium mr-2">
                                                    Mark Complete
                                                </button>
                                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                                    Print Receipt
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Services</p>
                                                <div className="flex gap-2">
                                                    {patient.services && patient.services.length > 0 ? (
                                                        patient.services.map((service, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-600 text-sm rounded-full border border-slate-100">
                                                                {service}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-slate-400">No services selected</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">Total Amount</p>
                                                <p className="text-xl font-bold text-emerald-600">{patient.total}</p>
                                                <p className="text-xs text-slate-400 mt-1">Paid via: {patient.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showWalkInModal && (
                <WalkInRegistrationModal
                    onClose={() => setShowWalkInModal(false)}
                    onSubmit={handleWalkInSubmit}
                />
            )}
        </div>
    );
};

export default ReceptionDashboard;
