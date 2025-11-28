import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
    Settings, Users, Shield, DollarSign, Bell, Database, Globe, Palette, Lock, Save, Upload, Download, Key, UserPlus, Edit, Trash2, CheckCircle, X, AlertCircle, Check,
    Wifi, Server, RefreshCw, Loader2, Fingerprint, Smartphone, User
} from 'lucide-react';
import PrinterSettings from './components/PrinterSettings';

const currencies = [
    { code: 'UGX', name: 'Uganda Shilling', symbol: 'UGX' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
];

const SettingsDashboard = () => {
    const { biometricDevices, setBiometricDevices, printerSettings, setPrinterSettings } = useData();
    const [activeTab, setActiveTab] = useState('general');
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [showAddRole, setShowAddRole] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Biometric Device State
    const [isScanning, setIsScanning] = useState(false);
    const [discoveredDevices, setDiscoveredDevices] = useState([]);
    const [editingDevice, setEditingDevice] = useState(null);

    // State for all settings
    const [hospitalInfo, setHospitalInfo] = useState({
        name: 'Shand Pharmacy & Hospital',
        registrationNumber: 'UG-HOSP-2024-0001',
        email: 'info@shandpharmacy.com',
        phone: '+256 700 000 000',
        address: 'Plot 123, Kampala Road, Kampala, Uganda',
        openingTime: '08:00',
        closingTime: '20:00',
        emergency24_7: true,
        logo: localStorage.getItem('hospital_logo') || null
    });

    const [billingSettings, setBillingSettings] = useState({
        currency: 'UGX',
        taxRate: 18,
        invoicePrefix: 'INV-',
        receiptPrefix: 'RCP-',
        autoNumbering: true,
        emailReceipts: false,
        paymentMethods: {
            cash: true,
            mobileMoney: true,
            card: true,
            bankTransfer: true,
            insurance: true
        }
    });

    const [notificationSettings, setNotificationSettings] = useState({
        email: {
            appointments: true,
            labResults: true,
            prescriptions: true,
            receipts: true,
            inventory: true
        },
        sms: {
            appointmentReminders: false,
            testResults: false,
            payments: false
        }
    });

    const [securitySettings, setSecuritySettings] = useState({
        strongPasswords: true,
        twoFactor: true,
        autoLogout: false
    });

    const [selectedThemeColor, setSelectedThemeColor] = useState('#3B82F6');
    const [sidebarTheme, setSidebarTheme] = useState('light');

    // Mock data
    const [users, setUsers] = useState([
        { id: 1, name: 'Dr. Sarah Wilson', email: 'sarah.wilson@hospital.com', role: 'Doctor', status: 'Active', lastLogin: '2024-01-20 10:30' },
        { id: 2, name: 'John Administrator', email: 'admin@hospital.com', role: 'Administrator', status: 'Active', lastLogin: '2024-01-20 09:15' },
        { id: 3, name: 'Jane Pharmacist', email: 'jane.pharmacy@hospital.com', role: 'Pharmacist', status: 'Active', lastLogin: '2024-01-19 16:45' },
        { id: 4, name: 'Mike Receptionist', email: 'mike.reception@hospital.com', role: 'Receptionist', status: 'Active', lastLogin: '2024-01-20 08:00' },
    ]);

    const [roles, setRoles] = useState([
        { id: 1, name: 'Administrator', users: 2, permissions: ['All'] },
        { id: 2, name: 'Doctor', users: 15, permissions: ['EMR', 'Prescriptions', 'Laboratory', 'Patients'] },
        { id: 3, name: 'Nurse', users: 25, permissions: ['Patient Care', 'Vitals', 'Medications'] },
        { id: 4, name: 'Pharmacist', users: 5, permissions: ['Pharmacy', 'Inventory', 'Dispensing'] },
        { id: 5, name: 'Receptionist', users: 8, permissions: ['Reception', 'Appointments', 'Billing'] },
        { id: 6, name: 'Lab Technician', users: 6, permissions: ['Laboratory', 'Test Results'] },
    ]);

    const [modules, setModules] = useState([
        { id: 1, name: 'Reception', enabled: true, description: 'Patient registration and appointments' },
        { id: 2, name: 'EMR', enabled: true, description: 'Electronic Medical Records' },
        { id: 3, name: 'Pharmacy', enabled: true, description: 'Pharmacy and inventory management' },
        { id: 4, name: 'Laboratory', enabled: true, description: 'Lab tests and results' },
        { id: 5, name: 'Radiology', enabled: true, description: 'Imaging and radiology services' },
        { id: 6, name: 'Finance', enabled: true, description: 'Billing and financial management' },
        { id: 7, name: 'Insurance', enabled: true, description: 'Insurance claims and verification' },
        { id: 8, name: 'Doctor', enabled: true, description: 'Doctor dashboard and consultations' },
        { id: 9, name: 'Nursing', enabled: true, description: 'Nursing care and vitals' },
        { id: 10, name: 'Theatre', enabled: false, description: 'Operating theatre management' },
    ]);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Receptionist',
        password: ''
    });

    // Helper functions
    const showToast = (message) => {
        setToastMessage(message);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleSaveAll = () => {
        showToast('All settings saved successfully!');
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert('Please fill all fields');
            return;
        }
        const user = {
            id: users.length + 1,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: 'Active',
            lastLogin: 'Never'
        };
        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'Receptionist', password: '' });
        setShowAddUser(false);
        showToast(`User ${user.name} added successfully!`);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
            showToast('User deleted successfully!');
        }
    };

    const handleToggleModule = (moduleId) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, enabled: !m.enabled } : m
        ));
        const module = modules.find(m => m.id === moduleId);
        showToast(`${module.name} module ${module.enabled ? 'disabled' : 'enabled'}!`);
    };

    const handleBackup = () => {
        showToast('Backup created successfully! File: backup_2024-01-20.sql');
    };

    const handleExportConfig = () => {
        const config = {
            hospitalInfo,
            billingSettings,
            notificationSettings,
            securitySettings,
            modules
        };
        const dataStr = JSON.stringify(config, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'hospital_config.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('Configuration exported successfully!');
    };

    // Biometric Device Handlers
    const handleScanNetwork = async () => {
        setIsScanning(true);
        // Simulate network scan
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockNewDevice = {
            id: `temp_${Date.now()}`,
            deviceName: "Unknown Device",
            deviceType: "Fingerprint Scanner",
            location: "Unassigned",
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            macAddress: "00:1B:44:11:3A:B7",
            manufacturer: "BioSecure",
            model: "BS-200",
            status: "Online",
            lastSync: "Never",
            employeesRegistered: 0,
            todayCheckIns: 0
        };

        setDiscoveredDevices(prev => [...prev, mockNewDevice]);
        setIsScanning(false);
    };

    const handleInstallDevice = (device) => {
        setEditingDevice({ ...device, isNew: true });
    };

    const handleSaveDevice = (e) => {
        e.preventDefault();
        if (editingDevice.isNew) {
            // Add new device
            const newDevice = {
                ...editingDevice,
                id: `dev_${Date.now()}`, // Generate real ID
                isNew: undefined
            };
            setBiometricDevices(prev => [...prev, newDevice]);
            // Remove from discovered list
            setDiscoveredDevices(prev => prev.filter(d => d.id !== editingDevice.id));
            showToast('Device installed successfully!');
        } else {
            // Update existing
            setBiometricDevices(prev => prev.map(d => d.id === editingDevice.id ? editingDevice : d));
            showToast('Device configuration updated!');
        }
        setEditingDevice(null);
    };

    const themeColors = [
        { color: '#3B82F6', name: 'Blue' },
        { color: '#10B981', name: 'Green' },
        { color: '#8B5CF6', name: 'Purple' },
        { color: '#F59E0B', name: 'Amber' },
        { color: '#EF4444', name: 'Red' },
        { color: '#06B6D4', name: 'Cyan' }
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
                    <Check size={20} />
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure and manage hospital management system</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveAll}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium shadow-lg shadow-emerald-500/30"
                    >
                        <Save size={16} />
                        Save All Changes
                    </button>
                    <button
                        onClick={handleExportConfig}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export Config
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['General', 'Users', 'Roles & Permissions', 'Modules', 'Biometric Devices', 'Printer', 'Billing', 'Notifications', 'Appearance', 'System'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
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
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Hospital Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Hospital Name</label>
                                        <input
                                            type="text"
                                            value={hospitalInfo.name}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Registration Number</label>
                                        <input
                                            type="text"
                                            value={hospitalInfo.registrationNumber}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, registrationNumber: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={hospitalInfo.email}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Phone</label>
                                        <input
                                            type="tel"
                                            value={hospitalInfo.phone}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Address</label>
                                        <textarea
                                            value={hospitalInfo.address}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Hospital Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden relative">
                                                {hospitalInfo.logo ? (
                                                    <img
                                                        src={hospitalInfo.logo}
                                                        alt="Hospital Logo"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-slate-400 text-xs">No Logo</span>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    id="logo-upload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            if (file.size > 5000000) { // 5MB limit
                                                                showToast('Image size should be less than 5MB');
                                                                return;
                                                            }
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const logoData = reader.result;
                                                                setHospitalInfo(prev => ({ ...prev, logo: logoData }));
                                                                // Persist to localStorage immediately
                                                                localStorage.setItem('hospital_logo', logoData);
                                                                showToast('Logo uploaded successfully!');
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors"
                                                >
                                                    <Upload size={16} />
                                                    Upload Logo
                                                </label>
                                                <p className="text-xs text-slate-500 mt-2">Max size 5MB. PNG, JPG supported.</p>
                                                {hospitalInfo.logo && (
                                                    <button
                                                        onClick={() => {
                                                            setHospitalInfo(prev => ({ ...prev, logo: null }));
                                                            localStorage.removeItem('hospital_logo');
                                                            showToast('Logo removed');
                                                        }}
                                                        className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} /> Remove Logo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Business Hours</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Opening Time</label>
                                        <input
                                            type="time"
                                            value={hospitalInfo.openingTime}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, openingTime: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Closing Time</label>
                                        <input
                                            type="time"
                                            value={hospitalInfo.closingTime}
                                            onChange={(e) => setHospitalInfo({ ...hospitalInfo, closingTime: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={hospitalInfo.emergency24_7}
                                                onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergency24_7: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm font-medium text-slate-700">24/7 Emergency Services Available</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">User Management</h2>
                                <button
                                    onClick={() => setShowAddUser(true)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium flex items-center gap-2"
                                >
                                    <UserPlus size={16} />
                                    Add User
                                </button>
                            </div>

                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="font-medium text-slate-800">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-xs">{user.lastLogin}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowEditUser(true);
                                                            }}
                                                            className="p-2 text-primary hover:bg-primary/5 rounded-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => showToast('Password reset email sent!')}
                                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                                            title="Reset Password"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add User Modal */}
                            {showAddUser && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-bold text-lg text-slate-800">Add New User</h3>
                                            <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-600">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={newUser.name}
                                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                                                <input
                                                    type="email"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    placeholder="john@hospital.com"
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">Role</label>
                                                <select
                                                    value={newUser.role}
                                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                                >
                                                    <option>Administrator</option>
                                                    <option>Doctor</option>
                                                    <option>Nurse</option>
                                                    <option>Pharmacist</option>
                                                    <option>Receptionist</option>
                                                    <option>Lab Technician</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">Password</label>
                                                <input
                                                    type="password"
                                                    value={newUser.password}
                                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowAddUser(false)}
                                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddUser}
                                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                                            >
                                                Add User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Roles & Permissions Tab */}
                    {activeTab === 'roles-permissions' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Roles & Permissions</h2>
                                <button
                                    onClick={() => setShowAddRole(true)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
                                >
                                    Add New Role
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <div key={role.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Shield size={20} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{role.name}</h3>
                                                    <p className="text-xs text-slate-500">{role.users} users</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => showToast(`Edit ${role.name} role functionality`)}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Permissions</p>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.map((perm, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                                        {perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modules Tab */}
                    {activeTab === 'modules' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800">Module Configuration</h2>
                            <p className="text-sm text-slate-500">Enable or disable modules for your hospital</p>

                            <div className="space-y-3">
                                {modules.map((module) => (
                                    <div key={module.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={module.enabled}
                                                    onChange={() => handleToggleModule(module.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{module.name}</h3>
                                                <p className="text-xs text-slate-500">{module.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => showToast(`Configure ${module.name} module`)}
                                            className="px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-lg font-medium"
                                        >
                                            Configure
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Biometric Devices Tab */}
                    {activeTab === 'biometric-devices' && (
                        <div className="space-y-6">
                            {/* Device Discovery Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                            <Wifi className="h-6 w-6 text-blue-500" />
                                            Device Discovery
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">Scan the network for new biometric devices</p>
                                    </div>
                                    <button
                                        onClick={handleScanNetwork}
                                        disabled={isScanning}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {isScanning ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Scanning Network...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-5 w-5" />
                                                Scan Network
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Discovered Devices List */}
                                {discoveredDevices.length > 0 ? (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                            <h4 className="text-sm font-medium text-slate-700">Discovered Devices ({discoveredDevices.length})</h4>
                                        </div>
                                        <div className="divide-y divide-slate-200">
                                            {discoveredDevices.map(device => (
                                                <div key={device.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Server className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{device.deviceName}</p>
                                                            <p className="text-sm text-slate-500 font-mono">{device.ipAddress} • {device.macAddress}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInstallDevice(device)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Install Device
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                        <div className="mx-auto h-12 w-12 text-slate-400 mb-3">
                                            <Wifi className="h-full w-full" />
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-900">No devices discovered</h3>
                                        <p className="text-sm text-slate-500 mt-1">Click "Scan Network" to search for available devices</p>
                                    </div>
                                )}
                            </div>

                            {/* Active Devices List */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Server className="h-6 w-6 text-emerald-500" />
                                    Active Devices
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {biometricDevices?.map(device => (
                                        <div key={device.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-3 rounded-lg ${device.status === 'Online' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                                        {device.deviceType === 'Fingerprint Scanner' && <Fingerprint className={`h-8 w-8 ${device.status === 'Online' ? 'text-emerald-600' : 'text-red-600'}`} />}
                                                        {device.deviceType === 'Face Recognition' && <User className={`h-8 w-8 ${device.status === 'Online' ? 'text-emerald-600' : 'text-red-600'}`} />}
                                                        {device.deviceType === 'RFID Card' && <Smartphone className={`h-8 w-8 ${device.status === 'Online' ? 'text-emerald-600' : 'text-red-600'}`} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-900">{device.deviceName}</h3>
                                                        <p className="text-sm text-slate-500">{device.deviceType}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${device.status === 'Online'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {device.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">Location:</span>
                                                    <span className="text-sm font-medium text-slate-900">{device.location}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">IP Address:</span>
                                                    <span className="text-sm font-mono font-medium text-slate-900">{device.ipAddress}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">Model:</span>
                                                    <span className="text-sm font-medium text-slate-900">{device.model}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                                                <button
                                                    onClick={() => setEditingDevice(device)}
                                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Configure
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Printer Tab */}
                    {activeTab === 'printer' && (
                        <PrinterSettings
                            printerSettings={printerSettings}
                            setPrinterSettings={setPrinterSettings}
                            showToast={showToast}
                        />
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Billing Configuration</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Currency</label>
                                        <select
                                            value={billingSettings.currency}
                                            onChange={(e) => {
                                                const newCurrency = e.target.value;
                                                setBillingSettings({ ...billingSettings, currency: newCurrency });
                                                // changeCurrency(newCurrency);
                                                showToast(`Currency changed to ${currencies.find(c => c.code === newCurrency)?.name}!`);
                                            }}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            {currencies.map((currency) => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.symbol} - {currency.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            value={billingSettings.taxRate}
                                            onChange={(e) => setBillingSettings({ ...billingSettings, taxRate: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Invoice Prefix</label>
                                        <input
                                            type="text"
                                            value={billingSettings.invoicePrefix}
                                            onChange={(e) => setBillingSettings({ ...billingSettings, invoicePrefix: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Receipt Prefix</label>
                                        <input
                                            type="text"
                                            value={billingSettings.receiptPrefix}
                                            onChange={(e) => setBillingSettings({ ...billingSettings, receiptPrefix: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={billingSettings.autoNumbering}
                                                onChange={(e) => setBillingSettings({ ...billingSettings, autoNumbering: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Enable automatic invoice numbering</span>
                                        </label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={billingSettings.emailReceipts}
                                                onChange={(e) => setBillingSettings({ ...billingSettings, emailReceipts: e.target.checked })}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Send email receipts automatically</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Payment Methods</h2>
                                <div className="space-y-3">
                                    {[
                                        { key: 'cash', label: 'Cash' },
                                        { key: 'mobileMoney', label: 'Mobile Money' },
                                        { key: 'card', label: 'Credit/Debit Card' },
                                        { key: 'bankTransfer', label: 'Bank Transfer' },
                                        { key: 'insurance', label: 'Insurance' }
                                    ].map((method) => (
                                        <label key={method.key} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={billingSettings.paymentMethods[method.key]}
                                                onChange={(e) => setBillingSettings({
                                                    ...billingSettings,
                                                    paymentMethods: { ...billingSettings.paymentMethods, [method.key]: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="font-medium text-slate-700">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Notification Settings</h2>

                            <div className="space-y-4">
                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-3">Email Notifications</h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'appointments', label: 'Appointment confirmations' },
                                            { key: 'labResults', label: 'Lab results ready' },
                                            { key: 'prescriptions', label: 'Prescription ready' },
                                            { key: 'receipts', label: 'Payment receipts' },
                                            { key: 'inventory', label: 'Low inventory alerts' }
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.email[item.key]}
                                                    onChange={(e) => setNotificationSettings({
                                                        ...notificationSettings,
                                                        email: { ...notificationSettings.email, [item.key]: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-sm text-slate-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-3">SMS Notifications</h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'appointmentReminders', label: 'Appointment reminders' },
                                            { key: 'testResults', label: 'Test results available' },
                                            { key: 'payments', label: 'Payment confirmations' }
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.sms[item.key]}
                                                    onChange={(e) => setNotificationSettings({
                                                        ...notificationSettings,
                                                        sms: { ...notificationSettings.sms, [item.key]: e.target.checked }
                                                    })}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <span className="text-sm text-slate-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Appearance Settings</h2>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Theme Color</label>
                                <div className="grid grid-cols-6 gap-3">
                                    {themeColors.map((theme) => (
                                        <button
                                            key={theme.color}
                                            onClick={() => {
                                                setSelectedThemeColor(theme.color);
                                                showToast(`Theme color changed to ${theme.name}`);
                                            }}
                                            className="w-full aspect-square rounded-lg border-2 hover:border-slate-400 transition-colors relative"
                                            style={{
                                                backgroundColor: theme.color,
                                                borderColor: selectedThemeColor === theme.color ? '#1e293b' : '#e2e8f0'
                                            }}
                                            title={theme.name}
                                        >
                                            {selectedThemeColor === theme.color && (
                                                <CheckCircle size={24} className="text-white absolute inset-0 m-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Sidebar Theme</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setSidebarTheme('light');
                                            showToast('Sidebar theme changed to Light');
                                        }}
                                        className={`p-4 border-2 rounded-xl text-left hover:shadow-md transition-shadow ${sidebarTheme === 'light' ? 'border-primary' : 'border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {sidebarTheme === 'light' && <CheckCircle size={16} className="text-primary" />}
                                            <span className="font-medium text-slate-800">Light Theme</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-4 h-12 bg-white border border-slate-200 rounded"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                                <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSidebarTheme('dark');
                                            showToast('Sidebar theme changed to Dark');
                                        }}
                                        className={`p-4 border-2 rounded-xl text-left hover:shadow-md transition-shadow ${sidebarTheme === 'dark' ? 'border-primary' : 'border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {sidebarTheme === 'dark' && <CheckCircle size={16} className="text-primary" />}
                                            <span className="font-medium text-slate-800">Dark Theme</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-4 h-12 bg-slate-800 rounded"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                                <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-3">Data Management</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-slate-800">Database Backup</h4>
                                            <p className="text-sm text-slate-500">Create a full backup of the system database</p>
                                        </div>
                                        <button
                                            onClick={handleBackup}
                                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                                        >
                                            <Database size={16} />
                                            Backup Now
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-slate-800">System Logs</h4>
                                            <p className="text-sm text-slate-500">View and export system activity logs</p>
                                        </div>
                                        <button
                                            onClick={() => showToast('Logs exported successfully!')}
                                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                                        >
                                            <Download size={16} />
                                            Export Logs
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-3">Security Settings</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={securitySettings.strongPasswords}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, strongPasswords: e.target.checked })}
                                            className="w-4 h-4 text-primary rounded"
                                        />
                                        <div>
                                            <span className="font-medium text-slate-800 block">Enforce Strong Passwords</span>
                                            <span className="text-xs text-slate-500">Require minimum 8 characters, numbers, and symbols</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={securitySettings.twoFactor}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })}
                                            className="w-4 h-4 text-primary rounded"
                                        />
                                        <div>
                                            <span className="font-medium text-slate-800 block">Two-Factor Authentication</span>
                                            <span className="text-xs text-slate-500">Enable 2FA for administrator accounts</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={securitySettings.autoLogout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, autoLogout: e.target.checked })}
                                            className="w-4 h-4 text-primary rounded"
                                        />
                                        <div>
                                            <span className="font-medium text-slate-800 block">Automatic Logout</span>
                                            <span className="text-xs text-slate-500">Logout inactive users after 30 minutes</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Device Configuration Modal */}
            {editingDevice && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">
                                {editingDevice.isNew ? 'Install New Device' : 'Configure Device'}
                            </h3>
                            <button onClick={() => setEditingDevice(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveDevice} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Device Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingDevice.deviceName}
                                    onChange={(e) => setEditingDevice({ ...editingDevice, deviceName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={editingDevice.location}
                                    onChange={(e) => setEditingDevice({ ...editingDevice, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">IP Address</label>
                                <input
                                    type="text"
                                    required
                                    value={editingDevice.ipAddress}
                                    onChange={(e) => setEditingDevice({ ...editingDevice, ipAddress: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        value={editingDevice.model}
                                        onChange={(e) => setEditingDevice({ ...editingDevice, model: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                                    <input
                                        type="text"
                                        value={editingDevice.manufacturer}
                                        onChange={(e) => setEditingDevice({ ...editingDevice, manufacturer: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingDevice(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    {editingDevice.isNew ? 'Install Device' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsDashboard;
