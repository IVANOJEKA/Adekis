import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import {
    Fingerprint,
    CheckCircle,
    XCircle,
    Clock,
    Smartphone,
    Signal,
    Users,
    RefreshCw,
    AlertTriangle,
    User,
    Edit,
    Save,
    Plus,
    Trash2,
    X,
    Loader2,
    Settings,
    Wifi,
    Server,
    Download
} from 'lucide-react';

const EnhancedAttendance = () => {
    const { attendance, biometricDevices, setBiometricDevices, attendancePolicies, setAttendancePolicies } = useData();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDevice, setSelectedDevice] = useState('all');
    const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'devices' | 'policies' | 'settings'

    // Interactive State
    const [syncing, setSyncing] = useState({}); // { deviceId: boolean }
    const [isEditingPolicies, setIsEditingPolicies] = useState(false);
    const [localPolicies, setLocalPolicies] = useState(attendancePolicies);

    // Update local policies when global policies change (unless editing)
    useEffect(() => {
        if (!isEditingPolicies && attendancePolicies) {
            setLocalPolicies(JSON.parse(JSON.stringify(attendancePolicies)));
        }
    }, [attendancePolicies, isEditingPolicies]);

    // Filter attendance by selected date and device
    const filteredAttendance = useMemo(() => {
        if (!attendance) return [];
        return attendance.filter(record => {
            const matchesDate = record.date === selectedDate;
            const matchesDevice = selectedDevice === 'all' ||
                record.deviceIdCheckIn === selectedDevice ||
                record.deviceIdCheckOut === selectedDevice;
            return matchesDate && matchesDevice;
        });
    }, [attendance, selectedDate, selectedDevice]);

    // Calculate today's stats
    const todayStats = useMemo(() => {
        const today = filteredAttendance;
        return {
            total: today.length,
            present: today.filter(r => r.status === 'Present').length,
            late: today.filter(r => r.lateMinutes > 0).length,
            overtime: today.filter(r => r.overtimeMinutes > 0).length,
            avgHours: today.length > 0
                ? (today.reduce((sum, r) => sum + (r.hoursWorked || 0), 0) / today.length).toFixed(2)
                : 0
        };
    }, [filteredAttendance]);

    // Device stats
    // Device stats
    const deviceStats = useMemo(() => {
        if (!biometricDevices) return { online: 0, offline: 0, total: 0, totalCheckIns: 0 };
        return {
            online: biometricDevices.filter(d => d.status === 'Online').length,
            offline: biometricDevices.filter(d => d.status === 'Offline').length,
            total: biometricDevices.length,
            totalCheckIns: biometricDevices.reduce((sum, d) => sum + d.todayCheckIns, 0)
        };
    }, [biometricDevices]);

    const handleSync = async (deviceId) => {
        setSyncing(prev => ({ ...prev, [deviceId]: true }));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setBiometricDevices(prev => prev.map(d => {
            if (d.id === deviceId) {
                return {
                    ...d,
                    lastSync: 'Just now',
                    status: Math.random() > 0.05 ? 'Online' : 'Offline', // 95% chance of being online
                    todayCheckIns: d.todayCheckIns + Math.floor(Math.random() * 3) // Simulate 0-2 new check-ins
                };
            }
            return d;
        }));

        setSyncing(prev => ({ ...prev, [deviceId]: false }));
    };

    const handlePolicyChange = (section, field, value) => {
        setLocalPolicies(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const savePolicies = () => {
        setAttendancePolicies(localPolicies);
        setIsEditingPolicies(false);
    };

    const getVerificationIcon = (type) => {
        switch (type) {
            case 'Fingerprint':
                return <Fingerprint className="h-5 w-5 text-blue-500" />;
            case 'Face Recognition':
                return <User className="h-5 w-5 text-purple-500" />;
            case 'RFID Card':
                return <Smartphone className="h-5 w-5 text-green-500" />;
            default:
                return <Fingerprint className="h-5 w-5 text-gray-500" />;
        }
    };

    const getDeviceById = (deviceId) => {
        return biometricDevices?.find(d => d.id === deviceId);
    };

    const renderAttendanceTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Staff</p>
                            <p className="text-2xl font-bold text-blue-900">{todayStats.total}</p>
                        </div>
                        <Users className="h-10 w-10 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Present</p>
                            <p className="text-2xl font-bold text-green-900">{todayStats.present}</p>
                        </div>
                        <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Late Arrivals</p>
                            <p className="text-2xl font-bold text-yellow-900">{todayStats.late}</p>
                        </div>
                        <Clock className="h-10 w-10 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Overtime</p>
                            <p className="text-2xl font-bold text-purple-900">{todayStats.overtime}</p>
                        </div>
                        <Clock className="h-10 w-10 text-purple-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-600 text-sm font-medium">Avg Hours</p>
                            <p className="text-2xl font-bold text-indigo-900">{todayStats.avgHours}</p>
                        </div>
                        <Clock className="h-10 w-10 text-indigo-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                        <select
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Devices</option>
                            {biometricDevices?.map(device => (
                                <option key={device.id} value={device.id}>{device.deviceName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="ml-auto">
                        <button
                            onClick={() => biometricDevices.forEach(d => handleSync(d.id))}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Sync All
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAttendance.map(record => {
                                const device = getDeviceById(record.deviceIdCheckIn);
                                return (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{record.employeeName}</div>
                                            <div className="text-sm text-gray-500">{record.employeeId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.checkIn || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.checkOut || <span className="text-yellow-600">In Progress</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.hoursWorked ? `${record.hoursWorked.toFixed(2)}h` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getVerificationIcon(record.verificationType)}
                                                <span className="text-sm text-gray-700">{record.verificationType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {device?.location || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.lateMinutes > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {record.lateMinutes}m
                                                </span>
                                            ) : (
                                                <span className="text-green-600">✓</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.overtimeMinutes > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    +{record.overtimeMinutes}m
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDevicesTab = () => (
        <div className="space-y-6">
            {/* Device Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Devices</p>
                            <p className="text-2xl font-bold text-blue-900">{deviceStats.total}</p>
                        </div>
                        <Smartphone className="h-10 w-10 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Online</p>
                            <p className="text-2xl font-bold text-green-900">{deviceStats.online}</p>
                        </div>
                        <Signal className="h-10 w-10 text-green-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Offline</p>
                            <p className="text-2xl font-bold text-red-900">{deviceStats.offline}</p>
                        </div>
                        <XCircle className="h-10 w-10 text-red-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Today's Check-ins</p>
                            <p className="text-2xl font-bold text-purple-900">{deviceStats.totalCheckIns}</p>
                        </div>
                        <CheckCircle className="h-10 w-10 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Devices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {biometricDevices?.map(device => (
                    <div key={device.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg ${device.status === 'Online' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {device.deviceType === 'Fingerprint Scanner' && <Fingerprint className={`h-8 w-8 ${device.status === 'Online' ? 'text-green-600' : 'text-red-600'}`} />}
                                    {device.deviceType === 'Face Recognition' && <User className={`h-8 w-8 ${device.status === 'Online' ? 'text-green-600' : 'text-red-600'}`} />}
                                    {device.deviceType === 'RFID Card' && <Smartphone className={`h-8 w-8 ${device.status === 'Online' ? 'text-green-600' : 'text-red-600'}`} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{device.deviceName}</h3>
                                    <p className="text-sm text-gray-500">{device.deviceType}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${device.status === 'Online'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {device.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Location:</span>
                                <span className="text-sm font-medium text-gray-900">{device.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">IP Address:</span>
                                <span className="text-sm font-mono font-medium text-gray-900">{device.ipAddress}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Manufacturer:</span>
                                <span className="text-sm font-medium text-gray-900">{device.manufacturer}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Model:</span>
                                <span className="text-sm font-medium text-gray-900">{device.model}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Last Sync:</span>
                                <span className="text-sm font-medium text-gray-900">{device.lastSync}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Employees Registered:</span>
                                <span className="text-sm font-bold text-blue-600">{device.employeesRegistered}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Today's Check-ins:</span>
                                <span className="text-sm font-bold text-green-600">{device.todayCheckIns}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                            <button
                                onClick={() => handleSync(device.id)}
                                disabled={syncing[device.id]}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {syncing[device.id] ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    'Sync Now'
                                )}
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPoliciesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-end">
                {isEditingPolicies ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditingPolicies(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={savePolicies}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditingPolicies(true)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Policies
                    </button>
                )}
            </div>

            {/* Working Hours Policy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-500" />
                    Working Hours Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Standard Start Time</p>
                        {isEditingPolicies ? (
                            <input
                                type="time"
                                value={localPolicies.workingHours.standardStart}
                                onChange={(e) => handlePolicyChange('workingHours', 'standardStart', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">{localPolicies?.workingHours?.standardStart}</p>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Standard End Time</p>
                        {isEditingPolicies ? (
                            <input
                                type="time"
                                value={localPolicies.workingHours.standardEnd}
                                onChange={(e) => handlePolicyChange('workingHours', 'standardEnd', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">{localPolicies?.workingHours?.standardEnd}</p>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Daily Hours</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.workingHours.dailyHours}
                                onChange={(e) => handlePolicyChange('workingHours', 'dailyHours', Number(e.target.value))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">{localPolicies?.workingHours?.dailyHours}h</p>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Weekly Hours</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.workingHours.weeklyHours}
                                onChange={(e) => handlePolicyChange('workingHours', 'weeklyHours', Number(e.target.value))}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">{localPolicies?.workingHours?.weeklyHours}h</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Grace Period Policy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    Grace Period Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-600 mb-1">Late Arrival Grace Period (mins)</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.gracePeriod.lateGracePeriod}
                                onChange={(e) => handlePolicyChange('gracePeriod', 'lateGracePeriod', Number(e.target.value))}
                                className="w-full border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-yellow-900">{localPolicies?.gracePeriod?.lateGracePeriod} minutes</p>
                        )}
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-600 mb-1">Early Departure Grace Period (mins)</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.gracePeriod.earlyDepartureGracePeriod}
                                onChange={(e) => handlePolicyChange('gracePeriod', 'earlyDepartureGracePeriod', Number(e.target.value))}
                                className="w-full border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-yellow-900">{localPolicies?.gracePeriod?.earlyDepartureGracePeriod} minutes</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Overtime Policy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-purple-500" />
                    Overtime Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-600 mb-1">Enabled</p>
                        {isEditingPolicies ? (
                            <select
                                value={localPolicies.overtime.enabled}
                                onChange={(e) => handlePolicyChange('overtime', 'enabled', e.target.value === 'true')}
                                className="w-full border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        ) : (
                            <p className="text-2xl font-bold text-purple-900">{localPolicies?.overtime?.enabled ? 'Yes' : 'No'}</p>
                        )}
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-600 mb-1">Threshold (mins)</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.overtime.threshold}
                                onChange={(e) => handlePolicyChange('overtime', 'threshold', Number(e.target.value))}
                                className="w-full border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-purple-900">{localPolicies?.overtime?.threshold} minutes</p>
                        )}
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-600 mb-1">Pay Rate Multiplier</p>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                step="0.1"
                                value={localPolicies.overtime.rate}
                                onChange={(e) => handlePolicyChange('overtime', 'rate', Number(e.target.value))}
                                className="w-full border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        ) : (
                            <p className="text-2xl font-bold text-purple-900">{localPolicies?.overtime?.rate}x</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Biometric Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Fingerprint className="h-6 w-6 text-blue-500" />
                    Biometric Integration Settings
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Auto Sync</span>
                        {isEditingPolicies ? (
                            <select
                                value={localPolicies.biometricSettings.autoSync}
                                onChange={(e) => handlePolicyChange('biometricSettings', 'autoSync', e.target.value === 'true')}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="true">Enabled</option>
                                <option value="false">Disabled</option>
                            </select>
                        ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${localPolicies?.biometricSettings?.autoSync ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {localPolicies?.biometricSettings?.autoSync ? 'Enabled' : 'Disabled'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Sync Interval (mins)</span>
                        {isEditingPolicies ? (
                            <input
                                type="number"
                                value={localPolicies.biometricSettings.syncInterval}
                                onChange={(e) => handlePolicyChange('biometricSettings', 'syncInterval', Number(e.target.value))}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-24"
                            />
                        ) : (
                            <span className="text-sm font-bold text-gray-900">{localPolicies?.biometricSettings?.syncInterval} minutes</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Allow Manual Entry</span>
                        {isEditingPolicies ? (
                            <select
                                value={localPolicies.biometricSettings.allowManualEntry}
                                onChange={(e) => handlePolicyChange('biometricSettings', 'allowManualEntry', e.target.value === 'true')}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="true">Allowed</option>
                                <option value="false">Not Allowed</option>
                            </select>
                        ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${localPolicies?.biometricSettings?.allowManualEntry ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {localPolicies?.biometricSettings?.allowManualEntry ? 'Allowed' : 'Not Allowed'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Require Both Check-In & Out</span>
                        {isEditingPolicies ? (
                            <select
                                value={localPolicies.biometricSettings.requireBothCheckInOut}
                                onChange={(e) => handlePolicyChange('biometricSettings', 'requireBothCheckInOut', e.target.value === 'true')}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="true">Required</option>
                                <option value="false">Optional</option>
                            </select>
                        ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${localPolicies?.biometricSettings?.requireBothCheckInOut ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {localPolicies?.biometricSettings?.requireBothCheckInOut ? 'Required' : 'Optional'}
                            </span>
                        )}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 block mb-2">Allowed Devices</span>
                        <div className="flex flex-wrap gap-2">
                            {localPolicies?.biometricSettings?.allowedDevices?.map(deviceId => {
                                const device = getDeviceById(deviceId);
                                return (
                                    <span key={deviceId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {device?.deviceName || deviceId}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );




    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'attendance'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Attendance Records
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('devices')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'devices'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Biometric Devices
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('policies')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'policies'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Clock className="h-5 w-5" />
                        Policies & Rules
                    </div>
                </button>

            </div>

            {/* Tab Content */}
            {activeTab === 'attendance' && renderAttendanceTab()}
            {activeTab === 'devices' && renderDevicesTab()}
            {activeTab === 'policies' && renderPoliciesTab()}

        </div>
    );
};

export default EnhancedAttendance;
