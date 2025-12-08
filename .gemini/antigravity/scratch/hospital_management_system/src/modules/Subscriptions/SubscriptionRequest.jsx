import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, User, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

const SubscriptionRequest = () => {
    const { requestSubscription, SUBSCRIPTION_TIERS } = useSubscription();

    const [selectedTier, setSelectedTier] = useState('PROFESSIONAL');
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Hospital',
        location: '',
        contactName: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Submit subscription request
        const result = requestSubscription(formData, selectedTier);

        console.log('Subscription requested:', result);
        setSubmitted(true);
    };

    const tierDetails = Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => ({
        key,
        ...tier
    }));

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Request Submitted Successfully!</h2>
                    <p className="text-slate-600 mb-6">
                        Thank you for your interest in our Hospital Management System.
                        Your subscription request has been received and is pending approval.
                    </p>
                    <div className="bg-blue-50 p-6 rounded-xl mb-6">
                        <h3 className="font-bold text-blue-900 mb-3">What's Next?</h3>
                        <div className="text-left space-y-3 text-sm text-blue-800">
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                                <p>Our admin team will review your request within 24 hours</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                                <p>You'll receive an email confirmation at <strong>{formData.email}</strong></p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                                <p>Once approved, access credentials will be sent immediately</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        Submit Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                            <Shield size={24} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800">Hospital Management System</h1>
                    </div>
                    <p className="text-xl text-slate-600">Start your digital transformation journey today</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {tierDetails.map(tier => (
                        <div
                            key={tier.key}
                            onClick={() => setSelectedTier(tier.key)}
                            className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${selectedTier === tier.key
                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    <Sparkles size={12} />
                                    Popular
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {tier.price === 0 ? 'Free' : `${(tier.price / 1000).toFixed(0)}K`}
                                    </span>
                                    {tier.price > 0 && (
                                        <span className="text-slate-500 text-sm">
                                            /{tier.duration === 365 ? 'year' : 'month'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600">{tier.description}</p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span className="text-slate-700">
                                        {tier.maxUsers === -1 ? 'Unlimited' : tier.maxUsers} users
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span className="text-slate-700">
                                        {tier.maxPatients === -1 ? 'Unlimited' : tier.maxPatients} patients
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span className="text-slate-700">
                                        {tier.features.includes('all-modules') ? 'All' : tier.features.length} modules
                                    </span>
                                </div>
                            </div>

                            <div className={`w-full py-2 rounded-lg text-center font-bold text-sm transition-colors ${selectedTier === tier.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                {selectedTier === tier.key ? 'Selected' : 'Select Plan'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Request Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Organization Information</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organization Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Building2 size={16} className="text-blue-600" />
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., City General Hospital"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Organization Type */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Building2 size={16} className="text-blue-600" />
                                    Organization Type *
                                </label>
                                <select
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="Hospital">Hospital</option>
                                    <option value="Clinic">Clinic</option>
                                    <option value="Medical Center">Medical Center</option>
                                    <option value="Health Center">Health Center</option>
                                    <option value="Dispensary">Dispensary</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <MapPin size={16} className="text-blue-600" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Kampala, Uganda"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <User size={16} className="text-blue-600" />
                                    Contact Person *
                                </label>
                                <input
                                    type="text"
                                    name="contactName"
                                    required
                                    value={formData.contactName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Dr. John Doe"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Mail size={16} className="text-blue-600" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@hospital.com"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Phone size={16} className="text-blue-600" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+256700000000"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Selected Plan Summary */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-slate-800 mb-3">Selected Plan Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-600 mb-1">Plan</p>
                                    <p className="font-bold text-slate-800">{SUBSCRIPTION_TIERS[selectedTier]?.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-1">Price</p>
                                    <p className="font-bold text-slate-800">
                                        {SUBSCRIPTION_TIERS[selectedTier]?.price === 0
                                            ? 'Free'
                                            : `UGX ${SUBSCRIPTION_TIERS[selectedTier]?.price.toLocaleString()}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-1">Max Users</p>
                                    <p className="font-bold text-slate-800">
                                        {SUBSCRIPTION_TIERS[selectedTier]?.maxUsers === -1
                                            ? 'Unlimited'
                                            : SUBSCRIPTION_TIERS[selectedTier]?.maxUsers}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-1">Duration</p>
                                    <p className="font-bold text-slate-800">
                                        {SUBSCRIPTION_TIERS[selectedTier]?.duration} days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                                <p className="font-bold mb-1">Important Notice</p>
                                <p>Your request will be reviewed by our admin team. Upon approval, you'll receive access credentials via email. Please ensure your contact information is accurate.</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Shield size={24} />
                                Submit Subscription Request
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-slate-500 text-sm">
                    <p>© 2024 Hospital Management System. All rights reserved.</p>
                    <p className="mt-1">Powered by Adekis Technology</p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionRequest;
