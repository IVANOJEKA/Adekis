import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Check, Star, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

const ShandWalletPage = () => {
    const { branding } = useBranding();
    const config = branding.websiteConfig || {};
    const packages = config.walletPackages || [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-20">
            {/* Hero */}
            <div className="bg-[#0f172a] text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/30 to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-6 font-bold text-sm"
                            >
                                <Wallet size={16} /> Shand Wallet
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                            >
                                Smart Healthcare <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Simplified.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-300 mb-8 leading-relaxed"
                            >
                                Pre-pay for your family's health and enjoy exclusive discounts, priority access, and cashless treatments.
                            </motion.p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                            >
                                View Packages
                            </motion.button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500 blur-[100px] opacity-20"></div>
                                <div className="relative w-80 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 flex flex-col justify-between transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                                    <div className="flex justify-between items-start">
                                        <Wallet className="text-emerald-400" size={32} />
                                        <span className="text-slate-400 font-mono">**** 4219</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Balance</p>
                                        <p className="text-3xl font-bold text-white">UGX 1,500,000</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 w-80 h-48 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl border border-emerald-500/30 shadow-2xl p-6 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-0">
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packages */}
            <div id="packages" className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Select Your Plan</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Choose a wallet package that suits your family's needs and budget.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {packages.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-3xl p-8 border ${pkg.recommended
                                    ? 'bg-slate-900 text-white border-slate-800 shadow-2xl scale-105 z-10'
                                    : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-200 hover:shadow-xl'
                                } flex flex-col`}
                        >
                            {pkg.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${pkg.recommended ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-bold ${pkg.recommended ? 'text-emerald-400' : 'text-slate-900'}`}>{pkg.price}</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {pkg.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${pkg.recommended ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Check size={12} />
                                        </div>
                                        <span className={`text-sm ${pkg.recommended ? 'text-slate-300' : 'text-slate-600'}`}>{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${pkg.recommended
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}>
                                Choose {pkg.name} <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="bg-slate-100 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                            <p className="text-slate-600">Your funds are safe and can be used for any hospital service instantly.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-purple-600">
                                <Star size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Earn Rewards</h3>
                            <p className="text-slate-600">Get loyalty points for every transaction and redeem them for free checkups.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Family Sharing</h3>
                            <p className="text-slate-600">One wallet for the entire family. Manage dependent limits easily.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShandWalletPage;
