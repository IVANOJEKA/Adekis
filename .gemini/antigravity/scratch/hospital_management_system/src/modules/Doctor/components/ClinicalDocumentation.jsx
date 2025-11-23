import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import {
    FileText, User, Stethoscope, Activity, Brain, Pill, Save,
    Printer, X, Calendar, Clock, AlertCircle, CheckCircle, Plus, Trash2,
    Send, Eye
} from 'lucide-react';

const ClinicalDocumentation = () => {
    const { patients, clinicalRecords, systemSettings, triageQueue } = useData();
    const [activeModal, setActiveModal] = useState(null); // 'soap' or 'referral'
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // SOAP Note State
    const [soapNote, setSoapNote] = useState({
        patientId: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    // Referral Letter State
    const [referralLetter, setReferralLetter] = useState({
        patientId: '',
        referringTo: '',
        specialty: '',
        reason: '',
        clinicalSummary: '',
        investigations: '',
        currentMedications: '',
        urgency: 'Routine'
    });

    const hospitalInfo = {
        name: systemSettings?.hospitalName || 'MedCore Hospital',
        address: '123 Health Street, Medical District',
        city: 'Kampala, Uganda',
        phone: '+256 123 456 789',
        email: 'info@medcorehospital.com',
        website: 'www.medcorehospital.com',
        logo: 'MC' // Initials for logo
    };

    // Auto-populate SOAP Note from triage data when patient selected
    useEffect(() => {
        if (soapNote.patientId) {
            const triageRecord = triageQueue.find(t => t.patientId === soapNote.patientId);
            if (triageRecord) {
                setSoapNote(prev => ({
                    ...prev,
                    subjective: triageRecord.chiefComplaint || prev.subjective,
                    objective: `Vital Signs:\n` +
                        `BP: ${triageRecord.vitals?.bp || 'N/A'}\n` +
                        `Temp: ${triageRecord.vitals?.temp || 'N/A'}°C\n` +
                        `Pulse: ${triageRecord.vitals?.pulse || 'N/A'} bpm\n` +
                        `RR: ${triageRecord.vitals?.rr || 'N/A'}\n` +
                        `SpO2: ${triageRecord.vitals?.spo2 || 'N/A'}%\n` +
                        `Weight: ${triageRecord.vitals?.weight || 'N/A'} kg\n` +
                        `Height: ${triageRecord.vitals?.height || 'N/A'} cm\n` +
                        `BMI: ${triageRecord.vitals?.weight && triageRecord.vitals?.height ?
                            (triageRecord.vitals.weight / ((triageRecord.vitals.height / 100) ** 2)).toFixed(1) : 'N/A'}\n\n` +
                        (triageRecord.notes ? `Triage Notes: ${triageRecord.notes}` : '')
                }));
            }
        }
    }, [soapNote.patientId, triageQueue]);

    // Auto-populate Referral Letter from triage data when patient selected
    useEffect(() => {
        if (referralLetter.patientId) {
            const triageRecord = triageQueue.find(t => t.patientId === referralLetter.patientId);
            if (triageRecord) {
                setReferralLetter(prev => ({
                    ...prev,
                    reason: triageRecord.chiefComplaint || prev.reason,
                    clinicalSummary: prev.clinicalSummary ||
                        `Patient presented with: ${triageRecord.chiefComplaint || 'N/A'}\n\n` +
                        `Triage Level: ${triageRecord.triageLevel}\n` +
                        `Vital Signs: BP ${triageRecord.vitals?.bp}, Temp ${triageRecord.vitals?.temp}°C, ` +
                        `Pulse ${triageRecord.vitals?.pulse} bpm, SpO2 ${triageRecord.vitals?.spo2}%\n\n` +
                        (triageRecord.notes ? `Additional Notes: ${triageRecord.notes}` : '')
                }));
            }
        }
    }, [referralLetter.patientId, triageQueue]);

    const handleCreateSOAP = () => {
        if (!soapNote.patientId) {
            alert('Please select a patient');
            return;
        }

        const patient = patients.find(p => p.id === soapNote.patientId);
        setSelectedPatient(patient);
        setSelectedDoc({ type: 'SOAP', data: soapNote });
    };

    const handleCreateReferral = () => {
        if (!referralLetter.patientId) {
            alert('Please select a patient');
            return;
        }

        const patient = patients.find(p => p.id === referralLetter.patientId);
        setSelectedPatient(patient);
        setSelectedDoc({ type: 'REFERRAL', data: referralLetter });
    };

    const handlePrint = () => {
        window.print();
    };

    // SOAP Note Modal
    const renderSOAPModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Create SOAP Note</h2>
                        <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-lg">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                        <select
                            value={soapNote.patientId}
                            onChange={(e) => setSoapNote({ ...soapNote, patientId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose a patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-blue-700 mb-2">S - SUBJECTIVE</label>
                        <textarea
                            rows="3"
                            value={soapNote.subjective}
                            onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Patient's complaints, symptoms, history..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-green-700 mb-2">O - OBJECTIVE</label>
                        <textarea
                            rows="3"
                            value={soapNote.objective}
                            onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Vital signs, examination findings, lab results..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-purple-700 mb-2">A - ASSESSMENT</label>
                        <textarea
                            rows="3"
                            value={soapNote.assessment}
                            onChange={(e) => setSoapNote({ ...soapNote, assessment: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Diagnosis, clinical impression..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-orange-700 mb-2">P - PLAN</label>
                        <textarea
                            rows="3"
                            value={soapNote.plan}
                            onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Treatment plan, medications, follow-up..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setActiveModal(null)}
                            className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateSOAP}
                            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Generate SOAP Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Referral Letter Modal
    const renderReferralModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Create Referral Letter</h2>
                        <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-lg">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                            <select
                                value={referralLetter.patientId}
                                onChange={(e) => setReferralLetter({ ...referralLetter, patientId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency *</label>
                            <select
                                value={referralLetter.urgency}
                                onChange={(e) => setReferralLetter({ ...referralLetter, urgency: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Routine">Routine</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Referring To (Doctor/Facility) *</label>
                            <input
                                type="text"
                                value={referralLetter.referringTo}
                                onChange={(e) => setReferralLetter({ ...referralLetter, referringTo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Dr. John Smith, Cardiologist"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
                            <input
                                type="text"
                                value={referralLetter.specialty}
                                onChange={(e) => setReferralLetter({ ...referralLetter, specialty: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Cardiology, Orthopedics"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Referral *</label>
                        <textarea
                            rows="2"
                            value={referralLetter.reason}
                            onChange={(e) => setReferralLetter({ ...referralLetter, reason: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Brief reason for referral..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Summary</label>
                        <textarea
                            rows="3"
                            value={referralLetter.clinicalSummary}
                            onChange={(e) => setReferralLetter({ ...referralLetter, clinicalSummary: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Patient history, presenting complaints, clinical findings..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Investigations Done</label>
                        <textarea
                            rows="2"
                            value={referralLetter.investigations}
                            onChange={(e) => setReferralLetter({ ...referralLetter, investigations: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Lab results, imaging, tests performed..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                        <textarea
                            rows="2"
                            value={referralLetter.currentMedications}
                            onChange={(e) => setReferralLetter({ ...referralLetter, currentMedications: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="List current medications..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setActiveModal(null)}
                            className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateReferral}
                            className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Generate Referral Letter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Document Preview with Hospital Branding
    const renderDocPreview = () => {
        if (!selectedDoc || !selectedPatient) return null;

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        if (selectedDoc.type === 'SOAP') {
            return (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
                        {/* Header Actions */}
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-900">SOAP Note Preview</h3>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                    <Printer size={16} />
                                    Print
                                </button>
                                <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Printable Content */}
                        <div className="p-8 print:p-12" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {/* Hospital Letterhead */}
                            <div className="border-b-4 border-blue-600 pb-4 mb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                            {hospitalInfo.logo}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{hospitalInfo.name}</h1>
                                            <p className="text-sm text-gray-600">{hospitalInfo.address}</p>
                                            <p className="text-sm text-gray-600">{hospitalInfo.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>Tel: {hospitalInfo.phone}</p>
                                        <p>Email: {hospitalInfo.email}</p>
                                        <p>{hospitalInfo.website}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Title */}
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">SOAP NOTE</h2>
                                <p className="text-sm text-gray-600">Clinical Documentation</p>
                            </div>

                            {/* Patient Information */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-semibold">Patient Name:</span> {selectedPatient.name}</div>
                                    <div><span className="font-semibold">Patient ID:</span> {selectedPatient.id}</div>
                                    <div><span className="font-semibold">Age/Gender:</span> {selectedPatient.age}y / {selectedPatient.gender}</div>
                                    <div><span className="font-semibold">Date:</span> {currentDate}</div>
                                </div>
                            </div>

                            {/* SOAP Content */}
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h3 className="font-bold text-blue-700 mb-2">S - SUBJECTIVE</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.subjective || 'No data'}</p>
                                </div>

                                <div className="border-l-4 border-green-600 pl-4">
                                    <h3 className="font-bold text-green-700 mb-2">O - OBJECTIVE</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.objective || 'No data'}</p>
                                </div>

                                <div className="border-l-4 border-purple-600 pl-4">
                                    <h3 className="font-bold text-purple-700 mb-2">A - ASSESSMENT</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.assessment || 'No data'}</p>
                                </div>

                                <div className="border-l-4 border-orange-600 pl-4">
                                    <h3 className="font-bold text-orange-700 mb-2">P - PLAN</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.plan || 'No data'}</p>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="mt-8 pt-6 border-t">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-600">Prepared by:</p>
                                        <p className="font-semibold">Dr. Sarah Wilson</p>
                                        <p className="text-sm text-gray-600">Medical Officer</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Date: {currentDate}</p>
                                        <div className="mt-2 border-t border-gray-400 pt-1">
                                            <p className="text-xs text-gray-500">Signature</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (selectedDoc.type === 'REFERRAL') {
            return (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
                        {/* Header Actions */}
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-900">Referral Letter Preview</h3>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                                    <Printer size={16} />
                                    Print
                                </button>
                                <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Printable Content */}
                        <div className="p-8 print:p-12" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {/* Hospital Letterhead */}
                            <div className="border-b-4 border-purple-600 pb-4 mb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                            {hospitalInfo.logo}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{hospitalInfo.name}</h1>
                                            <p className="text-sm text-gray-600">{hospitalInfo.address}</p>
                                            <p className="text-sm text-gray-600">{hospitalInfo.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>Tel: {hospitalInfo.phone}</p>
                                        <p>Email: {hospitalInfo.email}</p>
                                        <p>{hospitalInfo.website}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Title */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">MEDICAL REFERRAL LETTER</h2>
                                <p className="text-sm text-gray-600">Date: {currentDate}</p>
                                {selectedDoc.data.urgency !== 'Routine' && (
                                    <p className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                        {selectedDoc.data.urgency.toUpperCase()}
                                    </p>
                                )}
                            </div>

                            {/* Recipient */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600">To:</p>
                                <p className="font-semibold text-gray-900">{selectedDoc.data.referringTo}</p>
                                <p className="text-sm text-gray-600">{selectedDoc.data.specialty}</p>
                            </div>

                            {/* Patient Information */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Patient Information</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="font-semibold">Name:</span> {selectedPatient.name}</div>
                                    <div><span className="font-semibold">Patient ID:</span> {selectedPatient.id}</div>
                                    <div><span className="font-semibold">Age/Gender:</span> {selectedPatient.age}y / {selectedPatient.gender}</div>
                                    <div><span className="font-semibold">Phone:</span> {selectedPatient.phone || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Letter Content */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-700 mb-4">Dear Doctor,</p>
                                    <p className="text-gray-700 mb-4">
                                        I am referring the above patient for your expert opinion and management.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Reason for Referral:</h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.reason}</p>
                                </div>

                                {selectedDoc.data.clinicalSummary && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Clinical Summary:</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.clinicalSummary}</p>
                                    </div>
                                )}

                                {selectedDoc.data.investigations && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Investigations Done:</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.investigations}</p>
                                    </div>
                                )}

                                {selectedDoc.data.currentMedications && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Current Medications:</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedDoc.data.currentMedications}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-gray-700 mt-4">
                                        Thank you for your attention to this matter. I would appreciate your expert evaluation and management recommendations.
                                    </p>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="mt-8 pt-6 border-t">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-700 mb-4">Yours sincerely,</p>
                                        <div className="mb-2 border-t border-gray-400 pt-1 w-48">
                                            <p className="text-xs text-gray-500">Signature</p>
                                        </div>
                                        <p className="font-semibold">Dr. Sarah Wilson</p>
                                        <p className="text-sm text-gray-600">Medical Officer</p>
                                        <p className="text-sm text-gray-600">{hospitalInfo.name}</p>
                                        <p className="text-sm text-gray-600">Tel: {hospitalInfo.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
                                <p>{hospitalInfo.name} | {hospitalInfo.address} | {hospitalInfo.phone} | {hospitalInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Clinical Documentation</h2>
                    <p className="text-sm text-slate-500">Create SOAP notes and referral letters with hospital branding</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveModal('soap')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 font-medium"
                    >
                        <Plus size={18} />
                        SOAP Note
                    </button>
                    <button
                        onClick={() => setActiveModal('referral')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 font-medium"
                    >
                        <Send size={18} />
                        Referral Letter
                    </button>
                </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900">SOAP Notes</h3>
                            <p className="text-sm text-blue-700">Subjective, Objective, Assessment, Plan</p>
                        </div>
                    </div>
                    <p className="text-sm text-blue-800">
                        Create structured clinical documentation following the SOAP format with professional hospital branding for printing.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-600 rounded-lg">
                            <Send className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900">Referral Letters</h3>
                            <p className="text-sm text-purple-700">Professional medical referrals</p>
                        </div>
                    </div>
                    <p className="text-sm text-purple-800">
                        Generate formal referral letters with hospital letterhead, patient details, and comprehensive clinical information.
                    </p>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'soap' && renderSOAPModal()}
            {activeModal === 'referral' && renderReferralModal()}
            {selectedDoc && renderDocPreview()}
        </div>
    );
};

export default ClinicalDocumentation;
