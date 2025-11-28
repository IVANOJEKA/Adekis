import React from 'react';
import { X, FileText, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const PatientBillModal = ({ patient, onClose }) => {
    const { financialRecords } = useData();

    // Filter bills for this patient
    const patientBills = financialRecords.filter(bill => bill.patientId === patient.id);

    // Calculate totals
    const totalAmount = patientBills.reduce((sum, bill) => sum + bill.amount, 0);
    const paidAmount = patientBills
        .filter(bill => bill.status === 'Paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    const formatCurrency = (amount) => `UGX ${amount.toLocaleString()}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Patient Billing History</h3>
                        <p className="text-sm text-slate-500">{patient.name} ({patient.id})</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                            title="Print Statement"
                        >
                            <Printer size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-white border-b border-slate-100 flex-shrink-0">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Billed</p>
                        <p className="text-xl font-bold text-slate-800">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Paid</p>
                        <p className="text-xl font-bold text-emerald-700">{formatCurrency(paidAmount)}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
                        <p className="text-xl font-bold text-amber-700">{formatCurrency(pendingAmount)}</p>
                    </div>
                </div>

                {/* Bill List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {patientBills.length > 0 ? (
                        <div className="space-y-3">
                            {patientBills.map((bill) => (
                                <div key={bill.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{bill.description || bill.type}</p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(bill.date).toLocaleDateString()} • {bill.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">{formatCurrency(bill.amount)}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            {bill.status === 'Paid' ? (
                                                <>
                                                    <CheckCircle size={12} className="text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-600">Paid</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={12} className="text-amber-500" />
                                                    <span className="text-xs font-bold text-amber-600">Pending</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <AlertCircle size={48} className="mb-4 opacity-50" />
                            <p>No billing records found for this patient.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientBillModal;
