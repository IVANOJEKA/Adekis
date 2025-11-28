import React, { useState } from 'react';
import { Calculator, FileText, CheckCircle, DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import ProcessPayrollModal from './ProcessPayrollModal';
import PayrollDetailsModal from './PayrollDetailsModal';
import ApprovePayrollModal from './ApprovePayrollModal';
import PayslipViewer from './PayslipViewer';
import PayrollReportsView from './PayrollReportsView';
import { formatPayrollPeriod, parsePayrollPeriodId } from '../../../utils/payrollIdUtils';

const PayrollDashboard = () => {
    const { payroll, setPayroll, employees } = useData();

    const [activeView, setActiveView] = useState('overview'); // overview, history, reports
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    // Check if payroll data has new structure
    const hasEnhancedData = payroll?.length > 0 && payroll[0]?.payrollPeriodId;

    // Calculate statistics
    const pendingPayrolls = payroll?.filter(p => p.payrollStatus === 'Pending' || p.status === 'Pending') || [];
    const approvedPayrolls = payroll?.filter(p => p.payrollStatus === 'Approved' || p.status === 'Approved') || [];
    const paidPayrolls = payroll?.filter(p => p.payrollStatus === 'Paid' || p.status === 'Paid') || [];

    // Group payrolls by period (only for new structure)
    const payrollsByPeriod = hasEnhancedData
        ? payroll.reduce((acc, p) => {
            if (p.payrollPeriodId) {
                if (!acc[p.payrollPeriodId]) {
                    acc[p.payrollPeriodId] = [];
                }
                acc[p.payrollPeriodId].push(p);
            }
            return acc;
        }, {})
        : {};

    const handleViewDetails = (payrollItem) => {
        if (!hasEnhancedData) {
            alert('Please process payroll using the new system to view details');
            return;
        }
        setSelectedPayroll(payrollItem);
        setShowDetailsModal(true);
    };

    const handleViewPayslip = (payrollItem) => {
        if (!hasEnhancedData) {
            alert('Please process payroll using the new system to view payslips');
            return;
        }
        setSelectedPayroll(payrollItem);
        setShowPayslipModal(true);
    };

    const handleApprove = (periodId) => {
        const periodPayrolls = payroll.filter(p => p.payrollPeriodId === periodId && p.payrollStatus === 'Pending');
        if (periodPayrolls.length > 0) {
            setSelectedPeriod(periodId);
            setShowApproveModal(true);
        }
    };

    const handleApprovalAction = (payrolls, approvalData) => {
        const updatedPayrolls = payrolls.map(p => ({
            ...p,
            payrollStatus: approvalData.status,
            approvedBy: approvalData.approvedBy,
            approvedDate: approvalData.approvedDate,
            notes: approvalData.comments ? `${p.notes}\n${approvalData.comments}`.trim() : p.notes
        }));

        setPayroll(prev => prev.map(p => {
            const updated = updatedPayrolls.find(u => u.id === p.id);
            return updated || p;
        }));
    };

    const handleUpdatePayroll = (id, updatedData) => {
        setPayroll(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
                    <p className="text-slate-600 mt-1">Process, approve, and manage employee payroll</p>
                </div>
                <button
                    onClick={() => setShowProcessModal(true)}
                    className="btn btn-primary gap-2"
                >
                    <Calculator size={20} />
                    Process Payroll
                </button>
            </div>

            {/* Migration Notice */}
            {!hasEnhancedData && payroll?.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>System Upgrade:</strong> Your payroll data needs to be migrated. Click "Process Payroll" to create new payroll records with the enhanced system.
                    </p>
                </div>
            )}

            {/* View Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'history', label: 'Payroll History', icon: FileText },
                    { id: 'reports', label: 'Reports', icon: DollarSign }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${activeView === tab.id
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}{" "}
            </div>

            {/* Overview Tab */}
            {activeView === 'overview' && (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card p-6 border-l-4 border-l-yellow-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-600">Pending Approval</p>
                                <AlertCircle className="text-yellow-600" size={24} />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{pendingPayrolls.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
                        </div>

                        <div className="card p-6 border-l-4 border-l-blue-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-600">Approved</p>
                                <CheckCircle className="text-blue-600" size={24} />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{approvedPayrolls.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Ready for payment</p>
                        </div>

                        <div className="card p-6 border-l-4 border-l-green-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-600">Paid</p>
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{paidPayrolls.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Completed</p>
                        </div>

                        <div className="card p-6 border-l-4 border-l-purple-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-600">Total Employees</p>
                                <Users className="text-purple-600" size={24} />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">
                                {employees?.filter(e => e.status === 'Active').length || 0}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Active staff</p>
                        </div>
                    </div>

                    {/* Recent Payroll Periods */}
                    {hasEnhancedData && (
                        <div className="card">
                            <div className="p-4 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Recent Payroll Periods</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {Object.keys(payrollsByPeriod).sort().reverse().slice(0, 5).map(periodId => {
                                    const periodPayrolls = payrollsByPeriod[periodId];
                                    const { month, year } = parsePayrollPeriodId(periodId);
                                    const periodDisplay = formatPayrollPeriod(month, year);
                                    const hasPending = periodPayrolls.some(p => p.payrollStatus === 'Pending');
                                    const totalNet = periodPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

                                    return (
                                        <div key={periodId} className="p-4 hover:bg-slate-50 transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="text-primary" size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{periodDisplay}</p>
                                                        <p className="text-sm text-slate-600">
                                                            {periodPayrolls.length} employees • UGX {totalNet.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 text-xs font-bold rounded ${hasPending ? 'bg-yellow-100 text-yellow-700' :
                                                            periodPayrolls[0]?.payrollStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {hasPending ? 'Pending' : periodPayrolls[0]?.payrollStatus}
                                                    </span>
                                                    {hasPending && (
                                                        <button
                                                            onClick={() => handleApprove(periodId)}
                                                            className="text-primary font-medium text-sm hover:underline"
                                                        >
                                                            Review
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {Object.keys(payrollsByPeriod).length === 0 && (
                                    <div className="p-8 text-center text-slate-500">
                                        <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                        <p>No payroll records yet</p>
                                        <button
                                            onClick={() => setShowProcessModal(true)}
                                            className="mt-3 text-primary font-medium hover:underline"
                                        >
                                            Process your first payroll
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!hasEnhancedData && (
                        <div className="card p-8 text-center">
                            <FileText size={48} className="mx-auto mb-3 opacity-50 text-slate-400" />
                            <p className="text-slate-600 mb-2">Upgrade to the new payroll system</p>
                            <p className="text-sm text-slate-500 mb-4">Process payroll with enhanced PAYE & NSSF calculations</p>
                            <button
                                onClick={() => setShowProcessModal(true)}
                                className="btn btn-primary mx-auto"
                            >
                                <Calculator size={18} />
                                Process Payroll Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeView === 'history' && hasEnhancedData && (
                <div className="card">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">All Payroll Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-slate-700 font-medium">Employee</th>
                                    <th className="px-6 py-3 text-left text-slate-700 font-medium">Period</th>
                                    <th className="px-6 py-3 text-left text-slate-700 font-medium">Department</th>
                                    <th className="px-6 py-3 text-right text-slate-700 font-medium">Gross</th>
                                    <th className="px-6 py-3 text-right text-slate-700 font-medium">Net</th>
                                    <th className="px-6 py-3 text-left text-slate-700 font-medium">Status</th>
                                    <th className="px-6 py-3 text-left text-slate-700 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payroll?.filter(p => p.payrollPeriodId).map(p => {
                                    const { month, year } = parsePayrollPeriodId(p.payrollPeriodId);
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{p.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-600">{formatPayrollPeriod(month, year)}</td>
                                            <td className="px-6 py-4 text-slate-600">{p.departmentName}</td>
                                            <td className="px-6 py-4 text-right">{(p.earnings?.grossSalary || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-medium">{(p.netSalary || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${p.payrollStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        p.payrollStatus === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                            p.payrollStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                                                    {p.payrollStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(p)}
                                                        className="text-primary font-medium text-xs hover:underline"
                                                    >
                                                        Details
                                                    </button>
                                                    {(p.payrollStatus === 'Paid' || p.payrollStatus === 'Approved') && (
                                                        <button
                                                            onClick={() => handleViewPayslip(p)}
                                                            className="text-green-600 font-medium text-xs hover:underline"
                                                        >
                                                            Payslip
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeView === 'history' && !hasEnhancedData && (
                <div className="card p-8 text-center">
                    <p className="text-slate-600">No payroll history available. Please process payroll to get started.</p>
                </div>
            )}

            {/* Reports Tab */}
            {activeView === 'reports' && hasEnhancedData && (
                <PayrollReportsView payrollData={payroll?.filter(p => p.payrollPeriodId) || []} employees={employees || []} />
            )}

            {activeView === 'reports' && !hasEnhancedData && (
                <div className="card p-8 text-center">
                    <p className="text-slate-600">No reports available. Please process payroll to generate reports.</p>
                </div>
            )}

            {/* Modals */}
            <ProcessPayrollModal
                show={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                onSuccess={(count) => {
                    alert(`Successfully processed payroll for ${count} employees`);
                }}
            />

            <PayrollDetailsModal
                show={showDetailsModal}
                payroll={selectedPayroll}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedPayroll(null);
                }}
                onUpdate={handleUpdatePayroll}
            />

            <ApprovePayrollModal
                show={showApproveModal}
                payrolls={selectedPeriod ? payroll.filter(p => p.payrollPeriodId === selectedPeriod && p.payrollStatus === 'Pending') : []}
                periodId={selectedPeriod}
                onClose={() => {
                    setShowApproveModal(false);
                    setSelectedPeriod(null);
                }}
                onApprove={handleApprovalAction}
                onReject={handleApprovalAction}
                currentUser={{ id: 'ADMIN' }}
            />

            <PayslipViewer
                show={showPayslipModal}
                payroll={selectedPayroll}
                onClose={() => {
                    setShowPayslipModal(false);
                    setSelectedPayroll(null);
                }}
            />
        </div>
    );
};

export default PayrollDashboard;
