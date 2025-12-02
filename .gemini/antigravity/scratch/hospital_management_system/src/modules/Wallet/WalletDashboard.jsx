import React, { useState } from 'react';
import { Wallet, CreditCard, Plus, TrendingUp, Users, DollarSign, History, Gift, Crown, Shield, Heart, Copy, Settings, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Star, Check, X, Sparkles, QrCode } from 'lucide-react';
import { useData } from '../../context/DataContext';
import QRCodeSVG from '../../components/QRCode';

const WalletDashboard = () => {
    const { walletRecords, createWallet, topUpWallet } = useData();
    const [activeTab, setActiveTab] = useState('my-wallets');
    const [showBalance, setShowBalance] = useState({});
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrWallet, setQRWallet] = useState(null);

    // Form states
    const [subscribeForm, setSubscribeForm] = useState({
        cardholderName: '',
        familyMembers: '',
        initialTopUp: ''
    });
    const [topUpForm, setTopUpForm] = useState({
        amount: '',
        paymentMethod: 'Mobile Money'
    });

    // Wallet packages/tiers with enhanced gradients
    const packages = [
        {
            id: 'platinum',
            name: 'Platinum Elite',
            icon: Crown,
            gradient: 'from-purple-600 via-purple-700 to-indigo-900',
            accentGradient: 'from-purple-400 to-pink-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-300',
            shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            monthlyFee: 50000,
            benefits: [
                'Unlimited family members',
                '30% discount on all services',
                'Priority queue access',
                'Free annual health checkup',
                'Dedicated account manager',
                '24/7 emergency support',
                'International coverage',
                'Cashback rewards 5%'
            ]
        },
        {
            id: 'premium',
            name: 'Premium Gold',
            icon: Star,
            gradient: 'from-amber-500 via-orange-600 to-red-700',
            accentGradient: 'from-yellow-400 to-orange-500',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            monthlyFee: 30000,
            benefits: [
                'Up to 6 family members',
                '20% discount on all services',
                'Priority booking',
                'Free quarterly checkup',
                'Specialist consultation discount',
                'Emergency support',
                'Cashback rewards 3%'
            ]
        },
        {
            id: 'family',
            name: 'Family Care',
            icon: Heart,
            gradient: 'from-pink-500 via-rose-600 to-red-700',
            accentGradient: 'from-pink-400 to-rose-500',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-300',
            shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            monthlyFee: 25000,
            benefits: [
                'Up to 4 family members',
                '15% discount on services',
                'Family health tracking',
                'Vaccination reminders',
                'Pediatric care discount',
                'Cashback rewards 2%'
            ]
        },
        {
            id: 'standard',
            name: 'Standard Plus',
            icon: Shield,
            gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
            accentGradient: 'from-cyan-400 to-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            monthlyFee: 15000,
            benefits: [
                'Individual account',
                '10% discount on services',
                'Basic health tracking',
                'Monthly health tips',
                'Cashback rewards 1%'
            ]
        }
    ];

    // Generate card number
    const generateCardNumber = () => {
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(1000 + Math.random() * 9000);
        const part3 = Math.floor(1000 + Math.random() * 9000);
        const part4 = Math.floor(1000 + Math.random() * 9000);
        return `${part1}-${part2}-${part3}-${part4}`;
    };

    // Generate expiry date (3 years from now)
    const generateExpiryDate = () => {
        const now = new Date();
        const expiry = new Date(now.setFullYear(now.getFullYear() + 3));
        const month = String(expiry.getMonth() + 1).padStart(2, '0');
        const year = String(expiry.getFullYear()).slice(-2);
        return `${month}/${year}`;
    };

    // Mock transaction data based on wallet records
    const transactions = [
        { id: 'TXN-001', walletId: walletRecords[0]?.id, type: 'debit', amount: 50000, description: 'General Consultation', date: '2024-01-19', balance: walletRecords[0]?.balance || 0 },
        { id: 'TXN-002', walletId: walletRecords[0]?.id, type: 'credit', amount: 200000, description: 'Top-up via Mobile Money', date: '2024-01-18', balance: (walletRecords[0]?.balance || 0) + 200000 },
    ];

    const stats = [
        { label: 'Total Balance', value: `UGX ${walletRecords.reduce((sum, w) => sum + (w.balance || 0), 0).toLocaleString()}`, icon: Wallet, color: 'emerald' },
        { label: 'Active Wallets', value: walletRecords.filter(w => w.status === 'Active').length, icon: CreditCard, color: 'blue' },
        { label: 'Total Transactions', value: transactions.length, icon: History, color: 'purple' },
        { label: 'Monthly Growth', value: '+12.5%', icon: TrendingUp, color: 'amber' },
    ];

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const getPackageDetails = (packageType) => {
        return packages.find(p => p.id === packageType) || packages[3];
    };

    const toggleBalance = (walletId) => {
        setShowBalance(prev => ({ ...prev, [walletId]: !prev[walletId] }));
    };

    const copyCardNumber = (cardNumber) => {
        navigator.clipboard.writeText(cardNumber.replace(/\*/g, ''));
        showToast('Card number copied to clipboard!');
    };
    const handleConfirmTopUp = () => {
        if (!topUpForm.amount || parseInt(topUpForm.amount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        const updatedWallets = walletRecords.map(w => {
            if (w.id === selectedWallet.id) {
                return {
                    ...w,
                    balance: w.balance + parseInt(topUpForm.amount),
                    lastTransaction: new Date().toISOString().split('T')[0]
                };
            }
            return w;
        });

        setWalletRecords(updatedWallets);
        showToast(`✓ Wallet topped up with UGX ${parseInt(topUpForm.amount).toLocaleString()} via ${topUpForm.paymentMethod}`);
        setShowTopUpModal(false);
        setSelectedWallet(null);
        setTopUpForm({ amount: '', paymentMethod: 'Mobile Money' });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    } text-white font-medium animate-fade-in`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">HMS Digital Wallet System</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage patient digital wallets and subscriptions</p>
                </div>
                <button
                    onClick={() => setShowSubscribeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium shadow-lg shadow-primary/30"
                >
                    <Plus size={16} />
                    Create New Wallet
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon size={20} className={`text-${stat.color}-600`} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['My Wallets', 'Packages', 'Transactions', 'Statistics'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-');
                        const isActive = activeTab === tabKey;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* My Wallets Tab */}
                    {activeTab === 'my-wallets' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Active Digital Wallets ({walletRecords.length})</h2>
                                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none">
                                    <option>All Card Types</option>
                                    <option>Platinum Elite</option>
                                    <option>Premium Gold</option>
                                    <option>Family Care</option>
                                    <option>Standard Plus</option>
                                </select>
                            </div>

                            {walletRecords.length === 0 ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                                    <Wallet size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Wallets Yet</h3>
                                    <p className="text-slate-500 mb-4">Create your first digital wallet to get started</p>
                                    <button
                                        onClick={() => setShowSubscribeModal(true)}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                                    >
                                        Create Wallet
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {walletRecords.map((wallet) => {
                                        const pkg = getPackageDetails(wallet.packageType);
                                        return (
                                            <div key={wallet.id} className="relative group">
                                                {/* Card */}
                                                <div className={`bg-gradient-to-br ${pkg.gradient} rounded-2xl p-6 text-white shadow-2xl h-56 flex flex-col justify-between relative overflow-hidden transition-transform hover:scale-105 hover:shadow-3xl`}>
                                                    {/* Shimmer Effect */}
                                                    <div className={`absolute inset-0 ${pkg.shimmer} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer`}></div>

                                                    {/* Background Pattern */}
                                                    <div className="absolute inset-0 opacity-20">
                                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                                                        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full opacity-50"></div>
                                                    </div>

                                                    {/* Sparkle Icon */}
                                                    <div className="absolute top-4 right-4 opacity-30">
                                                        <Sparkles size={20} />
                                                    </div>

                                                    {/* Card Header */}
                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <p className="text-xs font-medium opacity-90">Kampala General Hospital</p>
                                                                <div className={`inline-block mt-1 px-2 py-0.5 bg-gradient-to-r ${pkg.accentGradient} rounded-full`}>
                                                                    <p className="text-[10px] font-bold uppercase tracking-wide">{pkg.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                                                <pkg.icon size={20} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-1">
                                                            <p className="text-[10px] uppercase tracking-wide opacity-80">Digital Balance</p>
                                                            <p className="text-2xl font-bold tracking-tight">
                                                                {showBalance[wallet.id]
                                                                    ? `UGX ${wallet.balance.toLocaleString()}`
                                                                    : '•••• ••••'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Card Footer */}
                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-end mb-3">
                                                            <div className="flex-1">
                                                                <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Card Number</p>
                                                                <p className="text-xs font-mono tracking-wider">{wallet.cardNumber}</p>
                                                            </div>
                                                            <div className="text-right ml-4">
                                                                <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Expires</p>
                                                                <p className="text-sm font-bold">{wallet.expiryDate}</p>
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-white/30 pt-2">
                                                            <p className="text-[10px] uppercase tracking-wide opacity-80">Cardholder</p>
                                                            <p className="text-sm font-bold truncate">{wallet.cardholder || wallet.patientName}</p>
                                                        </div>
                                                    </div>


                                                    {/* Chip Icon */}
                                                    <div className="absolute bottom-20 left-6 w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded opacity-90"></div>

                                                    {/* QR Code for Payment - Compact Size */}
                                                    <div className="absolute bottom-2 right-2 z-30">
                                                        <div className="bg-white p-2 rounded-xl shadow-2xl border-2 border-emerald-500">
                                                            <div className="text-center mb-1">
                                                                <p className="text-[7px] font-extrabold text-emerald-700 uppercase tracking-wider">SCAN</p>
                                                            </div>
                                                            <QRCodeSVG
                                                                value={`HMS-WALLET://${wallet.id}?card=${wallet.cardNumber}&pkg=${wallet.packageType}`}
                                                                size={70}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>






                                                {/* Card Actions */}
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => toggleBalance(wallet.id)}
                                                        className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                                                    >
                                                        {showBalance[wallet.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        {showBalance[wallet.id] ? 'Hide' : 'Show'}
                                                    </button>
                                                    <button
                                                        onClick={() => copyCardNumber(wallet.cardNumber)}
                                                        className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                                                    >
                                                        <Copy size={14} />
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => handleTopUp(wallet)}
                                                        className="flex-1 px-3 py-2 bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                        Top Up
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setQRWallet(wallet);
                                                            setShowQRModal(true);
                                                        }}
                                                        className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors text-emerald-700"
                                                    >
                                                        <QrCode size={14} />
                                                    </button>
                                                </div>

                                                {/* Family Members */}
                                                {wallet.members && wallet.members.length > 1 && (
                                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                                            <Users size={12} />
                                                            Family Members ({wallet.members.length})
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {wallet.members.map((member, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                                                                    {member}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Packages Tab */}
                    {activeTab === 'packages' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 mb-2">Choose Your Wallet Package</h2>
                                <p className="text-sm text-slate-500">Select the perfect plan for you and your family</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {packages.map((pkg) => (
                                    <div key={pkg.id} className={`border-2 ${pkg.borderColor} rounded-xl p-6 hover:shadow-xl transition-all ${pkg.bgColor} relative overflow-hidden group`}>
                                        {/* Gradient Accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pkg.gradient}`}></div>

                                        <div className={`w-14 h-14 bg-gradient-to-br ${pkg.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                            <pkg.icon size={28} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-1">{pkg.name}</h3>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent">
                                                UGX {pkg.monthlyFee.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-slate-500">/month</span>
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {pkg.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => {
                                                handleSubscribe(pkg);
                                                setShowSubscribeModal(true);
                                            }}
                                            className={`w-full px-4 py-3 bg-gradient-to-r ${pkg.gradient} text-white rounded-lg hover:shadow-lg transition-all font-medium`}
                                        >
                                            Subscribe Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800">Transaction History</h2>

                            {transactions.length === 0 ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                                    <History size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Transactions Yet</h3>
                                    <p className="text-slate-500">Transactions will appear here once you start using your wallet</p>
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Wallet</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {transactions.map((txn) => {
                                                const wallet = walletRecords.find(w => w.id === txn.walletId);
                                                return (
                                                    <tr key={txn.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 font-medium text-slate-800">{txn.id}</td>
                                                        <td className="px-6 py-4 text-slate-600">{wallet?.cardholder || wallet?.patientName || 'N/A'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`flex items-center gap-1 ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                {txn.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                                <span className="font-medium">{txn.type === 'credit' ? 'Credit' : 'Debit'}</span>
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">{txn.description}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-800">
                                                            <span className={txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}>
                                                                {txn.type === 'credit' ? '+' : '-'}UGX {txn.amount.toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">{txn.date}</td>
                                                        <td className="px-6 py-4 font-medium text-slate-800">UGX {txn.balance.toLocaleString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'statistics' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800">Wallet Statistics</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {packages.map((pkg) => {
                                    const count = walletRecords.filter(w => w.packageType === pkg.id).length;
                                    const totalBalance = walletRecords.filter(w => w.packageType === pkg.id).reduce((sum, w) => sum + (w.balance || 0), 0);
                                    return (
                                        <div key={pkg.id} className={`border-2 ${pkg.borderColor} ${pkg.bgColor} rounded-xl p-5 hover:shadow-lg transition-all`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${pkg.gradient} shadow-lg`}>
                                                    <pkg.icon size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{pkg.name}</h3>
                                                    <p className="text-xs text-slate-500">{count} active {count === 1 ? 'wallet' : 'wallets'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-slate-500">Total Balance</p>
                                                    <p className="text-2xl font-bold text-slate-800">UGX {totalBalance.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Monthly Revenue</p>
                                                    <p className="text-lg font-bold text-emerald-600">UGX {(pkg.monthlyFee * count).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subscribe Modal */}
            {showSubscribeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Create New Wallet</h2>
                                <p className="text-sm text-slate-500 mt-1">Subscribe to a package and start using HMS Wallet</p>
                            </div>
                            <button onClick={() => {
                                setShowSubscribeModal(false);
                                setSelectedPackage(null);
                            }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Package Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Select Package</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {packages.map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`border-2 ${selectedPackage?.id === pkg.id ? pkg.borderColor + ' ring-2 ring-offset-2 ' + pkg.textColor.replace('text', 'ring') : 'border-slate-200'
                                                } ${pkg.bgColor} rounded-xl p-4 text-left hover:shadow-lg transition-all`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${pkg.gradient}`}>
                                                    <pkg.icon size={20} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800">{pkg.name}</h4>
                                                    <p className="text-xs text-slate-600">UGX {pkg.monthlyFee.toLocaleString()}/mo</p>
                                                </div>
                                                {selectedPackage?.id === pkg.id && (
                                                    <Check size={20} className="text-emerald-600" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedPackage && (
                                <>
                                    {/* Cardholder Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Cardholder Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subscribeForm.cardholderName}
                                            onChange={(e) => setSubscribeForm({ ...subscribeForm, cardholderName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter full name as on ID"
                                        />
                                    </div>

                                    {/* Family Members */}
                                    {selectedPackage.id !== 'standard' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Family Members <span className="text-slate-400">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={subscribeForm.familyMembers}
                                                onChange={(e) => setSubscribeForm({ ...subscribeForm, familyMembers: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Comma-separated names (e.g., Jane Doe, John Doe Jr)"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Add family members covered by this package</p>
                                        </div>
                                    )}

                                    {/* Initial Top-up */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Initial Top-up Amount <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">UGX</span>
                                            <input
                                                type="number"
                                                value={subscribeForm.initialTopUp}
                                                onChange={(e) => setSubscribeForm({ ...subscribeForm, initialTopUp: e.target.value })}
                                                className="w-full pl-16 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Minimum: UGX 50,000</p>
                                    </div>

                                    {/* Summary */}
                                    <div className={`border-2 ${selectedPackage.borderColor} ${selectedPackage.bgColor} rounded-xl p-4`}>
                                        <h4 className="font-bold text-slate-800 mb-3">Order Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Package</span>
                                                <span className="font-bold">{selectedPackage.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Monthly Fee</span>
                                                <span className="font-bold">UGX {selectedPackage.monthlyFee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Initial Balance</span>
                                                <span className="font-bold">UGX {(parseInt(subscribeForm.initialTopUp) || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between">
                                                <span className="font-bold text-slate-800">Total Due Today</span>
                                                <span className="font-bold text-lg">
                                                    UGX {(selectedPackage.monthlyFee + (parseInt(subscribeForm.initialTopUp) || 0)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-slate-50">
                            <button
                                onClick={() => {
                                    setShowSubscribeModal(false);
                                    setSelectedPackage(null);
                                }}
                                className="px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateWallet}
                                disabled={!selectedPackage || !subscribeForm.cardholderName || !subscribeForm.initialTopUp}
                                className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Subscribe & Create Wallet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Up Modal */}
            {showTopUpModal && selectedWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Top Up Wallet</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedWallet.cardholder || selectedWallet.patientName}</p>
                            </div>
                            <button onClick={() => setShowTopUpModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Current Balance</p>
                                <p className="text-3xl font-bold text-slate-800">UGX {selectedWallet.balance.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Top-up Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">UGX</span>
                                    <input
                                        type="number"
                                        value={topUpForm.amount}
                                        onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                                        className="w-full pl-16 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                                <select
                                    value={topUpForm.paymentMethod}
                                    onChange={(e) => setTopUpForm({ ...topUpForm, paymentMethod: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option>Mobile Money</option>
                                    <option>Bank Card</option>
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>

                            {topUpForm.amount && (
                                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                                    <p className="text-sm text-slate-600 mb-1">New Balance</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        UGX {(selectedWallet.balance + parseInt(topUpForm.amount || 0)).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-slate-50">
                            <button
                                onClick={() => setShowTopUpModal(false)}
                                className="px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmTopUp}
                                disabled={!topUpForm.amount || parseInt(topUpForm.amount) <= 0}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Confirm Top-up
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && qrWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Payment QR Code</h2>
                                <p className="text-sm text-slate-500 mt-1">{qrWallet.cardholder || qrWallet.patientName}</p>
                            </div>
                            <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Wallet Info */}
                            <div className="text-center">
                                <div className="inline-block px-3 py-1 bg-slate-100 rounded-full mb-3">
                                    <p className="text-xs font-medium text-slate-600">{qrWallet.id}</p>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-1">UGX {qrWallet.balance.toLocaleString()}</h3>
                                <p className="text-sm text-slate-500">Available Balance</p>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center">
                                <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-slate-100">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            walletId: qrWallet.id,
                                            cardNumber: qrWallet.cardNumber,
                                            cardholder: qrWallet.cardholder,
                                            packageType: qrWallet.packageType,
                                            balance: qrWallet.balance,
                                            type: 'HMS_WALLET_PAYMENT',
                                            timestamp: new Date().toISOString()
                                        })}
                                        size={200}
                                    />
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <QrCode size={16} />
                                    How to Use
                                </h4>
                                <ul className="space-y-1 text-sm text-blue-800">
                                    <li>• Present this QR code at any payment terminal</li>
                                    <li>• Staff will scan to deduct payment from your wallet</li>
                                    <li>• Instant payment with automatic discount applied</li>
                                    <li>• Receipt sent to your account immediately</li>
                                </ul>
                            </div>

                            {/* Package Info */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm text-slate-600">Package Type</span>
                                <span className="font-bold text-slate-800 capitalize">{getPackageDetails(qrWallet.packageType).name}</span>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50">
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="w-full px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletDashboard;
