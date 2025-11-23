import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    Scissors, Calendar, Clock, User, CheckCircle, AlertCircle,
    Activity, TrendingUp, Users, Plus, Eye, Filter, Download,
    ClipboardCheck, Thermometer, Droplet, Wind, FileText, Search
} from 'lucide-react';

const TheatreDashboard = () => {
    const {
        operatingRooms,
        setOperatingRooms,
        surgerySchedules,
        setSurgerySchedules,
        surgicalChecklists,
        anaesthesiaRecords,
        surgicalEquipment,
        patients,
        setPatients
    } = useData();

    const [activeTab, setActiveTab] = useState('schedule');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedSurgery, setSelectedSurgery] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Calculate comprehensive metrics
    const metrics = useMemo(() => {
        const rooms = {
            available: operatingRooms.filter(r => r.status === 'Available').length,
            inUse: operatingRooms.filter(r => r.status === 'In Use').length,
            cleaning: operatingRooms.filter(r => r.status === 'Cleaning').length,
            total: operatingRooms.length
        };

        const today = new Date().toISOString().split('T')[0];
        const surgeries = {
            scheduled: surgerySchedules.filter(s => s.status === 'Scheduled' && s.scheduledDate === today).length,
            inProgress: surgerySchedules.filter(s => s.status === 'In Progress').length,
            completed: surgerySchedules.filter(s => s.status === 'Completed' && s.scheduledDate === today).length,
            total: surgerySchedules.filter(s => s.scheduledDate === today).length
        };

        // Calculate utilization rate
        const utilizationRate = rooms.total > 0
            ? Math.round((rooms.inUse / rooms.total) * 100)
            : 0;

        // Calculate average surgery duration (mock for now)
        const avgDuration = surgerySchedules
            .filter(s => s.status === 'Completed')
            .reduce((sum, s) => sum + s.estimatedDuration, 0) /
            Math.max(surgerySchedules.filter(s => s.status === 'Completed').length, 1);

        return {
            rooms,
            surgeries,
            utilizationRate: isNaN(utilizationRate) ? 0 : utilizationRate,
            avgDuration: Math.round(avgDuration) || 0
        };
    }, [operatingRooms, surgerySchedules]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-300';
            case 'In Use': return 'bg-red-100 text-red-800 border-red-300';
            case 'Cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Maintenance': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Out of Service': return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'Pre-Op': return 'bg-purple-100 text-purple-800';
            case 'In Progress': return 'bg-red-100 text-red-800';
            case 'Post-Op': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const renderMetricsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Active Surgeries</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.surgeries.inProgress}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <Scissors className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">{metrics.surgeries.total} scheduled today</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Theatre Utilization</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.utilizationRate}%</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">{metrics.rooms.inUse} of {metrics.rooms.total} in use</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Completed Today</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.surgeries.completed}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">↑ 12% from yesterday</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Avg Duration</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.avgDuration}m</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">Average procedure time</span>
                </div>
            </div>
        </div>
    );

    const renderOperatingRooms = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {operatingRooms.map((room) => {
                const currentSurgery = surgerySchedules.find(
                    s => s.operatingRoom === room.id && s.status === 'In Progress'
                );

                return (
                    <div
                        key={room.id}
                        className={`bg-white rounded-lg shadow-sm border-2 ${room.status === 'In Use' ? 'border-red-300' :
                                room.status === 'Available' ? 'border-green-300' :
                                    'border-yellow-300'
                            } p-5`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{room.name}</h3>
                                <p className="text-sm text-gray-500">{room.type} Theatre</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(room.status)}`}>
                                {room.status}
                            </span>
                        </div>

                        {currentSurgery ? (
                            <div className="space-y-2 mb-4">
                                <p className="text-sm font-medium text-gray-900">{currentSurgery.procedure}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <User className="h-3 w-3" />
                                    <span>{currentSurgery.surgeon}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="h-3 w-3" />
                                    <span>Started: {currentSurgery.scheduledTime}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4 text-sm text-gray-500">
                                {room.status === 'Available' ? 'Ready for next procedure' : room.status}
                            </div>
                        )}

                        {/* Environmental Controls */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Thermometer className="h-3 w-3" />
                                <span>{room.temperature}°C</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Droplet className="h-3 w-3" />
                                <span>{room.humidity}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Wind className="h-3 w-3" />
                                <span>{room.airChangesPerHour}/h</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderSurgerySchedule = () => {
        const filteredSurgeries = surgerySchedules.filter(surgery => {
            if (filterStatus === 'all') return true;
            return surgery.status === filterStatus;
        });

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Surgery Schedule</h2>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Pre-Op">Pre-Op</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Post-Op">Post-Op</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Schedule Surgery
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient & Procedure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surgeon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OT Room</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WHO Checklist</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSurgeries.map((surgery) => {
                                const checklist = surgicalChecklists.find(c => c.surgeryId === surgery.id);
                                const checklistStatus = checklist
                                    ? (checklist.signOut.completed ? 'Complete' :
                                        checklist.timeOut.completed ? 'In Progress' :
                                            checklist.signIn.completed ? 'Sign In Done' : 'Not Started')
                                    : 'Not Started';

                                return (
                                    <tr key={surgery.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{surgery.scheduledTime}</span>
                                                <span className="text-xs text-gray-500">{surgery.estimatedDuration}min</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{surgery.patientName}</span>
                                                <span className="text-sm text-gray-600">{surgery.procedure}</span>
                                                <span className="text-xs text-gray-500">{surgery.diagnosis}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{surgery.surgeon}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-gray-900">
                                                {surgery.operatingRoom}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(surgery.priority)}`}>
                                                {surgery.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(surgery.status)}`}>
                                                {surgery.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {checklistStatus === 'Complete' && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {checklistStatus === 'In Progress' && (
                                                    <Activity className="h-4 w-4 text-blue-500" />
                                                )}
                                                {checklistStatus === 'Not Started' && (
                                                    <AlertCircle className="h-4 w-4 text-gray-400" />
                                                )}
                                                <span className="text-xs text-gray-600">{checklistStatus}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedSurgery(surgery)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredSurgeries.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No surgeries found for selected filter
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderEquipmentStatus = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Surgical Equipment Status</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sterilization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Maintenance</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {surgicalEquipment.map((equipment) => (
                            <tr key={equipment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{equipment.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(equipment.status)}`}>
                                        {equipment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{equipment.location}</td>
                                <td className="px-6 py-4">
                                    <div className="text-xs">
                                        <div className="text-gray-900">{equipment.sterilizationMethod}</div>
                                        <div className="text-gray-500">{equipment.sterilizationLoadNumber}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900 text-xs">
                                    {new Date(equipment.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-900 text-xs">
                                    {new Date(equipment.nextMaintenance).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Operating Theatre Management</h1>
                    <p className="text-gray-500 mt-1">WHO-compliant surgical services & safety monitoring</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                </button>
            </div>

            {/* Metrics */}
            {renderMetricsCards()}

            {/* Operating Rooms Status */}
            {renderOperatingRooms()}

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
                {['schedule', 'equipment', 'analytics'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'schedule' && renderSurgerySchedule()}
            {activeTab === 'equipment' && renderEquipmentStatus()}
            {activeTab === 'analytics' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Analytics dashboard coming soon</p>
                </div>
            )}
        </div>
    );
};

export default TheatreDashboard;
