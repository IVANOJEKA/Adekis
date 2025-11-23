import React from 'react';
import { Printer, X } from 'lucide-react';

const ResultsForm = ({ result, patient, onClose, onPrint }) => {
    const hospitalInfo = {
        name: 'Shand Pharmacy & Hospital',
        address: 'Plot 123, Kampala Road, Kampala, Uganda',
        phone: '+256 700 000 000',
        email: 'info@shandpharmacy.com',
        license: 'UG-HOSP-2024-0001'
    };

    const handlePrint = () => {
        window.print();
        if (onPrint) onPrint();
    };

    const getStatusColor = (value, normalRange) => {
        if (!normalRange || !value) return 'text-slate-700';

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'text-slate-700';

        const [min, max] = normalRange.split('-').map(v => parseFloat(v.trim()));
        if (numValue < min || numValue > max) return 'text-red-600 font-bold';
        return 'text-emerald-600';
    };

    const getStatusIndicator = (value, normalRange) => {
        if (!normalRange || !value) return '';

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';

        const [min, max] = normalRange.split('-').map(v => parseFloat(v.trim()));
        if (numValue < min) return '↓ LOW';
        if (numValue > max) return '↑ HIGH';
        return '✓ NORMAL';
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header - Print Hidden */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-bold text-slate-800">Laboratory Results Form</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                        >
                            <Printer size={18} />
                            Print Results
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Printable Form Content */}
                <div className="flex-1 overflow-y-auto p-8 print:p-0">
                    <div className="max-w-[210mm] mx-auto bg-white print:shadow-none">
                        {/* Hospital Letterhead */}
                        <div className="border-b-4 border-blue-600 pb-4 mb-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-blue-900 mb-1">{hospitalInfo.name}</h1>
                                <p className="text-slate-600">{hospitalInfo.address}</p>
                                <p className="text-slate-600">Tel: {hospitalInfo.phone} | Email: {hospitalInfo.email}</p>
                                <p className="text-xs text-slate-500 mt-1">License No: {hospitalInfo.license}</p>
                            </div>
                        </div>

                        {/* Document Title */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-300 inline-block px-8 pb-2">
                                Laboratory Test Results
                            </h2>
                        </div>

                        {/* Patient Information */}
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-300">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Patient Name</p>
                                <p className="text-base font-bold text-slate-800">{patient?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Patient ID</p>
                                <p className="text-base font-medium text-slate-800">{patient?.id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Age/Gender</p>
                                <p className="text-base font-medium text-slate-800">
                                    {patient?.age || 'N/A'} Years / {patient?.gender || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Sample ID</p>
                                <p className="text-base font-medium text-slate-800">{result?.id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Ordered By</p>
                                <p className="text-base font-medium text-slate-800">{result?.orderedBy || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Collection Date</p>
                                <p className="text-base font-medium text-slate-800">
                                    {result?.collectionDate ? new Date(result.collectionDate).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Reported Date</p>
                                <p className="text-base font-medium text-slate-800">
                                    {result?.completedAt ? new Date(result.completedAt).toLocaleString() : new Date().toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Test Category</p>
                                <p className="text-base font-medium text-slate-800">{result?.category || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Test Results Table */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-300 pb-2">
                                TEST RESULTS
                            </h3>
                            <table className="w-full border-collapse border border-slate-300">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">TEST NAME</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">RESULT</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">UNIT</th>
                                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">NORMAL RANGE</th>
                                        <th className="border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result?.tests?.map((test, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-800">{test.name}</td>
                                            <td className={`border border-slate-300 px-4 py-3 font-bold ${getStatusColor(test.value, test.normalRange)}`}>
                                                {test.value || 'Pending'}
                                            </td>
                                            <td className="border border-slate-300 px-4 py-3 text-slate-600">{test.unit || '-'}</td>
                                            <td className="border border-slate-300 px-4 py-3 text-slate-600">{test.normalRange || '-'}</td>
                                            <td className={`border border-slate-300 px-4 py-3 text-center text-sm font-bold ${getStatusColor(test.value, test.normalRange)}`}>
                                                {getStatusIndicator(test.value, test.normalRange)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Comments/Notes */}
                        {result?.notes && (
                            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                                <p className="text-xs font-bold text-amber-900 uppercase mb-2">Laboratory Notes</p>
                                <p className="text-sm text-amber-800">{result.notes}</p>
                            </div>
                        )}

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-8 mt-12 mb-8">
                            <div className="border-t-2 border-slate-400 pt-2">
                                <p className="text-sm font-bold text-slate-800">{result?.technician || 'Lab Technician'}</p>
                                <p className="text-xs text-slate-600">Laboratory Technician</p>
                                <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="border-t-2 border-slate-400 pt-2">
                                <p className="text-sm font-bold text-slate-800">{result?.reviewedBy || 'Dr. Reviewing Physician'}</p>
                                <p className="text-xs text-slate-600">Reviewing Pathologist</p>
                                <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-slate-300 pt-4 mt-8">
                            <p className="text-xs text-slate-500 text-center mb-2">
                                <strong>Disclaimer:</strong> These results are confidential and intended solely for the patient and their authorized healthcare provider.
                                Results should be interpreted in conjunction with clinical findings.
                            </p>
                            <p className="text-xs text-slate-400 text-center">
                                Accredited by Uganda National Health Laboratory Services | ISO 15189:2012 Certified
                            </p>
                            <p className="text-xs text-slate-400 text-center mt-1">
                                End of Report - Page 1 of 1
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
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

export default ResultsForm;
