import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Save, FileText, Upload } from 'lucide-react';

const TemplateManagerModal = ({ onClose }) => {
    const [templates, setTemplates] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('radiology_templates') || '[]');
        setTemplates(stored);
    }, []);

    const updateTemplates = (updated) => {
        setTemplates(updated);
        localStorage.setItem('radiology_templates', JSON.stringify(updated));
        // Dispatch custom event to notify other components (like ReportingModal)
        window.dispatchEvent(new Event('radiologyTemplatesUpdated'));
    };

    const handleSaveTemplate = (e) => {
        e.preventDefault();
        const template = {
            id: Date.now(),
            name: newTemplate.name,
            content: newTemplate.content
        };
        const updated = [...templates, template];
        updateTemplates(updated);
        setView('list');
        setNewTemplate({ name: '', content: '' });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) {
            const updated = templates.filter(t => t.id !== id);
            updateTemplates(updated);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    // Validate structure
                    const validTemplates = imported.filter(t => t.name && t.content).map(t => ({
                        id: t.id || Date.now() + Math.random(), // Ensure ID exists
                        name: t.name,
                        content: t.content
                    }));

                    if (validTemplates.length > 0) {
                        const updated = [...templates, ...validTemplates];
                        updateTemplates(updated);
                        alert(`Successfully imported ${validTemplates.length} templates!`);
                    } else {
                        alert('No valid templates found in the file.');
                    }
                } else {
                    alert('Invalid file format. Expected an array of templates.');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to parse JSON file. Please ensure it is valid JSON.');
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Manage Interpretation Templates</h3>
                        <p className="text-sm text-slate-500">Create and manage custom standard reporting templates</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {view === 'list' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setView('create')}
                                    className="py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2"
                                >
                                    <Plus size={24} />
                                    <span className="font-bold">Create New Template</span>
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2"
                                >
                                    <Upload size={24} />
                                    <span className="font-bold">Import from PC</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                />
                            </div>

                            <div className="space-y-3">
                                {templates.map(template => (
                                    <div key={template.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                    <FileText size={18} />
                                                </div>
                                                <h4 className="font-bold text-slate-800">{template.name}</h4>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Template"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 pl-11">{template.content}</p>
                                    </div>
                                ))}
                                {templates.length === 0 && (
                                    <div className="text-center py-8 text-slate-400">
                                        No templates found. Create one or import to get started.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveTemplate} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Template Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="e.g. Normal Chest X-Ray"
                                    required
                                    value={newTemplate.name}
                                    onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Content / Findings</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[200px]"
                                    placeholder="Enter the standard text for this template..."
                                    required
                                    value={newTemplate.content}
                                    onChange={e => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Template
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateManagerModal;
