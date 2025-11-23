import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Plus, Search, Clock, ChevronRight, X } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const Consultations = () => {
    const { patients, triageQueue } = useData();
    const [consultations, setConsultations] = useState([
        { id: 1, patient: 'John Doe', date: '2024-01-20', time: '09:30 AM', type: 'Follow-up', diagnosis: 'Hypertension', status: 'Completed' },
        { id: 2, patient: 'Mary Smith', date: '2024-01-20', time: '10:15 AM', type: 'Initial', diagnosis: 'Pending', status: 'In Progress' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        type: 'Initial',
        complaint: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newConsult = {
            id: consultations.length + 1,
            patient: formData.patientName,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: formData.type,
            diagnosis: 'Pending',
            status: 'In Progress'
        };
        setConsultations([newConsult, ...consultations]);
        setShowModal(false);
        setFormData({ patientId: '', patientName: '', type: 'Initial', complaint: '', notes: '' });
    };

    const handlePatientChange = (e) => {
        const selectedId = e.target.value;
        const selectedPatient = patients.find(p => p.id === selectedId);
        setFormData({
            ...formData,
            patientId: selectedId,
            patientName: selectedPatient ? selectedPatient.name : ''
        });
    };

    // Auto-populate chief complaint from triage when patient selected
    useEffect(() => {
        if (formData.patientId) {
            const triageRecord = triageQueue.find(t => t.patientId === formData.patientId);
            if (triageRecord) {
                setFormData(prev => ({
                    ...prev,
                    complaint: triageRecord.chiefComplaint || prev.complaint,
                    notes: triageRecord.notes ?
                        `Triage Level: ${triageRecord.triageLevel}\nVitals: BP ${triageRecord.vitals?.bp}, Temp ${triageRecord.vitals?.temp}°C\n\n${triageRecord.notes}`
                        : prev.notes
                }));
            }
        }
    }, [formData.patientId, triageQueue]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Consultations</h2>
                    <p className="text-sm text-slate-500">Manage patient visits and clinical notes</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={18} />
                    Start Consultation
                </button>
            </div>

            {/* Active Consultations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {consultations.map(consult => (
                    <div key={consult.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {consult.patient.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{consult.patient}</h3>
                                    <p className="text-xs text-slate-500">{consult.type} Visit</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${consult.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                consult.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {consult.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock size={16} className="text-slate-400" />
                                <span>{consult.date} at {consult.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText size={16} className="text-slate-400" />
                                <span>Diagnosis: <span className="font-medium">{consult.diagnosis}</span></span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <button className="text-sm text-slate-500 hover:text-slate-700">View History</button>
                            <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Consultation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">New Consultation</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.patientId}
                                    onChange={handlePatientChange}
                                >
                                    <option value="">-- Select a Patient --</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.name} ({patient.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Type</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Initial</option>
                                    <option>Follow-up</option>
                                    <option>Emergency</option>
                                    <option>Routine Checkup</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Chief Complaint</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                                    placeholder="Patient's main symptoms..."
                                    value={formData.complaint}
                                    onChange={e => setFormData({ ...formData, complaint: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30"
                                >
                                    Start Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Consultations;
