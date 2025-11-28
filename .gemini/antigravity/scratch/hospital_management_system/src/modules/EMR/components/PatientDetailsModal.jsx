import React, { useState } from 'react';
import { X, FileText, Activity, CreditCard, Calendar, User, Phone, Pill, Stethoscope, Heart, ClipboardList, AlertCircle, Bed, TestTube, FolderOpen } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';

const PatientDetailsModal = ({ patient, onClose }) => {
    const {
        financialRecords = [],
        prescriptions = [],
        medicationLogs = [],
        admissions = [],
        vitalSigns = [],
        nursingNotes = [],
        carePlans = [],
        cases = [],
        clinicalRecords = []
    } = useData();

    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('overview');

    // Patient data aggregation
    const patientBills = financialRecords.filter(r => r.patientId === patient.id);
    const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
    const patientMedicationLogs = medicationLogs.filter(m => m.patientId === patient.id);
    const patientAdmissions = admissions.filter(a => a.patientId === patient.id);
    const patientVitalSigns = vitalSigns.filter(v => v.patientId === patient.id);
    const patientNursingNotes = nursingNotes.filter(n => n.patientId === patient.id);
    const patientCarePlans = carePlans.filter(c => c.patientId === patient.id);
    const patientCases = cases.filter(c => c.patientId === patient.id);
    const patientClinicalRecords = clinicalRecords.filter(r => r.patientId === patient.id);

    const totalDue = patientBills.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
    const currentAdmission = patientAdmissions.find(a => a.status === 'Admitted');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold shadow-lg">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                                <span className="flex items-center gap-1"><User size={14} /> {patient.gender}, {patient.age} yrs</span>
                                <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
                                <span className="bg-slate-700 px-2 py-0.5 rounded text-white text-xs font-bold">{patient.id}</span>
                            </div>
                            {currentAdmission && (
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                        <Bed size={12} /> Currently Admitted
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 bg-white">
                    {['Overview', 'Clinical', 'Medications', 'Billing'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Patient Summary */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    Patient Information
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500">Blood Type</p>
                                        <p className="font-semibold text-slate-800">{patient.bloodType || 'Not recorded'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Last Visit</p>
                                        <p className="font-semibold text-slate-800">{patient.lastVisit || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Category</p>
                                        <p className="font-semibold text-slate-800">{patient.patientCategory || 'General'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-slate-500">Allergies</p>
                                        <p className="font-semibold text-slate-800">{patient.allergies || 'None recorded'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Current Admission */}
                            {currentAdmission && (
                                <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Bed size={20} className="text-blue-600" />
                                        Current Admission
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Admission Date</p>
                                            <p className="font-semibold text-slate-800">{formatDate(currentAdmission.admissionDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Diagnosis</p>
                                            <p className="font-semibold text-slate-800">{currentAdmission.diagnosis}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Status</p>
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                {currentAdmission.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Cases */}
                            {patientCases.length > 0 && (
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <FolderOpen size={20} className="text-purple-600" />
                                        Active Cases ({patientCases.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {patientCases.slice(0, 3).map(caseItem => (
                                            <div key={caseItem.id} className="p-3 border border-slate-100 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{caseItem.caseType || 'Medical Case'}</p>
                                                        <p className="text-xs text-slate-500">{caseItem.id} • {formatDate(caseItem.createdAt)}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${caseItem.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                                                            caseItem.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {caseItem.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Vital Signs */}
                            {patientVitalSigns.length > 0 && (
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Heart size={20} className="text-red-600" />
                                        Latest Vital Signs
                                    </h3>
                                    {(() => {
                                        const latest = patientVitalSigns[patientVitalSigns.length - 1];
                                        return (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500">Blood Pressure</p>
                                                    <p className="font-bold text-slate-800">{latest.bp || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Heart Rate</p>
                                                    <p className="font-bold text-slate-800">{latest.hr || 'N/A'} bpm</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Temperature</p>
                                                    <p className="font-bold text-slate-800">{latest.temp || 'N/A'}°C</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">SpO2</p>
                                                    <p className="font-bold text-slate-800">{latest.spo2 || 'N/A'}%</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CLINICAL TAB */}
                    {activeTab === 'clinical' && (
                        <div className="space-y-6">
                            {/* Vital Signs History */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Heart size={20} className="text-red-600" />
                                    Vital Signs History
                                </h3>
                                {patientVitalSigns.length > 0 ? (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {patientVitalSigns.map(vital => (
                                            <div key={vital.id} className="p-3 border border-slate-100 rounded-lg text-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs text-slate-500">{formatDate(vital.timestamp)}</span>
                                                    <span className="text-xs text-slate-600">by {vital.recordedBy}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-xs">
                                                    <div><span className="text-slate-500">BP:</span> <span className="font-semibold">{vital.bp}</span></div>
                                                    <div><span className="text-slate-500">HR:</span> <span className="font-semibold">{vital.hr}</span></div>
                                                    <div><span className="text-slate-500">Temp:</span> <span className="font-semibold">{vital.temp}°C</span></div>
                                                    <div><span className="text-slate-500">SpO2:</span> <span className="font-semibold">{vital.spo2}%</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 py-6">No vital signs recorded</p>
                                )}
                            </div>

                            {/* Nursing Notes */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ClipboardList size={20} className="text-blue-600" />
                                    Nursing Notes
                                </h3>
                                {patientNursingNotes.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {patientNursingNotes.map(note => (
                                            <div key={note.id} className="p-3 border border-slate-100 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-semibold text-blue-600">{note.category}</span>
                                                    <span className="text-xs text-slate-500">{formatDate(note.timestamp)}</span>
                                                </div>
                                                <p className="text-sm text-slate-700">{note.note}</p>
                                                <p className="text-xs text-slate-500 mt-1">— {note.nurseName}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 py-6">No nursing notes recorded</p>
                                )}
                            </div>

                            {/* Care Plans */}
                            {patientCarePlans.length > 0 && (
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Stethoscope size={20} className="text-green-600" />
                                        Care Plans
                                    </h3>
                                    <div className="space-y-3">
                                        {patientCarePlans.map(plan => (
                                            <div key={plan.id} className="p-3 border border-slate-100 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-semibold text-slate-800">{plan.diagnosis}</p>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${plan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {plan.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2"><strong>Goal:</strong> {plan.goal}</p>
                                                <div className="text-xs">
                                                    <p className="text-slate-500 mb-1"><strong>Interventions:</strong></p>
                                                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                        {plan.interventions.map((intervention, idx) => (
                                                            <li key={idx}>{intervention}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Clinical Records (Lab, Radiology, etc.) */}
                            {patientClinicalRecords.length > 0 && (
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <TestTube size={20} className="text-purple-600" />
                                        Clinical Test Results
                                    </h3>
                                    <div className="space-y-2">
                                        {patientClinicalRecords.map(record => (
                                            <div key={record.id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-slate-800">{record.test || record.exam}</p>
                                                    <p className="text-xs text-slate-500">{record.id} • {record.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-slate-700">{record.result}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MEDICATIONS TAB */}
                    {activeTab === 'medications' && (
                        <div className="space-y-6">
                            {/* Prescriptions */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-blue-600" />
                                    Prescriptions
                                </h3>
                                {patientPrescriptions.length > 0 ? (
                                    <div className="space-y-3">
                                        {patientPrescriptions.map(prescription => (
                                            <div key={prescription.id} className="p-4 border border-slate-100 rounded-lg">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-xs text-slate-500">{prescription.id}</p>
                                                        <p className="text-sm font-semibold text-slate-700">Dr. {prescription.doctor}</p>
                                                        <p className="text-xs text-slate-500">{prescription.date}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${prescription.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                            prescription.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {prescription.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {prescription.medications.map((med, idx) => (
                                                        <div key={idx} className="bg-slate-50 p-2 rounded text-sm">
                                                            <p className="font-semibold text-slate-800">{med.name}</p>
                                                            <p className="text-xs text-slate-600">Dosage: {med.dosage} • Qty: {med.quantity}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 py-6">No prescriptions found</p>
                                )}
                            </div>

                            {/* Medication Administration Log */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Pill size={20} className="text-green-600" />
                                    Medication Administration Log
                                </h3>
                                {patientMedicationLogs.length > 0 ? (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {patientMedicationLogs.map(log => (
                                            <div key={log.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-800">{log.medicationName}</p>
                                                        <p className="text-sm text-slate-600">{log.dosage}</p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Administered by: {log.administeredBy} • {formatDate(log.administeredAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 py-6">No medication administration records</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* BILLING TAB */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white p-5 rounded-xl border-2 border-slate-200 shadow-sm">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Total Outstanding</p>
                                    <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalDue)}</p>
                                </div>
                                <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg">
                                    Make Payment
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Transaction History</h3>
                                {patientBills.length > 0 ? (
                                    <div className="space-y-3">
                                        {patientBills.map(bill => (
                                            <div key={bill.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${bill.type === 'Consultation' ? 'bg-blue-100 text-blue-600' :
                                                            bill.type === 'Lab Tests' ? 'bg-purple-100 text-purple-600' :
                                                                bill.type === 'Surgery' ? 'bg-red-100 text-red-600' :
                                                                    'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{bill.description || bill.type}</p>
                                                        <p className="text-xs text-slate-500">{new Date(bill.date).toLocaleDateString()} • {bill.id}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-800">{formatCurrency(bill.amount)}</p>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {bill.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 py-8">No billing records found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;
