import React, { useState } from 'react';
import { X, Scan, FileImage, Clock, User, Calendar, Search, Filter, Download, Upload, MessageSquare, AlertCircle, CheckCircle, Activity, Stethoscope, Users as UsersIcon, Phone, Mail, Send, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';

const RadiologyDashboard = () => {
    const { servicesData, addBill } = useData();
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('orders');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalityFilter, setModalityFilter] = useState('all');

    // Filter services for Radiology
    const radiologyServices = servicesData.filter(service => service.category === 'Radiology');

    // Mock data for imaging orders
    const [imagingOrders, setImagingOrders] = useState([
        {
            id: 'IMG-001',
            patientName: 'John Smith',
            patientId: 'P-12345',
            modality: 'X-Ray',
            examination: 'Chest X-Ray (PA & Lateral)',
            requestedBy: 'Dr. Sarah Wilson',
            department: 'Doctor',
            date: '2024-01-20',
            time: '10:30 AM',
            status: 'Pending',
            priority: 'Routine',
            clinicalInfo: 'Suspected pneumonia, persistent cough for 2 weeks'
        },
        {
            id: 'IMG-002',
            patientName: 'Mary Johnson',
            patientId: 'P-12346',
            modality: 'CT Scan',
            examination: 'CT Head (Plain)',
            requestedBy: 'Dr. James Brown',
            department: 'Doctor',
            date: '2024-01-20',
            time: '11:00 AM',
            status: 'In Progress',
            priority: 'Urgent',
            clinicalInfo: 'Head trauma, loss of consciousness'
        },
        {
            id: 'IMG-003',
            patientName: 'David Lee',
            patientId: 'P-12347',
            modality: 'Ultrasound',
            examination: 'Abdominal Ultrasound',
            requestedBy: 'Reception Desk',
            department: 'Reception',
            date: '2024-01-20',
            time: '09:15 AM',
            status: 'Completed',
            priority: 'Routine',
            clinicalInfo: 'Abdominal pain, require ultrasound scan'
        },
        {
            id: 'IMG-004',
            patientName: 'Emma Watson',
            patientId: 'P-12348',
            modality: 'MRI',
            examination: 'MRI Brain with Contrast',
            requestedBy: 'Dr. Michael Chen',
            department: 'Doctor',
            date: '2024-01-20',
            time: '02:00 PM',
            status: 'Scheduled',
            priority: 'Urgent',
            clinicalInfo: 'Suspected brain tumor, severe headaches'
        },
        {
            id: 'IMG-005',
            patientName: 'Robert Taylor',
            patientId: 'P-12349',
            modality: 'X-Ray',
            examination: 'Lumbar Spine X-Ray',
            requestedBy: 'Dr. Sarah Wilson',
            department: 'Doctor',
            date: '2024-01-20',
            time: '03:30 PM',
            status: 'Pending',
            priority: 'Routine',
            clinicalInfo: 'Lower back pain, rule out fracture'
        },
    ]);

    // Communication messages
    const [communications, setCommunications] = useState([
        { id: 1, from: 'Dr. Sarah Wilson', fromDept: 'Doctor', message: 'Urgent: Please prioritize IMG-002 for patient Mary Johnson', timestamp: '10 mins ago', type: 'urgent' },
        { id: 2, from: 'Reception Desk', fromDept: 'Reception', message: 'Patient David Lee has arrived for ultrasound appointment', timestamp: '25 mins ago', type: 'info' },
        { id: 3, from: 'Laboratory', fromDept: 'Laboratory', message: 'Lab results for John Smith ready, patient scheduled for X-Ray', timestamp: '1 hour ago', type: 'info' },
        { id: 4, from: 'Dr. Michael Chen', fromDept: 'Doctor', message: 'Report ready for IMG-001? Patient waiting for results', timestamp: '2 hours ago', type: 'query' },
    ]);

    // Stats
    const stats = [
        { label: 'Pending Orders', value: imagingOrders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'amber' },
        { label: 'In Progress', value: imagingOrders.filter(o => o.status === 'In Progress').length, icon: Activity, color: 'blue' },
        { label: 'Completed Today', value: imagingOrders.filter(o => o.status === 'Completed').length, icon: CheckCircle, color: 'emerald' },
        { label: 'Urgent Cases', value: imagingOrders.filter(o => o.priority === 'Urgent').length, icon: AlertCircle, color: 'red' },
    ];

    // Filter orders
    const filteredOrders = imagingOrders.filter(order => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        if (modalityFilter !== 'all' && order.modality !== modalityFilter) return false;
        return true;
    });

    const handleUpdateStatus = (orderId, newStatus) => {
        // Add Bill when status changes to In Progress
        if (newStatus === 'In Progress') {
            const order = imagingOrders.find(o => o.id === orderId);
            if (order) {
                // Find price
                const service = radiologyServices.find(s => s.name === order.examination);
                const price = service ? service.price : 50000; // Default fallback

                addBill({
                    patientId: order.patientId,
                    amount: price,
                    type: 'Radiology',
                    description: `Radiology: ${order.examination}`,
                    status: 'Pending'
                });
            }
        }

        setImagingOrders(imagingOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-amber-100 text-amber-700',
            'In Progress': 'bg-blue-100 text-blue-700',
            'Completed': 'bg-emerald-100 text-emerald-700',
            'Scheduled': 'bg-purple-100 text-purple-700',
        };
        return colors[status] || 'bg-slate-100 text-slate-700';
    };

    const getPriorityColor = (priority) => {
        return priority === 'Urgent' ? 'text-red-600 font-bold' : 'text-slate-600';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Radiology & Imaging</h1>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive imaging services and diagnostics</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30">
                        <Scan size={16} />
                        New Imaging Request
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
                    <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-5 rounded-xl hover:shadow-md transition-all`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Orders', 'Imaging Workflow', 'Reports', 'Communication', 'Modality Stats'].map((tab) => {
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
                            {/* Filters */}
                            <div className="flex flex-wrap gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Scheduled">Scheduled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Modality</label>
                                    <select
                                        value={modalityFilter}
                                        onChange={(e) => setModalityFilter(e.target.value)}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="all">All Modalities</option>
                                        <option value="X-Ray">X-Ray</option>
                                        <option value="CT Scan">CT Scan</option>
                                        <option value="MRI">MRI</option>
                                        <option value="Ultrasound">Ultrasound</option>
                                    </select>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-3">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-slate-800 text-lg">{order.patientName}</span>
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">{order.patientId}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2">{order.examination}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                            <span className={`px-2 py-1 bg-slate-100 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                                                                {order.priority}
                                                            </span>
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                                {order.modality}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500">Requested By</p>
                                                        <p className="text-sm text-slate-700 flex items-center gap-1">
                                                            {order.department === 'Doctor' ? <Stethoscope size={14} /> : <UsersIcon size={14} />}
                                                            {order.requestedBy} ({order.department})
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500">Scheduled Time</p>
                                                        <p className="text-sm text-slate-700 flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {order.date} at {order.time}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Information</p>
                                                    <p className="text-sm text-slate-700">{order.clinicalInfo}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {order.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'In Progress')}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium whitespace-nowrap"
                                                    >
                                                        Start Imaging
                                                    </button>
                                                )}
                                                {order.status === 'In Progress' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'Completed')}
                                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium whitespace-nowrap"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                                                    View Details
                                                </button>
                                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                                                    Upload Images
                                                </button>
                                                {order.status === 'Completed' && (
                                                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium whitespace-nowrap">
                                                        Send Report
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Imaging Workflow Tab */}
                    {activeTab === 'imaging-workflow' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800">Imaging Workflow Process</h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { title: 'Order Received', count: imagingOrders.filter(o => o.status === 'Pending').length, color: 'amber' },
                                    { title: 'Patient Prepared', count: imagingOrders.filter(o => o.status === 'Scheduled').length, color: 'blue' },
                                    { title: 'Imaging in Progress', count: imagingOrders.filter(o => o.status === 'In Progress').length, color: 'purple' },
                                    { title: 'Report Ready', count: imagingOrders.filter(o => o.status === 'Completed').length, color: 'emerald' },
                                ].map((stage, index) => (
                                    <div key={index} className="border border-slate-200 rounded-xl p-5 text-center">
                                        <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-${stage.color}-100 text-${stage.color}-600 flex items-center justify-center`}>
                                            <span className="text-2xl font-bold">{stage.count}</span>
                                        </div>
                                        <p className="font-bold text-slate-800">{stage.title}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-800 mb-4">Standard Workflow Steps</h3>
                                <div className="space-y-3">
                                    {[
                                        '1. Order received from Doctor or Reception',
                                        '2. Patient registration and preparation',
                                        '3. Imaging procedure performed',
                                        '4. Images reviewed by Radiologist',
                                        '5. Report generated and signed',
                                        '6. Results sent to requesting physician',
                                        '7. Images archived in PACS system'
                                    ].map((step, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <CheckCircle size={20} className="text-emerald-600" />
                                            <p className="text-sm text-slate-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800">Imaging Reports</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <p className="text-sm text-slate-500 mb-2">Total Exams Today</p>
                                    <p className="text-3xl font-bold text-slate-800">{imagingOrders.length}</p>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <p className="text-sm text-slate-500 mb-2">Reports Pending</p>
                                    <p className="text-3xl font-bold text-amber-600">{imagingOrders.filter(o => o.status !== 'Completed').length}</p>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <p className="text-sm text-slate-500 mb-2">Average Turnaround</p>
                                    <p className="text-3xl font-bold text-emerald-600">45min</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-800">Completed Reports</h3>
                                {imagingOrders.filter(o => o.status === 'Completed').map((order) => (
                                    <div key={order.id} className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-800">{order.examination}</p>
                                            <p className="text-sm text-slate-600">{order.patientName} • {order.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                                View Report
                                            </button>
                                            <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Communication Tab */}
                    {activeTab === 'communication' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800">Communication Hub</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Messages */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-4">Recent Messages</h3>
                                    <div className="space-y-3">
                                        {communications.map((comm) => (
                                            <div key={comm.id} className={`border rounded-xl p-4 ${comm.type === 'urgent' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                                                }`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <MessageSquare size={16} className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{comm.from}</p>
                                                            <p className="text-xs text-slate-500">{comm.fromDept}</p>
                                                        </div>
                                                    </div>
                                                    {comm.type === 'urgent' && (
                                                        <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">URGENT</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 mb-2">{comm.message}</p>
                                                <p className="text-xs text-slate-400">{comm.timestamp}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Send Message */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-4">Send Message</h3>
                                    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 mb-2 block">To Department</label>
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option>Doctor - Dr. Sarah Wilson</option>
                                                <option>Reception Desk</option>
                                                <option>Laboratory</option>
                                                <option>Pharmacy</option>
                                                <option>Finance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 mb-2 block">Message</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                                placeholder="Type your message here..."
                                            ></textarea>
                                        </div>
                                        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center justify-center gap-2">
                                            <Send size={16} />
                                            Send Message
                                        </button>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="font-bold text-slate-800 mb-3">Quick Links</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Doctor', 'Reception', 'Laboratory', 'Pharmacy'].map((dept) => (
                                                <button key={dept} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modality Stats Tab */}
                    {activeTab === 'modality-stats' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800">Modality Statistics</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'X-Ray', count: imagingOrders.filter(o => o.modality === 'X-Ray').length, color: 'blue', total: 45 },
                                    { name: 'CT Scan', count: imagingOrders.filter(o => o.modality === 'CT Scan').length, color: 'orange', total: 28 },
                                    { name: 'MRI', count: imagingOrders.filter(o => o.modality === 'MRI').length, color: 'purple', total: 12 },
                                    { name: 'Ultrasound', count: imagingOrders.filter(o => o.modality === 'Ultrasound').length, color: 'emerald', total: 32 },
                                ].map((modality, index) => (
                                    <div key={index} className="border border-slate-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                                        <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-${modality.color}-100 flex items-center justify-center`}>
                                            <span className={`text-${modality.color}-600 font-bold text-xs`}>{modality.name.slice(0, 3).toUpperCase()}</span>
                                        </div>
                                        <p className="font-bold text-2xl text-slate-800">{modality.count}</p>
                                        <p className="text-xs text-slate-500">Today</p>
                                        <p className="text-xs text-slate-400 mt-1">{modality.total} this month</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border border-slate-200 rounded-xl p-6">
                                <h3 className="font-bold text-slate-800 mb-4">Examination Types</h3>
                                <div className="space-y-3">
                                    {radiologyServices.length > 0 ? (
                                        radiologyServices.map((service, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-800">{service.name}</p>
                                                    <p className="text-xs text-slate-500">{service.description || 'No description'}</p>
                                                </div>
                                                <p className="font-bold text-slate-800">{formatCurrency(service.price)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <p>No radiology services found.</p>
                                            <p className="text-sm mt-1">Add services in the Services & Pricing module.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RadiologyDashboard;
