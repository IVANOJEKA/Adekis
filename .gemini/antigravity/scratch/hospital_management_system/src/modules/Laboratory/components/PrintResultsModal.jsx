import React, { useState } from 'react';
import { Printer, Download, Eye, Settings } from 'lucide-react';
import LabResultTemplate from './LabResultTemplate';
import { labAPI } from '../../../services/api';

const PrintResultsModal = ({ test, onClose }) => {
    const [template, setTemplate] = useState('standard');
    const [showPreview, setShowPreview] = useState(true);

    const hospital = {
        name: localStorage.getItem('hospital_name') || 'Adekis Hospital',
        address: localStorage.getItem('hospital_address') || '123 Medical Center Drive',
        phone: localStorage.getItem('hospital_phone') || '+1 (555) 123-4567',
        email: localStorage.getItem('hospital_email') || 'info@adekishospital.com',
        logo: localStorage.getItem('hospital_logo') || null
    };

    const handlePrint = async () => {
        try {
            // Log print activity
            await labAPI.logPrint(test.id);

            // Trigger print
            const printContent = document.getElementById('lab-result-print');
            const originalContents = document.body.innerHTML;
            const printContents = printContent.innerHTML;

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore React state
        } catch (error) {
            console.error('Error printing:', error);
            alert('Failed to log print activity');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            await labAPI.logPrint(test.id);
            alert('PDF download functionality would be implemented here using a library like jsPDF or html2pdf');
            // In production: use html2pdf.js or similar
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const templates = [
        { id: 'standard', name: 'Standard Report', description: 'Professional format with hospital branding' },
        { id: 'detailed', name: 'Detailed Report', description: 'Includes reference ranges and detailed parameters' },
        { id: 'minimal', name: 'Minimal Report', description: 'Simple, compact format' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Print Lab Results</h3>
                        <p className="text-sm text-slate-500 mt-1">{test.testId} - {test.testName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Template Selection */}
                    <div className="w-80 border-r border-slate-200 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Template Selection */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <Settings size={16} />
                                    Select Template
                                </h4>
                                <div className="space-y-2">
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTemplate(t.id)}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${template === t.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <p className="font-medium text-sm text-slate-800">{t.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} />
                                    {showPreview ? 'Hide' : 'Show'} Preview
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center justify-center gap-2"
                                >
                                    <Printer size={16} />
                                    Print Report
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </button>
                            </div>

                            {/* Hospital Branding Info */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-xs font-semibold text-blue-900 mb-2">Hospital Branding</p>
                                <div className="text-xs text-blue-700 space-y-1">
                                    <p><strong>Name:</strong> {hospital.name}</p>
                                    <p><strong>Address:</strong> {hospital.address}</p>
                                    <p className="text-blue-600 mt-2">Configure in Settings</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 p-8">
                        {showPreview ? (
                            <div className="bg-white shadow-lg">
                                <LabResultTemplate
                                    test={test}
                                    hospital={hospital}
                                    template={template}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-slate-400">
                                    <Eye size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Preview hidden</p>
                                    <p className="text-sm mt-2">Click "Show Preview" to view</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintResultsModal;
