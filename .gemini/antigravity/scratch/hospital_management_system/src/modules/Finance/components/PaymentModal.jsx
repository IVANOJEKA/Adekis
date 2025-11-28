import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Building, Check, X, DollarSign } from 'lucide-react';

const PaymentModal = ({ record, patient, onClose, onProcess, formatCurrency }) => {
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amount, setAmount] = useState(record?.amount || 0);
    const [reference, setReference] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onProcess({
            method: paymentMethod,
            amount,
            reference,
            processedAt: new Date().toISOString()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Process Payment</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Patient Info */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-600">Patient</p>
                        <p className="font-bold text-slate-900">{patient?.name}</p>
                        <p className="text-sm text-slate-600 mt-1">Invoice: {record?.id}</p>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'Cash', icon: Wallet },
                                { value: 'Mobile Money', icon: Smartphone },
                                { value: 'Card', icon: CreditCard },
                                { value: 'Insurance', icon: Building }
                            ].map(({ value, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setPaymentMethod(value)}
                                    className={`p-3 border-2 rounded-lg flex items-center gap-2 transition-all ${paymentMethod === value
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{value}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reference Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reference Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Transaction reference..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors shadow-lg"
                        >
                            <Check size={18} className="inline mr-2" />
                            Process Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
