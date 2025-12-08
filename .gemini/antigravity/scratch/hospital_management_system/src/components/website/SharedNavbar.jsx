import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, FileText } from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';

const SharedNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { branding } = useBranding();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Services', path: '/services', type: 'route' },
        { name: 'Health Camps', path: '/health-camps', type: 'route' },
        { name: 'Shand Wallet', path: '/shand-wallet', type: 'route' },
    ];

    const handleNavigate = (link) => {
        setIsMenuOpen(false);
        if (link.type === 'anchor') {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(link.path.replace('/#', ''));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const el = document.getElementById(link.path.replace('/#', ''));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(link.path);
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        {branding.logo ? (
                            <img src={branding.logo} alt="Logo" className="h-10" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Activity className="text-white" size={24} />
                            </div>
                        )}
                        <div>
                            <h1 className={`text-xl font-bold tracking-tight ${isScrolled || isMenuOpen ? 'text-slate-900' : 'text-white'}`}>{branding.name}</h1>
                            <p className={`text-[10px] font-bold tracking-widest uppercase ${isScrolled || isMenuOpen ? 'text-slate-500' : 'text-emerald-100/80'}`}>Excellence in Care</p>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavigate(link)}
                                className={`text-sm font-bold transition-colors ${isScrolled
                                    ? 'text-slate-600 hover:text-emerald-600'
                                    : 'text-emerald-50 hover:text-white shadow-black/5'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <button
                            onClick={() => navigate('/patient-portal')}
                            className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 text-sm"
                        >
                            <FileText size={16} /> Patient Portal
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={`md:hidden p-2 rounded-lg ${isScrolled || isMenuOpen ? 'text-slate-800' : 'text-white'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavigate(link)}
                                    className="text-left font-medium text-slate-600 py-2 hover:text-emerald-600 hover:bg-emerald-50 px-4 rounded-lg transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <button
                                onClick={() => { navigate('/patient-portal'); setIsMenuOpen(false); }}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <FileText size={18} /> Patient Portal
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default SharedNavbar;
