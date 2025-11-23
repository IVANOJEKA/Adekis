import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        // Patient Basic Info
        patientName: '',
        age: '',
        phoneNumber: '',
        // Emergency Contact
        emergencyContactName: '',
        emergencyContactRelation: '',
        emergencyContactPhone: '',
        // Pregnancy Details
        lmp: '',
        gravida: 1,
        para: 0,
        abortions: 0,
        // Medical Info
        bloodGroup: '',
        rhFactor: 'Positive',
        // Risk Assessment
        riskFactors: [],
        // Care Team
        assignedDoctor: '',
        assignedMidwife: ''
    });

    const [error, setError] = useState('');
    const [customRiskFactor, setCustomRiskFactor] = useState('');

    const commonRiskFactors = [
        'Advanced maternal age (>35)',
        'Teenage pregnancy (<18)',
        'Previous C-section',
        'Previous stillbirth',
        'Multiple pregnancy',
        'Hypertension',
        'Diabetes',
        'Gestational diabetes',
        'Pre-eclampsia history',
        'Heart disease',
        'Anemia',
        'HIV positive',
        'First pregnancy',
        'Grand multiparity (>5 births)'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRiskFactorToggle = (factor) => {
        setFormData(prev => ({
            ...prev,
            riskFactors: prev.riskFactors.includes(factor)
                ? prev.riskFactors.filter(f => f !== factor)
                : [...prev.riskFactors, factor]
        }));
    };

    const addCustomRiskFactor = () => {
        if (customRiskFactor.trim()) {
            setFormData(prev => ({
                ...prev,
                riskFactors: [...prev.riskFactors, customRiskFactor.trim()]
            }));
            setCustomRiskFactor('');
        }
    };

    const calculateEDD = (lmp) => {
        if (!lmp) return '';
        const lmpDate = new Date(lmp);
        const edd = new Date(lmpDate);
        edd.setDate(edd.getDate() + 280); // 40 weeks
        return edd.toISOString().split('T')[0];
    };

    const calculateGestationWeeks = (lmp) => {
        if (!lmp) return 0;
        const lmpDate = new Date(lmp);
        const today = new Date();
        const diffTime = Math.abs(today - lmpDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 7);
    };

    const calculateRiskLevel = () => {
        const { age, riskFactors } = formData;
        if (riskFactors.length >= 3) return 'High';
        if (riskFactors.length >= 1 || age > 35 || age < 18) return 'Moderate';
        return 'Low';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.patientName || !formData.age || !formData.phoneNumber) {
            setError('Please fill in all required patient information');
            return;
        }

        if (!formData.lmp) {
            setError('Last Menstrual Period date is required');
            return;
        }

        if (!formData.bloodGroup) {
            setError('Blood group is required');
            return;
        }

        // Calculate derived values
        const edd = calculateEDD(formData.lmp);
        const currentWeeks = calculateGestationWeeks(formData.lmp);
        const riskLevel = calculateRiskLevel();

        const completeData = {
            ...formData,
            edd,
            currentWeeks,
            riskLevel,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'Antenatal',
            age: parseInt(formData.age),
            gravida: parseInt(formData.gravida),
            para: parseInt(formData.para),
            abortions: parseInt(formData.abortions)
        };

        onSubmit(completeData);
    };

    if (!isOpen) return null;

    const edd = calculateEDD(formData.lmp);
    const gestationWeeks = calculateGestationWeeks(formData.lmp);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Register New Maternity Patient</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Patient Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="15"
                                    max="50"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="07XX XXX XXX"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContactName"
                                    value={formData.emergencyContactName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContactRelation"
                                    value={formData.emergencyContactRelation}
                                    onChange={handleChange}
                                    placeholder="e.g., Husband, Mother"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    name="emergencyContactPhone"
                                    value={formData.emergencyContactPhone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pregnancy Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Menstrual Period (LMP) *
                                </label>
                                <input
                                    type="date"
                                    name="lmp"
                                    value={formData.lmp}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                />
                            </div>
                            {formData.lmp && (
                                <div className="bg-pink-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Expected Delivery Date</p>
                                    <p className="text-lg font-bold text-pink-600">
                                        {new Date(edd).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current: {gestationWeeks} weeks
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gravida (Pregnancies)
                                </label>
                                <input
                                    type="number"
                                    name="gravida"
                                    value={formData.gravida}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Para (Births)
                                </label>
                                <input
                                    type="number"
                                    name="para"
                                    value={formData.para}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Abortions
                                </label>
                                <input
                                    type="number"
                                    name="abortions"
                                    value={formData.abortions}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blood Group *
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    RH Factor
                                </label>
                                <select
                                    name="rhFactor"
                                    value={formData.rhFactor}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                >
                                    <option value="Positive">Positive</option>
                                    <option value="Negative">Negative</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors Assessment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            {commonRiskFactors.map((factor) => (
                                <label key={factor} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.riskFactors.includes(factor)}
                                        onChange={() => handleRiskFactorToggle(factor)}
                                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-gray-700">{factor}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customRiskFactor}
                                onChange={(e) => setCustomRiskFactor(e.target.value)}
                                placeholder="Add custom risk factor..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomRiskFactor())}
                            />
                            <button
                                type="button"
                                onClick={addCustomRiskFactor}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Add
                            </button>
                        </div>
                        {formData.riskFactors.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Estimated Risk Level:
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${calculateRiskLevel() === 'High' ? 'bg-red-100 text-red-800' :
                                            calculateRiskLevel() === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {calculateRiskLevel()}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Care Team Assignment */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Team Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assigned Doctor
                                </label>
                                <input
                                    type="text"
                                    name="assignedDoctor"
                                    value={formData.assignedDoctor}
                                    onChange={handleChange}
                                    placeholder="e.g., Dr. Stone"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assigned Midwife
                                </label>
                                <input
                                    type="text"
                                    name="assignedMidwife"
                                    value={formData.assignedMidwife}
                                    onChange={handleChange}
                                    placeholder="e.g., Midwife Mary"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Register Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;
