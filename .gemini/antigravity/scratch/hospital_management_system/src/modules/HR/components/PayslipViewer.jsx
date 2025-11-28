import React, { useRef } from 'react';
import { X, Printer, Download, Send } from 'lucide-react';
import { formatPayrollPeriod, parsePayrollPeriodId } from '../../../utils/payrollIdUtils';

const PayslipViewer = ({ show, payroll, onClose, hospitalName = 'General Hospital' }) => {
    const printRef = useRef();

    if (!show || !payroll) return null;

    const { month, year } = parsePayrollPeriodId(payroll.payrollPeriodId);
    const periodDisplay = formatPayrollPeriod(month, year);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real implementation, this would generate a PDF
        alert('PDF download functionality would be implemented here using jsPDF library');
    };

    const handleEmail = () => {
        // In a real implementation, this would send email
        alert(`Payslip would be emailed to employee at their registered email address`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Action Bar */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
                    <h2 className="text-lg font-bold text-slate-800">Payslip Preview</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                            title="Print Payslip"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                            title="Download PDF"
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button
                            onClick={handleEmail}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm"
                            title="Email to Employee"
                        >
                            <Send size={16} />
                            Email
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Payslip Content */}
                <div ref={printRef} className="p-8 bg-white print:p-0">
                    {/* Header */}
                    <div className="border-b-4 border-primary pb-4 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-primary">{hospitalName}</h1>
                                <p className="text-slate-600 mt-1">Kampala, Uganda</p>
                                <p className="text-slate-600">Tel: +256-xxx-xxx-xxx</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-slate-800">PAYSLIP</h2>
                                <p className="text-slate-600 mt-1">{periodDisplay}</p>
                            </div>
                        </div>
                    </div>

                    {/* Employee Details */}
                    <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3">EMPLOYEE INFORMATION</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Employee ID:</span>
                                    <span className="font-medium text-slate-800">{payroll.employeeId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Name:</span>
                                    <span className="font-medium text-slate-800">{payroll.employeeName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Department:</span>
                                    <span className="font-medium text-slate-800">{payroll.departmentName}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3">PAYROLL INFORMATION</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Payroll ID:</span>
                                    <span className="font-medium text-slate-800">{payroll.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Period:</span>
                                    <span className="font-medium text-slate-800">{periodDisplay}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Payment Date:</span>
                                    <span className="font-medium text-slate-800">{payroll.paidDate || 'Pending'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Days Worked:</span>
                                    <span className="font-medium text-slate-800">{payroll.daysWorked}/22</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Earnings & Deductions */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Earnings */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b-2 border-green-500">
                                EARNINGS
                            </h3>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="py-2 text-slate-700">Basic Salary</td>
                                        <td className="py-2 text-right font-medium text-slate-800">
                                            {(payroll.earnings?.basicSalary || 0).toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* Allowances */}
                                    {payroll.earnings?.allowances && Object.entries(payroll.earnings.allowances).map(([key, value]) => {
                                        if (key === 'total' || !value) return null;
                                        return (
                                            <tr key={key}>
                                                <td className="py-2 text-slate-600 pl-4">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)} Allowance
                                                </td>
                                                <td className="py-2 text-right text-green-600">
                                                    {(value || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Bonuses */}
                                    {payroll.earnings?.bonuses?.total > 0 && (
                                        <tr>
                                            <td className="py-2 text-slate-600 pl-4">Bonuses</td>
                                            <td className="py-2 text-right text-green-600">
                                                {(payroll.earnings.bonuses.total || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Overtime */}
                                    {payroll.earnings?.overtime?.total > 0 && (
                                        <tr>
                                            <td className="py-2 text-slate-600 pl-4">
                                                Overtime ({payroll.earnings.overtime.hours} hrs)
                                            </td>
                                            <td className="py-2 text-right text-green-600">
                                                {(payroll.earnings.overtime.total || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="border-t-2 border-green-500">
                                        <td className="py-2 font-bold text-slate-800">Gross Salary</td>
                                        <td className="py-2 text-right font-bold text-green-700">
                                            {(payroll.earnings?.grossSalary || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Deductions */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b-2 border-red-500">
                                DEDUCTIONS
                            </h3>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="py-2 text-slate-700" colSpan="2">
                                            <strong>Statutory Deductions</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-slate-600 pl-4">PAYE Tax</td>
                                        <td className="py-2 text-right text-red-600">
                                            {(payroll.deductions?.statutory?.paye || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-slate-600 pl-4">NSSF</td>
                                        <td className="py-2 text-right text-red-600">
                                            {(payroll.deductions?.statutory?.nssf || 0).toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* Other Deductions */}
                                    {payroll.deductions?.other?.total > 0 && (
                                        <>
                                            <tr>
                                                <td className="py-2 text-slate-700" colSpan="2">
                                                    <strong>Other Deductions</strong>
                                                </td>
                                            </tr>
                                            {Object.entries(payroll.deductions.other).map(([key, value]) => {
                                                if (key === 'total' || !value) return null;
                                                return (
                                                    <tr key={key}>
                                                        <td className="py-2 text-slate-600 pl-4">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </td>
                                                        <td className="py-2 text-right text-red-600">
                                                            {(value || 0).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    )}

                                    <tr className="border-t-2 border-red-500">
                                        <td className="py-2 font-bold text-slate-800">Total Deductions</td>
                                        <td className="py-2 text-right font-bold text-red-700">
                                            {(payroll.deductions?.totalDeductions || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Net Salary */}
                    <div className="p-6 bg-primary/10 border-2 border-primary rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">NET SALARY PAYABLE</p>
                                <p className="text-4xl font-bold text-primary">
                                    UGX {(payroll.netSalary || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-600">Payment Method</p>
                                <p className="font-bold text-slate-800">{payroll.paymentMethod}</p>
                                {payroll.bankAccount && (
                                    <p className="text-sm text-slate-500 mt-1">Account: ****{payroll.bankAccount}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {payroll.notes && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                            <p className="text-sm font-bold text-amber-800 mb-1">Notes:</p>
                            <p className="text-sm text-amber-700">{payroll.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-200">
                        <div className="text-xs text-slate-500 space-y-1">
                            <p>This is a computer-generated payslip and does not require a signature.</p>
                            <p>For any queries regarding this payslip, please contact the HR Department.</p>
                            <p className="mt-3">© {year} {hospitalName}. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    ${printRef.current ? `
                    #${printRef.current.id}, 
                    #${printRef.current.id} * {
                        visibility: visible;
                    }
                    ` : ''}
                    .fixed {
                        position: relative;
                    }
                    .bg-black\\/50 {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
};

export default PayslipViewer;
