import React, { useState } from 'react';
import { FileText, Plus, Search, Printer, Send, Trash2, X } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const PrescriptionManager = ({ triggerNewPrescription }) => {
    const { patients = [], inventory = [], prescriptions = [], addPrescription } = useData();
    const [showModal, setShowModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [medicineSearches, setMedicineSearches] = useState([]);

    // Listen for external trigger to open modal
    React.useEffect(() => {
        if (triggerNewPrescription > 0) {
            setShowModal(true);
        }
    }, [triggerNewPrescription]);

    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        medications: [{ medicineId: '', name: '', dosage: '', frequency: '', duration: '' }],
        notes: ''
    });

    // Initialize medicine searches for each medication
    const initializeMedicineSearch = () => {
        setMedicineSearches(formData.medications.map(() => ({ search: '', showDropdown: false })));
    };

    const handleAddMedication = () => {
        setFormData({
            ...formData,
            medications: [...formData.medications, { medicineId: '', name: '', dosage: '', frequency: '', duration: '' }]
        });
        setMedicineSearches([...medicineSearches, { search: '', showDropdown: false }]);
    };

    const handleRemoveMedication = (index) => {
        const newMedications = formData.medications.filter((_, i) => i !== index);
        const newSearches = medicineSearches.filter((_, i) => i !== index);
        setFormData({ ...formData, medications: newMedications });
        setMedicineSearches(newSearches);
    };

    const handleMedicationChange = (index, field, value) => {
        const newMedications = [...formData.medications];
        newMedications[index][field] = value;
        setFormData({ ...formData, medications: newMedications });
    };

    const handleMedicineSearch = (index, value) => {
        const newSearches = [...medicineSearches];
        newSearches[index] = { search: value, showDropdown: true };
        setMedicineSearches(newSearches);
        handleMedicationChange(index, 'name', value);
    };

    const handleSelectMedicine = (index, medicine) => {
        handleMedicationChange(index, 'medicineId', medicine.id);
        handleMedicationChange(index, 'name', medicine.name);

        const newSearches = [...medicineSearches];
        newSearches[index] = { search: '', showDropdown: false };
        setMedicineSearches(newSearches);
    };

    const handlePatientChange = (e) => {
        const selectedId = e.target.value;
        const selectedPatient = patients.find(p => p.id === selectedId);
        setFormData({
            ...formData,
            patientId: selectedId,
            patientName: selectedPatient ? selectedPatient.name : ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save prescription via API
        const prescriptionData = {
            patientId: formData.patientId,
            doctorId: 'doctor-id',
            medications: formData.medications,
            instructions: formData.notes
        };

        const result = await addPrescription(prescriptionData);

        if (result.success) {
            setShowModal(false);
            setFormData({
                patientId: '',
                patientName: '',
                medications: [{ medicineId: '', name: '', dosage: '', frequency: '', duration: '' }],
                notes: ''
            });
        } else {
            alert(`Failed to create prescription: ${result.error}`);
        }
    };

    const handlePrint = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrintModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Prescription Management</h2>
                    <p className="text-sm text-slate-500">Create and manage patient prescriptions</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={18} />
                    New Prescription
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{prescription.patientName}</h3>
                                    <p className="text-xs text-slate-500">ID: {prescription.id} • {prescription.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${prescription.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    prescription.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {prescription.status}
                                </span>
                                <button
                                    onClick={() => handlePrint(prescription)}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                    title="Print Prescription"
                                >
                                    <Printer size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 pl-16 mb-4">
                            {(prescription.medications || []).map((med, idx) => (
                                <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                    <FileText size={14} className="text-slate-400" />
                                    <span className="font-medium">{med.name}</span>
                                    <span className="text-slate-400">-</span>
                                    <span>{med.dosage}</span>
                                    <span className="text-slate-400">({med.frequency} for {med.duration})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* New Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Create Prescription</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="prescription-form" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.patientId}
                                        onChange={handlePatientChange}
                                    >
                                        <option value="">-- Select Patient --</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-slate-700">Medications</label>
                                        <button
                                            type="button"
                                            onClick={handleAddMedication}
                                            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Drug
                                        </button>
                                    </div>

                                    {formData.medications.map((med, index) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                                            {formData.medications.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedication(index)}
                                                    className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 p-1 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}

                                            <div className="relative">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Medicine</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={medicineSearches[index]?.search || med.name}
                                                    onChange={(e) => handleMedicineSearch(index, e.target.value)}
                                                    onFocus={() => {
                                                        const newSearches = [...medicineSearches];
                                                        newSearches[index] = { ...newSearches[index], showDropdown: true };
                                                        setMedicineSearches(newSearches);
                                                    }}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    placeholder="🔍 Search medicine by name or category..."
                                                />

                                                {/* Autocomplete Dropdown */}
                                                {medicineSearches[index]?.showDropdown && (medicineSearches[index]?.search || !med.name) && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                                        {inventory
                                                            .filter(item =>
                                                                item.name.toLowerCase().includes((medicineSearches[index]?.search || '').toLowerCase()) ||
                                                                item.category?.toLowerCase().includes((medicineSearches[index]?.search || '').toLowerCase())
                                                            )
                                                            .slice(0, 10)
                                                            .map((medicine, idx) => {
                                                                const isLowStock = medicine.stock <= medicine.minStock;
                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        onClick={() => handleSelectMedicine(index, medicine)}
                                                                        className="px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex-1">
                                                                                <div className="font-bold text-sm text-slate-900">{medicine.name}</div>
                                                                                <div className="text-xs text-slate-600 mt-1">
                                                                                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                                                                        {medicine.category}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right ml-3">
                                                                                <div className={`text-xs font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                                                                    {medicine.stock} {medicine.unit || 'units'}
                                                                                </div>
                                                                                <div className="text-xs text-slate-500">
                                                                                    {isLowStock && <span className="text-red-500">⚠ Low</span>}
                                                                                    {!isLowStock && <span className="text-green-500">✓ Available</span>}
                                                                                </div>
                                                                                <div className="text-xs text-slate-600 mt-1">
                                                                                    UGX {medicine.price?.toLocaleString()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                        {inventory.filter(item =>
                                                            item.name.toLowerCase().includes((medicineSearches[index]?.search || '').toLowerCase()) ||
                                                            item.category?.toLowerCase().includes((medicineSearches[index]?.search || '').toLowerCase())
                                                        ).length === 0 && (
                                                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                                    No medicines found in inventory. Type to add custom.
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Dosage</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 500mg, 5ml, 2 tablets"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        value={med.dosage}
                                                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                        list="dosage-options"
                                                    />
                                                    <datalist id="dosage-options">
                                                        <option value="250mg" />
                                                        <option value="500mg" />
                                                        <option value="1g" />
                                                        <option value="5mg" />
                                                        <option value="10mg" />
                                                        <option value="25mg" />
                                                        <option value="50mg" />
                                                        <option value="100mg" />
                                                        <option value="200mg" />
                                                        <option value="5ml" />
                                                        <option value="10ml" />
                                                        <option value="15ml" />
                                                        <option value="1 tablet" />
                                                        <option value="2 tablets" />
                                                        <option value="1 capsule" />
                                                        <option value="2 capsules" />
                                                        <option value="1 sachet" />
                                                        <option value="2 drops" />
                                                        <option value="5 drops" />
                                                        <option value="1 puff" />
                                                        <option value="2 puffs" />
                                                        <option value="1 vial" />
                                                        <option value="100 IU" />
                                                        <option value="500 IU" />
                                                    </datalist>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 3x daily"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        value={med.frequency}
                                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 5 days"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        value={med.duration}
                                                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                                        placeholder="Additional instructions for pharmacy or patient..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="prescription-form"
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30"
                            >
                                <Send size={18} />
                                Send to Pharmacy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {showPrintModal && selectedPrescription && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-3xl min-h-[80vh] shadow-2xl relative print-container">
                        <button
                            onClick={() => setShowPrintModal(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full print:hidden"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-12 space-y-8">
                            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800">GENERAL HOSPITAL</h1>
                                    <p className="text-slate-600 mt-1">123 Medical Center Drive, Kampala</p>
                                    <p className="text-slate-600">Tel: +256 700 123 456 | Email: info@generalhospital.com</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-primary">PRESCRIPTION</h2>
                                    <p className="font-mono text-slate-500 mt-1">#{selectedPrescription.id}</p>
                                    <p className="text-slate-600 mt-1">Date: {selectedPrescription.date}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Details</h3>
                                    <p className="text-lg font-bold text-slate-800">{selectedPrescription.patientName}</p>
                                    <p className="text-slate-600">ID: {selectedPrescription.patientId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed By</h3>
                                    <p className="text-lg font-bold text-slate-800">{selectedPrescription.doctor}</p>
                                    <p className="text-slate-600">General Medicine</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Rx Medications</h3>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="py-3 font-bold text-slate-700">Medicine</th>
                                            <th className="py-3 font-bold text-slate-700">Dosage</th>
                                            <th className="py-3 font-bold text-slate-700">Frequency</th>
                                            <th className="py-3 font-bold text-slate-700">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedPrescription.medications || []).map((med, idx) => (
                                            <tr key={idx} className="border-b border-slate-100">
                                                <td className="py-4 font-medium text-slate-800">{med.name}</td>
                                                <td className="py-4 text-slate-600">{med.dosage}</td>
                                                <td className="py-4 text-slate-600">{med.frequency}</td>
                                                <td className="py-4 text-slate-600">{med.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selectedPrescription.notes && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-700 mb-2">Doctor's Notes:</h3>
                                    <p className="text-slate-600 italic">{selectedPrescription.notes}</p>
                                </div>
                            )}

                            <div className="pt-12 mt-12 border-t border-slate-200 flex justify-between items-end">
                                <div className="text-center">
                                    <div className="w-48 border-b border-slate-300 mb-2"></div>
                                    <p className="text-sm text-slate-500">Doctor's Signature</p>
                                </div>
                                <div className="text-xs text-slate-400">
                                    <p>This is a valid medical prescription.</p>
                                    <p>Generated on {new Date().toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 right-8 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 shadow-xl font-bold transition-transform hover:scale-105"
                            >
                                <Printer size={20} />
                                Print Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionManager;
