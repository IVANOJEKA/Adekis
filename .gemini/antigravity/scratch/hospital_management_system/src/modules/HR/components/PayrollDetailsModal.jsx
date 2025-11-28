import React, { useState, useEffect } from 'react';
import { X, Edit2, Save, DollarSign, User, Calendar, Building, FileText } from 'lucide-react';
import { formatPayrollPeriod, parsePayrollPeriodId } from '../../../utils/payrollIdUtils';

const PayrollDetailsModal = ({ show, payroll, onClose, onUpdate, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (payroll) {
            setFormData(payroll);
        }
    }, [payroll]);

    if (!show || !payroll || !formData) return null;

    const { month, year } = parsePayrollPeriodId(payroll.payrollPeriodId);
    const periodDisplay = formatPayrollPeriod(month, year);

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(payroll.id, formData);
        }
        setIsEditing(false);
    };

    const canEdit = !readOnly && payroll.payrollStatus === 'Pending';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-primary" />
                            Payroll Details
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">
                            {periodDisplay} • {payroll.employeeName}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {canEdit && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition"
                                title="Edit"
                            >
                                <Edit2 size={20} />
                            </button>
                        )}
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(payroll);
                                onClose();
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded ${payroll.payrollStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                payroll.payrollStatus === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                    payroll.payrollStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                            }`}>
                            {payroll.payrollStatus}
                        </span>
                        {payroll.paidDate && (
                            <span className="text-sm text-slate-600">
                                Paid on: <strong>{payroll.paidDate}</strong>
                            </span>
                        )}
                    </div>

                    {/* Employee Info */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <User size={20} className="text-slate-600" />
                            Employee Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm text-slate-500">Employee ID</p>
                                <p className="font-medium text-slate-800">{payroll.employeeId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Name</p>
                                <p className="font-medium text-slate-800">{payroll.employeeName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Department</p>
                                <p className="font-medium text-slate-800">{payroll.departmentName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Days Worked</p>
                                <p className="font-medium text-slate-800">{payroll.daysWorked} / 22</p>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Breakdown */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <DollarSign size={20} className="text-green-600" />
                            Earnings
                        </h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">Basic Salary</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-800">
                                            UGX {(formData.earnings?.basicSalary || 0).toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* Allowances */}
                                    {formData.earnings?.allowances && Object.entries(formData.earnings.allowances).map(([key, value]) => {
                                        if (key === 'total') return null;
                                        return (
                                            <tr key={key} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-slate-600 pl-8">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)} Allowance
                                                </td>
                                                <td className="px-4 py-3 text-right text-green-600">
                                                    +{(value || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Bonuses */}
                                    {formData.earnings?.bonuses?.total > 0 && (
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-600 pl-8">Bonuses</td>
                                            <td className="px-4 py-3 text-right text-green-600">
                                                +{(formData.earnings.bonuses.total || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Overtime */}
                                    {formData.earnings?.overtime?.total > 0 && (
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-600 pl-8">
                                                Overtime ({formData.earnings.overtime.hours} hrs)
                                            </td>
                                            <td className="px-4 py-3 text-right text-green-600">
                                                +{(formData.earnings.overtime.total || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="bg-green-50 font-bold">
                                        <td className="px-4 py-3 text-slate-800">Gross Salary</td>
                                        <td className="px-4 py-3 text-right text-green-700">
                                            UGX {(formData.earnings?.grossSalary || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Deductions Breakdown */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <DollarSign size={20} className="text-red-600" />
                            Deductions
                        </h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    {/* Statutory Deductions */}
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-2 font-medium text-slate-700" colSpan="2">
                                            Statutory Deductions
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600 pl-8">PAYE Tax</td>
                                        <td className="px-4 py-3 text-right text-red-600">
                                            -{(formData.deductions?.statutory?.paye || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600 pl-8">NSSF</td>
                                        <td className="px-4 py-3 text-right text-red-600">
                                            -{(formData.deductions?.statutory?.nssf || 0).toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* Other Deductions */}
                                    {formData.deductions?.other?.total > 0 && (
                                        <>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-2 font-medium text-slate-700" colSpan="2">
                                                    Other Deductions
                                                </td>
                                            </tr>
                                            {Object.entries(formData.deductions.other).map(([key, value]) => {
                                                if (key === 'total' || !value) return null;
                                                return (
                                                    <tr key={key} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-600 pl-8">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-red-600">
                                                            -{(value || 0).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    )}

                                    <tr className="bg-red-50 font-bold">
                                        <td className="px-4 py-3 text-slate-800">Total Deductions</td>
                                        <td className="px-4 py-3 text-right text-red-700">
                                            UGX {(formData.deductions?.totalDeductions || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Net Salary */}
                    <div className="p-6 bg-primary/5 border-2 border-primary rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Net Salary</p>
                                <p className="text-3xl font-bold text-primary">
                                    UGX {(formData.netSalary || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-600">Payment Method</p>
                                <p className="font-medium text-slate-800">{payroll.paymentMethod}</p>
                                {payroll.bankAccount && (
                                    <p className="text-sm text-slate-500 mt-1">A/C: ****{payroll.bankAccount}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {isEditing ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Add any notes about this payroll..."
                            />
                        </div>
                    ) : payroll.notes && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-1">Notes:</p>
                            <p className="text-sm text-amber-700">{payroll.notes}</p>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 pt-4 border-t border-slate-200">
                        <div>
                            <p className="text-slate-500">Processed Date</p>
                            <p className="font-medium">{payroll.processedDate}</p>
                        </div>
                        {payroll.approvedDate && (
                            <div>
                                <p className="text-slate-500">Approved Date</p>
                                <p className="font-medium">{payroll.approvedDate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {!isEditing && (
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition font-medium"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollDetailsModal;
