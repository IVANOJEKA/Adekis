import React, { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { verifyInsurance, insuranceCompanies } from '../../Insurance/insuranceService';

const InsuranceVerificationModal = ({ onClose, onVerified }) => {
    const [policyNumber, setPolicyNumber] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [amount, setAmount] = useState('');

    const handleVerify = () => {
        if (!policyNumber || !amount) {
            setVerificationResult({ valid: false, message: 'Please enter policy number and amount' });
            return;
        }

        const result = verifyInsurance(policyNumber, parseFloat(amount));
        setVerificationResult(result);

        if (result.valid && onVerified) {
            onVerified({
                policyNumber,
                company: result.company,
                verified: true
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Shield className="text-primary" size={20} />
                        Verify Insurance Coverage
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Insurance Company</label>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                        >
                            <option value="">Select company...</option>
                            {insuranceCompanies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Policy Number</label>
                        <input
                            type="text"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. JUB-2024-001234"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Service Amount (UGX)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. 50000"
                        />
                    </div>

                    {verificationResult && (
                        <div className={`p-4 rounded-lg border ${verificationResult.valid
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                {verificationResult.valid ? (
                                    <CheckCircle className="text-emerald-600 mt-0.5" size={20} />
                                ) : (
                                    <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                                )}
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${verificationResult.valid ? 'text-emerald-800' : 'text-red-800'
                                        }`}>
                                        {verificationResult.message}
                                    </p>
                                    {verificationResult.valid && (
                                        <div className="mt-2 text-xs text-emerald-700 space-y-1">
                                            <p>Company: {verificationResult.company}</p>
                                            <p>Remaining Coverage: UGX {verificationResult.remaining?.toLocaleString()}</p>
                                            <p>Coverage Limit: UGX {verificationResult.coverageLimit?.toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleVerify}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                    >
                        Verify Coverage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsuranceVerificationModal;
