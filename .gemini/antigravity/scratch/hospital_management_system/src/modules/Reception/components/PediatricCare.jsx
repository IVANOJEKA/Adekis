import React, { useState } from 'react';
import { Baby, UserPlus, Save, X, Calendar, Ruler, Weight, Activity } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { generatePatientId } from '../../../utils/patientIdUtils';

const PediatricCare = () => {
    const { patients, addPatient } = useData();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        parentName: '',
        dob: '',
        gender: 'Male',
        weight: '',
        height: '',
        bloodGroup: '',
        emergencyContact: ''
    });

    // Auto-generate ID for preview
    const nextId = generatePatientId(patients, 'pediatric');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate age from DOB
        const birthDate = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // If age is 0, calculate months
        let ageDisplay = `${age} yrs`;
        if (age === 0) {
            let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
            months -= birthDate.getMonth();
            months += today.getMonth();
            ageDisplay = `${months} months`;
        }

        const newPatient = {
            name: formData.name,
            parentName: formData.parentName,
            dateOfBirth: formData.dob,
            gender: formData.gender,
            phone: formData.emergencyContact,
            weight: formData.weight,
            height: formData.height,
            bloodGroup: formData.bloodGroup,
            patientCategory: 'Pediatric',
            status: 'Active'
        };

        const result = await addPatient(newPatient);

        if (result.success) {
            setShowModal(false);
            setFormData({
                name: '',
                parentName: '',
                dob: '',
                gender: 'Male',
                weight: '',
                height: '',
                bloodGroup: '',
                emergencyContact: ''
            });
            alert(`Pediatric Patient Registered Successfully! ID: ${result.patient.patientId || result.patient.id}`);
        } else {
            alert(`Failed to register patient: ${result.error}`);
        }
    };

    const pediatricPatients = patients.filter(p => p.patientCategory === 'Pediatric');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg">
                        <Baby size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Pediatric Care</h2>
                        <p className="text-sm text-slate-500">Manage child patients (0-12 years)</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all"
                >
                    <UserPlus size={20} />
                    Register Child
                </button>
            </div>

            {/* Patient List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Registered Children</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="p-4">Patient ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Age/Gender</th>
                                <th className="p-4">Parent/Guardian</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Vitals</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pediatricPatients.length > 0 ? pediatricPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-primary">{patient.patientId || patient.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{patient.name}</td>
                                    <td className="p-4 text-slate-600">
                                        {/* Calculate Age Display */}
                                        {(() => {
                                            if (!patient.dateOfBirth) return 'N/A';
                                            const birthDate = new Date(patient.dateOfBirth);
                                            const today = new Date();
                                            let age = today.getFullYear() - birthDate.getFullYear();
                                            const m = today.getMonth() - birthDate.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                age--;
                                            }
                                            return `${age} yrs`;
                                        })()}
                                        / {patient.gender}
                                    </td>
                                    <td className="p-4 text-slate-600">{patient.parentName || '-'}</td>
                                    <td className="p-4 text-slate-600">{patient.phone}</td>
                                    <td className="p-4 text-slate-600">
                                        {patient.weight ? `${patient.weight}kg` : '-'} / {patient.height ? `${patient.height}cm` : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No pediatric patients registered yet.
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-slate-100 bg-pink-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-pink-800 flex items-center gap-2">
                                <Baby size={20} />
                                New Pediatric Registration
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* ID Preview */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Auto-generated ID:</span>
                                <span className="font-mono font-bold text-primary text-lg">{nextId}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Child's Name <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Parent/Guardian Name <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.parentName}
                                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                                    <div className="relative">
                                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Height (cm)</label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                            value={formData.height}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Emergency Contact <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Blood Group</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium shadow-lg shadow-pink-500/30 flex items-center gap-2">
                                    <Save size={18} />
                                    Register Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PediatricCare;
