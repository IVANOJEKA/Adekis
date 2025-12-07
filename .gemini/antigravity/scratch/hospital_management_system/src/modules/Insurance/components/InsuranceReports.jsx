import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Download, Calendar, PieChart, BarChart3, FileText, Filter } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const InsuranceReports = () => {
    const { insuranceClaims = [], insuranceProviders = [], preAuthorizations = [], patients } = useData();
    const { formatCurrency } = useCurrency();

    const [selectedReport, setSelectedReport] = useState('claims-analytics');
    const [dateRange, setDateRange] = useState('month');
    const [selectedProvider, setSelectedProvider] = useState('all');

    // Calculate analytics
    const analytics = useMemo(() => {
        const now = new Date();
        const filterByDate = (date) => {
            const claimDate = new Date(date);
            if (dateRange === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return claimDate >= weekAgo;
            } else if (dateRange === 'month') {
                return claimDate.getMonth() === now.getMonth() && claimDate.getFullYear() === now.getFullYear();
            } else if (dateRange === 'year') {
                return claimDate.getFullYear() === now.getFullYear();
            }
            return true;
        };

        const filteredClaims = insuranceClaims.filter(claim => {
            const matchesDate = filterByDate(claim.date || claim.submissionDate);
            const matchesProvider = selectedProvider === 'all' || claim.company === selectedProvider;
            return matchesDate && matchesProvider;
        });

        const totalSubmitted = filteredClaims.length;
        const approved = filteredClaims.filter(c => c.status === 'Approved').length;
        const pending = filteredClaims.filter(c => c.status === 'Pending' || c.status === 'Processing').length;
        const denied = filteredClaims.filter(c => c.status === 'Rejected' || c.status === 'Denied').length;

        const totalAmount = filteredClaims.reduce((sum, c) => sum + (c.amount || 0), 0);
        const approvedAmount = filteredClaims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + (c.amount || 0), 0);
        const pendingAmount = filteredClaims.filter(c => c.status === 'Pending' || c.status === 'Processing').reduce((sum, c) => sum + (c.amount || 0), 0);

        const approvalRate = totalSubmitted > 0 ? ((approved / totalSubmitted) * 100).toFixed(1) : 0;
        const denialRate = totalSubmitted > 0 ? ((denied / totalSubmitted) * 100).toFixed(1) : 0;

        // Average processing time (mock - would be calculated from actual submission/approval dates)
        const avgProcessingDays = 7;

        // Claims by provider
        const byProvider = {};
        filteredClaims.forEach(claim => {
            if (!byProvider[claim.company]) {
                byProvider[claim.company] = { count: 0, amount: 0, approved: 0, denied: 0 };
            }
            byProvider[claim.company].count++;
            byProvider[claim.company].amount += claim.amount || 0;
            if (claim.status === 'Approved') byProvider[claim.company].approved++;
            if (claim.status === 'Rejected' || claim.status === 'Denied') byProvider[claim.company].denied++;
        });

        // Pre-auth analytics
        const totalPreAuth = preAuthorizations.length;
        const approvedPreAuth = preAuthorizations.filter(p => p.status === 'Approved').length;
        const pendingPreAuth = preAuthorizations.filter(p => p.status === 'Pending').length;

        return {
            totalSubmitted,
            approved,
            pending,
            denied,
            totalAmount,
            approvedAmount,
            pendingAmount,
            approvalRate,
            denialRate,
            avgProcessingDays,
            byProvider,
            totalPreAuth,
            approvedPreAuth,
            pendingPreAuth
        };
    }, [insuranceClaims, preAuthorizations, dateRange, selectedProvider]);

    const handleExport = (format) => {
        alert(`Exporting report as ${format.toUpperCase()}...`);
        // In production, this would generate and download the actual file
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Insurance Reports & Analytics</h2>
                    <p className="text-sm text-slate-500">Comprehensive reporting for claims and revenue cycle management</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>
                <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                >
                    <option value="all">All Providers</option>
                    {insuranceProviders.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <FileText size={24} className="opacity-80" />
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-blue-100 text-sm mb-1">Total Claims</p>
                    <p className="text-3xl font-bold">{analytics.totalSubmitted}</p>
                    <p className="text-blue-100 text-xs mt-2">Submitted this period</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle size={24} className="opacity-80" />
                        <span className="text-sm font-bold">{analytics.approvalRate}%</span>
                    </div>
                    <p className="text-emerald-100 text-sm mb-1">Approval Rate</p>
                    <p className="text-3xl font-bold">{analytics.approved}</p>
                    <p className="text-emerald-100 text-xs mt-2">Claims approved</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock size={24} className="opacity-80" />
                        <span className="text-sm font-bold">{analytics.avgProcessingDays}d</span>
                    </div>
                    <p className="text-amber-100 text-sm mb-1">Pending Claims</p>
                    <p className="text-3xl font-bold">{analytics.pending}</p>
                    <p className="text-amber-100 text-xs mt-2">Avg. {analytics.avgProcessingDays} days processing</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={24} className="opacity-80" />
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-purple-100 text-sm mb-1">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.totalAmount)}</p>
                    <p className="text-purple-100 text-xs mt-2">Claims submitted value</p>
                </div>
            </div>

            {/* Report Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50">
                    {[
                        { id: 'claims-analytics', label: 'Claims Analytics', icon: BarChart3 },
                        { id: 'revenue-cycle', label: 'Revenue Cycle', icon: DollarSign },
                        { id: 'provider-performance', label: 'Provider Performance', icon: TrendingUp },
                        { id: 'compliance', label: 'Compliance', icon: CheckCircle }
                    ].map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${selectedReport === report.id
                                    ? 'bg-white text-primary border-b-2 border-primary'
                                    : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            <report.icon size={18} />
                            {report.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Claims Analytics */}
                    {selectedReport === 'claims-analytics' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Breakdown */}
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <PieChart size={20} className="text-primary" />
                                        Claims by Status
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                                <span className="text-sm text-slate-700">Approved</span>
                                            </div>
                                            <span className="font-bold text-slate-800">{analytics.approved} ({analytics.approvalRate}%)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                                <span className="text-sm text-slate-700">Pending</span>
                                            </div>
                                            <span className="font-bold text-slate-800">{analytics.pending}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                                <span className="text-sm text-slate-700">Denied</span>
                                            </div>
                                            <span className="font-bold text-slate-800">{analytics.denied} ({analytics.denialRate}%)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Processing Metrics */}
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Clock size={20} className="text-primary" />
                                        Processing Metrics
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Avg. Processing Time</span>
                                            <span className="font-bold text-slate-800">{analytics.avgProcessingDays} days</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Submission Volume</span>
                                            <span className="font-bold text-slate-800">{analytics.totalSubmitted} claims</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">First-Pass Approval</span>
                                            <span className="font-bold text-emerald-600">{analytics.approvalRate}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Claims by Provider */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Claims Volume by Insurance Provider</h3>
                                <div className="space-y-3">
                                    {Object.entries(analytics.byProvider).map(([provider, data]) => (
                                        <div key={provider} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{provider}</p>
                                                <div className="flex gap-4 mt-1">
                                                    <span className="text-xs text-emerald-600">✓ {data.approved} approved</span>
                                                    <span className="text-xs text-red-600">✗ {data.denied} denied</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">{data.count} claims</p>
                                                <p className="text-sm text-slate-600">{formatCurrency(data.amount)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Revenue Cycle */}
                    {selectedReport === 'revenue-cycle' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                                    <p className="text-sm text-blue-600 mb-1">Outstanding Claims</p>
                                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.pendingAmount)}</p>
                                    <p className="text-xs text-slate-600 mt-2">{analytics.pending} pending claims</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                                    <p className="text-sm text-emerald-600 mb-1">Collected Amount</p>
                                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.approvedAmount)}</p>
                                    <p className="text-xs text-slate-600 mt-2">{analytics.approved} approved claims</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl">
                                    <p className="text-sm text-purple-600 mb-1">Collection Rate</p>
                                    <p className="text-2xl font-bold text-slate-800">{analytics.approvalRate}%</p>
                                    <p className="text-xs text-slate-600 mt-2">Of submitted value</p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Days in AR (Accounts Receivable)</h3>
                                <div className="bg-slate-50 p-4 rounded-lg text-center">
                                    <p className="text-4xl font-bold text-slate-800 mb-2">{analytics.avgProcessingDays}</p>
                                    <p className="text-slate-600">Average days to payment</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Provider Performance */}
                    {selectedReport === 'provider-performance' && (
                        <div className="space-y-6">
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Provider</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Claims</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Approved</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Denied</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Total Value</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Success Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.entries(analytics.byProvider).map(([provider, data]) => {
                                            const successRate = data.count > 0 ? ((data.approved / data.count) * 100).toFixed(1) : 0;
                                            return (
                                                <tr key={provider} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-800">{provider}</td>
                                                    <td className="px-4 py-3 text-right text-slate-700">{data.count}</td>
                                                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{data.approved}</td>
                                                    <td className="px-4 py-3 text-right text-red-600 font-medium">{data.denied}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(data.amount)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`font-bold ${parseFloat(successRate) >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {successRate}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pre-Authorization Stats */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Pre-Authorization Performance</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-slate-800">{analytics.totalPreAuth}</p>
                                        <p className="text-sm text-slate-600">Total Requests</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-emerald-600">{analytics.approvedPreAuth}</p>
                                        <p className="text-sm text-slate-600">Approved</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-amber-600">{analytics.pendingPreAuth}</p>
                                        <p className="text-sm text-slate-600">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compliance */}
                    {selectedReport === 'compliance' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-emerald-200 bg-emerald-50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CheckCircle size={24} className="text-emerald-600" />
                                        <h3 className="font-bold text-slate-800">Timely Filing</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-600 mb-2">98.5%</p>
                                    <p className="text-sm text-slate-600">Claims submitted within deadline</p>
                                </div>

                                <div className="border border-blue-200 bg-blue-50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText size={24} className="text-blue-600" />
                                        <h3 className="font-bold text-slate-800">Documentation</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600 mb-2">96.2%</p>
                                    <p className="text-sm text-slate-600">Complete documentation rate</p>
                                </div>

                                <div className="border border-purple-200 bg-purple-50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <TrendingUp size={24} className="text-purple-600" />
                                        <h3 className="font-bold text-slate-800">Coding Accuracy</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-600 mb-2">94.7%</p>
                                    <p className="text-sm text-slate-600">Correct ICD-10/CPT coding</p>
                                </div>

                                <div className="border border-amber-200 bg-amber-50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertCircle size={24} className="text-amber-600" />
                                        <h3 className="font-bold text-slate-800">Rejection Rate</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-amber-600 mb-2">{analytics.denialRate}%</p>
                                    <p className="text-sm text-slate-600">Initial submission denials</p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Compliance Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                        <span className="text-slate-700">✓ HIPAA Compliance</span>
                                        <span className="font-bold text-emerald-600">Compliant</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                        <span className="text-slate-700">✓ ICD-10 Coding Standards</span>
                                        <span className="font-bold text-emerald-600">Compliant</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                        <span className="text-slate-700">✓ CPT Coding Standards</span>
                                        <span className="font-bold text-emerald-600">Compliant</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                        <span className="text-slate-700">✓ Audit Trail Logging</span>
                                        <span className="font-bold text-emerald-600">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsuranceReports;
