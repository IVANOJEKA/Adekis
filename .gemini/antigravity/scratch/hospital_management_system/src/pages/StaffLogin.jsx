import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, UserPlus, User as UserIcon, Shield } from 'lucide-react';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'Administrator'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate inputs
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        // Attempt login or register
        let result;
        if (isRegistering) {
            if (!formData.name) {
                setError('Please enter full name');
                setLoading(false);
                return;
            }
            result = await register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
                department: 'Administration' // Default
            });
        } else {
            result = await login(formData.email, formData.password);
        }

        if (result.success) {
            // Redirect based on role
            const role = result.user?.role || 'Staff';
            let path = '/dashboard';

            switch (role) {
                case 'Doctor': path = '/doctor'; break;
                case 'Receptionist': path = '/reception'; break;
                case 'Nurse': path = '/nursing'; break;
                case 'Pharmacist': path = '/pharmacy'; break;
                case 'Lab Technician': path = '/laboratory'; break;
                case 'Radiologist': path = '/radiology'; break;
                case 'Administrator': path = '/dashboard'; break;
                default: path = '/dashboard';
            }
            navigate(path);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/30 mb-4">
                        <span className="text-white font-bold text-2xl">A+</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Adekis+ HMS</h1>
                    <p className="text-slate-500">Staff Login Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500 text-sm mt-1">Sign in to access your dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    )}


                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* REGISTER: Name Field */}
                        <div className={`${isRegistering ? 'block' : 'hidden'}`}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        {/* REGISTER: Role Field */}
                        <div className={`${isRegistering ? 'block' : 'hidden'}`}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                            <div className="relative">
                                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Lab Technician">Lab Technician</option>
                                </select>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="staff@adekisplus.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isRegistering ? "Create a strong password" : "Enter your password"}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{isRegistering ? 'Creating Account...' : 'Signing in...'}</span>
                                </>
                            ) : (
                                <>
                                    {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                                </>
                            )}
                        </button>

                        {/* Toggle Mode */}
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-sm text-primary hover:text-primary-dark hover:underline"
                            >
                                {isRegistering ? 'Already have an account? Sign In' : 'New to Adekis+? Create Account here'}
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800 mb-2">Demo Credentials:</p>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>Admin:</strong> admin@adekisplus.com / admin123</p>
                            <p><strong>Doctor:</strong> doctor@adekisplus.com / doctor123</p>
                            <p><strong>Nurse:</strong> nurse@adekisplus.com / nurse123</p>
                        </div>
                    </div>
                </div>

                {/* Patient Portal Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/patient-login')}
                        className="text-sm text-slate-600 hover:text-primary transition-colors"
                    >
                        Are you a patient? <span className="font-semibold">Access Patient Portal →</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
