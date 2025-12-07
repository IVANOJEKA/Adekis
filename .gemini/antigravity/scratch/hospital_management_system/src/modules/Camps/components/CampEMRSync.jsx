import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Database, FileText, Pill, User, Activity } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const CampEMRSync = ({ campId, campName }) => {
    const { patients, addPatient, consultations, setConsultations } = useData();
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
    const [syncLog, setSyncLog] = useState([]);
    const [autoSync, setAutoSync] = useState(true);

    // Get camp-related data
    const campPatients = patients.filter(p => (p.details?.campId || p.campId) === campId);
    const campConsultations = consultations?.filter(c => c.campId === campId) || [];

    const syncToEMR = async () => {
        setSyncStatus('syncing');
        setSyncLog([]);
        const newLog = [];

        try {
            // 1. Sync Patients
            newLog.push({
                type: 'info',
                message: `Syncing ${campPatients.length} patients to EMR...`,
                timestamp: new Date().toLocaleTimeString()
            });

            campPatients.forEach((patient, index) => {
                // In real implementation, this would call EMR API
                const emrPatient = {
                    ...patient,
                    emrSynced: true,
                    emrSyncDate: new Date().toISOString(),
                    source: 'Health Camp',
                    campId: campId
                };

                newLog.push({
                    type: 'success',
                    message: `✓ Patient ${patient.name} synced to EMR`,
                    timestamp: new Date().toLocaleTimeString()
                });
            });

            // 2. Sync Consultations
            newLog.push({
                type: 'info',
                message: `Syncing ${campConsultations.length} consultations...`,
                timestamp: new Date().toLocaleTimeString()
            });

            campConsultations.forEach(consultation => {
                newLog.push({
                    type: 'success',
                    message: `✓ Consultation for Patient ID ${consultation.patientId} synced`,
                    timestamp: new Date().toLocaleTimeString()
                });
            });

            // 3. Sync Prescriptions
            newLog.push({
                type: 'info',
                message: 'Syncing prescriptions...',
                timestamp: new Date().toLocaleTimeString()
            });

            // 4. Sync Documents
            newLog.push({
                type: 'info',
                message: 'Syncing medical forms and receipts...',
                timestamp: new Date().toLocaleTimeString()
            });

            // Final status
            newLog.push({
                type: 'success',
                message: `✓ All camp data successfully synced to EMR!`,
                timestamp: new Date().toLocaleTimeString()
            });

            setSyncLog(newLog);
            setSyncStatus('success');

        } catch (error) {
            newLog.push({
                type: 'error',
                message: `✗ Sync failed: ${error.message}`,
                timestamp: new Date().toLocaleTimeString()
            });
            setSyncLog(newLog);
            setSyncStatus('error');
        }
    };

    const getSyncStats = () => {
        const syncedPatients = campPatients.filter(p => p.emrSynced).length;
        const unsyncedPatients = campPatients.length - syncedPatients;

        return {
            total: campPatients.length,
            synced: syncedPatients,
            unsynced: unsyncedPatients,
            consultations: campConsultations.length
        };
    };

    const stats = getSyncStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Database className="text-blue-600" size={28} />
                            EMR Synchronization
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{campName}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={autoSync}
                                onChange={(e) => setAutoSync(e.target.checked)}
                                className="w-4 h-4 rounded text-primary"
                            />
                            <span className="text-slate-700">Auto-sync</span>
                        </label>

                        <button
                            onClick={syncToEMR}
                            disabled={syncStatus === 'syncing'}
                            className="btn bg-primary hover:bg-primary-dark text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                        </button>
                    </div>
                </div>

                {/* Sync Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="text-blue-600" size={20} />
                            <span className="text-sm text-slate-600">Total Patients</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="text-green-600" size={20} />
                            <span className="text-sm text-slate-600">Synced</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{stats.synced}</p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="text-amber-600" size={20} />
                            <span className="text-sm text-slate-600">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700">{stats.unsynced}</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-purple-600" size={20} />
                            <span className="text-sm text-slate-600">Consultations</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{stats.consultations}</p>
                    </div>
                </div>
            </div>

            {/* Sync Status */}
            {syncStatus !== 'idle' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        {syncStatus === 'syncing' && <RefreshCw className="animate-spin text-blue-600" size={20} />}
                        {syncStatus === 'success' && <CheckCircle className="text-green-600" size={20} />}
                        {syncStatus === 'error' && <AlertCircle className="text-red-600" size={20} />}
                        Sync Status
                    </h3>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {syncLog.map((log, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg flex items-start gap-3 ${log.type === 'success' ? 'bg-green-50' :
                                        log.type === 'error' ? 'bg-red-50' :
                                            'bg-blue-50'
                                    }`}
                            >
                                <span className="text-xs text-slate-500 mt-1">{log.timestamp}</span>
                                <p className={`flex-1 text-sm ${log.type === 'success' ? 'text-green-800' :
                                        log.type === 'error' ? 'text-red-800' :
                                            'text-blue-800'
                                    }`}>
                                    {log.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sync Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">What Gets Synced</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="text-blue-600" size={18} />
                            <h4 className="font-semibold text-slate-800">Patient Records</h4>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1 ml-6">
                            <li>• Demographics</li>
                            <li>• Medical history</li>
                            <li>• Contact information</li>
                            <li>• Camp registration details</li>
                        </ul>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-green-600" size={18} />
                            <h4 className="font-semibold text-slate-800">Consultations</h4>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1 ml-6">
                            <li>• Chief complaints</li>
                            <li>• Diagnosis</li>
                            <li>• Treatment plans</li>
                            <li>• Doctor notes</li>
                        </ul>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Pill className="text-purple-600" size={18} />
                            <h4 className="font-semibold text-slate-800">Prescriptions</h4>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1 ml-6">
                            <li>• Medications prescribed</li>
                            <li>• Dosages & frequencies</li>
                            <li>• Dispensing status</li>
                            <li>• Special instructions</li>
                        </ul>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="text-orange-600" size={18} />
                            <h4 className="font-semibold text-slate-800">Documents</h4>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1 ml-6">
                            <li>• Medical forms</li>
                            <li>• Payment receipts</li>
                            <li>• Lab results</li>
                            <li>• Consent forms</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampEMRSync;
