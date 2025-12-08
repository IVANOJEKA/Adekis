import React, { useState } from 'react';
import { Building2, Users, FileText, Calendar, DollarSign, TrendingUp, Download, CreditCard, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useCurrency } from '../../context/CurrencyContext';

const OrganizationDashboard = () => {
    const {
        currentSubscription,
        currentOrganization,
        getSubscriptionWarnings,
        recordPayment,
        SUBSCRIPTION_TIERS
    } = useSubscription();

    const { formatCurrency } = useCurrency();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!currentOrganization || !currentSubscription) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <div className="text-center">
                    <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No Organization Found</h2>
                    <p className="text-slate-600">Please contact support for assistance.</p>
                </div>
            </div>
        );
    }

    const warnings = getSubscriptionWarnings();
    const tierData = SUBSCRIPTION_TIERS[currentSubscription.tier];
    const daysRemaining = Math.ceil((new Date(currentSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    const usagePercentage = {
        users: currentSubscription.maxUsers > 0
            ? (currentSubscription.currentUsers / currentSubscription.maxUsers) * 100
            : 0,
        patients: currentSubscription.maxPatients > 0
            ? (currentSubscription.currentPatients / currentSubscription.maxPatients) * 100
            : 0
    };

    const handlePayment = (paymentData) => {
        recordPayment(currentSubscription.id, paymentData);
        setShowPaymentModal(false);
        alert('Payment recorded successfully!');
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{currentOrganization.name}</h1>
                    <p className="text-slate-500 text-sm mt-1">Organization Subscription Dashboard</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${currentSubscription.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    <Shield size={18} />
                    {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-900 mb-2">Attention Required</p>
                            <ul className="space-y-1 text-sm text-amber-800">
                                {warnings.map((warning, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                        {warning.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Overview */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Current Plan</p>
                        <p className="text-3xl font-bold">{tierData?.name}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Amount</p>
                        <p className="text-3xl font-bold">{formatCurrency(currentSubscription.billing.amount)}</p>
                        <p className="text-blue-100 text-xs mt-1">{currentSubscription.billing.frequency}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Valid Until</p>
                        <p className="text-3xl font-bold">{new Date(currentSubscription.endDate).toLocaleDateString()}</p>
                        <p className="text-blue-100 text-xs mt-1">{daysRemaining} days remaining</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Auto Renew</p>
                        <p className="text-3xl font-bold">{currentSubscription.autoRenew ? 'ON' : 'OFF'}</p>
                        <p className="text-blue-100 text-xs mt-1">
                            {currentSubscription.autoRenew ? 'Automatic renewal' : 'Manual renewal'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Users */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">User Accounts</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {currentSubscription.currentUsers}/{currentSubscription.maxUsers === -1 ? '∞' : currentSubscription.maxUsers}
                                </p>
                            </div>
                        </div>
                    </div>
                    {currentSubscription.maxUsers > 0 && (
                        <>
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                                <div
                                    className={`h-3 rounded-full transition-all ${usagePercentage.users >= 100 ? 'bg-red-500' :
                                            usagePercentage.users >= 80 ? 'bg-amber-500' :
                                                'bg-blue-500'
                                        }`}
                                    style={{ width: `${Math.min(usagePercentage.users, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500">
                                {usagePercentage.users.toFixed(0)}% of limit used
                            </p>
                        </>
                    )}
                </div>

                {/* Patients */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <FileText size={24} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Patient Records</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {currentSubscription.currentPatients}/{currentSubscription.maxPatients === -1 ? '∞' : currentSubscription.maxPatients}
                                </p>
                            </div>
                        </div>
                    </div>
                    {currentSubscription.maxPatients > 0 && (
                        <>
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                                <div
                                    className={`h-3 rounded-full transition-all ${usagePercentage.patients >= 100 ? 'bg-red-500' :
                                            usagePercentage.patients >= 80 ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                        }`}
                                    style={{ width: `${Math.min(usagePercentage.patients, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500">
                                {usagePercentage.patients.toFixed(0)}% of limit used
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Features & Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-emerald-600" />
                        Included Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {currentSubscription.features.includes('all-modules') ? (
                            <div className="col-span-2 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg text-center">
                                <p className="font-bold text-emerald-700">✨ All Modules Access</p>
                            </div>
                        ) : (
                            currentSubscription.features.map((feature, index) => (
                                <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <p className="text-sm font-medium text-slate-700 capitalize">
                                        {feature.replace('-', ' ')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-blue-600" />
                        Payment Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Amount:</span>
                            <span className="font-bold text-slate-800">{formatCurrency(currentSubscription.billing.amount)}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Frequency:</span>
                            <span className="font-bold text-slate-800 capitalize">{currentSubscription.billing.frequency}</span>
                        </div>
                        {currentSubscription.billing.lastPayment && (
                            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Last Payment:</span>
                                <span className="font-bold text-slate-800">
                                    {new Date(currentSubscription.billing.lastPayment).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-blue-700">Next Payment:</span>
                            <span className="font-bold text-blue-800">
                                {new Date(currentSubscription.billing.nextPayment).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <CreditCard size={20} />
                        Make Payment
                    </button>
                </div>
            </div>

            {/* Organization Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-slate-600" />
                    Organization Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Organization Type</p>
                        <p className="font-bold text-slate-800">{currentOrganization.type}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Location</p>
                        <p className="font-bold text-slate-800">{currentOrganization.location}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Contact Person</p>
                        <p className="font-bold text-slate-800">{currentOrganization.contactName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="font-bold text-slate-800">{currentOrganization.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                        <p className="font-bold text-slate-800">{currentOrganization.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Member Since</p>
                        <p className="font-bold text-slate-800">
                            {new Date(currentOrganization.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Make Payment</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handlePayment({
                                method: formData.get('method'),
                                reference: formData.get('reference'),
                                amount: currentSubscription.billing.amount,
                                date: new Date().toISOString()
                            });
                        }} className="p-6 space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700 mb-1">Amount Due</p>
                                <p className="text-3xl font-bold text-blue-900">
                                    {formatCurrency(currentSubscription.billing.amount)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    name="method"
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Choose method...</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="card">Card Payment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Payment Reference/Transaction ID
                                </label>
                                <input
                                    type="text"
                                    name="reference"
                                    required
                                    placeholder="Enter transaction reference"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 py-3 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                                >
                                    Submit Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationDashboard;
