import React, { useState } from 'react';
import { Users, UserPlus, Briefcase, Clock, CalendarCheck, Award, DollarSign, Search, Filter, Calendar, TrendingUp, FileText, Target, CheckSquare, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EnhancedAttendance from './components/EnhancedAttendance';
import PayrollDashboard from './components/PayrollDashboard';
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
        setEmployees,
        setLeaveRequests,
        setAttendance,
        setPayroll,
        setShifts,
        setBenefits,
        setJobPostings,
        setApplications,
        setOnboarding,
        setPerformanceReviews,
        setGoals,
        setSelfServiceRequests,
        setEmployeeDocuments
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
            emp.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
        return matchesSearch && matchesDept;
    }) || [];

    // Analytics calculations
    const totalPayrollCost = payroll?.reduce((sum, p) => sum + p.netSalary, 0) || 0;
    const avgSalary = payroll?.length > 0 ? totalPayrollCost / payroll.length : 0;
    const totalBenefitsCost = benefits?.reduce((sum, b) => sum + b.totalMonthlyValue, 0) || 0;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'staff', label: 'Staff Directory', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leave Management', icon: CalendarCheck },
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'shifts', label: 'Shifts', icon: Calendar },
        { id: 'benefits', label: 'Benefits', icon: Award },
        { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
        { id: 'onboarding', label: 'Onboarding', icon: CheckSquare },
        { id: 'performance', label: 'Performance', icon: Star },
        { id: 'selfservice', label: 'Self-Service', icon: FileText },
        { id: 'documents', label: 'Documents', icon: Briefcase },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Human Resources Management</h1>
                    <p className="text-slate-500">Comprehensive HRIS system - Staff, payroll, benefits, performance & analytics</p>
                </div>
                <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="btn btn-primary gap-2"
                >
                    <UserPlus size={20} />
                    Add Employee
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Staff</p>
                            <p className="text-2xl font-bold text-slate-800">{totalStaff}</p>
                            <p className="text-xs text-green-600">{activeStaff} active</p>
                        </div>
                        <Users className="text-blue-500" size={32} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Present Today</p>
                            <p className="text-2xl font-bold text-slate-800">{presentToday}</p>
                            <p className="text-xs text-slate-600">{((presentToday / totalStaff) * 100).toFixed(0)}% attendance</p>
                        </div>
                        <Clock className="text-green-500" size={32} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">On Leave</p>
                            <p className="text-2xl font-bold text-slate-800">{onLeave}</p>
                            <p className="text-xs text-yellow-600">{pendingLeave} pending</p>
                        </div>
                        <CalendarCheck className="text-orange-500" size={32} />
                    </div>
                </div>
                <div className="card p-4 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Open Positions</p>
                            <p className="text-2xl font-bold text-slate-800">{openPositions}</p>
                            <p className="text-xs text-blue-600">{totalApplications} applications</p>
                        </div>
                        <Briefcase className="text-purple-500" size={32} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 overflow-x-auto">
                <div className="flex space-x-4 min-w-max">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary font-medium'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pending Leave Requests */}
                            <div className="card">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Pending Leave Requests ({pendingLeave})</h3>
                                    <button className="text-xs text-primary font-medium hover:underline">View All</button>
                                </div>
                                <div className="p-4 space-y-3">
                                    {leaveRequests?.filter(l => l.status === 'Pending').slice(0, 5).map(leave => (
                                        <div key={leave.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg hover:shadow-sm transition">
                                            <div>
                                                <p className="font-medium text-slate-800">{leave.employeeName}</p>
                                                <p className="text-sm text-slate-600">{leave.leaveType} - {leave.days} days</p>
                                                <p className="text-xs text-slate-500">{leave.startDate} to {leave.endDate}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                                                    Approve
                                                </button>
                                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingLeave === 0 && (
                                        <p className="text-center text-slate-500 py-8">No pending leave requests</p>
                                    )}
                                </div>
                            </div>

                            {/* Department Overview */}
                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Departments ({departments?.length || 0})</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {departments?.slice(0, 6).map(dept => (
                                        <div key={dept.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:shadow-sm transition">
                                            <div>
                                                <p className="font-medium text-slate-800">{dept.name}</p>
                                                <p className="text-sm text-slate-600">{dept.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-primary">{dept.staffCount}</p>
                                                <p className="text-xs text-slate-500">Staff</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Quick Actions</h3>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left">
                                        <UserPlus className="text-blue-600 mb-2" size={24} />
                                        <p className="font-medium text-slate-800">Add Employee</p>
                                    </button>
                                    <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-left">
                                        <DollarSign className="text-green-600 mb-2" size={24} />
                                        <p className="font-medium text-slate-800">Process Payroll</p>
                                    </button>
                                    <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-left">
                                        <Briefcase className="text-purple-600 mb-2" size={24} />
                                        <p className="font-medium text-slate-800">Post Job</p>
                                    </button>
                                    <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-left">
                                        <Star className="text-orange-600 mb-2" size={24} />
                                        <p className="font-medium text-slate-800">Performance Review</p>
                                    </button>
                                </div>
                            </div>

                            {/* Alerts & Notifications */}
                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Alerts & Notifications</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {expiringDocs > 0 && (
                                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                                            <p className="text-sm font-medium text-red-800">{expiringDocs} certifications expiring soon</p>
                                        </div>
                                    )}
                                    {pendingSelfService > 0 && (
                                        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                                            <p className="text-sm font-medium text-yellow-800">{pendingSelfService} pending self-service requests</p>
                                        </div>
                                    )}
                                    {openPositions > 0 && (
                                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                                            <p className="text-sm font-medium text-blue-800">{openPositions} open positions with {totalApplications} applications</p>
                                        </div>
                                    )}
                                    {expiringDocs === 0 && pendingSelfService === 0 && openPositions === 0 && (
                                        <p className="text-center text-slate-500 py-8">No alerts at this time</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Staff Directory Tab */}
                {activeTab === 'staff' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">All Departments</option>
                                {departments?.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Department</th>
                                        <th className="px-6 py-3">Employment Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredEmployees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p>{emp.name}</p>
                                                        <p className="text-xs text-slate-500">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{emp.role}</td>
                                            <td className="px-6 py-4 text-slate-600">{emp.departmentName}</td>
                                            <td className="px-6 py-4 text-slate-600">{emp.employmentType}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setShowEmployeeProfileModal(true);
                                                    }}
                                                    className="text-primary font-medium text-xs hover:underline"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <EnhancedAttendance />
                )}



                {/* Payroll Tab */}
                {activeTab === 'payroll' && (
                    <PayrollDashboard />
                )}

                {/* Shifts Tab */}
                {activeTab === 'shifts' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Shift Schedule</h3>
                            <button className="btn btn-primary btn-sm gap-2">
                                <Calendar size={16} />
                                Assign Shift
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Shift Type</th>
                                        <th className="px-6 py-3">Start Time</th>
                                        <th className="px-6 py-3">End Time</th>
                                        <th className="px-6 py-3">Department</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {shifts?.map(shift => (
                                        <tr key={shift.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{shift.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-600">{shift.date}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${shift.shiftType === 'Day Shift' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {shift.shiftType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{shift.startTime}</td>
                                            <td className="px-6 py-4 text-slate-600">{shift.endTime}</td>
                                            <td className="px-6 py-4 text-slate-600">{departments?.find(d => d.id === shift.department)?.name || shift.department}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Benefits Tab */}
                {activeTab === 'benefits' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Employee Benefits</h3>
                            <button className="btn btn-primary btn-sm gap-2">
                                <Award size={16} />
                                Enroll Benefits
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Package</th>
                                        <th className="px-6 py-3">Health Insurance</th>
                                        <th className="px-6 py-3">Pension</th>
                                        <th className="px-6 py-3">Allowances</th>
                                        <th className="px-6 py-3">Total Monthly Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {benefits?.map(benefit => (
                                        <tr key={benefit.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{benefit.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-600">{benefit.package}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="text-slate-800">{benefit.healthInsurance.provider}</p>
                                                    <p className="text-xs text-slate-500">{benefit.healthInsurance.coverage} - UGX {benefit.healthInsurance.premium.toLocaleString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="text-slate-800">{benefit.pension.scheme}</p>
                                                    <p className="text-xs text-slate-500">{benefit.pension.employeeContribution}% employee, {benefit.pension.employerContribution}% employer</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {benefit.allowances.length} type(s)
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary">UGX {benefit.totalMonthlyValue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recruitment Tab */}
                {activeTab === 'recruitment' && (
                    <div className="space-y-6">
                        <div className="card">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Open Positions ({openPositions})</h3>
                                <button className="btn btn-primary btn-sm gap-2">
                                    <UserPlus size={16} />
                                    Post Job
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                {jobPostings?.filter(j => j.status === 'Open').map(job => (
                                    <div key={job.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{job.title}</h4>
                                                <p className="text-sm text-slate-600">{job.departmentName} • {job.type} • {job.location}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                {job.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{job.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm">
                                                <p className="text-slate-600">Salary: UGX {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500">Posted: {job.postedDate} • Closes: {job.closingDate}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                    {job.applicationsCount} Applications
                                                </span>
                                                <button className="btn btn-sm btn-outline">View Applications</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="p-4 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Recent Applications</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Candidate</th>
                                            <th className="px-6 py-3">Position</th>
                                            <th className="px-6 py-3">Experience</th>
                                            <th className="px-6 py-3">Applied Date</th>
                                            <th className="px-6 py-3">Stage</th>
                                            <th className="px-6 py-3">Rating</th>
                                            <th className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {applications?.map(app => (
                                            <tr key={app.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-800">{app.candidateName}</p>
                                                        <p className="text-xs text-slate-500">{app.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{app.jobTitle}</td>
                                                <td className="px-6 py-4 text-slate-600">{app.experience}</td>
                                                <td className="px-6 py-4 text-slate-600">{app.appliedDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                        {app.stage}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1">
                                                        {[...Array(app.rating)].map((_, i) => (
                                                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="text-primary font-medium text-xs hover:underline">
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onboarding Tab */}
                {activeTab === 'onboarding' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Onboarding Checklist</h3>
                            <button className="btn btn-primary btn-sm gap-2">
                                <CheckSquare size={16} />
                                New Onboarding
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {onboarding?.map(onboard => (
                                <div key={onboard.id} className="border border-slate-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{onboard.employeeName}</h4>
                                            <p className="text-sm text-slate-600">{onboard.position} • Started: {onboard.startDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 text-xs font-bold rounded ${onboard.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {onboard.status}
                                            </span>
                                            <p className="text-sm font-bold text-primary mt-1">{onboard.completionPercentage}% Complete</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {onboard.tasks.map(task => (
                                            <div key={task.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                                <div className="flex items-center gap-3">
                                                    <CheckSquare
                                                        size={18}
                                                        className={task.status === 'Completed' ? 'text-green-600 fill-green-600' : 'text-slate-400'}
                                                    />
                                                    <span className={`text-sm ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                                                        {task.task}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">{task.dueDate}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Performance Reviews</h3>
                                    <button className="btn btn-primary btn-sm gap-2">
                                        <Star size={16} />
                                        New Review
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    {performanceReviews?.map(review => (
                                        <div key={review.id} className="border border-slate-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{review.employeeName}</h4>
                                                    <p className="text-sm text-slate-600">{review.reviewPeriod}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary">{review.overallRating}</p>
                                                    <p className="text-xs text-slate-500">Overall Rating</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {Object.entries(review.ratings).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-sm">
                                                        <span className="text-slate-600 capitalize">{key}:</span>
                                                        <span className="font-medium text-slate-800">{value}/5</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="text-primary text-xs font-medium hover:underline">View Full Review</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Employee Goals</h3>
                                    <button className="btn btn-primary btn-sm gap-2">
                                        <Target size={16} />
                                        New Goal
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    {goals?.map(goal => (
                                        <div key={goal.id} className="border border-slate-200 rounded-lg p-4">
                                            <div className="mb-3">
                                                <h4 className="font-bold text-slate-800">{goal.title}</h4>
                                                <p className="text-sm text-slate-600">{goal.employeeName} • {goal.category}</p>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-600">Progress</span>
                                                    <span className="font-medium text-primary">{goal.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${goal.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Target: {goal.targetDate}</span>
                                                <span className={`px-2 py-1 rounded font-bold ${goal.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {goal.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Self-Service Tab */}
                {activeTab === 'selfservice' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Employee Self-Service Requests</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Request Type</th>
                                        <th className="px-6 py-3">Details</th>
                                        <th className="px-6 py-3">Request Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selfServiceRequests?.map(request => (
                                        <tr key={request.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{request.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-600">{request.type}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {request.type === 'Document Request' && (
                                                    <span>{request.documentType} - {request.purpose}</span>
                                                )}
                                                {request.type === 'Profile Update' && (
                                                    <span>{request.field}: {request.oldValue} → {request.newValue}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{request.requestDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.status === 'Pending' && (
                                                    <button className="text-primary font-medium text-xs hover:underline">
                                                        Review
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="card">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Employee Documents & Certifications</h3>
                            <button className="btn btn-primary btn-sm gap-2">
                                <FileText size={16} />
                                Add Document
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Document Type</th>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Issuer</th>
                                        <th className="px-6 py-3">Issue Date</th>
                                        <th className="px-6 py-3">Expiry Date</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employeeDocuments?.map(doc => (
                                        <tr key={doc.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{doc.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.type}</td>
                                            <td className="px-6 py-4 text-slate-800">{doc.title}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.issuer}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.issueDate}</td>
                                            <td className="px-6 py-4 text-slate-600">{doc.expiryDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${doc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card p-6 border-l-4 border-l-blue-500">
                                <p className="text-sm text-slate-500 mb-1">Total Payroll Cost (Monthly)</p>
                                <p className="text-3xl font-bold text-slate-800">UGX {totalPayrollCost.toLocaleString()}</p>
                                <p className="text-xs text-slate-600 mt-2">Average: UGX {avgSalary.toLocaleString()}</p>
                            </div>
                            <div className="card p-6 border-l-4 border-l-green-500">
                                <p className="text-sm text-slate-500 mb-1">Total Benefits Cost (Monthly)</p>
                                <p className="text-3xl font-bold text-slate-800">UGX {totalBenefitsCost.toLocaleString()}</p>
                                <p className="text-xs text-slate-600 mt-2">{benefits?.length || 0} employees enrolled</p>
                            </div>
                            <div className="card p-6 border-l-4 border-l-purple-500">
                                <p className="text-sm text-slate-500 mb-1">Avg. Performance Rating</p>
                                <p className="text-3xl font-bold text-slate-800">
                                    {performanceReviews?.length > 0
                                        ? (performanceReviews.reduce((sum, r) => sum + r.overallRating, 0) / performanceReviews.length).toFixed(1)
                                        : '0.0'}
                                </p>
                                <p className="text-xs text-slate-600 mt-2">{performanceReviews?.length || 0} reviews completed</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Department Distribution</h3>
                                </div>
                                <div className="p-4">
                                    {departments?.map(dept => {
                                        const percentage = (dept.staffCount / totalStaff) * 100;
                                        return (
                                            <div key={dept.id} className="mb-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-700">{dept.name}</span>
                                                    <span className="text-slate-600">{dept.staffCount} ({percentage.toFixed(0)}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Leave Statistics</h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-slate-600">Approved</p>
                                            <p className="text-2xl font-bold text-green-700">
                                                {leaveRequests?.filter(l => l.status === 'Approved').length || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <p className="text-sm text-slate-600">Pending</p>
                                            <p className="text-2xl font-bold text-yellow-700">
                                                {pendingLeave}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <p className="text-sm text-slate-600">Rejected</p>
                                            <p className="text-2xl font-bold text-red-700">
                                                {leaveRequests?.filter(l => l.status === 'Rejected').length || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-slate-600">Total Days</p>
                                            <p className="text-2xl font-bold text-blue-700">
                                                {leaveRequests?.reduce((sum, l) => sum + l.days, 0) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Recruitment Pipeline</h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                            <span className="text-slate-700">Open Positions</span>
                                            <span className="font-bold text-purple-700">{openPositions}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                            <span className="text-slate-700">Total Applications</span>
                                            <span className="font-bold text-blue-700">{totalApplications}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                            <span className="text-slate-700">Under Review</span>
                                            <span className="font-bold text-green-700">
                                                {applications?.filter(a => a.status === 'Under Review').length || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                            <span className="text-slate-700">Interview Scheduled</span>
                                            <span className="font-bold text-orange-700">
                                                {applications?.filter(a => a.status === 'Interview Scheduled').length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Goal Progress Overview</h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {goals?.map(goal => (
                                            <div key={goal.id}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-700">{goal.title.substring(0, 30)}...</span>
                                                    <span className="text-slate-600">{goal.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${goal.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddEmployeeModal && (
                <AddEmployeeModal
                    show={true}
                    employees={employees}
                    departments={departments}
                    onClose={() => setShowAddEmployeeModal(false)}
                    onAdd={handleAddEmployee}
                />
            )}

            {showEmployeeProfileModal && selectedEmployee && (
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
            )}
        </div>
    );
};

export default HRDashboard;
