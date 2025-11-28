import React from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, Building, FileText } from 'lucide-react';

const InsuranceTab = ({ insuranceClaims = [], patients, formatCurrency }) => {
    // Group claims by status
    const pendingClaims = insuranceClaims.filter(c => c.status === 'Pending');
    const approvedClaims = insuranceClaims.filter(c => c.status === 'Approved');
    const rejectedClaims = insuranceClaims.filter(c => c.status === 'Rejected');

    // Group by provider
    const claimsByProvider = insuranceClaims.reduce((acc, claim) => {
        const provider = claim.provider || 'Unknown';
        if (!acc[provider]) acc[provider] = [];
        acc[provider].push(claim);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">Total Claims</span>
                        <Shield size={20} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{insuranceClaims.length}</p>
                    <p className="text-sm text-blue-600 mt-1">
                        {formatCurrency(insuranceClaims.reduce((sum, c) => sum + c.amount, 0))}
                    </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-700">Pending Review</span>
                        <Clock size={20} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{pendingClaims.length}</p>
                    <p className="text-sm text-amber-600 mt-1">
                        {formatCurrency(pendingClaims.reduce((sum, c) => sum + c.amount, 0))}
                    </p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-700">Approved</span>
                        <CheckCircle size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">{approvedClaims.length}</p>
                    <p className="text-sm text-emerald-600 mt-1">
                        {formatCurrency(approvedClaims.reduce((sum, c) => sum + c.amount, 0))}
                    </p>
                </div>

                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-700">Rejected</span>
                        <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-900">{rejectedClaims.length}</p>
                    <p className="text-sm text-red-600 mt-1">
                        {formatCurrency(rejectedClaims.reduce((sum, c) => sum + c.amount, 0))}
                    </p>
                </div>
            </div>

            {/* Claims by Provider */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Claims by Insurance Provider</h3>
                <div className="space-y-3">
                    {Object.entries(claimsByProvider).map(([provider, claims]) => {
                        const total = claims.reduce((sum, c) => sum + c.amount, 0);
                        const approved = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0);
                        const approvalRate = total > 0 ? (approved / total * 100).toFixed(1) : 0;

                        return (
                            <div key={provider} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Building size={24} className="text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">{provider}</p>
                                    <p className="text-sm text-slate-600">{claims.length} claims • Approval Rate: {approvalRate}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{formatCurrency(total)}</p>
                                    <p className="text-sm text-emerald-600">Approved: {formatCurrency(approved)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pending Claims - Requires Action */}
            {pendingClaims.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <Clock size={20} />
                        Pending Claims ({pendingClaims.length})
                    </h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-amber-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Claim ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Patient</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Provider</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Submitted</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-amber-900 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {pendingClaims.map((claim) => {
                                    const patient = patients.find(p => p.id === claim.patientId);
                                    return (
                                        <tr key={claim.id} className="hover:bg-amber-50">
                                            <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900">{claim.id}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-slate-900">{patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500">Policy: {claim.policyNo}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-700">{claim.provider}</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(claim.amount)}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {claim.submittedDate ? new Date(claim.submittedDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    <FileText size={16} className="inline mr-1" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Insurance Claims */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">All Insurance Claims</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Claim ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Policy</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {insuranceClaims.map((claim) => {
                                const patient = patients.find(p => p.id === claim.patientId);
                                return (
                                    <tr key={claim.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{claim.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{patient?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{claim.patientId}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{claim.provider}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{claim.policyNo}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(claim.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    claim.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {claim.expiryDate ? new Date(claim.expiryDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InsuranceTab;
