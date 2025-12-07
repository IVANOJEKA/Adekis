import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter, ChevronLeft, ChevronRight, Plus, Users, Search } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const ShiftManagement = () => {
    const { shifts, setShifts, employees, departments } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
    const [filterDept, setFilterDept] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);

    // Helper to get week days
    const getWeekDays = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay() + 1); // Start on Monday
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);

    // Navigation
    const nextPeriod = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (viewMode === 'week' ? 7 : 1));
        setCurrentDate(newDate);
    };

    const prevPeriod = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - (viewMode === 'week' ? 7 : 1));
        setCurrentDate(newDate);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Filter Logic
    const filteredEmployees = employees?.filter(emp => {
        const matchesDept = filterDept === 'all' || emp.department === filterDept;
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
    }) || [];

    // Shift Logic relative to view
    const getShiftsForEmployeeAndDate = (empId, date) => {
        const dateStr = date.toISOString().split('T')[0];
        return shifts?.filter(s => s.employeeId === empId && s.date === dateStr) || [];
    };

    // Live Status Logic
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    const activeShifts = shifts?.filter(s => {
        return s.date === todayStr && s.startTime <= currentTimeStr && (s.endTime >= currentTimeStr || s.endTime === null);
    }) || [];

    const upcomingShifts = shifts?.filter(s => {
        return s.date === todayStr && s.startTime > currentTimeStr;
    }) || [];

    // Modal State
    const [newShift, setNewShift] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        shiftType: 'Day Shift',
        startTime: '08:00',
        endTime: '17:00'
    });

    const handleAssignShift = (e) => {
        e.preventDefault();
        const employee = employees.find(emp => emp.id === newShift.employeeId);
        const shiftData = {
            id: `SH-${Date.now()}`,
            ...newShift,
            employeeName: employee?.name || 'Unknown',
            department: employee?.department || 'Unknown'
        };

        setShifts(prev => [...prev, shiftData]);
        setShowAssignModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Live Dashboard Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4 border-l-4 border-l-blue-500 bg-blue-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Now</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-slate-800">{activeShifts.length}</p>
                                <span className="text-xs text-blue-600 animate-pulse">● Live</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Staff currently on floor</p>
                        </div>
                        <Users className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="card p-4 border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Upcoming (Today)</p>
                            <p className="text-2xl font-bold text-slate-800">{upcomingShifts.length}</p>
                            <p className="text-xs text-slate-500 mt-1">Next shift starts soon</p>
                        </div>
                        <Clock className="text-purple-500" size={24} />
                    </div>
                </div>

                <div className="card p-4 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Coverage</p>
                            <p className="text-2xl font-bold text-slate-800">92%</p>
                            <p className="text-xs text-slate-500 mt-1">Weekly roster fill rate</p>
                        </div>
                        <Calendar className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="card p-4 border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Open Shifts</p>
                            <p className="text-2xl font-bold text-slate-800">4</p>
                            <p className="text-xs text-slate-500 mt-1">Needs assignment</p>
                        </div>
                        <User className="text-orange-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Roster Controls */}
            <div className="card">
                <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={prevPeriod}
                                className="p-1 hover:bg-white rounded shadow-sm transition"
                            >
                                <ChevronLeft size={20} className="text-slate-600" />
                            </button>
                            <div className="px-4 font-medium text-slate-800 min-w-[150px] text-center">
                                {viewMode === 'week' ? (
                                    `${weekDays[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                                ) : (
                                    currentDate.toLocaleDateString('en-GB', { dateStyle: 'full' })
                                )}
                            </div>
                            <button
                                onClick={nextPeriod}
                                className="p-1 hover:bg-white rounded shadow-sm transition"
                            >
                                <ChevronRight size={20} className="text-slate-600" />
                            </button>
                        </div>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="text-primary text-sm font-medium hover:underline"
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Depts</option>
                            {departments?.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="btn btn-primary btn-sm gap-2 whitespace-nowrap"
                        >
                            <Plus size={16} />
                            Assign Shift
                        </button>
                    </div>
                </div>

                {/* Roster Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-left font-semibold text-slate-700 w-64 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">Employee</th>
                                {weekDays.map(day => (
                                    <th key={day.toISOString()} className={`p-3 text-center min-w-[120px] border-r border-slate-100 ${isToday(day) ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-500 uppercase font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            <span className={`text-lg font-bold ${isToday(day) ? 'text-primary' : 'text-slate-700'}`}>
                                                {day.getDate()}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 border-r border-slate-200 sticky left-0 bg-white z-10 group-hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-200">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{emp.name}</p>
                                                <p className="text-xs text-slate-500">{emp.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {weekDays.map(day => {
                                        const dayShifts = getShiftsForEmployeeAndDate(emp.id, day);
                                        const isCurrentDay = isToday(day);
                                        return (
                                            <td key={day.toISOString()} className={`p-2 border-r border-slate-100 relative ${isCurrentDay ? 'bg-blue-50/30' : ''}`}>
                                                <div className="min-h-[60px] flex flex-col gap-1">
                                                    {dayShifts.map(shift => (
                                                        <div
                                                            key={shift.id}
                                                            className={`p-2 rounded text-xs border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${shift.shiftType === 'Day Shift'
                                                                    ? 'bg-blue-100 border-l-blue-500 text-blue-800'
                                                                    : shift.shiftType === 'Night Shift'
                                                                        ? 'bg-purple-100 border-l-purple-500 text-purple-800'
                                                                        : 'bg-orange-100 border-l-orange-500 text-orange-800'
                                                                }`}
                                                        >
                                                            <div className="font-bold flex justify-between">
                                                                <span>{shift.startTime} - {shift.endTime}</span>
                                                            </div>
                                                            <div className="mt-1 opacity-90 truncate">{shift.shiftType}</div>
                                                            <div className="mt-0.5 text-[10px] uppercase tracking-wide opacity-75">{departments?.find(d => d.id === shift.department)?.name}</div>
                                                        </div>
                                                    ))}
                                                    {dayShifts.length === 0 && (
                                                        <button
                                                            className="w-full h-full min-h-[50px] opacity-0 hover:opacity-100 flex items-center justify-center text-slate-300 hover:text-slate-400 transition-all border-2 border-dashed border-transparent hover:border-slate-200 rounded"
                                                            onClick={() => {
                                                                setNewShift(prev => ({
                                                                    ...prev,
                                                                    employeeId: emp.id,
                                                                    date: day.toISOString().split('T')[0]
                                                                }));
                                                                setShowAssignModal(true);
                                                            }}
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Shift Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Assign Shift</h3>
                            <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAssignShift} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                                <select
                                    required
                                    value={newShift.employeeId}
                                    onChange={(e) => setNewShift({ ...newShift, employeeId: e.target.value })}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">Select Employee</option>
                                    {filteredEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newShift.date}
                                    onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Shift Type</label>
                                <select
                                    value={newShift.shiftType}
                                    onChange={(e) => setNewShift({ ...newShift, shiftType: e.target.value })}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="Day Shift">Day Shift (08:00 - 17:00)</option>
                                    <option value="Night Shift">Night Shift (20:00 - 08:00)</option>
                                    <option value="Evening Shift">Evening Shift (16:00 - 00:00)</option>
                                    <option value="On Call">On Call</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={newShift.startTime}
                                        onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={newShift.endTime}
                                        onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30"
                                >
                                    Assign Shift
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftManagement;
