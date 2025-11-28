import React, { useState, useEffect } from 'react';
import { X, Calculator, AlertCircle, CheckCircle, DollarSign, Users } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import {
    generatePayrollId,
    generatePayrollPeriodId,
    formatPayrollPeriod,
    getPeriodDateRange,
    isFuturePeriod
} from '../../../utils/payrollIdUtils';
import {
    calculateEmployeePayroll,
    calculatePayrollSummary
} from '../../../utils/payrollCalculations';

const ProcessPayrollModal = ({ show, onClose, onSuccess }) => {
    const { employees, payroll, setPayroll, salaryStructures = [] } = useData();

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [step, setStep] = useState(1); // 1: Select Period, 2: Review, 3: Processing
    const [calculatedPayrolls, setCalculatedPayrolls] = useState([]);
    const [summary, setSummary] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Reset when modal opens
    useEffect(() => {
        if (show) {
            setStep(1);
            setCalculatedPayrolls([]);
            setSummary(null);
            setError('');
        }
    }, [show]);

    const handleCalculatePayroll = () => {
        setError('');

        // Validate period
        if (isFuturePeriod(selectedMonth, selectedYear)) {
            setError('Cannot process payroll for future periods');
            return;
        }

        // Check if period already processed
        const periodId = generatePayrollPeriodId(selectedMonth, selectedYear);
        const existingPeriod = payroll.find(p => p.payrollPeriodId === periodId);
        if (existingPeriod) {
            setError('Payroll already processed for this period');
            return;
        }

        setProcessing(true);

        try {
            // Get active employees
            const activeEmployees = employees.filter(emp => emp.status === 'Active');

            if (activeEmployees.length === 0) {
                setError('No active employees found');
                setProcessing(false);
                return;
            }

            // Calculate payroll for each employee
            const calculated = activeEmployees.map((employee, index) => {
                // Find salary structure for this employee
                const salaryStructure = salaryStructures.find(s => s.employeeId === employee.id) || {
                    basicSalary: employee.salary || 0,
                    allowances: {},
                    bonuses: {},
                    overtimeRate: 0,
                    otherDeductions: {}
                };

                // Calculate payroll
                const payrollCalc = calculateEmployeePayroll(employee, salaryStructure);

                // Generate payroll ID
                const payrollId = generatePayrollId(payroll, selectedMonth, selectedYear);

                // Create payroll record
                return {
                    id: `${payrollId}-${String(index + 1).padStart(3, '0')}`,
                    payrollPeriodId: periodId,
                    employeeId: employee.id,
                    employeeName: employee.name,
                    department: employee.department,
                    departmentName: employee.departmentName,
                    month: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`,
                    ...payrollCalc,
                    payrollStatus: 'Pending',
                    processedDate: new Date().toISOString().split('T')[0],
                    approvedBy: null,
                    approvedDate: null,
                    paidDate: null,
                    paymentMethod: 'Bank Transfer',
                    bankAccount: salaryStructure.bankDetails?.accountNumber?.slice(-4) || '****',
                    daysWorked: 22, // Can be calculated from attendance
                    daysAbsent: 0,
                    unpaidLeaveDays: 0,
                    lateDays: 0,
                    notes: '',
                    payslipGenerated: false,
                    payslipUrl: null
                };
            });

            setCalculatedPayrolls(calculated);

            // Calculate summary
            const summaryData = calculatePayrollSummary(calculated);
            setSummary(summaryData);

            setStep(2);
        } catch (err) {
            setError('Error calculating payroll: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = () => {
        try {
            // Add all payroll records
            setPayroll([...payroll, ...calculatedPayrolls]);

            // Show success and close
            if (onSuccess) {
                onSuccess(calculatedPayrolls.length);
            }

            onClose();
        } catch (err) {
            setError('Error saving payroll: ' + err.message);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Calculator className="text-primary" />
                            Process Payroll
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">
                            {step === 1 && 'Select payroll period'}
                            {step === 2 && 'Review calculated payroll'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Select Period */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Month
                                    </label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {months.map((month, index) => (
                                            <option key={month} value={index + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Year
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {[2024, 2025, 2026].map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-slate-700">
                                    <strong>Selected Period:</strong> {formatPayrollPeriod(selectedMonth, selectedYear)}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                    Active Employees: <strong>{employees.filter(e => e.status === 'Active').length}</strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="text-blue-600" size={20} />
                                        <p className="text-sm text-slate-600">Employees</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {summary?.employeeCount || 0}
                                    </p>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="text-green-600" size={20} />
                                        <p className="text-sm text-slate-600">Total Gross</p>
                                    </div>
                                    <p className="text-xl font-bold text-green-700">
                                        UGX {(summary?.totalGross || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="text-red-600" size={20} />
                                        <p className="text-sm text-slate-600">Deductions</p>
                                    </div>
                                    <p className="text-xl font-bold text-red-700">
                                        UGX {(summary?.totalDeductions || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="text-purple-600" size={20} />
                                        <p className="text-sm text-slate-600">Total Net</p>
                                    </div>
                                    <p className="text-xl font-bold text-purple-700">
                                        UGX {(summary?.totalNet || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Payroll Table */}
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto max-h-96">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-slate-700 font-medium">Employee</th>
                                                <th className="px-4 py-3 text-left text-slate-700 font-medium">Department</th>
                                                <th className="px-4 py-3 text-right text-slate-700 font-medium">Gross</th>
                                                <th className="px-4 py-3 text-right text-slate-700 font-medium">PAYE</th>
                                                <th className="px-4 py-3 text-right text-slate-700 font-medium">NSSF</th>
                                                <th className="px-4 py-3 text-right text-slate-700 font-medium">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {calculatedPayrolls.map(payroll => (
                                                <tr key={payroll.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-800">
                                                        {payroll.employeeName}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600">
                                                        {payroll.departmentName}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-slate-800">
                                                        {(payroll.earnings?.grossSalary || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-red-600">
                                                        {(payroll.deductions?.statutory?.paye || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-red-600">
                                                        {(payroll.deductions?.statutory?.nssf || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                                                        {(payroll.netSalary || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <button
                        onClick={() => {
                            if (step === 2) {
                                setStep(1);
                            } else {
                                onClose();
                            }
                        }}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition font-medium"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    <div className="flex gap-3">
                        {step === 1 && (
                            <button
                                onClick={handleCalculatePayroll}
                                disabled={processing}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                <Calculator size={18} />
                                {processing ? 'Calculating...' : 'Calculate Payroll'}
                            </button>
                        )}

                        {step === 2 && (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Submit for Approval
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessPayrollModal;
