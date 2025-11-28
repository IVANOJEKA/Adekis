import React from 'react';
import { PieChart, Wallet, Smartphone, CreditCard, Building, DollarSign, TrendingUp } from 'lucide-react';

const RevenueTab = ({ financialRecords, formatCurrency }) => {
    // Revenue by type/department
    const revenueByType = financialRecords
        .filter(r => r.status === 'Paid')
        .reduce((acc, record) => {
            const type = record.type || 'Other';
            acc[type] = (acc[type] || 0) + record.amount;
            return acc;
        }, {});

    // Revenue by payment method
    const revenueByPaymentMethod = financialRecords
        .filter(r => r.status === 'Paid' && r.paymentMethod)
        .reduce((acc, record) => {
            const method = record.paymentMethod || 'Cash';
            acc[method] = (acc[method] || 0) + record.amount;
            return acc;
        }, {});

    // Calculate totals
    const totalRevenue = Object.values(revenueByType).reduce((sum, val) => sum + val, 0);
    const totalByPayment = Object.values(revenueByPaymentMethod).reduce((sum, val) => sum + val, 0);

    // Payment method icons
    const paymentIcons = {
        'Cash': Wallet,
        'Mobile Money': Smartphone,
        'Card': CreditCard,
        'Insurance': Building
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total Revenue (Paid)</p>
                        <p className="text-4xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
                        <p className="text-blue-200 text-sm mt-2">
                            {financialRecords.filter(r => r.status === 'Paid').length} completed transactions
                        </p>
                    </div>
                    <div className="p-4 bg-white/20 rounded-full">
                        <TrendingUp size={40} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue by Department/Type */}
                <div className="bg-white border border-slate-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart size={20} className="text-blue-500" />
                        <h3 className="text-lg font-bold text-slate-800">Revenue by Department</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(revenueByType)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, amount]) => {
                                const percentage = totalRevenue > 0 ? (amount / totalRevenue * 100).toFixed(1) : 0;
                                return (
                                    <div key={type} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">{type}</span>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-slate-900">{formatCurrency(amount)}</span>
                                                <span className="text-xs text-slate-500 ml-2">({percentage}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-500 h-2.5 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Revenue by Payment Method */}
                <div className="bg-white border border-slate-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet size={20} className="text-emerald-500" />
                        <h3 className="text-lg font-bold text-slate-800">Revenue by Payment Method</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(revenueByPaymentMethod)
                            .sort(([, a], [, b]) => b - a)
                            .map(([method, amount]) => {
                                const percentage = totalByPayment > 0 ? (amount / totalByPayment * 100).toFixed(1) : 0;
                                const Icon = paymentIcons[method] || Wallet;

                                return (
                                    <div key={method} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Icon size={24} className="text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{method}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-sm font-bold text-emerald-600">{formatCurrency(amount)}</p>
                                                <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-emerald-500 h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-slate-600">{percentage}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {Object.keys(revenueByPaymentMethod).length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                <p className="text-sm">No payment method data available</p>
                                <p className="text-xs mt-1">Payments will be categorized once recorded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Method Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Cash', 'Mobile Money', 'Card', 'Insurance'].map(method => {
                    const amount = revenueByPaymentMethod[method] || 0;
                    const Icon = paymentIcons[method];
                    const count = financialRecords.filter(r => r.status === 'Paid' && r.paymentMethod === method).length;

                    return (
                        <div key={method} className="bg-white border border-slate-200 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Icon size={20} className="text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-600">{method}</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(amount)}</p>
                            <p className="text-xs text-slate-500 mt-1">{count} transactions</p>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Breakdown Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Detailed Revenue Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Transactions</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Total Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">% of Total</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Avg per Transaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.entries(revenueByType)
                                .sort(([, a], [, b]) => b - a)
                                .map(([type, amount]) => {
                                    const count = financialRecords.filter(r => r.status === 'Paid' && r.type === type).length;
                                    const percentage = totalRevenue > 0 ? (amount / totalRevenue * 100).toFixed(1) : 0;
                                    const avg = count > 0 ? amount / count : 0;

                                    return (
                                        <tr key={type} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{type}</td>
                                            <td className="px-6 py-4 text-slate-600">{count}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">{formatCurrency(avg)}</td>
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

export default RevenueTab;
