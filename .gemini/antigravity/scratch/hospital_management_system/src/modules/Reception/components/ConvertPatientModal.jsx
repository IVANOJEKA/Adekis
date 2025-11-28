import React, { useState } from 'react';
import { X, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

const ConvertPatientModal = ({ walkInPatient, onClose, onConvert }) => {
    const [formData, setFormData] = useState({
        patientCategory: 'OPD',
        chiefComplaint: '',
        department: 'General Medicine'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onConvert(walkInPatient, formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary to-primary-dark">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 text-white rounded-lg">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Convert to Regular Patient</h3>
                            <p className="text-xs text-white/80">{walkInPatient.name} ({walkInPatient.id})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">Converting Walk-in to Regular Patient</p>
                            <p>This patient will receive a new Patient ID and can access full hospital services including admission, consultations, and billing.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                                {walkInPatient.id}
                            </div>
                            <ArrowRight className="text-slate-400" size={20} />
                            <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                                P-XXX (New ID)
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Patient Category *</label>
                            <select
                                value={formData.patientCategory}
                                onChange={(e) => setFormData({ ...formData, patientCategory: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                required
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Chief Complaint / Reason for Admission *</label>
                            <textarea
                                required
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                placeholder="E.g., Found to have high blood pressure during routine check, needs monitoring..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
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
                            <UserCheck size={18} />
                            Convert Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConvertPatientModal;
