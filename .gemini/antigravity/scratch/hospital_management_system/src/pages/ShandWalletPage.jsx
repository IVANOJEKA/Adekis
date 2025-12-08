import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wallet, Check, Star, Shield, CreditCard, ArrowRight, Activity, Users } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import SharedNavbar from '../components/website/SharedNavbar';
import SharedFooter from '../components/website/SharedFooter';

const ShandWalletPage = () => {
    const { branding } = useBranding();
    const config = branding.websiteConfig || {};
    const packages = config.walletPackages || [];

    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SharedNavbar />

            {/* Hero */}
            <header className="bg-[#0f172a] text-white py-32 relative overflow-hidden min-h-[80vh] flex items-center">
                <motion.div
                    style={{ y: yHero }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-8 font-bold text-sm tracking-wide"
                            >
                                <Wallet size={16} /> Digital Health Wallet
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
                            >
                                Smart Healthcare <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Simplified.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-300 mb-10 leading-relaxed max-w-lg"
                            >
                                Pre-pay for your family's health and enjoy exclusive discounts, priority access, and cashless treatments.
                            </motion.p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center gap-2"
                            >
                                View Packages <ArrowRight size={20} />
                            </motion.button>
                        </div>

                        {/* 3D Floating Wallet Animation */}
                        <div className="md:w-1/2 flex justify-center perspective-[2000px]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: -20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
                                className="relative group w-[500px] h-[320px]"
                            >
                                <div className="absolute inset-0 bg-emerald-500 blur-[120px] opacity-30 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>

                                {/* Front Card */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-between z-20 backdrop-blur-xl"
                                >
                                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-3xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                                    </div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <Activity className="text-emerald-400" size={48} />
                                        <div className="text-right">
                                            <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Shand Wallet</p>
                                            <p className="text-white/90 font-mono tracking-widest text-lg mt-1">**** **** **** 4219</p>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">Total Balance</p>
                                                <p className="text-4xl font-bold text-white tracking-tight">UGX 1,500,000</p>
                                            </div>
                                            <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-md opacity-80"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Back Card (Decoration) */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [-2, -5, -2] }}
                                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute top-4 -right-12 w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl border border-emerald-500/30 shadow-xl z-10 opacity-60 scale-95"
                                ></motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Packages */}
            <div id="packages" className="container mx-auto px-4 py-24">
                <div className="text-center mb-20">
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Flexible Pricing</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Select Your Health Plan</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">Choose a wallet package that suits your family's needs and budget. Top up anytime.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {packages.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-[2rem] p-10 border transition-all duration-300 ${pkg.recommended
                                ? 'bg-slate-900 text-white border-slate-800 shadow-2xl scale-110 z-10'
                                : 'bg-white text-slate-900 border-slate-100 hover:border-emerald-200 hover:shadow-xl'
                                } flex flex-col h-full`}
                        >
                            {pkg.recommended && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8 text-center">
                                <h3 className={`text-xl font-bold mb-4 uppercase tracking-wider ${pkg.recommended ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.name}</h3>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-lg font-bold top-0 relative text-emerald-500">UGX</span>
                                    <span className={`text-5xl font-bold ${pkg.recommended ? 'text-white' : 'text-slate-900'}`}>{pkg.price.replace('UGX', '').trim()}</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-current opacity-10 mb-8"></div>

                            <div className="flex-1 space-y-5 mb-10">
                                {pkg.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={`mt-0.5 p-1 rounded-full shrink-0 ${pkg.recommended ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm font-medium ${pkg.recommended ? 'text-slate-300' : 'text-slate-600'}`}>{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${pkg.recommended
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/40'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}>
                                Choose {pkg.name} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="bg-slate-900 py-32 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">Why Choose Shand Wallet?</h2>
                        <p className="text-slate-400">More than just payments. It's a complete health safety net.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Secure & Instant</h3>
                            <p className="text-slate-400 leading-relaxed">Your funds are safe and can be used for any hospital service instantly without delays.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors">
                            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-8">
                                <Star size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Earn Rewards</h3>
                            <p className="text-slate-400 leading-relaxed">Get 5% loyalty points for every transaction and redeem them for free checkups.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Family Sharing</h3>
                            <p className="text-slate-400 leading-relaxed">One wallet for the entire family. Add dependents and manage their spending limits easily.</p>
                        </div>
                    </div>
                </div>
            </div>

            <SharedFooter />
        </div>
    );
};

export default ShandWalletPage;
