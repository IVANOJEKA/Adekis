import React, { useState, useMemo } from 'react';
import { X, Plus, Trash2, Search, DollarSign, Receipt, CreditCard, Smartphone, Building2, User } from 'lucide-react';

const ManualBillingModal = ({ patients, onClose, onCreate, formatCurrency }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [billDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [lineItems, setLineItems] = useState([
        { id: Date.now(), type: 'Consultation', description: '', quantity: 1, unitPrice: 0 }
    ]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');

    const serviceTypes = [
        'Consultation',
        'Lab Test',
        'Radiology',
        'Pharmacy',
        'Procedure',
        'Surgery',
        'Bed Charges',
        'Emergency',
        'Physiotherapy',
        'Other'
    ];

    const paymentMethods = [
        { value: 'Cash', icon: DollarSign, label: 'Cash' },
        { value: 'Card', icon: CreditCard, label: 'Credit/Debit Card' },
        { value: 'Mobile Money', icon: Smartphone, label: 'Mobile Money' },
        { value: 'Insurance', icon: Building2, label: 'Insurance' },
        { value: 'Bank Transfer', icon: Building2, label: 'Bank Transfer' }
    ];

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients.slice(0, 10);
        return patients.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone?.includes(searchTerm)
        ).slice(0, 10);
    }, [patients, searchTerm]);

    const addLineItem = () => {
        setLineItems([...lineItems, {
            id: Date.now(),
            type: 'Consultation',
            description: '',
            quantity: 1,
            unitPrice: 0
        }]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter(item => item.id !== id));
        }
    };

    const updateLineItem = (id, field, value) => {
        setLineItems(lineItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculations = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) =>
            sum + (item.quantity * item.unitPrice), 0
        );
        const discountAmount = (subtotal * discount) / 100;
        const total = subtotal - discountAmount;
        return { subtotal, discountAmount, total };
    }, [lineItems, discount]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }

        if (lineItems.some(item => !item.description || item.unitPrice <= 0)) {
            alert('Please fill in all line item details');
            return;
        }

        const billData = {
            patientId: selectedPatient.id,
            patientName: selectedPatient.name,
            date: billDate,
            type: lineItems.length === 1 ? lineItems[0].type : 'Multiple Services',
            amount: calculations.total,
            subtotal: calculations.subtotal,
            discount: calculations.discountAmount,
            status: paymentStatus,
            paymentMethod: paymentStatus === 'Paid' ? paymentMethod : null,
            paidDate: paymentStatus === 'Paid' ? new Date().toISOString() : null,
            lineItems: lineItems.map(item => ({
                type: item.type,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice
            })),
            notes,
            source: 'Manual Entry',
            createdAt: new Date().toISOString()
        };

        onCreate(billData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Receipt size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Create Manual Bill</h2>
                            <p className="text-blue-100 text-sm">Fallback billing when automatic system fails</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Patient Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Select Patient <span className="text-red-500">*</span>
                            </label>
                            {!selectedPatient ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by name, ID, or phone..."
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                                        {filteredPatients.map(patient => (
                                            <button
                                                key={patient.id}
                                                type="button"
                                                onClick={() => setSelectedPatient(patient)}
                                                className="w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-100 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <User size={16} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{patient.name}</p>
                                                        <p className="text-xs text-slate-500">{patient.id} • {patient.phone || 'No phone'}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <User size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{selectedPatient.name}</p>
                                            <p className="text-sm text-slate-600">{selectedPatient.id} • {selectedPatient.phone || 'No phone'}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPatient(null)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Line Items */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-bold text-slate-700">
                                    Bill Items <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addLineItem}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>
                            <div className="space-y-3">
                                {lineItems.map((item, index) => (
                                    <div key={item.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-600">Item {index + 1}</span>
                                            {lineItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLineItem(item.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                value={item.type}
                                                onChange={(e) => updateLineItem(item.id, 'type', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                {serviceTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                placeholder="Qty"
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                            placeholder="Description (e.g., General Consultation with Dr. Smith)"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                placeholder="Unit Price (UGX)"
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                            <div className="flex items-center px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg">
                                                <span className="text-sm font-bold text-slate-700">
                                                    {formatCurrency(item.quantity * item.unitPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discount & Totals */}
                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex justify-end">
                                <div className="w-full max-w-md space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Subtotal:</span>
                                        <span className="font-medium text-slate-800">{formatCurrency(calculations.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-slate-600">Discount (%):</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={discount}
                                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                            className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-right"
                                        />
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-red-600">
                                            <span>Discount Amount:</span>
                                            <span className="font-medium">-{formatCurrency(calculations.discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                                        <span className="text-lg font-bold text-slate-800">Total Amount:</span>
                                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(calculations.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partially Paid">Partially Paid</option>
                                </select>
                            </div>
                            {paymentStatus === 'Paid' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {paymentMethods.map(method => (
                                            <option key={method.value} value={method.value}>{method.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes or remarks..."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                        >
                            Create Bill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualBillingModal;
