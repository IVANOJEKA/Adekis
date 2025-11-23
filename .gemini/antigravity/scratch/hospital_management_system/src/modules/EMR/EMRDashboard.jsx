import React, { useState } from 'react';
import { FileText, Activity, Clock, Search, FolderPlus, AlertCircle, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import PatientDetailsModal from './components/PatientDetailsModal';

const EMRDashboard = () => {
    const { patients } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Filter patients based on search term
    const filteredPatients = patients.filter(patient => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (patient.phone && patient.phone.includes(searchTerm));

        // Mock department filtering since we don't have explicit departments on all patients yet
        const matchesDept = departmentFilter === 'All Departments' || true;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Electronic Medical Records</h1>
                    <p className="text-slate-500">Access and manage patient medical history</p>
                </div>
                <button className="btn btn-primary gap-2 flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                    <FolderPlus size={20} />
                    New Record
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Patient Name, ID, or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                        >
                            <option>All Departments</option>
                            <option>Cardiology</option>
                            <option>Neurology</option>
                            <option>Pediatrics</option>
                            <option>General</option>
                        </select>
                        <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none">
                            <option>Recent</option>
                            <option>Oldest</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Recent Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <div key={patient.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{patient.name}</h3>
                                        <p className="text-xs text-slate-500">{patient.id}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${patient.type === 'Emergency' ? 'bg-red-50 text-red-600' :
                                    patient.type === 'In-Patient' ? 'bg-blue-50 text-blue-600' :
                                        'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {patient.type || 'Out-Patient'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Activity size={16} className="text-slate-400" />
                                    <span>Diagnosis: <span className="font-medium">{patient.diagnosis || 'Not recorded'}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock size={16} className="text-slate-400" />
                                    <span>Last Visit: <span className="font-medium">{patient.lastVisit || 'Today'}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <AlertCircle size={16} className={patient.allergies ? "text-orange-400" : "text-slate-400"} />
                                    <span>Allergies: <span className="font-medium">{patient.allergies || 'None'}</span></span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs text-slate-400">
                                    {patient.assignedDoctor || 'Unassigned'}
                                </span>
                                <button
                                    onClick={() => setSelectedPatient(patient)}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        <User size={48} className="mx-auto mb-4 text-slate-300" />
                        <p>No patient records found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Patient Details Modal */}
            {
                selectedPatient && (
                    <PatientDetailsModal
                        patient={selectedPatient}
                        onClose={() => setSelectedPatient(null)}
                    />
                )
            }
        </div >
    );
};

export default EMRDashboard;
