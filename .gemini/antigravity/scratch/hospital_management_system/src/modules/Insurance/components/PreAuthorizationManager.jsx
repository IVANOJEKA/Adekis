import React, { useState } from 'react';
import { FileText, Plus, Eye, X, Upload, CheckCircle, Clock, XCircle, AlertCircle, Send, Search, Filter } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const PreAuthorizationManager = () => {
    const { patients, insuranceProviders = [], preAuthorizations = [], setPreAuthorizations } = useData();
    const { formatCurrency } = useCurrency();

    const [showNewRequest, setShowNewRequest] = useState(false);
    const [selectedAuth, setSelectedAuth] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        patientId: '',
        insuranceId: '',
        policyNumber: '',
        procedureCode: '',
        procedureName: '',
        diagnosisCode: '',
        diagnosisName: '',
        requestedBy: '',
        urgency: 'Routine',
        clinicalJustification: '',
        estimatedCost: '',
        proposedDate: '',
        supportingDocs: []
    });

    const urgencyLevels = ['Routine', 'Urgent', 'Emergency'];
    const commonProcedures = [
        { code: 'CPT-29827', name: 'Arthroscopy Shoulder' },
        { code: 'CPT-27447', name: 'Total Knee Replacement' },
        { code: 'CPT-47562', name: 'Laparoscopic Cholecystectomy' },
        { code: 'CPT-43239', name: 'Upper Endoscopy with Biopsy' },
        { code: 'CPT-70553', name: 'MRI Brain with Contrast' },
        { code: 'CPT-93015', name: 'Stress Test' },
        { code: 'CPT-99285', name: 'Emergency Department Visit (High)' },
        { code: 'CPT-59400', name: 'Maternity Care & Delivery' },
        { code: 'CPT-33533', name: 'Coronary Artery Bypass' },
        { code: 'CPT-62223', name: 'Craniotomy' }
    ];

    const handleSubmitRequest = (e) => {
        e.preventDefault();

        const newAuth = {
            id: `PA-${Date.now()}`,
            ...formData,
            requestDate: new Date().toISOString(),
            status: 'Pending',
            statusHistory: [
                { status: 'Submitted', date: new Date().toISOString(), note: 'Authorization request submitted' }
            ],
            reviewedBy: null,
            reviewDate: null,
            authorizationNumber: null,
            validUntil: null,
            denialReason: null
        };

        setPreAuthorizations([...preAuthorizations, newAuth]);
        alert(`Pre-authorization request submitted! Reference: ${newAuth.id}`);
        setShowNewRequest(false);

        // Reset form
        setFormData({
            patientId: '',
            insuranceId: '',
            policyNumber: '',
            procedureCode: '',
            procedureName: '',
            diagnosisCode: '',
            diagnosisName: '',
            requestedBy: '',
            urgency: 'Routine',
            clinicalJustification: '',
            estimatedCost: '',
            proposedDate: '',
            supportingDocs: []
        });
    };

    const handleApprove = (authId) => {
        if (window.confirm('Approve this pre-authorization request?')) {
            setPreAuthorizations(preAuthorizations.map(auth => {
                if (auth.id === authId) {
                    const authNum = `AUTH-${Date.now()}`;
                    const validDate = new Date();
                    validDate.setDate(validDate.getDate() + 90); // Valid for 90 days

                    return {
                        ...auth,
                        status: 'Approved',
                        authorizationNumber: authNum,
                        validUntil: validDate.toISOString(),
                        reviewDate: new Date().toISOString(),
                        reviewedBy: 'System',
                        statusHistory: [
                            ...auth.statusHistory,
                            { status: 'Approved', date: new Date().toISOString(), note: `Authorization granted: ${authNum}` }
                        ]
                    };
                }
                return auth;
            }));
        }
    };

    const handleDeny = (authId) => {
        const reason = prompt('Enter denial reason:');
        if (reason) {
            setPreAuthorizations(preAuthorizations.map(auth => {
                if (auth.id === authId) {
                    return {
                        ...auth,
                        status: 'Denied',
                        denialReason: reason,
                        reviewDate: new Date().toISOString(),
                        reviewedBy: 'System',
                        statusHistory: [
                            ...auth.statusHistory,
                            { status: 'Denied', date: new Date().toISOString(), note: reason }
                        ]
                    };
                }
                return auth;
            }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Denied': return 'bg-red-100 text-red-700';
            case 'Expired': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={18} />;
            case 'Pending': return <Clock size={18} />;
            case 'Denied': return <XCircle size={18} />;
            default: return <AlertCircle size={18} />;
        }
    };

    const filteredAuths = preAuthorizations.filter(auth => {
        const matchesStatus = statusFilter === 'all' || auth.status === statusFilter;
        const matchesSearch = auth.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            auth.procedureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patients.find(p => p.id === auth.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Pre-Authorization Management</h2>
                    <p className="text-sm text-slate-500">Submit and track prior authorization requests</p>
                </div>
                <button
                    onClick={() => setShowNewRequest(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                >
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: preAuthorizations.length, color: 'blue', icon: FileText },
                    { label: 'Pending', value: preAuthorizations.filter(a => a.status === 'Pending').length, color: 'amber', icon: Clock },
                    { label: 'Approved', value: preAuthorizations.filter(a => a.status === 'Approved').length, color: 'emerald', icon: CheckCircle },
                    { label: 'Denied', value: preAuthorizations.filter(a => a.status === 'Denied').length, color: 'red', icon: XCircle }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-4 rounded-xl`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                                <stat.icon size={20} className={`text-${stat.color}-600`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by patient, procedure, or ID..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                </select>
            </div>

            {/* Authorizations List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Request ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Procedure</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Insurance</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAuths.length > 0 ? (
                                filteredAuths.map(auth => {
                                    const patient = patients.find(p => p.id === auth.patientId);
                                    const insurance = insuranceProviders.find(i => i.id === auth.insuranceId);

                                    return (
                                        <tr key={auth.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{auth.id}</td>
                                            <td className="px-6 py-4 text-slate-700">{patient?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-800">{auth.procedureName}</p>
                                                <p className="text-xs text-slate-500">{auth.procedureCode}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 text-sm">{insurance?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{new Date(auth.requestDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(auth.status)}`}>
                                                    {getStatusIcon(auth.status)}
                                                    {auth.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedAuth(auth)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {auth.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(auth.id)}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeny(auth.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Deny"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        {searchTerm || statusFilter !== 'all' ? 'No matching requests found' : 'No pre-authorization requests yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Request Modal */}
            {showNewRequest && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <FileText size={24} />
                                <h3 className="text-xl font-bold">New Pre-Authorization Request</h3>
                            </div>
                            <button onClick={() => setShowNewRequest(false)} className="p-2 hover:bg-white/20 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Patient & Insurance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient *</label>
                                    <select
                                        required
                                        value={formData.patientId}
                                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider *</label>
                                    <select
                                        required
                                        value={formData.insuranceId}
                                        onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select provider...</option>
                                        {insuranceProviders.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Procedure */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Procedure Code *</label>
                                    <select
                                        required
                                        value={formData.procedureCode}
                                        onChange={(e) => {
                                            const proc = commonProcedures.find(p => p.code === e.target.value);
                                            setFormData({ ...formData, procedureCode: e.target.value, procedureName: proc?.name || '' });
                                        }}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select procedure...</option>
                                        {commonProcedures.map(p => (
                                            <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Procedure Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.procedureName}
                                        onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis Code *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.diagnosisCode}
                                        onChange={(e) => setFormData({ ...formData, diagnosisCode: e.target.value })}
                                        placeholder="ICD-10 code"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.diagnosisName}
                                        onChange={(e) => setFormData({ ...formData, diagnosisName: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Requested By *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.requestedBy}
                                        onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                                        placeholder="Dr. Name"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Urgency *</label>
                                    <select
                                        required
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        {urgencyLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Date</label>
                                    <input
                                        type="date"
                                        value={formData.proposedDate}
                                        onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Clinical Justification */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Justification *</label>
                                <textarea
                                    required
                                    value={formData.clinicalJustification}
                                    onChange={(e) => setFormData({ ...formData, clinicalJustification: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Provide detailed medical justification for this procedure..."
                                />
                            </div>

                            {/* Estimated Cost */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost (UGX)</label>
                                <input
                                    type="number"
                                    value={formData.estimatedCost}
                                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowNewRequest(false)}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 font-medium shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedAuth && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <FileText size={24} />
                                <div>
                                    <h3 className="text-xl font-bold">Authorization Details</h3>
                                    <p className="text-blue-100 text-sm">{selectedAuth.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAuth(null)} className="p-2 hover:bg-white/20 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Status */}
                            <div className={`p-4 rounded-xl border-2 ${selectedAuth.status === 'Approved' ? 'bg-emerald-50 border-emerald-200' :
                                    selectedAuth.status === 'Denied' ? 'bg-red-50 border-red-200' :
                                        'bg-amber-50 border-amber-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(selectedAuth.status)}
                                    <span className="font-bold text-slate-800">{selectedAuth.status}</span>
                                </div>
                                {selectedAuth.authorizationNumber && (
                                    <p className="mt-2 text-sm font-medium">Auth #: {selectedAuth.authorizationNumber}</p>
                                )}
                                {selectedAuth.validUntil && (
                                    <p className="text-sm text-slate-600">Valid until: {new Date(selectedAuth.validUntil).toLocaleDateString()}</p>
                                )}
                                {selectedAuth.denialReason && (
                                    <p className="mt-2 text-sm text-red-700">Reason: {selectedAuth.denialReason}</p>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Patient</p>
                                    <p className="font-bold text-slate-800">{patients.find(p => p.id === selectedAuth.patientId)?.name}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Insurance</p>
                                    <p className="font-bold text-slate-800">{insuranceProviders.find(i => i.id === selectedAuth.insuranceId)?.name}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Procedure</p>
                                    <p className="font-bold text-slate-800">{selectedAuth.procedureName}</p>
                                    <p className="text-xs text-slate-500">{selectedAuth.procedureCode}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Requested By</p>
                                    <p className="font-bold text-slate-800">{selectedAuth.requestedBy}</p>
                                </div>
                            </div>

                            {/* Clinical Justification */}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-xs font-bold text-blue-800 uppercase mb-2">Clinical Justification</p>
                                <p className="text-sm text-slate-700">{selectedAuth.clinicalJustification}</p>
                            </div>

                            {/* Status History */}
                            <div>
                                <p className="text-sm font-bold text-slate-700 mb-3">Status History</p>
                                <div className="space-y-2">
                                    {selectedAuth.statusHistory.map((history, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{history.status}</p>
                                                <p className="text-slate-500">{history.note}</p>
                                                <p className="text-xs text-slate-400">{new Date(history.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreAuthorizationManager;
