import React from 'react';
import { Search, CheckCircle, AlertCircle, Eye, Download } from 'lucide-react';

const TransactionsTab = ({
    financialRecords,
    patients,
    formatCurrency,
    searchTerm,
    onSearchChange
}) => {
    // Filter records
    const filteredRecords = financialRecords.filter(record =>
        !searchTerm ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patients.find(p => p.id === record.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Statistics
    const paidRecords = filteredRecords.filter(r => r.status === 'Paid');
    const pendingRecords = filteredRecords.filter(r => r.status === 'Pending');
    const totalPaid = paidRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalPending = pendingRecords.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-blue-700">Total Transactions</span>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{filteredRecords.length}</p>
                    <p className="text-sm text-blue-600 mt-1">{formatCurrency(paidRecords.reduce((sum, r) => sum + r.amount, 0) + pendingRecords.reduce((sum, r) => sum + r.amount, 0))}</p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-emerald-700">Paid</span>
                    <p className="text-2xl font-bold text-emerald-900 mt-2">{paidRecords.length}</p>
                    <p className="text-sm text-emerald-600 mt-1">{formatCurrency(totalPaid)}</p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-amber-700">Pending</span>
                    <p className="text-2xl font-bold text-amber-900 mt-2">{pendingRecords.length}</p>
                    <p className="text-sm text-amber-600 mt-1">{formatCurrency(totalPending)}</p>
                </div>

                <div className="bg-purple-50 border-2 border-purple-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-purple-700">Avg Transaction</span>
                    <p className="text-2xl font-bold text-purple-900 mt-2">{formatCurrency(paidRecords.length > 0 ? totalPaid / paidRecords.length : 0)}</p>
                    <p className="text-sm text-purple-600 mt-1">Per transaction</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice, patient name, or ID..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <button className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                    <Download size={18} className="inline mr-2" />
                    Export
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Payment Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRecords.map((record) => {
                                const patient = patients.find(p => p.id === record.patientId);
                                return (
                                    <tr key={record.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-slate-900">{record.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500">{record.patientId}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {formatCurrency(record.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.paymentMethod ? (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                    {record.paymentMethod}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${record.status === 'Paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {record.status === 'Paid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredRecords.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm mt-1">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default TransactionsTab;
