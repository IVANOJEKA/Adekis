import React, { useState } from 'react';
import { Search, Plus, Eye, Calendar, User, MapPin, Phone, Activity, Edit, FileText } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { getCareLevelColor } from '../../../utils/homeCareUtils';

const HomeCarePatientsList = ({ onEnrollPatient, onViewPatient, onScheduleVisit }) => {
    const { homeCarePatientsData = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [careLevelFilter, setCareLevelFilter] = useState('all');

    // Filter patients
    const filteredPatients = homeCarePatientsData.filter(patient => {
        const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        const matchesCareLevel = careLevelFilter === 'all' || patient.careLevel === careLevelFilter;

        return matchesSearch && matchesStatus && matchesCareLevel;
    });

    // Statistics
    const stats = {
        total: homeCarePatientsData.length,
        active: homeCarePatientsData.filter(p => p.status === 'Active').length,
        intensive: homeCarePatientsData.filter(p => p.careLevel === 'Intensive').length,
        standard: homeCarePatientsData.filter(p => p.careLevel === 'Standard').length
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Patients</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Activity size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Active Cases</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <FileText size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Intensive Care</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.intensive}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Calendar size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Standard Care</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.standard}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, ID, or diagnosis..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                        <select
                            value={careLevelFilter}
                            onChange={(e) => setCareLevelFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        >
                            <option value="all">All Care Levels</option>
                            <option value="Intensive">Intensive</option>
                            <option value="Standard">Standard</option>
                            <option value="Basic">Basic</option>
                        </select>
                        <button
                            onClick={onEnrollPatient}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 font-medium whitespace-nowrap"
                        >
                            <Plus size={18} />
                            Enroll Patient
                        </button>
                    </div>
                </div>
            </div>

            {/* Patients List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Care Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Nurse</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => {
                                    const careLevelColors = getCareLevelColor(patient.careLevel);
                                    return (
                                        <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-slate-800">{patient.patientName}</p>
                                                    <p className="text-xs text-slate-500">{patient.id} • {patient.age}y, {patient.gender}</p>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                        <Phone size={12} />
                                                        {patient.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{patient.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-700 line-clamp-2">{patient.diagnosis}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${careLevelColors.badge}`}>
                                                    {patient.careLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                        {patient.assignedNurseName.charAt(0)}
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-700">{patient.assignedNurseName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    patient.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => onViewPatient(patient)}
                                                        className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onScheduleVisit(patient)}
                                                        className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg transition-colors"
                                                        title="Schedule Visit"
                                                    >
                                                        <Calendar size={16} />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <User size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No home care patients found</p>
                                        <button
                                            onClick={onEnrollPatient}
                                            className="mt-4 text-primary hover:text-primary-dark font-medium"
                                        >
                                            Enroll your first patient
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeCarePatientsList;
