import React, { useState } from 'react';
import { X, Save, User, MapPin, Phone, Calendar, Activity, FileText, AlertCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { generateHomeCarePatientId } from '../../../utils/homeCareUtils';

const EnrollPatientModal = ({ onClose, onSubmit }) => {
    const { patients, homeCarePatientsData, employees } = useData();

    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        age: '',
        gender: 'Male',
        address: '',
        phone: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        diagnosis: '',
        careLevel: 'Standard',
        visitFrequency: 'Daily',
        startDate: new Date().toISOString().slice(0, 10),
        duration: '30',
        assignedNurse: '',
        specialInstructions: ''
    });

    const [searchPatient, setSearchPatient] = useState('');
    const [showPatientSearch, setShowPatientSearch] = useState(true);

    // Filter nurses from employees
    const nurses = employees.filter(emp =>
        emp.department === 'Nursing' || emp.position?.toLowerCase().includes('nurse')
    );

    // Filter patients for search
    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.id.toLowerCase().includes(searchPatient.toLowerCase())
    ).slice(0, 5);

    // Calculate end date based on duration
    const calculateEndDate = (startDate, durationDays) => {
        const end = new Date(startDate);
        end.setDate(end.getDate() + parseInt(durationDays));
        return end.toISOString().slice(0, 10);
    };

    const handleSelectPatient = (patient) => {
        setFormData({
            ...formData,
            patientId: patient.id,
            patientName: patient.name,
            age: patient.age || '',
            gender: patient.gender || 'Male',
            phone: patient.phone || '',
            address: patient.address || ''
        });
        setShowPatientSearch(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newHomeCarePatient = {
            id: generateHomeCarePatientId(homeCarePatientsData),
            patientId: formData.patientId,
            patientName: formData.patientName,
            age: formData.age,
            gender: formData.gender,
            address: formData.address,
            phone: formData.phone,
            emergencyContact: {
                name: formData.emergencyContactName,
                phone: formData.emergencyContactPhone,
                relationship: formData.emergencyContactRelationship
            },
            diagnosis: formData.diagnosis,
            careLevel: formData.careLevel,
            startDate: formData.startDate,
            endDate: calculateEndDate(formData.startDate, formData.duration),
            status: 'Active',
            assignedNurseId: formData.assignedNurse,
            assignedNurseName: nurses.find(n => n.id === formData.assignedNurse)?.name || '',
            visitFrequency: formData.visitFrequency,
            specialInstructions: formData.specialInstructions,
            createdDate: new Date().toISOString()
        };

        onSubmit(newHomeCarePatient);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="font-bold text-xl text-slate-800">Enroll Patient for Home Care</h2>
                        <p className="text-slate-500 text-sm">Register a new patient for bedside nursing services</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Auto-generated ID Preview */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Home Care ID (Auto-Generated)</p>
                                <p className="text-2xl font-bold text-primary mt-1">{generateHomeCarePatientId(homeCarePatientsData)}</p>
                            </div>
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                Auto-Assigned
                            </div>
                        </div>
                    </div>

                    {/* Patient Selection */}
                    {showPatientSearch ? (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">Search Existing Patient</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={searchPatient}
                                    onChange={(e) => setSearchPatient(e.target.value)}
                                    placeholder="Search by name or ID..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            {searchPatient && filteredPatients.length > 0 && (
                                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                                    {filteredPatients.map(patient => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handleSelectPatient(patient)}
                                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <p className="font-medium text-slate-800">{patient.name}</p>
                                            <p className="text-xs text-slate-500">{patient.id} • {patient.age}y, {patient.gender}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPatientSearch(false)}
                                className="text-sm text-primary hover:text-primary-dark font-medium"
                            >
                                Or enter patient details manually
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Patient Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Patient ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="P-XXX"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Age *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="65"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Gender *</label>
                                    <select
                                        required
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="0756123456"
                                />
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MapPin size={16} />
                            Home Address *
                        </label>
                        <textarea
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"
                            placeholder="Full home address for nurse visits"
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle size={18} className="text-amber-600" />
                            Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.emergencyContactName}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.emergencyContactPhone}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Relationship *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.emergencyContactRelationship}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                    placeholder="e.g. Son, Daughter"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Diagnosis / Condition *</label>
                        <textarea
                            required
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"
                            placeholder="Primary condition requiring home care"
                        />
                    </div>

                    {/* Care Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Care Level *</label>
                            <select
                                required
                                value={formData.careLevel}
                                onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="Basic">Basic - Routine care</option>
                                <option value="Standard">Standard - Regular monitoring</option>
                                <option value="Intensive">Intensive - Complex needs</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Visit Frequency *</label>
                            <select
                                required
                                value={formData.visitFrequency}
                                onChange={(e) => setFormData({ ...formData, visitFrequency: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="Daily">Daily</option>
                                <option value="Twice Daily">Twice Daily</option>
                                <option value="Every Other Day">Every Other Day</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Twice Weekly">Twice Weekly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Start Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Duration (Days) *</label>
                            <input
                                type="number"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="30"
                            />
                            <p className="text-xs text-slate-500">End date: {calculateEndDate(formData.startDate, formData.duration)}</p>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Assign Nurse *</label>
                            <select
                                required
                                value={formData.assignedNurse}
                                onChange={(e) => setFormData({ ...formData, assignedNurse: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="">Select a nurse</option>
                                {nurses.map(nurse => (
                                    <option key={nurse.id} value={nurse.id}>
                                        {nurse.name} - {nurse.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Special Instructions</label>
                        <textarea
                            value={formData.specialInstructions}
                            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                            placeholder="Any special care instructions or notes"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <Save size={18} />
                        Enroll Patient
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollPatientModal;
