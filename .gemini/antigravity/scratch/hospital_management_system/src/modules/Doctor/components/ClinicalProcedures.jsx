import React, { useState } from 'react';
import { Activity, Plus, Search, CheckCircle, Clock, X } from 'lucide-react';

const ClinicalProcedures = () => {
    const [showModal, setShowModal] = useState(false);
    const [procedures, setProcedures] = useState([
        { id: 1, name: 'Wound Dressing', patient: 'John Doe', date: '2024-01-20', time: '10:00 AM', status: 'Completed', notes: 'Cleaned and dressed.' },
        { id: 2, name: 'IV Cannulation', patient: 'Sarah Connor', date: '2024-01-20', time: '11:30 AM', status: 'Scheduled', notes: 'Pre-op.' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        patient: '',
        date: '',
        time: '',
        status: 'Scheduled',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProcedure = {
            id: procedures.length + 1,
            ...formData
        };
        setProcedures([newProcedure, ...procedures]);
        setShowModal(false);
        setFormData({ name: '', patient: '', date: '', time: '', status: 'Scheduled', notes: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Clinical Procedures</h2>
                    <p className="text-sm text-slate-500">Track and record medical procedures</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={18} />
                    Record Procedure
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {procedures.map(proc => (
                    <div key={proc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{proc.name}</h3>
                                    <p className="text-xs text-slate-500">{proc.patient}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${proc.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {proc.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                {proc.date} at {proc.time}
                            </div>
                            <p className="text-slate-500 italic">"{proc.notes}"</p>
                        </div>
                        <div className="pt-3 border-t border-slate-50 flex justify-end">
                            <button className="text-sm font-medium text-primary hover:underline">View Report</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Procedure Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Record New Procedure</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Procedure Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Wound Dressing"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Select Patient"
                                    value={formData.patient}
                                    onChange={e => setFormData({ ...formData, patient: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                                    placeholder="Procedure details..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
                                    Save Procedure
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicalProcedures;
