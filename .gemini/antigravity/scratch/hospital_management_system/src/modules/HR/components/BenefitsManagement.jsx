import React, { useState } from 'react';
import { Award, Shield, DollarSign, Plus, CheckCircle, Search, ChevronRight, User } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const BenefitsManagement = () => {
    const { benefits, employees, setBenefits } = useData();
    const [selectedPackage, setSelectedPackage] = useState('all');
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    // Dummy Packages Data
    const packages = [
        { id: 'gold', name: 'Gold Package', cost: 500000, description: 'Comprehensive health, dental, and vision + 10% pension.' },
        { id: 'silver', name: 'Silver Package', cost: 300000, description: 'Standard health and dental + 5% pension.' },
        { id: 'bronze', name: 'Bronze Package', cost: 150000, description: 'Basic health coverage + 3% pension.' }
    ];

    const totalMonthlyCost = benefits?.reduce((sum, b) => sum + b.totalMonthlyValue, 0) || 0;
    const enrolledCount = benefits?.length || 0;

    const filteredBenefits = benefits?.filter(b =>
        selectedPackage === 'all' || b.package.toLowerCase().includes(selectedPackage)
    ) || [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Monthly</span>
                    </div>
                    <p className="text-indigo-100 text-sm font-medium">Total Benefits Cost</p>
                    <h3 className="text-3xl font-bold">UGX {totalMonthlyCost.toLocaleString()}</h3>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Shield size={24} />
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-emerald-100 text-sm font-medium">Enrolled Employees</p>
                    <h3 className="text-3xl font-bold">{enrolledCount}</h3>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <Award size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800">Available Packages</h4>
                    <p className="text-sm text-slate-500 mb-3">{packages.length} Active Plans</p>
                    <button className="text-sm font-bold text-purple-600 hover:underline">View Details</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Benefits List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Enrollment Overview</h3>
                                <p className="text-sm text-slate-500">Manage employee benefit subscriptions</p>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    value={selectedPackage}
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                >
                                    <option value="all">All Packages</option>
                                    <option value="gold">Gold</option>
                                    <option value="silver">Silver</option>
                                    <option value="bronze">Bronze</option>
                                </select>
                                <button className="btn btn-primary btn-sm rounded-xl gap-2">
                                    <Plus size={16} />
                                    Enroll New
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">Package</th>
                                        <th className="px-6 py-4">Details</th>
                                        <th className="px-6 py-4 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredBenefits.map(benefit => (
                                        <tr key={benefit.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{benefit.employeeName}</p>
                                                        <p className="text-xs text-slate-500">ID: {benefit.employeeId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${benefit.package === 'Gold' ? 'bg-amber-100 text-amber-700' :
                                                        benefit.package === 'Silver' ? 'bg-slate-100 text-slate-700' :
                                                            'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {benefit.package}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <Shield size={12} className="text-emerald-500" />
                                                        {benefit.healthInsurance.provider} ({benefit.healthInsurance.coverage})
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        Pension: {benefit.pension.scheme}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-800">
                                                UGX {benefit.totalMonthlyValue.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Packages */}
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg">Available Plans</h3>
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-transform bg-gradient-to-br opacity-20 ${pkg.id === 'gold' ? 'from-amber-400 to-yellow-600' :
                                    pkg.id === 'silver' ? 'from-slate-400 to-slate-600' :
                                        'from-orange-400 to-red-600'
                                }`}></div>

                            <div className="relative z-10">
                                <h4 className="font-bold text-lg text-slate-800 mb-1">{pkg.name}</h4>
                                <h2 className="text-2xl font-black text-slate-900 mb-3">
                                    <span className="text-sm font-medium text-slate-500 align-top">UGX</span>
                                    {pkg.cost.toLocaleString()}
                                </h2>
                                <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>

                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle size={14} className="text-green-500" /> Health Insurance
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle size={14} className="text-green-500" /> Pension Contribution
                                    </li>
                                </ul>

                                <button className="w-full py-2 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm">
                                    View Full Benefits
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BenefitsManagement;
