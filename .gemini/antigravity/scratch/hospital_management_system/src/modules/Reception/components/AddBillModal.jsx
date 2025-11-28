import React, { useState } from 'react';
import { X, DollarSign, FileText, Tag, Search } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const AddBillModal = ({ patient, onClose, onBillAdded }) => {
    const { addBill, servicesData } = useData();
    const [formData, setFormData] = useState({
        serviceId: '',
        amount: '',
        description: '',
        type: 'Consultation' // Default type
    });

    const [customService, setCustomService] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter services based on search term
    const filteredServices = servicesData.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        if (serviceId === 'custom') {
            setCustomService(true);
            setFormData({ ...formData, serviceId: 'custom', amount: '', description: '' });
        } else {
            setCustomService(false);
            const service = servicesData.find(s => s.id === serviceId);
            if (service) {
                setFormData({
                    ...formData,
                    serviceId: service.id,
                    amount: service.price,
                    description: service.name,
                    type: service.category
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const billData = {
            patientId: patient.id,
            patientName: patient.name,
            amount: parseFloat(formData.amount),
            type: formData.type,
            description: formData.description,
            status: 'Pending',
            date: new Date().toISOString()
        };

        const newBill = addBill(billData);
        if (onBillAdded) {
            onBillAdded(newBill);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Add New Bill</h3>
                        <p className="text-sm text-slate-500">Patient: {patient.name} ({patient.id})</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Service / Item</label>

                        {/* Search Input */}
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white"
                                required
                            >
                                <option value="">Select a service...</option>
                                {filteredServices.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {service.price.toLocaleString()} UGX
                                    </option>
                                ))}
                                <option value="custom">Other / Custom Charge</option>
                            </select>
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    {customService && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Enter charge description"
                                    required
                                />
                                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (UGX)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-800"
                                placeholder="0.00"
                                min="0"
                                step="100"
                                required
                            />
                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                        >
                            <option value="Consultation">Consultation</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Radiology">Radiology</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Procedure">Procedure</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                        >
                            Add Charge
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBillModal;
