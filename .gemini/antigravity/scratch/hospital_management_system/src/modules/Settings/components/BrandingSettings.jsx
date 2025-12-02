import React, { useState, useEffect } from 'react';
import { useBranding } from '../../../context/BrandingContext';
import {
    Building, Globe, Mail, Phone, MapPin, Palette, Type,
    Image as ImageIcon, Save, RefreshCw, LayoutTemplate,
    FileText, CheckCircle
} from 'lucide-react';

const BrandingSettings = () => {
    const { branding, updateBranding, resetBranding } = useBranding();
    const [formData, setFormData] = useState(branding);
    const [previewMode, setPreviewMode] = useState('invoice'); // 'invoice', 'report'
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setFormData(branding);
    }, [branding]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updateBranding(formData);
        setIsDirty(false);
        // You might want to show a toast here
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset to default branding?')) {
            resetBranding();
        }
    };

    const handleImageUpload = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange(field, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings Form */}
            <div className="space-y-6">
                {/* Hospital Identity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Building className="text-primary" size={20} />
                        Hospital Identity
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slogan / Tagline</label>
                            <input
                                type="text"
                                value={formData.slogan || ''}
                                onChange={(e) => handleChange('slogan', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={formData.website || ''}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Identity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Palette className="text-primary" size={20} />
                        Visual Identity
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.primaryColor}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border border-slate-300"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.secondaryColor}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border border-slate-300"
                                    />
                                    <input
                                        type="text"
                                        value={formData.secondaryColor}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Accent Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.accentColor}
                                        onChange={(e) => handleChange('accentColor', e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border border-slate-300"
                                    />
                                    <input
                                        type="text"
                                        value={formData.accentColor}
                                        onChange={(e) => handleChange('accentColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="text-slate-400" size={24} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload('logo', e)}
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary/10 file:text-primary
                                            hover:file:bg-primary/20"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Recommended: PNG or SVG, max 2MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Branding */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="text-primary" size={20} />
                        Document Branding
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Footer Text</label>
                            <input
                                type="text"
                                value={formData.footerText || ''}
                                onChange={(e) => handleChange('footerText', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="e.g., © 2024 Adekis Hospital. All rights reserved."
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Reset Defaults
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
                <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <LayoutTemplate size={20} />
                            Live Preview
                        </h3>
                        <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => setPreviewMode('invoice')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${previewMode === 'invoice' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                Invoice
                            </button>
                            <button
                                onClick={() => setPreviewMode('report')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${previewMode === 'report' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                Report
                            </button>
                        </div>
                    </div>

                    {/* Document Preview Container */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100" style={{ borderTop: `4px solid ${formData.primaryColor}` }}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo" className="h-16 w-auto object-contain" />
                                    ) : (
                                        <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-2xl font-bold" style={{ color: formData.primaryColor }}>{formData.name}</h1>
                                        <p className="text-slate-500 text-sm">{formData.slogan}</p>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-slate-600">
                                    <p>{formData.address}</p>
                                    <p>{formData.phone}</p>
                                    <p>{formData.email}</p>
                                    <p className="text-primary font-medium">{formData.website}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 flex-1">
                            {previewMode === 'invoice' ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">INVOICE</h2>
                                            <p className="text-slate-500">#INV-2024-001</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Date Issued</p>
                                            <p className="font-medium text-slate-800">Dec 02, 2024</p>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Description</th>
                                                    <th className="px-4 py-3 text-right">Qty</th>
                                                    <th className="px-4 py-3 text-right">Price</th>
                                                    <th className="px-4 py-3 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr>
                                                    <td className="px-4 py-3">General Consultation</td>
                                                    <td className="px-4 py-3 text-right">1</td>
                                                    <td className="px-4 py-3 text-right">50,000</td>
                                                    <td className="px-4 py-3 text-right">50,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3">Lab Test: Malaria RDT</td>
                                                    <td className="px-4 py-3 text-right">1</td>
                                                    <td className="px-4 py-3 text-right">15,000</td>
                                                    <td className="px-4 py-3 text-right">15,000</td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="bg-slate-50 font-bold">
                                                <tr>
                                                    <td colSpan="3" className="px-4 py-3 text-right">Total Amount</td>
                                                    <td className="px-4 py-3 text-right" style={{ color: formData.primaryColor }}>UGX 65,000</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-200 pb-4">
                                        <h2 className="text-xl font-bold text-slate-800">MEDICAL REPORT</h2>
                                        <p className="text-slate-500 text-sm">Patient: John Doe (PID: P-10023)</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-bold text-sm uppercase text-slate-500 mb-1">Diagnosis</h3>
                                            <p className="text-slate-800">Acute Malaria with mild dehydration.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase text-slate-500 mb-1">Prescription</h3>
                                            <ul className="list-disc list-inside text-slate-800">
                                                <li>Coartem 80/480mg - 1x2 for 3 days</li>
                                                <li>Paracetamol 1g - 1x3 for 3 days</li>
                                                <li>ORS Sachets - Take as directed</li>
                                            </ul>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mt-4">
                                            <p className="text-sm italic text-slate-600">
                                                "Rest and plenty of fluids recommended. Return for review in 3 days if symptoms persist."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-500">{formData.footerText}</p>
                            <p className="text-xs text-slate-400 mt-1">Generated by Adekis HMS</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandingSettings;
