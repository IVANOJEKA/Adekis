import React, { useState } from 'react';
import { CalendarCheck, CheckCircle, XCircle, Clock, Filter, Plus, User } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const LeaveManagement = () => {
    const { leaveRequests, setLeaveRequests, employees, createLeaveRequest, updateLeaveRequestStatus } = useData();
    const [filterStatus, setFilterStatus] = useState('All');
    const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);

    // Filter logic
    const filteredRequests = leaveRequests?.filter(req =>
        filterStatus === 'All' ? true : req.status === filterStatus
    ) || [];

    // Stats
    const pendingCount = leaveRequests?.filter(r => r.status === 'Pending').length || 0;
    const approvedCount = leaveRequests?.filter(r => r.status === 'Approved').length || 0;
    const rejectedCount = leaveRequests?.filter(r => r.status === 'Rejected').length || 0;
    const todayOnLeave = leaveRequests?.filter(r =>
        r.status === 'Approved' &&
        new Date(r.startDate) <= new Date() &&
        new Date(r.endDate) >= new Date()
    ).length || 0;

    const handleStatusUpdate = async (id, status) => {
        if (updateLeaveRequestStatus) {
            // Use API if available
            await updateLeaveRequestStatus(id, status, 'Admin User'); // Hardcoded admin for now
        } else {
            // Fallback to local state update if API function missing
            setLeaveRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status, approvedBy: 'Admin User', approvedDate: new Date().toISOString().split('T')[0] } : req
            ));
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Total Pending</p>
                            <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
                        </div>
                        <Clock className="text-blue-500" size={24} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Approved (YTD)</p>
                            <p className="text-2xl font-bold text-slate-800">{approvedCount}</p>
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Currently on Leave</p>
                            <p className="text-2xl font-bold text-slate-800">{todayOnLeave}</p>
                        </div>
                        <CalendarCheck className="text-orange-500" size={24} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Rejected</p>
                            <p className="text-2xl font-bold text-slate-800">{rejectedCount}</p>
                        </div>
                        <XCircle className="text-red-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="card">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-slate-800">Leave Requests</h3>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterStatus === status
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        {/* 
                        <button 
                            onClick={() => setShowNewLeaveModal(true)}
                            className="btn btn-primary btn-sm gap-2"
                        >
                            <Plus size={16} />
                            New Request
                        </button>
                        */}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Duration</th>
                                <th className="px-6 py-3">Dates</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{req.employeeName}</p>
                                                    <p className="text-xs text-slate-500">ID: {req.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{req.leaveType}</td>
                                        <td className="px-6 py-4 text-slate-600">{req.days} days</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex flex-col text-xs">
                                                <span>From: {req.startDate}</span>
                                                <span>To: {req.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'Approved')}
                                                        className="p-1 hover:bg-green-100 text-green-600 rounded"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                                                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        No leave requests found matching your filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
