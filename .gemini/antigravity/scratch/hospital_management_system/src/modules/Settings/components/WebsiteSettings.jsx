import React, { useState } from 'react';
import { useBranding } from '../../../context/BrandingContext';
import { Save, Globe, Image, Layout, Phone, MessageSquare, Plus, Trash2 } from 'lucide-react';

const WebsiteSettings = () => {
    const { branding, updateBranding } = useBranding();

    // Initialize state with existing config or defaults (safe access)
    const [config, setConfig] = useState(branding.websiteConfig || {
        showTopBar: true,
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        showStats: true,
        emergencyPhone: '',
        welcomeMessage: '',
        services: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleServiceChange = (index, field, value) => {
        const newServices = [...config.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setConfig(prev => ({ ...prev, services: newServices }));
    };

    const handleAddService = () => {
        setConfig(prev => ({
            ...prev,
            services: [...prev.services, { title: 'New Service', description: 'Description', icon: 'Activity' }]
        }));
    };

    const handleRemoveService = (index) => {
        setConfig(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        updateBranding({ ...branding, websiteConfig: config });
        alert('Website settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Website Configuration</h2>
                    <p className="text-sm text-slate-500">Manage your hospital's public landing page</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>

            {/* Hero Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layout size={20} className="text-blue-500" />
                    Hero Section
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={config.heroTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message (Tagline)</label>
                            <input
                                type="text"
                                name="welcomeMessage"
                                value={config.welcomeMessage}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
                        <textarea
                            name="heroSubtitle"
                            value={config.heroSubtitle}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="heroImage"
                                value={config.heroImage}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                            <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                <Image size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Provide a URL for the main banner image (e.g. from Unsplash)</p>
                    </div>
                </div>
            </div>

            {/* Contact & Misc */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-emerald-500" />
                    Display Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <input
                                type="checkbox"
                                name="showTopBar"
                                checked={config.showTopBar}
                                onChange={handleChange}
                                className="w-4 h-4 text-emerald-500 rounded"
                            />
                            <span className="font-medium text-slate-700">Show Top Bar (Phone/Hours)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <input
                                type="checkbox"
                                name="showStats"
                                checked={config.showStats}
                                onChange={handleChange}
                                className="w-4 h-4 text-emerald-500 rounded"
                            />
                            <span className="font-medium text-slate-700">Show Statistics Section</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="emergencyPhone"
                                value={config.emergencyPhone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Editor */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layout size={20} className="text-purple-500" />
                        Services List
                    </h3>
                    <button
                        onClick={handleAddService}
                        className="px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Service
                    </button>
                </div>
                <div className="space-y-4">
                    {config.services.map((service, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-slate-700">Service #{index + 1}</h4>
                                <button
                                    onClick={() => handleRemoveService(index)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input
                                    type="text"
                                    placeholder="Service Title"
                                    value={service.title}
                                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                />
                                <div className="relative">
                                    <select
                                        value={service.icon}
                                        onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm appearance-none"
                                    >
                                        <option value="Activity">Activity Icon</option>
                                        <option value="Heart">Heart Icon</option>
                                        <option value="Phone">Phone Icon</option>
                                        <option value="Shield">Shield Icon</option>
                                        <option value="User">User Icon</option>
                                        <option value="Stethoscope">Stethoscope Icon</option>
                                        <option value="Microscope">Microscope Icon</option>
                                        <option value="Pill">Pill Icon</option>
                                        <option value="Ambulance">Ambulance Icon</option>
                                    </select>
                                </div>
                            </div>
                            <textarea
                                placeholder="Service Description"
                                value={service.description}
                                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm resize-none"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebsiteSettings;
