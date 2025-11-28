import React, { useState, useMemo } from 'react';
import { CreditCard, CheckCircle, Clock, DollarSign, Printer, Filter, Wallet, Shield, Search, User } from 'lucide-react';
import { useWallet } from '../../../context/WalletContext';
import { useData } from '../../../context/DataContext';
import { useCurrency } from '../../../context/CurrencyContext';
import CardPaymentModal from '../../../components/CardPaymentModal';

const BillingManager = () => {
    const { financialRecords, updateBillStatus } = useData();
    const { getBalance, processWalletPayment } = useWallet();
    const { formatCurrency } = useCurrency();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [showCardModal, setShowCardModal] = useState(false);

    // Filter bills based on search and status
    const filteredBills = useMemo(() => {
        return financialRecords.filter(bill => {
            const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
            const matchesSearch = (bill.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.description?.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesStatus && matchesSearch;
        });
    }, [financialRecords, searchTerm, statusFilter]);

    const walletBalance = selectedBill ? getBalance(selectedBill.patientId) : 0;
    const canPayWithWallet = selectedBill && walletBalance >= selectedBill.amount;

    const handleProcessPayment = () => {
        if (selectedBill) {
            if (paymentMethod === 'wallet') {
                const result = processWalletPayment(
                    selectedBill.patientId,
                    selectedBill.amount,
                    selectedBill.id,
                    selectedBill.description
                );

                if (result.success) {
                    updateBillStatus(selectedBill.id, 'Paid');
                    alert(`Payment successful! New wallet balance: ${formatCurrency(result.transaction.balanceAfter)}`);
                    setSelectedBill(null);
                } else {
                    alert(result.message);
                }
            } else if (paymentMethod === 'card') {
                // Open card payment modal
                setShowCardModal(true);
                return; // Don't close the payment modal yet
            } else {
                // Process cash/insurance payment
                updateBillStatus(selectedBill.id, 'Paid');
                setSelectedBill(null);
                alert('Payment processed successfully!');
            }
        }
    };

    // Stats
    const totalPending = financialRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
    const totalCollectedToday = financialRecords
        .filter(r => r.status === 'Paid' && new Date(r.date).toDateString() === new Date().toDateString())
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Pending</p>
                        <p className="text-xl font-bold text-slate-800">{formatCurrency(totalPending)}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Collected Today</p>
                        <p className="text-xl font-bold text-slate-800">{formatCurrency(totalCollectedToday)}</p>
                    </div>
                </div>
            </div>

            {/* Bills List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Reception Billing</h3>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search Patient ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {filteredBills.length > 0 ? (
                        filteredBills.map((bill) => (
                            <div key={bill.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-800">{bill.patientId}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${bill.type === 'Consultation' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                bill.type === 'Pharmacy' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>{bill.type}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">{new Date(bill.date).toLocaleString()} • {bill.id}</p>
                                        <p className="text-sm text-slate-700 mt-1">{bill.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">{formatCurrency(bill.amount)}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {bill.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {bill.status === 'Pending' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedBill(bill);
                                                    setPaymentMethod('cash');
                                                }}
                                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark shadow-sm"
                                            >
                                                Pay
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <Printer size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <p>No billing records found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {selectedBill && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                            <h3 className="font-bold text-lg text-slate-800">Process Payment</h3>
                            <p className="text-sm text-slate-500">Patient ID: {selectedBill.patientId}</p>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-slate-500 mb-1">Total Amount Due</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(selectedBill.amount)}</p>
                            </div>

                            {/* Wallet Balance Display */}
                            <div className={`p-3 rounded-lg border-2 ${canPayWithWallet ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet size={18} className={canPayWithWallet ? 'text-emerald-600' : 'text-amber-600'} />
                                        <span className="text-sm font-medium text-slate-700">Wallet Balance</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{formatCurrency(walletBalance)}</span>
                                </div>
                                {!canPayWithWallet && walletBalance > 0 && (
                                    <p className="text-xs text-amber-600 mt-1">Insufficient balance. Need {formatCurrency(selectedBill.amount - walletBalance)} more.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`px-4 py-3 border-2 font-bold rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                    >
                                        <DollarSign size={20} />
                                        <span className="text-xs">Cash</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`px-4 py-3 border-2 font-bold rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                    >
                                        <CreditCard size={20} />
                                        <span className="text-xs">Card</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('wallet')}
                                        disabled={!canPayWithWallet}
                                        className={`px-4 py-3 border-2 font-bold rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'wallet'
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                            : canPayWithWallet
                                                ? 'border-slate-200 hover:border-emerald-300 text-slate-600'
                                                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <Wallet size={20} />
                                        <span className="text-xs">Wallet</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('insurance')}
                                        className={`px-4 py-3 border-2 font-bold rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'insurance' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-200 hover:border-purple-300 text-slate-600'}`}
                                    >
                                        <Shield size={20} />
                                        <span className="text-xs">Insurance</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                            <button onClick={() => setSelectedBill(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                            <button
                                onClick={handleProcessPayment}
                                className={`px-6 py-2 text-white rounded-lg font-medium shadow-lg ${paymentMethod === 'wallet'
                                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                                    : paymentMethod === 'insurance'
                                        ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/30'
                                        : 'bg-primary hover:bg-primary-dark shadow-primary/30'
                                    }`}
                            >
                                {paymentMethod === 'wallet' ? 'Pay with Wallet' : paymentMethod === 'insurance' ? 'Submit Claim' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card Payment Modal */}
            {showCardModal && selectedBill && (
                <CardPaymentModal
                    amount={selectedBill.amount}
                    currency="UGX"
                    patientInfo={{
                        id: selectedBill.patientId,
                        name: selectedBill.patientName || selectedBill.patientId
                    }}
                    onClose={() => {
                        setShowCardModal(false);
                        setSelectedBill(null);
                        setPaymentMethod('cash');
                    }}
                    onSuccess={(paymentResult) => {
                        // Update bill with card payment details
                        updateBillStatus(selectedBill.id, 'Paid', {
                            paymentMethod: 'Card',
                            cardType: paymentResult.cardType,
                            last4: paymentResult.last4,
                            transactionId: paymentResult.transactionId,
                            authorizationCode: paymentResult.authorizationCode,
                            gateway: paymentResult.gateway
                        });

                        setShowCardModal(false);
                        setSelectedBill(null);
                        setPaymentMethod('cash');

                        alert(`Card payment successful!\nTransaction ID: ${paymentResult.transactionId}\nCard: ${paymentResult.cardType.toUpperCase()} •••• ${paymentResult.last4}`);
                    }}
                />
            )}
        </div>
    );
};

export default BillingManager;
