import React, { useState } from 'react';
import { FileText, Activity, Clock, Search, Plus, User, Heart, Pill, AlertTriangle, Thermometer, Calendar, Stethoscope, FileBarChart, MessageSquare, Printer, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';

const EMRDashboard = () => {
    const { patients, clinicalNotes = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showNewNoteModal, setShowNewNoteModal] = useState(false);

    // Filter patients
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone && patient.phone.includes(searchTerm))
    );

    // Get patient's clinical notes
    const getPatientNotes = (patientId) => {
        return clinicalNotes.filter(note => note.patientId === patientId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'clinical-notes', label: 'Clinical Notes', icon: MessageSquare },
        { id: 'medications', label: 'Medications', icon: Pill },
        { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
        { id: 'vitals', label: 'Vital Signs', icon: Activity },
        { id: 'lab-results', label: 'Lab Results', icon: FileBarChart },
        { id: 'history', label: 'Medical History', icon: Clock },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Electronic Medical Records</h1>
                    <p className="text-slate-500">Comprehensive patient medical records and clinical documentation</p>
                </div>
                {selectedPatient && (
                    <div className="flex gap-3">
                        <button className="btn btn-secondary gap-2">
                            <Printer size={16} />
                            Print EMR
                        </button>
                        <button className="btn btn-secondary gap-2">
                            <Download size={16} />
                            Export
                        </button>
                        <button
                            onClick={() => setShowNewNoteModal(true)}
                            className="btn btn-primary gap-2"
                        >
                            <Plus size={16} />
                            New Clinical Note
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient List Sidebar */}
                <div className="lg:col-span-1">
                    <div className="card p-4">
                        <div className="mb-4">
                            <div className="relative">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {filteredPatients.map(patient => (
                                <div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedPatient?.id === patient.id
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-50 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedPatient?.id === patient.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-primary/10 text-primary'
                                            }`}>
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{patient.name}</p>
                                            <p className={`text-xs truncate ${selectedPatient?.id === patient.id ? 'text-white/80' : 'text-slate-500'
                                                }`}>
                                                {patient.id} • {patient.gender} • {patient.age}y
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patient EMR Content */}
                <div className="lg:col-span-2">
                    {selectedPatient ? (
                        <div className="space-y-6">
                            {/* Patient Header Card */}
                            <div className="card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                                            {selectedPatient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                                <span>ID: {selectedPatient.id}</span>
                                                <span>•</span>
                                                <span>{selectedPatient.gender}</span>
                                                <span>•</span>
                                                <span>{selectedPatient.age} years old</span>
                                                <span>•</span>
                                                <span>{selectedPatient.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                        Active
                                    </span>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{getPatientNotes(selectedPatient.id).length}</p>
                                        <p className="text-xs text-slate-500">Clinical Notes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">0</p>
                                        <p className="text-xs text-slate-500">Medications</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">0</p>
                                        <p className="text-xs text-slate-500">Allergies</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-600">0</p>
                                        <p className="text-xs text-slate-500">Lab Tests</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="card p-2">
                                <div className="flex gap-2 overflow-x-auto">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                                        ? 'bg-primary text-white'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="card p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800">Patient Overview</h3>

                                        {/* Demographics */}
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-3">Demographics</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-500">Date of Birth</p>
                                                    <p className="font-medium">{selectedPatient.dateOfBirth || 'Not recorded'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Blood Type</p>
                                                    <p className="font-medium">{selectedPatient.bloodType || 'Not recorded'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Address</p>
                                                    <p className="font-medium">{selectedPatient.address || 'Not recorded'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Emergency Contact</p>
                                                    <p className="font-medium">{selectedPatient.emergencyContact || 'Not recorded'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Activity */}
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-3">Recent Activity</h4>
                                            <div className="space-y-3">
                                                {getPatientNotes(selectedPatient.id).slice(0, 3).map(note => (
                                                    <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-slate-800">{note.noteType}</span>
                                                            <span className="text-xs text-slate-500">
                                                                {new Date(note.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600">{note.chiefComplaint}</p>
                                                    </div>
                                                ))}
                                                {getPatientNotes(selectedPatient.id).length === 0 && (
                                                    <p className="text-slate-500 text-center py-4">No recent activity</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'clinical-notes' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-800">Clinical Notes</h3>
                                            <button
                                                onClick={() => setShowNewNoteModal(true)}
                                                className="text-primary hover:text-primary-dark font-medium text-sm"
                                            >
                                                + Add Note
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {getPatientNotes(selectedPatient.id).map(note => (
                                                <div key={note.id} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-800">{note.noteType}</h4>
                                                            <p className="text-sm text-slate-500">
                                                                {new Date(note.createdAt).toLocaleString()} • {note.createdBy}
                                                            </p>
                                                        </div>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                            {note.noteType}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <p className="font-medium text-slate-700">Chief Complaint:</p>
                                                            <p className="text-slate-600">{note.chiefComplaint}</p>
                                                        </div>
                                                        {note.diagnosis && (
                                                            <div>
                                                                <p className="font-medium text-slate-700">Diagnosis:</p>
                                                                <p className="text-slate-600">{note.diagnosis}</p>
                                                            </div>
                                                        )}
                                                        {note.treatment && (
                                                            <div>
                                                                <p className="font-medium text-slate-700">Treatment:</p>
                                                                <p className="text-slate-600">{note.treatment}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {getPatientNotes(selectedPatient.id).length === 0 && (
                                                <div className="text-center py-12">
                                                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
                                                    <p className="text-slate-500">No clinical notes recorded</p>
                                                    <button
                                                        onClick={() => setShowNewNoteModal(true)}
                                                        className="mt-4 text-primary hover:text-primary-dark font-medium"
                                                    >
                                                        Add First Note
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'medications' && (
                                    <div className="text-center py-12">
                                        <Pill size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500">No medications recorded</p>
                                    </div>
                                )}

                                {activeTab === 'allergies' && (
                                    <div className="text-center py-12">
                                        <AlertTriangle size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500">No allergies recorded</p>
                                    </div>
                                )}

                                {activeTab === 'vitals' && (
                                    <div className="text-center py-12">
                                        <Activity size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500">No vital signs recorded</p>
                                    </div>
                                )}

                                {activeTab === 'lab-results' && (
                                    <div className="text-center py-12">
                                        <FileBarChart size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500">No lab results available</p>
                                        <p className="text-sm text-slate-400 mt-2">Lab results are automatically added when tests are completed</p>
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="text-center py-12">
                                        <Clock size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500">No medical history recorded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <User size={64} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Patient Selected</h3>
                            <p className="text-slate-500">Select a patient from the list to view their medical records</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EMRDashboard;
