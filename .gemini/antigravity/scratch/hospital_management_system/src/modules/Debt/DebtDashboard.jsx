import React from 'react';
import { ShieldCheck, AlertCircle, Phone, FileText } from 'lucide-react';

const DebtDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Debt Management</h1>
                    <p className="text-slate-500">Track and collect outstanding patient payments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-4 border-l-4 border-l-red-500">
                    <p className="text-sm text-slate-500">Total Outstanding Debt</p>
                    <p className="text-2xl font-bold text-slate-800">$15,400</p>
                </div>
                <div className="card p-4 border-l-4 border-l-orange-500">
                    <p className="text-sm text-slate-500">Overdue (&gt; 90 Days)</p>
                    <p className="text-2xl font-bold text-slate-800">$4,200</p>
                </div>
                <div className="card p-4 border-l-4 border-l-green-500">
                    <p className="text-sm text-slate-500">Recovered This Month</p>
                    <p className="text-2xl font-bold text-slate-800">$2,100</p>
                </div>
            </div>

            <div className="card">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800">Debtor List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Patient</th>
                                <th className="px-6 py-3">Amount Due</th>
                                <th className="px-6 py-3">Last Visit</th>
                                <th className="px-6 py-3">Days Overdue</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        Michael Scott
                                        <div className="text-xs text-slate-500">+1 234 567 890</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-red-600">$450.00</td>
                                    <td className="px-6 py-4 text-slate-600">Aug 12, 2024</td>
                                    <td className="px-6 py-4 text-slate-600">65 Days</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">OVERDUE</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Call"><Phone size={16} /></button>
                                            <button className="p-1.5 bg-slate-50 text-slate-600 rounded hover:bg-slate-100" title="View Invoice"><FileText size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DebtDashboard;
