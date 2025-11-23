import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
    Users, Clock, AlertCircle, UserPlus, Play, CheckCircle, XCircle, ArrowRight,
    Monitor, Filter, TrendingUp, Phone, Search, Calendar, Activity
} from 'lucide-react';

const QueueDashboard = () => {
    const { queueEntries, setQueueEntries, patients, setPatients } = useData();
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showQueueDisplay, setShowQueueDisplay] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Waiting'); // Waiting, InService, All

    const departments = ['All', 'Doctor', 'Pharmacy', 'Laboratory', 'Radiology', 'Billing', 'Triage'];

    // Filter queue by department and status
    const filteredQueue = queueEntries.filter(entry => {
        const deptMatch = selectedDepartment === 'All' || entry.department === selectedDepartment;
        const statusMatch = selectedFilter === 'All' || entry.status === selectedFilter;
        return deptMatch && statusMatch && entry.status !== 'Completed small' && entry.status !== 'Cancelled';
    });

    // Calculate wait times
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedEntries = queueEntries.map(entry => {
                if (entry.status === 'Waiting' || entry.status === 'Called') {
                    const checkIn = new Date(entry.checkInTime);
                    const now = new Date();
                    const waitMinutes = Math.floor((now - checkIn) / 60000);
                    return { ...entry, waitTime: waitMinutes };
                }
                return entry;
            });
            if (JSON.stringify(updatedEntries) !== JSON.stringify(queueEntries)) {
                setQueueEntries(updatedEntries);
            }
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [queueEntries, setQueueEntries]);

    // Queue statistics
    const stats = {
        total: filteredQueue.length,
        waiting: filteredQueue.filter(e => e.status === 'Waiting').length,
        inService: filteredQueue.filter(e => e.status === 'InService').length,
        avgWaitTime: filteredQueue.reduce((sum, e) => sum + e.waitTime, 0) / (filteredQueue.length || 1)
    };

    // Auto-generate queue number
    const generateQueueNumber = (department) => {
        const prefix = department.charAt(0).toUpperCase();
        const deptQueue = queueEntries.filter(e => e.department === department);
        const nextNum = deptQueue.length + 1;
        return `${prefix}-${String(nextNum).padStart(3, '0')}`;
    };

    // Check-in new patient
    const handleCheckIn = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newEntry = {
            id: `Q-${Date.now()}`,
            queueNumber: generateQueueNumber(formData.get('department')),
            patientId: formData.get('patientId'),
            patientName: formData.get('patientName'),
            department: formData.get('department'),
            service: formData.get('service'),
            priority: formData.get('priority'),
            status: 'Waiting',
            checkInTime: new Date().toISOString(),
            calledTime: null,
            serviceStartTime: null,
            serviceEndTime: null,
            waitTime: 0,
            estimatedWait: parseInt(formData.get('priority')) === 'Emergency' ? 0 : 15,
            assignedStaff: null,
            notes: formData.get('notes') || '',
            transferredFrom: null
        };

        setQueueEntries([...queueEntries, newEntry]);
        setShowCheckInModal(false);
    };

    // Call next patient
    const handleCallNext = (department) => {
        const waitingQueue = queueEntries
            .filter(e => e.department === department && e.status === 'Waiting')
            .sort((a, b) => {
                // Priority order: Emergency > Urgent > Normal
                const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Normal': 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                // If same priority, sort by check-in time
                return new Date(a.checkInTime) - new Date(b.checkInTime);
            });

        if (waitingQueue.length > 0) {
            const nextPatient = waitingQueue[0];
            const updatedEntries = queueEntries.map(entry =>
                entry.id === nextPatient.id
                    ? { ...entry, status: 'Called', calledTime: new Date().toISOString() }
                    : entry
            );
            setQueueEntries(updatedEntries);
        }
    };

    // Start service
    const handleStartService = (entryId) => {
        const updatedEntries = queueEntries.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'InService', serviceStartTime: new Date().toISOString() }
                : entry
        );
        setQueueEntries(updatedEntries);
    };

    // Complete service
    const handleCompleteService = (entryId) => {
        const updatedEntries = queueEntries.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Completed', serviceEndTime: new Date().toISOString() }
                : entry
        );
        setQueueEntries(updatedEntries);
    };

    // Cancel/Skip
    const handleCancel = (entryId) => {
        const updatedEntries = queueEntries.map(entry =>
            entry.id === entryId
                ? { ...entry, status: 'Cancelled' }
                : entry
        );
        setQueueEntries(updatedEntries);
    };

    // Get queue for specific department
    const getDepartmentQueue = (dept) => {
        return queueEntries
            .filter(e => e.department === dept && (e.status === 'Waiting' || e.status === 'Called' || e.status === 'InService'))
            .sort((a, b) => new Date(a.checkInTime) - new Date(b.checkInTime));
    };

    // Get current serving
    const getCurrentServing = (dept) => {
        return queueEntries.find(e => e.department === dept && e.status === 'InService');
    };

    // Get next in queue
    const getNextInQueue = (dept) => {
        const waiting = queueEntries
            .filter(e => e.department === dept && (e.status === 'Waiting' || e.status === 'Called'))
            .sort((a, b) => {
                const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Normal': 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(a.checkInTime) - new Date(b.checkInTime);
            });
        return waiting[0] || null;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Emergency': return 'text-red-600 bg-red-50';
            case 'Urgent': return 'text-orange-600 bg-orange-50';
            default: return 'text-green-600 bg-green-50';
        }
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'Emergency') return '🔴';
        if (priority === 'Urgent') return '🟠';
        return '🟢';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Queue Management</h1>
                    <p className="text-slate-500">Monitor and control patient flow across departments</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowQueueDisplay(!showQueueDisplay)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 gap-2">
                        <Monitor size={20} />
                        {showQueueDisplay ? 'Hide' : 'Show'} Display
                    </button>
                    <button onClick={() => setShowCheckInModal(true)} className="btn btn-primary gap-2">
                        <UserPlus size={20} />
                        Check-In Patient
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Total in Queue</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Waiting</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.waiting}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <Clock size={24} className="text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">In Service</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.inService}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Activity size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Avg Wait Time</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{Math.round(stats.avgWaitTime)} min</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <TrendingUp size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {departments.map(dept => (
                    <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDepartment === dept
                                ? 'bg-primary text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {dept}
                    </button>
                ))}
            </div>

            {/* Department Queue Cards */}
            {selectedDepartment === 'All' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {departments.filter(d => d !== 'All').map(dept => {
                        const deptQueue = getDepartmentQueue(dept);
                        const currentServing = getCurrentServing(dept);
                        const nextPatient = getNextInQueue(dept);

                        return (
                            <div key={dept} className="card p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{dept}</h3>
                                        <p className="text-sm text-slate-500">Department Queue</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        <Users size={16} />
                                        <span>{deptQueue.length} Waiting</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Serving Now</p>
                                        <p className="text-4xl font-bold text-primary">
                                            {currentServing ? currentServing.queueNumber : '--'}
                                        </p>
                                        {currentServing && (
                                            <p className="text-xs text-slate-600 mt-1">{current Serving.patientName}</p>
                                        )}
                                    </div>
                                    <ArrowRight size={24} className="text-slate-300" />
                                    <div className="text-center opacity-50">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Next</p>
                                        <p className="text-2xl font-bold text-slate-700">
                                            {nextPatient ? nextPatient.queueNumber : '--'}
                                        </p>
                                        {nextPatient && (
                                            <p className="text-xs text-slate-600 mt-1">{nextPatient.patientName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleCallNext(dept)}
                                        disabled={!nextPatient}
                                        className="flex-1 btn btn-primary gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Play size={18} />
                                        Call Next
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Detailed view for selected department
                <div className="card p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">{selectedDepartment} Queue</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Queue #</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Wait Time</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredQueue.length > 0 ? (
                                    filteredQueue.map(entry => (
                                        <tr key={entry.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-bold text-primary">{entry.queueNumber}</td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-medium text-slate-800">{entry.patientName}</div>
                                                    <div className="text-xs text-slate-500">{entry.patientId}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{entry.service}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                                                    {getPriorityIcon(entry.priority)} {entry.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{entry.waitTime} min</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' :
                                                        entry.status === 'Called' ? 'bg-blue-100 text-blue-700' :
                                                            entry.status === 'InService' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {entry.status === 'Waiting' && (
                                                        <button
                                                            onClick={() => handleStartService(entry.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Start Service"
                                                        >
                                                            <Play size={18} />
                                                        </button>
                                                    )}
                                                    {entry.status === 'Called' && (
                                                        <button
                                                            onClick={() => handleStartService(entry.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Start Service"
                                                        >
                                                            <Play size={18} />
                                                        </button>
                                                    )}
                                                    {entry.status === 'InService' && (
                                                        <button
                                                            onClick={() => handleCompleteService(entry.id)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Complete"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancel(entry.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Cancel"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                                            No patients in queue
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Check-In Modal */}
            {showCheckInModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Patient Check-In</h3>
                            <button onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCheckIn} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID *</label>
                                    <input name="patientId" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. P-001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
                                    <input name="patientName" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. John Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                                <select name="department" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    <option value="">Select Department</option>
                                    {departments.filter(d => d !== 'All').map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service *</label>
                                <input name="service" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. General Consultation" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority *</label>
                                <select name="priority" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                    <option value="Normal">🟢 Normal</option>
                                    <option value="Urgent">🟠 Urgent</option>
                                    <option value="Emergency">🔴 Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea name="notes" rows="2" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Additional notes..."></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCheckInModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30">Check-In</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueDashboard;
