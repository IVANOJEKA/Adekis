import React, { useState } from 'react';
import { X, Plus, DollarSign, Receipt, CreditCard, Smartphone, CheckCircle, AlertCircle, Printer } from 'lucide-react';

const CampBilling = ({ campId, patientId, patientName, onClose, onPaymentComplete }) => {
    const [billItems, setBillItems] = useState([
        { id: 1, service: 'Consultation', amount: 5000, editable: false }
    ]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [insuranceDetails, setInsuranceDetails] = useState({ provider: '', policyNo: '', coverage: 0 });
    const [showReceipt, setShowReceipt] = useState(false);

    const serviceOptions = [
        { name: 'Consultation', price: 5000 },
        { name: 'Lab Test - Blood', price: 15000 },
        { name: 'Lab Test - Urine', price: 8000 },
        { name: 'X-Ray', price: 25000 },
        { name: 'ECG', price: 20000 },
        { name: 'Dressing', price: 3000 },
        { name: 'Injection', price: 2000 },
        { name: 'Medicine', price: 0 } // Will be filled from prescription
    ];

    const addBillItem = () => {
        setBillItems([...billItems, { id: Date.now(), service: '', amount: 0, editable: true }]);
    };

    const updateBillItem = (id, field, value) => {
        setBillItems(billItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeBillItem = (id) => {
        setBillItems(billItems.filter(item => item.id !== id));
    };

    const totalAmount = billItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const insuranceCoverage = paymentMethod === 'Insurance' ? insuranceDetails.coverage : 0;
    const patientPayable = totalAmount - insuranceCoverage;
    const balance = patientPayable - paidAmount;

    const handlePayment = () => {
        const paymentRecord = {
            id: `BILL-${Date.now()}`,
            campId,
            patientId,
            patientName,
            invoiceNumber: `INV-CAMP-${campId}-${Date.now()}`.substring(0, 20),
            items: billItems,
            totalAmount,
            insuranceCoverage,
            patientPayable,
            paidAmount,
            balance,
            paymentMethod,
            paymentStatus: balance === 0 ? 'Paid' : 'Partial',
            receiptNumber: `RCP-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        };

        if (balance > 0 && paymentMethod !== 'Insurance') {
            alert(`Warning: Balance of UGX ${balance.toLocaleString()} remaining`);
        }

        setShowReceipt(true);
        if (onPaymentComplete) {
            onPaymentComplete(paymentRecord);
        }
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign className="text-emerald-600" size={28} />
                        Billing & Payment
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Patient: <span className="font-semibold">{patientName}</span></p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={24} className="text-slate-500" />
                </button>
            </div>

            {!showReceipt ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Bill Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Bill Items</h3>
                            <button
                                onClick={addBillItem}
                                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white gap-2"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {billItems.map((item) => (
                                <div key={item.id} className="flex gap-3 items-center p-3 bg-slate-50 rounded-lg">
                                    {item.editable ? (
                                        <>
                                            <select
                                                value={item.service}
                                                onChange={(e) => {
                                                    const service = serviceOptions.find(s => s.name === e.target.value);
                                                    updateBillItem(item.id, 'service', e.target.value);
                                                    if (service) updateBillItem(item.id, 'amount', service.price);
                                                }}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                                            >
                                                <option value="">Select Service</option>
                                                {serviceOptions.map(opt => (
                                                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => updateBillItem(item.id, 'amount', e.target.value)}
                                                className="w-32 px-3 py-2 border border-slate-300 rounded-lg"
                                                placeholder="Amount"
                                            />
                                            <button
                                                onClick={() => removeBillItem(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 font-medium text-slate-700">{item.service}</span>
                                            <span className="w-32 font-bold text-slate-800">UGX {item.amount.toLocaleString()}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                            <div className="flex justify-between text-lg">
                                <span className="font-medium text-slate-600">Subtotal:</span>
                                <span className="font-bold text-slate-800">UGX {totalAmount.toLocaleString()}</span>
                            </div>
                            {paymentMethod === 'Insurance' && (
                                <div className="flex justify-between text-emerald-600">
                                    <span className="font-medium">Insurance Coverage:</span>
                                    <span className="font-bold">- UGX {insuranceCoverage.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl pt-2 border-t border-slate-300">
                                <span className="font-bold text-slate-800">Patient Payable:</span>
                                <span className="font-bold text-primary">UGX {patientPayable.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {['Cash', 'Mobile Money', 'Insurance'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === method
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {method === 'Cash' && <DollarSign size={24} className="mx-auto mb-2" />}
                                    {method === 'Mobile Money' && <Smartphone size={24} className="mx-auto mb-2" />}
                                    {method === 'Insurance' && <CreditCard size={24} className="mx-auto mb-2" />}
                                    <div className="font-medium text-sm">{method}</div>
                                </button>
                            ))}
                        </div>

                        {paymentMethod === 'Insurance' && (
                            <div className="grid grid-cols-2 gap-3 mt-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                                    <input
                                        type="text"
                                        value={insuranceDetails.provider}
                                        onChange={(e) => setInsuranceDetails({ ...insuranceDetails, provider: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        placeholder="e.g. AAR"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Policy Number</label>
                                    <input
                                        type="text"
                                        value={insuranceDetails.policyNo}
                                        onChange={(e) => setInsuranceDetails({ ...insuranceDetails, policyNo: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        placeholder="e.g. POL-12345"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Coverage Amount</label>
                                    <input
                                        type="number"
                                        value={insuranceDetails.coverage}
                                        onChange={(e) => setInsuranceDetails({ ...insuranceDetails, coverage: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        placeholder="Coverage amount"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount Paid</label>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-lg font-semibold"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        {balance !== 0 && (
                            <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${balance > 0 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'
                                }`}>
                                {balance > 0 ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                <div>
                                    <div className="font-bold">
                                        {balance > 0 ? `Balance: UGX ${balance.toLocaleString()}` : `Overpayment: UGX ${Math.abs(balance).toLocaleString()}`}
                                    </div>
                                    <div className="text-sm">
                                        {balance > 0 ? 'Payment incomplete' : 'Change to return'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Receipt View */
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-2xl mx-auto">
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                            <h1 className="text-3xl font-bold text-slate-800">Payment Receipt</h1>
                            <p className="text-sm text-slate-500 mt-2">Health Camp Medical Services</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-slate-500">Receipt No:</p>
                                <p className="font-bold">RCP-{Date.now()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500">Date:</p>
                                <p className="font-bold">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Patient:</p>
                                <p className="font-bold">{patientName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500">Payment Method:</p>
                                <p className="font-bold">{paymentMethod}</p>
                            </div>
                        </div>

                        <table className="w-full mb-6">
                            <thead className="border-b-2 border-slate-300">
                                <tr className="text-left">
                                    <th className="pb-2">Service</th>
                                    <th className="pb-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billItems.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="py-2">{item.service}</td>
                                        <td className="py-2 text-right">UGX {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-slate-800">
                                <tr>
                                    <td className="pt-3 font-bold text-lg">Total</td>
                                    <td className="pt-3 text-right font-bold text-lg">UGX {totalAmount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="text-emerald-600">Paid</td>
                                    <td className="text-right text-emerald-600">UGX {paidAmount.toLocaleString()}</td>
                                </tr>
                                {balance !== 0 && (
                                    <tr className={balance > 0 ? 'text-red-600' : 'text-blue-600'}>
                                        <td>{balance > 0 ? 'Balance' : 'Change'}</td>
                                        <td className="text-right font-bold">UGX {Math.abs(balance).toLocaleString()}</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>

                        <div className="text-center text-slate-500 text-sm border-t pt-4">
                            <p>Thank you for your visit!</p>
                            <p className="mt-1">Keep this receipt for your records</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="bg-white p-6 border-t border-slate-200 flex gap-3 justify-end">
                {!showReceipt ? (
                    <>
                        <button onClick={onClose} className="btn bg-slate-200 hover:bg-slate-300 text-slate-700">
                            Cancel
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={billItems.length === 0 || paidAmount === 0}
                            className="btn bg-primary hover:bg-primary-dark text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Receipt size={20} />
                            {balance > 0 ? 'Record Partial Payment' : 'Complete Payment'}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={printReceipt} className="btn bg-blue-500 hover:bg-blue-600 text-white gap-2">
                            <Printer size={20} />
                            Print Receipt
                        </button>
                        <button onClick={onClose} className="btn bg-primary hover:bg-primary-dark text-white">
                            Close
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CampBilling;
