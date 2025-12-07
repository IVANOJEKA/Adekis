import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Upload, Plus } from 'lucide-react';

const ReportingModal = ({ order, onClose, onSave, onOpenTemplateManager }) => {
    const [reportData, setReportData] = useState({
        technique: '',
        findings: '',
        impression: '',
        radiologist: 'Dr. Sarah Wilson' // Default logged in user
    });

    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const loadTemplates = () => {
            const storedTemplates = JSON.parse(localStorage.getItem('radiology_templates') || '[]');

            // Add default templates if none exist and it's the first load
            if (storedTemplates.length === 0) {
                const defaults = [
                    { id: 1, name: 'Normal Chest X-Ray', content: 'FINDINGS:\nThe lungs are clear. The cardiomediastinal silhouette is within normal limits. No acute osseous abnormality.\n\nIMPRESSION:\nNo acute cardiopulmonary disease.' },
                    { id: 2, name: 'Normal Abdominal Ultrasound', content: 'FINDINGS:\nThe liver, gallbladder, pancreas, spleen, and kidneys are normal in size and echotexture. No focal masses or fluid collections.\n\nIMPRESSION:\nNormal abdominal ultrasound.' }
                ];
                localStorage.setItem('radiology_templates', JSON.stringify(defaults));
                setTemplates(defaults);
            } else {
                setTemplates(storedTemplates);
            }
        };

        loadTemplates();

        // Listen for updates from Template Manager
        const handleTemplateUpdate = () => loadTemplates();
        window.addEventListener('radiologyTemplatesUpdated', handleTemplateUpdate);

        return () => {
            window.removeEventListener('radiologyTemplatesUpdated', handleTemplateUpdate);
        };
    }, []);

    const handleApplyTemplate = (e) => {
        const templateId = e.target.value;
        if (!templateId) return;

        const template = templates.find(t => t.id === parseInt(templateId));
        if (template) {
            setReportData(prev => ({
                ...prev,
                findings: template.content,
                impression: template.name
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...order,
            report: reportData,
            status: 'Completed',
            completedAt: new Date().toISOString()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Radiology Report</h3>
                        <p className="text-sm text-slate-500">{order.examination} - {order.patientName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Patient Info Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase">Order Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Details:</span>
                                        <span className="font-medium">{order.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Modality:</span>
                                        <span className="font-medium">{order.modality}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Date:</span>
                                        <span className="font-medium">{order.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <h4 className="font-bold text-amber-800 mb-2 text-sm uppercase">Clinical Info</h4>
                                <p className="text-sm text-slate-700">{order.clinicalInfo || 'None provided'}</p>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase flex items-center gap-2">
                                    <FileText size={16} /> Templates
                                </h4>
                                <select
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500"
                                    onChange={handleApplyTemplate}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={onOpenTemplateManager}
                                    className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Upload size={14} /> Upload/Manage Templates
                                </button>
                            </div>
                        </div>

                        {/* Report Form */}
                        <div className="lg:col-span-2">
                            <form id="reportForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Technique</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="e.g. Standard views obtained..."
                                        value={reportData.technique}
                                        onChange={e => setReportData({ ...reportData, technique: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Findings</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[200px] font-mono text-sm leading-relaxed"
                                        placeholder="Enter detailed findings..."
                                        value={reportData.findings}
                                        onChange={e => setReportData({ ...reportData, findings: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Impression / Conclusion</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[80px]"
                                        placeholder="Summary of findings..."
                                        value={reportData.impression}
                                        onChange={e => setReportData({ ...reportData, impression: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Radiologist</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50"
                                        value={reportData.radiologist}
                                        readOnly
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="reportForm"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center gap-2"
                    >
                        <Save size={18} />
                        Sign & Finalize Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportingModal;
