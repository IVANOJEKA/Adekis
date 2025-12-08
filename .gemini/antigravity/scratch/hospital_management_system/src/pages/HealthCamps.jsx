import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, X, Check, ArrowRight } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useNavigate } from 'react-router-dom';

const HealthCamps = () => {
    const { branding } = useBranding();
    const navigate = useNavigate();
    const config = branding.websiteConfig || {};
    const camps = config.healthCamps || [];

    const [selectedCamp, setSelectedCamp] = useState(null);
    const [bookingForm, setBookingForm] = useState({ name: '', phone: '', email: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleBook = (e) => {
        e.preventDefault();
        // Here you would send the booking to the backend
        setTimeout(() => setIsSubmitted(true), 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-20">
            {/* Header */}
            <header className="bg-emerald-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-6"
                    >
                        Community Health Camps
                    </motion.h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                        Bringing quality healthcare closer to you. Join our upcoming free and subsidized medical camps.
                    </p>
                </div>
            </header>

            {/* Camps Grid */}
            <div className="container mx-auto px-4 py-16">
                {camps.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No upcoming health camps scheduled at the moment.</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 font-bold hover:underline">Return Home</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {camps.map((camp, idx) => (
                            <motion.div
                                key={camp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-100 flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={camp.image} alt={camp.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Open
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{camp.title}</h3>
                                    <p className="text-slate-600 mb-6 flex-1">{camp.description}</p>

                                    <div className="space-y-3 mb-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-emerald-500" />
                                            <span>{camp.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-emerald-500" />
                                            <span>{camp.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className="text-emerald-500" />
                                            <span>{camp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-emerald-500" />
                                            <span>{camp.slots} slots remaining</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedCamp(camp)}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Book Appointment <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedCamp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                                <h3 className="font-bold text-lg">Book Spot: {selectedCamp.title}</h3>
                                <button onClick={() => { setSelectedCamp(null); setIsSubmitted(false); }} className="hover:text-emerald-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8">
                                {isSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check size={32} />
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h4>
                                        <p className="text-slate-500 mb-6">We have sent the details to your email. See you at the camp!</p>
                                        <button
                                            onClick={() => { setSelectedCamp(null); setIsSubmitted(false); }}
                                            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleBook} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={bookingForm.name}
                                                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={bookingForm.phone}
                                                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                                placeholder="+256..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address (Optional)</label>
                                            <input
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30"
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
