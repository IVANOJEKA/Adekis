import React from 'react';
import { DollarSign, Download, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const BillingHistory = ({ patientId }) => {
    const { financialRecords } = useData();

    const patientBills = financialRecords.filter(record => record.patientId === patientId);
    const totalBilled = patientBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalPaid = patientBills.filter(b => b.status === 'Paid').reduce((sum, bill) => sum + bill.amount, 0);
    const totalPending = patientBills.filter(b => b.status === 'Pending').reduce((sum, bill) => sum + bill.amount, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Billing History</h2>
                <p className="text-slate-600">View your bills and payment history</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Billed</p>
                    <p className="text-2xl font-bold text-slate-800">UGX {totalBilled.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50">
                    <p className="text-sm font-medium text-emerald-600 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-emerald-700">UGX {totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm bg-amber-50">
                    <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-700">UGX {totalPending.toLocaleString()}</p>
                </div>
            </div>

            {/* Bills List */}
            {patientBills.length > 0 ? (
                <div className="space-y-4">
                    {patientBills.map(bill => (
                        <div key={bill.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${bill.status === 'Paid' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                        <DollarSign size={24} className={bill.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{bill.type || 'Medical Service'}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{bill.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                            <Calendar size={14} />
                                            {bill.date}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800 mb-2">UGX {bill.amount.toLocaleString()}</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {bill.status === 'Paid' && <CheckCircle size={14} />}
                                        {bill.status === 'Pending' && <Clock size={14} />}
                                        {bill.status}
                                    </span>
                                </div>
                            </div>

                            {bill.paymentMethod && (
                                <div className="text-sm text-slate-600 mb-2">
                                    Payment Method: <span className="font-medium">{bill.paymentMethod}</span>
                                    {bill.cardType && bill.last4 && (
                                        <span> - {bill.cardType} •••• {bill.last4}</span>
                                    )}
                                </div>
                            )}

                            {bill.status === 'Paid' && (
                                <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm">
                                    <Download size={16} />
                                    Download Receipt
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                    <div className="text-center text-slate-400">
                        <DollarSign size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No Billing Records</p>
                        <p className="text-sm mt-2">You don't have any billing history yet</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingHistory;
