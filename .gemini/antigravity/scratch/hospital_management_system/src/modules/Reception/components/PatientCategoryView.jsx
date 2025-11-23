import React, { useMemo } from 'react';
import { Users, DollarSign, CreditCard, AlertCircle, Eye, Phone, FileText } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const PatientCategoryView = () => {
    const { patients, financialRecords } = useData();
    const { formatCurrency } = useCurrency();

    // Calculate financial summary for each patient
    const patientsWithFinancials = useMemo(() => {
        return patients.map(patient => {
            const patientRecords = financialRecords.filter(r => r.patientId === patient.id);
            const totalBills = patientRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
            const totalPayments = patientRecords.filter(r => r.status === 'Paid').reduce((sum, r) => sum + (r.amount || 0), 0);
            const balance = totalBills - totalPayments;

            return {
                ...patient,
                totalBills,
                totalPayments,
                balance,
                billCount: patientRecords.length,
                pendingCount: patientRecords.filter(r => r.status === 'Pending').length
            };
        });
    }, [patients, financialRecords]);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'OPD': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' };
            case 'IPD': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' };
            case 'Emergency': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' };
            case 'Maternity': return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700' };
            case 'Pediatric': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700' };
        }
    };

    const categories = ['OPD', 'IPD', 'Emergency', 'Maternity', 'Pediatric'];

    return (
        <div className="space-y-6">
            {/* Category Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {categories.map((category) => {
                    const categoryPatients = patientsWithFinancials.filter(p => p.patientCategory === category);
                    const totalRevenue = categoryPatients.reduce((sum, p) => sum + p.totalPayments, 0);
                    const pendingAmount = categoryPatients.reduce((sum, p) => sum + p.balance, 0);
                    const colors = getCategoryColor(category);

                    return (
                        <div key={category} className={`${colors.bg} border ${colors.border} p-4 rounded-xl`}>
                            <div className="flex items-center justify-between mb-3">
                                <Users size={20} className={colors.text} />
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                                    {categoryPatients.length}
                                </span>
                            </div>
                            <h3 className={`font-bold text-lg ${colors.text} mb-1`}>{category}</h3>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Revenue:</span>
                                    <span className="font-bold text-emerald-700">{formatCurrency(totalRevenue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Pending:</span>
                                    <span className="font-bold text-amber-700">{formatCurrency(pendingAmount)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Patients by Category */}
            <div className="space-y-4">
                {categories.map((category) => {
                    const categoryPatients = patientsWithFinancials.filter(p => p.patientCategory === category);
                    if (categoryPatients.length === 0) return null;

                    const colors = getCategoryColor(category);

                    return (
                        <div key={category} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className={`px-6 py-4 ${colors.bg} border-b ${colors.border} flex justify-between items-center`}>
                                <div>
                                    <h3 className={`font-bold text-lg ${colors.text}`}>{category} Patients</h3>
                                    <p className="text-sm text-slate-600">{categoryPatients.length} patients in this category</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors.badge}`}>
                                    {categoryPatients.length}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Patient</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Contact</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Total Bills</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Payments</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Balance</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {categoryPatients.map((patient) => (
                                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-bold text-slate-800">{patient.name}</p>
                                                            <p className="text-xs text-slate-500">{patient.id} • {patient.age}y, {patient.gender}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone size={14} />
                                                            <span className="text-xs">{patient.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div>
                                                            <p className="font-bold text-slate-800">{formatCurrency(patient.totalBills)}</p>
                                                            <p className="text-xs text-slate-500">{patient.billCount} bill(s)</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <p className="font-bold text-emerald-700">{formatCurrency(patient.totalPayments)}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <p className={`font-bold ${patient.balance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                            {formatCurrency(patient.balance)}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {patient.balance > 0 ? (
                                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit mx-auto">
                                                                <AlertCircle size={12} />
                                                                Pending
                                                            </span>
                                                        ) : patient.totalBills > 0 ? (
                                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit mx-auto">
                                                                <CreditCard size={12} />
                                                                Paid
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold w-fit mx-auto">
                                                                No Bills
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                                                                title="Process Payment"
                                                            >
                                                                <DollarSign size={16} />
                                                            </button>
                                                            <button
                                                                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                                                                title="Print Statement"
                                                            >
                                                                <FileText size={16} />
                                                            </button>
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
                })}
            </div>

            {/* No Patients Message */}
            {patientsWithFinancials.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p>No patients found</p>
                </div>
            )}
        </div>
    );
};

export default PatientCategoryView;
