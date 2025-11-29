import React, { useState } from 'react';
import { Baby, Calendar, FileText, Heart, Plus, X } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { generatePatientId } from '../../../utils/patientIdUtils';

const MaternityCare = () => {
    const { patients: allPatients, addPatient } = useData();
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Filter for maternity patients
    const mothers = allPatients.filter(p => p.patientCategory === 'Maternity' || (p.id && p.id.startsWith('M-')));

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Calculate DOB from Age
        const age = parseInt(formData.get('age') || 0);
        const birthYear = new Date().getFullYear() - age;
        const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

        const newMother = {
            name: formData.get('fullName'),
            dateOfBirth: dateOfBirth,
            gender: 'Female',
            phone: formData.get('phone'),
            patientCategory: 'Maternity',
            insuranceProvider: formData.get('insuranceProvider') || '-',
            // Store extra fields in details
            details: {
                weeks: formData.get('weeks'),
                edd: formData.get('edd'),
                lmp: formData.get('lmp'),
                gravida: formData.get('gravida'),
                para: formData.get('para'),
                risk: formData.get('risk'),
                nextVisit: formData.get('nextVisit'),
                type: formData.get('type')
            },
            status: 'Active'
        };

        const result = await addPatient(newMother);

        if (result.success) {
            setShowRegisterModal(false);
            alert(`Maternity Patient Registered Successfully! ID: ${result.patient.patientId || result.patient.id}`);
        } else {
            alert(`Failed to register patient: ${result.error}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Antenatal Care (ANC)</h2>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30 font-medium text-sm"
                >
                    <Plus size={16} />
                    Register Mother
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mothers.length > 0 ? mothers.map((mother) => (
                    <div key={mother.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-5 text-pink-500">
                            <Heart size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                                        {mother.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{mother.name}</h3>
                                        <p className="text-xs text-slate-500">{mother.patientId || mother.id} • {
                                            (() => {
                                                if (mother.age) return mother.age;
                                                if (mother.dateOfBirth) {
                                                    const birthDate = new Date(mother.dateOfBirth);
                                                    return new Date().getFullYear() - birthDate.getFullYear();
                                                }
                                                return 'N/A';
                                            })()
                                        }y</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${mother.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    }`}>
                                    {mother.details?.risk || mother.risk} Risk
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Gestation</p>
                                    <p className="font-bold text-slate-800">{mother.details?.weeks || mother.weeks} Weeks</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">EDD</p>
                                    <p className="font-bold text-slate-800">{mother.details?.edd || mother.edd}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={14} />
                                    <span>Next: {mother.details?.nextVisit || mother.nextVisit}</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-700 font-medium text-xs flex items-center gap-1">
                                    View File <FileText size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 text-center py-12 text-slate-400">
                        <Baby size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No maternity patients registered yet</p>
                        <p className="text-sm mt-2">Click "Register Mother" to add the first patient</p>
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-pink-50 sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <Baby className="text-pink-600" size={24} />
                                <h3 className="font-bold text-lg text-slate-800">Register Maternity Patient</h3>
                            </div>
                            <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleRegister} className="p-6 space-y-6">
                            {/* Patient ID Preview */}
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Maternity Patient ID (Auto-Generated)</p>
                                        <p className="text-2xl font-bold text-pink-600 mt-1">Auto-Generated</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                        Auto-Assigned
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                                        <input name="fullName" required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="e.g. Jane Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Age <span className="text-red-500">*</span></label>
                                        <input name="age" required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="25" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                                        <input name="phone" required type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="e.g. 077..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Payment Type <span className="text-red-500">*</span></label>
                                        <select name="type" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none bg-white">
                                            <option value="Private">Private (Cash)</option>
                                            <option value="Insurance">Insurance</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Insurance Provider (Optional)</label>
                                        <input name="insuranceProvider" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="e.g. Jubilee, UAP" />
                                    </div>
                                </div>
                            </div>

                            {/* Obstetric Information */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                    Obstetric Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Gravida <span className="text-red-500">*</span></label>
                                        <input name="gravida" required type="number" min="1" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="1" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Para <span className="text-red-500">*</span></label>
                                        <input name="para" required type="number" min="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Gestation (Weeks) <span className="text-red-500">*</span></label>
                                        <input name="weeks" required type="number" min="1" max="42" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" placeholder="24" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">LMP (Last Menstrual Period) <span className="text-red-500">*</span></label>
                                        <input name="lmp" required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">EDD (Expected Delivery Date) <span className="text-red-500">*</span></label>
                                        <input name="edd" required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Risk Level <span className="text-red-500">*</span></label>
                                        <select name="risk" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none bg-white">
                                            <option value="Low">Low Risk</option>
                                            <option value="Medium">Medium Risk</option>
                                            <option value="High">High Risk</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-3">
                                        <label className="text-sm font-medium text-slate-700">Next Visit Date <span className="text-red-500">*</span></label>
                                        <input name="nextVisit" required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium shadow-lg shadow-pink-500/30">
                                    Complete Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaternityCare;
