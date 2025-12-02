import React, { useState, useMemo } from 'react';
import { AlertCircle, Heart, Thermometer, Activity, Wind, Droplets, Clock, User, FileText, ChevronRight, Plus, X, Search, Scale, Ruler } from 'lucide-react';
import { useData } from '../../context/DataContext';

const TriageDashboard = () => {
    const { patients = [], triageRecords = [], createTriageRecord, queueEntries = [], setQueueEntries } = useData();
    const [showTriageModal, setShowTriageModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Use triageRecords from API instead of local state
    const triageQueue = triageRecords || [];

    const [triageFormData, setTriageFormData] = useState({
        patientId: '',
        chiefComplaint: '',
        bp: '',
        temp: '',
        pulse: '',
        rr: '',
        spo2: '',
        weight: '',
        height: '',
        triageLevel: 'Less Urgent',
        notes: ''
    });

    const triageLevels = [
        { value: 'Emergency', label: 'Red - Emergency', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', borderColor: 'border-red-200' },
        { value: 'Urgent', label: 'Orange - Urgent', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' },
        { value: 'Less Urgent', label: 'Yellow - Less Urgent', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-200' },
        { value: 'Non-Urgent', label: 'Green - Non-Urgent', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50', borderColor: 'border-green-200' }
    ];

    const getLevelConfig = (level) => {
        return triageLevels.find(t => t.value === level) || triageLevels[3];
    };

    const handleTriageSubmit = async (e) => {
        e.preventDefault();
        const patient = patients.find(p => p.id === triageFormData.patientId);

        if (!patient) {
            alert('Patient not found!');
            return;
        }

        // Check for consultation fee payment
        if (!patient.consultationFeePaid) {
            alert('⚠️ Consultation Fee NOT Paid!\n\nPatient must pay the consultation fee at Reception before proceeding to Triage.');
            return;
        }

        try {
            const newTriageData = {
                patientId: triageFormData.patientId,
                chiefComplaint: triageFormData.chiefComplaint,
                vitals: {
                    bp: triageFormData.bp,
                    temp: parseFloat(triageFormData.temp),
                    pulse: parseInt(triageFormData.pulse),
                    rr: parseInt(triageFormData.rr),
                    spo2: parseInt(triageFormData.spo2),
                    weight: parseFloat(triageFormData.weight),
                    height: parseFloat(triageFormData.height)
                },
                priority: triageFormData.triageLevel,
                notes: triageFormData.notes
            };

            await createTriageRecord(newTriageData);

            // Add to Doctor Queue (Mock for now, ideally backend handles this trigger)
            const priorityMap = {
                'Emergency': 'Emergency',
                'Urgent': 'Urgent',
                'Less Urgent': 'Normal',
                'Non-Urgent': 'Normal'
            };

            const doctorQueueEntry = {
                id: `Q-${Date.now()}`,
                queueNumber: `D-${String(queueEntries.filter(e => e.department === 'Doctor').length + 1).padStart(3, '0')}`,
                patientId: patient.id,
                patientName: patient.name,
                department: 'Doctor',
                service: 'General Consultation',
                priority: priorityMap[triageFormData.triageLevel] || 'Normal',
                status: 'Waiting',
                checkInTime: new Date().toISOString(),
                calledTime: null,
                serviceStartTime: null,
                serviceEndTime: null,
                waitTime: 0,
                estimatedWait: 15,
                assignedStaff: null,
                notes: `Triage: ${triageFormData.chiefComplaint}`,
                transferredFrom: 'Triage'
            };

            setQueueEntries([...queueEntries, doctorQueueEntry]);

            setShowTriageModal(false);
            setTriageFormData({
                patientId: '',
                chiefComplaint: '',
                bp: '',
                temp: '',
                pulse: '',
                rr: '',
                spo2: '',
                weight: '',
                height: '',
                triageLevel: 'Less Urgent',
                notes: ''
            });
            alert('Triage assessment completed successfully!');
        } catch (error) {
            console.error("Failed to create triage record:", error);
            alert("Failed to save triage record. Please try again.");
        }
    };

    const filteredQueue = triageQueue.filter(t =>
        t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: triageQueue.length,
        emergency: triageQueue.filter(t => t.triageLevel === 'Emergency').length,
        urgent: triageQueue.filter(t => t.triageLevel === 'Urgent').length,
        waiting: triageQueue.filter(t => t.status === 'Waiting').length
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Triage Station</h1>
                    <p className="text-slate-500">Patient assessment and prioritization</p>
                </div>
                <button
                    onClick={() => setShowTriageModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={20} />
                    New Triage Assessment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total in Queue</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <User size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-red-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Emergency</p>
                            <p className="text-2xl font-bold text-red-700">{stats.emergency}</p>
                        </div>
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm bg-orange-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 font-medium">Urgent</p>
                            <p className="text-2xl font-bold text-orange-700">{stats.urgent}</p>
                        </div>
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Waiting</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.waiting}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by patient name, ID, or complaint..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>

            {/* Triage Queue */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Triage Queue</h3>
                    <p className="text-sm text-slate-500">Sorted by priority level</p>
                </div>
                <div className="divide-y divide-slate-100">
                    {filteredQueue.length > 0 ? filteredQueue.map((triage) => {
                        const levelConfig = getLevelConfig(triage.triageLevel);
                        return (
                            <div key={triage.id} className={`p-4 hover:bg-slate-50 transition-colors border-l-4 ${levelConfig.borderColor}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelConfig.bgLight} ${levelConfig.textColor} border ${levelConfig.borderColor}`}>
                                                {triage.triageLevel}
                                            </span>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Clock size={14} />
                                                <span>{triage.arrivalTime}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg">{triage.patientName}</p>
                                                <p className="text-sm text-slate-500">{triage.patientId} • {triage.age}y, {triage.gender}</p>
                                                <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Chief Complaint:</span> {triage.chiefComplaint}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={16} className="text-red-500" />
                                                    <span className="text-slate-600">BP: <strong>{triage.vitals.bp}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Thermometer size={16} className="text-orange-500" />
                                                    <span className="text-slate-600">Temp: <strong>{triage.vitals.temp}°C</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Heart size={16} className="text-pink-500" />
                                                    <span className="text-slate-600">Pulse: <strong>{triage.vitals.pulse} bpm</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Wind size={16} className="text-blue-500" />
                                                    <span className="text-slate-600">RR: <strong>{triage.vitals.rr}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Droplets size={16} className="text-cyan-500" />
                                                    <span className="text-slate-600">SpO2: <strong>{triage.vitals.spo2}%</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Scale size={16} className="text-indigo-500" />
                                                    <span className="text-slate-600">Weight: <strong>{triage.vitals.weight} kg</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Ruler size={16} className="text-violet-500" />
                                                    <span className="text-slate-600">Height: <strong>{triage.vitals.height} cm</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Activity size={16} className="text-emerald-500" />
                                                    <span className="text-slate-600">BMI: <strong>{(triage.vitals.weight / ((triage.vitals.height / 100) * (triage.vitals.height / 100))).toFixed(1)}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark font-medium">
                                            Assign Doctor
                                        </button>
                                        <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 font-medium">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="p-12 text-center text-slate-400">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No patients in triage queue</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Triage Assessment Modal */}
            {showTriageModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800">New Triage Assessment</h3>
                                <button onClick={() => setShowTriageModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleTriageSubmit} className="p-6 space-y-6">
                            {/* Patient Selection */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3">Patient Information</h4>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Select Patient <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={triageFormData.patientId}
                                        onChange={(e) => setTriageFormData({ ...triageFormData, patientId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="">Choose a patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id} className={!p.consultationFeePaid ? 'text-red-500' : 'text-slate-800'}>
                                                {p.name} ({p.id}) {!p.consultationFeePaid ? '(Unpaid)' : '✅'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Chief Complaint */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3">Chief Complaint</h4>
                                <textarea
                                    required
                                    value={triageFormData.chiefComplaint}
                                    onChange={(e) => setTriageFormData({ ...triageFormData, chiefComplaint: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                                    placeholder="Describe the main reason for visit..."
                                />
                            </div>

                            {/* Vital Signs */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3">Vital Signs</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Blood Pressure <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            value={triageFormData.bp}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, bp: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="120/80"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Temperature (°C) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            step="0.1"
                                            value={triageFormData.temp}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, temp: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="36.5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Pulse (bpm) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={triageFormData.pulse}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, pulse: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="72"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Respiratory Rate <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={triageFormData.rr}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, rr: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="16"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">SpO2 (%) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={triageFormData.spo2}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, spo2: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="98"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Weight (kg) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            step="0.1"
                                            value={triageFormData.weight}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, weight: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="70.5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Height (cm) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={triageFormData.height}
                                            onChange={(e) => setTriageFormData({ ...triageFormData, height: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="175"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Triage Level */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3">Triage Level <span className="text-red-500">*</span></h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {triageLevels.map(level => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            onClick={() => setTriageFormData({ ...triageFormData, triageLevel: level.value })}
                                            className={`p-4 border-2 rounded-xl text-left transition-all ${triageFormData.triageLevel === level.value
                                                ? `${level.borderColor} ${level.bgLight}`
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                                                <span className={`font-bold ${triageFormData.triageLevel === level.value ? level.textColor : 'text-slate-700'}`}>
                                                    {level.label}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3">Additional Notes</h4>
                                <textarea
                                    value={triageFormData.notes}
                                    onChange={(e) => setTriageFormData({ ...triageFormData, notes: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                                    placeholder="Any additional observations..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowTriageModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30">
                                    Complete Triage
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TriageDashboard;
