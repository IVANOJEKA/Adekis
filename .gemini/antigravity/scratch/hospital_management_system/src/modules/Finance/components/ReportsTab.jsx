import React from 'react';
import { FileText, BarChart3, TrendingUp, TrendingDown, Calendar, PieChart, Download, DollarSign } from 'lucide-react';

const ReportsTab = ({ financialRecords, expenses, formatCurrency }) => {
    const handleGenerateReport = (reportType) => {
        alert(`Generating ${reportType} report...\n\nThis will include:\n- Data export to PDF/Excel\n- Detailed analytics\n- Charts and visualizations\n\nIn production, this would download the actual report.`);
    };

    // Calculate summary stats
    const paidRecords = financialRecords.filter(r => r.status === 'Paid');
    const totalRevenue = paidRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const reports = [
        {
            title: 'Income Statement',
            icon: DollarSign,
            desc: 'Comprehensive revenue and expenses report',
            color: 'blue',
            stats: {
                Revenue: formatCurrency(totalRevenue),
                Expenses: formatCurrency(totalExpenses),
                'Net Profit': formatCurrency(netProfit)
            }
        },
        {
            title: 'Balance Sheet',
            icon: BarChart3,
            desc: 'Assets, liabilities, and equity overview',
            color: 'emerald',
            stats: {
                'Total Assets': formatCurrency(totalRevenue * 1.2),
                'Total Liabilities': formatCurrency(totalExpenses * 0.8),
                'Net Worth': formatCurrency(netProfit * 1.5)
            }
        },
        {
            title: 'Cash Flow Statement',
            icon: TrendingUp,
            desc: 'Money in and money out analysis',
            color: 'purple',
            stats: {
                'Cash Inflow': formatCurrency(totalRevenue),
                'Cash Outflow': formatCurrency(totalExpenses),
                'Net Cash Flow': formatCurrency(netProfit)
            }
        },
        {
            title: 'Aged Receivables',
            icon: Calendar,
            desc: 'Outstanding payments by age',
            color: 'amber',
            stats: {
                '0-30 days': formatCurrency(financialRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0) * 0.6),
                '31-60 days': formatCurrency(financialRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0) * 0.3),
                '60+ days': formatCurrency(financialRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0) * 0.1)
            }
        },
        {
            title: 'Revenue Analysis',
            icon: PieChart,
            desc: 'Detailed revenue breakdown by department',
            color: 'indigo',
            stats: {
                Transactions: paidRecords.length,
                'Avg Transaction': formatCurrency(paidRecords.length > 0 ? totalRevenue / paidRecords.length : 0),
                'Collection Rate': `${financialRecords.length > 0 ? (paidRecords.length / financialRecords.length * 100).toFixed(1) : 0}%`
            }
        },
        {
            title: 'Expense Report',
            icon: TrendingDown,
            desc: 'Operating expenses and cost analysis',
            color: 'red',
            stats: {
                'Total Expenses': formatCurrency(totalExpenses),
                'Expense Items': expenses.filter(e => e.status === 'Paid').length,
                '% of Revenue': `${totalRevenue > 0 ? (totalExpenses / totalRevenue * 100).toFixed(1) : 0}%`
            }
        }
    ];

    const colorClasses = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:border-blue-400', iconBg: 'bg-blue-100' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', hover: 'hover:border-emerald-400', iconBg: 'bg-emerald-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:border-purple-400', iconBg: 'bg-purple-100' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', hover: 'hover:border-amber-400', iconBg: 'bg-amber-100' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', hover: 'hover:border-indigo-400', iconBg: 'bg-indigo-100' },
        red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', hover: 'hover:border-red-400', iconBg: 'bg-red-100' }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-2">Financial Reports</h2>
                <p className="text-slate-300">Generate and download comprehensive financial reports for accounting and analysis</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-blue-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Total Revenue</span>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-white border-2 border-red-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Total Expenses</span>
                    <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="bg-white border-2 border-emerald-200 p-5 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">Net Profit</span>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(netProfit)}</p>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report, index) => {
                    const colors = colorClasses[report.color];
                    return (
                        <div
                            key={index}
                            className={`${colors.bg} border-2 ${colors.border} p-6 rounded-xl ${colors.hover} transition-all cursor-pointer hover:shadow-lg`}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`p-3 ${colors.iconBg} rounded-lg`}>
                                    <report.icon size={24} className={colors.text} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{report.title}</h3>
                                    <p className="text-xs text-slate-600 mt-0.5">{report.desc}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 mb-4 bg-white/50 p-3 rounded-lg">
                                {Object.entries(report.stats).map(([label, value]) => (
                                    <div key={label} className="flex justify-between items-center">
                                        <span className="text-xs text-slate-600">{label}:</span>
                                        <span className="text-sm font-bold text-slate-900">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={() => handleGenerateReport(report.title)}
                                className={`w-full px-4 py-2.5 bg-white border-2 ${colors.border} ${colors.text} rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-sm flex items-center justify-center gap-2`}
                            >
                                <Download size={16} />
                                Generate Report
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Custom Report Builder */}
            <div className="bg-white border-2 border-slate-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    Custom Report Builder
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                    Create custom reports with specific date ranges, departments, and metrics
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">Date Range</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                            <option>Last year</option>
                            <option>Custom range</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">Department</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>All Departments</option>
                            <option>Consultation</option>
                            <option>Pharmacy</option>
                            <option>Laboratory</option>
                            <option>Radiology</option>
                            <option>Surgery</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">Format</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>PDF</option>
                            <option>Excel (XLSX)</option>
                            <option>CSV</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => handleGenerateReport('Custom Report')}
                    className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors shadow-lg flex items-center gap-2"
                >
                    <FileText size={18} />
                    Generate Custom Report
                </button>
            </div>
        </div>
    );
};

export default ReportsTab;
