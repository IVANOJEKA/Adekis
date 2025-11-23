import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
    Users, Clock, AlertCircle, UserPlus, Play, CheckCircle, XCircle, ArrowRight,
    Monitor, Filter, TrendingUp, Phone, Search, Calendar, Activity, Bell, ClipboardList, ChevronDown
} from 'lucide-react';

import QueueDisplay from './QueueDisplay';

const QueueDashboard = () => {
    const { queueEntries = [], setQueueEntries, patients = [], addBill } = useData();
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('Waiting');
    const [showDisplayMode, setShowDisplayMode] = useState(false);

    const departments = ['All', 'Doctor', 'Pharmacy', 'Laboratory', 'Radiology', 'Billing', 'Triage', 'Maternity'];

    if (showDisplayMode) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDisplayMode(false)}
                    className="absolute top-4 left-4 z-50 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    title="Exit Display Mode"
                >
                    <XCircle size={24} />
                </button>
                <QueueDisplay />
            </div>
        );
    }

    // Filter queue by department and status
    const filteredQueue = queueEntries.filter(entry => {
        const deptMatch = selectedDepartment === 'All' || entry.department === selectedDepartment;
        const statusMatch = selectedFilter === 'All' || entry.status === selectedFilter;
        return deptMatch && statusMatch && entry.status !== 'Completed' && entry.status !== 'Cancelled';
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
        }, 60000);

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

    // Handle patient search
    useEffect(() => {
        if (searchTerm.length > 1 && Array.isArray(patients)) {
            const results = patients.filter(p =>
                (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, patients]);

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setSearchTerm('');
        setSearchResults([]);
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
            estimatedWait: formData.get('priority') === 'Emergency' ? 0 : 15,
            assignedStaff: null,
            notes: formData.get('notes') || '',
            transferredFrom: null
        };

        // Automatically add consultation bill
        if (formData.get('department') === 'Doctor') {
            addBill({
                patientId: formData.get('patientId'),
                amount: 50000, // Standard Consultation Fee
                type: 'Consultation',
                description: `Consultation Fee - ${formData.get('service')}`,
                status: 'Pending'
            });
        }

        setQueueEntries([...queueEntries, newEntry]);
        setShowCheckInModal(false);
        setSelectedPatient(null);
        setSearchTerm('');
    };

    // ... (rest of the component)

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header Banner */}
            <div className="bg-emerald-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Queue Management</h1>
                    <p className="text-emerald-50 opacity-90">Patient queue and waiting list system</p>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                    <ClipboardList size={120} />
                </div>
            </div>

            {/* Stats & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Waiting Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Waiting</p>
                        <p className="text-4xl font-bold text-slate-800">{stats.waiting}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-500">
                        <Clock size={24} />
                    </div>
                </div>

                {/* In Progress Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium mb-1">In Progress</p>
                        <p className="text-4xl font-bold text-slate-800">{stats.inService}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                        <Bell size={24} />
                    </div>
                </div>

                {/* Add to Queue Button */}
                <button
                    onClick={() => setShowCheckInModal(true)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center gap-3 text-emerald-600 font-bold text-lg hover:bg-emerald-50 transition-colors group"
                >
                    <UserPlus size={24} className="group-hover:scale-110 transition-transform" />
                    + Add to Queue
                </button>
            </div>

            {/* Department Tabs */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
                {departments.map(dept => (
                    <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedDepartment === dept
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {dept === 'All' ? 'All Departments' : dept}
                    </button>
                ))}
            </div>

            {/* Current Queue Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Current Queue</h2>
                </div>

                {filteredQueue.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Queue #</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Wait Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredQueue.map(entry => (
                                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">{entry.queueNumber}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-slate-800">{entry.patientName}</div>
                                                <div className="text-xs text-slate-500">{entry.patientId}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{entry.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${entry.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                                                entry.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {entry.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-mono">{entry.waitTime} min</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${entry.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                                                entry.status === 'InService' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(entry.status === 'Waiting' || entry.status === 'Called') && (
                                                    <button
                                                        onClick={() => handleStartService(entry.id)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Start Service"
                                                    >
                                                        <Play size={18} />
                                                    </button>
                                                )}
                                                {entry.status === 'InService' && (
                                                    <button
                                                        onClick={() => handleCompleteService(entry.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Complete"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleCancel(entry.id)}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <ClipboardList size={48} className="mb-4 opacity-20" />
                        <p>No patients in queue</p>
                    </div>
                )}
            </div>

            {/* Add Patient Modal */}
            {showCheckInModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-xl text-slate-800">Add Patient to Queue</h3>
                        </div>

                        <div className="px-6 pt-4 relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search registered patients..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="absolute left-6 right-6 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50">
                                    {searchResults.map(patient => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handleSelectPatient(patient)}
                                            className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                        >
                                            <div className="font-bold text-slate-800">{patient.name}</div>
                                            <div className="text-xs text-slate-500 flex justify-between">
                                                <span>{patient.id}</span>
                                                <span>{patient.phone}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleCheckIn} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Patient ID</label>
                                <input
                                    name="patientId"
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                    placeholder="Enter patient ID"
                                    defaultValue={selectedPatient?.id || ''}
                                    readOnly={!!selectedPatient}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name</label>
                                <input
                                    name="patientName"
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                                    placeholder="Enter patient name"
                                    defaultValue={selectedPatient?.name || ''}
                                    readOnly={!!selectedPatient}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                                <div className="relative">
                                    <select
                                        name="department"
                                        required
                                        className="w-full px-4 py-3 border-2 border-emerald-500 rounded-xl focus:ring-0 outline-none appearance-none bg-white text-slate-800 font-medium"
                                        defaultValue="General Medicine"
                                    >
                                        <option value="General Medicine">General Medicine</option>
                                        {departments.filter(d => d !== 'All' && d !== 'General Medicine').map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="Normal">Low</option>
                                        <option value="Urgent">Medium</option>
                                        <option value="Emergency">High</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCheckInModal(false);
                                        setSelectedPatient(null);
                                        setSearchTerm('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={20} />
                                    Add to Queue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueDashboard;
