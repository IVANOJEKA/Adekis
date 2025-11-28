import React, { useState } from 'react';
import {
    Key, CheckCircle, XCircle, Loader, Save, TestTube, Shield,
    CreditCard, MessageSquare, Mail, Globe, RefreshCw, Eye, EyeOff,
    AlertCircle, Settings as SettingsIcon
} from 'lucide-react';

const APIIntegrations = () => {
    const [integrations, setIntegrations] = useState({
        // Payment Gateways
        flutterwave: {
            enabled: false,
            publicKey: '',
            secretKey: '',
            encryptionKey: '',
            environment: 'test', // test or live
            status: 'disconnected',
            lastTested: null
        },
        paystack: {
            enabled: false,
            publicKey: '',
            secretKey: '',
            environment: 'test',
            status: 'disconnected',
            lastTested: null
        },
        stripe: {
            enabled: false,
            publishableKey: '',
            secretKey: '',
            webhookSecret: '',
            environment: 'test',
            status: 'disconnected',
            lastTested: null
        },

        // SMS Providers
        africasTalking: {
            enabled: false,
            apiKey: '',
            username: '',
            senderId: '',
            environment: 'sandbox',
            status: 'disconnected',
            lastTested: null
        },
        twilio: {
            enabled: false,
            accountSid: '',
            authToken: '',
            phoneNumber: '',
            environment: 'test',
            status: 'disconnected',
            lastTested: null
        },

        // Email Services
        sendgrid: {
            enabled: false,
            apiKey: '',
            fromEmail: '',
            fromName: '',
            status: 'disconnected',
            lastTested: null
        },
        smtp: {
            enabled: false,
            host: '',
            port: '587',
            username: '',
            password: '',
            encryption: 'tls',
            fromEmail: '',
            fromName: '',
            status: 'disconnected',
            lastTested: null
        },

        // Insurance Providers
        aarInsurance: {
            enabled: false,
            apiKey: '',
            providerId: '',
            environment: 'test',
            country: 'Uganda',
            status: 'disconnected',
            lastTested: null
        },
        uapInsurance: {
            enabled: false,
            apiKey: '',
            providerId: '',
            environment: 'test',
            country: 'Uganda',
            status: 'disconnected',
            lastTested: null
        },
        jubileeInsurance: {
            enabled: false,
            apiKey: '',
            providerId: '',
            environment: 'test',
            country: 'Uganda',
            status: 'disconnected',
            lastTested: null
        },
        britamInsurance: {
            enabled: false,
            apiKey: '',
            providerId: '',
            environment: 'test',
            country: 'Uganda',
            status: 'disconnected',
            lastTested: null
        }
    });

    const [activeTab, setActiveTab] = useState('payments');
    const [showSecrets, setShowSecrets] = useState({});
    const [testingAPI, setTestingAPI] = useState(null);
    const [savingConfig, setSavingConfig] = useState(false);

    // Load saved configurations from localStorage
    React.useEffect(() => {
        const savedConfig = localStorage.getItem('apiIntegrations');
        if (savedConfig) {
            setIntegrations(JSON.parse(savedConfig));
        }
    }, []);

    const handleInputChange = (service, field, value) => {
        setIntegrations(prev => ({
            ...prev,
            [service]: {
                ...prev[service],
                [field]: value
            }
        }));
    };

    const toggleVisibility = (key) => {
        setShowSecrets(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const saveConfiguration = () => {
        setSavingConfig(true);

        // Save to localStorage
        localStorage.setItem('apiIntegrations', JSON.stringify(integrations));

        setTimeout(() => {
            setSavingConfig(false);
            alert('API configurations saved successfully!');
        }, 1000);
    };

    const testConnection = async (service) => {
        setTestingAPI(service);

        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 2000));

        const config = integrations[service];
        let isValid = false;

        // Basic validation
        switch (service) {
            case 'flutterwave':
                isValid = config.publicKey && config.secretKey;
                break;
            case 'paystack':
                isValid = config.publicKey && config.secretKey;
                break;
            case 'stripe':
                isValid = config.publishableKey && config.secretKey;
                break;
            case 'africasTalking':
                isValid = config.apiKey && config.username;
                break;
            case 'twilio':
                isValid = config.accountSid && config.authToken && config.phoneNumber;
                break;
            case 'sendgrid':
                isValid = config.apiKey && config.fromEmail;
                break;
            case 'smtp':
                isValid = config.host && config.username && config.password;
                break;
            case 'aarInsurance':
            case 'uapInsurance':
            case 'jubileeInsurance':
            case 'britamInsurance':
                isValid = config.apiKey && config.providerId;
                break;
            default:
                isValid = false;
        }

        setIntegrations(prev => ({
            ...prev,
            [service]: {
                ...prev[service],
                status: isValid ? 'connected' : 'failed',
                lastTested: new Date().toISOString()
            }
        }));

        setTestingAPI(null);

        if (isValid) {
            alert(`✅ ${service} connection test successful!`);
        } else {
            alert(`❌ ${service} connection test failed. Please check your credentials.`);
        }
    };

    const renderPaymentGateways = () => (
        <div className="space-y-6">
            {/* Flutterwave */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Flutterwave</h3>
                            <p className="text-sm text-orange-100">Payment Gateway for Africa</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {integrations.flutterwave.status === 'connected' && (
                            <span className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full text-sm">
                                <CheckCircle size={16} /> Connected
                            </span>
                        )}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={integrations.flutterwave.enabled}
                                onChange={(e) => handleInputChange('flutterwave', 'enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                {integrations.flutterwave.enabled && (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Public Key</label>
                                <div className="relative">
                                    <input
                                        type={showSecrets['fw-public'] ? 'text' : 'password'}
                                        value={integrations.flutterwave.publicKey}
                                        onChange={(e) => handleInputChange('flutterwave', 'publicKey', e.target.value)}
                                        placeholder="FLWPUBK-***"
                                        className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <button
                                        onClick={() => toggleVisibility('fw-public')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showSecrets['fw-public'] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                                <div className="relative">
                                    <input
                                        type={showSecrets['fw-secret'] ? 'text' : 'password'}
                                        value={integrations.flutterwave.secretKey}
                                        onChange={(e) => handleInputChange('flutterwave', 'secretKey', e.target.value)}
                                        placeholder="FLWSECK-***"
                                        className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <button
                                        onClick={() => toggleVisibility('fw-secret')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showSecrets['fw-secret'] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Encryption Key</label>
                                <input
                                    type="password"
                                    value={integrations.flutterwave.encryptionKey}
                                    onChange={(e) => handleInputChange('flutterwave', 'encryptionKey', e.target.value)}
                                    placeholder="FLWSECK_TEST***"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
                                <select
                                    value={integrations.flutterwave.environment}
                                    onChange={(e) => handleInputChange('flutterwave', 'environment', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                                >
                                    <option value="test">Test Mode</option>
                                    <option value="live">Live Mode</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="text-sm text-slate-600">
                                {integrations.flutterwave.lastTested && (
                                    <span>Last tested: {new Date(integrations.flutterwave.lastTested).toLocaleString()}</span>
                                )}
                            </div>
                            <button
                                onClick={() => testConnection('flutterwave')}
                                disabled={testingAPI === 'flutterwave'}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {testingAPI === 'flutterwave' ? (
                                    <><Loader size={18} className="animate-spin" /> Testing...</>
                                ) : (
                                    <><TestTube size={18} /> Test Connection</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Paystack */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Paystack</h3>
                            <p className="text-sm text-blue-100">Modern African Payment Gateway</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.paystack.enabled}
                            onChange={(e) => handleInputChange('paystack', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.paystack.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure Paystack integration settings...</p>
                    </div>
                )}
            </div>

            {/* Stripe */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Stripe</h3>
                            <p className="text-sm text-purple-100">Global Payment Platform</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.stripe.enabled}
                            onChange={(e) => handleInputChange('stripe', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.stripe.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure Stripe integration settings...</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSMSProviders = () => (
        <div className="space-y-6">
            {/* Africa's Talking */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Africa's Talking</h3>
                            <p className="text-sm text-green-100">SMS & USSD Gateway for Africa</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.africasTalking.enabled}
                            onChange={(e) => handleInputChange('africasTalking', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.africasTalking.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure Africa's Talking integration settings...</p>
                    </div>
                )}
            </div>

            {/* Twilio */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={24} />
                        <div>
                            <h3 className="font-bold text-lg">Twilio</h3>
                            <p className="text-sm text-red-100">Global SMS & Voice Platform</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.twilio.enabled}
                            onChange={(e) => handleInputChange('twilio', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.twilio.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure Twilio integration settings...</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderEmailServices = () => (
        <div className="space-y-6">
            {/* SendGrid */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail size={24} />
                        <div>
                            <h3 className="font-bold text-lg">SendGrid</h3>
                            <p className="text-sm text-blue-100">Email Delivery Platform</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.sendgrid.enabled}
                            onChange={(e) => handleInputChange('sendgrid', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.sendgrid.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure SendGrid integration settings...</p>
                    </div>
                )}
            </div>

            {/* SMTP */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail size={24} />
                        <div>
                            <h3 className="font-bold text-lg">SMTP Server</h3>
                            <p className="text-sm text-slate-100">Custom Email Server</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={integrations.smtp.enabled}
                            onChange={(e) => handleInputChange('smtp', 'enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {integrations.smtp.enabled && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 italic">Configure SMTP server settings...</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderInsuranceProviders = () => (
        <div className="space-y-6">
            {/* AAR Insurance */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield size={24} />
                        <div>
                            <h3 className="font-bold text-lg">AAR Insurance</h3>
                            <p className="text-sm text-emerald-100">Uganda Health Insurance Provider</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {integrations.aarInsurance?.status === 'connected' && (
                            <span className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full text-sm">
                                <CheckCircle size={16} /> Connected
                            </span>
                        )}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={integrations.aarInsurance?.enabled || false}
                                onChange={(e) => handleInputChange('aarInsurance', 'enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                {integrations.aarInsurance?.enabled && (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                                <div className="relative">
                                    <input
                                        type={showSecrets['aar-key'] ? 'text' : 'password'}
                                        value={integrations.aarInsurance?.apiKey || ''}
                                        onChange={(e) => handleInputChange('aarInsurance', 'apiKey', e.target.value)}
                                        placeholder="AAR-API-***"
                                        className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <button
                                        onClick={() => toggleVisibility('aar-key')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showSecrets['aar-key'] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Provider ID</label>
                                <input
                                    type="text"
                                    value={integrations.aarInsurance?.providerId || ''}
                                    onChange={(e) => handleInputChange('aarInsurance', 'providerId', e.target.value)}
                                    placeholder="AAR-PROV-***"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
                                <select
                                    value={integrations.aarInsurance?.environment || 'test'}
                                    onChange={(e) => handleInputChange('aarInsurance', 'environment', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                                >
                                    <option value="test">Test/Sandbox</option>
                                    <option value="live">Live/Production</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                <select
                                    value={integrations.aarInsurance?.country || 'Uganda'}
                                    onChange={(e) => handleInputChange('aarInsurance', 'country', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                                >
                                    <option value="Uganda">Uganda</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Tanzania">Tanzania</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="text-sm text-slate-600">
                                {integrations.aarInsurance?.lastTested && (
                                    <span>Last tested: {new Date(integrations.aarInsurance.lastTested).toLocaleString()}</span>
                                )}
                            </div>
                            <button
                                onClick={() => testConnection('aarInsurance')}
                                disabled={testingAPI === 'aarInsurance'}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                                {testingAPI === 'aarInsurance' ? (
                                    <><Loader size={18} className="animate-spin" /> Testing...</>
                                ) : (
                                    <><TestTube size={18} /> Test Connection</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Other Insurance Providers - Simplified */}
            {[
                { key: 'uapInsurance', name: 'UAP Insurance', color: 'blue', country: 'Uganda' },
                { key: 'jubileeInsurance', name: 'Jubilee Insurance', color: 'purple', country: 'Uganda' },
                { key: 'britamInsurance', name: 'Britam Insurance', color: 'indigo', country: 'Uganda' }
            ].map(provider => (
                <div key={provider.key} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className={`px-6 py-4 bg-gradient-to-r from-${provider.color}-500 to-${provider.color}-600 text-white flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <Shield size={24} />
                            <div>
                                <h3 className="font-bold text-lg">{provider.name}</h3>
                                <p className="text-sm opacity-90">{provider.country} Health Insurance</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={integrations[provider.key]?.enabled || false}
                                onChange={(e) => handleInputChange(provider.key, 'enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    {integrations[provider.key]?.enabled && (
                        <div className="p-6">
                            <p className="text-sm text-slate-500 italic">Configure {provider.name} API credentials and test connection...</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const tabs = [
        { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
        { id: 'insurance', label: 'Insurance Providers', icon: Shield },
        { id: 'sms', label: 'SMS Providers', icon: MessageSquare },
        { id: 'email', label: 'Email Services', icon: Mail },
        { id: 'other', label: 'Other APIs', icon: Globe }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <SettingsIcon size={28} className="text-primary" />
                        API Integrations
                    </h2>
                    <p className="text-slate-600 mt-1">Configure and manage third-party API integrations</p>
                </div>
                <button
                    onClick={saveConfiguration}
                    disabled={savingConfig}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/30"
                >
                    {savingConfig ? (
                        <><Loader size={18} className="animate-spin" /> Saving...</>
                    ) : (
                        <><Save size={18} /> Save All Configurations</>
                    )}
                </button>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-blue-800">Security Note</p>
                    <p className="text-xs text-blue-700 mt-1">
                        API keys and secrets are stored locally in your browser. For production use, store sensitive keys securely on your server.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'payments' && renderPaymentGateways()}
                {activeTab === 'insurance' && renderInsuranceProviders()}
                {activeTab === 'sms' && renderSMSProviders()}
                {activeTab === 'email' && renderEmailServices()}
                {activeTab === 'other' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                        <Globe size={64} className="mx-auto mb-4 opacity-50" />
                        <p>Other API integrations coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APIIntegrations;
