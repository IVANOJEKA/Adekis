import React from 'react';
import { X, Printer, Download, CheckCircle } from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';

const ReceiptModal = ({ receipt, onClose }) => {
    const { formatCurrency } = useCurrency();

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Create a simple receipt text file
        const receiptText = `
========================================
${receipt.hospitalName}
${receipt.hospitalAddress}
${receipt.hospitalPhone}
========================================

CONSULTATION FEE RECEIPT
Receipt No: ${receipt.id}

Date: ${new Date(receipt.date).toLocaleString()}
Patient ID: ${receipt.patientId}
Patient Name: ${receipt.patientName}
Patient Type: ${receipt.patientType}

----------------------------------------
Payment Details
----------------------------------------
Consultation Fee: ${formatCurrency(receipt.amount)}
Payment Method: ${receipt.paymentMethod}
Status: PAID

----------------------------------------
Issued By: ${receipt.issuedBy}

Thank you for choosing ${receipt.hospitalName}
========================================
        `;

        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${receipt.id}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header - Hidden when printing */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl">Payment Successful!</h2>
                            <p className="text-emerald-50 text-sm">Receipt generated</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Receipt Content - Printable */}
                <div className="flex-1 overflow-y-auto p-8 print:p-0">
                    <div className="max-w-xl mx-auto">
                        {/* Hospital Header */}
                        <div className="text-center border-b-2 border-slate-200 pb-4 mb-6">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{receipt.hospitalName}</h1>
                            <p className="text-slate-600">{receipt.hospitalAddress}</p>
                            <p className="text-slate-600">{receipt.hospitalPhone}</p>
                        </div>

                        {/* Receipt Title */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Consultation Fee Receipt</h2>
                            <p className="text-sm text-slate-500">
                                Receipt No: <span className="font-bold text-slate-800">{receipt.id}</span>
                            </p>
                            <p className="text-sm text-slate-500">
                                Date: <span className="font-bold text-slate-800">{new Date(receipt.date).toLocaleString()}</span>
                            </p>
                        </div>

                        {/* Patient & Payment Details */}
                        <div className="bg-slate-50 rounded-lg p-6 mb-6 space-y-3">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Patient ID:</span>
                                <span className="font-bold text-slate-800">{receipt.patientId}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Patient Name:</span>
                                <span className="font-bold text-slate-800">{receipt.patientName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Patient Type:</span>
                                <span className="px-2 py-1 bg-primary text-white text-sm font-bold rounded">
                                    {receipt.patientType}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Payment Method:</span>
                                <span className="font-bold text-slate-800">{receipt.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Amount Paid</p>
                                    <p className="text-4xl font-bold text-emerald-700">{formatCurrency(receipt.amount)}</p>
                                </div>
                                <div className="text-right">
                                    <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">
                                        ✓ PAID
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">Consultation Fee - {receipt.patientType}</p>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-slate-200 pt-4 text-center text-sm text-slate-500">
                            <p className="mb-1">Thank you for choosing {receipt.hospitalName}</p>
                            <p className="mb-1">This is an official receipt for your consultation fee payment</p>
                            <p className="font-semibold mt-3">Issued by: {receipt.issuedBy}</p>
                            <p className="text-xs mt-4 text-slate-400">
                                This receipt has been archived in your Electronic Medical Record
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Hidden when printing */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 print:hidden bg-slate-50">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg transition-all"
                    >
                        <Printer size={20} />
                        Print Receipt
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 font-medium transition-all"
                    >
                        <Download size={20} />
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .fixed.inset-0 * {
                        visibility: visible;
                    }
                    .fixed.inset-0 {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        background: white;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReceiptModal;
