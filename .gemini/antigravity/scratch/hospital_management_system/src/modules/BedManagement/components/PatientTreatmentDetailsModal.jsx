import React, { useState } from 'react';
import { X, User, Bed, Calendar, Clock, DollarSign, Activity, Stethoscope, FileText, AlertCircle, CheckCircle, XCircle, Pill, ClipboardList } from 'lucide-react';

const PatientTreatmentDetailsModal = ({
    admission,
    patient,
    bed,
    ward,
    billInfo,
    doctorInfo,
    totalBillAmount,
    totalPaid,
    formatCurrency,
    onClose,
    onDischarge,
    onTransfer,
    canDischarge,
    prescriptions,
    medicationLogs,
    onLogMedication
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const balanceDue = totalBillAmount - totalPaid;
    const billPercentPaid = totalBillAmount > 0 ? ((totalPaid / totalBillAmount) * 100).toFixed(1) : 100;
    const isBillFullyPaid = balanceDue <= 0;

    // Get patient prescriptions
    const patientPrescriptions = prescriptions?.filter(p => p.patientId === patient.id && p.status !== 'Dispensed') || [];

    // Get patient medication logs for this admission
    const admissionMedicationLogs = medicationLogs?.filter(log => log.admissionId === admission.id) || [];

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Handle medication administration
    const handleAdminister = (prescription, medication) => {
        const newLog = {
            id: `MED-${Date.now()}`,
            admissionId: admission.id,
            patientId: patient.id,
            prescriptionId: prescription.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            quantity: medication.quantity,
            administeredBy: 'Current Nurse', // TODO: Get from auth context
            administeredAt: new Date().toISOString(),
            notes: ''
        };
        onLogMedication(newLog);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{patient.name}</h2>
                            <p className="text-blue-100 text-sm">Patient ID: {patient.id} • Admission ID: {admission.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="sticky top-[88px] bg-white border-b border-slate-200 px-6 z-10">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'overview'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileText size={18} />
                                Overview
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('treatment')}
                            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'treatment'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Pill size={18} />
                                Treatment Plan
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {activeTab === 'overview' ? (
                        <>
                            {/* Patient Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={18} className="text-slate-600" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Patient Info</p>
                                    </div>
                                    <p className="text-sm text-slate-700">Age: {patient.age || 'N/A'}</p>
                                    <p className="text-sm text-slate-700">Gender: {patient.gender || 'N/A'}</p>
                                    <p className="text-sm text-slate-700">Blood type: {patient.bloodType || 'N/A'}</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bed size={18} className="text-blue-600" />
                                        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Bed Assignment</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-700">{bed.number}</p>
                                    <p className="text-sm text-blue-600">{ward.name}</p>
                                    <p className="text-xs text-blue-500 mt-1">{ward.type}</p>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={18} className="text-emerald-600" />
                                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Admission Duration</p>
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-700">{billInfo.daysAdmitted}</p>
                                    <p className="text-sm text-emerald-600">Days Admitted</p>
                                    <p className="text-xs text-emerald-500 mt-1">Since: {formatDate(admission.admissionDate)}</p>
                                </div>
                            </div>

                            {/* Diagnosis & Treatment */}
                            <div className="bg-white border-2 border-amber-200 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity size={20} className="text-amber-600" />
                                    <h3 className="text-lg font-bold text-slate-800">Diagnosis & Treatment</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Primary Diagnosis</p>
                                        <p className="text-base font-semibold text-slate-800">{admission.diagnosis || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Attending Physician</p>
                                        <div className="flex items-center gap-2">
                                            <Stethoscope size={16} className="text-blue-600" />
                                            <p className="text-base font-semibold text-slate-800">{doctorInfo?.name || 'Dr. Not Assigned'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Treatment Status</p>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${admission.status === 'Admitted' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {admission.status === 'Admitted' ? <Activity size={14} /> : <CheckCircle size={14} />}
                                            {admission.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Current Condition</p>
                                        <p className="text-base font-semibold text-emerald-600">Stable</p>
                                    </div>
                                </div>

                                {/* Treatment Notes */}
                                <div className="mt-4 pt-4 border-t border-amber-100">
                                    <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Treatment Notes</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        {admission.treatmentNotes || 'Patient is receiving standard care protocol. Regular monitoring and medication administered as prescribed. Vital signs stable.'}
                                    </p>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={20} className="text-emerald-600" />
                                        <h3 className="text-lg font-bold text-slate-800">Financial Summary</h3>
                                    </div>
                                    {!isBillFullyPaid && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg">
                                            <AlertCircle size={16} className="text-amber-600" />
                                            <span className="text-xs font-bold text-amber-700">Payment Required</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                                        <p className="text-xs text-slate-600 mb-1">Bed Charges ({billInfo.daysAdmitted} days)</p>
                                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(billInfo.accruedBill)}</p>
                                        <p className="text-xs text-slate-500 mt-1">{formatCurrency(billInfo.dailyRate)}/day</p>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                                        <p className="text-xs text-slate-600 mb-1">Total Medical Bill</p>
                                        <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalBillAmount)}</p>
                                        <p className="text-xs text-slate-500 mt-1">All charges included</p>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-300">
                                        <p className="text-xs text-emerald-600 mb-1">Amount Paid</p>
                                        <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</p>
                                        <p className="text-xs text-emerald-500 mt-1">{billPercentPaid}% of total</p>
                                    </div>

                                    <div className={`bg-white/60 backdrop-blur-sm rounded-lg p-4 border-2 ${isBillFullyPaid ? 'border-emerald-400' : 'border-red-400'
                                        }`}>
                                        <p className={`text-xs mb-1 ${isBillFullyPaid ? 'text-emerald-600' : 'text-red-600'}`}>Balance Due</p>
                                        <p className={`text-2xl font-bold ${isBillFullyPaid ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {formatCurrency(Math.max(0, balanceDue))}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {isBillFullyPaid ? (
                                                <>
                                                    <CheckCircle size={14} className="text-emerald-600" />
                                                    <p className="text-xs text-emerald-600 font-semibold">Fully Paid</p>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} className="text-red-600" />
                                                    <p className="text-xs text-red-600 font-semibold">Payment Required</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Progress Bar */}
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs font-medium text-slate-600">Payment Progress</p>
                                        <p className="text-sm font-bold text-slate-800">{billPercentPaid}%</p>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isBillFullyPaid ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                            style={{ width: `${Math.min(100, billPercentPaid)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discharge Warning */}
                            {!isBillFullyPaid && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-red-800 mb-1">Discharge Restriction</h4>
                                            <p className="text-sm text-red-700 leading-relaxed">
                                                This patient cannot be discharged until the medical bill is fully paid ({formatCurrency(balanceDue)} remaining)
                                                unless an <span className="font-bold">Administrator</span> approves a payment plan postponement.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Treatment Plan Tab */}
                            <div className="space-y-6">
                                {/* Active Prescriptions */}
                                <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Pill size={20} className="text-blue-600" />
                                        <h3 className="text-lg font-bold text-slate-800">Active Prescriptions</h3>
                                    </div>
                                    {patientPrescriptions.length > 0 ? (
                                        <div className="space-y-3">
                                            {patientPrescriptions.map((prescription) => (
                                                <div key={prescription.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="text-xs text-slate-500">Prescription ID: {prescription.id}</p>
                                                            <p className="text-sm text-slate-600">Doctor: {prescription.doctor}</p>
                                                            <p className="text-xs text-slate-500">Date: {prescription.date}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${prescription.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                                prescription.status === 'Cleared' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                            {prescription.status}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {prescription.medications.map((med, idx) => (
                                                            <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className="font-semibold text-slate-800">{med.name}</p>
                                                                        <p className="text-sm text-slate-600">Dosage: {med.dosage}</p>
                                                                        <p className="text-xs text-slate-500">Quantity: {med.quantity}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleAdminister(prescription, med)}
                                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                                                                    >
                                                                        Administer
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {prescription.notes && (
                                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                                            <p className="text-xs font-medium text-slate-500 mb-1">Notes:</p>
                                                            <p className="text-sm text-slate-700">{prescription.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Pill size={48} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-slate-500">No active prescriptions</p>
                                        </div>
                                    )}
                                </div>

                                {/* Administration Log */}
                                <div className="bg-white border-2 border-emerald-200 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ClipboardList size={20} className="text-emerald-600" />
                                        <h3 className="text-lg font-bold text-slate-800">Administration Log</h3>
                                    </div>
                                    {admissionMedicationLogs.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {admissionMedicationLogs.map((log) => (
                                                <div key={log.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-slate-800">{log.medicationName}</p>
                                                            <p className="text-sm text-slate-600">{log.dosage}</p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Administered by: {log.administeredBy} • {formatDate(log.administeredAt)}
                                                            </p>
                                                            {log.notes && (
                                                                <p className="text-xs text-slate-600 mt-1">Notes: {log.notes}</p>
                                                            )}
                                                        </div>
                                                        <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <ClipboardList size={48} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-slate-500">No medications administered yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onTransfer}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                        >
                            <Bed size={18} />
                            Transfer Bed
                        </button>
                        <button
                            onClick={onDischarge}
                            disabled={!canDischarge && !isBillFullyPaid}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${canDischarge || isBillFullyPaid
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            title={!canDischarge && !isBillFullyPaid ? 'Cannot discharge: Outstanding bill must be paid or Administrator approval required' : 'Discharge patient'}
                        >
                            <CheckCircle size={18} />
                            {canDischarge && !isBillFullyPaid ? 'Discharge (Admin Override)' : 'Discharge Patient'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientTreatmentDetailsModal;
