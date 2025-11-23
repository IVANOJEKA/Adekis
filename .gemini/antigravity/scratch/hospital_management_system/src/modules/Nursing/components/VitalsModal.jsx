import React, { useState } from 'react';
import { X, Thermometer, Heart, Activity, Droplet, Wind, Brain } from 'lucide-react';

const VitalsModal = ({ patients, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        bp: '',
        hr: '',
        temp: '',
        spo2: '',
        rr: '',
        painScore: '0',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.patientId) {
            alert('Please select a patient');
            return;
        }

        const vitalsRecord = {
            id: `VS-${Date.now()}`,
            patientId: formData.patientId,
            admissionId: patients.find(p => p.id === formData.patientId)?.admission?.id,
            recordedBy: 'Current Nurse', // TODO: Get from auth context
            timestamp: new Date().toISOString(),
            bp: formData.bp,
            hr: parseInt(formData.hr),
            temp: parseFloat(formData.temp),
            spo2: parseInt(formData.spo2),
            rr: parseInt(formData.rr),
            painScore: parseInt(formData.painScore),
            notes: formData.notes
        };

        onSave(vitalsRecord);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-primary px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Thermometer size={24} />
                        Record Vital Signs
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Patient Selection */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Patient *
                        </label>
                        <select
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name} - {patient.bed} ({patient.ward})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vital Signs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Blood Pressure */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Activity size={16} className="text-primary" />
                                Blood Pressure (mmHg) *
                            </label>
                            <input
                                type="text"
                                placeholder="120/80"
                                value={formData.bp}
                                onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            />
                        </div>

                        {/* Heart Rate */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Heart size={16} className="text-primary" />
                                Heart Rate (bpm) *
                            </label>
                            <input
                                type="number"
                                placeholder="72"
                                value={formData.hr}
                                onChange={(e) => setFormData({ ...formData, hr: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                                min="30"
                                max="200"
                            />
                        </div>

                        {/* Temperature */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Thermometer size={16} className="text-primary" />
                                Temperature (°C) *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="36.5"
                                value={formData.temp}
                                onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                                min="35"
                                max="42"
                            />
                        </div>

                        {/* SpO2 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Droplet size={16} className="text-primary" />
                                SpO2 (%) *
                            </label>
                            <input
                                type="number"
                                placeholder="98"
                                value={formData.spo2}
                                onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                                min="70"
                                max="100"
                            />
                        </div>

                        {/* Respiratory Rate */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Wind size={16} className="text-primary" />
                                Respiratory Rate *
                            </label>
                            <input
                                type="number"
                                placeholder="16"
                                value={formData.rr}
                                onChange={(e) => setFormData({ ...formData, rr: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                                min="8"
                                max="40"
                            />
                        </div>

                        {/* Pain Score */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Brain size={16} className="text-primary" />
                                Pain Score (0-10) *
                            </label>
                            <select
                                value={formData.painScore}
                                onChange={(e) => setFormData({ ...formData, painScore: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                                required
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                    <option key={score} value={score}>{score} - {score === 0 ? 'No Pain' : score <= 3 ? 'Mild' : score <= 6 ? 'Moderate' : 'Severe'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Any observations or notes..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold"
                        >
                            Save Vitals
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VitalsModal;
