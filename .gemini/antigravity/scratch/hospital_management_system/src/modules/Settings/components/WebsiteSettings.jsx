import React, { useState } from 'react';
import { useBranding } from '../../../context/BrandingContext';
import { Save, Globe, Image, Layout, Phone, MessageSquare, Plus, Trash2, Calendar, CreditCard, Tag, Edit, Check } from 'lucide-react';

const WebsiteSettings = () => {
    const { branding, updateBranding } = useBranding();

    // Initialize state with existing config or defaults (safe access)
    // We update this whenever generic website settings change
    const [config, setConfig] = useState(branding.websiteConfig || {
        showTopBar: true,
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        showStats: true,
        emergencyPhone: '',
        welcomeMessage: '',
        services: [],
        promotions: [],
        healthCamps: [],
        walletPackages: []
    });

    const [activeSection, setActiveSection] = useState('general');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Services Handlers ---
    const handleServiceChange = (index, field, value) => {
        const newServices = [...(config.services || [])];
        newServices[index] = { ...newServices[index], [field]: value };
        setConfig(prev => ({ ...prev, services: newServices }));
    };

    const handleAddService = () => {
        setConfig(prev => ({
            ...prev,
            services: [...(prev.services || []), { title: 'New Service', description: 'Description', icon: 'Activity' }]
        }));
    };

    const handleRemoveService = (index) => {
        setConfig(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    // --- Promotions Handlers ---
    const handleAddPromotion = () => {
        setConfig(prev => ({
            ...prev,
            promotions: [...(prev.promotions || []), { id: Date.now(), title: 'New Promo', description: 'Promo details', image: '', active: true }]
        }));
    };

    const handlePromotionChange = (index, field, value) => {
        const newPromos = [...(config.promotions || [])];
        newPromos[index] = { ...newPromos[index], [field]: value };
        setConfig(prev => ({ ...prev, promotions: newPromos }));
    };

    const handleRemovePromotion = (index) => {
        setConfig(prev => ({
            ...prev,
            promotions: prev.promotions.filter((_, i) => i !== index)
        }));
    };

    // --- Health Camps Handlers ---
    const handleAddCamp = () => {
        setConfig(prev => ({
            ...prev,
            healthCamps: [...(prev.healthCamps || []), { id: Date.now(), title: 'New Camp', date: '', time: '', location: '', description: '', image: '', slots: 50 }]
        }));
    };

    const handleCampChange = (index, field, value) => {
        const newCamps = [...(config.healthCamps || [])];
        newCamps[index] = { ...newCamps[index], [field]: value };
        setConfig(prev => ({ ...prev, healthCamps: newCamps }));
    };

    const handleRemoveCamp = (index) => {
        setConfig(prev => ({
            ...prev,
            healthCamps: prev.healthCamps.filter((_, i) => i !== index)
        }));
    };

    // --- Wallet Packages Handlers ---
    const handleAddPackage = () => {
        setConfig(prev => ({
            ...prev,
            walletPackages: [...(prev.walletPackages || []), { id: Date.now(), name: 'New Plan', price: '0 UGX', benefits: ['Benefit 1'], color: 'slate' }]
        }));
    };

    const handlePackageChange = (index, field, value) => {
        const newPackages = [...(config.walletPackages || [])];
        newPackages[index] = { ...newPackages[index], [field]: value };
        setConfig(prev => ({ ...prev, walletPackages: newPackages }));
    };

    const handleBenefitChange = (pkgIndex, benefitIndex, value) => {
        const newPackages = [...(config.walletPackages || [])];
        const newBenefits = [...newPackages[pkgIndex].benefits];
        newBenefits[benefitIndex] = value;
        newPackages[pkgIndex].benefits = newBenefits;
        setConfig(prev => ({ ...prev, walletPackages: newPackages }));
    };

    const handleAddBenefit = (pkgIndex) => {
        const newPackages = [...(config.walletPackages || [])];
        newPackages[pkgIndex].benefits.push("New Benefit");
        setConfig(prev => ({ ...prev, walletPackages: newPackages }));
    };

    const handleRemovePackage = (index) => {
        setConfig(prev => ({
            ...prev,
            walletPackages: prev.walletPackages.filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        updateBranding({ ...branding, websiteConfig: config });
        alert('Website content updated successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Website CMS</h2>
                    <p className="text-sm text-slate-500">Manage all website content</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
                >
                    <Save size={16} />
                    Publish Changes
                </button>
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                {['general', 'services', 'promotions', 'camps', 'wallet'].map(section => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${activeSection === section
                                ? 'bg-slate-100 text-emerald-600 border-b-2 border-emerald-500'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* --- GENERAL SECTION --- */}
            {activeSection === 'general' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Layout size={20} className="text-blue-500" /> Hero & Basics
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                                    <input type="text" name="heroTitle" value={config.heroTitle} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Text</label>
                                    <input type="text" name="welcomeMessage" value={config.welcomeMessage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
                                <textarea name="heroSubtitle" value={config.heroSubtitle} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
                                <input type="text" name="heroImage" value={config.heroImage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="showTopBar" checked={config.showTopBar} onChange={handleChange} className="rounded text-blue-500" /> Show Top Bar
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="showStats" checked={config.showStats} onChange={handleChange} className="rounded text-blue-500" /> Show Stats
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SERVICES SECTION --- */}
            {activeSection === 'services' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Medical Services</h3>
                        <button onClick={handleAddService} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">+ Add Service</button>
                    </div>
                    <div className="space-y-4">
                        {(config.services || []).map((service, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                                <button onClick={() => handleRemoveService(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                    <input type="text" value={service.title} onChange={(e) => handleServiceChange(idx, 'title', e.target.value)} className="px-3 py-2 border rounded text-sm" placeholder="Title" />
                                    <select value={service.icon} onChange={(e) => handleServiceChange(idx, 'icon', e.target.value)} className="px-3 py-2 border rounded text-sm">
                                        <option value="Activity">Activity</option>
                                        <option value="Heart">Heart</option>
                                        <option value="Stethoscope">Stethoscope</option>
                                        <option value="Microscope">Microscope</option>
                                        <option value="Pill">Pill</option>
                                        <option value="User">User</option>
                                        <option value="Shield">Shield</option>
                                    </select>
                                    <textarea value={service.description} onChange={(e) => handleServiceChange(idx, 'description', e.target.value)} className="col-span-2 px-3 py-2 border rounded text-sm resize-none" rows={2} placeholder="Description" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PROMOTIONS SECTION --- */}
            {activeSection === 'promotions' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Promotions & Ads</h3>
                        <button onClick={handleAddPromotion} className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-100">+ Add Promotion</button>
                    </div>
                    <div className="space-y-4">
                        {(config.promotions || []).map((promo, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                                <button onClick={() => handleRemovePromotion(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-1 gap-3 pr-8">
                                    <div className="flex gap-2">
                                        <input type="text" value={promo.title} onChange={(e) => handlePromotionChange(idx, 'title', e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" placeholder="Promo Title" />
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={promo.active} onChange={(e) => handlePromotionChange(idx, 'active', e.target.checked)} /> Active
                                        </label>
                                    </div>
                                    <input type="text" value={promo.image} onChange={(e) => handlePromotionChange(idx, 'image', e.target.value)} className="px-3 py-2 border rounded text-sm" placeholder="Image URL" />
                                    <textarea value={promo.description} onChange={(e) => handlePromotionChange(idx, 'description', e.target.value)} className="px-3 py-2 border rounded text-sm resize-none" rows={2} placeholder="Promo Details" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- HEALTH CAMPS SECTION --- */}
            {activeSection === 'camps' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Health Camps</h3>
                        <button onClick={handleAddCamp} className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg hover:bg-emerald-100">+ Add Camp</button>
                    </div>
                    <div className="space-y-4">
                        {(config.healthCamps || []).map((camp, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                                <button onClick={() => handleRemoveCamp(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                    <input type="text" value={camp.title} onChange={(e) => handleCampChange(idx, 'title', e.target.value)} className="col-span-2 px-3 py-2 border rounded text-sm" placeholder="Camp Title" />
                                    <input type="date" value={camp.date} onChange={(e) => handleCampChange(idx, 'date', e.target.value)} className="px-3 py-2 border rounded text-sm" />
                                    <input type="text" value={camp.time} onChange={(e) => handleCampChange(idx, 'time', e.target.value)} className="px-3 py-2 border rounded text-sm" placeholder="Time (e.g. 9am - 4pm)" />
                                    <input type="text" value={camp.location} onChange={(e) => handleCampChange(idx, 'location', e.target.value)} className="px-3 py-2 border rounded text-sm" placeholder="Location" />
                                    <input type="number" value={camp.slots} onChange={(e) => handleCampChange(idx, 'slots', parseInt(e.target.value))} className="px-3 py-2 border rounded text-sm" placeholder="Slots" />
                                    <input type="text" value={camp.image} onChange={(e) => handleCampChange(idx, 'image', e.target.value)} className="col-span-2 px-3 py-2 border rounded text-sm" placeholder="Image URL" />
                                    <textarea value={camp.description} onChange={(e) => handleCampChange(idx, 'description', e.target.value)} className="col-span-2 px-3 py-2 border rounded text-sm resize-none" rows={2} placeholder="Description" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- WALLET SECTION --- */}
            {activeSection === 'wallet' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Shand Wallet Packages</h3>
                        <button onClick={handleAddPackage} className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-100">+ Add Package</button>
                    </div>
                    <div className="space-y-6">
                        {(config.walletPackages || []).map((pkg, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative">
                                <button onClick={() => handleRemovePackage(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8 mb-4">
                                    <input type="text" value={pkg.name} onChange={(e) => handlePackageChange(idx, 'name', e.target.value)} className="px-3 py-2 border rounded text-sm font-bold" placeholder="Package Name" />
                                    <input type="text" value={pkg.price} onChange={(e) => handlePackageChange(idx, 'price', e.target.value)} className="px-3 py-2 border rounded text-sm" placeholder="Price" />
                                    <label className="flex items-center gap-2 text-sm text-slate-700">
                                        <input type="checkbox" checked={pkg.recommended} onChange={(e) => handlePackageChange(idx, 'recommended', e.target.checked)} /> Recommended
                                    </label>
                                </div>
                                <div className="bg-white p-3 rounded border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 mb-2">BENEFITS</p>
                                    <div className="space-y-2">
                                        {pkg.benefits.map((benefit, bIdx) => (
                                            <input
                                                key={bIdx}
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleBenefitChange(idx, bIdx, e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-xs"
                                            />
                                        ))}
                                        <button onClick={() => handleAddBenefit(idx)} className="text-xs text-blue-500 hover:underline">+ Add Benefit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteSettings;
