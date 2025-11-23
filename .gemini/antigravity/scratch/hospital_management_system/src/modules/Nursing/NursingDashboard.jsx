import React, { useState, useMemo } from 'react';
import {
    Stethoscope, ClipboardList, Heart, Activity, Clock, AlertTriangle,
    Pill, FileText, Target, Users, Plus, Filter, Search, BedDouble,
    Thermometer, Droplet, Brain
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import VitalsModal from './components/VitalsModal';
import NursingNoteModal from './components/NursingNoteModal';
import CarePlanModal from './components/CarePlanModal';
import HandoverModal from './components/HandoverModal';
import PatientDetailsModal from './components/PatientDetailsModal';

const NursingDashboard = () => {
    const {
        patients,
        admissions,
        wards,
        beds,
        vitalSigns,
        nursingNotes,
        carePlans,
        handoverReports,
        nursingTasks,
        prescriptions,
        medicationLogs,
        labOrders,
        clinicalRecords,
        setVitalSigns,
        setNursingNotes,
        setCarePlans,
        setHandoverReports,
        setNursingTasks,
        setMedicationLogs,
        setLabOrders
    } = useData();

    // State
    const [activeTab, setActiveTab] = useState('patients');
    const [selectedWard, setSelectedWard] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showCarePlanModal, setShowCarePlanModal] = useState(false);
    const [showHandoverModal, setShowHandoverModal] = useState(false);
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Handler functions
    const handleSaveVitals = (vitalsRecord) => {
        setVitalSigns([...vitalSigns, vitalsRecord]);
        alert('Vitals recorded successfully!');
    };

    const handleSaveNote = (noteRecord) => {
        setNursingNotes([...nursingNotes, noteRecord]);
        alert('Note saved successfully!');
    };

    const handleSaveCarePlan = (carePlan) => {
        setCarePlans([...carePlans, carePlan]);
        alert('Care plan created successfully!');
    };

    const handleSaveHandover = (report) => {
        setHandoverReports([report, ...handoverReports]);
        alert('Handover report created successfully!');
    };

    const handleToggleTask = (taskId) => {
        setNursingTasks(nursingTasks.map(task =>
            task.id === taskId
                ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
                : task
        ));
    };

    const handleAdminister = (prescriptionId, medName, dosage, patientId) => {
        const newLog = {
            id: `MAR-${Date.now()}`,
            prescriptionId,
            patientId,
            medName,
            dosage,
            administeredBy: 'Nurse', // In a real app, this would be the logged-in user
            timestamp: new Date().toISOString(),
            status: 'Administered'
        };
        setMedicationLogs([newLog, ...medicationLogs]);
        alert(`Administered ${medName}`);
    };

    // Get admitted patients with their bed and ward info
    const admittedPatients = useMemo(() => {
        return admissions
            .filter(adm => adm.status === 'Admitted')
            .map(adm => {
                const patient = patients.find(p => p.id === adm.patientId);
                if (!patient) return null;

                const bed = beds.find(b => b.id === adm.bedId);
                const ward = wards.find(w => w.id === adm.wardId);
                const latestVitals = vitalSigns
                    .filter(v => v.patientId === adm.patientId)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const patientCarePlans = carePlans.filter(cp => cp.patientId === adm.patientId && cp.status === 'Active');

                return {
                    ...patient,
                    admission: adm,
                    bed: bed?.number || 'N/A',
                    bedId: bed?.id,
                    ward: ward?.name || 'Unknown Ward',
                    wardId: ward?.id,
                    diagnosis: adm.diagnosis,
                    latestVitals,
                    carePlansCount: patientCarePlans.length
                };
            })
            .filter(Boolean);
    }, [admissions, patients, beds, wards, vitalSigns, carePlans]);

    // Filter patients by ward and search query
    const filteredPatients = useMemo(() => {
        let result = admittedPatients;

        // Filter by ward
        if (selectedWard !== 'all') {
            result = result.filter(p => p.wardId === selectedWard);
        }

        // Filter by search query
        if (searchQuery) {
            result = result.filter(p =>
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.bed?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [admittedPatients, selectedWard, searchQuery]);

    // Get critical alerts
    const criticalAlerts = useMemo(() => {
        const alerts = [];
        admittedPatients.forEach(patient => {
            if (patient.latestVitals) {
                const vitals = patient.latestVitals;
                // Check for abnormal vitals
                if (vitals.spo2 < 90) {
                    alerts.push({ patient, type: 'critical', message: `Low SpO2: ${vitals.spo2}%` });
                }
                if (vitals.hr > 120 || vitals.hr < 50) {
                    alerts.push({ patient, type: 'warning', message: `Abnormal HR: ${vitals.hr} bpm` });
                }
                if (vitals.temp > 38.5) {
                    alerts.push({ patient, type: 'warning', message: `Fever: ${vitals.temp}°C` });
                }
                const bpSys = parseInt(vitals.bp?.split('/')[0] || '0');
                if (bpSys > 180 || bpSys < 90) {
                    alerts.push({ patient, type: 'critical', message: `Abnormal BP: ${vitals.bp}` });
                }
            }
        });
        return alerts.slice(0, 5); // Show top 5 alerts
    }, [admittedPatients]);

    // Render vital signs badge
    const renderVitalsBadge = (vitals) => {
        if (!vitals) return <span className="text-xs text-slate-400">No vitals recorded</span>;

        const getVitalColor = () => {
            if (vitals.spo2 < 90 || vitals.hr > 120 || vitals.hr < 50) return 'text-red-600';
            if (vitals.spo2 < 95 || vitals.temp > 37.5) return 'text-yellow-600';
            return 'text-green-600';
        };

        return (
            <div className={`flex items-center gap-1 ${getVitalColor()}`}>
                <Activity size={12} />
                <span className="text-xs font-medium">
                    {new Date(vitals.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Nursing Station</h1>
                    <p className="text-slate-500">Ward management and patient care</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowVitalsModal(true)}
                        className="btn btn-primary gap-2"
                    >
                        <Thermometer size={20} />
                        Record Vitals
                    </button>
                </div>
            </div>

            {/* Critical Alerts Banner */}
            {criticalAlerts.length > 0 && (
                <div className="card p-4 bg-red-50 border-red-100 border">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-3">
                        <AlertTriangle size={20} />
                        Critical Alerts ({criticalAlerts.length})
                    </h3>
                    <div className="space-y-2">
                        {criticalAlerts.slice(0, 3).map((alert, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 hs-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <div>
                                        <p className="font-medium text-slate-800">{alert.patient.name} ({alert.patient.bed})</p>
                                        <p className="text-xs text-red-600">{alert.message}</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
                                    Attend
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="card">
                <div className="border-b border-slate-100 px-4 overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                        {[
                            { id: 'patients', label: 'My Patients', icon: Users },
                            { id: 'vitals', label: 'Vitals', icon: Activity },
                            { id: 'medications', label: 'Medications', icon: Pill },
                            { id: 'orders', label: 'Orders', icon: Stethoscope },
                            { id: 'notes', label: 'Notes', icon: FileText },
                            { id: 'careplans', label: 'Care Plans', icon: Target },
                            { id: 'handover', label: 'Handover', icon: ClipboardList },
                            { id: 'tasks', label: 'Tasks', icon: Clock }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Patients Tab */}
                    {activeTab === 'patients' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {admittedPatients.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-slate-500">
                                    <Users size={48} className="mx-auto mb-3 text-slate-300" />
                                    <p>No admitted patients found.</p>
                                </div>
                            ) : (
                                admittedPatients
                                    .filter(p => {
                                        const patient = patients.find(pat => pat.id === p.patientId);
                                        if (selectedWard !== 'all' && p.wardId !== selectedWard) return false;
                                        if (searchQuery && !patient?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                                        return true;
                                    })
                                    .map(patient => {
                                        const patientVitals = patient.latestVitals;

                                        return (
                                            <div key={patient.admission.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {patient.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{patient.name}</h4>
                                                            <p className="text-xs text-slate-500">{patient.age}y • {patient.gender}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                        {patient.ward} - {patient.bed}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                                    <div className="bg-slate-50 p-2 rounded">
                                                        <p className="text-xs text-slate-500">Latest BP</p>
                                                        <p className="font-bold text-slate-700">{patientVitals?.bp || '--/--'}</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded">
                                                        <p className="text-xs text-slate-500">HR / SpO2</p>
                                                        <p className="font-bold text-slate-700">
                                                            {patientVitals?.hr || '--'} / {patientVitals?.spo2 || '--'}%
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(patient);
                                                            setShowVitalsModal(true);
                                                        }}
                                                        className="flex-1 btn btn-outline btn-sm text-xs"
                                                    >
                                                        Vitals
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(patient);
                                                            setShowPatientDetailsModal(true);
                                                        }}
                                                        className="flex-1 btn btn-outline btn-sm text-xs"
                                                    >
                                                        EMR
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(patient);
                                                            setShowNoteModal(true);
                                                        }}
                                                        className="flex-1 btn btn-primary btn-sm text-xs"
                                                    >
                                                        Note
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    )}
                    {/* Vitals Tab */}
                    {
                        activeTab === 'vitals' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800">Vital Signs History</h3>
                                    <button
                                        onClick={() => setShowVitalsModal(true)}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Plus size={16} />
                                        Record Vitals
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Date/Time</th>
                                                <th className="p-3">Patient</th>
                                                <th className="p-3">BP</th>
                                                <th className="p-3">HR</th>
                                                <th className="p-3">Temp</th>
                                                <th className="p-3">SpO2</th>
                                                <th className="p-3">RR</th>
                                                <th className="p-3">Pain</th>
                                                <th className="p-3">Recorded By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {vitalSigns.length === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="p-8 text-center text-slate-500">No vitals recorded</td>
                                                </tr>
                                            ) : (
                                                vitalSigns
                                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                    .map(vs => {
                                                        const patient = patients.find(p => p.id === vs.patientId);
                                                        if (searchQuery && !patient?.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;

                                                        return (
                                                            <tr key={vs.id} className="hover:bg-slate-50">
                                                                <td className="p-3 text-slate-600">
                                                                    {new Date(vs.timestamp).toLocaleString()}
                                                                </td>
                                                                <td className="p-3 font-medium text-slate-800">
                                                                    {patient?.name || vs.patientId}
                                                                </td>
                                                                <td className="p-3">{vs.bp}</td>
                                                                <td className={`p-3 ${vs.hr > 100 || vs.hr < 60 ? 'text-red-600 font-bold' : ''}`}>{vs.hr}</td>
                                                                <td className={`p-3 ${vs.temp > 37.5 ? 'text-red-600 font-bold' : ''}`}>{vs.temp}°C</td>
                                                                <td className={`p-3 ${vs.spo2 < 95 ? 'text-red-600 font-bold' : ''}`}>{vs.spo2}%</td>
                                                                <td className="p-3">{vs.rr}</td>
                                                                <td className="p-3">{vs.painScore}/10</td>
                                                                <td className="p-3 text-slate-500">{vs.recordedBy}</td>
                                                            </tr>
                                                        );
                                                    })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {/* Medications Tab */}
                    {
                        activeTab === 'medications' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Medication Administration Record</h3>
                                <div className="space-y-3">
                                    {prescriptions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Pill className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No active prescriptions</p>
                                        </div>
                                    ) : (
                                        prescriptions.map(rx => (
                                            <div key={rx.id} className="border border-slate-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{rx.patientName}</h4>
                                                        <p className="text-sm text-slate-500">Dr. {rx.doctor} • {rx.date}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-bold rounded ${rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        {rx.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {rx.medications.map((med, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded">
                                                            <div>
                                                                <p className="font-medium text-slate-700">{med.name}</p>
                                                                <p className="text-xs text-slate-500">{med.dosage}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAdminister(rx.id, med.name, med.dosage, rx.patientId)}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Administer
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Orders Tab */}
                    {
                        activeTab === 'orders' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Active Orders</h3>
                                <div className="space-y-3">
                                    {labOrders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Stethoscope className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No active orders</p>
                                        </div>
                                    ) : (
                                        labOrders.map(order => {
                                            const patient = patients.find(p => p.id === order.patientId);
                                            return (
                                                <div key={order.id} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{patient?.name || 'Unknown'}</h4>
                                                            <p className="text-sm text-slate-500">{order.type} • {order.doctor}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-slate-700">{order.test}</p>
                                                            <p className="text-xs text-slate-500">{new Date(order.date).toLocaleString()}</p>
                                                        </div>
                                                        {order.status === 'Pending' && (
                                                            <button
                                                                onClick={() => {
                                                                    const updatedOrders = labOrders.map(o =>
                                                                        o.id === order.id ? { ...o, status: 'Completed' } : o
                                                                    );
                                                                    setLabOrders(updatedOrders);
                                                                    alert('Order marked as completed');
                                                                }}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Notes Tab */}
                    {
                        activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800">Nursing Notes</h3>
                                    <button
                                        onClick={() => setShowNoteModal(true)}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Plus size={16} />
                                        New Note
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {nursingNotes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No nursing notes yet</p>
                                        </div>
                                    ) : (
                                        nursingNotes
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map(note => {
                                                const patient = patients.find(p => p.id === note.patientId);
                                                return (
                                                    <div key={note.id} className="border border-slate-200 rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-slate-800">{patient?.name || 'Unknown Patient'}</h4>
                                                                <p className="text-sm text-slate-500">{note.nurseName} • {new Date(note.timestamp).toLocaleString()}</p>
                                                            </div>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                                {note.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-700">{note.note}</p>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Care Plans Tab */}
                    {
                        activeTab === 'careplans' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800">Active Care Plans</h3>
                                    <button
                                        onClick={() => setShowCarePlanModal(true)}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Plus size={16} />
                                        New Care Plan
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {carePlans.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Target className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No active care plans</p>
                                        </div>
                                    ) : (
                                        carePlans.map(plan => {
                                            const patient = patients.find(p => p.id === plan.patientId);
                                            return (
                                                <div key={plan.id} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{patient?.name || 'Unknown'}</h4>
                                                            <p className="text-sm text-slate-500">{plan.diagnosis}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${plan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {plan.status}
                                                        </span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <p className="text-xs font-bold text-slate-600">Goal:</p>
                                                        <p className="text-sm text-slate-700">{plan.goal}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-600">Interventions:</p>
                                                        <ul className="list-disc list-inside text-sm text-slate-700">
                                                            {plan.interventions.map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Handover Tab */}
                    {
                        activeTab === 'handover' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800">Shift Handover Reports</h3>
                                    <button
                                        onClick={() => setShowHandoverModal(true)}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Plus size={16} />
                                        New Handover
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {handoverReports.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ClipboardList className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No handover reports</p>
                                        </div>
                                    ) : (
                                        handoverReports
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map(report => (
                                                <div key={report.id} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{report.shift} Shift Handover</h4>
                                                            <p className="text-sm text-slate-500">
                                                                {new Date(report.timestamp).toLocaleDateString()} • {report.nurseName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                                        <div className="bg-slate-50 p-3 rounded">
                                                            <p className="text-xs font-bold text-slate-600 mb-1">Summary</p>
                                                            <p className="text-sm text-slate-700">{report.summary}</p>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded">
                                                            <p className="text-xs font-bold text-slate-600 mb-1">Critical Patients</p>
                                                            <p className="text-sm text-slate-700">{report.criticalPatients}</p>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded">
                                                            <p className="text-xs font-bold text-slate-600 mb-1">Pending Tasks</p>
                                                            <p className="text-sm text-slate-700">{report.pendingTasks}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Tasks Tab */}
                    {
                        activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Nursing Tasks</h3>
                                <div className="space-y-3">
                                    {nursingTasks.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Clock className="mx-auto text-slate-300 mb-3" size={48} />
                                            <p className="text-slate-500">No pending tasks</p>
                                        </div>
                                    ) : (
                                        nursingTasks
                                            .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
                                            .map(task => {
                                                const patient = patients.find(p => p.id === task.patientId);
                                                return (
                                                    <div key={task.id} className={`border border-slate-200 rounded-lg p-4 flex items-center justify-between ${task.status === 'Completed' ? 'bg-slate-50 opacity-75' : 'bg-white'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.status === 'Completed'}
                                                                onChange={() => handleToggleTask(task.id)}
                                                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                                                            />
                                                            <div>
                                                                <p className={`font-medium ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                                                    {task.description}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {patient?.name} • {new Date(task.scheduledTime).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-slate-400">{task.taskType}</span>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div >

                {/* Modals */}
                {
                    showVitalsModal && (
                        <VitalsModal
                            patients={admittedPatients}
                            onClose={() => {
                                setShowVitalsModal(false);
                                setSelectedPatient(null);
                            }}
                            onSave={handleSaveVitals}
                            initialPatient={selectedPatient}
                        />
                    )
                }

                {
                    showNoteModal && (
                        <NursingNoteModal
                            patients={admittedPatients}
                            onClose={() => setShowNoteModal(false)}
                            onSave={handleSaveNote}
                            initialPatient={selectedPatient}
                        />
                    )
                }

                {
                    showCarePlanModal && (
                        <CarePlanModal
                            patients={admittedPatients}
                            onClose={() => setShowCarePlanModal(false)}
                            onSave={handleSaveCarePlan}
                        />
                    )
                }

                {
                    showHandoverModal && (
                        <HandoverModal
                            onClose={() => setShowHandoverModal(false)}
                            onSave={handleSaveHandover}
                        />
                    )
                }

                {
                    showPatientDetailsModal && (
                        <PatientDetailsModal
                            patient={selectedPatient}
                            onClose={() => setShowPatientDetailsModal(false)}
                            vitalSigns={vitalSigns}
                            nursingNotes={nursingNotes}
                            clinicalRecords={clinicalRecords}
                            carePlans={carePlans}
                        />
                    )
                }
            </div >
        </div >
    );
};

export default NursingDashboard;
