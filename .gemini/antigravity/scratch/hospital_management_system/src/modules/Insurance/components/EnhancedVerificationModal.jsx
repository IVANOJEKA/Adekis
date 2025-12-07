import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Shield, User, Calendar, DollarSign, AlertCircle, Loader, FileText, Clock, Activity } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const EnhancedVerificationModal = ({ onClose }) => {
    const { patients, insuranceProviders = [] } = useData();
    const { formatCurrency } = useCurrency();

    const [verifying, setVerifying] = useState(false);
    const [verificationData, setVerificationData] = useState({
        patientId: '',
        providerId: '',
        memberNumber: '',
        policyNumber: '',
        serviceType: 'General'
    });

    const [verificationResult, setVerificationResult] = useState(null);
    const [verificationHistory, setVerificationHistory] = useState([]);

    const serviceTypes = [
        'General Consultation',
        'Emergency Services',
        'Surgery',
        'Laboratory Tests',
        'Radiology/Imaging',
        'Pharmacy',
        'Maternity Care',
        'Dental Services',
        'Physiotherapy',
        'Mental Health'
    ];

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setVerificationResult(null);

        // Simulate API call with realistic delay
        setTimeout(() => {
            const provider = insuranceProviders.find(p => p.id === verificationData.providerId);
            const patient = patients.find(p => p.id === verificationData.patientId);

            // Simulate verification result
            const isValid = Math.random() > 0.2; // 80% success rate for demo

            const result = {
                timestamp: new Date().toISOString(),
                isValid,
                status: isValid ? 'Active Coverage' : 'Inactive/Denied',
                memberName: patient?.name || 'Unknown',
                memberNumber: verificationData.memberNumber,
                policyNumber: verificationData.policyNumber,
                provider: provider?.name || 'Unknown Provider',
                plan: isValid ? 'Premium Health Plan' : 'N/A',
                effectiveDate: isValid ? '2024-01-01' : null,
                expiryDate: isValid ? '2024-12-31' : null,

                // Coverage Details
                coverageDetails: isValid ? {
                    inNetwork: provider?.networkStatus === 'In-Network',
                    coveragePercentage: provider?.coveragePercentage || 80,
                    deductible: 500000,
                    deductibleMet: 200000,
                    outOfPocketMax: 2000000,
                    outOfPocketMet: 450000,
                    copay: {
                        'General Consultation': 20000,
                        'Emergency Services': 50000,
                        'Surgery': 100000,
                        'Laboratory Tests': 10000,
                        'Radiology/Imaging': 30000,
                        'Pharmacy': 5000,
                        'Maternity Care': 75000,
                        'Dental Services': 15000,
                        'Physiotherapy': 20000,
                        'Mental Health': 25000
                    }[verificationData.serviceType] || 20000
                } : null,

                // Authorization Requirements
                authorizationRequired: isValid ? provider?.preAuthRequired : false,
                authorizationTypes: isValid && provider?.preAuthRequired ? [
                    'Surgery',
                    'Radiology/Imaging',
                    'Maternity Care'
                ].includes(verificationData.serviceType) : false,

                // Benefits
                benefits: isValid ? {
                    preventiveCare: '100% Covered',
                    hospitalization: 'Covered at 80%',
                    outpatient: 'Covered at 70%',
                    emergency: 'Covered at 90%',
                    maternity: 'Covered at 85%',
                    dental: 'Limited Coverage',
                    vision: 'Not Covered',
                    pharmacy: 'Covered with Copay'
                } : null,

                message: isValid
                    ? 'Member is eligible for services. Coverage verified successfully.'
                    : 'Member is not eligible. Policy may be expired or inactive.'
            };

            setVerificationResult(result);

            // Add to history
            setVerificationHistory(prev => [{
                id: `VER-${Date.now()}`,
                timestamp: new Date().toISOString(),
                patientName: patient?.name,
                provider: provider?.name,
                status: result.status,
                serviceType: verificationData.serviceType
            }, ...prev.slice(0, 4)]); // Keep last 5

            setVerifying(false);
        }, 2000);
    };

    const selectedPatient = patients.find(p => p.id === verificationData.patientId);
    const selectedProvider = insuranceProviders.find(p => p.id === verificationData.providerId);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Insurance Coverage Verification</h2>
                            <p className="text-emerald-100 text-sm">Real-time eligibility and benefits checking</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Verification Form */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <FileText size={20} className="text-emerald-600" />
                                Verification Request
                            </h3>

                            <form onSubmit={handleVerify} className="space-y-4">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient *</label>
                                    <select
                                        required
                                        value={verificationData.patientId}
                                        onChange={(e) => setVerificationData({ ...verificationData, patientId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="">Select patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Provider Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider *</label>
                                    <select
                                        required
                                        value={verificationData.providerId}
                                        onChange={(e) => setVerificationData({ ...verificationData, providerId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="">Select provider...</option>
                                        {insuranceProviders.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Member Number */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Member Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={verificationData.memberNumber}
                                        onChange={(e) => setVerificationData({ ...verificationData, memberNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="MEM-123456"
                                    />
                                </div>

                                {/* Policy Number */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Policy Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={verificationData.policyNumber}
                                        onChange={(e) => setVerificationData({ ...verificationData, policyNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="POL-789012"
                                    />
                                </div>

                                {/* Service Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Type *</label>
                                    <select
                                        required
                                        value={verificationData.serviceType}
                                        onChange={(e) => setVerificationData({ ...verificationData, serviceType: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        {serviceTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={verifying}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader className="animate-spin" size={20} />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            Verify Coverage
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Verification History */}
                            {verificationHistory.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Clock size={18} className="text-slate-600" />
                                        Recent Verifications
                                    </h4>
                                    <div className="space-y-2">
                                        {verificationHistory.map(item => (
                                            <div key={item.id} className="text-xs bg-slate-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-slate-800">{item.patientName}</p>
                                                        <p className="text-slate-500">{item.provider} • {item.serviceType}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status.includes('Active') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Verification Results */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={20} className="text-emerald-600" />
                                Verification Results
                            </h3>

                            {!verificationResult && !verifying && (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                                    <Shield size={64} className="mb-4 opacity-30" />
                                    <p>Enter patient and insurance details to verify coverage</p>
                                </div>
                            )}

                            {verifying && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Loader className="animate-spin text-emerald-600 mb-4" size={48} />
                                    <p className="text-slate-600 font-medium">Contacting insurance provider...</p>
                                    <p className="text-slate-400 text-sm mt-2">This may take a few moments</p>
                                </div>
                            )}

                            {verificationResult && (
                                <div className="space-y-4">
                                    {/* Status Banner */}
                                    <div className={`p-4 rounded-xl border-2 ${verificationResult.isValid
                                            ? 'bg-emerald-50 border-emerald-200'
                                            : 'bg-red-50 border-red-200'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {verificationResult.isValid ? (
                                                <CheckCircle size={24} className="text-emerald-600" />
                                            ) : (
                                                <XCircle size={24} className="text-red-600" />
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-800">{verificationResult.status}</p>
                                                <p className="text-sm text-slate-600">{verificationResult.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {verificationResult.isValid && (
                                        <>
                                            {/* Member Information */}
                                            <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Member Information</p>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-slate-500">Name</p>
                                                        <p className="font-bold text-slate-800">{verificationResult.memberName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500">Member #</p>
                                                        <p className="font-bold text-slate-800">{verificationResult.memberNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500">Policy #</p>
                                                        <p className="font-bold text-slate-800">{verificationResult.policyNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500">Plan</p>
                                                        <p className="font-bold text-slate-800">{verificationResult.plan}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Coverage Details */}
                                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                                <p className="text-xs font-bold text-blue-800 uppercase mb-3">Coverage Details</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Network Status</span>
                                                        <span className={`font-bold ${verificationResult.coverageDetails.inNetwork ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {verificationResult.coverageDetails.inNetwork ? 'In-Network' : 'Out-of-Network'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Coverage</span>
                                                        <span className="font-bold text-slate-800">{verificationResult.coverageDetails.coveragePercentage}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Copay</span>
                                                        <span className="font-bold text-slate-800">{formatCurrency(verificationResult.coverageDetails.copay)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Deductibles */}
                                            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                                                <p className="text-xs font-bold text-purple-800 uppercase mb-3">Deductibles & Limits</p>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-slate-600">Annual Deductible</span>
                                                            <span className="font-bold text-slate-800">
                                                                {formatCurrency(verificationResult.coverageDetails.deductibleMet)} / {formatCurrency(verificationResult.coverageDetails.deductible)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div
                                                                className="bg-purple-600 h-2 rounded-full"
                                                                style={{ width: `${(verificationResult.coverageDetails.deductibleMet / verificationResult.coverageDetails.deductible) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-slate-600">Out-of-Pocket Max</span>
                                                            <span className="font-bold text-slate-800">
                                                                {formatCurrency(verificationResult.coverageDetails.outOfPocketMet)} / {formatCurrency(verificationResult.coverageDetails.outOfPocketMax)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div
                                                                className="bg-purple-600 h-2 rounded-full"
                                                                style={{ width: `${(verificationResult.coverageDetails.outOfPocketMet / verificationResult.coverageDetails.outOfPocketMax) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Authorization Required */}
                                            {verificationResult.authorizationRequired && verificationResult.authorizationTypes && (
                                                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertCircle size={20} className="text-amber-600" />
                                                        <p className="font-bold text-amber-800">Pre-Authorization Required</p>
                                                    </div>
                                                    <p className="text-sm text-amber-700">
                                                        This service type requires prior authorization. Please submit a pre-authorization request before proceeding.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Benefits Summary */}
                                            <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Benefits Summary</p>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(verificationResult.benefits).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between p-2 bg-slate-50 rounded">
                                                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                            <span className="font-medium text-slate-800">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVerificationModal;
