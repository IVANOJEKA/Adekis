import React, { useState } from 'react';
import { Search, Plus, User, FileText, CreditCard, MoreHorizontal, X, ChevronDown, ChevronUp, Calendar, Stethoscope, Wallet, Building, Smartphone, Receipt } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { useWallet } from '../../../context/WalletContext';
import { generatePatientId } from '../../../utils/patientIdUtils';
import NewCaseModal from './NewCaseModal';
import ReceiptModal from './ReceiptModal';

const PatientManager = () => {
    const { patients: allPatients, addPatient, cases, setCases, systemSettings, addBill } = useData();
    const { formatCurrency } = useCurrency();
    const { deductFromWallet, walletBalance } = useWallet();

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showNewCaseModal, setShowNewCaseModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [expandedPatientId, setExpandedPatientId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [generatedReceipt, setGeneratedReceipt] = useState(null);

    // Registration form state
    const [patientCategory, setPatientCategory] = useState('OPD');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentDetails, setPaymentDetails] = useState({
        insuranceProvider: '',
        policyNumber: '',
        mobileMoneyNumber: '',
        transactionRef: '',
        cardNumber: ''
    });

    const patients = allPatients
        .filter(p => !p.id.startsWith('W-'))
        .filter(p => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                p.name?.toLowerCase().includes(search) ||
                p.id?.toLowerCase().includes(search) ||
                p.phone?.toLowerCase().includes(search)
            );
        });

    const getPatientCases = (patientId) => {
        return cases.filter(c => c.patientId === patientId)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate wallet if needed
        if (paymentMethod === 'HMS Wallet') {
            const consultationFee = systemSettings.consultationFees[patientCategory];
            if (walletBalance < consultationFee) {
                alert('Insufficient wallet balance');
                return;
            }
        }

        const formData = new FormData(e.target);

        // Calculate DOB from Age
        const age = parseInt(formData.get('age'));
        const birthYear = new Date().getFullYear() - age;
        const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

        const consultationFee = systemSettings.consultationFees[patientCategory];
        const currentDate = new Date().toISOString();

        // Prepare patient data for Backend API
        const patientData = {
            name: formData.get('fullName'),
            dateOfBirth: dateOfBirth,
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            address: formData.get('address') || 'N/A',
            email: '', // Add email field if available in form
            patientCategory: patientCategory,
            insuranceProvider: paymentMethod === 'Insurance' ? paymentDetails.insuranceProvider : null,
            insurancePolicyNo: paymentMethod === 'Insurance' ? paymentDetails.policyNumber : null,
            emergencyContact: '', // Add if available
            emergencyPhone: '' // Add if available
        };

        // Call API to create patient
        const result = await addPatient(patientData);

        if (!result.success) {
            alert(`Failed to register patient: ${result.error}`);
            return;
        }

        const newPatient = result.patient;
        const patientId = newPatient.patientId; // Use the readable ID from backend
        const receiptId = `${systemSettings.receiptPrefix || 'REC'}-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Create receipt for EMR and display
        const newReceipt = {
            id: receiptId,
            patientId: patientId,
            patientName: newPatient.name,
            patientType: patientCategory,
            amount: consultationFee,
            paymentMethod: paymentMethod,
            date: currentDate,
            issuedBy: 'Reception',
            hospitalName: systemSettings.hospitalName || 'Central Hospital',
            hospitalAddress: systemSettings.hospitalAddress || 'Kampala, Uganda',
            hospitalPhone: systemSettings.hospitalPhone || '+256 700 000000'
        };

        // Create financial record for consultation fee (Local for now, TODO: Migrate to Backend)
        const consultationFeeRecord = {
            id: `FIN-${Date.now()}`,
            patientId: patientId,
            type: 'Consultation Fee',
            category: patientCategory,
            description: `${patientCategory} Consultation Fee`,
            amount: consultationFee,
            status: 'Paid',
            paymentDate: currentDate,
            paymentMethod: paymentMethod,
            receiptId: receiptId,
            paidAt: 'Reception'
        };

        // Process payment if wallet
        if (paymentMethod === 'HMS Wallet') {
            await deductFromWallet(consultationFee, `Consultation Fee - ${patientId}`);
        }

        // Add bill to system
        addBill(consultationFeeRecord);

        // Auto-create initial case for new patient (Local for now)
        const initialCase = {
            id: `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(4, '0')}`,
            patientId: patientId, // Use readable ID for consistency with local data
            patientName: newPatient.name,
            status: 'Open',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            type: patientCategory,
            department: 'General Medicine',
            chiefComplaint: 'Initial Registration',
            assignedDoctorId: null
        };
        setCases([...cases, initialCase]);

        // Reset form state
        setPatientCategory('OPD');
        setPaymentMethod('Cash');
        setPaymentDetails({
            insuranceProvider: '',
            policyNumber: '',
            mobileMoneyNumber: '',
            transactionRef: '',
            cardNumber: ''
        });

        // Show receipt modal
        setShowRegisterModal(false);
        setGeneratedReceipt(newReceipt);
        setShowReceiptModal(true);
    };

    const handleNewCase = (patient) => {
        setSelectedPatient(patient);
        setShowNewCaseModal(true);
    };

    const handleSaveCase = (newCase) => {
        setCases([...cases, newCase]);
        setShowNewCaseModal(false);
        setSelectedPatient(null);
        alert(`New case created successfully!\nCase ID: ${newCase.id}\nPatient: ${newCase.patientName}`);
    };

    const togglePatientExpand = (patientId) => {
        setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Name, ID, or Phone..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                    />
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={18} />
                    Register New Patient
                </button>
            </div>

            {/* Patient Cards */}
            <div className="space-y-3">
                {patients.map((patient) => {
                    const patientCases = getPatientCases(patient.id);
                    const isExpanded = expandedPatientId === patient.id;

                    return (
                        <div key={patient.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all">
                            {/* Patient Header */}
                            <div
                                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                                onClick={() => togglePatientExpand(patient.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-lg">{patient.name}</h3>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{patient.patientId || patient.id}</span>
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${patient.type === 'Insurance' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {patient.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span>{patient.gender}, {patient.age} yrs</span>
                                                <span>•</span>
                                                <span>{patient.phone}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <FileText size={14} />
                                                    {patientCases.length} case{patientCases.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNewCase(patient);
                                            }}
                                            className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                                        >
                                            <Plus size={14} />
                                            New Case
                                        </button>
                                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Case History */}
                            {isExpanded && (
                                <div className="border-t border-slate-100 bg-slate-50 p-4">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FileText size={16} />
                                        Medical Case History
                                    </h4>
                                    {patientCases.length > 0 ? (
                                        <div className="space-y-2">
                                            {patientCases.map((caseItem) => (
                                                <div key={caseItem.id} className="bg-white rounded-lg p-3 border border-slate-200">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                                {caseItem.id}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${caseItem.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {caseItem.status}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                                                {caseItem.type}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Calendar size={12} />
                                                            {caseItem.startDate}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm">
                                                        <div className="flex items-start gap-2 mb-1">
                                                            <Stethoscope size={14} className="text-slate-400 mt-0.5" />
                                                            <div>
                                                                <span className="font-medium text-slate-700">{caseItem.department}</span>
                                                                <p className="text-slate-600 mt-0.5">{caseItem.chiefComplaint}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-400">
                                            <FileText size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No cases recorded yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {patients.length === 0 && (
                    <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                        <User size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-slate-600 font-medium mb-1">No patients found</h3>
                        <p className="text-slate-400 text-sm">
                            {searchTerm ? 'Try a different search term' : 'Register your first patient to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Register New Patient</h3>
                            <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleRegister} className="p-6 space-y-6 overflow-y-auto">
                            {/* Patient ID Preview */}
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Patient ID (Auto-Generated)</p>
                                        <p className="text-2xl font-bold text-primary mt-1">Auto-Generated</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                        Auto-Assigned
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input name="fullName" required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <input name="phone" required type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 077..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Age</label>
                                        <input name="age" required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="25" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Gender</label>
                                        <select name="gender" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Address</label>
                                    <input name="address" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Kampala, Uganda" />
                                </div>

                                {/* Patient Category - OPD/IPD */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700">Patient Category *</label>
                                    <select
                                        value={patientCategory}
                                        onChange={(e) => setPatientCategory(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                    >
                                        <option value="OPD">OPD - Outpatient Department</option>
                                        <option value="IPD">IPD - Inpatient Department</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Payment Type</label>
                                    <select name="type" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                        <option value="Private">Private (Cash)</option>
                                        <option value="Insurance">Insurance</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Insurance Provider (Optional)</label>
                                    <input name="insuranceProvider" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Jubilee,  UAP" />
                                </div>
                            </div>

                            {/* Consultation Fee Payment Section */}
                            <div className="border-t border-slate-200 pt-4">
                                <h4 className="font-bold text-slate-800 mb-4">💳 Consultation Fee Payment</h4>

                                {/* Fee Display */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-600">Consultation Fee ({patientCategory})</p>
                                            <p className="text-2xl font-bold text-primary">{formatCurrency(systemSettings.consultationFees[patientCategory])}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                                            Required
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-3 mb-4">
                                    <label className="text-sm font-bold text-slate-700">Payment Method *</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {systemSettings.paymentMethods?.map((method) => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setPaymentMethod(method)}
                                                className={`p-3 border-2 rounded-lg transition-all text-sm font-medium ${paymentMethod === method
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-slate-200 hover:border-primary/50'
                                                    }`}
                                            >
                                                {method === 'Cash' && <CreditCard size={18} className="mx-auto mb-1" />}
                                                {method === 'Card' && <CreditCard size={18} className="mx-auto mb-1" />}
                                                {method === 'Mobile Money' && <Smartphone size={18} className="mx-auto mb-1" />}
                                                {method === 'Insurance' && <Building size={18} className="mx-auto mb-1" />}
                                                {method === 'HMS Wallet' && <Wallet size={18} className="mx-auto mb-1" />}
                                                <div>{method}</div>
                                                {method === 'HMS Wallet' && (
                                                    <div className="text-xs mt-1 opacity-70">
                                                        Bal: {formatCurrency(walletBalance)}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Method Specific Fields */}
                                {paymentMethod === 'Insurance' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Insurance Provider *</label>
                                            <input
                                                type="text"
                                                required
                                                value={paymentDetails.insuranceProvider}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, insuranceProvider: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                                                placeholder="e.g., AAR Insurance"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Policy Number *</label>
                                            <input
                                                type="text"
                                                required
                                                value={paymentDetails.policyNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, policyNumber: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                                                placeholder="Policy number"
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'Mobile Money' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Mobile Money Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={paymentDetails.mobileMoneyNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileMoneyNumber: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                                                placeholder="0700123456"
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'Card' && (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Card Number *</label>
                                            <input
                                                type="text"
                                                required
                                                value={paymentDetails.cardNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                                                placeholder="**** **** **** ****"
                                                maxLength="19"
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'HMS Wallet' && walletBalance < systemSettings.consultationFees[patientCategory] && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-700 text-sm font-medium">
                                            ⚠️ Insufficient wallet balance. Please top up or choose another payment method.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={paymentMethod === 'HMS Wallet' && walletBalance < systemSettings.consultationFees[patientCategory]}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Receipt size={18} />
                                    Pay & Complete Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceiptModal && generatedReceipt && (
                <ReceiptModal
                    receipt={generatedReceipt}
                    onClose={() => setShowReceiptModal(false)}
                />
            )}

            {/* New Case Modal */}
            {showNewCaseModal && selectedPatient && (
                <NewCaseModal
                    patient={selectedPatient}
                    onClose={() => setShowNewCaseModal(false)}
                    onSave={handleSaveCase}
                />
            )}
        </div>
    );
};

export default PatientManager;
