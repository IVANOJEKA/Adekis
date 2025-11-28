import React from 'react';
import { AlertCircle, Clock, Phone, Mail, DollarSign } from 'lucide-react';

const DebtTab = ({ debtRecords = [], patients, formatCurrency }) => {
    // Analyze debt by age
    const analyzeDebtAge = () => {
        const now = new Date();
        const categories = {
            current: [], // 0-30 days
            days30: [],  // 31-60 days
            days60: [],  // 61-90 days
            days90: []   // 90+ days (overdue)
        };

        debtRecords.forEach(debt => {
            const dueDate = new Date(debt.dueDate);
            const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

            if (daysOverdue < 0) categories.current.push(debt);
            else if (daysOverdue <= 30) categories.days30.push(debt);
            else if (daysOverdue <= 60) categories.days60.push(debt);
            else categories.days90.push(debt);
        });

        return categories;
    };

    const debtByAge = analyzeDebtAge();
    const totalDebt = debtRecords.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">Total Outstanding</span>
                        <DollarSign size={20} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalDebt)}</p>
                    <p className="text-sm text-blue-600 mt-1">{debtRecords.length} accounts</p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-700">Current (0-30 days)</span>
                        <Clock size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">{debtByAge.current.length + debtByAge.days30.length}</p>
                    <p className="text-sm text-emerald-600 mt-1">
                        {formatCurrency(
                            [...debtByAge.current, ...debtByAge.days30].reduce((sum, d) => sum + d.amount, 0)
                        )}
                    </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-700">31-90 days</span>
                        <AlertCircle size={20} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{debtByAge.days60.length}</p>
                    <p className="text-sm text-amber-600 mt-1">
                        {formatCurrency(debtByAge.days60.reduce((sum, d) => sum + d.amount, 0))}
                    </p>
                </div>

                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-700">90+ days (Overdue)</span>
                        <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-900">{debtByAge.days90.length}</p>
                    <p className="text-sm text-red-600 mt-1">
                        {formatCurrency(debtByAge.days90.reduce((sum, d) => sum + d.amount, 0))}
                    </p>
                </div>
            </div>

            {/* Overdue Debts - Priority */}
            {debtByAge.days90.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} />
                        Critical: 90+ Days Overdue ({debtByAge.days90.length})
                    </h3>
                    <div className="bg-white rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-red-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-red-900 uppercase">Patient</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-red-900 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-red-900 uppercase">Due Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-red-900 uppercase">Days Overdue</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-red-900 uppercase">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-100">
                                {debtByAge.days90.map((debt) => {
                                    const patient = patients.find(p => p.id === debt.patientId);
                                    const daysOverdue = Math.floor((new Date() - new Date(debt.dueDate)) / (1000 * 60 * 60 * 24));

                                    return (
                                        <tr key={debt.id} className="hover:bg-red-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-bold text-slate-900">{patient?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{debt.patientId}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-red-900">{formatCurrency(debt.amount)}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {new Date(debt.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                    {daysOverdue} days
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                                                        <Phone size={14} />
                                                    </button>
                                                    <button className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200">
                                                        <Mail size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Debt Records */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">All Outstanding Debts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {debtRecords.map((debt) => {
                                const patient = patients.find(p => p.id === debt.patientId);
                                const daysOverdue = Math.floor((new Date() - new Date(debt.dueDate)) / (1000 * 60 * 60 * 24));
                                const isOverdue = daysOverdue > 0;

                                return (
                                    <tr key={debt.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500">{patient?.phone || 'No phone'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(debt.amount)}</td>
                                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{debt.invoiceId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(debt.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${daysOverdue > 90 ? 'bg-red-100 text-red-700' :
                                                    daysOverdue > 60 ? 'bg-amber-100 text-amber-700' :
                                                        daysOverdue > 30 ? 'bg-yellow-100 text-yellow-700' :
                                                            isOverdue ? 'bg-orange-100 text-orange-700' :
                                                                'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {isOverdue ? `${daysOverdue} days overdue` : 'Current'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                                Contact Patient
                                            </button>
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

export default DebtTab;
