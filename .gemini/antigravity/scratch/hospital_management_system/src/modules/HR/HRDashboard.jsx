import React, { useState } from 'react';
import { Users, UserPlus, Briefcase, Clock, CalendarCheck, Award, DollarSign, Search, Filter, Calendar, TrendingUp, FileText, Target, CheckSquare, Star, ChevronRight, Bell, Menu, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EnhancedAttendance from './components/EnhancedAttendance';
import PayrollDashboard from './components/PayrollDashboard';
import LeaveManagement from './components/LeaveManagement';
import ShiftManagement from './components/ShiftManagement';
import BenefitsManagement from './components/BenefitsManagement';
import PerformanceManagement from './components/PerformanceManagement';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeProfileModal from './components/EmployeeProfileModal';

const HRDashboard = () => {
    const {
        departments,
        employees,
        leaveRequests,
        attendance,
        payroll,
        shifts,
        benefits,
        jobPostings,
        applications,
        onboarding,
        performanceReviews,
        goals,
        selfServiceRequests,
        employeeDocuments,
        setEmployees
    } = useData();

    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Handlers
    const handleAddEmployee = (newEmployee) => {
        setEmployees([newEmployee, ...employees]);
        setShowAddEmployeeModal(false);
    };

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
        setSelectedEmployee(updatedEmployee);
    };

    const handleDeleteEmployee = (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter(emp => emp.id !== employeeId));
            setShowEmployeeProfileModal(false);
            setSelectedEmployee(null);
        }
    };

    // Calculate stats
    const totalStaff = employees?.length || 0;
    const activeStaff = employees?.filter(e => e.status === 'Active').length || 0;
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance?.filter(a => a.date === today && a.status === 'Present').length || 0;
    const onLeave = leaveRequests?.filter(l => l.status === 'Approved' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length || 0;
    const pendingLeave = leaveRequests?.filter(l => l.status === 'Pending').length || 0;
    const openPositions = jobPostings?.filter(j => j.status === 'Open').length || 0;
    const totalApplications = applications?.length || 0;
    const pendingSelfService = selfServiceRequests?.filter(r => r.status === 'Pending').length || 0;
    const expiringDocs = employeeDocuments?.filter(d => d.status === 'Expiring Soon').length || 0;

    // Filtered employees
    const filteredEmployees = employees?.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.departmentName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
        return matchesSearch && matchesDept;
    }) || [];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'staff', label: 'Staff Directory', icon: Users },
        { id: 'shifts', label: 'Roster & Shifts', icon: Calendar },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leave Manager', icon: CalendarCheck },
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
        { id: 'benefits', label: 'Benefits', icon: Award },
        { id: 'performance', label: 'Performance', icon: Star },
        { id: 'selfservice', label: 'Requests', icon: FileText },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Premium Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-2">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">HR Console</h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Orchestrate your workforce, manage talent, and optimize operations from a single command center.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 relative shadow-sm group">
                        <Bell size={20} className="group-hover:text-primary transition-colors" />
                        {(pendingLeave + pendingSelfService) > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setShowAddEmployeeModal(true)}
                        className="btn btn-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 rounded-xl px-6 py-3 font-semibold"
                    >
                        <UserPlus size={20} />
                        Add New Employee
                    </button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Workforce',
                        value: totalStaff,
                        sub: `${activeStaff} Active Now`,
                        icon: Users,
                        color: 'from-blue-500 to-indigo-600',
                        shadow: 'shadow-blue-500/20'
                    },
                    {
                        title: 'Present Today',
                        value: presentToday,
                        sub: `${totalStaff > 0 ? ((presentToday / totalStaff) * 100).toFixed(0) : 0}% Attendance`,
                        icon: Clock,
                        color: 'from-emerald-500 to-teal-600',
                        shadow: 'shadow-emerald-500/20'
                    },
                    {
                        title: 'On Leave',
                        value: onLeave,
                        sub: `${pendingLeave} Pending Requests`,
                        icon: CalendarCheck,
                        color: 'from-amber-500 to-orange-600',
                        shadow: 'shadow-amber-500/20'
                    },
                    {
                        title: 'Open Positions',
                        value: openPositions,
                        sub: `${totalApplications} Applications`,
                        icon: Briefcase,
                        color: 'from-purple-500 to-violet-600',
                        shadow: 'shadow-purple-500/20'
                    }
                ].map((stat, idx) => (
                    <div key={idx} className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${stat.shadow} bg-gradient-to-br ${stat.color} group hover:-translate-y-1 transition-transform duration-300`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                            <stat.icon size={120} />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <div className="p-2 bg-white/10 w-fit rounded-lg backdrop-blur-sm">
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-white/80 font-medium text-sm">{stat.title}</p>
                                <h3 className="text-4xl font-bold tracking-tight">{stat.value}</h3>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-md">
                                {stat.sub}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modern Pill Navigation */}
            <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-4 -mx-2 px-2">
                <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 overflow-x-auto custom-scrollbar">
                    <div className="flex space-x-1 min-w-max">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-300' : ''} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[500px] animate-in slide-in-from-bottom-2 fade-in duration-300">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Feed */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Alert Banner */}
                            {(expiringDocs > 0 || pendingSelfService > 0) && (
                                <div className="bg-gradient-to-r from-orange-50 via-white to-red-50 border border-orange-100 rounded-3xl p-6 shadow-sm flex gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100 text-orange-500 h-fit z-10">
                                        <Bell size={24} />
                                    </div>
                                    <div className="z-10">
                                        <h4 className="font-bold text-slate-800 text-lg">Attention Needed</h4>
                                        <p className="text-slate-500 text-sm mb-3">Some items require your immediate attention.</p>
                                        <div className="flex gap-3 flex-wrap">
                                            {expiringDocs > 0 && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                                                    {expiringDocs} Docs Expiring
                                                </span>
                                            )}
                                            {pendingSelfService > 0 && (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                                                    {pendingSelfService} Requests Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <section>
                                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                    <Target className="text-primary" size={20} />
                                    Quick Shortcuts
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'New Hire', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100', action: () => setShowAddEmployeeModal(true) },
                                        { label: 'Run Payroll', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100', action: () => setActiveTab('payroll') },
                                        { label: 'Schedule', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', hover: 'hover:bg-purple-100', action: () => setActiveTab('shifts') },
                                        { label: 'Approve Leave', icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:bg-amber-100', action: () => setActiveTab('leave') },
                                    ].map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={action.action}
                                            className={`${action.bg} ${action.hover} p-6 rounded-3xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-slate-200`}
                                        >
                                            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                <action.icon className={action.color} size={24} />
                                            </div>
                                            <span className="font-semibold text-slate-700">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Department Overview */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        <Briefcase className="text-primary" size={20} />
                                        Department Status
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {departments?.slice(0, 6).map(dept => (
                                        <div key={dept.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-700 group-hover:text-primary transition-colors">{dept.name}</h4>
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{dept.type}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-2xl font-black text-slate-800">{dept.staffCount}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Staff</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Pending Requests Widget */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Clock className="text-orange-500" size={20} />
                                        Need Approval
                                    </h3>
                                    <button onClick={() => setActiveTab('leave')} className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20 transition">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {leaveRequests?.filter(l => l.status === 'Pending').slice(0, 5).map(leave => (
                                        <div key={leave.id} className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-inner">
                                                {leave.employeeName.charAt(0)}
                                            </div>
                                            <div className="grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-800 text-sm truncate">{leave.employeeName}</h4>
                                                    <span className="text-[10px] font-bold text-slate-400">{leave.days}d</span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{leave.leaveType} Leave</p>
                                                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100">Approve</button>
                                                    <button className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Reject</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingLeave === 0 && (
                                        <div className="text-center py-12 px-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3">
                                                <CheckSquare size={32} className="text-green-500" />
                                            </div>
                                            <p className="text-slate-600 font-medium">All Caught Up!</p>
                                            <p className="text-xs text-slate-400 mt-1">No pending leave requests</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Staff Directory Tab */}
                {activeTab === 'staff' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        {/* Search & Filter Bar */}
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search employees by name, role, or department..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm text-sm outline-none cursor-pointer hover:border-slate-300"
                                >
                                    <option value="all">All Departments</option>
                                    {departments?.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Staff Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-xl">Employee Details</th>
                                        <th className="px-6 py-4">Department & Role</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredEmployees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-base">{emp.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-700">{emp.departmentName}</span>
                                                    <span className="text-xs text-slate-500">{emp.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                                    {emp.employmentType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${emp.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setShowEmployeeProfileModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recruitment Tab (Modernized Grid) */}
                {activeTab === 'recruitment' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800">Open Positions</h3>
                            <button className="btn btn-primary gap-2 rounded-xl px-5">
                                <Plus size={18} />
                                Post New Job
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {jobPostings?.filter(j => j.status === 'Open').map(job => (
                                <div key={job.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Briefcase size={80} />
                                    </div>
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="p-3 bg-blue-50 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                                            <Briefcase size={24} />
                                        </div>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Active</span>
                                    </div>
                                    <div className="relative z-10 mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                                        <p className="text-sm font-medium text-slate-500">{job.departmentName}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                            <Users size={14} />
                                            {job.applicationsCount} Apps
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                            <DollarSign size={14} />
                                            {job.salary.min.toLocaleString()}k+
                                        </span>
                                    </div>
                                    <div className="relative z-10 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted 2d ago</span>
                                        <button className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                                            View Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {/* Add New Job Card */}
                            <button className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-primary hover:border-primary hover:bg-blue-50/50 transition-all min-h-[250px] group">
                                <div className="p-4 bg-slate-100 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
                                    <Plus size={32} />
                                </div>
                                <span className="font-bold">Create New Job Posting</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Integrated Modules */}
                {activeTab === 'shifts' && <ShiftManagement />}
                {activeTab === 'leave' && <LeaveManagement />}
                {activeTab === 'payroll' && <PayrollDashboard />}
                {activeTab === 'attendance' && <EnhancedAttendance />}
                {activeTab === 'benefits' && <BenefitsManagement />}
                {activeTab === 'performance' && <PerformanceManagement />}

                {/* Fallback for others */}
                {['selfservice', 'onboarding'].includes(activeTab) && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={40} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Enhancement in Progress</h2>
                        <p className="text-slate-500 max-w-md mx-auto">This module is currently being upgraded to the new premium design standard. Functionality remains accessible via quick actions.</p>
                        <button onClick={() => setActiveTab('overview')} className="mt-8 btn btn-outline rounded-xl">
                            Return to Overview
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {
                showAddEmployeeModal && (
                    <AddEmployeeModal
                        show={true}
                        employees={employees}
                        departments={departments}
                        onClose={() => setShowAddEmployeeModal(false)}
                        onAdd={handleAddEmployee}
                    />
                )
            }

            {
                showEmployeeProfileModal && selectedEmployee && (
                    <EmployeeProfileModal
                        show={true}
                        employee={selectedEmployee}
                        departments={departments}
                        onClose={() => {
                            setShowEmployeeProfileModal(false);
                            setSelectedEmployee(null);
                        }}
                        onUpdate={handleUpdateEmployee}
                        onDelete={handleDeleteEmployee}
                    />
                )
            }
        </div>
    );
};

export default HRDashboard;
