import React, { useState } from 'react';
import { X, User, FileText, Clock, AlertTriangle } from 'lucide-react';

const NewTestOrderModal = ({ onClose, onSubmit, patients = [], testCatalog = [], formatCurrency, initialPatient = null }) => {
    const [formData, setFormData] = useState({
        patientId: initialPatient?.id || initialPatient?.patientId || '',
        patientName: initialPatient?.name || initialPatient?.patientName || '',
        orderType: initialPatient ? (initialPatient.patientCategory === 'Walk-in' ? 'Walk-in' : 'Doctor') : 'Doctor',
        requestedBy: '',
        testType: '',
        priority: 'Routine',
        notes: '',
        amount: 0
    });

    const handlePatientSelect = (e) => {
        const patientId = e.target.value;
        const patient = patients.find(p => p.id === patientId);

        setFormData({
            ...formData,
            patientId: patientId,
            patientName: patient ? patient.name : ''
        });
    };

    const handleTestSelect = (e) => {
        const testName = e.target.value;
        const test = testCatalog.find(t => t.name === testName);

        setFormData({
            ...formData,
            testType: testName,
            amount: test ? test.price : 0
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.patientId || !formData.testType || !formData.requestedBy) {
            alert('Please fill all required fields');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText size={24} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">New Laboratory Test Order</h3>
                            <p className="text-sm text-slate-500">Create a new lab test request</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Order Type */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Order Type *</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, orderType: 'Doctor' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.orderType === 'Doctor'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-bold">🩺 Doctor Order</div>
                                <div className="text-xs mt-1">Ordered by physician</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, orderType: 'Walk-in' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.orderType === 'Walk-in'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-bold">🚶 Walk-in</div>
                                <div className="text-xs mt-1">Direct patient request</div>
                            </button>
                        </div>
                    </div>

                    {/* Patient Selection */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">
                            <User size={16} className="inline mr-1" />
                            Select Patient *
                        </label>
                        <select
                            value={formData.patientId}
                            onChange={handlePatientSelect}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name} ({patient.id}) - {patient.age}Y/{patient.gender}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Test Selection */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">
                            <FileText size={16} className="inline mr-1" />
                            Select Test *
                        </label>
                        <select
                            value={formData.testType}
                            onChange={handleTestSelect}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        >
                            <option value="">-- Select Test --</option>
                            {testCatalog.map((test, index) => (
                                <option key={index} value={test.name}>
                                    {test.name} - {formatCurrency ? formatCurrency(test.price) : test.price}
                                </option>
                            ))}
                        </select>
                        {formData.amount > 0 && (
                            <p className="text-sm text-slate-500 mt-2">
                                Test Cost: <span className="font-bold text-primary">{formatCurrency ? formatCurrency(formData.amount) : formData.amount}</span>
                            </p>
                        )}
                    </div>

                    {/* Requested By */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">
                            {formData.orderType === 'Doctor' ? 'Ordering Doctor *' : 'Requested By *'}
                        </label>
                        {formData.orderType === 'Doctor' ? (
                            <select
                                value={formData.requestedBy}
                                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                required
                            >
                                <option value="">-- Select Doctor --</option>
                                <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                                <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                                <option value="Dr. James Anderson">Dr. James Anderson</option>
                                <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={formData.requestedBy}
                                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                                placeholder="Reception Desk / Patient Name"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                required
                            />
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">
                            <Clock size={16} className="inline mr-1" />
                            Priority *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, priority: 'Routine' })}
                                className={`p-3 border-2 rounded-lg transition-all ${formData.priority === 'Routine'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-bold">Routine</div>
                                <div className="text-xs mt-1">Standard processing</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, priority: 'Urgent' })}
                                className={`p-3 border-2 rounded-lg transition-all ${formData.priority === 'Urgent'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-bold flex items-center justify-center gap-1">
                                    <AlertTriangle size={16} />
                                    Urgent
                                </div>
                                <div className="text-xs mt-1">Priority processing</div>
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Clinical Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Enter any clinical notes, symptoms, or special instructions..."
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            rows="3"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                        * Required fields
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors shadow-lg shadow-primary/30"
                        >
                            Create Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTestOrderModal;
