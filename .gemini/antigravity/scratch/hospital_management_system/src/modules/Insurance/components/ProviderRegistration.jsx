import React, { useState } from 'react';
import { Building2, Save, X, CheckCircle, Award, Clock, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const ProviderRegistration = ({ onClose }) => {
    const { hospitalProfile, setHospitalProfile } = useData();

    const [formData, setFormData] = useState(hospitalProfile || {
        name: 'Adekis Hospital',
        taxId: '',
        npiNumber: '',
        licenseNumber: '',
        address: '',
        city: '',
        country: 'Uganda',
        phone: '',
        email: '',
        website: '',
        specialties: [],
        accreditations: [],
        operatingHours: '24/7 Emergency, Mon-Sat 8AM-6PM Outpatient',
        emergencyCoverage: true,
        bedCapacity: '',
        established: ''
    });

    const [newSpecialty, setNewSpecialty] = useState('');
    const [newAccreditation, setNewAccreditation] = useState('');

    const commonSpecialties = [
        'Emergency Medicine', 'General Surgery', 'Internal Medicine', 'Pediatrics',
        'Obstetrics & Gynecology', 'Orthopedics', 'Cardiology', 'Radiology',
        'Laboratory Services', 'Pharmacy', 'Anesthesiology', 'ICU'
    ];

    const handleAddSpecialty = (specialty) => {
        if (specialty && !formData.specialties.includes(specialty)) {
            setFormData({ ...formData, specialties: [...formData.specialties, specialty] });
        }
        setNewSpecialty('');
    };

    const handleRemoveSpecialty = (specialty) => {
        setFormData({
            ...formData,
            specialties: formData.specialties.filter(s => s !== specialty)
        });
    };

    const handleAddAccreditation = () => {
        if (newAccreditation && !formData.accreditations.includes(newAccreditation)) {
            setFormData({ ...formData, accreditations: [...formData.accreditations, newAccreditation] });
        }
        setNewAccreditation('');
    };

    const handleRemoveAccreditation = (accreditation) => {
        setFormData({
            ...formData,
            accreditations: formData.accreditations.filter(a => a !== accreditation)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setHospitalProfile(formData);
        alert('Hospital provider profile saved successfully!');
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Hospital Provider Registration</h2>
                            <p className="text-blue-100 text-sm">Complete your provider profile for insurance companies</p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Basic Information */}
                    <div className="border-2 border-blue-100 rounded-xl p-5 bg-blue-50/30">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter hospital name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">License Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="HL-2024-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / TIN *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="TIN-12345678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">NPI Number (if applicable)</label>
                                <input
                                    type="text"
                                    value={formData.npiNumber}
                                    onChange={(e) => setFormData({ ...formData, npiNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="NPI-9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bed Capacity</label>
                                <input
                                    type="number"
                                    value={formData.bedCapacity}
                                    onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Year Established</label>
                                <input
                                    type="number"
                                    value={formData.established}
                                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="2020"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-2 border-emerald-100 rounded-xl p-5 bg-emerald-50/30">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Phone size={20} className="text-emerald-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="123 Medical Center Dr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Kampala"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="+256 700 000000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="billing@hospital.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="https://www.hospital.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="border-2 border-purple-100 rounded-xl p-5 bg-purple-50/30">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-purple-600" />
                            Medical Specialties
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <select
                                    value={newSpecialty}
                                    onChange={(e) => handleAddSpecialty(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select a specialty...</option>
                                    {commonSpecialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty(newSpecialty))}
                                    placeholder="Or type custom..."
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.specialties.map((specialty, index) => (
                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                                        {specialty}
                                        <button type="button" onClick={() => handleRemoveSpecialty(specialty)} className="hover:text-purple-900">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Accreditations */}
                    <div className="border-2 border-amber-100 rounded-xl p-5 bg-amber-50/30">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-amber-600" />
                            Accreditations & Certifications
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newAccreditation}
                                    onChange={(e) => setNewAccreditation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAccreditation())}
                                    placeholder="e.g., JCI, MOH Uganda, ISO 9001"
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddAccreditation}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.accreditations.map((accreditation, index) => (
                                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-2">
                                        <Award size={14} />
                                        {accreditation}
                                        <button type="button" onClick={() => handleRemoveAccreditation(accreditation)} className="hover:text-amber-900">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="border-2 border-slate-100 rounded-xl p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-slate-600" />
                            Operating Hours
                        </h3>
                        <textarea
                            value={formData.operatingHours}
                            onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="e.g., 24/7 Emergency Services, Mon-Sat 8AM-6PM Outpatient"
                        />
                        <label className="flex items-center gap-2 mt-3">
                            <input
                                type="checkbox"
                                checked={formData.emergencyCoverage}
                                onChange={(e) => setFormData({ ...formData, emergencyCoverage: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">24/7 Emergency Coverage Available</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Save Provider Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProviderRegistration;
