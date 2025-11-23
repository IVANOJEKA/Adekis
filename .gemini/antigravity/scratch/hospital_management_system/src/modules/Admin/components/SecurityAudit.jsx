import React, { useState } from 'react';
import { Shield, Calendar, Download, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const SecurityAudit = ({
    auditLogs = [],
    loginHistory = [],
    securitySettings = {},
    setSecuritySettings,
    showToast
}) => {
    const [auditSearchTerm, setAuditSearchTerm] = useState('');
    const [loginSearchTerm, setLoginSearchTerm] = useState('');
    const [auditFilter, setAuditFilter] = useState('All');

    const handleSecuritySettingChange = (setting, value) => {
        const updated = { ...securitySettings, [setting]: value };
        setSecuritySettings(updated);
        showToast(`Security setting updated: ${setting}`, 'success');
    };

    const exportAuditLog = () => {
        const dataStr = JSON.stringify(auditLogs, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Audit_Log_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Audit log exported successfully', 'success');
    };

    const filteredAuditLogs = auditLogs.filter(log => {
        const matchesSearch = log.user?.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
            log.target?.toLowerCase().includes(auditSearchTerm.toLowerCase());
        const matchesFilter = auditFilter === 'All' ||
            (auditFilter === 'Success' && log.status === 'Success') ||
            (auditFilter === 'Failed' && log.status === 'Failed');
        return matchesSearch && matchesFilter;
    });

    const filteredLoginHistory = loginHistory.filter(log =>
        log.user?.toLowerCase().includes(loginSearchTerm.toLowerCase()) ||
        log.device?.toLowerCase().includes(loginSearchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Security Policies */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Security Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800">Password Strength</h3>
                                <p className="text-sm text-slate-500">Enforce strong password requirements</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={securitySettings.passwordStrength || false}
                                    onChange={(e) => handleSecuritySettingChange('passwordStrength', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <p className="text-xs text-slate-600">
                            {securitySettings.passwordStrength ? '✓ Enabled' : '✗ Disabled'}
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800">Session Timeout</h3>
                            <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
                        </div>
                        <select
                            value={securitySettings.sessionTimeout || 30}
                            onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                            <option value={240}>4 hours</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800">Max Failed Logins</h3>
                            <p className="text-sm text-slate-500">Attempts before account lockout</p>
                        </div>
                        <select
                            value={securitySettings.maxFailedLogins || 5}
                            onChange={(e) => handleSecuritySettingChange('maxFailedLogins', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={3}>3 attempts</option>
                            <option value={5}>5 attempts</option>
                            <option value={10}>10 attempts</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800">Two-Factor Authentication</h3>
                                <p className="text-sm text-slate-500">Additional security layer</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={securitySettings.twoFactorAuth || false}
                                    onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <p className="text-xs text-slate-600">
                            {securitySettings.twoFactorAuth ? '✓ Enabled' : '✗ Disabled'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Audit Log */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Audit Log</h2>
                    <button
                        onClick={exportAuditLog}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export Log
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search audit logs..."
                            value={auditSearchTerm}
                            onChange={(e) => setAuditSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <select
                        value={auditFilter}
                        onChange={(e) => setAuditFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Success">Success Only</option>
                        <option value="Failed">Failed Only</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Target</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAuditLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Shield size={48} className="mx-auto mb-2 text-slate-300" />
                                        <p>No audit logs found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredAuditLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                                        <td className="px-6 py-4 text-slate-600">{log.action}</td>
                                        <td className="px-6 py-4 text-slate-600">{log.target}</td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">{log.ipAddress}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === 'Success'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Login History */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Login History</h2>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search login history..."
                        value={loginSearchTerm}
                        onChange={(e) => setLoginSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Login Time</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Device</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLoginHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <Calendar size={48} className="mx-auto mb-2 text-slate-300" />
                                        <p>No login history found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLoginHistory.map(log => (
                                    <tr key={log.id} className={`hover:bg-slate-50 ${log.status === 'Failed' ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(log.loginTime).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">{log.ipAddress}</td>
                                        <td className="px-6 py-4 text-slate-600">{log.device}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${log.status === 'Success'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.status === 'Success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityAudit;
