import React from 'react';
import { CreditCard, Wallet, Smartphone, Building, CheckCircle, AlertCircle, Search, Calendar } from 'lucide-react';

const PaymentsTab = ({
    financialRecords,
    patients,
    formatCurrency,
    onRecordPayment,
    searchTerm,
    onSearchChange
}) => {
    // Filter unpaid/pending records
    const pendingPayments = financialRecords.filter(r => r.status === 'Pending');
    const recentPayments = financialRecords.filter(r => r.status === 'Paid').slice(0, 10);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-700">Pending Payments</span>
                        <AlertCircle size={20} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{pendingPayments.length}</p>
                    <p className="text-sm text-amber-600 mt-1">
                        Total: {formatCurrency(pendingPayments.reduce((sum, r) => sum + r.amount, 0))}
                    </p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-700">Payments Today</span>
                        <CheckCircle size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">{recentPayments.length}</p>
                    <p className="text-sm text-emerald-600 mt-1">
                        Total: {formatCurrency(recentPayments.reduce((sum, r) => sum + r.amount, 0))}
                    </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">Payment Methods</span>
                        <Wallet size={20} className="text-blue-500" />
                    </div>
                    <div className="text-xs text-blue-600 space-y-1 mt-2">
                        <div className="flex justify-between">
                            <span>Cash</span><span className="font-bold">45%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Mobile Money</span><span className="font-bold">35%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Card/Insurance</span><span className="font-bold">20%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by patient name or invoice..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Pending Payments Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-amber-50">
                    <h3 className="font-bold text-slate-800">Pending Payments ({pendingPayments.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingPayments
                                .filter(r => !searchTerm ||
                                    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    patients.find(p => p.id === r.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((record) => {
                                    const patient = patients.find(p => p.id === record.patientId);
                                    return (
                                        <tr key={record.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{record.id}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{patient?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{record.patientId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                    {record.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                {formatCurrency(record.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => onRecordPayment(record)}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium transition-colors"
                                                >
                                                    Record Payment
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-emerald-50">
                    <h3 className="font-bold text-slate-800">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentPayments.map((record) => {
                                const patient = patients.find(p => p.id === record.patientId);
                                const methodIcons = {
                                    'Cash': Wallet,
                                    'Mobile Money': Smartphone,
                                    'Card': CreditCard,
                                    'Insurance': Building
                                };
                                const Icon = methodIcons[record.paymentMethod] || Wallet;

                                return (
                                    <tr key={record.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{record.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{patient?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(record.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                <Icon size={14} />
                                                {record.paymentMethod || 'Cash'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(record.paidDate || record.date).toLocaleString()}
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

export default PaymentsTab;
