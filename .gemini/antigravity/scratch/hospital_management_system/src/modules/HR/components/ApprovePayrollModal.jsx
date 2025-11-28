import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, DollarSign, Users, FileText } from 'lucide-react';
import { formatPayrollPeriod, parsePayrollPeriodId } from '../../../utils/payrollIdUtils';
import { calculatePayrollSummary } from '../../../utils/payrollCalculations';

const ApprovePayrollModal = ({ show, payrolls, periodId, onClose, onApprove, onReject, currentUser }) => {
    const [action, setAction] = useState(''); // 'approve' or 'reject'
    const [comments, setComments] = useState('');
    const [processing, setProcessing] = useState(false);

    if (!show || !payrolls || payrolls.length === 0) return null;

    const { month, year } = parsePayrollPeriodId(periodId);
    const periodDisplay = formatPayrollPeriod(month, year);

    // Calculate summary
    const summary = calculatePayrollSummary(payrolls);

    const handleSubmit = () => {
        if (!action) return;

        setProcessing(true);

        const approvalData = {
            status: action === 'approve' ? 'Approved' : 'Rejected',
            approvedBy: currentUser?.id || 'ADMIN',
            approvedDate: new Date().toISOString().split('T')[0],
            comments: comments.trim()
        };

        if (action === 'approve') {
            onApprove(payrolls, approvalData);
        } else {
            onReject(payrolls, approvalData);
        }

        setProcessing(false);
        setAction('');
        setComments('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-primary" />
                            Review Payroll
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">
                            {periodDisplay} • {payrolls.length} employees
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
                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="text-blue-600" size={20} />
                                <p className="text-sm text-slate-600">Employees</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                                {summary.employeeCount}
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-green-600" size={20} />
                                <p className="text-sm text-slate-600">Total Gross</p>
                            </div>
                            <p className="text-lg font-bold text-green-700">
                                UGX {summary.totalGross.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-red-600" size={20} />
                                <p className="text-sm text-slate-600">Deductions</p>
                            </div>
                            <p className="text-lg font-bold text-red-700">
                                UGX {summary.totalDeductions.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-purple-600" size={20} />
                                <p className="text-sm text-slate-600">Total Net</p>
                            </div>
                            <p className="text-lg font-bold text-purple-700">
                                UGX {summary.totalNet.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Tax Summary */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-3">Tax Remittance Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600">Total PAYE</p>
                                <p className="text-xl font-bold text-slate-800">
                                    UGX {summary.totalPAYE.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total NSSF</p>
                                <p className="text-xl font-bold text-slate-800">
                                    UGX {summary.totalNSSF.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Employee List */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-3">Employee Breakdown</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto max-h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-slate-700 font-medium">Employee</th>
                                            <th className="px-4 py-3 text-left text-slate-700 font-medium">Department</th>
                                            <th className="px-4 py-3 text-right text-slate-700 font-medium">Net Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {payrolls.map(payroll => (
                                            <tr key={payroll.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">
                                                    {payroll.employeeName}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {payroll.departmentName}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-800">
                                                    UGX {payroll.netSalary.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Decision Section */}
                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="font-bold text-slate-800 mb-4">Approval Decision</h3>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                onClick={() => setAction('approve')}
                                className={`p-4 border-2 rounded-lg transition flex items-center justify-center gap-2 ${action === 'approve'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 hover:border-green-300'
                                    }`}
                            >
                                <CheckCircle size={24} className={action === 'approve' ? 'text-green-600' : 'text-slate-400'} />
                                <div className="text-left">
                                    <p className="font-bold">Approve Payroll</p>
                                    <p className="text-xs text-slate-600">Mark as ready for payment</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setAction('reject')}
                                className={`p-4 border-2 rounded-lg transition flex items-center justify-center gap-2 ${action === 'reject'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-red-300'
                                    }`}
                            >
                                <XCircle size={24} className={action === 'reject' ? 'text-red-600' : 'text-slate-400'} />
                                <div className="text-left">
                                    <p className="font-bold">Reject Payroll</p>
                                    <p className="text-xs text-slate-600">Send back for revision</p>
                                </div>
                            </button>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Comments {action === 'reject' && <span className="text-red-600">*</span>}
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows="4"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder={action === 'reject' ? 'Please provide reason for rejection...' : 'Optional: Add any comments about this payroll...'}
                            />
                        </div>

                        {/* Warning */}
                        {action && (
                            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${action === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                }`}>
                                <AlertCircle className={action === 'approve' ? 'text-green-600' : 'text-red-600'} size={20} />
                                <div>
                                    <p className={`font-medium ${action === 'approve' ? 'text-green-800' : 'text-red-800'}`}>
                                        {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                                    </p>
                                    <p className={`text-sm ${action === 'approve' ? 'text-green-700' : 'text-red-700'}`}>
                                        {action === 'approve'
                                            ? `This will approve payroll for ${payrolls.length} employees totaling UGX ${summary.totalNet.toLocaleString()}.`
                                            : `This will reject the payroll and send it back for revision. Employees will not be paid until reprocessed.`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!action || (action === 'reject' && !comments.trim()) || processing}
                        className={`px-6 py-2 rounded-lg transition font-medium flex items-center gap-2 disabled:opacity-50 ${action === 'approve'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : action === 'reject'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-slate-300 text-slate-500'
                            }`}
                    >
                        {action === 'approve' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {processing ? 'Processing...' : action === 'approve' ? 'Approve Payroll' : action === 'reject' ? 'Reject Payroll' : 'Select Action'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovePayrollModal;
