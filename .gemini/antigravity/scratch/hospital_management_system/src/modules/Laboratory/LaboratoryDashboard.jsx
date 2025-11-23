import React, { useState } from 'react';
import { FlaskConical, FileText, CheckCircle, Clock, AlertCircle, Search, Filter, Plus, Eye, Edit, Download, Send, MessageSquare, User, Calendar, TrendingUp, Beaker, ClipboardList, Bell, Printer, Mail, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import ResultsForm from './components/ResultsForm';
import NewTestOrderModal from './components/NewTestOrderModal';

const LaboratoryDashboard = () => {
    const { servicesData, patients = [], addBill } = useData();
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('orders');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTest, setSelectedTest] = useState(null);
    const [showResultsForm, setShowResultsForm] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Mock Test Orders Data - Now with state management
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

    // Create New Test Order
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

        // Automatically add bill to patient record
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

    // Mark Sample as Collected
    const handleMarkSampleCollected = (orderId) => {
        setTestOrders(testOrders.map(order =>
            order.id === orderId
                ? { ...order, status: 'Sample Collected', sampleCollected: true }
                : order
        ));
        showToast('Sample collection marked successfully!', 'success');
    };

    // Start Testing (change status to In Progress)
    const handleStartTesting = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id
                ? { ...order, status: 'In Progress' }
                : o
        ));
        setSelectedTest(order);
        setShowResultsForm(true);
        showToast('Test processing started', 'success');
    };

    // Complete Test with Results
    const handleCompleteTest = (orderId) => {
        setTestOrders(testOrders.map(order =>
            order.id === orderId
                ? { ...order, status: 'Completed', resultsReady: true }
                : order
        ));
        setShowResultsForm(false);
        showToast('Test results saved and marked as completed!', 'success');
    };

    const handlePrintResults = (order) => {
        setSelectedForPrint(order);
        setShowPrintModal(true);
    };

    const handleSendToDoctor = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id
                ? { ...o, resultsNotified: true }
                : o
        ));
        showToast(`Results sent to ${order.requestedBy}`, 'success');
    };

    const handleNotifyPatient = (order) => {
        setTestOrders(testOrders.map(o =>
            o.id === order.id
                ? { ...o, patientNotified: true }
                : o
        ));
        showToast(`Patient ${order.patientName} notified via SMS/Email`, 'success');
    };

    // Filter services for Laboratory
    const testCatalog = servicesData.filter(service => service.category === 'Laboratory');

    // Get parameters from service data or fallback to mock logic
    const getTestParameters = (testName) => {
        const service = servicesData.find(s => s.name === testName || s.name.includes(testName));
        if (service && service.parameters && service.parameters.length > 0) {
            return service.parameters.map(p => ({
                name: p.name,
                unit: p.unit,
                normalRange: p.range
            }));
        }

        // Fallback mock logic
        if (testName.includes('CBC') || testName.includes('Blood Count')) {
            return [
                { name: 'Hemoglobin', unit: 'g/dL', normalRange: '13.5-17.5' },
                { name: 'White Blood Cells', unit: 'cells/µL', normalRange: '4,000-11,000' },
                { name: 'Platelets', unit: 'cells/µL', normalRange: '150,000-450,000' },
                { name: 'Red Blood Cells', unit: 'million cells/µL', normalRange: '4.5-5.5' }
            ];
        } else if (testName.includes('Liver')) {
            return [
                { name: 'ALT', unit: 'U/L', normalRange: '7-56' },
                { name: 'AST', unit: 'U/L', normalRange: '10-40' },
                { name: 'Alkaline Phosphatase', unit: 'U/L', normalRange: '44-147' }
            ];
        } else if (testName.includes('Malaria')) {
            return [
                { name: 'Malaria Parasite', unit: '', normalRange: 'Negative' },
                { name: 'Parasite Density', unit: 'parasites/µL', normalRange: '0' }
            ];
        }
        return [{ name: 'Result Value', unit: '', normalRange: '-' }];
    };

    const stats = [
        { label: 'Pending Orders', value: testOrders.filter(t => t.status === 'Pending').length, icon: Clock, color: 'amber' },
        { label: 'In Progress', value: testOrders.filter(t => t.status === 'In Progress').length, icon: FlaskConical, color: 'blue' },
        { label: 'Completed Today', value: testOrders.filter(t => t.status === 'Completed').length, icon: CheckCircle, color: 'emerald' },
        { label: 'Awaiting Notification', value: testOrders.filter(t => t.resultsReady && !t.resultsNotified).length, icon: Bell, color: 'purple' },
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

    // Helper function to generate mock values
    const getMockValue = (param) => {
        if (!param.normalRange) return '-';
        const range = param.normalRange.split('-');
        if (range.length === 2) {
            const min = parseFloat(range[0]);
            const max = parseFloat(range[1]);
            return ((min + max) / 2).toFixed(1);
        }
        return param.normalRange;
    };

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
                    {['Orders', 'Results Entry', 'Test Catalog', 'Communication', 'Reports'].map((tab) => {
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

                {/* Tab Content */}
                <div className="p-6">
                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="space-y-4">
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
                                            {order.status === 'In Progress' && (
                                                <button
                                                    onClick={() => handleCompleteTest(order.id)}
                                                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={16} />
                                                    Complete & Save Results
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
                                                    <button
                                                        onClick={() => handleNotifyPatient(order)}
                                                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Bell size={16} />
                                                        Notify Patient
                                                    </button>
                                                </>
                                            )}
                                            {order.resultsReady && !order.resultsNotified && !order.status === 'Completed' && (
                                                <button className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                                                    <Send size={16} />
                                                    Notify {order.orderType === 'Doctor' ? 'Doctor' : 'Reception'}
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm flex items-center gap-2">
                                                <Eye size={16} />
                                                View Details
                                            </button>
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
                                <h2 className="text-lg font-bold text-slate-800">Results Entry</h2>
                                <p className="text-sm text-slate-500">Select a test to enter results</p>
                            </div>
                            {/* Placeholder for Results Entry */}
                            <div className="text-center py-10 text-slate-500">
                                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                <p>Select a test from the "Orders" tab to enter results.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-up z-50 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Print Results Modal */}
            {showPrintModal && selectedForPrint && (
                <ResultsForm
                    result={{
                        id: selectedForPrint.id,
                        category: selectedForPrint.testType,
                        orderedBy: selectedForPrint.requestedBy,
                        collectionDate: selectedForPrint.date,
                        completedAt: new Date().toISOString(),
                        technician: 'Lab Technician',
                        reviewedBy: 'Dr. Pathologist',
                        notes: 'All parameters within normal limits.',
                        tests: getTestParameters(selectedForPrint.testType).map(param => ({
                            name: param.name,
                            value: getMockValue(param),
                            unit: param.unit,
                            normalRange: param.normalRange
                        }))
                    }}
                    patient={patients.find(p => p.id === selectedForPrint.patientId) || {
                        id: selectedForPrint.patientId,
                        name: selectedForPrint.patientName,
                        age: 35,
                        gender: 'Male'
                    }}
                    onClose={() => setShowPrintModal(false)}
                    onPrint={() => showToast('Results printed successfully!', 'success')}
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
                />
            )}
        </div>
    );
};

export default LaboratoryDashboard;