import React, { useState } from 'react';
import { Calendar, FileText, Users, AlertCircle, Eye, Trash2, Search, X, Save, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EMRDashboard from '../EMR/EMRDashboard';
import ClinicalDocumentation from './components/ClinicalDocumentation';
import ClinicalProcedures from './components/ClinicalProcedures';
import CommunicationDashboard from '../Communication/CommunicationDashboard';
import Consultations from './components/Consultations';
import PrescriptionManager from './components/PrescriptionManager';
import MedicalConsultationForm from './components/MedicalConsultationForm';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Component Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="text-red-800 font-bold mb-2">Something went wrong</h3>
                    <p className="text-red-600 font-mono text-sm">{this.state.error && this.state.error.toString()}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const DoctorDashboard = () => {
    const { patients, setPatients, queueEntries, setQueueEntries } = useData();
    const [activeTab, setActiveTab] = useState('patient-queue');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        patientId: '',
        category: 'OPD',
        notes: ''
    });
    const [diagnosisSearch, setDiagnosisSearch] = useState('');
    const [showConsultationForm, setShowConsultationForm] = useState(false);
    const [consultationPatientId, setConsultationPatientId] = useState(null);

    // Mock Data
    const stats = [
        { label: "Today's Appointments", value: '2', subtext: '1 completed, 1 pending', icon: Calendar, color: 'blue' },
        { label: 'Prescriptions Sent', value: '2', subtext: "Today's prescriptions", icon: FileText, color: 'emerald' },
        { label: 'Active Patients', value: patients.length, subtext: 'Under your care', icon: Users, color: 'purple' },
        { label: 'Pending Reviews', value: '3', subtext: 'Lab results to review', icon: AlertCircle, color: 'orange' },
    ];

    const appointments = [
        { time: '09:00', patient: 'John Smith', type: 'Follow-up Consultation', status: 'Scheduled' },
        { time: '10:30', patient: 'Mary Johnson', type: 'General Consultation', status: 'Scheduled' },
        { time: '14:00', patient: 'David Lee', type: 'Specialist Consultation', status: 'Completed' },
    ];

    const prescriptions = [
        { id: 'RX001', patient: 'John Smith', date: '2024-01-20', medication: 'Paracetamol 500mg', status: 'Active' },
        { id: 'RX002', patient: 'Mary Johnson', date: '2024-01-19', medication: 'Amoxicillin 250mg', status: 'Active' },
    ];

    const standardDiagnoses = [
        { code: 'A09', name: 'Infectious Gastroenteritis', category: 'Infectious' },
        { code: 'B50', name: 'Plasmodium falciparum malaria', category: 'Infectious' },
        { code: 'I10', name: 'Essential (primary) hypertension', category: 'Cardiovascular' },
        { code: 'E11', name: 'Type 2 diabetes mellitus', category: 'Endocrine' },
        { code: 'J00', name: 'Acute nasopharyngitis [common cold]', category: 'Respiratory' },
        { code: 'J18', name: 'Pneumonia, unspecified', category: 'Respiratory' },
        { code: 'K29', name: 'Gastritis and duodenitis', category: 'Digestive' },
        { code: 'N39.0', name: 'Urinary tract infection, site not specified', category: 'Genitourinary' },
        { code: 'R51', name: 'Headache', category: 'Neurological' },
        { code: 'M54.5', name: 'Low back pain', category: 'Musculoskeletal' },
        { code: 'O80', name: 'Single spontaneous delivery', category: 'Obstetric' },
        { code: 'Z00.0', name: 'General medical examination', category: 'General' }
    ];

    const getCategoryColor = (category) => {
        switch (category) {
            case 'OPD': return 'bg-blue-100 text-blue-700';
            case 'IPD': return 'bg-purple-100 text-purple-700';
            case 'Emergency': return 'bg-red-100 text-red-700';
            case 'Maternity': return 'bg-pink-100 text-pink-700';
            case 'Pediatric': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleOpenCategoryModal = (patient = null) => {
        if (patient) {
            setSelectedPatient(patient);
            setCategoryFormData({
                patientId: patient.id,
                category: patient.patientCategory || 'OPD',
                notes: ''
            });
        } else {
            setSelectedPatient(null);
            setCategoryFormData({ patientId: '', category: 'OPD', notes: '' });
        }
        setShowCategoryModal(true);
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();

        setPatients(prev => prev.map(p =>
            p.id === categoryFormData.patientId
                ? { ...p, patientCategory: categoryFormData.category }
                : p
        ));

        setShowCategoryModal(false);
        setSelectedPatient(null);
    };

    const handleOpenConsultationForm = (patientId) => {
        setConsultationPatientId(patientId);
        setShowConsultationForm(true);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage patients, appointments, and prescriptions</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30">
                        <Calendar size={16} />
                        Quick Consultation
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">
                        <FileText size={16} />
                        New Prescription
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-5 rounded-xl hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${stat.color}-500`}>
                            <stat.icon size={60} />
                        </div>
                        <div className="relative z-10">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 w-fit mb-3`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Patient Queue', 'Appointments', 'Patients', 'EMR', 'Clinical Documentation', 'Clinical Procedures', 'Patient Categories', 'Prescriptions', 'Standard Diagnosis', 'Consultations', 'Communication'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(/ /g, '-');
                        const isActive = activeTab === tabKey;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Appointments Tab */}
                    {activeTab === 'appointments' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-slate-800">Today's Appointments</h2>
                                <p className="text-sm text-slate-500">Manage your scheduled appointments</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appointments.map((appointment, index) => (
                                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-800">{appointment.time}</td>
                                                <td className="px-6 py-4 text-slate-700">{appointment.patient}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{appointment.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${appointment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" title="View Details">
                                                            <Eye size={18} />
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Cancel">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Patient Queue Tab */}
                    {activeTab === 'patient-queue' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Patient Queue</h2>
                                    <p className="text-sm text-slate-500">Patients waiting for consultation</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                        Emergency: {queueEntries.filter(e => e.department === 'Doctor' && e.status === 'Waiting' && e.priority === 'Emergency').length}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                        Waiting: {queueEntries.filter(e => e.department === 'Doctor' && e.status === 'Waiting').length}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {queueEntries
                                    .filter(e => e.department === 'Doctor' && (e.status === 'Waiting' || e.status === 'Called' || e.status === 'InService'))
                                    .sort((a, b) => {
                                        const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Normal': 2 };
                                        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                                            return priorityOrder[a.priority] - priorityOrder[b.priority];
                                        }
                                        return new Date(a.checkInTime) - new Date(b.checkInTime);
                                    })
                                    .map(entry => (
                                        <div key={entry.id} className={`border rounded-xl p-5 hover:shadow-md transition-all ${entry.status === 'InService' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="font-mono font-bold text-lg text-slate-700">{entry.queueNumber}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${entry.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                                                    entry.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {entry.priority}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-1">{entry.patientName}</h3>
                                            <p className="text-sm text-slate-500 mb-3">{entry.service}</p>

                                            {entry.notes && (
                                                <div className="bg-slate-100 p-2 rounded text-xs text-slate-600 mb-4 italic">
                                                    "{entry.notes}"
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {entry.status === 'Waiting' && (
                                                    <button
                                                        onClick={() => {
                                                            const updatedEntries = queueEntries.map(e =>
                                                                e.id === entry.id ? { ...e, status: 'InService', serviceStartTime: new Date().toISOString() } : e
                                                            );
                                                            setQueueEntries(updatedEntries);
                                                            handleOpenConsultationForm(entry.patientId);
                                                        }}
                                                        className="flex-1 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
                                                    >
                                                        Call Patient
                                                    </button>
                                                )}
                                                {entry.status === 'InService' && (
                                                    <button
                                                        onClick={() => handleOpenConsultationForm(entry.patientId)}
                                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
                                                    >
                                                        Continue Consultation
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {queueEntries.filter(e => e.department === 'Doctor' && (e.status === 'Waiting' || e.status === 'InService')).length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                        <Users size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No patients in queue</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* EMR Tab */}
                    {activeTab === 'emr' && (
                        <div className="p-4">
                            <EMRDashboard />
                        </div>
                    )}

                    {/* Clinical Documentation Tab */}
                    {activeTab === 'clinical-documentation' && (
                        <div className="p-4">
                            <ClinicalDocumentation />
                        </div>
                    )}

                    {/* Clinical Procedures Tab */}
                    {activeTab === 'clinical-procedures' && (
                        <div className="p-4">
                            <ClinicalProcedures />
                        </div>
                    )}

                    {/* Standard Diagnosis Tab */}
                    {activeTab === 'standard-diagnosis' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Standard Hospital Diagnoses</h2>
                                    <p className="text-sm text-slate-500">Reference list of common ICD-10 codes and diagnoses</p>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search diagnoses..."
                                        value={diagnosisSearch}
                                        onChange={(e) => setDiagnosisSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {standardDiagnoses
                                    .filter(d => d.name.toLowerCase().includes(diagnosisSearch.toLowerCase()) || d.code.toLowerCase().includes(diagnosisSearch.toLowerCase()))
                                    .map((diag, index) => (
                                        <div key={index} className="p-4 border border-slate-100 rounded-xl bg-white hover:shadow-md transition-shadow group cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {diag.code}
                                                </span>
                                                <span className="text-xs text-slate-400">{diag.category}</span>
                                            </div>
                                            <h3 className="font-medium text-slate-800 group-hover:text-primary transition-colors">{diag.name}</h3>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Patients Tab */}
                    {activeTab === 'patients' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-slate-800">Active Patients</h2>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search patients..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {patients.map((patient) => (
                                    <div key={patient.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{patient.name}</h3>
                                                    <p className="text-xs text-slate-500">{patient.id} • {patient.age} years</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(patient.patientCategory || 'OPD')}`}>
                                                {patient.patientCategory || 'OPD'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div>
                                                <p className="text-slate-500 text-xs">Last Visit</p>
                                                <p className="font-medium text-slate-700">{patient.lastVisit}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs">Gender</p>
                                                <p className="font-medium text-slate-700">{patient.gender}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenConsultationForm(patient.id)}
                                                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-sm transition-colors hover:bg-green-700"
                                            >
                                                New Consultation
                                            </button>
                                            <button
                                                onClick={() => handleOpenCategoryModal(patient)}
                                                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium text-sm transition-colors hover:bg-primary-dark"
                                            >
                                                Set Category
                                            </button>
                                            <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-sm transition-colors">
                                                View History
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Patient Categories Tab */}
                    {activeTab === 'patient-categories' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Patient Categories Management</h2>
                                <button
                                    onClick={() => handleOpenCategoryModal()}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium flex items-center gap-2"
                                >
                                    <Tag size={16} />
                                    Assign Category
                                </button>
                            </div>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {['OPD', 'IPD', 'Emergency', 'Maternity', 'Pediatric'].map((category) => {
                                    const count = patients.filter(p => p.patientCategory === category).length;
                                    return (
                                        <div key={category} className={`p-4 rounded-xl border-2 ${getCategoryColor(category)} border-current/20`}>
                                            <h3 className="font-bold text-lg mb-1">{category}</h3>
                                            <p className="text-2xl font-bold">{count}</p>
                                            <p className="text-xs opacity-75 mt-1">Patients</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Patients by Category */}
                            <div className="space-y-4">
                                {['OPD', 'IPD', 'Emergency', 'Maternity', 'Pediatric'].map((category) => {
                                    const categoryPatients = patients.filter(p => p.patientCategory === category);
                                    if (categoryPatients.length === 0) return null;

                                    return (
                                        <div key={category} className="border border-slate-200 rounded-xl overflow-hidden">
                                            <div className={`px-4 py-3 ${getCategoryColor(category)} border-b border-current/20`}>
                                                <h3 className="font-bold">{category} Patients ({categoryPatients.length})</h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {categoryPatients.map((patient) => (
                                                        <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                            <div>
                                                                <p className="font-medium text-slate-800">{patient.name}</p>
                                                                <p className="text-xs text-slate-500">{patient.id}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleOpenCategoryModal(patient)}
                                                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                                                title="Change Category"
                                                            >
                                                                <Tag size={16} className="text-slate-600" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Prescriptions Tab */}
                    {activeTab === 'prescriptions' && (
                        <div className="p-4">
                            <ErrorBoundary>
                                <PrescriptionManager />
                            </ErrorBoundary>
                        </div>
                    )}

                    {/* Consultations Tab */}
                    {activeTab === 'consultations' && (
                        <div className="p-4">
                            <Consultations />
                        </div>
                    )}

                    {/* Communication Tab */}
                    {activeTab === 'communication' && (
                        <div className="p-4">
                            <CommunicationDashboard />
                        </div>
                    )}

                    {/* Category Assignment Modal */}
                    {showCategoryModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h2 className="text-xl font-bold text-slate-800">Assign Patient Category</h2>
                                    <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>
                                <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient <span className="text-rose-500">*</span></label>
                                        <select
                                            required
                                            value={categoryFormData.patientId}
                                            onChange={(e) => setCategoryFormData({ ...categoryFormData, patientId: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            disabled={selectedPatient !== null}
                                        >
                                            <option value="">Choose a patient...</option>
                                            {patients.map(patient => (
                                                <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient Category <span className="text-rose-500">*</span></label>
                                        <select
                                            required
                                            value={categoryFormData.category}
                                            onChange={(e) => setCategoryFormData({ ...categoryFormData, category: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="OPD">OPD (Out-Patient Department)</option>
                                            <option value="IPD">IPD (In-Patient Department)</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Maternity">Maternity</option>
                                            <option value="Pediatric">Pediatric</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                                        <textarea
                                            rows="3"
                                            value={categoryFormData.notes}
                                            onChange={(e) => setCategoryFormData({ ...categoryFormData, notes: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Additional notes or reason for categorization..."
                                        ></textarea>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCategoryModal(false)}
                                            className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} />
                                            Save Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Medical Consultation Form Modal */}
            {showConsultationForm && consultationPatientId && (
                <MedicalConsultationForm
                    patientId={consultationPatientId}
                    onClose={() => {
                        setShowConsultationForm(false);
                        setConsultationPatientId(null);
                    }}
                    onSave={() => {
                        setShowConsultationForm(false);
                        setConsultationPatientId(null);
                    }}
                />
            )}
        </div>
    );
};

export default DoctorDashboard;
