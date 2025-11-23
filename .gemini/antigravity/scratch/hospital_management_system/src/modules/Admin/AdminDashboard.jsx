import React, { useState } from 'react';
import { Settings, Users, Shield, Database, Lock, Globe, AlertTriangle, Trash2, Key, Eye, EyeOff, CheckCircle, X, RefreshCw, Download, FileText, DollarSign, Wallet } from 'lucide-react';
import { useData } from '../../context/DataContext';
import UserManagement from './components/UserManagement';
import SecurityAudit from './components/SecurityAudit';
import DataManagement from './components/DataManagement';

const AdminDashboard = () => {
    const {
        performDataReset, getDataCounts, resetHistory,
        users = [], setUsers,
        auditLogs = [], setAuditLogs,
        loginHistory = [], setLoginHistory,
        securitySettings = {}, setSecuritySettings,
        backupHistory = [], setBackupHistory
    } = useData();

    const dataCounts = getDataCounts();

    const [activeTab, setActiveTab] = useState('overview');
    const [showDataResetModal, setShowDataResetModal] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [authData, setAuthData] = useState({
        adminPassword: '',
        confirmPassword: '',
        verificationCode: '',
        reasonForReset: '',
        backupCreated: false,
    });
    const [selectedDataTypes, setSelectedDataTypes] = useState({
        patients: false,
        financial: false,
        clinical: false,
        users: false,
        settings: false,
        insurance: false,
        services: false,
        debt: false,
        wallet: false,
        all: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isResetting, setIsResetting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const handleDataTypeToggle = (type) => {
        if (type === 'all') {
            const newValue = !selectedDataTypes.all;
            setSelectedDataTypes({
                patients: newValue,
                financial: newValue,
                clinical: newValue,
                users: newValue,
                settings: newValue,
                insurance: newValue,
                services: newValue,
                debt: newValue,
                wallet: newValue,
                all: newValue,
            });
        } else {
            setSelectedDataTypes({
                ...selectedDataTypes,
                [type]: !selectedDataTypes[type],
                all: false,
            });
        }
    };

    const validateStep1 = () => {
        if (authData.adminPassword.length < 8) {
            showToast('Admin password must be at least 8 characters', 'error');
            return false;
        }
        if (authData.adminPassword !== authData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return false;
        }
        if (authData.adminPassword !== 'Admin@12345') {
            showToast('Invalid admin credentials', 'error');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!authData.backupCreated) {
            showToast('You must create a backup before proceeding', 'error');
            return false;
        }
        if (authData.reasonForReset.length < 20) {
            showToast('Please provide a detailed reason (minimum 20 characters)', 'error');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (authData.verificationCode !== '123456') {
            showToast('Invalid verification code', 'error');
            return false;
        }
        const hasSelectedData = Object.entries(selectedDataTypes).some(([key, value]) => value && key !== 'all');
        if (!hasSelectedData) {
            showToast('Please select at least one data type to reset', 'error');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (authStep === 1 && validateStep1()) {
            setAuthStep(2);
            showToast('Step 1 verified - Proceed with caution', 'success');
        } else if (authStep === 2 && validateStep2()) {
            setAuthStep(3);
            showToast('Verification code sent to admin email/phone', 'success');
        } else if (authStep === 3 && validateStep3()) {
            handleDataReset();
        }
    };

    const handleCreateBackup = () => {
        const backupData = {
            timestamp: new Date().toISOString(),
            dataTypes: ['patients', 'financial', 'clinical', 'users', 'settings'],
            totalRecords: dataCounts.total || 0,
            size: '256 MB'
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HMS_Backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setAuthData({ ...authData, backupCreated: true });
        showToast('Backup created and downloaded successfully!', 'success');

        const newBackup = {
            id: `BKP-${String(backupHistory.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString(),
            size: '256 MB',
            type: 'Full Backup',
            status: 'Completed'
        };
        setBackupHistory([newBackup, ...backupHistory]);
    };

    const handleDataReset = () => {
        setIsResetting(true);

        setTimeout(() => {
            const result = performDataReset(
                selectedDataTypes,
                authData.reasonForReset,
                'System Administrator'
            );

            setIsResetting(false);
            setShowDataResetModal(false);

            if (result.success) {
                showToast(
                    `✓ Data reset complete! Cleared ${result.totalRecordsCleared} records. Reset ID: ${result.resetId}`,
                    'success'
                );
            }

            setAuthStep(1);
            setAuthData({
                adminPassword: '',
                confirmPassword: '',
                verificationCode: '',
                reasonForReset: '',
                backupCreated: false,
            });
            setSelectedDataTypes({
                patients: false,
                financial: false,
                clinical: false,
                users: false,
                settings: false,
                all: false,
            });
        }, 3000);
    };

    const dataTypes = [
        { id: 'patients', name: 'Patient Records', description: 'All patient data, medical history, and demographics', icon: Users, color: 'blue', records: dataCounts.patients || 0 },
        { id: 'financial', name: 'Financial Data', description: 'Billing, invoices, payments, and revenue records', icon: Database, color: 'emerald', records: dataCounts.financial || 0 },
        { id: 'clinical', name: 'Clinical Records', description: 'Lab results, radiology reports, prescriptions', icon: Shield, color: 'purple', records: dataCounts.clinical || 0 },
        { id: 'users', name: 'User Accounts', description: 'Staff accounts, roles, and permissions', icon: Users, color: 'amber', records: dataCounts.users || 0 },
        { id: 'settings', name: 'System Settings', description: 'Configuration, preferences, and custom settings', icon: Settings, color: 'cyan', records: dataCounts.settings || 0 },
        { id: 'insurance', name: 'Insurance Records', description: 'Insurance policies, claims, and provider data', icon: Shield, color: 'indigo', records: dataCounts.insurance || 0 },
        { id: 'services', name: 'Services & Pricing', description: 'Hospital services, procedures, and price lists', icon: FileText, color: 'teal', records: dataCounts.services || 0 },
        { id: 'debt', name: 'Debt Records', description: 'Outstanding debts, payment plans, and collections', icon: DollarSign, color: 'red', records: dataCounts.debt || 0 },
        { id: 'wallet', name: 'HMS Wallet Data', description: 'Patient wallet balances and transaction history', icon: Wallet, color: 'orange', records: dataCounts.wallet || 0 },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        } text-white font-medium flex items-center gap-2`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Administration</h1>
                    <p className="text-slate-500">System settings, user roles, and configuration</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Overview', 'Users', 'Security', 'Data Management'].map((tab) => {
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
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* User Management */}
                            <div
                                onClick={() => setActiveTab('users')}
                                className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">User Management</h3>
                                <p className="text-slate-500 text-sm mb-4">Manage user accounts, roles, and access permissions.</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded">{users.length} Users</span>
                                    <span className="px-2 py-1 bg-slate-100 rounded">8 Roles</span>
                                </div>
                            </div>

                            {/* System Settings */}
                            <div className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                    <Settings size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">General Settings</h3>
                                <p className="text-slate-500 text-sm mb-4">Configure hospital details, localization, and branding.</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded">v2.4.0</span>
                                </div>
                            </div>

                            {/* Security & Audit */}
                            <div
                                onClick={() => setActiveTab('security')}
                                className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <Shield size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Security & Audit</h3>
                                <p className="text-slate-500 text-sm mb-4">View audit logs, login history, and security policies.</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1"><Lock size={10} /> Secure</span>
                                </div>
                            </div>

                            {/* Backup & Restore */}
                            <div
                                onClick={() => setActiveTab('data-management')}
                                className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <Database size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Backup & Data</h3>
                                <p className="text-slate-500 text-sm mb-4">Manage database backups and data retention policies.</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded">{backupHistory.length} Backups</span>
                                </div>
                            </div>

                            {/* Integrations */}
                            <div className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Globe size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Integrations</h3>
                                <p className="text-slate-500 text-sm mb-4">Manage API keys and external system connections.</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                    <span className="px-2 py-1 bg-slate-100 rounded">3 Active</span>
                                </div>
                            </div>

                            {/* DATA RESET - HIGHLY SECURED */}
                            <div
                                onClick={() => setShowDataResetModal(true)}
                                className="card p-6 border-2 border-red-300 bg-red-50 hover:border-red-500 transition-colors cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold flex items-center gap-1">
                                        <Lock size={10} />
                                        RESTRICTED
                                    </span>
                                </div>
                                <div className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-700 transition-colors">
                                    <Trash2 size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-red-800 mb-2 flex items-center gap-2">
                                    HMS Data Reset
                                    <AlertTriangle size={18} className="text-red-600" />
                                </h3>
                                <p className="text-red-700 text-sm mb-4 font-medium">
                                    ⚠️ Secure module for resetting hospital data. Requires multi-factor authentication.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded flex items-center gap-1">
                                        <Key size={10} />
                                        Multi-Auth Required
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <UserManagement
                            users={users}
                            setUsers={setUsers}
                            auditLogs={auditLogs}
                            setAuditLogs={setAuditLogs}
                            showToast={showToast}
                        />
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <SecurityAudit
                            auditLogs={auditLogs}
                            loginHistory={loginHistory}
                            securitySettings={securitySettings}
                            setSecuritySettings={setSecuritySettings}
                            showToast={showToast}
                        />
                    )}

                    {/* Data Management Tab */}
                    {activeTab === 'data-management' && (
                        <DataManagement
                            dataCounts={dataCounts}
                            backupHistory={backupHistory}
                            setBackupHistory={setBackupHistory}
                            showToast={showToast}
                        />
                    )}
                </div>
            </div>

            {/* SECURE DATA RESET MODAL */}
            {showDataResetModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-red-200 bg-red-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-600 rounded-lg">
                                    <AlertTriangle size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-red-900 flex items-center gap-2">
                                        HMS Data Reset
                                        <Lock size={20} className="text-red-700" />
                                    </h2>
                                    <p className="text-sm text-red-700 font-medium">Step {authStep} of 3 - Multi-Factor Authentication Required</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDataResetModal(false);
                                    setAuthStep(1);
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg"
                            >
                                <X size={24} className="text-red-900" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Step 1: Admin Authentication */}
                            {authStep === 1 && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-amber-900">Security Warning</p>
                                                <p className="text-sm text-amber-800">You are about to access the HMS Data Reset module. This action requires administrator credentials and cannot be undone without a backup.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-2 block">Administrator Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={authData.adminPassword}
                                                onChange={(e) => setAuthData({ ...authData, adminPassword: e.target.value })}
                                                placeholder="Enter admin password"
                                                className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Demo: Use "Admin@12345"</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-2 block">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={authData.confirmPassword}
                                            onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                                            placeholder="Re-enter password"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Backup & Reason */}
                            {authStep === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-red-900">Critical Action Required</p>
                                                <p className="text-sm text-red-800">Data reset is permanent and irreversible. You MUST create a backup before proceeding.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
                                            <Database size={16} />
                                            Create System Backup
                                        </label>
                                        <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-medium text-slate-800">Full System Backup</p>
                                                    <p className="text-xs text-slate-500">Estimated size: 256 MB</p>
                                                </div>
                                                {authData.backupCreated && (
                                                    <CheckCircle size={24} className="text-emerald-600" />
                                                )}
                                            </div>
                                            <button
                                                onClick={handleCreateBackup}
                                                disabled={authData.backupCreated}
                                                className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${authData.backupCreated
                                                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                            >
                                                <Download size={16} />
                                                {authData.backupCreated ? 'Backup Created ✓' : 'Create & Download Backup'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-2 block">Reason for Data Reset</label>
                                        <textarea
                                            value={authData.reasonForReset}
                                            onChange={(e) => setAuthData({ ...authData, reasonForReset: e.target.value })}
                                            placeholder="Provide a detailed reason for this data reset (minimum 20 characters)"
                                            rows="4"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">{authData.reasonForReset.length}/20 characters minimum</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: 2FA & Data Selection */}
                            {authStep === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <div className="flex items-start gap-2">
                                            <Key size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-blue-900">Two-Factor Authentication</p>
                                                <p className="text-sm text-blue-800">A verification code has been sent to your registered email/phone.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-2 block">Verification Code</label>
                                        <input
                                            type="text"
                                            value={authData.verificationCode}
                                            onChange={(e) => setAuthData({ ...authData, verificationCode: e.target.value })}
                                            placeholder="Enter 6-digit code"
                                            maxLength="6"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest font-bold"
                                        />
                                        <p className="text-xs text-slate-500 mt-1 text-center">Demo code: 123456</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 mb-3 block">Select Data Types to Reset</label>
                                        <div className="space-y-3">
                                            {/* Select All */}
                                            <div
                                                onClick={() => handleDataTypeToggle('all')}
                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedDataTypes.all
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDataTypes.all}
                                                            onChange={() => { }}
                                                            className="w-5 h-5"
                                                        />
                                                        <div>
                                                            <p className="font-bold text-red-900">⚠️ Reset ALL Data Types</p>
                                                            <p className="text-xs text-red-700">This will reset entire system data</p>
                                                        </div>
                                                    </div>
                                                    <AlertTriangle size={20} className="text-red-600" />
                                                </div>
                                            </div>

                                            {/* Individual Types */}
                                            {dataTypes.map((type) => (
                                                <div
                                                    key={type.id}
                                                    onClick={() => handleDataTypeToggle(type.id)}
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedDataTypes[type.id]
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDataTypes[type.id]}
                                                            onChange={() => { }}
                                                            className="w-5 h-5"
                                                        />
                                                        <div className="p-2 bg-slate-100 rounded-lg">
                                                            <type.icon size={20} className="text-slate-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-slate-800">{type.name}</p>
                                                            <p className="text-xs text-slate-500">{type.description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500">Records</p>
                                                            <p className="font-bold text-slate-800">{type.records.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 justify-between">
                            <button
                                onClick={() => {
                                    if (authStep > 1) {
                                        setAuthStep(authStep - 1);
                                    } else {
                                        setShowDataResetModal(false);
                                        setAuthStep(1);
                                    }
                                }}
                                className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium"
                            >
                                {authStep === 1 ? 'Cancel' : 'Back'}
                            </button>
                            <button
                                onClick={handleNextStep}
                                disabled={isResetting}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${authStep === 3
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-primary text-white hover:bg-primary-dark'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isResetting ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        {authStep === 3 ? (
                                            <>
                                                <Trash2 size={16} />
                                                RESET DATA
                                            </>
                                        ) : (
                                            'Next Step →'
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
