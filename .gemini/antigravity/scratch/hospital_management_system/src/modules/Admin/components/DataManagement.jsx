import React from 'react';
import { Database, Download, Upload, BarChart3, PieChart, HardDrive } from 'lucide-react';

const DataManagement = ({ dataCounts = {}, backupHistory = [], setBackupHistory, showToast }) => {
    const handleFullBackup = () => {
        const backup = {
            timestamp: new Date().toISOString(),
            data: dataCounts,
            totalRecords: dataCounts.total || 0
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HMS_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // Add to backup history
        const newBackup = {
            id: `BKP-${String(backupHistory.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString(),
            size: `${Math.round((dataStr.length / 1024 / 1024) * 100) / 100} MB`,
            type: 'Full Backup',
            status: 'Completed'
        };
        setBackupHistory([newBackup, ...backupHistory]);
        showToast('Full backup created and downloaded successfully!', 'success');
    };

    const dataTypeStats = [
        { name: 'Patients', count: dataCounts.patients || 0, color: 'blue' },
        { name: 'Financial Records', count: dataCounts.financial || 0, color: 'emerald' },
        { name: 'Clinical Records', count: dataCounts.clinical || 0, color: 'purple' },
        { name: 'Users', count: dataCounts.users || 0, color: 'amber' },
        { name: 'Insurance', count: dataCounts.insurance || 0, color: 'indigo' },
        { name: 'Services', count: dataCounts.services || 0, color: 'teal' },
        { name: 'Debt Records', count: dataCounts.debt || 0, color: 'red' },
        { name: 'Wallet Data', count: dataCounts.wallet || 0, color: 'orange' },
    ];

    const totalRecords = dataCounts.total || 0;
    const estimatedSize = `${Math.round((totalRecords * 0.5) / 1024 * 100) / 100} MB`;

    return (
        <div className="space-y-6">
            {/* Database Overview */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Database Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                        <HardDrive size={32} className="mb-3 opacity-80" />
                        <p className="text-blue-100 text-sm font-medium">Total Records</p>
                        <p className="text-4xl font-bold">{totalRecords.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                        <Database size={32} className="mb-3 opacity-80" />
                        <p className="text-emerald-100 text-sm font-medium">Estimated Size</p>
                        <p className="text-4xl font-bold">{estimatedSize}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                        <BarChart3 size={32} className="mb-3 opacity-80" />
                        <p className="text-purple-100 text-sm font-medium">Data Types</p>
                        <p className="text-4xl font-bold">{dataTypeStats.length}</p>
                    </div>
                </div>
            </div>

            {/* Backup Management */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Backup Management</h2>
                    <button
                        onClick={handleFullBackup}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Download size={18} />
                        Create Full Backup
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Backup ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {backupHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <Database size={48} className="mx-auto mb-2 text-slate-300" />
                                        <p>No backups created yet</p>
                                    </td>
                                </tr>
                            ) : (
                                backupHistory.map(backup => (
                                    <tr key={backup.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-slate-600">{backup.id}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(backup.date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{backup.type}</td>
                                        <td className="px-6 py-4 text-slate-600">{backup.size}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                                {backup.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Database Statistics */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Database Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dataTypeStats.map(stat => (
                        <div key={stat.name} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-700 text-sm">{stat.name}</h3>
                                <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`}></div>
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{stat.count.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Records</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Export */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Upload size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-blue-900 mb-2">Data Export & Import</h3>
                        <p className="text-sm text-blue-700 mb-4">
                            Export specific data types or import data from backup files. Contact system administrator for advanced data operations.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleFullBackup}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                            >
                                Export All Data
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 font-medium text-sm"
                                onClick={() => showToast('Import feature coming soon', 'error')}
                            >
                                Import Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
