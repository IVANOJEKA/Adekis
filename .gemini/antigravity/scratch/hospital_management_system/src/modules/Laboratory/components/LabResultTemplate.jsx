import React from 'react';
import { Building2, Phone, Mail, MapPin, Calendar, User, FileText, CheckCircle } from 'lucide-react';

const LabResultTemplate = ({ test, hospital, template = 'standard' }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Standard template
    if (template === 'standard') {
        return (
            <div className="bg-white p-8 max-w-4xl mx-auto" id="lab-result-print">
                {/* Header with Hospital Branding */}
                <div className="border-b-4 border-primary pb-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-primary mb-2">
                                {hospital?.name || 'Hospital Name'}
                            </h1>
                            <div className="space-y-1 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span>{hospital?.address || 'Hospital Address'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} />
                                    <span>{hospital?.phone || 'Phone Number'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={14} />
                                    <span>{hospital?.email || 'Email Address'}</span>
                                </div>
                            </div>
                        </div>
                        {hospital?.logo && (
                            <img src={hospital.logo} alt="Hospital Logo" className="h-20 w-20 object-contain" />
                        )}
                    </div>
                </div>

                {/* Document Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">LABORATORY TEST REPORT</h2>
                    <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">Test ID: {test?.testId}</p>
                    </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-lg">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-3">PATIENT INFORMATION</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Name:</strong> {test?.patient?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Patient ID:</strong> {test?.patient?.patientId || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Gender:</strong> {test?.patient?.gender || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>DOB:</strong> {test?.patient?.dateOfBirth ? new Date(test.patient.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-3">TEST INFORMATION</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Test Name:</strong> {test?.testName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Test Type:</strong> {test?.testType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Ordered:</strong> {test?.orderedAt ? new Date(test.orderedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-slate-400" />
                                <span className="text-sm"><strong>Completed:</strong> {test?.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Results */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">TEST RESULTS</h3>
                    <div className="p-6 bg-slate-50 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                            {test?.results || 'No results available'}
                        </pre>
                    </div>
                </div>

                {/* Notes */}
                {test?.notes && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">NOTES</h3>
                        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                            <p className="text-sm text-slate-700">{test.notes}</p>
                        </div>
                    </div>
                )}

                {/* Validation & Signatures */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border-t-2 border-slate-300 pt-4">
                        <p className="text-sm text-slate-600 mb-1">Ordered By:</p>
                        <p className="font-semibold text-slate-800">{test?.orderedBy}</p>
                        <p className="text-xs text-slate-500">{test?.orderedByRole || 'Medical Staff'}</p>
                    </div>
                    {test?.resultsValidatedBy && (
                        <div className="border-t-2 border-slate-300 pt-4">
                            <p className="text-sm text-slate-600 mb-1">Validated By:</p>
                            <p className="font-semibold text-slate-800">{test.resultsValidatedBy}</p>
                            <p className="text-xs text-slate-500">
                                {test.resultsValidatedAt ? new Date(test.resultsValidatedAt).toLocaleString() : ''}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-slate-200 pt-6 mt-8">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                        <p>Printed on: {currentDate}</p>
                        <p>Document ID: {test?.testId}</p>
                        <p className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-emerald-600" />
                            Verified Report
                        </p>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        This is a computer-generated report and does not require a physical signature.
                    </p>
                </div>
            </div>
        );
    }

    // Detailed template with reference ranges
    if (template === 'detailed') {
        return (
            <div className="bg-white p-8 max-w-4xl mx-auto" id="lab-result-print">
                {/* Similar header structure */}
                <div className="border-b-4 border-primary pb-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-primary mb-2">
                                {hospital?.name || 'Hospital Name'}
                            </h1>
                            <p className="text-sm text-slate-600">{hospital?.address || 'Hospital Address'}</p>
                        </div>
                        {hospital?.logo && (
                            <img src={hospital.logo} alt="Hospital Logo" className="h-20 w-20 object-contain" />
                        )}
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">DETAILED LABORATORY REPORT</h2>
                    <p className="text-sm text-slate-500 mt-2">Test ID: {test?.testId}</p>
                </div>

                {/* Patient & Test Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg text-sm">
                    <div>
                        <p className="text-slate-500">Patient Name</p>
                        <p className="font-semibold">{test?.patient?.name}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Patient ID</p>
                        <p className="font-semibold">{test?.patient?.patientId}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Age/Gender</p>
                        <p className="font-semibold">{test?.patient?.gender}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Test Name</p>
                        <p className="font-semibold">{test?.testName}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Sample Collected</p>
                        <p className="font-semibold">{test?.orderedAt ? new Date(test.orderedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Report Date</p>
                        <p className="font-semibold">{test?.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>

                {/* Results Table */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">TEST RESULTS</h3>
                    <table className="w-full border border-slate-300">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold">Parameter</th>
                                <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold">Result</th>
                                <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold">Unit</th>
                                <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold">Reference Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4" className="border border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                                    {test?.results || 'Detailed results will be displayed here'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer with signatures */}
                <div className="grid grid-cols-2 gap-8 mt-12">
                    <div className="border-t-2 border-slate-300 pt-4">
                        <p className="text-sm text-slate-600">Lab Technician</p>
                        <p className="font-semibold mt-2">{test?.orderedBy}</p>
                    </div>
                    <div className="border-t-2 border-slate-300 pt-4">
                        <p className="text-sm text-slate-600">Pathologist</p>
                        <p className="font-semibold mt-2">{test?.resultsValidatedBy || '_________________'}</p>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-400 mt-8">
                    <p>*** End of Report ***</p>
                </div>
            </div>
        );
    }

    // Minimal template
    return (
        <div className="bg-white p-8 max-w-4xl mx-auto" id="lab-result-print">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">{hospital?.name || 'Hospital Name'}</h1>
                <p className="text-sm text-slate-500">Laboratory Test Report</p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-600">Test ID:</span>
                    <span className="text-sm font-semibold">{test?.testId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-600">Patient:</span>
                    <span className="text-sm font-semibold">{test?.patient?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-600">Test:</span>
                    <span className="text-sm font-semibold">{test?.testName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-600">Date:</span>
                    <span className="text-sm font-semibold">{test?.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Results:</h3>
                <div className="p-4 bg-slate-50 rounded">
                    <pre className="whitespace-pre-wrap text-sm">{test?.results || 'No results'}</pre>
                </div>
            </div>

            <div className="text-right text-xs text-slate-500">
                <p>Printed: {currentDate}</p>
            </div>
        </div>
    );
};

export default LabResultTemplate;
