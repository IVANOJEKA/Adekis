import React, { useState } from 'react';
import { FlaskConical, FileText, CheckCircle, Clock, AlertCircle, Search, Filter, Plus, Eye, Edit, Download, Send, MessageSquare, User, Calendar, TrendingUp, Beaker, ClipboardList, Bell, Printer, Mail, Phone, Box, Users, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import ResultsForm from './components/ResultsForm';
import ResultsEntryModal from './components/ResultsEntryModal';
import NewTestOrderModal from './components/NewTestOrderModal';

const LaboratoryDashboard = () => {
    const { servicesData, patients = [], addBill, queueEntries = [], updateQueueEntry } = useData();
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('orders');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTest, setSelectedTest] = useState(null);
    const [showResultsEntryModal, setShowResultsEntryModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [selectedPatientForOrder, setSelectedPatientForOrder] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Mock Data State
    const [inventory, setInventory] = useState([
        { id: 1, name: 'CBC Reagent Kit', stock: 15, unit: 'kits', minLevel: 5, status: 'Normal', expiry: '2025-06-15' },
        { id: 2, name: 'Malaria Antigen Strips', stock: 45, unit: 'boxes', minLevel: 20, status: 'Normal', expiry: '2024-12-30' },
        { id: 3, name: 'Blood Glucose Strips', stock: 120, unit: 'strips', minLevel: 50, status: 'Normal', expiry: '2024-11-20' },
        { id: 4, name: 'Ethanol (99%)', stock: 2, unit: 'liters', minLevel: 5, status: 'Low', expiry: '2026-01-10' },
        { id: 5, name: 'Microscope Slides', stock: 500, unit: 'pieces', minLevel: 100, status: 'Normal', expiry: 'N/A' },
    ]);

    const [staff, setStaff] = useState([
        { id: 1, name: 'Sarah Jenkins', role: 'Senior Lab Tech', status: 'On Duty', shift: 'Morning' },
        { id: 2, name: 'Mike Ross', role: 'Lab Assistant', status: 'On Duty', shift: 'Morning' },
        { id: 3, name: 'Emily Clark', role: 'Microbiologist', status: 'Off Duty', shift: 'Night' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, from: 'Dr. Sarah Wilson', subject: 'Urgent Results Needed', time: '10:30 AM', read: false },
        { id: 2, from: 'Reception', subject: 'Patient Delayed', time: '09:15 AM', read: true },
        { id: 3, from: 'Dr. James Anderson', subject: 'Re: Blood Culture', time: 'Yesterday', read: true },
    ]);

    // Mock Test Orders Data
    const [testOrders, setTestOrders] = useState([
        { id: 'LAB-001', patientName: 'John Smith', patientId: 'P001', orderType: 'Doctor', requestedBy: 'Dr. Sarah Wilson', testType: 'Complete Blood Count (CBC)', date: '2024-01-20 09:30', status: 'Pending', priority: 'Routine', sampleCollected: false },
        { id: 'LAB-002', patientName: 'Mary Johnson', patientId: 'P002', orderType: 'Walk-in', requestedBy: 'Reception Desk', testType: 'Malaria Test', date: '2024-01-20 10:15', status: 'Sample Collected', priority: 'Urgent', sampleCollected: true, amount: 25000 },
        { id: 'LAB-003', patientName: 'Sarah Wilson', patientId: 'P003', orderType: 'Doctor', requestedBy: 'Dr. Michael Brown', testType: 'Liver Function Test', date: '2024-01-20 11:00', status: 'In Progress', priority: 'Routine', sampleCollected: true },
        { id: 'LAB-004', patientName: 'David Lee', patientId: 'P004', orderType: 'Walk-in', requestedBy: 'Reception Desk', testType: 'Blood Sugar Test', date: '2024-01-19 14:20', status: 'Completed', priority: 'Routine', sampleCollected: true, amount: 15000, resultsReady: true },
        { id: 'LAB-005', patientName: 'Emma Watson', patientId: 'P005', orderType: 'Doctor', requestedBy: 'Dr. Sarah Wilson', testType: 'Thyroid Profile', date: '2024-01-19 15:45', status: 'Completed', priority: 'Routine', sampleCollected: true, resultsReady: true, resultsNotified: true },
    ]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleCreateOrder = (orderData) => {
        const newOrder = {
            id: `LAB-${String(testOrders.length + 1).padStart(3, '0')}`,
            patientName: orderData.patientName,
            patientId: orderData.patientId,
            orderType: orderData.orderType,
            requestedBy: orderData.requestedBy,
            testType: orderData.testType,
            date: new Date().toLocaleString(),
            status: 'Pending',
            priority: orderData.priority,
            sampleCollected: false,
            amount: orderData.amount,
            notes: orderData.notes
        };

        if (orderData.amount > 0) {
            addBill({
                patientId: orderData.patientId,
                amount: orderData.amount,
                type: 'Lab Tests',
                description: `Lab Test: ${orderData.testType}`,
                status: 'Pending'
            });
        }

        setTestOrders([newOrder, ...testOrders]);
        setShowNewOrderModal(false);
        showToast(`Test order ${newOrder.id} created successfully!`, 'success');
    };

    const handleMarkSampleCollected = (orderId) => {
        setTestOrders(testOrders.map(order =>
            order.id === orderId
                ? { ...order, status: 'Sample Collected', sampleCollected: true }
                : order
        ));
        showToast('Sample collection marked successfully!', 'success');
    };

    // Open Results Entry Modal
    const handleStartTesting = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id
                ? { ...order, status: 'In Progress' }
                : o
        ));
        setSelectedTest(order);
        setShowResultsEntryModal(true);
        // showToast('Test processing started', 'success'); // Optional toast
    };

    // Save Results from Modal
    const handleSaveResults = (resultsData) => {
        setTestOrders(testOrders.map(order =>
            order.id === selectedTest.id
                ? { ...order, status: 'Completed', resultsReady: true, ...resultsData }
                : order
        ));
        setShowResultsEntryModal(false);
        showToast('Results saved and verified successfully!', 'success');

        // Auto-notify logic simulation
        if (selectedTest.orderType === 'Doctor') {
            setTimeout(() => {
                showToast(`Notification sent to ${selectedTest.requestedBy}`, 'info');
            }, 1000);
        }
    };

    const handlePrintResults = (order) => {
        setSelectedForPrint(order);
        setShowPrintModal(true);
    };

    // ... (rest of helper functions: handleSendToDoctor, handleNotifyPatient, etc.) can remain or be cleaned up
    const handleSendToDoctor = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id ? { ...o, resultsNotified: true } : o
        ));
        showToast(`Results sent to ${order.requestedBy}`, 'success');
    };

    const handleNotifyPatient = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id ? { ...o, patientNotified: true } : o
        ));
        showToast(`Patient ${order.patientName} notified via SMS/Email`, 'success');
    };

    const handleCallPatient = async (entry) => {
        try {
            await updateQueueEntry(entry.id, { status: 'Called' });
            showToast(`Called patient ${entry.patientName} (Queue: ${entry.queueNumber})`, 'success');
        } catch (error) {
            console.error('Error calling patient:', error);
            showToast('Failed to call patient', 'error');
        }
    };

    const handleStartWithPatient = (patient, type = 'Queue') => {
        // Open new order modal pre-filled with patient info
        // We'll need to modify NewTestOrderModal to accept initial data or handle it here
        // For now, let's auto-fill the form state if possible or just show the modal
        // Ideally, we'd pass `initialData` to NewTestOrderModal

        // Since NewTestOrderModal doesn't support initialData prop yet based on my view, 
        // I will just open it. Enhancing it would be a good next step.
        // Wait, I can pass it and let the modal handle it if I update the modal too.
        // For now, I'll just open the modal and show a toast.

        // Actually, let's see if I can pass props to NewTestOrderModal. 
        // It takes `patients`, etc. I can add `initialPatient` prop.
        setSelectedPatientForOrder(patient);
        setShowNewOrderModal(true);
    };

    // Queue Data Processing
    const labQueue = queueEntries.filter(e => e.department === 'Laboratory' && e.status !== 'Completed');
    const walkInPatients = patients.filter(p => p.patientCategory === 'Walk-in' && p.status === 'WAITING');

    const testCatalogData = servicesData.filter(service => service.category === 'Laboratory');
    const testCatalog = testCatalogData; // Alias for consistent usage

    // ... stats, getStatusColor, filters ...

    const stats = [
        { label: 'Pending Orders', value: testOrders.filter(t => t.status === 'Pending').length, icon: Clock, color: 'amber' },
        { label: 'In Progress', value: testOrders.filter(t => t.status === 'In Progress').length, icon: FlaskConical, color: 'blue' },
        { label: 'Completed Today', value: testOrders.filter(t => t.status === 'Completed').length, icon: CheckCircle, color: 'emerald' },
        { label: 'Critical / Low Stock', value: inventory.filter(i => i.status === 'Low').length, icon: AlertTriangle, color: 'red' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Sample Collected': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? testOrders
        : testOrders.filter(order => order.status === filterStatus);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Laboratory Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage test orders, results entry, and inter-module communication</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewOrderModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30"
                    >
                        <Plus size={16} />
                        New Test Order
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-5 rounded-xl hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${stat.color}-500`}>
                            <stat.icon size={60} />
                        </div>
                        <div className="relative z-10">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 w-fit mb-3`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Queue', 'Orders', 'Results Entry', 'Inventory', 'Test Catalog', 'Communication', 'Reports', 'Staff'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-');
                        const isActive = activeTab === tabKey;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6">
                    {activeTab === 'queue' && (
                        <div className="space-y-6">
                            {/* Main Queue Section */}
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock className="text-primary" size={20} />
                                    Laboratory Queue
                                </h2>
                                {labQueue.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-slate-500">No patients currently in the laboratory queue.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {labQueue.map(entry => (
                                            <div key={entry.id} className={`p-4 rounded-xl border flex justify-between items-center ${entry.status === 'Called' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <span className="block text-xs text-slate-500 uppercase font-bold">Queue No</span>
                                                        <span className="block text-xl font-bold text-slate-800">{entry.queueNumber}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{entry.patientName}</h4>
                                                        <p className="text-sm text-slate-500">{entry.service}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${entry.status === 'Called' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {entry.status}
                                                            </span>
                                                            <span className="text-xs text-slate-400">Wait: {entry.waitTime || 0} min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {entry.status !== 'Called' && (
                                                        <button
                                                            onClick={() => handleCallPatient(entry)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                        >
                                                            Call Patient
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStartWithPatient({ id: entry.patientId, name: entry.patientName })}
                                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                                                    >
                                                        Start Order
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Walk-in Patients Section */}
                            <div className="pt-6 border-t border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <User className="text-emerald-600" size={20} />
                                    Waiting Walk-in Patients
                                </h2>
                                {walkInPatients.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No walk-in patients currently waiting at reception.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {walkInPatients.map(patient => (
                                            <div key={patient.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                                            {patient.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{patient.name}</h4>
                                                            <p className="text-xs text-slate-500">{patient.id} • Walk-in</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleStartWithPatient(patient, 'Walk-in')}
                                                    className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Create Order
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {/* Filters Component */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Test Orders</h2>
                                <div className="flex gap-2">
                                    {['All', 'Pending', 'Sample Collected', 'In Progress', 'Completed'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setFilterStatus(filter === 'All' ? 'all' : filter)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${(filter === 'All' && filterStatus === 'all') || filterStatus === filter
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <Beaker size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                        {order.id}
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                        {order.priority === 'Urgent' && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">URGENT</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                                                        <User size={14} />
                                                        <span className="font-medium">{order.patientName}</span>
                                                        <span className="text-slate-400">({order.patientId})</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {order.orderType === 'Doctor' ? '🩺' : '🚶'} {order.requestedBy} • {order.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-700">{order.testType}</p>
                                                {order.amount && (
                                                    <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(order.amount)}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleMarkSampleCollected(order.id)}
                                                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={16} />
                                                    Mark Sample Collected
                                                </button>
                                            )}
                                            {order.status === 'Sample Collected' && (
                                                <button
                                                    onClick={() => handleStartTesting(order)}
                                                    className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <FileText size={16} />
                                                    Start Testing
                                                </button>
                                            )}
                                            {/* Reuse handleStartTesting to open modal for In Progress as well */}
                                            {order.status === 'In Progress' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedTest(order);
                                                        setShowResultsEntryModal(true);
                                                    }}
                                                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={16} />
                                                    Enter Results
                                                </button>
                                            )}
                                            {order.status === 'Completed' && (
                                                <>
                                                    <button
                                                        onClick={() => handlePrintResults(order)}
                                                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Printer size={16} />
                                                        Print Results
                                                    </button>
                                                    <button
                                                        onClick={() => handleSendToDoctor(order)}
                                                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Send size={16} />
                                                        Send to Doctor
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Entry Tab */}
                    {activeTab === 'results-entry' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Results Entry Worklist</h2>
                                    <p className="text-sm text-slate-500">Tests awaiting result entry</p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {testOrders.filter(o => ['Sample Collected', 'In Progress'].includes(o.status)).length} Pending
                                </div>
                            </div>

                            <div className="space-y-3">
                                {testOrders.filter(o => ['Sample Collected', 'In Progress'].includes(o.status)).length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <CheckCircle size={48} className="mx-auto mb-3 text-emerald-500 opacity-50" />
                                        <p className="text-slate-600 font-medium">All caught up!</p>
                                        <p className="text-sm text-slate-400">No pending tests require results at this time.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {testOrders
                                            .filter(o => ['Sample Collected', 'In Progress'].includes(o.status))
                                            .map(order => (
                                                <div key={order.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-lg ${order.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            <FlaskConical size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-slate-800">{order.testType}</h3>
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.status === 'In Progress' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {order.status}
                                                                </span>
                                                                {order.priority === 'Urgent' && (
                                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">URGENT</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-600">
                                                                <span className="font-medium">{order.patientName}</span> ({order.patientId})
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-0.5">
                                                                Ordered by: {order.requestedBy} • {order.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTest(order);
                                                            setShowResultsEntryModal(true);
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-200"
                                                    >
                                                        <FileText size={16} />
                                                        Enter Results
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Inventory Tab */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Inventory Management</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="p-3 text-sm font-bold text-slate-600">Reagent / Item Name</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Current Stock</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Unit</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Expiry Date</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Status</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.map(item => (
                                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-3 font-medium text-slate-800">{item.name}</td>
                                                <td className="p-3">{item.stock}</td>
                                                <td className="p-3 text-slate-500 text-sm">{item.unit}</td>
                                                <td className="p-3 text-slate-500 text-sm">{item.expiry}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Low' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Test Catalog Tab */}
                    {activeTab === 'test-catalog' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Laboratory Test Catalog</h2>
                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                    <input type="text" placeholder="Search tests..." className="bg-transparent border-none px-2 py-1 text-sm focus:outline-none w-48" />
                                    <Search size={16} className="text-slate-400 mr-2" />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="p-3 text-sm font-bold text-slate-600">Test Name</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Price</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Turnaround Time</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Category</th>
                                            <th className="p-3 text-sm font-bold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testCatalog.map((test, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-3 font-medium text-slate-800">{test.name}</td>
                                                <td className="p-3 font-bold text-emerald-600">{formatCurrency(test.price)}</td>
                                                <td className="p-3 text-slate-500 text-sm">2-4 Hours</td>
                                                <td className="p-3 text-slate-500 text-sm">{test.category}</td>
                                                <td className="p-3">
                                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Communication Tab */}
                    {activeTab === 'communication' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Messages & Alerts</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                                    <MessageSquare size={16} /> Compose New
                                </button>
                            </div>
                            <div className="space-y-2">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${msg.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-100'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${msg.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-sm ${msg.read ? 'text-slate-700' : 'text-slate-900'}`}>{msg.subject}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">From: {msg.from}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Daily Lab Report</h2>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">
                                        <Calendar size={14} /> Today
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold">
                                        <Download size={14} /> Download PDF
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-500 mb-1">Total Tests Run</p>
                                    <p className="text-2xl font-bold text-slate-800">42</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-500 mb-1">Wait Time (Avg)</p>
                                    <p className="text-2xl font-bold text-slate-800">18m</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-500 mb-1">Critical Results</p>
                                    <p className="text-2xl font-bold text-red-600">3</p>
                                </div>
                            </div>
                            <div className="p-6 border border-slate-200 rounded-xl flex items-center justify-center h-48 bg-slate-50">
                                <p className="text-slate-400 flex items-center gap-2">
                                    <TrendingUp size={20} /> Chart visualization placeholder
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Staff Tab */}
                    {activeTab === 'staff' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Lab Staff Management</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                                    <Plus size={16} /> Add Staff
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {staff.map(person => (
                                    <div key={person.id} className="p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:shadow-md transition-all">
                                        <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{person.name}</h4>
                                            <p className="text-sm text-slate-500">{person.role}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`w-2 h-2 rounded-full ${person.status === 'On Duty' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                <span className="text-xs text-slate-400">{person.status} • {person.shift}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Toast */}
            {toast.show && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-up z-50 ${toast.type === 'success' ? 'bg-emerald-500' :
                    toast.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Print Results Modal (using existing ResultsForm for printing) */}
            {showPrintModal && selectedForPrint && (
                <ResultsForm
                    result={selectedForPrint} // Pass full object which now has results
                    patient={patients.find(p => p.id === selectedForPrint.patientId)}
                    onClose={() => setShowPrintModal(false)}
                    onPrint={() => showToast('Results printed successfully!', 'success')}
                />
            )}

            {/* New Results Entry Modal */}
            {showResultsEntryModal && selectedTest && (
                <ResultsEntryModal
                    order={selectedTest}
                    patient={patients.find(p => p.id === selectedTest.patientId)}
                    onClose={() => setShowResultsEntryModal(false)}
                    onSave={handleSaveResults}
                />
            )}

            {/* New Test Order Modal */}
            {showNewOrderModal && (
                <NewTestOrderModal
                    onClose={() => setShowNewOrderModal(false)}
                    onSubmit={handleCreateOrder}
                    patients={patients}
                    testCatalog={testCatalog}
                    formatCurrency={formatCurrency}
                    initialPatient={selectedPatientForOrder}
                />
            )}
        </div>
    );
};

export default LaboratoryDashboard;