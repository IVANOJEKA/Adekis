import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

const NursingNoteModal = ({ patients, onClose, onSave, initialPatient }) => {
    const [formData, setFormData] = useState({
        patientId: initialPatient?.id || '',
        category: 'Progress Note',
        note: ''
    });

    const categories = [
        'Shift Assessment',
        'Progress Note',
        'Post-Op Note',
        'Admission Note',
        'Discharge Note',
        'Incident Report',
        'Patient Education'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.patientId || !formData.note.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        const noteRecord = {
            id: `NN-${Date.now()}`,
            patientId: formData.patientId,
            admissionId: patients.find(p => p.id === formData.patientId)?.admission?.id,
            nurseName: 'Current Nurse', // TODO: Get from auth context
            timestamp: new Date().toISOString(),
            category: formData.category,
            note: formData.note,
            isPrivate: false
        };

        onSave(noteRecord);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="bg-primary px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText size={24} />
                        New Nursing Note
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

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Note *
                        </label>
                        <textarea
                            rows={8}
                            placeholder="Enter nursing note..."
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.note.length} characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
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
                            Save Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NursingNoteModal;
