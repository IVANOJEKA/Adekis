import React, { useRef } from 'react';
import { X, Download, Printer, User, Calendar, Bed, FileText, Pill, Activity, DollarSign, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import hospitalConfig, { hospitalLogoSVG, watermarkSVG } from '../../../config/hospitalBranding';

const DischargeSummaryModal = ({
    patient,
    admission,
    bed,
    ward,
    doctor,
    prescriptions = [],
    medicationLogs = [],
    vitalSigns = [],
    billInfo,
    formatCurrency,
    formatDate,
    onClose,
    onCompleteDischarge
}) => {
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Discharge_Summary_${patient.id}_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
    });

    const handleDownload = () => {
        // Trigger print which will allow "Save as PDF" option
        handlePrint();
    };

    const latestVitals = vitalSigns.length > 0 ? vitalSigns[vitalSigns.length - 1] : null;
    const dischargeDate = new Date();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-slate-800">Patient Discharge Summary</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div ref={printRef} className="bg-white p-8 print:p-0 relative">
                        {/* Watermark */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none print:block hidden"
                            dangerouslySetInnerHTML={{ __html: watermarkSVG }}
                        />

                        {/* Professional Hospital Header */}
                        <div className="relative z-10 mb-8 pb-6 border-b-4 border-blue-600 print:border-black">
                            <div className="flex items-start justify-between">
                                {/* Logo and Hospital Name */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-20 h-20 flex-shrink-0"
                                        dangerouslySetInnerHTML={{ __html: hospitalLogoSVG }}
                                    />
                                    <div>
                                        <h1 className="text-3xl font-bold text-blue-600 print:text-black mb-1">
                                            {hospitalConfig.name}
                                        </h1>
                                        <p className="text-sm text-slate-600 print:text-gray-700 italic mb-2">
                                            {hospitalConfig.tagline}
                                        </p>
                                        <div className="text-xs text-slate-600 print:text-gray-700 space-y-0.5">
                                            <p className="flex items-center gap-1.5">
                                                <MapPin size={12} className="print:hidden" />
                                                {hospitalConfig.address.street}, {hospitalConfig.address.city}, {hospitalConfig.address.country}
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <Phone size={12} className="print:hidden" />
                                                Tel: {hospitalConfig.contact.phone} | Emergency: {hospitalConfig.contact.emergencyHotline}
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <Mail size={12} className="print:hidden" />
                                                Email: {hospitalConfig.contact.email} | Web: {hospitalConfig.contact.website}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Registration Details */}
                                <div className="text-right text-xs">
                                    <div className="bg-blue-50 print:bg-gray-100 border border-blue-200 print:border-gray-400 rounded px-3 py-2 space-y-1">
                                        <p className="font-semibold text-slate-700 print:text-black">Registration Details</p>
                                        <p className="text-slate-600 print:text-gray-700">Reg. No: {hospitalConfig.registrationNumber}</p>
                                        <p className="text-slate-600 print:text-gray-700">License: {hospitalConfig.licenseNumber}</p>
                                        <p className="text-slate-600 print:text-gray-700">TIN: {hospitalConfig.taxId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Title */}
                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-bold text-slate-800 print:text-black uppercase tracking-wide">
                                    Patient Discharge Summary
                                </h2>
                                <div className="mt-2 flex items-center justify-center gap-4 text-sm text-slate-600 print:text-gray-700">
                                    <span>Date: {dischargeDate.toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>Time: {dischargeDate.toLocaleTimeString()}</span>
                                    <span>•</span>
                                    <span className="font-semibold">Document No: DS-{admission.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Patient Information */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                <User size={20} className="print:hidden" />
                                Patient Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Patient Name:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Patient ID:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.id}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Age / Gender:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.age} years / {patient.gender}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Contact Number:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Blood Type:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.bloodType || 'Not recorded'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Allergies:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{patient.allergies || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admission Details */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                <Bed size={20} className="print:hidden" />
                                Admission Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Admission Date:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{formatDate(admission.admissionDate)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Discharge Date:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{formatDate(dischargeDate.toISOString())}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Length of Stay:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{billInfo.daysAdmitted} days</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Ward / Bed:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{ward.name} / {bed.number}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Attending Physician:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">Dr. {doctor?.name || 'Not Assigned'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Admission ID:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{admission.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis & Treatment */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                <Activity size={20} className="print:hidden" />
                                Diagnosis & Treatment
                            </h2>
                            <div className="text-sm space-y-3">
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Primary Diagnosis:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{admission.diagnosis}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Treatment Summary:</p>
                                    <p className="text-slate-700 print:text-black leading-relaxed">
                                        {admission.treatmentNotes || 'Patient received standard care protocol. Regular monitoring and medication administered as prescribed. Vital signs remained stable throughout admission.'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Condition at Discharge:</p>
                                    <p className="font-semibold text-green-600 print:text-black">Stable - Improved</p>
                                </div>
                            </div>
                        </div>

                        {/* Vital Signs at Discharge */}
                        {latestVitals && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3">Vital Signs at Discharge</h2>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 print:text-gray-700">Blood Pressure:</p>
                                        <p className="font-semibold text-slate-800 print:text-black">{latestVitals.bp}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 print:text-gray-700">Heart Rate:</p>
                                        <p className="font-semibold text-slate-800 print:text-black">{latestVitals.hr} bpm</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 print:text-gray-700">Temperature:</p>
                                        <p className="font-semibold text-slate-800 print:text-black">{latestVitals.temp}°C</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 print:text-gray-700">SpO2:</p>
                                        <p className="font-semibold text-slate-800 print:text-black">{latestVitals.spo2}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medications Prescribed */}
                        {prescriptions.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                    <Pill size={20} className="print:hidden" />
                                    Discharge Medications
                                </h2>
                                <div className="border border-slate-200 print:border-black rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100 print:bg-gray-200">
                                            <tr>
                                                <th className="text-left p-3 font-semibold text-slate-700 print:text-black">Medication</th>
                                                <th className="text-left p-3 font-semibold text-slate-700 print:text-black">Dosage</th>
                                                <th className="text-left p-3 font-semibold text-slate-700 print:text-black">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.flatMap(prescription =>
                                                prescription.medications.map((med, idx) => (
                                                    <tr key={`${prescription.id}-${idx}`} className="border-t border-slate-100 print:border-gray-300">
                                                        <td className="p-3 text-slate-800 print:text-black">{med.name}</td>
                                                        <td className="p-3 text-slate-700 print:text-black">{med.dosage}</td>
                                                        <td className="p-3 text-slate-700 print:text-black">{med.quantity}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Follow-up Instructions */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                <FileText size={20} className="print:hidden" />
                                Discharge Instructions & Follow-up
                            </h2>
                            <div className="text-sm space-y-2">
                                <div className="bg-blue-50 print:bg-gray-100 border border-blue-200 print:border-gray-400 rounded-lg p-4">
                                    <p className="font-semibold text-slate-800 print:text-black mb-2">Post-Discharge Care:</p>
                                    <ul className="list-disc list-inside text-slate-700 print:text-black space-y-1">
                                        <li>Take all medications as prescribed</li>
                                        <li>Get adequate rest and avoid strenuous activities for 48 hours</li>
                                        <li>Maintain proper wound care if applicable</li>
                                        <li>Stay hydrated and maintain a healthy diet</li>
                                        <li>Monitor for any unusual symptoms</li>
                                    </ul>
                                </div>
                                <div className="bg-amber-50 print:bg-gray-100 border border-amber-200 print:border-gray-400 rounded-lg p-4">
                                    <p className="font-semibold text-slate-800 print:text-black mb-2">Follow-up Appointment:</p>
                                    <p className="text-slate-700 print:text-black">
                                        Please schedule a follow-up appointment with Dr. {doctor?.name || 'your physician'} within 7-10 days.
                                    </p>
                                </div>
                                <div className="bg-red-50 print:bg-gray-100 border border-red-200 print:border-gray-400 rounded-lg p-4">
                                    <p className="font-semibold text-slate-800 print:text-black mb-2">Seek Immediate Medical Attention If:</p>
                                    <ul className="list-disc list-inside text-slate-700 print:text-black space-y-1">
                                        <li>High fever (above 38.5°C / 101.3°F)</li>
                                        <li>Severe pain or discomfort</li>
                                        <li>Difficulty breathing</li>
                                        <li>Unusual bleeding or discharge</li>
                                        <li>Signs of infection (redness, swelling, warmth)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 print:text-black mb-3 flex items-center gap-2">
                                <DollarSign size={20} className="print:hidden" />
                                Financial Summary
                            </h2>
                            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 print:bg-gray-100 p-4 rounded-lg">
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Bed Charges ({billInfo.daysAdmitted} days):</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{formatCurrency(billInfo.accruedBill)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 print:text-gray-700">Total Bill Amount:</p>
                                    <p className="font-semibold text-slate-800 print:text-black">{formatCurrency(billInfo.totalBillAmount || billInfo.accruedBill)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="mt-12 pt-6 border-t-2 border-slate-300 print:border-black">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="h-16 mb-2"></div>
                                    <div className="border-t border-slate-400 print:border-black pt-2">
                                        <p className="font-semibold text-slate-800 print:text-black">Dr. {doctor?.name || '________________'}</p>
                                        <p className="text-sm text-slate-600 print:text-gray-700">Attending Physician</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-16 mb-2"></div>
                                    <div className="border-t border-slate-400 print:border-black pt-2">
                                        <p className="font-semibold text-slate-800 print:text-black">{patient.name}</p>
                                        <p className="text-sm text-slate-600 print:text-gray-700">Patient Acknowledgment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Footer */}
                        <div className="mt-12 pt-6 border-t-4 border-blue-600 print:border-black">
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                {/* Accreditations */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-700 print:text-black mb-2 uppercase">Accredited By:</h3>
                                    <ul className="text-xs text-slate-600 print:text-gray-700 space-y-1">
                                        {hospitalConfig.accreditations.map((acc, idx) => (
                                            <li key={idx} className="flex items-center gap-1">
                                                <span className="text-blue-600 print:text-black">✓</span>
                                                {acc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* QR Code Placeholder */}
                                <div className="text-center">
                                    <div className="inline-block border-2 border-slate-300 print:border-gray-400 p-2 rounded">
                                        <div className="w-24 h-24 bg-slate-100 print:bg-gray-200 flex items-center justify-center text-xs text-slate-400 print:text-gray-600">
                                            QR Code
                                            <br />
                                            Verify Document
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 print:text-gray-700 mt-2">
                                        Scan to verify authenticity
                                    </p>
                                </div>

                                {/* Emergency Contact */}
                                <div className="text-right">
                                    <h3 className="text-xs font-bold text-red-600 print:text-black mb-2 uppercase">24/7 Emergency Hotline:</h3>
                                    <p className="text-lg font-bold text-red-600 print:text-black">{hospitalConfig.contact.emergencyHotline}</p>
                                    <p className="text-xs text-slate-600 print:text-gray-700 mt-2">
                                        {hospitalConfig.hours.weekdays}
                                    </p>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-slate-50 print:bg-gray-100 border border-slate-200 print:border-gray-400 rounded-lg p-4 text-center">
                                <p className="text-xs text-slate-600 print:text-gray-700 mb-2">
                                    <span className="font-semibold">Official Medical Document</span> - This discharge summary is a legal medical document issued by {hospitalConfig.name}.
                                </p>
                                <p className="text-xs text-slate-500 print:text-gray-700">
                                    For verification or medical records requests, contact: {hospitalConfig.contact.email} | {hospitalConfig.contact.phone}
                                </p>
                                <p className="text-xs text-slate-500 print:text-gray-700 mt-2">
                                    {hospitalConfig.address.postalCode}, {hospitalConfig.address.city}, {hospitalConfig.address.country}
                                </p>
                            </div>

                            {/* Barcode/Document ID */}
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center gap-2 text-xs text-slate-500 print:text-gray-700">
                                    <div className="h-10 w-40 bg-slate-100 print:bg-gray-200 flex items-center justify-center border border-slate-300 print:border-gray-400">
                                        ||| || ||| || | |||
                                    </div>
                                    <span>Document ID: DS-{admission.id}-{new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        <span className="font-semibold">Note:</span> Please print or download this summary before completing the discharge.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onCompleteDischarge}
                            className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors shadow-lg"
                        >
                            Complete Discharge
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        margin: 1.5cm;
                        size: A4;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};

export default DischargeSummaryModal;
