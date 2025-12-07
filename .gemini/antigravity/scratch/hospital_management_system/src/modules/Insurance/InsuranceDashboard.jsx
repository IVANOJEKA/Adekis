import React, { useState } from 'react';
import { Shield, Building2, FileText, TrendingUp, CheckCircle, Clock, XCircle, DollarSign, Users, Search, Plus, Eye, Edit, Download, Activity, CreditCard, AlertCircle, Loader, Settings } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { insuranceAPI } from '../../services/api';
import ProviderRegistration from './components/ProviderRegistration';
import InsuranceProviders from './components/InsuranceProviders';
import EnhancedVerificationModal from './components/EnhancedVerificationModal';
import PreAuthorizationManager from './components/PreAuthorizationManager';
import InsuranceReports from './components/InsuranceReports';

const InsuranceDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showNewClaimModal, setShowNewClaimModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showProviderRegistration, setShowProviderRegistration] = useState(false);
    const [showEnhancedVerification, setShowEnhancedVerification] = useState(false);

    // Verification State
    const [verificationData, setVerificationData] = useState({
        providerId: '',
        memberNumber: '',
        result: null,
        loading: false,
        error: null
    });

    // New Claim State
    const [newClaim, setNewClaim] = useState({
        patientName: '',
        memberNumber: '',
        providerId: '',
        service: '',
        amount: '',
        notes: ''
    });
    const [submittingClaim, setSubmittingClaim] = useState(false);

    const {
        insuranceProviders = [],
        insuranceClaims = [],
        hospitalProfile,
        addInsuranceProvider,
        submitInsuranceClaim
    } = useData();

    // Use claims from context
    const claims = insuranceClaims || [];
    const allProviders = insuranceProviders || [];

    const handleVerify = async () => {
        if (!verificationData.providerId || !verificationData.memberNumber) return;

        setVerificationData(prev => ({ ...prev, loading: true, error: null, result: null }));

        try {
            const result = await insuranceAPI.verifyCoverage({
                providerId: verificationData.providerId,
                memberNumber: verificationData.memberNumber
            });
            setVerificationData(prev => ({ ...prev, result, loading: false }));
        } catch (err) {
            setVerificationData(prev => ({ ...prev, error: err.message, loading: false }));
        }
    };

    const handleSubmitClaim = async (e) => {
        e.preventDefault();
        setSubmittingClaim(true);

        try {
            const result = await submitInsuranceClaim({
                providerId: newClaim.providerId,
                amount: parseInt(newClaim.amount),
                service: newClaim.service,
                patientId: 'PAT-TEMP', // In real app, this comes from patient selection
                patientName: newClaim.patientName,
                memberNumber: newClaim.memberNumber,
                notes: newClaim.notes
            });

            if (result) {
                setShowNewClaimModal(false);
                setNewClaim({ patientName: '', memberNumber: '', providerId: '', service: '', amount: '', notes: '' });
                alert(`Claim submitted successfully! Tracking ID: ${result.trackingNumber || result.claimId || 'N/A'}`);
            } else {
                alert(`Submission Failed: ${result?.message || 'Unknown error'}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setSubmittingClaim(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Submitted': return 'bg-blue-50 text-blue-600';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Insurance Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage providers, verify coverage, and process claims</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowEnhancedVerification(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <CheckCircle size={16} className="text-emerald-500" />
                        Verify Coverage
                    </button>
                    <button
                        onClick={() => setShowNewClaimModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30"
                    >
                        <Plus size={16} />
                        New Claim
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Claims', value: claims.length, subtext: 'This month', icon: FileText, color: 'blue' },
                    { label: 'Pending', value: claims.filter(c => c.status === 'Pending').length, subtext: 'Awaiting approval', icon: Clock, color: 'amber' },
                    { label: 'Approved', value: claims.filter(c => c.status === 'Approved').length, subtext: 'Ready for payment', icon: CheckCircle, color: 'emerald' },
                    { label: 'Active Providers', value: allProviders.length, subtext: 'Integrated APIs', icon: Shield, color: 'purple' },
                ].map((stat, index) => (
                    <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-5 rounded-xl hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${stat.color}-500`}>
                            <stat.icon size={60} />
                        </div>
                        <div className="relative z-10">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 w-fit mb-3`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Overview', 'Provider Profile', 'Providers', 'Pre-Authorization', 'Reports', 'Claims'].map((tab) => {
                        const tabKey = tab.toLowerCase();
                        const isActive = activeTab === tabKey;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'provider profile' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Building2 size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Hospital Provider Profile</h3>
                                            <p className="text-sm text-slate-600">Complete your profile for insurance company registration</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowProviderRegistration(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Settings size={18} />
                                        Edit Profile
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Hospital Name</p>
                                        <p className="font-bold text-slate-800">{hospitalProfile?.name || 'Not Set'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">License Number</p>
                                        <p className="font-bold text-slate-800">{hospitalProfile?.licenseNumber || 'Not Set'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Tax ID</p>
                                        <p className="font-bold text-slate-800">{hospitalProfile?.taxId || 'Not Set'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                                        <p className="font-bold text-slate-800">{hospitalProfile?.phone || 'Not Set'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Email</p>
                                        <p className="font-bold text-slate-800">{hospitalProfile?.email || 'Not Set'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Address</p>
                                        <p className="font-bold text-slate-800 text-sm">{hospitalProfile?.address || 'Not Set'}</p>
                                    </div>
                                </div>
                                {hospitalProfile?.specialties && hospitalProfile.specialties.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                        <p className="text-xs text-slate-500 mb-2">Specialties</p>
                                        <div className="flex flex-wrap gap-2">
                                            {hospitalProfile.specialties.map((spec, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Claims */}
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-primary" />
                                        Recent Claims
                                    </h3>
                                    <div className="space-y-3">
                                        {claims.slice(0, 5).map((claim) => (
                                            <div key={claim.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">{claim.id}</p>
                                                    <p className="text-xs text-slate-500">{claim.patient} • {claim.company}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm text-slate-800">UGX {claim.amount.toLocaleString()}</p>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(claim.status)}`}>
                                                        {claim.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Integrated Providers */}
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Building2 size={20} className="text-primary" />
                                        Integrated Providers
                                    </h3>
                                    <div className="space-y-3">
                                        {allProviders.slice(0, 5).map((provider) => (
                                            <div key={provider.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Shield size={20} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800">{provider.name}</p>
                                                        <p className="text-xs text-slate-500">{provider.country}</p>
                                                    </div>
                                                </div>
                                                {provider.apiEnabled && (
                                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Activity size={12} /> API Ready
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pre-authorization' && (
                        <PreAuthorizationManager />
                    )}

                    {activeTab === 'providers' && (
                        <InsuranceProviders />
                    )}

                    {activeTab === 'reports' && (
                        <InsuranceReports />
                    )}

                    {activeTab === 'claims' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Claim ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Provider</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {claims.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{claim.id}</td>
                                            <td className="px-6 py-4 text-slate-700">{claim.patient}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{claim.company}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">UGX {claim.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(claim.status)}`}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setSelectedClaim(claim)} className="text-primary hover:bg-primary/5 p-2 rounded-lg">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Verify Insurance Coverage</h3>
                            <button onClick={() => setShowVerificationModal(false)}><XCircle size={24} className="text-slate-400" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={verificationData.providerId}
                                    onChange={(e) => setVerificationData({ ...verificationData, providerId: e.target.value })}
                                >
                                    <option value="">Select Provider</option>
                                    {allProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Member Number</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Enter member ID"
                                    value={verificationData.memberNumber}
                                    onChange={(e) => setVerificationData({ ...verificationData, memberNumber: e.target.value })}
                                />
                            </div>

                            {verificationData.error && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} /> {verificationData.error}
                                </div>
                            )}

                            {verificationData.result && (
                                <div className={`p-4 rounded-lg border ${verificationData.result.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {verificationData.result.isValid ? <CheckCircle className="text-emerald-600" /> : <XCircle className="text-red-600" />}
                                        <span className="font-bold">{verificationData.result.status}</span>
                                    </div>
                                    {verificationData.result.isValid && (
                                        <div className="text-sm space-y-1">
                                            <p><strong>Name:</strong> {verificationData.result.memberName}</p>
                                            <p><strong>Plan:</strong> {verificationData.result.plan}</p>
                                            <p><strong>Limit:</strong> UGX {verificationData.result.limit?.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {!verificationData.result.isValid && <p className="text-sm">{verificationData.result.message}</p>}
                                </div>
                            )}

                            <button
                                onClick={handleVerify}
                                disabled={verificationData.loading || !verificationData.providerId}
                                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {verificationData.loading ? <Loader className="animate-spin" size={18} /> : 'Verify Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Claim Modal */}
            {showNewClaimModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Submit New Claim</h3>
                            <button onClick={() => setShowNewClaimModal(false)}><XCircle size={24} className="text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSubmitClaim} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                                    <input type="text" required className="w-full p-2 border rounded-lg"
                                        value={newClaim.patientName} onChange={e => setNewClaim({ ...newClaim, patientName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Member Number</label>
                                    <input type="text" required className="w-full p-2 border rounded-lg"
                                        value={newClaim.memberNumber} onChange={e => setNewClaim({ ...newClaim, memberNumber: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                                <select required className="w-full p-2 border rounded-lg"
                                    value={newClaim.providerId} onChange={e => setNewClaim({ ...newClaim, providerId: e.target.value })}>
                                    <option value="">Select Provider</option>
                                    {allProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service / Treatment</label>
                                <input type="text" required className="w-full p-2 border rounded-lg"
                                    value={newClaim.service} onChange={e => setNewClaim({ ...newClaim, service: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (UGX)</label>
                                <input type="number" required className="w-full p-2 border rounded-lg"
                                    value={newClaim.amount} onChange={e => setNewClaim({ ...newClaim, amount: e.target.value })} />
                            </div>

                            <button type="submit" disabled={submittingClaim}
                                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex justify-center items-center gap-2">
                                {submittingClaim ? <Loader className="animate-spin" size={20} /> : 'Submit Claim via API'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Provider Registration Modal */}
            {showProviderRegistration && (
                <ProviderRegistration onClose={() => setShowProviderRegistration(false)} />
            )}

            {/* Enhanced Verification Modal */}
            {showEnhancedVerification && (
                <EnhancedVerificationModal onClose={() => setShowEnhancedVerification(false)} />
            )}
        </div>
    );
};

export default InsuranceDashboard;
