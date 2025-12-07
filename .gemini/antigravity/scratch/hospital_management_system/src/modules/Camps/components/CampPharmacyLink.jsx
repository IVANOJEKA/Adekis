import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Pill, FileText } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const CampPharmacyLink = ({ campId, patientId, patientName, prescription, onClose, onSent }) => {
    const { inventory } = useData(); // Access pharmacy inventory
    const [selectedMedicines, setSelectedMedicines] = useState(
        prescription?.medicines || []
    );
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [stockStatus, setStockStatus] = useState({});

    // Check stock availability for each medicine
    React.useEffect(() => {
        const checkStock = () => {
            const status = {};
            selectedMedicines.forEach(med => {
                const inventoryItem = inventory.find(item =>
                    item.name.toLowerCase().includes(med.name.toLowerCase())
                );
                if (inventoryItem) {
                    status[med.name] = {
                        available: inventoryItem.quantity >= (med.quantity || 1),
                        currentStock: inventoryItem.quantity,
                        price: inventoryItem.unitPrice || 0
                    };
                } else {
                    status[med.name] = {
                        available: false,
                        currentStock: 0,
                        price: 0
                    };
                }
            });
            setStockStatus(status);
        };
        checkStock();
    }, [selectedMedicines, inventory]);

    const handleSendToPharmacy = () => {
        const prescriptionData = {
            id: `PRESC-${Date.now()}`,
            campId,
            patientId,
            patientName,
            medicines: selectedMedicines.map(med => ({
                ...med,
                ...stockStatus[med.name]
            })),
            notes,
            priority,
            status: 'Pending',
            sentAt: new Date().toISOString(),
            dispensed: false
        };

        // This would send to pharmacy module
        console.log('Sending prescription to pharmacy:', prescriptionData);

        if (onSent) {
            onSent(prescriptionData);
        }

        alert('Prescription sent to pharmacy successfully!');
        onClose();
    };

    const totalCost = selectedMedicines.reduce((sum, med) => {
        const stock = stockStatus[med.name];
        return sum + (stock?.price * (med.quantity || 1) || 0);
    }, 0);

    const allAvailable = selectedMedicines.every(med => stockStatus[med.name]?.available);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Pill className="text-blue-600" size={28} />
                            Send to Pharmacy
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Patient: <span className="font-semibold">{patientName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Prescription Items */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Prescription Items
                    </h3>

                    <div className="space-y-3">
                        {selectedMedicines.map((med, index) => {
                            const stock = stockStatus[med.name] || {};
                            return (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border-2 ${stock.available
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800">{med.name}</h4>
                                            <p className="text-sm text-slate-600">
                                                {med.dosage} • {med.frequency} • {med.duration}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Quantity: {med.quantity || 1} {med.unit || 'units'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {stock.available ? (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle size={20} />
                                                    <span className="font-medium">In Stock</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <AlertCircle size={20} />
                                                    <span className="font-medium">Out of Stock</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-slate-600 mt-1">
                                                Available: {stock.currentStock || 0}
                                            </p>
                                            {stock.price > 0 && (
                                                <p className="text-sm font-semibold text-slate-800 mt-2">
                                                    UGX {(stock.price * (med.quantity || 1)).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {med.notes && (
                                        <p className="text-sm text-slate-600 italic mt-2 pt-2 border-t border-slate-200">
                                            Note: {med.notes}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Cost */}
                    {totalCost > 0 && (
                        <div className="mt-6 pt-4 border-t-2 border-slate-300 flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-800">Estimated Total Cost:</span>
                            <span className="text-2xl font-bold text-primary">UGX {totalCost.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Priority & Notes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Additional Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Priority Level
                            </label>
                            <div className="flex gap-3">
                                {['Normal', 'Urgent', 'Emergency'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setPriority(level)}
                                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${priority === level
                                                ? level === 'Emergency'
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : level === 'Urgent'
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Notes for Pharmacist
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Any special instructions or patient considerations..."
                            />
                        </div>
                    </div>
                </div>

                {/* Warnings */}
                {!allAvailable && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-600 mt-0.5" size={24} />
                            <div>
                                <h4 className="font-bold text-amber-900">Stock Warning</h4>
                                <p className="text-sm text-amber-800 mt-1">
                                    Some medicines are out of stock. The pharmacist will need to arrange alternatives or restock.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-white p-6 border-t border-slate-200 flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="btn bg-slate-200 hover:bg-slate-300 text-slate-700"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSendToPharmacy}
                    disabled={selectedMedicines.length === 0}
                    className="btn bg-primary hover:bg-primary-dark text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                    Send to Pharmacy
                </button>
            </div>
        </div>
    );
};

export default CampPharmacyLink;
