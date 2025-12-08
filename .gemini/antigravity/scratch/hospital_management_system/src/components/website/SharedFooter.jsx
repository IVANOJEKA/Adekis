import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Phone, MapPin, CreditCard, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';

const SharedFooter = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert(`Subscribed with ${email}`);
        setEmail('');
    };

    // Secret Staff Login Access
    const [secretClicks, setSecretClicks] = useState(0);

    const handleSecretAccess = () => {
        const newCount = secretClicks + 1;
        setSecretClicks(newCount);

        if (newCount === 3) {
            navigate('/staff-login');
            setSecretClicks(0);
        }

        // Reset if no subsequent click within 1 second
        setTimeout(() => setSecretClicks(0), 1000);
    };

    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div
                            className="flex items-center gap-3 mb-6 cursor-pointer select-none"
                            onClick={handleSecretAccess}
                            title="Adekis Hospital System"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95">
                                <Activity className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">{branding.name}</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Providing world-class healthcare with a compassionate touch. specialized in modern treatments and community wellness.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><button onClick={() => navigate('/')} className="hover:text-emerald-600 transition-colors">Home</button></li>
                            <li><button onClick={() => navigate('/services')} className="hover:text-emerald-600 transition-colors">Our Services</button></li>
                            <li><button onClick={() => navigate('/health-camps')} className="hover:text-emerald-600 transition-colors">Health Camps</button></li>
                            <li><button onClick={() => navigate('/shand-wallet')} className="hover:text-emerald-600 transition-colors">Shand Wallet</button></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-emerald-500 mt-1" />
                                <span>{branding.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-emerald-500" />
                                <span>{branding.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CreditCard size={16} className="text-emerald-500" />
                                <span>Billing Support Available</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
                        <p className="text-slate-500 text-sm mb-4">Subscribe to get updates on free health camps and wallet offers.</p>
                        <form onSubmit={handleSubscribe} className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                required
                            />
                            <button type="submit" className="absolute right-2 top-2 p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 text-slate-400 text-xs">
                    <p>© 2025 {branding.name}. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SharedFooter;
