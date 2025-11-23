import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    Ambulance, MapPin, Phone, Clock, CheckCircle, AlertCircle,
    Users, TrendingUp, Activity, Plus, Search, Navigation,
    User, Fuel, Wrench, Calendar, Eye, PlayCircle, Square
} from 'lucide-react';

const AmbulanceDashboard = () => {
    const {
        ambulanceFleet,
        setAmbulanceFleet,
        dispatchRequests,
        setDispatchRequests,
        ambulanceTrips,
        setAmbulanceTrips,
        ambulanceCrew,
        patients,
        setPatients
    } = useData();

    const [activeTab, setActiveTab] = useState('dispatch');
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Calculate metrics
    const metrics = useMemo(() => {
        const fleet = {
            available: ambulanceFleet.filter(a => a.status === 'Available').length,
            onMission: ambulanceFleet.filter(a => a.status === 'On Mission').length,
            maintenance: ambulanceFleet.filter(a => a.status === 'Maintenance').length,
            total: ambulanceFleet.length
        };

        const requests = {
            pending: dispatchRequests.filter(r => r.status === 'Pending').length,
            active: dispatchRequests.filter(r => ['Dispatched', 'En Route', 'Arrived'].includes(r.status)).length,
            completed: dispatchRequests.filter(r => r.status === 'Completed').length
        };

        const avgResponseTime = dispatchRequests
            .filter(r => r.responseTime)
            .reduce((sum, r) => sum + r.responseTime, 0) / Math.max(dispatchRequests.filter(r => r.responseTime).length, 1);

        return { fleet, requests, avgResponseTime: Math.round(avgResponseTime) };
    }, [ambulanceFleet, dispatchRequests]);

    // Handle emergency dispatch
    const handleDispatchAmbulance = (requestId, ambulanceId) => {
        const now = new Date().toISOString();

        // Update request
        setDispatchRequests(prev => prev.map(req =>
            req.id === requestId
                ? { ...req, status: 'Dispatched', assignedAmbulance: ambulanceId, dispatchTime: now }
                : req
        ));

        // Update ambulance
        setAmbulanceFleet(prev => prev.map(amb =>
            amb.id === ambulanceId
                ? { ...amb, status: 'On Mission', location: 'En route' }
                : amb
        ));

        const request = dispatchRequests.find(r => r.id === requestId);
        const ambulance = ambulanceFleet.find(a => a.id === ambulanceId);

        // Create trip record
        const newTrip = {
            id: `TRIP-${String(ambulanceTrips.length + 1).padStart(3, '0')}`,
            requestId,
            ambulanceId,
            driver: ambulance.assignedDriver,
            paramedic: ambulance.assignedParamedic,
            startTime: now,
            pickupTime: null,
            arrivalTime: null,
            endTime: null,
            distance: 0,
            status: 'In Progress',
            route: [],
            vitalsRecorded: [],
            treatmentGiven: [],
            patientHandedTo: null,
            fuelUsed: 0,
            notes: ''
        };

        setAmbulanceTrips(prev => [...prev, newTrip]);
        alert(`${ambulanceId} dispatched to ${request.pickupLocation}`);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'On Mission': return 'bg-red-100 text-red-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Out of Service': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderMetricsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Available Units</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.fleet.available}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <Ambulance className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">of {metrics.fleet.total} total</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">On Mission</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.fleet.onMission}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                        <Activity className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-red-600 font-medium">{metrics.requests.active} active calls</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.requests.pending}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-orange-600 font-medium">Awaiting dispatch</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Avg Response</p>
                        <p className="text-3xl font-bold text-gray-900">{metrics.avgResponseTime}m</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">↓ 2min from last month</span>
                </div>
            </div>
        </div>
    );

    const renderDispatchBoard = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Dispatch Board</h2>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        New Emergency Call
                    </button>
                </div>
            </div>

            {/* Pending Requests */}
            {metrics.requests.pending > 0 && (
                <div className="p-6 bg-red-50 border-b border-red-100">
                    <h3 className="text-sm font-bold text-red-900 uppercase mb-4">Pending Dispatch ({metrics.requests.pending})</h3>
                    <div className="space-y-3">
                        {dispatchRequests.filter(r => r.status === 'Pending').map((request) => (
                            <div key={request.id} className="bg-white p-4 rounded-lg border-2 border-red-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{request.patientName}</span>
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getPriorityColor(request.priority)}`}>
                                                {request.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{request.condition}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(request.requestDate).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {request.pickupLocation}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {request.callerPhone}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {ambulanceFleet.filter(a => a.status === 'Available').map(amb => (
                                        <button
                                            key={amb.id}
                                            onClick={() => handleDispatchAmbulance(request.id, amb.id)}
                                            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 flex items-center gap-1"
                                        >
                                            Dispatch {amb.id}
                                        </button>
                                    ))}
                                    {ambulanceFleet.filter(a => a.status === 'Available').length === 0 && (
                                        <p className="text-sm text-red-600 font-medium">No units available</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Missions */}
            <div className="p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Active Missions ({metrics.requests.active})</h3>
                <div className="space-y-3">
                    {dispatchRequests.filter(r => ['Dispatched', 'En Route', 'Arrived'].includes(r.status)).map((request) => {
                        const ambulance = ambulanceFleet.find(a => a.id === request.assignedAmbulance);
                        return (
                            <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${request.priority === 'Critical' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Ambulance className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">{ambulance?.vehicleNumber} • {request.patientName}</span>
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{request.condition}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {request.pickupLocation}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Dispatched {Math.round((new Date() - new Date(request.dispatchTime)) / 60000)}m ago
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200">
                                        Track
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {metrics.requests.active === 0 && (
                        <p className="text-center text-gray-500 py-8">No active missions</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderFleetManagement = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Fleet Management</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crew</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Service</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ambulanceFleet.map((ambulance) => (
                            <tr key={ambulance.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{ambulance.vehicleNumber}</span>
                                        <span className="text-xs text-gray-500">{ambulance.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{ambulance.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ambulance.status)}`}>
                                        {ambulance.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{ambulance.location}</td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-600">
                                        {ambulance.assignedDriver ? (
                                            <>
                                                <div>{ambulance.assignedDriver}</div>
                                                <div>{ambulance.assignedParamedic}</div>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Not assigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${ambulance.fuel > 50 ? 'bg-green-500' : ambulance.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${ambulance.fuel}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium">{ambulance.fuel}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900 text-xs">
                                    {new Date(ambulance.nextMaintenanceDue).toLocaleDateString()}
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
                    <h1 className="text-2xl font-bold text-gray-900">Ambulance & Emergency Services</h1>
                    <p className="text-gray-500 mt-1">Emergency dispatch, fleet management, and response tracking</p>
                </div>
            </div>

            {/* Metrics */}
            {renderMetricsCards()}

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
                {['dispatch', 'fleet', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === tab
                            ? 'bg-red-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'dispatch' && renderDispatchBoard()}
            {activeTab === 'fleet' && renderFleetManagement()}
        </div>
    );
};

export default AmbulanceDashboard;
