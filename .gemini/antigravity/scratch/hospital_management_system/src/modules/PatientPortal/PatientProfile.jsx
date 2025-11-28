import React from 'react';
import { User, Phone, Mail, MapPin, Heart, AlertTriangle, Shield } from 'lucide-react';

const PatientProfile = ({ patient }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">My Profile</h2>
                <p className="text-slate-600">View your personal information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header with Avatar */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                            {patient.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold mb-1">{patient.name}</h3>
                            <p className="text-blue-100">Patient ID: {patient.id}</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="p-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-slate-500">Full Name</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Age</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.age} years</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Gender</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.gender}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Patient Category</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.patientCategory || 'General'}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="px-8 pb-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-primary" />
                        Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Phone size={18} className="text-slate-400 mt-1" />
                            <div>
                                <label className="text-sm font-medium text-slate-500">Phone Number</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={18} className="text-slate-400 mt-1" />
                            <div>
                                <label className="text-sm font-medium text-slate-500">Email Address</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.email || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 md:col-span-2">
                            <MapPin size={18} className="text-slate-400 mt-1" />
                            <div>
                                <label className="text-sm font-medium text-slate-500">Address</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.address || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className="px-8 pb-8">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Heart size={20} className="text-primary" />
                        Medical Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-slate-500">Blood Type</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.bloodType || 'Not recorded'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500">Allergies</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.allergies || 'None recorded'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-500">Chronic Conditions</label>
                            <p className="text-slate-800 font-medium mt-1">{patient.chronicConditions || 'None recorded'}</p>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                {patient.emergencyContact && (
                    <div className="px-8 pb-8">
                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-primary" />
                            Emergency Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-slate-500">Name</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.emergencyContact.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Relationship</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.emergencyContact.relationship}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Phone Number</label>
                                <p className="text-slate-800 font-medium mt-1">{patient.emergencyContact.phone}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Privacy Notice */}
                <div className="px-8 pb-8">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                        <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 font-medium">Your Information is Secure</p>
                            <p className="text-xs text-blue-700 mt-1">
                                All your personal and medical information is encrypted and protected according to healthcare privacy regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
