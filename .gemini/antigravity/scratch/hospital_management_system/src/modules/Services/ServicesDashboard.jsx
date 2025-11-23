import React, { useState, useMemo } from 'react';
import { Tags, Edit, Plus, Search, Trash2, X, Save, Filter, DollarSign, FileText, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';

const ServicesDashboard = () => {
    const { servicesData, setServicesData, wards, setWards, beds, setBeds } = useData();
    const { formatCurrency } = useCurrency();

    const [activeMainTab, setActiveMainTab] = useState('services'); // 'services' or 'beds'

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: 'Consultation',
        department: 'General',
        price: '',
        insurancePrice: '',
        status: 'Active',
        description: '',
        parameters: []
    });

    // Ward/Bed Management State
    const [isWardModalOpen, setIsWardModalOpen] = useState(false);
    const [isBedModalOpen, setIsBedModalOpen] = useState(false);
    const [currentWard, setCurrentWard] = useState(null);
    const [currentBed, setCurrentBed] = useState(null);
    const [wardFormData, setWardFormData] = useState({
        name: '',
        type: '',
        gender: 'Mixed',
        basePrice: '',
        capacity: ''
    });
    const [bedFormData, setBedFormData] = useState({
        wardId: '',
        number: '',
        type: 'Standard',
        status: 'Available'
    });

    const categories = ['Consultation', 'Laboratory', 'Radiology', 'Pharmacy', 'Procedure', 'Surgery', 'Other'];
    const departments = ['General', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dental', 'Laboratory', 'Radiology', 'Emergency'];

    const filteredServices = useMemo(() => {
        return servicesData.filter(service => {
            const matchesSearch = (service.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (service.code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [servicesData, searchTerm, selectedCategory]);

    const handleOpenModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setFormData({
                name: service.name || '',
                code: service.code || '',
                category: service.category || 'Consultation',
                department: service.department || 'General',
                price: service.price || '',
                insurancePrice: service.insurancePrice || '',
                status: service.status || 'Active',
                description: service.description || '',
                parameters: service.parameters || []
            });
        } else {
            setCurrentService(null);
            setFormData({
                name: '',
                code: '',
                category: 'Consultation',
                department: 'General',
                price: '',
                insurancePrice: '',
                status: 'Active',
                description: '',
                parameters: []
            });
        }
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddParameter = () => {
        setFormData({
            ...formData,
            parameters: [...formData.parameters, { name: '', unit: '', range: '' }]
        });
    };

    const handleRemoveParameter = (index) => {
        const newParams = [...formData.parameters];
        newParams.splice(index, 1);
        setFormData({ ...formData, parameters: newParams });
    };

    const handleParameterChange = (index, field, value) => {
        const newParams = [...formData.parameters];
        newParams[index] = { ...newParams[index], [field]: value };
        setFormData({ ...formData, parameters: newParams });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const newService = {
            id: currentService ? currentService.id : `SRV-${Date.now()}`,
            ...formData,
            price: parseFloat(formData.price) || 0,
            insurancePrice: parseFloat(formData.insurancePrice) || 0,
            lastUpdated: new Date().toISOString()
        };

        if (currentService) {
            // Update existing
            setServicesData(prev => prev.map(item => item.id === currentService.id ? newService : item));
        } else {
            // Add new
            setServicesData(prev => [...prev, newService]);
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServicesData(prev => prev.filter(item => item.id !== id));
        }
    };

    // Ward Management Handlers
    const handleOpenWardModal = (ward = null) => {
        if (ward) {
            setCurrentWard(ward);
            setWardFormData({
                name: ward.name || '',
                type: ward.type || '',
                gender: ward.gender || 'Mixed',
                basePrice: ward.basePrice || '',
                capacity: ward.capacity || ''
            });
        } else {
            setCurrentWard(null);
            setWardFormData({ name: '', type: '', gender: 'Mixed', basePrice: '', capacity: '' });
        }
        setIsWardModalOpen(true);
    };

    const handleSaveWard = (e) => {
        e.preventDefault();
        const newWard = {
            id: currentWard ? currentWard.id : `WARD-${Date.now()}`,
            ...wardFormData,
            basePrice: parseFloat(wardFormData.basePrice) || 0,
            capacity: parseInt(wardFormData.capacity) || 0
        };
        if (currentWard) {
            setWards(prev => prev.map(w => w.id === currentWard.id ? newWard : w));
        } else {
            setWards(prev => [...prev, newWard]);
        }
        setIsWardModalOpen(false);
        setCurrentWard(null);
    };

    const handleDeleteWard = (id) => {
        if (window.confirm('Are you sure? This will also delete all beds in this ward.')) {
            setWards(prev => prev.filter(w => w.id !== id));
            setBeds(prev => prev.filter(b => b.wardId !== id));
        }
    };

    // Bed Management Handlers
    const handleOpenBedModal = (bed = null) => {
        if (bed) {
            setCurrentBed(bed);
            setBedFormData({
                wardId: bed.wardId || '',
                number: bed.number || '',
                type: bed.type || 'Standard',
                status: bed.status || 'Available'
            });
        } else {
            setCurrentBed(null);
            setBedFormData({ wardId: '', number: '', type: 'Standard', status: 'Available' });
        }
        setIsBedModalOpen(true);
    };

    const handleSaveBed = (e) => {
        e.preventDefault();
        const newBed = {
            id: currentBed ? currentBed.id : `BED-${Date.now()}`,
            ...bedFormData,
            patientId: null
        };
        if (currentBed) {
            setBeds(prev => prev.map(b => b.id === currentBed.id ? newBed : b));
        } else {
            setBeds(prev => [...prev, newBed]);
        }
        setIsBedModalOpen(false);
        setCurrentBed(null);
    };

    const handleDeleteBed = (id) => {
        if (window.confirm('Are you sure you want to delete this bed?')) {
            setBeds(prev => prev.filter(b => b.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Services & Pricing</h1>
                    <p className="text-slate-500">Manage hospital services, wards, and bed prices</p>
                </div>
                {activeMainTab === 'services' && (
                    <button onClick={() => handleOpenModal()} className="btn btn-primary gap-2 shadow-lg shadow-primary/30">
                        <Plus size={20} />
                        Add New Service
                    </button>
                )}
                {activeMainTab === 'beds' && (
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenWardModal()} className="btn btn-primary gap-2 shadow-lg shadow-primary/30">
                            <Plus size={20} />
                            Add Ward
                        </button>
                        <button onClick={() => handleOpenBedModal()} className="btn btn-ghost border border-slate-200 gap-2">
                            <Plus size={20} />
                            Add Bed
                        </button>
                    </div>
                )}
            </div>

            {/* Main Tabs */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2">
                <button
                    onClick={() => setActiveMainTab('services')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMainTab === 'services'
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    Services Catalog
                </button>
                <button
                    onClick={() => setActiveMainTab('beds')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMainTab === 'beds'
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    Wards & Beds
                </button>
            </div>

            {/* Services Tab Content */}
            {activeMainTab === 'services' && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <span className="text-slate-500 text-sm font-medium">Total Services</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{servicesData.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Tags size={20} />
                                </div>
                                <span className="text-slate-500 text-sm font-medium">Categories</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between bg-slate-50/50">
                            {/* Category Tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'All'
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    All Services
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:w-72 shrink-0">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or code..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Service Code</th>
                                        <th className="px-6 py-4">Service Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Department</th>
                                        <th className="px-6 py-4 text-right">Standard Price</th>
                                        <th className="px-6 py-4 text-right">Insurance Price</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredServices.length > 0 ? (
                                        filteredServices.map((service) => (
                                            <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{service.code || service.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800">{service.name}</div>
                                                    {service.description && (
                                                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{service.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        {service.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{service.department || '-'}</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-800">
                                                    {formatCurrency(service.price)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-600">
                                                    {service.insurancePrice ? formatCurrency(service.insurancePrice) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {service.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleOpenModal(service)}
                                                            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                            title="Edit Service"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(service.id)}
                                                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                                            title="Delete Service"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search size={32} className="text-slate-300" />
                                                    <p>No services found matching your criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add/Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {currentService ? 'Edit Service' : 'Add New Service'}
                                    </h2>
                                    <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Service Name */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Name <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="e.g., General Consultation"
                                            />
                                        </div>

                                        {/* Service Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Code</label>
                                            <input
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                                                placeholder="SRV-001"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-rose-500">*</span></label>
                                            <select
                                                name="category"
                                                required
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Department */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Standard Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Standard Price <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    required
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        {/* Insurance Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Price (Optional)</label>
                                            <div className="relative">
                                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    name="insurancePrice"
                                                    min="0"
                                                    value={formData.insurancePrice}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Leave blank to use standard price</p>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                                placeholder="Enter service details..."
                                            ></textarea>
                                        </div>

                                        {/* Test Parameters (Only for Laboratory) */}
                                        {formData.category === 'Laboratory' && (
                                            <div className="col-span-2 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-slate-700">Test Parameters</label>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddParameter}
                                                        className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1"
                                                    >
                                                        <Plus size={14} /> Add Parameter
                                                    </button>
                                                </div>

                                                {formData.parameters.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {formData.parameters.map((param, index) => (
                                                            <div key={index} className="flex gap-2 items-start">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Parameter Name"
                                                                    value={param.name}
                                                                    onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                                                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Unit"
                                                                    value={param.unit}
                                                                    onChange={(e) => handleParameterChange(index, 'unit', e.target.value)}
                                                                    className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ref. Range"
                                                                    value={param.range}
                                                                    onChange={(e) => handleParameterChange(index, 'range', e.target.value)}
                                                                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveParameter(index)}
                                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-sm bg-slate-50">
                                                        No parameters defined. Click "Add Parameter" to define test components.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            Save Service
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Beds & Wards Tab Content */}
            {activeMainTab === 'beds' && (
                <div className="space-y-6">
                    {/* Ward Management Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">Ward Management</h2>
                            <p className="text-sm text-slate-500">Configure wards and daily bed prices</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Ward Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Gender</th>
                                        <th className="px-6 py-4">Capacity</th>
                                        <th className="px-6 py-4 text-right">Daily Rate</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {wards.map((ward) => (
                                        <tr key={ward.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-800">{ward.name}</td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{ward.type}</span></td>
                                            <td className="px-6 py-4 text-slate-600">{ward.gender}</td>
                                            <td className="px-6 py-4 text-slate-600">{ward.capacity || beds.filter(b => b.wardId === ward.id).length} beds</td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-700">{formatCurrency(ward.basePrice)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenWardModal(ward)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="Edit Ward">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteWard(ward.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Delete Ward">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bed Management Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">Bed Management</h2>
                            <p className="text-sm text-slate-500">Manage individual beds in wards</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Bed Number</th>
                                        <th className="px-6 py-4">Ward</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {beds.map((bed) => {
                                        const ward = wards.find(w => w.id === bed.wardId);
                                        return (
                                            <tr key={bed.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-slate-800">{bed.number}</td>
                                                <td className="px-6 py-4 text-slate-600">{ward?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">{bed.type}</span></td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${bed.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                        bed.status === 'Occupied' ? 'bg-red-100 text-red-700' :
                                                            bed.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {bed.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenBedModal(bed)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="Edit Bed">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDeleteBed(bed.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Delete Bed">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Ward Modal */}
            {isWardModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{currentWard ? 'Edit Ward' : 'Add New Ward'}</h2>
                            <button onClick={() => setIsWardModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveWard} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ward Name <span className="text-rose-500">*</span></label>
                                <input type="text" required value={wardFormData.name} onChange={(e) => setWardFormData({ ...wardFormData, name: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., General Ward A" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type <span className="text-rose-500">*</span></label>
                                <input type="text" required value={wardFormData.type} onChange={(e) => setWardFormData({ ...wardFormData, type: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., General, ICU, Private" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select value={wardFormData.gender} onChange={(e) => setWardFormData({ ...wardFormData, gender: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="Male">Male Only</option>
                                    <option value="Female">Female Only</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Daily Rate <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" required min="0" value={wardFormData.basePrice} onChange={(e) => setWardFormData({ ...wardFormData, basePrice: e.target.value })} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="50000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (Optional)</label>
                                <input type="number" min="0" value={wardFormData.capacity} onChange={(e) => setWardFormData({ ...wardFormData, capacity: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="20" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsWardModalOpen(false)} className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">Save Ward</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bed Modal */}
            {isBedModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{currentBed ? 'Edit Bed' : 'Add New Bed'}</h2>
                            <button onClick={() => setIsBedModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveBed} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ward <span className="text-rose-500">*</span></label>
                                <select required value={bedFormData.wardId} onChange={(e) => setBedFormData({ ...bedFormData, wardId: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Choose a ward...</option>
                                    {wards.map(ward => (
                                        <option key={ward.id} value={ward.id}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bed Number <span className="text-rose-500">*</span></label>
                                <input type="text" required value={bedFormData.number} onChange={(e) => setBedFormData({ ...bedFormData, number: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., A-01, ICU-01" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bed Type</label>
                                <input type="text" value={bedFormData.type} onChange={(e) => setBedFormData({ ...bedFormData, type: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Standard, ICU, Private" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select value={bedFormData.status} onChange={(e) => setBedFormData({ ...bedFormData, status: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="Available">Available</option>
                                    <option value="Occupied">Occupied</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Reserved">Reserved</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsBedModalOpen(false)} className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">Save Bed</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesDashboard;
