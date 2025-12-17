import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Users, Calendar, Activity, DollarSign, Download, Plus, UserPlus, Clock, X, CheckCircle } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Mon', patients: 40, revenue: 2400 },
    { name: 'Tue', patients: 30, revenue: 1398 },
    { name: 'Wed', patients: 20, revenue: 9800 },
    { name: 'Thu', patients: 27, revenue: 3908 },
    { name: 'Fri', patients: 18, revenue: 4800 },
    { name: 'Sat', patients: 23, revenue: 3800 },
    { name: 'Sun', patients: 34, revenue: 4300 },
];

const StatCard = ({ title, value, change, trend, color, icon: Icon }) => (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover-card">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon size={24} />
                </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {change}
                </span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { appointments, setAppointments, patients, bills } = useData();
    const { currentUser } = useAuth();
    const { formatCurrency } = useCurrency();
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get user display name with title
    const getUserDisplayName = () => {
        if (!currentUser) return 'User';

        const name = currentUser.name || currentUser.username || 'User';
        const role = currentUser.role || '';

        // Add professional title based on role
        if (role === 'Doctor') return `Dr. ${name}`;
        if (role === 'Nurse') return `Nurse ${name}`;
        if (role === 'Lab Technician') return `Lab Tech ${name}`;
        if (role === 'Pharmacist') return `Pharm. ${name}`;

        // For admin and other roles, just return name
        return name;
    };

    // Calculate appointments stats
    const todayAppointments = appointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date === today && apt.status !== 'Cancelled';
    });

    const handleBookAppointment = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newAppointment = {
            id: `APT-${Date.now()}`,
            appointmentNumber: `A-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(appointments.length + 1).padStart(3, '0')}`,
            patientId: formData.get('patientId'),
            patientName: formData.get('patientName'),
            patientPhone: formData.get('patientPhone'),
            patientEmail: formData.get('patientEmail') || '',
            doctorId: formData.get('doctorId'),
            doctorName: formData.get('doctorName'),
            department: formData.get('department'),
            service: formData.get('service'),
            date: formData.get('date'),
            startTime: formData.get('time'),
            endTime: calculateEndTime(formData.get('time'), parseInt(formData.get('duration'))),
            duration: parseInt(formData.get('duration')),
            status: 'Scheduled',
            priority: formData.get('priority'),
            reason: formData.get('reason'),
            notes: formData.get('notes') || '',
            createdAt: new Date().toISOString(),
            createdBy: 'Reception Staff',
            confirmedAt: null,
            completedAt: null,
            cancelledAt: null,
            cancellationReason: '',
            reminderSent: false,
            consultationFee: 500,
            paid: false
        };

        setAppointments([...appointments, newAppointment]);
        setShowBookingModal(false);
    };

    const calculateEndTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {getGreeting()}, <span className="text-gradient">{getUserDisplayName()}</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening in Adekis+ today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                        <Download size={16} />
                        Download Report
                    </button>
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 font-medium text-sm"
                    >
                        <Plus size={16} />
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value={patients.length}
                    change="+12.5%"
                    trend="up"
                    color="indigo"
                    icon={Users}
                />
                <StatCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    change="+8.2%"
                    trend="up"
                    color="pink"
                    icon={Calendar}
                />
                <StatCard
                    title="Operations"
                    value={bills.filter(b => b.category === 'Surgery' || b.type === 'Surgery').length}
                    change="-2.4%"
                    trend="down"
                    color="orange"
                    icon={Activity}
                />
                <StatCard
                    title="Hospital Revenue"
                    value={formatCurrency(bills.reduce((sum, bill) => sum + (bill.amount || 0), 0))}
                    change="+14.6%"
                    trend="up"
                    color="emerald"
                    icon={DollarSign}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Patient Statistics</h3>
                        <select className="bg-slate-50 border-none text-sm text-slate-500 rounded-lg focus:ring-0 cursor-pointer">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-80 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="patients"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPatients)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Appointments */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Today's Appointments</h3>
                    <div className="space-y-4">
                        {todayAppointments.length > 0 ? (
                            todayAppointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                        {apt.startTime}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{apt.patientName}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{apt.doctorName} • {apt.department}</p>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 py-8">No appointments today</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full mt-6 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                    >
                        Book New Appointment
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-primary text-white">
                            <div>
                                <h3 className="font-bold text-lg">Book New Appointment</h3>
                                <p className="text-sm opacity-90">Schedule a patient appointment</p>
                            </div>
                            <button onClick={() => setShowBookingModal(false)} className="text-white hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
                            {/* Patient Information */}
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3">Patient Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID *</label>
                                        <input name="patientId" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. P-001" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
                                        <input name="patientName" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                                        <input name="patientPhone" required type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="+254 700 123 456" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input name="patientEmail" type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="patient@email.com" />
                                    </div>
                                </div>
                            </div>

                            {/* Doctor & Department */}
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3">Doctor & Department</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                                        <select name="department" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                            <option value="">Select Department</option>
                                            <option value="General Medicine">General Medicine</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Surgery">Surgery</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Dermatology">Dermatology</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Doctor ID *</label>
                                        <input name="doctorId" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. D-001" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name *</label>
                                        <input name="doctorName" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Dr. Sarah Wilson" />
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3">Appointment Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Service Type *</label>
                                        <select name="service" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                            <option value="Consultation">Consultation</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Procedure">Procedure</option>
                                            <option value="Lab Test">Lab Test</option>
                                            <option value="Radiology">Radiology</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority *</label>
                                        <select name="priority" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                            <option value="Regular">Regular</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                                        <input name="date" required type="date" min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
                                        <input name="time" required type="time" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes) *</label>
                                        <select name="duration" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                            <option value="15">15 minutes</option>
                                            <option value="30" selected>30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit *</label>
                                        <input name="reason" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Annual checkup" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                                        <textarea name="notes" rows="2" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Any special requirements or notes..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                                    <CheckCircle size={18} />
                                    Book Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
