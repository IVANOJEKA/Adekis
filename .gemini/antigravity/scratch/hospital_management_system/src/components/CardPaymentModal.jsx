import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {
    processCardPayment,
    detectCardType,
    formatCardNumber,
    validateCardNumber,
    validateExpiry,
    validateCVV
} from '../services/paymentGateway';

const CardPaymentModal = ({ amount, currency = 'UGX', onClose, onSuccess, patientInfo = {} }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [cardType, setCardType] = useState('unknown');

    const formatCurrency = (amt) => `${currency} ${amt.toLocaleString()}`;

    // Handle card number input with formatting
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (!/^\d*$/.test(value)) return;
        if (value.length > 16) return;

        const formatted = formatCardNumber(value);
        setFormData({ ...formData, cardNumber: formatted });
        setCardType(detectCardType(value));

        if (errors.cardNumber) {
            setErrors({ ...errors, cardNumber: null });
        }
    };

    // Handle expiry input
    const handleExpiryChange = (e, field) => {
        const value = e.target.value.replace(/\D/g, '');

        if (field === 'month') {
            if (value.length > 2) return;
            if (value.length === 2 && parseInt(value) > 12) return;
            setFormData({ ...formData, expiryMonth: value });
        } else {
            if (value.length > 2) return;
            setFormData({ ...formData, expiryYear: value });
        }

        if (errors.expiry) {
            setErrors({ ...errors, expiry: null });
        }
    };

    // Handle CVV input
    const handleCVVChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const maxLength = cardType === 'amex' ? 4 : 3;
        if (value.length > maxLength) return;

        setFormData({ ...formData, cvv: value });
        if (errors.cvv) {
            setErrors({ ...errors, cvv: null });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Invalid card number';
        }

        if (!formData.cardholderName.trim()) {
            newErrors.cardholderName = 'Cardholder name is required';
        }

        if (!validateExpiry(formData.expiryMonth, formData.expiryYear)) {
            newErrors.expiry = 'Invalid or expired date';
        }

        if (!validateCVV(formData.cvv, cardType)) {
            newErrors.cvv = 'Invalid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle payment submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setProcessing(true);
        setPaymentResult(null);

        try {
            const result = await processCardPayment({
                cardNumber: formData.cardNumber,
                cardholderName: formData.cardholderName,
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
                cvv: formData.cvv,
                amount,
                currency,
                description: `Payment for ${patientInfo.name || 'Patient'}`,
                metadata: {
                    patientId: patientInfo.id,
                    patientName: patientInfo.name
                }
            });

            setPaymentResult(result);

            if (result.success) {
                // Wait 2 seconds to show success message, then callback
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess({
                            ...result,
                            paymentMethod: 'Card',
                            cardType: result.cardType,
                            last4: result.last4
                        });
                    }
                }, 2000);
            }
        } catch (error) {
            setPaymentResult({
                success: false,
                error: 'Payment processing failed. Please try again.',
                code: 'PROCESSING_ERROR'
            });
        } finally {
            setProcessing(false);
        }
    };

    // Get card type icon
    const getCardIcon = () => {
        const iconClass = "h-8 w-auto";
        switch (cardType) {
            case 'visa':
                return <div className={`${iconClass} bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold`}>VISA</div>;
            case 'mastercard':
                return <div className={`${iconClass} bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1`}>
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <div className="w-4 h-4 rounded-full bg-orange-400 -ml-2"></div>
                </div>;
            case 'amex':
                return <div className={`${iconClass} bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold`}>AMEX</div>;
            default:
                return <CreditCard size={24} className="text-slate-400" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Lock size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Secure Card Payment</h3>
                            <p className="text-xs text-blue-100">SSL Encrypted</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        disabled={processing}
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Amount Display */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <p className="text-sm text-slate-600">Amount to Pay</p>
                    <p className="text-3xl font-bold text-slate-800">{formatCurrency(amount)}</p>
                </div>

                {/* Payment Result */}
                {paymentResult && (
                    <div className={`mx-6 mt-6 p-4 rounded-xl border-2 ${paymentResult.success
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            {paymentResult.success ? (
                                <CheckCircle size={24} className="text-emerald-600" />
                            ) : (
                                <AlertCircle size={24} className="text-red-600" />
                            )}
                            <div>
                                <p className={`font-bold ${paymentResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
                                </p>
                                {paymentResult.success ? (
                                    <p className="text-sm text-emerald-600">
                                        Transaction ID: {paymentResult.transactionId}
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-600">{paymentResult.error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                {!paymentResult?.success && (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                                <span>Card Number</span>
                                {getCardIcon()}
                            </label>
                            <input
                                type="text"
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-lg ${errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                    }`}
                                disabled={processing}
                            />
                            {errors.cardNumber && (
                                <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">Test: 4242 4242 4242 4242 (Success) or 4000 0000 0000 0002 (Declined)</p>
                        </div>

                        {/* Cardholder Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                value={formData.cardholderName}
                                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value.toUpperCase() })}
                                placeholder="JOHN DOE"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase ${errors.cardholderName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                    }`}
                                disabled={processing}
                            />
                            {errors.cardholderName && (
                                <p className="text-xs text-red-600 mt-1">{errors.cardholderName}</p>
                            )}
                        </div>

                        {/* Expiry & CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.expiryMonth}
                                        onChange={(e) => handleExpiryChange(e, 'month')}
                                        placeholder="MM"
                                        className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono ${errors.expiry ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                            }`}
                                        disabled={processing}
                                        maxLength={2}
                                    />
                                    <span className="text-slate-400 text-xl">/</span>
                                    <input
                                        type="text"
                                        value={formData.expiryYear}
                                        onChange={(e) => handleExpiryChange(e, 'year')}
                                        placeholder="YY"
                                        className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono ${errors.expiry ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                            }`}
                                        disabled={processing}
                                        maxLength={2}
                                    />
                                </div>
                                {errors.expiry && (
                                    <p className="text-xs text-red-600 mt-1">{errors.expiry}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                <input
                                    type="password"
                                    value={formData.cvv}
                                    onChange={handleCVVChange}
                                    placeholder="123"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono text-lg ${errors.cvv ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                        }`}
                                    disabled={processing}
                                    maxLength={cardType === 'amex' ? 4 : 3}
                                />
                                {errors.cvv && (
                                    <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>
                                )}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                            <Lock size={16} className="text-blue-600 mt-0.5" />
                            <p className="text-xs text-blue-700">
                                Your payment is secure and encrypted. We never store your card details.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        Pay {formatCurrency(amount)}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CardPaymentModal;
