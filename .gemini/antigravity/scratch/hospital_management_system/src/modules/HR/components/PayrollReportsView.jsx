import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, Filter } from 'lucide-react';
import { formatPayrollPeriod } from '../../../utils/payrollIdUtils';
import { calculatePayrollSummary } from '../../../utils/payrollCalculations';

const PayrollReportsView = ({ payrollData = [], employees = [] }) => {
    const [reportType, setReportType] = useState('summary');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    // Get unique periods from payroll data
    const periods = [...new Set(payrollData.map(p => p.payrollPeriodId))].sort().reverse();

    // Get unique departments
    const departments = [...new Set(employees.map(e => e.departmentName))].filter(Boolean);

    // Filter payroll data
    const filteredPayroll = payrollData.filter(p => {
        const matchesPeriod = selectedPeriod === 'all' || p.payrollPeriodId === selectedPeriod;
        const matchesDept = selectedDepartment === 'all' || p.departmentName === selectedDepartment;
        return matchesPeriod && matchesDept;
    });

    // Calculate summary
    const summary = calculatePayrollSummary(filteredPayroll);

    // Group by department
    const byDepartment = departments.map(dept => {
        const deptPayrolls = filteredPayroll.filter(p => p.departmentName === dept);
        const deptSummary = calculatePayrollSummary(deptPayrolls);
        return { department: dept, ...deptSummary };
    });

    // Group by period
    const byPeriod = periods.map(period => {
        const periodPayrolls = filteredPayroll.filter(p => p.payrollPeriodId === period);
        const periodSummary = calculatePayrollSummary(periodPayrolls);
        return { period, ...periodSummary };
    });

    const handleExport = (format) => {
        // Placeholder for export functionality
        alert(`Export to ${format.toUpperCase()} would be implemented here using libraries like xlsx or jsPDF`);
    };

    const reportTypes = [
        { id: 'summary', label: 'Summary Report', icon: FileText },
        { id: 'tax', label: 'Tax Remittance', icon: TrendingUp },
        { id: 'department', label: 'Department Breakdown', icon: Users },
        { id: 'period', label: 'Period Comparison', icon: Calendar }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Payroll Reports</h2>
                    <p className="text-slate-600 text-sm mt-1">Generate and export payroll analytics</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('excel')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export Excel
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-4 gap-4">
                {reportTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setReportType(type.id)}
                        className={`p-4 border-2 rounded-lg transition flex items-center gap-3 ${reportType === type.id
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-200 hover:border-primary/50'
                            }`}
                    >
                        <type.icon size={24} />
                        <span className="font-medium">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-lg">
                <Filter className="text-slate-600" size={20} />
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Period</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Periods</option>
                            {periods.map(period => (
                                <option key={period} value={period}>
                                    {formatPayrollPeriod(...period.split('-').slice(1).map(Number))}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div className="card">
                {/* Summary Report */}
                {reportType === 'summary' && (
                    <div className="p-6 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800">Payroll Summary</h3>

                        {/* Overview Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Total Employees</p>
                                <p className="text-3xl font-bold text-blue-700">{summary.employeeCount}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Gross Salary</p>
                                <p className="text-xl font-bold text-green-700">
                                    UGX {summary.totalGross.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Deductions</p>
                                <p className="text-xl font-bold text-red-700">
                                    UGX {summary.totalDeductions.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">Net Salary</p>
                                <p className="text-xl font-bold text-purple-700">
                                    UGX {summary.totalNet.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Breakdown Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-slate-700 font-medium">Metric</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Amount (UGX)</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3 font-medium">Gross Salary</td>
                                        <td className="px-4 py-3 text-right">{summary.totalGross.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">100%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 pl-8 text-slate-600">PAYE Tax</td>
                                        <td className="px-4 py-3 text-right text-red-600">-{summary.totalPAYE.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            {((summary.totalPAYE / summary.totalGross) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 pl-8 text-slate-600">NSSF</td>
                                        <td className="px-4 py-3 text-right text-red-600">-{summary.totalNSSF.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            {((summary.totalNSSF / summary.totalGross) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                    <tr className="bg-slate-50 font-bold">
                                        <td className="px-4 py-3">Net Salary</td>
                                        <td className="px-4 py-3 text-right">{summary.totalNet.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            {((summary.totalNet / summary.totalGross) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tax Remittance Report */}
                {reportType === 'tax' && (
                    <div className="p-6 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800">Tax Remittance Report</h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-slate-600 mb-2">Total PAYE Tax</p>
                                <p className="text-3xl font-bold text-red-700">
                                    UGX {summary.totalPAYE.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">To be remitted to URA</p>
                            </div>
                            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                                <p className="text-sm text-slate-600 mb-2">Total NSSF</p>
                                <p className="text-3xl font-bold text-orange-700">
                                    UGX {summary.totalNSSF.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">Employee contribution (10%)</p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-800 mb-2">Remittance Summary</p>
                            <p className="text-sm text-blue-700">
                                Total statutory deductions: <strong>UGX {(summary.totalPAYE + summary.totalNSSF).toLocaleString()}</strong>
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                                Based on {summary.employeeCount} employee{summary.employeeCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                )}

                {/* Department Breakdown */}
                {reportType === 'department' && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Department Breakdown</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-slate-700 font-medium">Department</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Employees</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Gross</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Deductions</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {byDepartment.map(dept => (
                                        <tr key={dept.department} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{dept.department}</td>
                                            <td className="px-4 py-3 text-right">{dept.employeeCount}</td>
                                            <td className="px-4 py-3 text-right">{dept.totalGross.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right text-red-600">{dept.totalDeductions.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-medium">{dept.totalNet.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-bold">
                                        <td className="px-4 py-3">TOTAL</td>
                                        <td className="px-4 py-3 text-right">{summary.employeeCount}</td>
                                        <td className="px-4 py-3 text-right">{summary.totalGross.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-red-600">{summary.totalDeductions.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">{summary.totalNet.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Period Comparison */}
                {reportType === 'period' && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Period Comparison</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-slate-700 font-medium">Period</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Employees</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Gross</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Net</th>
                                        <th className="px-4 py-3 text-right text-slate-700 font-medium">Avg/Employee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {byPeriod.map(period => (
                                        <tr key={period.period} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                {formatPayrollPeriod(...period.period.split('-').slice(1).map(Number))}
                                            </td>
                                            <td className="px-4 py-3 text-right">{period.employeeCount}</td>
                                            <td className="px-4 py-3 text-right">{period.totalGross.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right font-medium">{period.totalNet.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                {Math.round(period.totalNet / period.employeeCount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollReportsView;
