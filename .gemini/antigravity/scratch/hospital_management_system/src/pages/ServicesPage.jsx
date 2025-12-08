import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Heart,
    Shield,
    User,
    Stethoscope,
    Microscope,
    Pill,
    Ambulance,
    ArrowRight,
    Phone
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import SharedNavbar from '../components/website/SharedNavbar';
import SharedFooter from '../components/website/SharedFooter';

// Icon mapping
const iconMap = {
    Activity: <Activity size={40} className="text-emerald-500" />,
    Heart: <Heart size={40} className="text-rose-500" />,
    Shield: <Shield size={40} className="text-amber-500" />,
    User: <User size={40} className="text-gray-500" />,
    Stethoscope: <Stethoscope size={40} className="text-blue-500" />,
    Microscope: <Microscope size={40} className="text-emerald-500" />,
    Pill: <Pill size={40} className="text-purple-500" />,
    Ambulance: <Ambulance size={40} className="text-red-600" />
};

const ServicesPage = () => {
    const { branding } = useBranding();
    const config = branding.websiteConfig || {};
    const services = config.services || [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SharedNavbar />

            {/* Hero Section */}
            <header className="bg-slate-900 text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0833860?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs uppercase tracking-widest mb-6">
                            Clinical Excellence
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Our Medical <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Services</span>
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8">
                            Comprehensive healthcare solutions delivered by expert professionals using state-of-the-art technology.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Services Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    {services.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-lg">Services are currently being updated.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 group"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {iconMap[service.icon] || <Activity size={40} className="text-emerald-500" />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <button className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Learn More <ArrowRight size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-emerald-900 py-20 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                        Our emergency department is open 24/7. Call us now or visit our facility for urgent care.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href={`tel:${branding.phone}`}
                            className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center gap-3"
                        >
                            <Phone size={20} /> {branding.phone}
                        </a>
                        <button className="px-8 py-4 bg-emerald-800 border border-emerald-700 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-colors">
                            Get Directions
                        </button>
                    </div>
                </div>
            </section>

            <SharedFooter />
        </div>
    );
};

export default ServicesPage;
