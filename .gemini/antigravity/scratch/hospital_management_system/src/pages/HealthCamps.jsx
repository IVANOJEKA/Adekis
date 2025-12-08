import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, X, Check, ArrowRight } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/website/SharedNavbar';
import SharedFooter from '../components/website/SharedFooter';

const HealthCamps = () => {
    const { branding } = useBranding();
    const navigate = useNavigate();
    const config = branding.websiteConfig || {};
    const camps = config.healthCamps || [];

    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    const [selectedCamp, setSelectedCamp] = useState(null);
    const [bookingForm, setBookingForm] = useState({ name: '', phone: '', email: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleBook = (e) => {
        e.preventDefault();
        // Here you would send the booking to the backend
        setTimeout(() => setIsSubmitted(true), 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SharedNavbar />

            {/* Header / Hero with Parallax */}
            <header className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-emerald-900 text-white">
                <motion.div
                    style={{ y: yHero }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 transform scale-105"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-emerald-900/50 to-transparent"></div>
                </motion.div>

                <div className="container mx-auto px-4 relative z-10 text-center mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-4">
                            Community Outreach
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                            Community Health Camps
                        </h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                            Bringing quality healthcare closer to you. Join our upcoming free and subsidized medical camps.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Camps Grid */}
            <div className="container mx-auto px-4 py-24 relative z-10 -mt-20">
                {camps.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Camps Scheduled</h3>
                        <p className="text-slate-500 text-lg mb-8">Please check back later for upcoming community events.</p>
                        <button onClick={() => navigate('/')} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                            Return Home
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {camps.map((camp, idx) => (
                            <motion.div
                                key={camp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group h-full"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Open for Booking
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                                        <div className="text-white font-bold flex items-center gap-2">
                                            <Calendar size={16} className="text-emerald-400" /> {camp.date}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{camp.title}</h3>
                                    <p className="text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">{camp.description}</p>

                                    <div className="space-y-4 mb-8 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-emerald-500 shrink-0" />
                                            <span>{camp.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className="text-emerald-500 shrink-0" />
                                            <span className="truncate">{camp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-emerald-500 shrink-0" />
                                            <span className="font-bold text-slate-700">{camp.slots} slots remaining</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedCamp(camp)}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group-hover:gap-3"
                                    >
                                        Book Appointment <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <SharedFooter />

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedCamp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                                <div>
                                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Book Your Spot</p>
                                    <h3 className="font-bold text-xl">{selectedCamp.title}</h3>
                                </div>
                                <button onClick={() => { setSelectedCamp(null); setIsSubmitted(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check size={40} />
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h4>
                                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">We have sent the appointment details to your email. We look forward to seeing you!</p>
                                        <button
                                            onClick={() => { setSelectedCamp(null); setIsSubmitted(false); }}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleBook} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={bookingForm.name}
                                                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={bookingForm.phone}
                                                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                placeholder="+256..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                                            <input
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 text-lg"
                                        >
                                            Confirm Booking
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthCamps;
