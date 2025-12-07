import React, { useState } from 'react';
import { FileText, TrendingUp, DollarSign, Users, Activity, Download, Calendar, PieChart } from 'lucide-react';

const CampReports = ({ campId, campName, campPatients, campFinancials, campPrescriptions, campInventory }) => {
    const [reportType, setReportType] = useState('performance');
    const [dateRange, setDateRange] = useState('all');

    // Calculate Performance Metrics
    const performanceMetrics = {
        totalPatients: campPatients.length,
        consultationsCompleted: campFinancials.filter(f => f.type === 'Consultation').length,
        totalRevenue: campFinancials.reduce((sum, f) => sum + f.amount, 0),
        averageConsultationFee: campFinancials.filter(f => f.type === 'Consultation')
            .reduce((sum, f, _, arr) => sum + f.amount / arr.length, 0) || 0,
        medicinesSold: campPrescriptions.filter(p => p.dispensed).length,
        pendingPrescriptions: campPrescriptions.filter(p => !p.dispensed).length
    };

    // Revenue Breakdown
    const revenueBreakdown = {
        consultations: campFinancials.filter(f => f.type === 'Consultation')
            .reduce((sum, f) => sum + f.amount, 0),
        medicines: campFinancials.filter(f => f.service?.includes('Medicine'))
            .reduce((sum, f) => sum + f.amount, 0),
        procedures: campFinancials.filter(f => !f.type?.includes('Consultation') && !f.service?.includes('Medicine'))
            .reduce((sum, f) => sum + f.amount, 0)
    };

    // Payment Method Breakdown
    const paymentMethods = campFinancials.reduce((acc, f) => {
        const method = f.paymentMethod || 'Cash';
        acc[method] = (acc[method] || 0) + f.amount;
        return acc;
    }, {});

    // Medicine Usage
    const medicineUsage = campInventory
        .filter(item => item.category === 'Medicine')
        .map(item => ({
            name: item.itemName,
            used: item.usedQuantity || 0,
            remaining: item.quantity - (item.usedQuantity || 0),
            value: (item.usedQuantity || 0) * (item.unitPrice || 0)
        }));

    const totalMedicineValue = medicineUsage.reduce((sum, m) => sum + m.value, 0);

    const exportReport = (format) => {
        alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
        // Implementation for actual export would go here
    };

    return (
        <div className="space-y-6">
            {/* Header with Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-primary" size={28} />
                            Camp Reports
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{campName}</p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="performance">Performance Report</option>
                            <option value="revenue">Revenue Report</option>
                            <option value="medicine">Medicine Usage</option>
                            <option value="profit-loss">Profit & Loss</option>
                        </select>

                        <button
                            onClick={() => exportReport('pdf')}
                            className="btn bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                        >
                            <Download size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Report */}
            {reportType === 'performance' && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                            </div>
                            <h3 className="text-sm text-slate-500 mb-1">Total Patients</h3>
                            <p className="text-3xl font-bold text-slate-800">{performanceMetrics.totalPatients}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Activity className="text-green-600" size={24} />
                                </div>
                            </div>
                            <h3 className="text-sm text-slate-500 mb-1">Consultations</h3>
                            <p className="text-3xl font-bold text-slate-800">{performanceMetrics.consultationsCompleted}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <DollarSign className="text-emerald-600" size={24} />
                                </div>
                            </div>
                            <h3 className="text-sm text-slate-500 mb-1">Total Revenue</h3>
                            <p className="text-3xl font-bold text-slate-800">UGX {performanceMetrics.totalRevenue.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <TrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                            <h3 className="text-sm text-slate-500 mb-1">Avg. Consultation Fee</h3>
                            <p className="text-3xl font-bold text-slate-800">UGX {Math.round(performanceMetrics.averageConsultationFee).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Services Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Services Delivered</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-slate-700">Consultations Completed</span>
                                <span className="text-xl font-bold text-slate-800">{performanceMetrics.consultationsCompleted}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="font-medium text-slate-700">Medicines Dispensed</span>
                                <span className="text-xl font-bold text-slate-800">{performanceMetrics.medicinesSold}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                <span className="font-medium text-slate-700">Pending Prescriptions</span>
                                <span className="text-xl font-bold text-slate-800">{performanceMetrics.pendingPrescriptions}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue Report */}
            {reportType === 'revenue' && (
                <div className="space-y-6">
                    {/* Revenue Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <PieChart size={20} />
                            Revenue Breakdown
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-600">Consultation Fees</span>
                                    <span className="font-bold text-slate-800">UGX {revenueBreakdown.consultations.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-500 h-3 rounded-full"
                                        style={{ width: `${(revenueBreakdown.consultations / performanceMetrics.totalRevenue * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-600">Medicine Sales</span>
                                    <span className="font-bold text-slate-800">UGX {revenueBreakdown.medicines.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full"
                                        style={{ width: `${(revenueBreakdown.medicines / performanceMetrics.totalRevenue * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-600">Other Services</span>
                                    <span className="font-bold text-slate-800">UGX {revenueBreakdown.procedures.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-500 h-3 rounded-full"
                                        style={{ width: `${(revenueBreakdown.procedures / performanceMetrics.totalRevenue * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-slate-800 flex justify-between items-center">
                            <span className="text-xl font-bold text-slate-800">Total Revenue</span>
                            <span className="text-3xl font-bold text-primary">UGX {performanceMetrics.totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Payment Method Breakdown</h3>
                        <div className="space-y-3">
                            {Object.entries(paymentMethods).map(([method, amount]) => (
                                <div key={method} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">{method}</span>
                                    <span className="text-lg font-bold text-slate-800">UGX {amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Medicine Usage Report */}
            {reportType === 'medicine' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Medicine Usage & Value</h3>

                    <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Total Medicine Value Used</span>
                            <span className="text-2xl font-bold text-emerald-700">UGX {totalMedicineValue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b-2 border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold text-slate-700">Medicine</th>
                                    <th className="px-4 py-3 text-right font-bold text-slate-700">Used</th>
                                    <th className="px-4 py-3 text-right font-bold text-slate-700">Remaining</th>
                                    <th className="px-4 py-3 text-right font-bold text-slate-700">Value (UGX)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {medicineUsage.map((med, index) => (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">{med.name}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{med.used}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{med.remaining}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-800">{med.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Profit & Loss */}
            {reportType === 'profit-loss' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-xl text-slate-800 mb-6">Profit & Loss Statement</h3>

                    <div className="space-y-4">
                        {/* Revenue Section */}
                        <div className="border-b pb-4">
                            <h4 className="font-bold text-lg text-slate-700 mb-3">Revenue</h4>
                            <div className="space-y-2 ml-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Consultation Fees</span>
                                    <span className="font-medium">UGX {revenueBreakdown.consultations.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Medicine Sales</span>
                                    <span className="font-medium">UGX {revenueBreakdown.medicines.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Other Services</span>
                                    <span className="font-medium">UGX {revenueBreakdown.procedures.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-slate-200 font-bold">
                                <span>Total Revenue</span>
                                <span className="text-green-600">UGX {performanceMetrics.totalRevenue.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Expenses Section */}
                        <div className="border-b pb-4">
                            <h4 className="font-bold text-lg text-slate-700 mb-3">Expenses</h4>
                            <div className="space-y-2 ml-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Medicine Cost</span>
                                    <span className="font-medium">UGX {totalMedicineValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Staff Costs</span>
                                    <span className="font-medium">UGX 0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Logistics</span>
                                    <span className="font-medium">UGX 0</span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-slate-200 font-bold">
                                <span>Total Expenses</span>
                                <span className="text-red-600">UGX {totalMedicineValue.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Net Profit/Loss */}
                        <div className="pt-4">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                                <span className="text-xl font-bold text-slate-800">Net Profit</span>
                                <span className="text-3xl font-bold text-emerald-600">
                                    UGX {(performanceMetrics.totalRevenue - totalMedicineValue).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampReports;
