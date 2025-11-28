import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Shield, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { usePatientAuth } from '../context/PatientAuthContext';
import { useData } from '../context/DataContext';

const PatientLogin = () => {
    const navigate = useNavigate();
    const { requestOTP, verifyOTP } = usePatientAuth();
    const { patients } = useData();

    const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [devOTP, setDevOTP] = useState('');
    const [patientData, setPatientData] = useState(null);

    const formatPhoneNumber = (value) => {
        // Remove non-digits
        const cleaned = value.replace(/\D/g, '');
        // Limit to 10 digits (Uganda format)
        return cleaned.substring(0, 10);
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setError('');
    };

    const handleRequestOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        // Find patient by phone number
        const patient = patients.find(p => p.phone?.replace(/\D/g, '') === phoneNumber);

        if (!patient) {
            setError('No patient found with this phone number. Please contact reception.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await requestOTP(phoneNumber);

            if (result.success) {
                setPatientData(patient);
                setDevOTP(result.devOTP); // For development only
                setStep(2);
            } else {
                setError(result.message || 'Failed to send OTP. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyOTP(phoneNumber, otp, patientData);

            if (result.success) {
                // Redirect to patient portal
                navigate('/patient-portal');
            } else {
                setError(result.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 6);
        setOTP(value);
        setError('');
    };

    const handleResendOTP = async () => {
        setOTP('');
        setError('');
        setLoading(true);

        try {
            const result = await requestOTP(phoneNumber);
            if (result.success) {
                setDevOTP(result.devOTP);
                alert('OTP has been resent to your phone');
            }
        } catch (err) {
            setError('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-4">
                        <Shield size={48} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Patient Portal</h1>
                    <p className="text-slate-600">Access your medical records securely</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Progress Indicator */}
                    <div className="flex">
                        <div className={`flex-1 h-1 ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Phone Number */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Enter Your Phone Number</h2>
                                    <p className="text-sm text-slate-500">We'll send you a one-time password</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            placeholder="07XX XXX XXX"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
                                            disabled={loading}
                                        />
                                        <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Enter the phone number registered with the hospital</p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleRequestOTP}
                                    disabled={loading || phoneNumber.length < 10}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                                >
                                    {loading ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Request OTP
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p className="text-sm text-slate-500">
                                        Don't have access?{' '}
                                        <span className="text-primary font-medium">Contact reception</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Enter Verification Code</h2>
                                    <p className="text-sm text-slate-500">
                                        We sent a code to{' '}
                                        <span className="font-medium text-slate-700">
                                            {phoneNumber.substring(0, 4)} *** {phoneNumber.substring(7)}
                                        </span>
                                    </p>
                                </div>

                                {/* Development OTP Display */}
                                {devOTP && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-xs text-amber-800 mb-1 font-medium">Development Mode - Test OTP:</p>
                                        <p className="text-2xl font-mono font-bold text-amber-900 tracking-wider">{devOTP}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">One-Time Password</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={handleOTPChange}
                                            placeholder="------"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-2xl font-mono tracking-widest"
                                            maxLength={6}
                                            disabled={loading}
                                        />
                                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                                >
                                    {loading ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            Verify & Login
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-slate-600 hover:text-slate-800 font-medium"
                                        disabled={loading}
                                    >
                                        ← Change number
                                    </button>
                                    <button
                                        onClick={handleResendOTP}
                                        className="text-primary hover:text-primary-dark font-medium"
                                        disabled={loading}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Shield size={16} />
                    <span>Your data is encrypted and secure</span>
                </div>

                {/* Back to Main Site */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-slate-600 hover:text-slate-800"
                    >
                        ← Back to Hospital Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
