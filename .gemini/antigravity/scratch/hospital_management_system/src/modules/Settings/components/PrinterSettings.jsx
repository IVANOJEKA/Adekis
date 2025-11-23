import React, { useState } from 'react';
import { Printer, FileText, Tag, CheckCircle, AlertCircle } from 'lucide-react';

const PrinterSettings = ({ printerSettings = {}, setPrinterSettings, showToast }) => {
    const [testPrinting, setTestPrinting] = useState(false);

    const availablePrinters = [
        'HP LaserJet Pro',
        'Canon PIXMA',
        'Epson TM-T20',
        'Zebra ZD220',
        'Brother HL-L2350DW',
        'Samsung Xpress'
    ];

    const paperSizes = ['A4', 'Letter', 'Legal', 'A5', 'Custom'];
    const orientations = ['Portrait', 'Landscape'];
    const qualities = ['Draft', 'Normal', 'High', 'Best'];

    const handleSettingChange = (key, value) => {
        const updated = { ...printerSettings, [key]: value };
        setPrinterSettings(updated);
        showToast(`Printer setting updated: ${key}`, 'success');
    };

    const handleAutoPrintChange = (key, value) => {
        const updated = {
            ...printerSettings,
            autoPrint: { ...printerSettings.autoPrint, [key]: value }
        };
        setPrinterSettings(updated);
        showToast(`Auto-print ${value ? 'enabled' : 'disabled'} for ${key}`, 'success');
    };

    const handleMarginChange = (side, value) => {
        const updated = {
            ...printerSettings,
            margins: { ...printerSettings.margins, [side]: parseInt(value) || 0 }
        };
        setPrinterSettings(updated);
    };

    const handleTestPrint = () => {
        setTestPrinting(true);
        setTimeout(() => {
            setTestPrinting(false);
            showToast('Test page sent to printer successfully!', 'success');
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Printer Configuration</h2>
                <p className="text-slate-500 text-sm">Configure printer settings for documents, receipts, and labels</p>
            </div>

            {/* Default Printers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-blue-600" />
                        <h3 className="font-bold text-slate-800">Document Printer</h3>
                    </div>
                    <select
                        value={printerSettings.defaultPrinter || ''}
                        onChange={(e) => handleSettingChange('defaultPrinter', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {availablePrinters.map(printer => (
                            <option key={printer} value={printer}>{printer}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">For invoices, reports, prescriptions</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Printer size={20} className="text-emerald-600" />
                        <h3 className="font-bold text-slate-800">Receipt Printer</h3>
                    </div>
                    <select
                        value={printerSettings.receiptPrinter || ''}
                        onChange={(e) => handleSettingChange('receiptPrinter', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        {availablePrinters.map(printer => (
                            <option key={printer} value={printer}>{printer}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">For payment receipts</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Tag size={20} className="text-purple-600" />
                        <h3 className="font-bold text-slate-800">Label Printer</h3>
                    </div>
                    <select
                        value={printerSettings.labelPrinter || ''}
                        onChange={(e) => handleSettingChange('labelPrinter', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        {availablePrinters.map(printer => (
                            <option key={printer} value={printer}>{printer}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">For patient labels, barcodes</p>
                </div>
            </div>

            {/* Print Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Document Print Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Paper Size</label>
                        <select
                            value={printerSettings.paperSize || 'A4'}
                            onChange={(e) => handleSettingChange('paperSize', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {paperSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Orientation</label>
                        <select
                            value={printerSettings.orientation || 'Portrait'}
                            onChange={(e) => handleSettingChange('orientation', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {orientations.map(orient => (
                                <option key={orient} value={orient}>{orient}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Print Quality</label>
                        <select
                            value={printerSettings.quality || 'High'}
                            onChange={(e) => handleSettingChange('quality', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {qualities.map(qual => (
                                <option key={qual} value={qual}>{qual}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleTestPrint}
                            disabled={testPrinting}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {testPrinting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <Printer size={16} />
                                    Test Print
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Margins */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Page Margins (mm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['top', 'bottom', 'left', 'right'].map(side => (
                        <div key={side}>
                            <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{side}</label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={printerSettings.margins?.[side] || 10}
                                onChange={(e) => handleMarginChange(side, e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Auto-Print Options */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-2">Auto-Print Options</h3>
                <p className="text-sm text-slate-500 mb-4">Automatically print these documents when created</p>
                <div className="space-y-3">
                    {[
                        { key: 'invoices', label: 'Invoices & Bills', desc: 'Auto-print when generating invoices' },
                        { key: 'prescriptions', label: 'Prescriptions', desc: 'Auto-print when doctor creates prescription' },
                        { key: 'labReports', label: 'Lab Reports', desc: 'Auto-print when lab results are ready' },
                        { key: 'receipts', label: 'Payment Receipts', desc: 'Auto-print when payment is received' },
                        { key: 'patientLabels', label: 'Patient Labels', desc: 'Auto-print patient ID labels on registration' }
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-slate-800">{item.label}</p>
                                    {printerSettings.autoPrint?.[item.key] && (
                                        <CheckCircle size={16} className="text-emerald-600" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={printerSettings.autoPrint?.[item.key] || false}
                                    onChange={(e) => handleAutoPrintChange(item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-blue-900 mb-1">Printer Configuration</p>
                        <p className="text-sm text-blue-700">
                            All printer settings are saved automatically. Make sure your printers are connected and have the latest drivers installed.
                            Test prints help verify your configuration is working correctly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrinterSettings;
