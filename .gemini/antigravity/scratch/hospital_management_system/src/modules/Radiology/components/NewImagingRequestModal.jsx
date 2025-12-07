import React, { useState } from 'react';
import { X, Scan, Search, AlertCircle } from 'lucide-react';

const NewImagingRequestModal = ({ onClose, onSubmit, patients, radiologyServices, formatCurrency }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        modality: '',
        examination: '',
        priority: 'Routine',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00',
        requestedBy: '',
        department: 'Doctor',
        clinicalInfo: '',
        contraindications: '',
        contrast: 'No'
    });

    const [errors, setErrors] = useState({});
    const [examSearchTerm, setExamSearchTerm] = useState('');
    const [showExamDropdown, setShowExamDropdown] = useState(false);

    const modalities = ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography', 'Fluoroscopy', 'DEXA Scan', 'PET Scan'];

    // Filter services based on selected modality and search term
    const availableExams = radiologyServices.filter(service => {
        const matchesModality = !formData.modality ||
            service.name.toLowerCase().includes(formData.modality.toLowerCase()) ||
            service.description?.toLowerCase().includes(formData.modality.toLowerCase());

        const matchesSearch = !examSearchTerm ||
            service.name.toLowerCase().includes(examSearchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(examSearchTerm.toLowerCase());

        return matchesModality && matchesSearch;
    });

    // Helper function to detect modality from examination name
    const detectModalityFromName = (examName) => {
        const name = examName.toLowerCase();
        if (name.includes('x-ray') || name.includes('xray')) return 'X-Ray';
        if (name.includes('ct') || name.includes('computed tomography')) return 'CT Scan';
        if (name.includes('mri') || name.includes('magnetic resonance')) return 'MRI';
        if (name.includes('ultrasound') || name.includes('sonography') || name.includes('doppler')) return 'Ultrasound';
        if (name.includes('mammography') || name.includes('mammo')) return 'Mammography';
        if (name.includes('fluoroscopy')) return 'Fluoroscopy';
        if (name.includes('dexa') || name.includes('bone density')) return 'DEXA Scan';
        if (name.includes('pet')) return 'PET Scan';
        return '';
    };

    const handlePatientSelect = (e) => {
        const selectedId = e.target.value;
        const patient = patients.find(p => p.id === selectedId);

        setFormData({
            ...formData,
            patientId: selectedId,
            patientName: patient ? patient.name : ''
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patientId) newErrors.patientId = 'Patient is required';
        if (!formData.modality) newErrors.modality = 'Modality is required';
        if (!formData.examination) newErrors.examination = 'Examination type is required';
        if (!formData.requestedBy) newErrors.requestedBy = 'Requesting physician/staff is required';
        if (!formData.clinicalInfo) newErrors.clinicalInfo = 'Clinical information is required';
        if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
        if (!formData.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Get price from selected service
            const service = radiologyServices.find(s => s.name === formData.examination);
            const price = service ? service.price : 0;

            onSubmit({
                ...formData,
                amount: price,
                status: 'Pending'
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-10 overflow-y-auto" onClick={(e) => {
            if (e.target === e.currentTarget) setShowExamDropdown(false);
        }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Scan size={24} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">New Imaging Request</h2>
                            <p className="text-sm text-slate-500">Create a new radiology order synced with Services & Pricing</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Patient Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Select Patient <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.patientId}
                                onChange={handlePatientSelect}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.patientId ? 'border-red-300' : 'border-slate-200'
                                    }`}
                            >
                                <option value="">-- Select Patient --</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.name} ({patient.id})
                                    </option>
                                ))}
                            </select>
                            {errors.patientId && (
                                <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Patient Name
                            </label>
                            <input
                                type="text"
                                value={formData.patientName}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Modality & Examination */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Modality <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.modality}
                                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.modality ? 'border-red-300' : 'border-slate-200'
                                    }`}
                            >
                                <option value="">-- Select Modality --</option>
                                {modalities.map(modality => (
                                    <option key={modality} value={modality}>{modality}</option>
                                ))}
                            </select>
                            {errors.modality && (
                                <p className="text-red-500 text-xs mt-1">{errors.modality}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Examination Type <span className="text-red-500">*</span>
                                <span className="text-xs font-normal text-slate-500 ml-2">(Searchable - from Services module)</span>
                            </label>
                            <div className="relative">
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={examSearchTerm || formData.examination}
                                        onChange={(e) => {
                                            setExamSearchTerm(e.target.value);
                                            setShowExamDropdown(true);
                                            if (!e.target.value) {
                                                setFormData({ ...formData, examination: '' });
                                            }
                                        }}
                                        onFocus={() => setShowExamDropdown(true)}
                                        placeholder="Search examinations..."
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.examination ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                </div>

                                {/* Dropdown List */}
                                {showExamDropdown && availableExams.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {availableExams.map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        examination: service.name,
                                                        // Auto-detect modality if not set
                                                        modality: formData.modality || detectModalityFromName(service.name)
                                                    });
                                                    setExamSearchTerm('');
                                                    setShowExamDropdown(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-primary/5 border-b border-slate-100 last:border-b-0 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-800">{service.name}</p>
                                                        {service.description && (
                                                            <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                                                        )}
                                                    </div>
                                                    <p className="ml-3 font-bold text-primary">{formatCurrency(service.price)}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No results message */}
                                {showExamDropdown && examSearchTerm && availableExams.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center">
                                        <p className="text-sm text-slate-500">No examinations found matching "{examSearchTerm}"</p>
                                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or modality filter</p>
                                    </div>
                                )}

                                {/* Selected examination display */}
                                {formData.examination && !showExamDropdown && (
                                    <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <span className="text-sm font-medium text-emerald-700">✓ {formData.examination}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, examination: '' });
                                                setExamSearchTerm('');
                                            }}
                                            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                                        >
                                            Change
                                        </button>
                                    </div>
                                )}
                            </div>
                            {errors.examination && (
                                <p className="text-red-500 text-xs mt-1">{errors.examination}</p>
                            )}
                        </div>
                    </div>

                    {/* Priority & Contrast */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="Routine">Routine</option>
                                <option value="Urgent">Urgent</option>
                                <option value="STAT">STAT (Immediate)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Contrast Required?
                            </label>
                            <select
                                value={formData.contrast}
                                onChange={(e) => setFormData({ ...formData, contrast: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                                <option value="TBD">To Be Determined</option>
                            </select>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Scheduled Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.scheduledDate ? 'border-red-300' : 'border-slate-200'
                                    }`}
                            />
                            {errors.scheduledDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.scheduledDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Scheduled Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={formData.scheduledTime}
                                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.scheduledTime ? 'border-red-300' : 'border-slate-200'
                                    }`}
                            />
                            {errors.scheduledTime && (
                                <p className="text-red-500 text-xs mt-1">{errors.scheduledTime}</p>
                            )}
                        </div>
                    </div>

                    {/* Requesting Physician/Staff */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Requested By <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.requestedBy}
                                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                                placeholder="e.g., Dr. Sarah Wilson"
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.requestedBy ? 'border-red-300' : 'border-slate-200'
                                    }`}
                            />
                            {errors.requestedBy && (
                                <p className="text-red-500 text-xs mt-1">{errors.requestedBy}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Department
                            </label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="Doctor">Doctor</option>
                                <option value="Reception">Reception</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Inpatient">Inpatient</option>
                            </select>
                        </div>
                    </div>

                    {/* Clinical Information */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Clinical Information <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.clinicalInfo}
                            onChange={(e) => setFormData({ ...formData, clinicalInfo: e.target.value })}
                            rows={3}
                            placeholder="Clinical history, reason for examination, symptoms..."
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.clinicalInfo ? 'border-red-300' : 'border-slate-200'
                                }`}
                        />
                        {errors.clinicalInfo && (
                            <p className="text-red-500 text-xs mt-1">{errors.clinicalInfo}</p>
                        )}
                    </div>

                    {/* Contraindications */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Contraindications / Special Notes
                        </label>
                        <textarea
                            value={formData.contraindications}
                            onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
                            rows={2}
                            placeholder="Allergies, pacemaker, pregnancy, kidney issues, etc."
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Price Preview */}
                    {formData.examination && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={20} className="text-emerald-600" />
                                    <span className="font-bold text-slate-800">Estimated Cost:</span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-600">
                                    {formatCurrency(radiologyServices.find(s => s.name === formData.examination)?.price || 0)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">
                                Bill will be automatically generated when imaging starts
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors shadow-lg shadow-primary/30"
                        >
                            Create Imaging Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewImagingRequestModal;
