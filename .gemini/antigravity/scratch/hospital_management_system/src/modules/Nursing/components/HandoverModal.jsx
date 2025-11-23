import React, { useState } from 'react';
import { X } from 'lucide-react';

const HandoverModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        shift: 'Day',
        receivedBy: '',
        generalNotes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newReport = {
            id: `HO-${Date.now()}`,
            shift: formData.shift,
            date: new Date().toISOString().split('T')[0],
            handedOverBy: 'Current Nurse',
            receivedBy: formData.receivedBy,
            timestamp: new Date().toISOString(),
            patients: [] // Empty for now as selecting patients is complex
        };
        onSave(newReport);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">New Shift Handover</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                        <select
                            value={formData.shift}
                            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg"
                        >
                            <option value="Day">Day Shift</option>
                            <option value="Night">Night Shift</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Received By</label>
                        <input
                            type="text"
                            value={formData.receivedBy}
                            onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg"
                            required
                            placeholder="Name of nurse receiving handover"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">General Notes</label>
                        <textarea
                            value={formData.generalNotes}
                            onChange={(e) => setFormData({ ...formData, generalNotes: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg h-24"
                            placeholder="Any general updates for the shift..."
                        />
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
                            Create Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HandoverModal;
