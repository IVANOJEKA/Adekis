import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Activity,
    Phone,
    MapPin,
    Menu,
    X,
    FileText,
    CreditCard,
    ChevronRight,
    Star,
    Shield,
    Stethoscope,
    Microscope,
    Pill,
    Heart,
    User,
    Ambulance,
    ArrowRight,
    Check
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

// Icon mapping
const iconMap = {
    Activity: <Activity size={32} className="text-emerald-500" />,
    Heart: <Heart size={32} className="text-rose-500" />,
    Phone: <Phone size={32} className="text-blue-500" />,
    Shield: <Shield size={32} className="text-amber-500" />,
    User: <User size={32} className="text-gray-500" />,
    Stethoscope: <Stethoscope size={32} className="text-blue-500" />,
    Microscope: <Microscope size={32} className="text-emerald-500" />,
    Pill: <Pill size={32} className="text-purple-500" />,
    Ambulance: <Ambulance size={32} className="text-red-600" />
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Safe Config Access
    const config = branding.websiteConfig || {
        services: [],
        promotions: [],
        healthCamps: [],
        heroTitle: 'Compassionate Care',
        heroSubtitle: 'Advanced Medicine',
        welcomeMessage: 'Welcome'
    };

    const services = config.services && config.services.length > 0 ? config.services : [
        { title: "General Consultation", description: "Expert medical consultation.", icon: "Stethoscope" }
    ];

    const activePromos = (config.promotions || []).filter(p => p.active);
    const upcomingCamps = (config.healthCamps || []).slice(0, 3);

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">

            {/* --- NAVIGATION --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            {branding.logo ? (
                                <img src={branding.logo} alt="Logo" className="h-10" />
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Activity className="text-white" size={24} />
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{branding.name}</h1>
                                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Excellence in Care</p>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Specialties</a>
                            <button onClick={() => navigate('/health-camps')} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Health Camps</button>
                            <button onClick={() => navigate('/shand-wallet')} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Shand Wallet</button>
                            <button
                                onClick={() => navigate('/patient-portal')}
                                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 text-sm"
                            >
                                <FileText size={16} /> Patient Portal
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2 text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="md:hidden bg-white border-t border-slate-100 px-4 py-4 shadow-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <a href="#services" className="font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Services</a>
                            <button onClick={() => { navigate('/health-camps'); setIsMenuOpen(false) }} className="text-left font-medium text-slate-600">Health Camps</button>
                            <button onClick={() => { navigate('/shand-wallet'); setIsMenuOpen(false) }} className="text-left font-medium text-slate-600">Shand Wallet</button>
                            <button onClick={() => { navigate('/patient-portal'); setIsMenuOpen(false) }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">Patient Portal</button>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* --- HERO SECTION (Cinematic) --- */}
            <header className="relative h-screen flex items-center overflow-hidden bg-slate-900">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-in-out transform scale-110 hover:scale-100"
                        style={{ backgroundImage: `url('${config.heroImage || 'https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80'}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </motion.div>

                <div className="container mx-auto px-4 z-10 relative mt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full backdrop-blur-sm border border-emerald-500/30 mb-8">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-sm font-bold tracking-wide uppercase">{config.welcomeMessage}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                            {config.heroTitle}
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                            {config.heroSubtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/health-camps')}
                                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)] flex items-center justify-center gap-3"
                            >
                                Book Appointment <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate('/shand-wallet')}
                                className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                            >
                                <CreditCard size={20} /> Shand Wallet
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
                </motion.div>
            </header>

            {/* --- PROMOTIONS CAROUSEL --- */}
            {activePromos.length > 0 && (
                <section className="py-20 bg-slate-50 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Current Promotions</h2>
                                <p className="text-slate-500">Exclusive offers and health packages for you.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                            {activePromos.map((promo) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="min-w-[300px] md:min-w-[400px] bg-white rounded-3xl overflow-hidden shadow-xl snap-center group cursor-pointer border border-slate-100 hover:border-emerald-200 transition-colors"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img src={promo.image || 'https://via.placeholder.com/400x200'} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full mb-3">LIMITED TIME</span>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{promo.title}</h3>
                                        <p className="text-slate-600 mb-4">{promo.description}</p>
                                        <button className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                                            Learn More <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- SERVICES GRID --- */}
            <section id="services" className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">World-Class Facilities</h2>
                        <p className="text-lg text-slate-600">
                            We combine decades of experience with state-of-the-art technology to provide the best possible care for our patients.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 text-emerald-600">
                                    {iconMap[service.icon] || <Activity />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HEALTH CAMPS TEASER --- */}
            {upcomingCamps.length > 0 && (
                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-600 rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div>
                                <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-2 block">Community Outreach</span>
                                <h2 className="text-4xl font-bold">Upcoming Health Camps</h2>
                            </div>
                            <button
                                onClick={() => navigate('/health-camps')}
                                className="px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                View All Camps <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {upcomingCamps.map((camp, idx) => (
                                <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/health-camps')}>
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-sm font-bold">
                                            {camp.date}
                                        </div>
                                        {camp.slots < 10 && (
                                            <span className="text-rose-400 text-xs font-bold animate-pulse">Filling Fast!</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{camp.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                                        <MapPin size={14} /> {camp.location}
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <p className="text-right text-xs text-slate-500 mt-2">{camp.slots} spots left</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- SHAND WALLET TEASER --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl text-white">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                            <div className="md:w-1/2">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Meet <span className="text-emerald-400">Shand Wallet</span>
                                </h2>
                                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                    The smartest way to manage your family's healthcare expenses. Get up to 15% off on all treatments when you pay with Shand Wallet.
                                </p>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3">
                                        <div className="p-1 bg-emerald-500 rounded-full"><Check className="text-white" size={12} /></div>
                                        <span>Instant cashless payments</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-1 bg-emerald-500 rounded-full"><Check className="text-white" size={12} /></div>
                                        <span>Track spending for the whole family</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-1 bg-emerald-500 rounded-full"><Check className="text-white" size={12} /></div>
                                        <span>Earn loyalty points on every visit</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => navigate('/shand-wallet')}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                                >
                                    Get Started Now
                                </button>
                            </div>

                            {/* Wallet Card Animation */}
                            <div className="md:w-1/2 flex justify-center perspective-[1000px]">
                                <motion.div
                                    animate={{ rotateY: [0, 10, 0], rotateX: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="relative w-96 h-60 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start">
                                        <Activity size={40} className="text-white" />
                                        <span className="text-white/80 font-mono tracking-widest text-lg">**** 8842</span>
                                    </div>
                                    <div>
                                        <div className="text-white/60 text-sm uppercase tracking-wider mb-1">Total Balance</div>
                                        <div className="text-4xl font-bold text-white tracking-tight">UGX 2.5M</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                                <Activity className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{branding.name}</span>
                        </div>

                        <div className="flex gap-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <Phone size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <MapPin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                <CreditCard size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 text-slate-500 text-sm">
                        <p>© 2025 {branding.name}. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-slate-900">Privacy</a>
                            <a href="#" className="hover:text-slate-900">Terms</a>
                            <button onClick={() => navigate('/staff-login')} className="hover:text-slate-900">Staff Login</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
