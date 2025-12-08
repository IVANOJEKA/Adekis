import React, { useState } from 'react';
import { Shield, Users, Building2, CheckCircle, Clock, XCircle, AlertCircle, Eye, Edit, Play, Pause, Calendar, DollarSign, TrendingUp, Search, Filter } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useCurrency } from '../../context/CurrencyContext';

const SubscriptionsDashboard = () => {
    const {
        subscriptions,
        organizations,
        approveSubscription,
        rejectSubscription,
        suspendSubscription,
        reactivateSubscription,
        extendSubscription,
        changeTier,
        getStats,
        SUBSCRIPTION_STATUS,
        SUBSCRIPTION_TIERS
    } = useSubscription();

    const { formatCurrency } = useCurrency();

    const [activeTab, setActiveTab] = useState('all');
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const stats = getStats();

    // Filter subscriptions
    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'pending' && sub.status === 'pending') ||
            (activeTab === 'active' && sub.status === 'active') ||
            (activeTab === 'expired' && sub.status === 'expired');

        return matchesSearch && matchesStatus && matchesTab;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'expired': return 'bg-red-100 text-red-700 border-red-200';
            case 'suspended': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'pending': return Clock;
            case 'expired': return XCircle;
            case 'suspended': return Pause;
            default: return AlertCircle;
        }
    };

    const handleApprove = (subscriptionId) => {
        if (window.confirm('Approve this subscription request?')) {
            approveSubscription(subscriptionId);
            alert('Subscription approved successfully!');
        }
    };

    const handleReject = (subscriptionId) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            rejectSubscription(subscriptionId, reason);
            alert('Subscription rejected.');
        }
    };

    const handleSuspend = (subscriptionId) => {
        const reason = prompt('Enter suspension reason:');
        if (reason) {
            suspendSubscription(subscriptionId, reason);
            alert('Subscription suspended.');
        }
    };

    const handleReactivate = (subscriptionId) => {
        if (window.confirm('Reactivate this subscription?')) {
            reactivateSubscription(subscriptionId);
            alert('Subscription reactivated!');
        }
    };

    const handleExtend = (subscriptionId) => {
        const days = prompt('Enter number of days to extend:');
        if (days && !isNaN(days)) {
            extendSubscription(subscriptionId, parseInt(days));
            alert(`Subscription extended by ${days} days!`);
        }
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Subscription Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage all organization subscriptions and access control</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg">
                    <Shield size={20} />
                    <span className="font-bold">Super Admin</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Building2 size={24} className="opacity-80" />
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-blue-100 text-sm mb-1">Total Organizations</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle size={24} className="opacity-80" />
                    </div>
                    <p className="text-emerald-100 text-sm mb-1">Active Subscriptions</p>
                    <p className="text-3xl font-bold">{stats.active}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock size={24} className="opacity-80" />
                    </div>
                    <p className="text-amber-100 text-sm mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <XCircle size={24} className="opacity-80" />
                    </div>
                    <p className="text-red-100 text-sm mb-1">Expired</p>
                    <p className="text-3xl font-bold">{stats.expired}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={24} className="opacity-80" />
                    </div>
                    <p className="text-purple-100 text-sm mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {[
                    { id: 'all', label: 'All Subscriptions', count: stats.total },
                    { id: 'pending', label: 'Pending Approval', count: stats.pending },
                    { id: 'active', label: 'Active', count: stats.active },
                    { id: 'expired', label: 'Expired', count: stats.expired }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search organizations or subscription ID..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Organization</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Expiry</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Revenue</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubscriptions.length > 0 ? (
                                filteredSubscriptions.map(sub => {
                                    const StatusIcon = getStatusIcon(sub.status);
                                    const daysRemaining = getDaysRemaining(sub.endDate);
                                    const tierData = SUBSCRIPTION_TIERS[sub.tier];

                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-800">{sub.organizationName}</p>
                                                    <p className="text-xs text-slate-500">{sub.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                    {tierData?.name || sub.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(sub.status)}`}>
                                                    <StatusIcon size={14} />
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="text-slate-700">
                                                        {sub.currentUsers}/{sub.maxUsers === -1 ? '∞' : sub.maxUsers} users
                                                    </p>
                                                    <p className="text-slate-500 text-xs">
                                                        {sub.currentPatients}/{sub.maxPatients === -1 ? '∞' : sub.maxPatients} patients
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.endDate ? (
                                                    <div className="text-sm">
                                                        <p className="text-slate-700">{new Date(sub.endDate).toLocaleDateString()}</p>
                                                        {daysRemaining !== null && (
                                                            <p className={`text-xs ${daysRemaining <= 7 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                                                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{formatCurrency(sub.billing.amount)}</p>
                                                <p className="text-xs text-slate-500">{sub.billing.frequency}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {sub.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(sub.id)}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(sub.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {sub.status === 'active' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleExtend(sub.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Extend"
                                                            >
                                                                <Calendar size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleSuspend(sub.id)}
                                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                title="Suspend"
                                                            >
                                                                <Pause size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {sub.status === 'suspended' && (
                                                        <button
                                                            onClick={() => handleReactivate(sub.id)}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Reactivate"
                                                        >
                                                            <Play size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSubscription(sub);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <Building2 size={48} className="mx-auto mb-2 text-slate-300" />
                                        <p>No subscriptions found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedSubscription && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Subscription Details</h3>
                                <p className="text-sm text-slate-500">{selectedSubscription.id}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <XCircle size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Organization</p>
                                    <p className="font-bold text-slate-800">{selectedSubscription.organizationName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Plan</p>
                                    <p className="font-bold text-slate-800">{SUBSCRIPTION_TIERS[selectedSubscription.tier]?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Status</p>
                                    <p className="font-bold text-slate-800 capitalize">{selectedSubscription.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Start Date</p>
                                    <p className="font-bold text-slate-800">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                                </div>
                                {selectedSubscription.endDate && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">End Date</p>
                                        <p className="font-bold text-slate-800">{new Date(selectedSubscription.endDate).toLocaleDateString()}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Contact</p>
                                    <p className="font-bold text-slate-800">{selectedSubscription.contacts.primaryContact}</p>
                                    <p className="text-sm text-slate-600">{selectedSubscription.contacts.email}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs font-bold text-slate-700 uppercase mb-3">Usage Limits</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Users</p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {selectedSubscription.currentUsers}/{selectedSubscription.maxUsers === -1 ? '∞' : selectedSubscription.maxUsers}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Patients</p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {selectedSubscription.currentPatients}/{selectedSubscription.maxPatients === -1 ? '∞' : selectedSubscription.maxPatients}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-xs font-bold text-blue-800 uppercase mb-3">Billing Information</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Amount</span>
                                        <span className="font-bold text-slate-800">{formatCurrency(selectedSubscription.billing.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Frequency</span>
                                        <span className="font-bold text-slate-800 capitalize">{selectedSubscription.billing.frequency}</span>
                                    </div>
                                    {selectedSubscription.billing.lastPayment && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Last Payment</span>
                                            <span className="font-bold text-slate-800">{new Date(selectedSubscription.billing.lastPayment).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionsDashboard;
