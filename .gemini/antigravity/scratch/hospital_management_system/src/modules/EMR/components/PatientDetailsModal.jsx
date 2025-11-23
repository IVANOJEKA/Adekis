import React, { useState } from 'react';
import { X, FileText, Activity, CreditCard, Calendar, User, Phone, MapPin, Clock } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const PatientDetailsModal = ({ patient, onClose }) => {
    const { financialRecords = [] } = useData();
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('billing'); // Default to billing for this task

    const patientBills = financialRecords.filter(r => r.patientId === patient.id);
    const totalDue = patientBills.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><User size={14} /> {patient.gender}, {patient.age} yrs</span>
                                <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
                                <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600 text-xs font-bold">{patient.id}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6">
                    {['Overview', 'Clinical', 'Billing'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-sm text-slate-500">Total Outstanding</p>
                                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalDue)}</p>
                                </div>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                                    Make Payment
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-800">Transaction History</h3>
                                {patientBills.length > 0 ? (
                                    patientBills.map(bill => (
                                        <div key={bill.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${bill.type === 'Consultation' ? 'bg-blue-100 text-blue-600' :
                                                        bill.type === 'Lab Tests' ? 'bg-purple-100 text-purple-600' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <CreditCard size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{bill.description || bill.type}</p>
                                                    <p className="text-xs text-slate-500">{new Date(bill.date).toLocaleDateString()} • {bill.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">{formatCurrency(bill.amount)}</p>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {bill.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-500 py-8">No billing records found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="text-center text-slate-500 py-10">Patient Overview Content</div>
                    )}
                    {activeTab === 'clinical' && (
                        <div className="text-center text-slate-500 py-10">Clinical Records Content</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;
