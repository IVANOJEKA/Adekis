import React, { useState } from 'react';
import { DollarSign, CreditCard, FileText, TrendingUp, TrendingDown, Shield, Download, Pill, TestTube, Hotel, Activity, Users, X, Wallet, Smartphone, Banknote, Building, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

import CashierView from './components/CashierView';

const FinanceDashboard = () => {
    const { financialRecords, setFinancialRecords, debtRecords, setDebtRecords } = useData();
    const formatCurrency = (amount) => `UGX ${amount.toLocaleString()}`;
    const [activeTab, setActiveTab] = useState('overview');

    // Calculate totals
    const totalRevenue = financialRecords.reduce((sum, record) => sum + (record.amount || 0), 0);
    const paidRecords = financialRecords.filter(r => r.status === 'Paid');
    const pendingRecords = financialRecords.filter(r => r.status === 'Pending');
    const totalPaid = paidRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalPending = pendingRecords.reduce((sum, r) => sum + r.amount, 0);

    const stats = [
        { label: 'Total Revenue', value: formatCurrency(totalRevenue), count: `${financialRecords.length} Records`, icon: DollarSign },
        { label: 'Total Paid', value: formatCurrency(totalPaid), count: `${paidRecords.length} Paid`, icon: Shield },
        { label: 'Pending Payments', value: formatCurrency(totalPending), count: `${pendingRecords.length} Pending`, icon: FileText },
    ];

    const handleGenerateReport = () => {
        alert('Report generation feature coming soon!');
    };

    const generateReceipt = (transaction) => {
        alert(`Receipt for ${transaction.id}: ${formatCurrency(transaction.amount)}`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Finance & Accounting</h1>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive financial management and reporting</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-lg shadow-emerald-500/30"
                    >
                        <Download size={16} />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 mb-6">
                {['overview', 'cashier'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab
                                ? 'text-emerald-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Cashier Tab */}
            {activeTab === 'cashier' && <CashierView />}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <stat.icon size={20} />
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                                </div>
                                <p className="text-2xl font-bold text-slate-800 mb-2">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{stat.count}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Transactions */}
                    <div className="border-t border-slate-200 pt-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h2>
                        {financialRecords.length > 0 ? (
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {financialRecords.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-slate-900">{transaction.id}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{transaction.patientId}</td>
                                                <td className="px-6 py-4 text-slate-600">{transaction.type}</td>
                                                <td className="px-6 py-4 text-slate-600">{transaction.date}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(transaction.amount)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${transaction.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => generateReceipt(transaction)}
                                                        className="text-primary hover:text-primary-dark text-xs font-medium"
                                                    >
                                                        View Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">No Financial Records</h3>
                                <p className="text-slate-500">Financial data has been reset or no transactions recorded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDashboard;
