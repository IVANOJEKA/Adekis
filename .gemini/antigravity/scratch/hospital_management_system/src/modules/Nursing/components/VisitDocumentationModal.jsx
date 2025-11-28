import React, { useState } from 'react';
import { X, Save, Clock, Activity, Pill, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const VisitDocumentationModal = ({ visit, onClose, onSave }) => {
    const { homeCareVisitsData } = useData();

    const [formData, setFormData] = useState({
        actualStartTime: visit.actualStartTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actualEndTime: visit.actualEndTime || '',
        status: visit.status === 'Scheduled' ? 'In Progress' : visit.status,
        vitalSigns: visit.vitalSigns || {
            bloodPressure: '',
            temperature: '',
            pulse: '',
            respiration: '',
            oxygenSaturation: ''
        },
        notes: visit.notes || '',
        servicesRendered: visit.servicesRendered || [],
        medicationsAdministered: visit.medications || []
    });

    const [newService, setNewService] = useState('');
    const [newMedication, setNewMedication] = useState({ name: '', dosage: '', route: '' });

    const handleAddService = () => {
        if (newService.trim()) {
            setFormData({
                ...formData,
                servicesRendered: [...formData.servicesRendered, newService]
            });
            setNewService('');
        }
    };

    const handleAddMedication = () => {
        if (newMedication.name && newMedication.dosage) {
            setFormData({
                ...formData,
                medicationsAdministered: [...formData.medicationsAdministered, { ...newMedication, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
            });
            setNewMedication({ name: '', dosage: '', route: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...visit,
            ...formData,
            completedDate: formData.status === 'Completed' ? new Date().toISOString() : null
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="font-bold text-xl text-slate-800">Visit Documentation</h2>
                        <p className="text-slate-500 text-sm">
                            {visit.patientName} • {visit.scheduledDate} at {visit.scheduledTime}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Status & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Visit Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Start Time</label>
                            <input
                                type="time"
                                value={formData.actualStartTime}
                                onChange={(e) => setFormData({ ...formData, actualStartTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">End Time</label>
                            <input
                                type="time"
                                value={formData.actualEndTime}
                                onChange={(e) => setFormData({ ...formData, actualEndTime: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Activity size={20} className="text-primary" />
                            Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">BP (mmHg)</label>
                                <input
                                    type="text"
                                    value={formData.vitalSigns.bloodPressure}
                                    onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="120/80"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Temp (°C)</label>
                                <input
                                    type="text"
                                    value={formData.vitalSigns.temperature}
                                    onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, temperature: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="37.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Pulse (bpm)</label>
                                <input
                                    type="text"
                                    value={formData.vitalSigns.pulse}
                                    onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, pulse: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="72"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Resp (/min)</label>
                                <input
                                    type="text"
                                    value={formData.vitalSigns.respiration}
                                    onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, respiration: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="16"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">SpO2 (%)</label>
                                <input
                                    type="text"
                                    value={formData.vitalSigns.oxygenSaturation}
                                    onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="98"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services Rendered */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <CheckCircle size={20} className="text-emerald-600" />
                            Services Rendered
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Add service (e.g. Wound Dressing)"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                            />
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.servicesRendered.map((service, index) => (
                                <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-2 border border-emerald-100">
                                    {service}
                                    <button
                                        onClick={() => setFormData({
                                            ...formData,
                                            servicesRendered: formData.servicesRendered.filter((_, i) => i !== index)
                                        })}
                                        className="hover:text-emerald-900"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            {formData.servicesRendered.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No services recorded yet</p>
                            )}
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Pill size={20} className="text-blue-600" />
                            Medications Administered
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                                type="text"
                                value={newMedication.name}
                                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Medication Name"
                            />
                            <input
                                type="text"
                                value={newMedication.dosage}
                                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Dosage"
                            />
                            <button
                                onClick={handleAddMedication}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.medicationsAdministered.map((med, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div>
                                        <p className="font-bold text-slate-800">{med.name}</p>
                                        <p className="text-xs text-slate-500">{med.dosage} • {med.route || 'Oral'} • {med.time}</p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({
                                            ...formData,
                                            medicationsAdministered: formData.medicationsAdministered.filter((_, i) => i !== index)
                                        })}
                                        className="text-slate-400 hover:text-red-500"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            {formData.medicationsAdministered.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No medications recorded</p>
                            )}
                        </div>
                    </div>

                    {/* Progress Notes */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <FileText size={20} className="text-slate-600" />
                            Progress Notes
                        </h3>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none"
                            placeholder="Detailed notes on patient condition, wound progress, etc."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitDocumentationModal;
