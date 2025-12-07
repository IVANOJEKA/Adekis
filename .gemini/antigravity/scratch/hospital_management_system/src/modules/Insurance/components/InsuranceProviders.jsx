import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2, X, Save, Building2, CheckCircle, XCircle, Calendar, DollarSign, Phone, Mail, Globe } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const InsuranceProviders = () => {
    const { insuranceProviders = [], setInsuranceProviders } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        type: 'Health',
        networkStatus: 'In-Network',
        contractStartDate: '',
        contractEndDate: '',
        coveragePercentage: 80,
        claimsEmail: '',
        claimsPhone: '',
        portalUrl: '',
        apiEnabled: false,
        apiKey: '',
        apiEndpoint: '',
        preAuthRequired: false,
        approvedServices: ['ALL'],
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        turnaroundDays: 7,
        country: 'Uganda'
    });

    const handleAddNew = () => {
        setFormData({
            id: `INS-${Date.now()}`,
            name: '',
            type: 'Health',
            networkStatus: 'In-Network',
            contractStartDate: '',
            contractEndDate: '',
            coveragePercentage: 80,
            claimsEmail: '',
            claimsPhone: '',
            portalUrl: '',
            apiEnabled: false,
            apiKey: '',
            apiEndpoint: '',
            preAuthRequired: false,
            approvedServices: ['ALL'],
            contactPerson: '',
            contactPhone: '',
            contactEmail: '',
            turnaroundDays: 7,
            country: 'Uganda'
        });
        setEditingProvider(null);
        setShowAddModal(true);
    };

    const handleEdit = (provider) => {
        setFormData(provider);
        setEditingProvider(provider.id);
        setShowAddModal(true);
    };

    const handleDelete = (providerId) => {
        if (window.confirm('Are you sure you want to remove this insurance provider?')) {
            setInsuranceProviders(insuranceProviders.filter(p => p.id !== providerId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingProvider) {
            // Update existing
            setInsuranceProviders(insuranceProviders.map(p =>
                p.id === editingProvider ? formData : p
            ));
            alert('Insurance provider updated successfully!');
        } else {
            // Add new
            setInsuranceProviders([...insuranceProviders, formData]);
            alert('Insurance provider added successfully!');
        }

        setShowAddModal(false);
        setEditingProvider(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Insurance Providers</h2>
                    <p className="text-sm text-slate-500">Manage relationships with insurance companies</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                >
                    <Plus size={20} />
                    Add Provider
                </button>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insuranceProviders.map((provider) => (
                    <div key={provider.id} className="bg-white border-2 border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg ${provider.networkStatus === 'In-Network' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    <Shield size={24} className={provider.networkStatus === 'In-Network' ? 'text-emerald-600' : 'text-amber-600'} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{provider.name}</h3>
                                    <p className="text-xs text-slate-500">{provider.country}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(provider)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(provider.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${provider.networkStatus === 'In-Network'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {provider.networkStatus}
                            </span>
                            {provider.apiEnabled && (
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                                    <Globe size={12} />
                                    API Enabled
                                </span>
                            )}
                            {provider.preAuthRequired && (
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                    Pre-Auth Required
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Coverage:</span>
                                <span className="font-bold text-slate-800">{provider.coveragePercentage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Turnaround:</span>
                                <span className="font-bold text-slate-800">{provider.turnaroundDays} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Contract:</span>
                                <span className="font-medium text-emerald-600 text-xs">
                                    {provider.contractStartDate ? new Date(provider.contractStartDate).toLocaleDateString() : 'N/A'} -
                                    {provider.contractEndDate ? new Date(provider.contractEndDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Contact */}
                        {provider.contactPerson && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500 mb-1">Contact Person</p>
                                <p className="font-medium text-slate-800 text-sm">{provider.contactPerson}</p>
                                {provider.contactPhone && (
                                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                        <Phone size={12} />
                                        {provider.contactPhone}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Empty State */}
                {insuranceProviders.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <Shield size={64} className="text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Insurance Providers Yet</h3>
                        <p className="text-slate-500 mb-4">Add your first insurance provider to start managing claims</p>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <Plus size={20} />
                            Add First Provider
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <Shield size={24} />
                                <h3 className="text-xl font-bold">
                                    {editingProvider ? 'Edit Insurance Provider' : 'Add New Insurance Provider'}
                                </h3>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Basic Information */}
                            <div className="border-2 border-blue-100 rounded-xl p-5 bg-blue-50/30">
                                <h4 className="font-bold text-slate-800 mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Provider Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="AAR Insurance"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Health">Health Insurance</option>
                                            <option value="Auto">Auto Insurance</option>
                                            <option value="Life">Life Insurance</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Network Status *</label>
                                        <select
                                            required
                                            value={formData.networkStatus}
                                            onChange={(e) => setFormData({ ...formData, networkStatus: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="In-Network">In-Network</option>
                                            <option value="Out-of-Network">Out-of-Network</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contract Details */}
                            <div className="border-2 border-emerald-100 rounded-xl p-5 bg-emerald-50/30">
                                <h4 className="font-bold text-slate-800 mb-4">Contract Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.contractStartDate}
                                            onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.contractEndDate}
                                            onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Coverage %</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.coveragePercentage}
                                            onChange={(e) => setFormData({ ...formData, coveragePercentage: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Turnaround (days)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.turnaroundDays}
                                            onChange={(e) => setFormData({ ...formData, turnaroundDays: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.preAuthRequired}
                                                onChange={(e) => setFormData({ ...formData, preAuthRequired: e.target.checked })}
                                                className="w-4 h-4 text-emerald-600 rounded"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Pre-Authorization Required</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border-2 border-purple-100 rounded-xl p-5 bg-purple-50/30">
                                <h4 className="font-bold text-slate-800 mb-4">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Claims Email</label>
                                        <input
                                            type="email"
                                            value={formData.claimsEmail}
                                            onChange={(e) => setFormData({ ...formData, claimsEmail: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="claims@insurance.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Claims Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.claimsPhone}
                                            onChange={(e) => setFormData({ ...formData, claimsPhone: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Portal URL</label>
                                        <input
                                            type="url"
                                            value={formData.portalUrl}
                                            onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://provider.insurance.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* API Configuration */}
                            <div className="border-2 border-slate-100 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800">API Integration</h4>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.apiEnabled}
                                            onChange={(e) => setFormData({ ...formData, apiEnabled: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Enable API</span>
                                    </label>
                                </div>
                                {formData.apiEnabled && (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint</label>
                                            <input
                                                type="url"
                                                value={formData.apiEndpoint}
                                                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://api.insurance.com/v1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                                            <input
                                                type="password"
                                                value={formData.apiKey}
                                                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter API key"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingProvider ? 'Update Provider' : 'Add Provider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceProviders;
