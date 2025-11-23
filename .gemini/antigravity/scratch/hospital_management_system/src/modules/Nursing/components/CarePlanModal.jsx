import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const CarePlanModal = ({ patients, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        diagnosis: '',
        goal: '',
        interventions: [''],
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInterventionChange = (index, value) => {
        const newInterventions = [...formData.interventions];
        newInterventions[index] = value;
        setFormData(prev => ({ ...prev, interventions: newInterventions }));
    };

    const addIntervention = () => {
        setFormData(prev => ({ ...prev, interventions: [...prev.interventions, ''] }));
    };

    const removeIntervention = (index) => {
        const newInterventions = formData.interventions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, interventions: newInterventions }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.diagnosis || !formData.goal) {
            alert('Please fill in all required fields');
            return;
        }

        const newCarePlan = {
            id: `CP-${Date.now()}`,
            ...formData,
            interventions: formData.interventions.filter(i => i.trim() !== ''),
            createdBy: 'Nurse', // In real app, current user
            createdAt: new Date().toISOString()
        };

        onSave(newCarePlan);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Create Care Plan</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Patient Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                        <select
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                            ))}
                        </select>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nursing Diagnosis</label>
                        <input
                            type="text"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g., Risk for Infection"
                            required
                        />
                    </div>

                    {/* Goal */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Goal</label>
                        <textarea
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 h-24"
                            placeholder="Describe the desired outcome..."
                            required
                        />
                    </div>

                    {/* Interventions */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Interventions</label>
                        <div className="space-y-2">
                            {formData.interventions.map((intervention, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={intervention}
                                        onChange={(e) => handleInterventionChange(index, e.target.value)}
                                        className="flex-1 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder={`Intervention ${index + 1}`}
                                    />
                                    {formData.interventions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIntervention(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addIntervention}
                                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                            >
                                <Plus size={14} /> Add Intervention
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                        >
                            Create Care Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CarePlanModal;
