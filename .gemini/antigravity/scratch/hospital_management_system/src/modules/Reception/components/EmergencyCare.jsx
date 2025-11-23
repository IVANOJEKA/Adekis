import React, { useState } from 'react';
import { Siren, UserPlus, Save, X, Clock, AlertTriangle, Activity, Zap } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { generatePatientId } from '../../../utils/patientIdUtils';

const EmergencyCare = () => {
    const { patients, setPatients } = useData();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        triageLevel: 'Emergency',
        chiefComplaint: '',
        broughtBy: '',
        contact: ''
    });

    // Auto-generate ID for preview
    const nextId = generatePatientId(patients, 'emergency');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPatient = {
            id: nextId,
            name: formData.name || 'Unknown Patient',
            age: formData.age || 'Unknown',
            gender: formData.gender,
            phone: formData.contact || 'N/A',
            type: 'Emergency',
            category: 'Emergency',
            status: 'Active',
            triageLevel: formData.triageLevel,
            chiefComplaint: formData.chiefComplaint,
            registrationDate: new Date().toISOString().split('T')[0],
            admissionTime: new Date().toLocaleTimeString()
        };

        setPatients([...patients, newPatient]);
        setShowModal(false);
        setFormData({
            name: '',
            age: '',
            gender: 'Male',
            triageLevel: 'Emergency',
            chiefComplaint: '',
            broughtBy: '',
            contact: ''
        });
        alert(`Emergency Patient Registered! ID: ${newPatient.id}`);
    };

    const emergencyPatients = patients.filter(p => p.type === 'Emergency' || p.id.startsWith('E-'));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <Siren size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Emergency Department</h2>
                        <p className="text-sm text-slate-500">Rapid registration for critical cases</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all animate-pulse"
                >
                    <Zap size={20} />
                    Emergency Registration
                </button>
            </div>

            {/* Patient List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Active Emergency Cases</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        {emergencyPatients.length} Active
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Time In</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Complaint</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {emergencyPatients.length > 0 ? emergencyPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-red-600">{patient.id}</td>
                                    <td className="p-4 text-slate-600 flex items-center gap-2">
                                        <Clock size={14} />
                                        {patient.admissionTime || new Date().toLocaleTimeString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{patient.name}</div>
                                        <div className="text-xs text-slate-500">{patient.age} / {patient.gender}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{patient.chiefComplaint || '-'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${patient.triageLevel === 'Emergency' ? 'bg-red-100 text-red-700' :
                                                patient.triageLevel === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {patient.triageLevel || 'Emergency'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                                            In Progress
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                        No active emergency cases.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border-t-4 border-red-600">
                        <div className="px-6 py-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                                <Siren size={20} />
                                Emergency Registration
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* ID Preview */}
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center">
                                <span className="text-sm text-red-700 font-medium">Auto-generated ID:</span>
                                <span className="font-mono font-bold text-red-700 text-lg">{nextId}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Patient Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        placeholder="Leave blank if unknown"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Approx Age</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Gender</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Unknown</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Priority Level</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none font-bold text-red-600"
                                        value={formData.triageLevel}
                                        onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
                                    >
                                        <option value="Emergency">🔴 Emergency (Immediate)</option>
                                        <option value="Urgent">🟠 Urgent (Very Soon)</option>
                                        <option value="Less Urgent">🟡 Less Urgent</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Chief Complaint / Condition</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        rows="2"
                                        value={formData.chiefComplaint}
                                        onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                        placeholder="Brief description of condition..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Brought By</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        value={formData.broughtBy}
                                        onChange={(e) => setFormData({ ...formData, broughtBy: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Contact Info</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-lg shadow-red-600/30 flex items-center gap-2">
                                    <Save size={18} />
                                    Register Emergency
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyCare;
