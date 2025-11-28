import React, { useState } from 'react';
import { X, FileText, AlertCircle, Check } from 'lucide-react';

const NewCaseModal = ({ patient, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        type: 'OPD',
        department: 'General Medicine',
        chiefComplaint: '',
        priority: 'Normal'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate Case ID (Mock logic)
        const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        const newCase = {
            id: caseId,
            patientId: patient.id,
            patientName: patient.name,
            status: 'Open',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            ...formData
        };

        onSave(newCase);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">New Medical Case</h3>
                            <p className="text-xs text-slate-500">For {patient.name} ({patient.id})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-blue-700">
                            Creating a new case will separate this visit's records from previous history.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Case Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                            >
                                <option value="OPD">Outpatient (OPD)</option>
                                <option value="IPD">Inpatient (IPD)</option>
                                <option value="Maternity">Maternity</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                            >
                                <option>General Medicine</option>
                                <option>Pediatrics</option>
                                <option>Gynecology</option>
                                <option>Orthopedics</option>
                                <option>Cardiology</option>
                                <option>Dental</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Chief Complaint</label>
                        <textarea
                            required
                            value={formData.chiefComplaint}
                            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                            placeholder="Describe the patient's main symptoms..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 flex items-center gap-2 transition-colors"
                        >
                            <Check size={18} />
                            Create Case
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCaseModal;
