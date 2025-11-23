import React, { useState } from 'react';
import { Shield, Building2, FileText, TrendingUp, CheckCircle, Clock, XCircle, DollarSign, Users, Search, Plus, Eye, Edit, Download } from 'lucide-react';

const InsuranceDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedClaim, setSelectedClaim] = useState(null);

    // Mock Data - Insurance Companies
    const companies = [
        { id: 1, name: 'Jubilee Insurance', type: 'Health', status: 'Active', patients: 45, pendingClaims: 12, totalClaims: 'UGX 25,000,000' },
        { id: 2, name: 'UAP Insurance', type: 'Health', status: 'Active', patients: 38, pendingClaims: 8, totalClaims: 'UGX 18,500,000' },
        { id: 3, name: 'AAR Insurance', type: 'Health', status: 'Active', patients: 52, pendingClaims: 15, totalClaims: 'UGX 32,000,000' },
        { id: 4, name: 'Britam Insurance', type: 'Health', status: 'Active', patients: 28, pendingClaims: 5, totalClaims: 'UGX 12,000,000' },
    ];

    // Mock Data - Claims
    const claims = [
        { id: 'CLM-001', patient: 'John Smith', company: 'Jubilee Insurance', amount: 150000, service: 'General Consultation + Lab Tests', date: '2024-01-20', status: 'Pending', claimDate: '2024-01-21' },
        { id: 'CLM-002', patient: 'Mary Johnson', company: 'UAP Insurance', amount: 250000, service: 'Specialist Consultation', date: '2024-01-19', status: 'Approved', claimDate: '2024-01-20' },
        { id: 'CLM-003', patient: 'Sarah Wilson', company: 'AAR Insurance', amount: 180000, service: 'Ultrasound Scan', date: '2024-01-18', status: 'Processing', claimDate: '2024-01-19' },
        { id: 'CLM-004', patient: 'David Lee', company: 'Jubilee Insurance', amount: 95000, service: 'Blood Tests', date: '2024-01-17', status: 'Rejected', claimDate: '2024-01-18' },
    ];

    // Mock Data - Statistics
    const stats = [
        { label: 'Total Claims (Month)', value: '87', subtext: '+12% from last month', icon: FileText, color: 'blue' },
        { label: 'Pending Approval', value: '23', subtext: 'Awaiting response', icon: Clock, color: 'amber' },
        { label: 'Approved Claims', value: '52', subtext: 'UGX 45,000,000', icon: CheckCircle, color: 'emerald' },
        { label: 'Active Policies', value: '163', subtext: '4 insurance partners', icon: Shield, color: 'purple' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
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
                    <p className="text-slate-500 text-sm mt-1">Manage insurance companies, policies, and claims processing</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30">
                        <Plus size={16} />
                        New Claim
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
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
                    {['Overview', 'Companies', 'Policies', 'Claims', 'Reports'].map((tab) => {
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
                    {/* Overview Tab */}
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
                                        {claims.slice(0, 3).map((claim) => (
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

                                {/* Top Insurance Partners */}
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Building2 size={20} className="text-primary" />
                                        Top Insurance Partners
                                    </h3>
                                    <div className="space-y-3">
                                        {companies.slice(0, 3).map((company) => (
                                            <div key={company.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Shield size={20} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-800">{company.name}</p>
                                                        <p className="text-xs text-slate-500">{company.patients} active patients</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                    {company.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Companies Tab */}
                    {activeTab === 'companies' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Insurance Companies</h2>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                    Add Company
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {companies.map((company) => (
                                    <div key={company.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Building2 size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{company.name}</h3>
                                                    <p className="text-xs text-slate-500">{company.type} Insurance</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                                {company.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs">Patients</p>
                                                <p className="font-bold text-slate-700">{company.patients}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Pending</p>
                                                <p className="font-bold text-amber-600">{company.pendingClaims}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Total Claims</p>
                                                <p className="font-bold text-emerald-600 text-xs">{company.totalClaims}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-sm transition-colors">
                                                View Details
                                            </button>
                                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Claims Tab */}
                    {activeTab === 'claims' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search claims..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                    Submit New Claim
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claim ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Insurance</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {claims.map((claim) => (
                                            <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-800">{claim.id}</td>
                                                <td className="px-6 py-4 text-slate-700">{claim.patient}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{claim.company}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{claim.service}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">UGX {claim.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(claim.status)}`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedClaim(claim)}
                                                        className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Policies Tab */}
                    {activeTab === 'policies' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Active Insurance Policies</h2>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                    Add New Policy
                                </button>
                            </div>

                            {/* Policies Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[
                                    { patient: 'John Smith', policyNo: 'JUB-2024-001234', company: 'Jubilee Insurance', limit: 5000000, used: 250000, expiry: '2024-12-31', status: 'Active' },
                                    { patient: 'Mary Johnson', policyNo: 'UAP-2024-005678', company: 'UAP Insurance', limit: 3000000, used: 180000, expiry: '2024-11-30', status: 'Active' },
                                    { patient: 'Sarah Wilson', policyNo: 'AAR-2024-009012', company: 'AAR Insurance', limit: 10000000, used: 500000, expiry: '2025-03-31', status: 'Active' },
                                    { patient: 'David Lee', policyNo: 'BRT-2024-002345', company: 'Britam Insurance', limit: 2000000, used: 1800000, expiry: '2024-08-15', status: 'Expiring Soon' },
                                ].map((policy, index) => {
                                    const usedPercent = (policy.used / policy.limit) * 100;
                                    const remaining = policy.limit - policy.used;

                                    return (
                                        <div key={index} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{policy.patient}</h3>
                                                    <p className="text-xs text-slate-500 mt-1">{policy.policyNo}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${policy.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {policy.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Shield size={16} className="text-primary" />
                                                    <p className="text-sm text-slate-600">{policy.company}</p>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                        <span>Coverage Used</span>
                                                        <span>{usedPercent.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${usedPercent > 80 ? 'bg-red-500' : usedPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                                                }`}
                                                            style={{ width: `${usedPercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs mt-1">
                                                        <span className="text-slate-500">Used: UGX {policy.used.toLocaleString()}</span>
                                                        <span className="font-bold text-slate-700">Remaining: UGX {remaining.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-xs text-slate-500">Coverage Limit</p>
                                                        <p className="font-bold text-slate-700 text-sm">UGX {policy.limit.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Expiry Date</p>
                                                        <p className="font-bold text-slate-700 text-sm">{policy.expiry}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                                <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Insurance Analytics & Reports</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                    <Download size={16} />
                                    Export Full Report
                                </button>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Claims (Month)', value: 'UGX 87,500,000', change: '+12%', color: 'blue' },
                                    { label: 'Approval Rate', value: '78%', change: '+5%', color: 'emerald' },
                                    { label: 'Avg. Processing Time', value: '3.2 days', change: '-8%', color: 'purple' },
                                    { label: 'Active Policies', value: '163', change: '+15', color: 'amber' },
                                ].map((metric, index) => (
                                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
                                        <p className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</p>
                                        <p className={`text-xs font-medium ${metric.change.startsWith('+') || metric.change.startsWith('-')
                                                ? metric.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                                                : 'text-slate-500'
                                            }`}>
                                            {metric.change} from last month
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Claims by Company */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Building2 size={20} className="text-primary" />
                                    Claims by Insurance Company
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { company: 'AAR Insurance', claims: 52, amount: 32000000, percentage: 36 },
                                        { company: 'Jubilee Insurance', claims: 45, amount: 25000000, percentage: 29 },
                                        { company: 'UAP Insurance', claims: 38, amount: 18500000, percentage: 21 },
                                        { company: 'Britam Insurance', claims: 28, amount: 12000000, percentage: 14 },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-32">
                                                <p className="text-sm font-medium text-slate-700">{item.company}</p>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full transition-all"
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-500 w-12">{item.percentage}%</span>
                                                </div>
                                            </div>
                                            <div className="w-40 text-right">
                                                <p className="text-sm font-bold text-slate-800">{item.claims} claims</p>
                                                <p className="text-xs text-slate-500">UGX {item.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Claims Status Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Status Distribution */}
                                <div className="bg-white border border-slate-200 rounded-xl p-6">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-primary" />
                                        Claims Status Distribution
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { status: 'Approved', count: 52, percentage: 60, color: 'emerald' },
                                            { status: 'Pending', count: 23, percentage: 26, color: 'amber' },
                                            { status: 'Processing', count: 10, percentage: 11, color: 'blue' },
                                            { status: 'Rejected', count: 2, percentage: 3, color: 'red' },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-slate-700">{item.status}</span>
                                                    <span className="text-sm font-bold text-slate-800">{item.count} ({item.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className={`bg-${item.color}-500 h-2 rounded-full transition-all`}
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="bg-white border border-slate-200 rounded-xl p-6">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <DollarSign size={20} className="text-primary" />
                                        Financial Summary (This Month)
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Total Claimed', value: 87500000, color: 'blue' },
                                            { label: 'Approved Amount', value: 68250000, color: 'emerald' },
                                            { label: 'Pending Review', value: 15750000, color: 'amber' },
                                            { label: 'Rejected Amount', value: 3500000, color: 'red' },
                                        ].map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                                <span className={`text-lg font-bold text-${item.color}-600`}>
                                                    UGX {item.value.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Trend */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-800 mb-4">Monthly Claims Trend (Last 6 Months)</h3>
                                <div className="grid grid-cols-6 gap-2 h-48 items-end">
                                    {[
                                        { month: 'Aug', value: 65, label: '65' },
                                        { month: 'Sep', value: 72, label: '72' },
                                        { month: 'Oct', value: 68, label: '68' },
                                        { month: 'Nov', value: 78, label: '78' },
                                        { month: 'Dec', value: 82, label: '82' },
                                        { month: 'Jan', value: 87, label: '87' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div className="relative w-full bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors group" style={{ height: `${(item.value / 87) * 100}%` }}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs font-bold text-primary bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                        {item.label} claims
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Claim Details Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Claim Details</h3>
                            <button onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Claim ID</p>
                                    <p className="font-bold text-slate-800">{selectedClaim.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedClaim.status)}`}>
                                        {selectedClaim.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Patient Name</p>
                                    <p className="font-medium text-slate-800">{selectedClaim.patient}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Insurance Company</p>
                                    <p className="font-medium text-slate-800">{selectedClaim.company}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Service Date</p>
                                    <p className="font-medium text-slate-800">{selectedClaim.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Claim Submitted</p>
                                    <p className="font-medium text-slate-800">{selectedClaim.claimDate}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-slate-500 mb-1">Services Provided</p>
                                    <p className="font-medium text-slate-800">{selectedClaim.service}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-slate-500 mb-1">Claim Amount</p>
                                    <p className="text-2xl font-bold text-primary">UGX {selectedClaim.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setSelectedClaim(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
                                Close
                            </button>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">
                                Download Claim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceDashboard;
