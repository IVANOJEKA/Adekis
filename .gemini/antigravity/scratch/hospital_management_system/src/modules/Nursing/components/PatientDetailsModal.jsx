import React, { useState } from 'react';
import { X, Activity, FileText, Clipboard, AlertCircle, Calendar, User } from 'lucide-react';

const PatientDetailsModal = ({ patient, onClose, vitalSigns, nursingNotes, clinicalRecords, carePlans }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!patient) return null;

    const patientVitals = vitalSigns.filter(v => v.patientId === patient.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const patientNotes = nursingNotes.filter(n => n.patientId === patient.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const patientClinical = clinicalRecords.filter(c => c.patientId === patient.id);
    const patientCarePlans = carePlans.filter(c => c.patientId === patient.id);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                            <div className="flex items-center gap-3 text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><User size={14} /> {patient.gender}, {patient.age} yrs</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> ID: {patient.id}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6">
                    {['overview', 'vitals', 'notes', 'emr', 'care_plans'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'emr' ? 'EMR' : tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-red-500" />
                                    Allergies & Alerts
                                </h3>
                                <div className="space-y-2">
                                    <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm font-medium">
                                        Penicillin Allergy
                                    </div>
                                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm font-medium">
                                        Fall Risk
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Admission Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Admission Date</span>
                                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ward/Bed</span>
                                        <span className="font-medium">General Ward A / Bed 01</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Doctor</span>
                                        <span className="font-medium">Dr. Sarah Wilson</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vitals' && (
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Date/Time</th>
                                        <th className="p-3">BP</th>
                                        <th className="p-3">HR</th>
                                        <th className="p-3">Temp</th>
                                        <th className="p-3">SpO2</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {patientVitals.map(vs => (
                                        <tr key={vs.id}>
                                            <td className="p-3">{new Date(vs.timestamp).toLocaleString()}</td>
                                            <td className="p-3">{vs.bp}</td>
                                            <td className="p-3">{vs.hr}</td>
                                            <td className="p-3">{vs.temp}°C</td>
                                            <td className="p-3">{vs.spo2}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-4">
                            {patientNotes.map(note => (
                                <div key={note.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-700">{note.category}</span>
                                        <span className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{note.note}</p>
                                    <div className="mt-2 text-xs text-slate-400">By: {note.nurseName}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'emr' && (
                        <div className="space-y-4">
                            {patientClinical.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No clinical records found.</p>
                            ) : (
                                patientClinical.map(record => (
                                    <div key={record.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-700">{record.test || record.exam || record.medication}</span>
                                            <span className="text-xs text-slate-500">{record.date}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">Result/Dosage: {record.result || record.dosage}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'care_plans' && (
                        <div className="space-y-4">
                            {patientCarePlans.map(plan => (
                                <div key={plan.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800">{plan.diagnosis}</h4>
                                    <p className="text-sm text-slate-600 mt-1">Goal: {plan.goal}</p>
                                    <ul className="list-disc list-inside mt-2 text-sm text-slate-500">
                                        {plan.interventions.map((intervention, idx) => (
                                            <li key={idx}>{intervention}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;
