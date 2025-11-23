import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import {
    FileText, User, Stethoscope, Activity, Brain, Pill, Save,
    Printer, X, Calendar, Clock, AlertCircle, CheckCircle, Plus, Trash2
} from 'lucide-react';

const MedicalConsultationForm = ({ patientId, onClose, onSave }) => {
    const { patients, clinicalRecords, setClinicalRecords, triageQueue, inventory, prescriptions, setPrescriptions, financialRecords, setFinancialRecords } = useData();
    const patient = patients.find(p => p.id === patientId);

    // State for searchable medicine dropdown
    const [medicineSearch, setMedicineSearch] = useState('');
    const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);

    const [formData, setFormData] = useState({
        // Patient Demographics (Auto-filled)
        patientId: patientId,
        patientName: patient?.name || '',
        age: patient?.age || '',
        gender: patient?.gender || '',
        consultationDate: new Date().toISOString().split('T')[0],
        consultationTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),

        // Subjective (Patient's Story)
        chiefComplaint: '',
        historyOfPresentIllness: '',
        reviewOfSystems: {
            constitutional: '',
            cardiovascular: '',
            respiratory: '',
            gastrointestinal: '',
            genitourinary: '',
            musculoskeletal: '',
            neurological: '',
            psychiatric: '',
            skin: ''
        },

        // Medical History
        pastMedicalHistory: '',
        pastSurgicalHistory: '',
        currentMedications: '',
        allergies: patient?.allergies?.join(', ') || 'None',
        familyHistory: '',
        socialHistory: {
            smoking: 'No',
            alcohol: 'No',
            occupation: '',
            exercise: ''
        },

        // Objective (Physical Examination)
        vitalSigns: {
            temperature: '',
            bloodPressure: '',
            heartRate: '',
            respiratoryRate: '',
            oxygenSaturation: '',
            weight: '',
            height: '',
            bmi: ''
        },
        generalAppearance: '',
        systemicExamination: {
            cardiovascular: '',
            respiratory: '',
            abdominal: '',
            neurological: '',
            musculoskeletal: '',
            ent: '',
            skin: ''
        },

        // Assessment
        provisionalDiagnosis: '',
        differentialDiagnosis: [],
        icdCode: '',

        // Plan
        investigationsOrdered: [],
        treatmentPlan: '',
        medications: [],
        followUp: '',
        patientEducation: '',
        referrals: '',

        // Doctor Details
        doctorName: 'Dr. Sarah Wilson',
        doctorSignature: '',
        consultationType: 'General Consultation'
    });

    const [newInvestigation, setNewInvestigation] = useState('');
    const [newMedication, setNewMedication] = useState({ drug: '', dosage: '', frequency: '', duration: '' });

    // Auto-calculate BMI
    useEffect(() => {
        if (formData.vitalSigns.weight && formData.vitalSigns.height) {
            const heightMeters = formData.vitalSigns.height / 100;
            const bmi = (formData.vitalSigns.weight / (heightMeters * heightMeters)).toFixed(1);
            setFormData(prev => ({
                ...prev,
                vitalSigns: { ...prev.vitalSigns, bmi: isNaN(bmi) ? '' : bmi }
            }));
        }
    }, [formData.vitalSigns.weight, formData.vitalSigns.height]);

    // Auto-populate from triage data when form loads
    useEffect(() => {
        const triageRecord = triageQueue.find(t => t.patientId === patientId);
        if (triageRecord) {
            setFormData(prev => ({
                ...prev,
                // Subjective - Chief Complaint
                chiefComplaint: triageRecord.chiefComplaint || prev.chiefComplaint,

                // Objective - Vital Signs from Triage
                vitalSigns: {
                    temperature: triageRecord.vitals?.temp?.toString() || prev.vitalSigns.temperature,
                    bloodPressure: triageRecord.vitals?.bp || prev.vitalSigns.bloodPressure,
                    heartRate: triageRecord.vitals?.pulse?.toString() || prev.vitalSigns.heartRate,
                    respiratoryRate: triageRecord.vitals?.rr?.toString() || prev.vitalSigns.respiratoryRate,
                    oxygenSaturation: triageRecord.vitals?.spo2?.toString() || prev.vitalSigns.oxygenSaturation,
                    weight: triageRecord.vitals?.weight?.toString() || prev.vitalSigns.weight,
                    height: triageRecord.vitals?.height?.toString() || prev.vitalSigns.height,
                    bmi: prev.vitalSigns.bmi // Keep calculated BMI
                },

                // General Appearance - Add triage level and notes
                generalAppearance: triageRecord.notes ?
                    `Triage Level: ${triageRecord.triageLevel}\nTriage Notes: ${triageRecord.notes}` :
                    (triageRecord.triageLevel ? `Triage Level: ${triageRecord.triageLevel}` : prev.generalAppearance)
            }));
        }
    }, [patientId, triageQueue]); // Run once when form opens or triage data changes

    const handleAddInvestigation = () => {
        if (newInvestigation.trim()) {
            setFormData(prev => ({
                ...prev,
                investigationsOrdered: [...prev.investigationsOrdered, newInvestigation]
            }));
            setNewInvestigation('');
        }
    };

    const handleRemoveInvestigation = (index) => {
        setFormData(prev => ({
            ...prev,
            investigationsOrdered: prev.investigationsOrdered.filter((_, i) => i !== index)
        }));
    };

    const handleAddMedication = () => {
        if (newMedication.drug && newMedication.dosage) {
            setFormData(prev => ({
                ...prev,
                medications: [...prev.medications, newMedication]
            }));
            setNewMedication({ drug: '', dosage: '', frequency: '', duration: '' });
        }
    };

    const handleRemoveMedication = (index) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index)
        }));
    };

    // Helper function to parse duration into days
    const parseDuration = (duration) => {
        const match = duration.match(/(\d+)\s*(day|week|month)/i);
        if (!match) return 1;

        const quantity = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.includes('week')) return quantity * 7;
        if (unit.includes('month')) return quantity * 30;
        return quantity; // days
    };

    // Helper function to extract frequency number
    const extractFrequency = (frequency) => {
        const match = frequency.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    };

    // Calculate prescription total from inventory prices
    const calculatePrescriptionTotal = (medications) => {
        return medications.reduce((total, med) => {
            // Find medicine in inventory (case-insensitive)
            const inventoryItem = inventory.find(item =>
                item.name.toLowerCase() === med.drug.toLowerCase()
            );

            if (!inventoryItem) {
                console.warn(`Medicine "${med.drug}" not found in inventory`);
                return total;
            }

            // Calculate quantity needed
            const frequency = extractFrequency(med.frequency);
            const days = parseDuration(med.duration);
            const quantity = frequency * days;

            // Calculate total price for this medication
            const medicationTotal = inventoryItem.price * quantity;

            return total + medicationTotal;
        }, 0);
    };

    const handleSaveForm = () => {
        const consultationRecord = {
            id: `CON-${String(clinicalRecords.length + 1).padStart(3, '0')}`,
            ...formData,
            createdAt: new Date().toISOString(),
            status: 'Completed'
        };

        setClinicalRecords(prev => [...prev, consultationRecord]);

        // Generate Prescription if medications exist
        if (formData.medications.length > 0) {
            // Calculate total cost
            const prescriptionTotal = calculatePrescriptionTotal(formData.medications);

            const prescriptionId = `RX-${String(prescriptions.length + 1).padStart(3, '0')}`;

            const newPrescription = {
                id: prescriptionId,
                patient: formData.patientName,
                patientId: formData.patientId,
                doctor: formData.doctorName,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                medications: formData.medications.map(med => {
                    const inventoryItem = inventory.find(item =>
                        item.name.toLowerCase() === med.drug.toLowerCase()
                    );
                    const frequency = extractFrequency(med.frequency);
                    const days = parseDuration(med.duration);
                    const quantity = frequency * days;
                    const unitPrice = inventoryItem ? inventoryItem.price : 0;

                    return {
                        name: med.drug,
                        dosage: med.dosage,
                        frequency: med.frequency,
                        duration: med.duration,
                        quantity: quantity,
                        unitPrice: unitPrice,
                        totalPrice: unitPrice * quantity
                    };
                }),
                // Financial fields
                totalAmount: prescriptionTotal,
                paid: false,
                paymentStatus: 'Unpaid',
                paidAmount: 0,
                balance: prescriptionTotal,
                paymentMethod: '',
                dispensedAt: null,
                dispensedBy: ''
            };

            setPrescriptions(prev => [newPrescription, ...prev]);

            // Create automatic financial record for the prescription
            const newFinancialRecord = {
                id: `FIN-${Date.now()}`,
                type: 'Prescription',
                patientId: formData.patientId,
                patientName: formData.patientName,
                prescriptionId: prescriptionId,
                description: `Prescription ${prescriptionId} - ${formData.medications.length} medication(s)`,
                amount: prescriptionTotal,
                status: 'Unpaid',
                paymentMethod: '',
                createdAt: new Date().toISOString(),
                paidAt: null,
                department: 'Pharmacy',
                invoiceNumber: `INV-${Date.now()}`,
                notes: `Prescribed by ${formData.doctorName}`
            };

            setFinancialRecords(prev => [...prev, newFinancialRecord]);
        }

        if (onSave) onSave(consultationRecord);
        alert(`Medical consultation saved successfully.${formData.medications.length > 0 ? ' Prescription sent to Pharmacy with billing record.' : ''}`);
        if (onClose) onClose();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">🔥 Medical Consultation Form - UPDATED VERSION 🔥</h1>
                            <p className="text-purple-100">Standard Hospital Documentation - With Triage Auto-Population & Medicine Search</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrint} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2">
                                <Printer size={18} />
                                Print
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Patient Demographics */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Patient ID</label>
                            <p className="font-bold text-gray-900">{formData.patientId}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Patient Name</label>
                            <p className="font-bold text-gray-900">{formData.patientName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Age/Gender</label>
                            <p className="font-bold text-gray-900">{formData.age}y / {formData.gender}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                            <p className="font-bold text-gray-900">{formData.consultationDate}</p>
                        </div>
                    </div>

                    {/* SUBJECTIVE - Chief Complaint & HPI */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-600">
                            <User className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">SUBJECTIVE (Patient's Story)</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint *</label>
                            <input
                                type="text"
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Fever for 3 days, Headache and vomiting"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness (HPI) *</label>
                            <textarea
                                rows="4"
                                value={formData.historyOfPresentIllness}
                                onChange={(e) => setFormData({ ...formData, historyOfPresentIllness: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Onset, location, duration, character, aggravating/relieving factors, timing, severity..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History</label>
                                <textarea
                                    rows="2"
                                    value={formData.pastMedicalHistory}
                                    onChange={(e) => setFormData({ ...formData, pastMedicalHistory: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Hypertension, Diabetes, Asthma..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                                <input
                                    type="text"
                                    value={formData.allergies}
                                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Drug allergies, food allergies..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* OBJECTIVE - Vital Signs & Examination */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-green-600">
                            <Stethoscope className="h-5 w-5 text-green-600" />
                            <h2 className="text-lg font-bold text-gray-900">OBJECTIVE (Examination Findings)</h2>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Vital Signs</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Temp (°C)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.temperature}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, temperature: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="37.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">BP (mmHg)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.bloodPressure}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="120/80"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">HR (bpm)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.heartRate}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="72"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">RR (breaths/min)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.respiratoryRate}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, respiratoryRate: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="18"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">SpO2 (%)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.oxygenSaturation}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="98"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.weight}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, weight: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Height (cm)</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.height}
                                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, height: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="170"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">BMI</label>
                                    <input
                                        type="text"
                                        value={formData.vitalSigns.bmi}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-bold"
                                        placeholder="Auto"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">General Appearance</label>
                            <input
                                type="text"
                                value={formData.generalAppearance}
                                onChange={(e) => setFormData({ ...formData, generalAppearance: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Well-nourished, no acute distress, alert and oriented..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cardiovascular System</label>
                                <textarea
                                    rows="2"
                                    value={formData.systemicExamination.cardiovascular}
                                    onChange={(e) => setFormData({ ...formData, systemicExamination: { ...formData.systemicExamination, cardiovascular: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="S1S2 heard, no murmurs..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Respiratory System</label>
                                <textarea
                                    rows="2"
                                    value={formData.systemicExamination.respiratory}
                                    onChange={(e) => setFormData({ ...formData, systemicExamination: { ...formData.systemicExamination, respiratory: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Clear breath sounds bilaterally..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* ASSESSMENT - Diagnosis */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-600">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-900">ASSESSMENT (Diagnosis)</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Provisional Diagnosis *</label>
                            <input
                                type="text"
                                value={formData.provisionalDiagnosis}
                                onChange={(e) => setFormData({ ...formData, provisionalDiagnosis: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Viral Upper Respiratory Tract Infection"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ICD-10 Code</label>
                            <input
                                type="text"
                                value={formData.icdCode}
                                onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., J00"
                            />
                        </div>
                    </div>

                    {/* PLAN - Investigations & Treatment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-600">
                            <Pill className="h-5 w-5 text-orange-600" />
                            <h2 className="text-lg font-bold text-gray-900">PLAN (Management)</h2>
                        </div>

                        {/* Investigations */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investigations Ordered</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newInvestigation}
                                    onChange={(e) => setNewInvestigation(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="e.g., Complete Blood Count (CBC)"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddInvestigation()}
                                />
                                <button
                                    onClick={handleAddInvestigation}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.investigationsOrdered.map((inv, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                        <span className="text-sm text-gray-800">{inv}</span>
                                        <button onClick={() => handleRemoveInvestigation(idx)} className="p-1 hover:bg-blue-100 rounded">
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medications */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medications Prescribed</label>
                            <div className="grid grid-cols-5 gap-2 mb-2">
                                {/* Searchable Medicine Dropdown */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={medicineSearch || newMedication.drug}
                                        onChange={(e) => {
                                            setMedicineSearch(e.target.value);
                                            setNewMedication({ ...newMedication, drug: e.target.value });
                                            setShowMedicineDropdown(true);
                                        }}
                                        onFocus={() => setShowMedicineDropdown(true)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="🔍 Search medicine..."
                                    />

                                    {/* Autocomplete Dropdown */}
                                    {showMedicineDropdown && medicineSearch && (
                                        <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                            {inventory
                                                .filter(item =>
                                                    item.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
                                                    item.category?.toLowerCase().includes(medicineSearch.toLowerCase())
                                                )
                                                .slice(0, 10)
                                                .map((medicine, idx) => {
                                                    const isLowStock = medicine.stock <= medicine.minStock;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => {
                                                                setNewMedication({ ...newMedication, drug: medicine.name });
                                                                setMedicineSearch('');
                                                                setShowMedicineDropdown(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-sm text-gray-900">{medicine.name}</div>
                                                                    <div className="text-xs text-gray-600 mt-1">
                                                                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                                                            {medicine.category}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right ml-3">
                                                                    <div className={`text-xs font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                                                        {medicine.stock} {medicine.unit || 'units'}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {isLowStock && <span className="text-red-500">⚠ Low</span>}
                                                                        {!isLowStock && <span className="text-green-500">✓ Available</span>}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 mt-1">
                                                                        UGX {medicine.price?.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                            {inventory.filter(item =>
                                                item.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
                                                item.category?.toLowerCase().includes(medicineSearch.toLowerCase())
                                            ).length === 0 && (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                        No medicines found in inventory. Type to add custom.
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={newMedication.dosage}
                                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="e.g., 500mg, 5ml, 2 tablets"
                                    list="dosage-suggestions"
                                />
                                <datalist id="dosage-suggestions">
                                    <option value="250mg" />
                                    <option value="500mg" />
                                    <option value="1g" />
                                    <option value="5mg" />
                                    <option value="10mg" />
                                    <option value="25mg" />
                                    <option value="50mg" />
                                    <option value="100mg" />
                                    <option value="5ml" />
                                    <option value="10ml" />
                                    <option value="1 tablet" />
                                    <option value="2 tablets" />
                                    <option value="1 capsule" />
                                    <option value="2 capsules" />
                                    <option value="1 sachet" />
                                    <option value="2 drops" />
                                    <option value="1 puff" />
                                    <option value="2 puffs" />
                                </datalist>

                                <input
                                    type="text"
                                    value={newMedication.frequency}
                                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Frequency (e.g., TDS)"
                                />
                                <input
                                    type="text"
                                    value={newMedication.duration}
                                    onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Duration (e.g., 7 days)"
                                />
                                <button
                                    onClick={handleAddMedication}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.medications.map((med, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                                            <span className="font-medium text-gray-900">{med.drug}</span>
                                            <span className="text-gray-600">{med.dosage}</span>
                                            <span className="text-gray-600">{med.frequency}</span>
                                            <span className="text-gray-600">{med.duration}</span>
                                        </div>
                                        <button onClick={() => handleRemoveMedication(idx)} className="p-1 hover:bg-green-100 rounded">
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
                            <textarea
                                rows="3"
                                value={formData.treatmentPlan}
                                onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Overall treatment approach, lifestyle modifications, dietary advice..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up</label>
                            <input
                                type="text"
                                value={formData.followUp}
                                onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Review in 1 week with lab results"
                            />
                        </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Consultation Type</label>
                            <select
                                value={formData.consultationType}
                                onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option>General Consultation</option>
                                <option>Follow-up Visit</option>
                                <option>Emergency Consultation</option>
                                <option>Specialist Consultation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Doctor Name</label>
                            <input
                                type="text"
                                value={formData.doctorName}
                                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>
                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>Generated: {new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveForm}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save Consultation
                        </button>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default MedicalConsultationForm;
