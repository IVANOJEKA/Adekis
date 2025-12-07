import React, { useState, useEffect } from 'react';
import { X, Save, FileText, AlertCircle, CheckCircle, Upload, Type, Table as TableIcon } from 'lucide-react';

const ResultsEntryModal = ({ order, patient, onClose, onSave }) => {
    const [mode, setMode] = useState('standard'); // 'standard' or 'advanced'
    const [standardData, setStandardData] = useState([]);
    const [advancedData, setAdvancedData] = useState({ findings: '', conclusion: '' });
    const [technician, setTechnician] = useState('Lab Technician'); // Mock logged in user

    useEffect(() => {
        // Initialize standard data based on order type if available
        if (order && order.parameters) {
            setStandardData(order.parameters.map(p => ({
                id: p.id || Math.random(),
                name: p.name,
                value: '',
                unit: p.unit,
                range: p.range
            })));
        } else {
            // Mock initialization if no parameters provided
            initializeMockParameters(order.testType);
        }
    }, [order]);

    const initializeMockParameters = (testType) => {
        let params = [];
        if (testType.includes('CBC') || testType.includes('Blood Count')) {
            params = [
                { name: 'Hemoglobin', unit: 'g/dL', range: '13.5-17.5' },
                { name: 'WBC', unit: 'cells/µL', range: '4000-11000' },
                { name: 'Platelets', unit: 'cells/µL', range: '150000-450000' }
            ];
        } else if (testType.includes('Malaria')) {
            params = [
                { name: 'Malaria Parasite', unit: '', range: 'Negative' }
            ];
        } else {
            params = [{ name: 'Result', unit: '', range: '-' }];
        }

        setStandardData(params.map((p, i) => ({ ...p, id: i, value: '' })));
    };

    const handleStandardChange = (index, value) => {
        const newData = [...standardData];
        newData[index].value = value;
        setStandardData(newData);
    };

    const getFlag = (value, range) => {
        if (!range || !value || range === '-' || range === 'Negative') return null;
        const num = parseFloat(value);
        if (isNaN(num)) return null;

        const parts = range.split('-');
        if (parts.length === 2) {
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            if (num < min) return { label: 'LOW', color: 'text-blue-600 bg-blue-50 border-blue-200' };
            if (num > max) return { label: 'HIGH', color: 'text-red-600 bg-red-50 border-red-200' };
        }
        return { label: 'NORMAL', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalResults = {
            mode,
            tests: mode === 'standard' ? standardData.map(d => ({
                name: d.name,
                value: d.value,
                unit: d.unit,
                normalRange: d.range,
                flag: getFlag(d.value, d.range)?.label || 'NORMAL'
            })) : undefined,
            richText: mode === 'advanced' ? advancedData : undefined,
            technician,
            completedAt: new Date().toISOString()
        };

        onSave(finalResults);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Results Entry: {order.testType}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span>{patient?.name} ({patient?.id})</span>
                            <span>•</span>
                            <span>{order.id}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => setMode('standard')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${mode === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <TableIcon size={16} /> Standard
                            </button>
                            <button
                                onClick={() => setMode('advanced')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${mode === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Type size={16} /> Advanced
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <X size={24} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="resultsForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Standard Mode Table */}
                        {mode === 'standard' && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Parameter</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 w-1/3">Result Value</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Unit</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Ref. Range</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {standardData.map((param, index) => {
                                            const flag = getFlag(param.value, param.range);
                                            return (
                                                <tr key={index} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-medium text-slate-800">{param.name}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={param.value}
                                                            onChange={(e) => handleStandardChange(index, e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                            placeholder="Enter value"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">{param.unit || '-'}</td>
                                                    <td className="px-4 py-3 text-slate-500">{param.range || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        {flag && (
                                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${flag.color}`}>
                                                                {flag.label}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Advanced Mode Rich Text */}
                        {mode === 'advanced' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p>Use Advanced Mode for descriptive reports like Histopathology, Microbiology cultures, or complex interpretations.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Findings / Microscopic Description</label>
                                    <textarea
                                        value={advancedData.findings}
                                        onChange={(e) => setAdvancedData({ ...advancedData, findings: e.target.value })}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[200px] font-mono text-sm"
                                        placeholder="Type detailed findings here..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Conclusion / Impression</label>
                                    <textarea
                                        value={advancedData.conclusion}
                                        onChange={(e) => setAdvancedData({ ...advancedData, conclusion: e.target.value })}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px]"
                                        placeholder="Summary conclusion..."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Common Footer Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Lab Technician</label>
                                <input
                                    type="text"
                                    value={technician}
                                    readOnly
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Verification Notes</label>
                                <input
                                    type="text"
                                    placeholder="Optional internal notes"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="resultsForm"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save & Release Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsEntryModal;
