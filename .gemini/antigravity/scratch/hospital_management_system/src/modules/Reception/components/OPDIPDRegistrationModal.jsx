import React, { useState, useMemo } from 'react';
import { X, Search, Check, Clock, Tag, CreditCard, Wallet, Building, Smartphone, Receipt as ReceiptIcon, User, Stethoscope, Bed } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { useWallet } from '../../../context/WalletContext';
import { generatePatientId } from '../../../utils/patientIdUtils';

const OPDIPDRegistrationModal = ({ onClose, onSubmit }) => {
    const { patients: allPatients, systemSettings, addBill, setPatients } = useData();
    const { formatCurrency } = useCurrency();
    const { deductFromWallet, walletBalance } = useWallet();

    const [step, setStep] = useState('patientType'); // patientType, patientDetails, payment, receipt
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        patientType: '', // 'OPD' or 'IPD'
        notes: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentDetails, setPaymentDetails] = useState({
        insuranceProvider: '',
        policyNumber: '',
        mobileMoneyNumber: '',
        transactionRef: '',
        cardNumber: ''
    });

    const [registeredPatient, setRegisteredPatient] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const consultationFee = formData.patientType ? systemSettings.consultationFees[formData.patientType] : 0;

    const handlePatientTypeSelect = (type) => {
        setFormData({ ...formData, patientType: type });
        setStep('patientDetails');
    };

    const handlePatientDetailsSubmit = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const generateReceiptId = () => {
        return `${systemSettings.receiptPrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        // Validate payment method specific details
        if (paymentMethod === 'HMS Wallet' && walletBalance < consultationFee) {
            alert('Insufficient wallet balance');
            return;
        }

        // Generate patient ID
        const patientId = generatePatientId(allPatients, 'opd');
        const receiptId = generateReceiptId();
        const currentDate = new Date().toISOString();

        // Create patient record
        const newPatient = {
            id: patientId,
            ...formData,
            patientCategory: formData.patientType,
            registrationDate: currentDate,
            consultationFeePaid: true,
            consultationFeeAmount: consultationFee,
            consultationFeeReceiptId: receiptId,
            paymentMethod: paymentMethod,
            status: 'Active'
        };

        // Create financial record for consultation fee
        const consultationFeeRecord = {
            id: `FIN-${Date.now()}`,
            patientId: patientId,
            type: 'Consultation Fee',
            category: formData.patientType,
            description: `${formData.patientType} Consultation Fee`,
            amount: consultationFee,
            status: 'Paid',
            paymentDate: currentDate,
            paymentMethod: paymentMethod,
            receiptId: receiptId,
            paidAt: 'Reception'
        };

        // Create receipt
        const newReceipt = {
            id: receiptId,
            patientId: patientId,
            patientName: formData.name,
            patientType: formData.patientType,
            amount: consultationFee,
            paymentMethod: paymentMethod,
            date: currentDate,
            issuedBy: 'Reception',
            items: [{
                description: `${formData.patientType} Consultation Fee`,
                amount: consultationFee
            }]
        };

        // Process payment
        if (paymentMethod === 'HMS Wallet') {
            await deductFromWallet(consultationFee, `Consultation Fee - ${patientId}`);
        }

        // Add bill to system
        addBill(consultationFeeRecord);

        setRegisteredPatient(newPatient);
        setReceipt(newReceipt);
        setStep('receipt');

        // Callback to parent
        onSubmit(newPatient, newReceipt);
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleFinish = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary to-primary-dark text-white">
                    <div>
                        <h2 className="font-bold text-xl">Patient Registration</h2>
                        <p className="text-white/80 text-sm">
                            {step === 'patientType' && 'Select Patient Type'}
                            {step === 'patientDetails' && `${formData.patientType} Patient Details`}
                            {step === 'payment' && 'Consultation Fee Payment'}
                            {step === 'receipt' && 'Registration Complete'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center justify-center gap-2">
                        {['Patient Type', 'Details', 'Payment', 'Receipt'].map((label, index) => {
                            const stepNames = ['patientType', 'patientDetails', 'payment', 'receipt'];
                            const currentStepIndex = stepNames.indexOf(step);
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <React.Fragment key={label}>
                                    <div className={`flex items-center gap-2 ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-primary text-white' :
                                                isCompleted ? 'bg-emerald-500 text-white' :
                                                    'bg-slate-200 text-slate-500'
                                            }`}>
                                            {isCompleted ? <Check size={16} /> : index + 1}
                                        </div>
                                        <span className="text-sm hidden sm:inline">{label}</span>
                                    </div>
                                    {index < 3 && (
                                        <div className={`h-[2px] w-8 sm:w-16 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Patient Type Selection */}
                    {step === 'patientType' && (
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Select Patient Category</h3>
                                <p className="text-slate-600">Choose between Outpatient (OPD) or Inpatient (IPD)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* OPD Card */}
                                <button
                                    onClick={() => handlePatientTypeSelect('OPD')}
                                    className="group relative p-8 border-2 border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl transition-all duration-300 text-left bg-gradient-to-br from-blue-50 to-white"
                                >
                                    <div className="absolute top-4 right-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Stethoscope size={24} />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h4 className="text-2xl font-bold text-slate-800 mb-2">OPD Patient</h4>
                                        <p className="text-sm text-slate-600">Outpatient Department</p>
                                    </div>
                                    <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Walk-in consultation
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Outpatient treatment
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Same-day discharge
                                        </li>
                                    </ul>
                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-sm text-slate-600 mb-1">Consultation Fee</p>
                                        <p className="text-3xl font-bold text-primary">{formatCurrency(systemSettings.consultationFees.OPD)}</p>
                                    </div>
                                </button>

                                {/* IPD Card */}
                                <button
                                    onClick={() => handlePatientTypeSelect('IPD')}
                                    className="group relative p-8 border-2 border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl transition-all duration-300 text-left bg-gradient-to-br from-purple-50 to-white"
                                >
                                    <div className="absolute top-4 right-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Bed size={24} />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h4 className="text-2xl font-bold text-slate-800 mb-2">IPD Patient</h4>
                                        <p className="text-sm text-slate-600">Inpatient Department</p>
                                    </div>
                                    <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Hospital admission
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Extended care
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            Bed assignment
                                        </li>
                                    </ul>
                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-sm text-slate-600 mb-1">Consultation Fee</p>
                                        <p className="text-3xl font-bold text-primary">{formatCurrency(systemSettings.consultationFees.IPD)}</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Patient Details */}
                    {step === 'patientDetails' && (
                        <form onSubmit={handlePatientDetailsSubmit} className="space-y-6 max-w-2xl mx-auto">
                            {/* Patient ID Preview */}
                            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Patient ID (Auto-Generated)</p>
                                        <p className="text-2xl font-bold text-primary mt-1">{generatePatientId(allPatients, 'opd')}</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-bold">
                                        {formData.patientType}
                                    </div>
                                </div>
                            </div>

                            {/* Patient Details Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Patient full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Age *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Age"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Gender *</label>
                                    <select
                                        required
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="0700123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="patient@email.com"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Residential address"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                        rows="3"
                                        placeholder="Additional notes or medical history"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Consultation Fee Summary */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ReceiptIcon size={20} className="text-blue-600" />
                                        <span className="font-bold text-slate-800">{formData.patientType} Consultation Fee:</span>
                                    </div>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(consultationFee)}</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-2">This fee must be paid before proceeding to triage</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('patientType')}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-lg transition-all"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Payment */}
                    {step === 'payment' && (
                        <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-2xl mx-auto">
                            {/* Payment Summary */}
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-xl p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-4">Payment Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-700">Patient:</span>
                                        <span className="font-bold text-slate-900">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-700">Type:</span>
                                        <span className="px-2 py-1 bg-primary text-white text-sm font-bold rounded">{formData.patientType}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-emerald-300">
                                        <span className="text-slate-700 font-bold">Consultation Fee:</span>
                                        <span className="text-2xl font-bold text-emerald-700">{formatCurrency(consultationFee)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Select Payment Method *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {systemSettings.paymentMethods.map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            className={`p-4 border-2 rounded-xl transition-all ${paymentMethod === method
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-slate-200 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                {method === 'Cash' && <CreditCard size={24} className={paymentMethod === method ? 'text-primary' : 'text-slate-400'} />}
                                                {method === 'Card' && <CreditCard size={24} className={paymentMethod === method ? 'text-primary' : 'text-slate-400'} />}
                                                {method === 'Mobile Money' && <Smartphone size={24} className={paymentMethod === method ? 'text-primary' : 'text-slate-400'} />}
                                                {method === 'Insurance' && <Building size={24} className={paymentMethod === method ? 'text-primary' : 'text-slate-400'} />}
                                                {method === 'HMS Wallet' && <Wallet size={24} className={paymentMethod === method ? 'text-primary' : 'text-slate-400'} />}
                                                <span className={`text-sm font-bold ${paymentMethod === method ? 'text-primary' : 'text-slate-600'}`}>
                                                    {method}
                                                </span>
                                                {method === 'HMS Wallet' && (
                                                    <span className="text-xs text-slate-500">
                                                        Bal: {formatCurrency(walletBalance)}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method Specific Fields */}
                            {paymentMethod === 'Insurance' && (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Insurance Provider *</label>
                                        <input
                                            type="text"
                                            required
                                            value={paymentDetails.insuranceProvider}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, insuranceProvider: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="e.g., AAR Insurance"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Policy Number *</label>
                                        <input
                                            type="text"
                                            required
                                            value={paymentDetails.policyNumber}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, policyNumber: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="Policy number"
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'Mobile Money' && (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Money Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={paymentDetails.mobileMoneyNumber}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileMoneyNumber: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="0700123456"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Transaction Reference</label>
                                        <input
                                            type="text"
                                            value={paymentDetails.transactionRef}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionRef: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="Transaction ID"
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'Card' && (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Card Number *</label>
                                        <input
                                            type="text"
                                            required
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="**** **** **** ****"
                                            maxLength="19"
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'HMS Wallet' && walletBalance < consultationFee && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 text-sm font-medium">
                                        ⚠️ Insufficient wallet balance. Please top up or choose another payment method.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('patientDetails')}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={paymentMethod === 'HMS Wallet' && walletBalance < consultationFee}
                                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Confirm Payment & Register
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 4: Receipt */}
                    {step === 'receipt' && receipt && registeredPatient && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {/* Success Message */}
                            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
                                <p className="text-slate-600">Patient registered and consultation fee paid</p>
                            </div>

                            {/* Receipt */}
                            <div className="border-2 border-slate-300 rounded-xl p-6 bg-white print:shadow-none" id="receipt">
                                <div className="text-center border-b border-slate-200 pb-4 mb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">{systemSettings.hospitalName}</h2>
                                    <p className="text-sm text-slate-600">{systemSettings.hospitalAddress}</p>
                                    <p className="text-sm text-slate-600">{systemSettings.hospitalPhone}</p>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-800">Consultation Fee Receipt</h3>
                                    <p className="text-sm text-slate-500">Receipt No: <span className="font-bold text-slate-800">{receipt.id}</span></p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-600">Date:</span>
                                        <span className="font-bold text-slate-800">{new Date(receipt.date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-600">Patient ID:</span>
                                        <span className="font-bold text-slate-800">{registeredPatient.id}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-600">Patient Name:</span>
                                        <span className="font-bold text-slate-800">{registeredPatient.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-600">Patient Type:</span>
                                        <span className="px-2 py-1 bg-primary text-white text-sm font-bold rounded">{registeredPatient.patientType}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-600">Payment Method:</span>
                                        <span className="font-bold text-slate-800">{receipt.paymentMethod}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-slate-700">Amount Paid:</span>
                                        <span className="text-emerald-600">{formatCurrency(receipt.amount)}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Consultation Fee - {registeredPatient.patientType}</p>
                                </div>

                                <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
                                    <p className="mb-1">Thank you for choosing {systemSettings.hospitalName}</p>
                                    <p>This is an official receipt for your consultation fee payment</p>
                                    <p className="mt-2">Issued by: Reception</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrintReceipt}
                                    className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <ReceiptIcon size={20} />
                                    Print Receipt
                                </button>
                                <button
                                    onClick={handleFinish}
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-lg transition-all"
                                >
                                    Finish
                                </button>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-bold text-slate-800 mb-2">Next Steps:</h4>
                                <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                                    <li>Patient can now proceed to Triage</li>
                                    <li>Consultation fee marked as paid on medical bill</li>
                                    <li>Doctor can begin consultation</li>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OPDIPDRegistrationModal;
