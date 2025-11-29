import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
    Search, Plus, Filter, Calendar, Clock, MoreVertical,
    UserPlus, FileText, CreditCard, Activity, Users,
    ChevronDown, ChevronUp, Receipt, UserCheck, DollarSign,
    LayoutDashboard, Stethoscope, Baby, HeartPulse, List
} from 'lucide-react';
import ServiceList from './components/ServiceList';
import EmergencyCare from './components/EmergencyCare';
import MaternityCare from './components/MaternityCare';
import PediatricCare from './components/PediatricCare';
import PatientCategoryView from './components/PatientCategoryView';
import PatientManager from './components/PatientManager';
import BillingManager from './components/BillingManager';
import QueueDisplay from './components/QueueDisplay';

// Import Modals
import WalkInRegistrationModal from './components/WalkInRegistrationModal';
import ConvertPatientModal from './components/ConvertPatientModal';
import AddBillModal from './components/AddBillModal';
import PatientBillModal from './components/PatientBillModal';

const ReceptionDashboard = () => {
    const { patients, addBill, financialRecords, addPatient } = useData();
    const [activeTab, setActiveTab] = useState('overview');

    // Walk-in State
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedWalkInId, setExpandedWalkInId] = useState(null);

    // Conversion State
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [patientToConvert, setPatientToConvert] = useState(null);

    // Billing State
    const [showAddBillModal, setShowAddBillModal] = useState(false);
    const [showViewBillModal, setShowViewBillModal] = useState(false);
    const [selectedBillingPatient, setSelectedBillingPatient] = useState(null);

    // Filter walk-in patients (Category is 'Walk-in')
    const walkInPatients = patients
        .filter(p => p.patientCategory === 'Walk-in')
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(p => {
            // Calculate total bill for this patient
            const patientBills = financialRecords.filter(f => f.patientId === p.id);
            const totalAmount = patientBills.reduce((sum, bill) => sum + bill.amount, 0);
            const isPaid = patientBills.every(bill => bill.status === 'Paid') && patientBills.length > 0;

            return {
                ...p,
                total: `UGX ${totalAmount.toLocaleString()}`,
                paymentStatus: isPaid ? 'PAID' : patientBills.length === 0 ? 'NO BILL' : 'PENDING',
                paymentMethod: patientBills[0]?.paymentMethod || 'Cash'
            };
        });

    // Handlers
    const handleWalkInSubmit = async (formData) => {
        // Calculate DOB from Age (assuming age is provided)
        const age = parseInt(formData.age || 0);
        const birthYear = new Date().getFullYear() - age;
        const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

        const patientData = {
            name: formData.name,
            dateOfBirth: dateOfBirth,
            gender: formData.gender || 'Unknown',
            phone: formData.phone,
            address: formData.address || 'N/A',
            patientCategory: 'Walk-in', // Use this to identify walk-ins
            status: 'WAITING'
        };

        const result = await addPatient(patientData);

        if (!result.success) {
            alert(`Failed to register walk-in patient: ${result.error}`);
            return;
        }

        const newPatient = result.patient;

        addBill({
            patientId: newPatient.patientId, // Use readable ID
            patientName: newPatient.name,
            amount: 50000,
            type: 'Consultation',
            description: 'Walk-in Consultation Fee',
            status: 'Pending'
        });

        setShowWalkInModal(false);

        if (window.confirm('Patient registered successfully. Process consultation payment now?')) {
            setActiveTab('billing'); // Redirect to billing tab
        }
    };

    const handleStartConversion = (patient) => {
        setPatientToConvert(patient);
        setShowConvertModal(true);
    };

    const handleConvertPatient = (conversionData) => {
        console.log('Converting patient:', patientToConvert, 'with data:', conversionData);
        alert(`Patient ${patientToConvert.name} converted to Regular Patient successfully!`);
        setShowConvertModal(false);
        setPatientToConvert(null);
    };

    const handleMarkComplete = (patientId) => {
        console.log('Marking complete:', patientId);
    };

    const handlePrintReceipt = (patient) => {
        alert(`Printing receipt for ${patient.name}...`);
    };

    const handleAddBill = (patient) => {
        setSelectedBillingPatient(patient);
        setShowAddBillModal(true);
    };

    const handleViewBill = (patient) => {
        setSelectedBillingPatient(patient);
        setShowViewBillModal(true);
    };

    // Render Content based on Active Tab
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <PatientCategoryView />;
            case 'patients':
                return <PatientManager />;
            case 'billing':
                return <BillingManager />;
            case 'queue':
                return <QueueDisplay />;
            case 'services':
                return <ServiceList />;
            case 'emergency':
                return <EmergencyCare />;
            case 'maternity':
                return <MaternityCare />;
            case 'pediatrics':
                return <PediatricCare />;
            case 'walkin':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <UserPlus size={20} className="text-emerald-600" />
                                Walk-in Patients Management
                            </h2>

                            {/* Search */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search walk-ins by name or ID..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>

                            {/* Patient Cards */}
                            <div className="space-y-4">
                                {walkInPatients.length > 0 ? (
                                    walkInPatients.map((patient) => {
                                        const isExpanded = expandedWalkInId === patient.id;

                                        return (
                                            <div key={patient.id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                                                {/* Patient Header - Clickable */}
                                                <div
                                                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                                                    onClick={() => setExpandedWalkInId(isExpanded ? null : patient.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                                <UserPlus size={20} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-bold text-slate-800 text-lg hover:text-primary transition-colors">{patient.name}</h3>
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{patient.id}</span>
                                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${patient.status === 'IN SERVICE' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                        {patient.status}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${patient.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                        {patient.paymentStatus}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                                    <span>{patient.phone}</span>
                                                                    <span>•</span>
                                                                    <span>{patient.visitDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-right mr-4">
                                                                <p className="text-sm text-slate-500">Total Amount</p>
                                                                <p className="text-xl font-bold text-emerald-600">{patient.total}</p>
                                                            </div>
                                                            {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && (
                                                    <div className="border-t border-slate-100 bg-slate-50 p-6">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            {/* Left Column - Patient Details & Services */}
                                                            <div className="space-y-4">
                                                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Patient Information</h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Name:</span>
                                                                            <span className="font-medium text-slate-800">{patient.name}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Patient ID:</span>
                                                                            <span className="font-bold text-primary">{patient.id}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Phone:</span>
                                                                            <span className="font-medium text-slate-800">{patient.phone}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Email:</span>
                                                                            <span className="font-medium text-slate-800">{patient.email || 'N/A'}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Address:</span>
                                                                            <span className="font-medium text-slate-800">{patient.address || 'N/A'}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Visit Date:</span>
                                                                            <span className="font-medium text-slate-800">{patient.visitDate}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                        <FileText size={16} />
                                                                        Selected Services
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {patient.services && patient.services.length > 0 ? (
                                                                            patient.services.map((service, idx) => (
                                                                                <div key={idx} className="px-3 py-2 bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-100">
                                                                                    {service}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <p className="text-sm text-slate-400">No services selected</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Right Column - Actions & Billing */}
                                                            <div className="space-y-4">
                                                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Payment Summary</h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                                            <span className="text-slate-500">Total Amount:</span>
                                                                            <span className="text-2xl font-bold text-emerald-600">{patient.total}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Payment Method:</span>
                                                                            <span className="font-medium text-slate-800">{patient.paymentMethod || 'Not specified'}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-slate-500">Payment Status:</span>
                                                                            <span className={`px-2 py-1 text-xs font-bold rounded ${patient.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                                {patient.paymentStatus}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Actions</h4>
                                                                    <div className="space-y-2">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleAddBill(patient);
                                                                                }}
                                                                                className="px-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2"
                                                                            >
                                                                                <DollarSign size={16} className="text-emerald-600" />
                                                                                Add Bill
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleViewBill(patient);
                                                                                }}
                                                                                className="px-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2"
                                                                            >
                                                                                <FileText size={16} className="text-blue-600" />
                                                                                View Bill
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleStartConversion(patient);
                                                                            }}
                                                                            className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                                        >
                                                                            <UserCheck size={16} />
                                                                            Convert to Regular Patient
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleMarkComplete(patient.id);
                                                                            }}
                                                                            disabled={patient.status === 'COMPLETED'}
                                                                            className={`w-full px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${patient.status === 'COMPLETED'
                                                                                ? 'bg-green-50 border-green-200 text-green-700 cursor-not-allowed'
                                                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                                                                }`}
                                                                        >
                                                                            {patient.status === 'COMPLETED' ? '✓ Completed' : 'Mark as Complete'}
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handlePrintReceipt(patient);
                                                                            }}
                                                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2"
                                                                        >
                                                                            <Receipt size={16} />
                                                                            Print Receipt
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No walk-in patients found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <PatientCategoryView />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reception Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage patient registration, appointments, and billing</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowWalkInModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-lg shadow-emerald-500/30"
                    >
                        <UserPlus size={16} />
                        New Walk-in
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30">
                        <Plus size={16} />
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 no-scrollbar">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'patients', label: 'Patients', icon: Users },
                    { id: 'walkin', label: 'Walk-in', icon: UserPlus },
                    { id: 'billing', label: 'Billing', icon: CreditCard },
                    { id: 'queue', label: 'Queue', icon: Clock },
                    { id: 'services', label: 'Services', icon: List },
                    { id: 'emergency', label: 'Emergency', icon: HeartPulse },
                    { id: 'maternity', label: 'Maternity', icon: Baby },
                    { id: 'pediatrics', label: 'Pediatrics', icon: Stethoscope },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>

            {/* Modals */}
            {showWalkInModal && (
                <WalkInRegistrationModal
                    onClose={() => setShowWalkInModal(false)}
                    onSubmit={handleWalkInSubmit}
                />
            )}

            {showConvertModal && patientToConvert && (
                <ConvertPatientModal
                    walkInPatient={patientToConvert}
                    onClose={() => {
                        setShowConvertModal(false);
                        setPatientToConvert(null);
                    }}
                    onConvert={handleConvertPatient}
                />
            )}

            {showAddBillModal && selectedBillingPatient && (
                <AddBillModal
                    patient={selectedBillingPatient}
                    onClose={() => {
                        setShowAddBillModal(false);
                        setSelectedBillingPatient(null);
                    }}
                    onBillAdded={(newBill) => {
                        console.log('Bill added:', newBill);
                    }}
                />
            )}

            {showViewBillModal && selectedBillingPatient && (
                <PatientBillModal
                    patient={selectedBillingPatient}
                    onClose={() => {
                        setShowViewBillModal(false);
                        setSelectedBillingPatient(null);
                    }}
                />
            )}
        </div>
    );
};

export default ReceptionDashboard;
