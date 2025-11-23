import React, { useState } from 'react';
import { Microscope, FileText, Activity, Clock, Search, Filter, Plus, Eye, Edit, CheckCircle, AlertCircle, Tag, Layers, Scissors, Database, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PathologyDashboard = () => {
    const { patients } = useData();
    const [activeTab, setActiveTab] = useState('specimens');
    const [showAccessionModal, setShowAccessionModal] = useState(false);
    const [selectedSpecimen, setSelectedSpecimen] = useState(null);

    // Mock Pathology Data
    const [specimens, setSpecimens] = useState([
        {
            id: 'PATH-24-001',
            patientId: 'P-001',
            patientName: 'Mary Johnson',
            collectionDate: '2024-01-20',
            type: 'Tissue Biopsy',
            site: 'Breast Mass, Left',
            status: 'Grossing',
            priority: 'Urgent',
            slides: 0,
            assignedPathologist: 'Dr. A. Smith'
        },
        {
            id: 'PATH-24-002',
            patientId: 'P-003',
            patientName: 'Sarah Wilson',
            collectionDate: '2024-01-19',
            type: 'Cytology',
            site: 'Cervical Smear',
            status: 'Reporting',
            priority: 'Routine',
            slides: 2,
            assignedPathologist: 'Dr. B. Jones'
        },
        {
            id: 'PATH-24-003',
            patientId: 'P-005',
            patientName: 'James Brown',
            collectionDate: '2024-01-18',
            type: 'Resection',
            site: 'Appendix',
            status: 'Completed',
            priority: 'Routine',
            slides: 4,
            assignedPathologist: 'Dr. A. Smith',
            diagnosis: 'Acute Appendicitis'
        }
    ]);

    const [accessionForm, setAccessionForm] = useState({
        patientId: '',
        type: 'Tissue Biopsy',
        site: '',
        collectionDate: new Date().toISOString().split('T')[0],
        clinicalHistory: '',
        priority: 'Routine'
    });

    const workflowStages = [
        { id: 'Accessioning', label: 'Accessioning', icon: Tag, color: 'bg-blue-500' },
        { id: 'Grossing', label: 'Grossing', icon: Scissors, color: 'bg-indigo-500' },
        { id: 'Processing', label: 'Processing', icon: Layers, color: 'bg-purple-500' },
        { id: 'Reporting', label: 'Microscopy', icon: Microscope, color: 'bg-pink-500' },
        { id: 'Completed', label: 'Completed', icon: CheckCircle, color: 'bg-emerald-500' }
    ];

    const handleAccessionSubmit = (e) => {
        e.preventDefault();
        const patient = patients.find(p => p.id === accessionForm.patientId);
        if (!patient) {
            alert('Patient not found');
            return;
        }

        const newSpecimen = {
            id: `PATH-24-${String(specimens.length + 1).padStart(3, '0')}`,
            patientId: accessionForm.patientId,
            patientName: patient.name,
            collectionDate: accessionForm.collectionDate,
            type: accessionForm.type,
            site: accessionForm.site,
            status: 'Accessioning',
            priority: accessionForm.priority,
            slides: 0,
            assignedPathologist: null
        };

        setSpecimens([newSpecimen, ...specimens]);
        setShowAccessionModal(false);
        setAccessionForm({
            patientId: '',
            type: 'Tissue Biopsy',
            site: '',
            collectionDate: new Date().toISOString().split('T')[0],
            clinicalHistory: '',
            priority: 'Routine'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accessioning': return 'bg-blue-100 text-blue-700';
            case 'Grossing': return 'bg-indigo-100 text-indigo-700';
            case 'Processing': return 'bg-purple-100 text-purple-700';
            case 'Reporting': return 'bg-pink-100 text-pink-700';
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pathology Department</h1>
                    <p className="text-slate-500">Histopathology & Cytopathology Management</p>
                </div>
                <button
                    onClick={() => setShowAccessionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={20} />
                    New Specimen Accession
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Cases</p>
                        <p className="text-2xl font-bold text-slate-800">{specimens.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Database size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">In Processing</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {specimens.filter(s => ['Grossing', 'Processing'].includes(s.status)).length}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Layers size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">To Report</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {specimens.filter(s => s.status === 'Reporting').length}
                        </p>
                    </div>
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg">
                        <Microscope size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {specimens.filter(s => s.status === 'Completed').length}
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Workflow Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('specimens')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'specimens' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    All Specimens
                </button>
                {workflowStages.map(stage => (
                    <button
                        key={stage.id}
                        onClick={() => setActiveTab(stage.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === stage.id ? 'bg-white border-2 border-primary text-primary' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <stage.icon size={16} />
                        {stage.label}
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                            {specimens.filter(s => s.status === stage.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Specimen List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">
                        {activeTab === 'specimens' ? 'All Cases' : `${activeTab} Queue`}
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search case ID or patient..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="p-4">Case ID</th>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Specimen</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {specimens
                            .filter(s => activeTab === 'specimens' || s.status === activeTab)
                            .map((specimen) => (
                                <tr key={specimen.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-primary">{specimen.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{specimen.patientName}</div>
                                        <div className="text-xs text-slate-500">{specimen.patientId}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{specimen.type}</div>
                                        <div className="text-xs text-slate-500">{specimen.site}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{specimen.collectionDate}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(specimen.status)}`}>
                                            {specimen.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${specimen.priority === 'Urgent' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-100'}`}>
                                            {specimen.priority}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Update Status">
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Accession Modal */}
            {showAccessionModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">New Specimen Accession</h3>
                            <button onClick={() => setShowAccessionModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAccessionSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Patient <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={accessionForm.patientId}
                                        onChange={(e) => setAccessionForm({ ...accessionForm, patientId: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Collection Date</label>
                                    <input
                                        type="date"
                                        value={accessionForm.collectionDate}
                                        onChange={(e) => setAccessionForm({ ...accessionForm, collectionDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Specimen Type <span className="text-red-500">*</span></label>
                                    <select
                                        value={accessionForm.type}
                                        onChange={(e) => setAccessionForm({ ...accessionForm, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option>Tissue Biopsy</option>
                                        <option>Cytology</option>
                                        <option>Resection</option>
                                        <option>Fluid</option>
                                        <option>Bone Marrow</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Anatomic Site <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Left Breast, Cervix"
                                        value={accessionForm.site}
                                        onChange={(e) => setAccessionForm({ ...accessionForm, site: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Clinical History</label>
                                <textarea
                                    rows="3"
                                    value={accessionForm.clinicalHistory}
                                    onChange={(e) => setAccessionForm({ ...accessionForm, clinicalHistory: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Relevant clinical details..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Priority</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="Routine"
                                            checked={accessionForm.priority === 'Routine'}
                                            onChange={(e) => setAccessionForm({ ...accessionForm, priority: e.target.value })}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-slate-700">Routine</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="Urgent"
                                            checked={accessionForm.priority === 'Urgent'}
                                            onChange={(e) => setAccessionForm({ ...accessionForm, priority: e.target.value })}
                                            className="text-red-600 focus:ring-red-600"
                                        />
                                        <span className="text-red-600 font-medium">Urgent</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowAccessionModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30">
                                    Accession Specimen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathologyDashboard;
