import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Heart,
    Phone,
    Clock,
    MapPin,
    Shield,
    User,
    Stethoscope,
    Microscope,
    Pill,
    Ambulance,
    Lock,
    Menu,
    X,
    FileText
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

// Icon mapping for dynamic rendering
const iconMap = {
    Activity: <Activity size={32} className="text-red-500" />,
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

    // Use config from context or fallbacks
    const config = branding.websiteConfig || {
        showTopBar: true,
        heroTitle: 'Compassionate Care, Advanced Technology',
        heroSubtitle: 'We provide world-class medical services with a personal touch.',
        heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80',
        showStats: true,
        stats: [],
        services: [],
        emergencyPhone: branding.phone,
        welcomeMessage: 'Welcome to Adekis+'
    };

    const services = config.services && config.services.length > 0 ? config.services : [
        { title: "General Consultation", description: "Expert medical consultation.", icon: "Stethoscope" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top Bar */}
            {config.showTopBar && (
                <div className="bg-slate-900 text-slate-300 py-2 px-4 text-sm hidden md:block">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex gap-6">
                            <span className="flex items-center gap-2">
                                <Phone size={14} /> {branding.phone}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={14} /> Open 24 Hours / 7 Days
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span>Critical Care: {config.emergencyPhone}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            {branding.logo ? (
                                <img src={branding.logo} alt="Logo" className="h-10" />
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Activity className="text-white" size={24} />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    {branding.name}
                                </h1>
                                <p className="text-xs text-slate-500 font-medium tracking-wider">HOSPITAL & DIAGNOSTICS</p>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Services</a>
                            <a href="#about" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">About Us</a>
                            <a href="#contact" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Contact</a>
                            <button
                                onClick={() => navigate('/patient-portal')}
                                className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-full hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-200"
                            >
                                <FileText size={18} />
                                Patient Portal
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg absolute w-full">
                        <div className="flex flex-col gap-4">
                            <a href="#services" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Services</a>
                            <a href="#about" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>About Us</a>
                            <a href="#contact" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Contact</a>
                            <button
                                onClick={() => navigate('/patient-portal')}
                                className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200"
                            >
                                Access Patient Portal
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-slate-50">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10 transition-all duration-700"
                        style={{ backgroundImage: `url('${config.heroImage}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-full mb-6">
                            {config.welcomeMessage}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            {config.heroTitle}
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            {config.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/patient-portal')}
                                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <FileText size={20} />
                                Check Lab Results
                            </button>
                            <button
                                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Phone size={20} />
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Services Grid */}
            <section id="services" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Medical Services</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We offer a wide range of medical specialties and diagnostic services under one roof.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="mb-6 p-4 rounded-xl bg-white shadow-sm inline-block group-hover:scale-110 transition-transform">
                                    {iconMap[service.icon] || <Activity size={32} className="text-slate-400" />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Stats */}
            {config.showStats && config.stats && (
                <section id="about" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
                    <div className="container mx-auto px-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose {branding.name}?</h2>
                                <div className="space-y-6 text-emerald-100">
                                    <p className="text-lg">
                                        With over a decade of dedicated service, we have established ourselves as a pillar of healthcare excellence in the region.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-emerald-400" /> Experienced team of specialists
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-emerald-400" /> Modern diagnostic equipment
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-emerald-400" /> Patient-centered approach
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <CheckCircle className="text-emerald-400" /> Easy online access to records
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {config.stats.map((stat, idx) => (
                                    <div key={idx} className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                        <p className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</p>
                                        <p className="text-emerald-100">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Quick Access Portal */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-12 flex flex-col justify-center">
                            <span className="text-emerald-600 font-bold mb-2 tracking-wide">PATIENT PORTAL</span>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Access Your Lab Results From Home</h2>
                            <p className="text-slate-600 mb-8">
                                No need to wait in line. Enter your Patient ID and Access Code to view your diagnostics reports instantly.
                            </p>
                            <button
                                onClick={() => navigate('/patient-portal')}
                                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Go to Patient Portal <Activity size={18} />
                            </button>
                        </div>
                        <div className="md:w-1/2 bg-emerald-100 relative min-h-[300px]">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                            <div className="absolute inset-0 bg-emerald-900/40"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 text-slate-400 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <Activity className="text-white" size={20} />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">{branding.name}</span>
                            </div>
                            <p className="mb-6">
                                Providing quality healthcare services with advanced technology and compassionate care.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Home</a></li>
                                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Our Services</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Doctors</a></li>
                                <li><button onClick={() => navigate('/patient-portal')} className="hover:text-emerald-400 transition-colors">Patient Portal</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Contact Info</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MapPin className="text-emerald-500 shrink-0 mt-1" size={18} />
                                    <span>{branding.address}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="text-emerald-500 shrink-0" size={18} />
                                    <span>{branding.phone}</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Emergency</h4>
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <p className="text-sm mb-2">24/7 Emergency Line</p>
                                <p className="text-2xl font-bold text-white mb-4">{branding.websiteConfig?.emergencyPhone || config.emergencyPhone}</p>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs text-emerald-500 font-bold uppercase">Always Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">© 2024 {branding.name} | Powered by Adekis+</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
                            <button
                                onClick={() => navigate('/staff-login')}
                                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                                title="Staff Access"
                            >
                                <Lock size={12} /> Staff
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const CheckCircle = ({ className }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default LandingPage;
