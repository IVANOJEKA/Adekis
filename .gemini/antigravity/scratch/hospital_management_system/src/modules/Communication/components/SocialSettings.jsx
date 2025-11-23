import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const SocialSettings = () => {
    const [settings, setSettings] = useState({
        whatsapp: {
            apiKey: 'WA_KEY_****************',
            phoneNumber: '+256 700 123456',
            enabled: true
        },
        facebook: {
            pageId: 'FB_PAGE_12345',
            accessToken: 'FB_TOKEN_****************',
            enabled: true
        },
        twitter: {
            apiKey: 'TW_KEY_****************',
            apiSecret: 'TW_SECRET_****************',
            enabled: true
        }
    });

    const handleChange = (platform, field, value) => {
        setSettings({
            ...settings,
            [platform]: {
                ...settings[platform],
                [field]: value
            }
        });
    };

    const handleSave = () => {
        // Mock save functionality
        alert('Settings saved successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Social Media Configuration</h2>
                    <p className="text-slate-500">Manage API keys and connection settings for your social channels</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2 font-medium"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="space-y-6">
                {/* WhatsApp Configuration */}
                <div className="card p-6 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">WhatsApp Business API</h3>
                                <p className="text-sm text-slate-500">Powered by Twilio or Meta Cloud API</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${settings.whatsapp.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                                {settings.whatsapp.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => handleChange('whatsapp', 'enabled', !settings.whatsapp.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.whatsapp.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.whatsapp.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Token</label>
                            <input
                                type="password"
                                value={settings.whatsapp.apiKey}
                                onChange={(e) => handleChange('whatsapp', 'apiKey', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Phone Number</label>
                            <input
                                type="text"
                                value={settings.whatsapp.phoneNumber}
                                onChange={(e) => handleChange('whatsapp', 'phoneNumber', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Facebook Configuration */}
                <div className="card p-6 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Facebook Page Integration</h3>
                                <p className="text-sm text-slate-500">Manage posts and messenger</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${settings.facebook.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                                {settings.facebook.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => handleChange('facebook', 'enabled', !settings.facebook.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.facebook.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.facebook.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Page ID</label>
                            <input
                                type="text"
                                value={settings.facebook.pageId}
                                onChange={(e) => handleChange('facebook', 'pageId', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Access Token</label>
                            <input
                                type="password"
                                value={settings.facebook.accessToken}
                                onChange={(e) => handleChange('facebook', 'accessToken', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Twitter Configuration */}
                <div className="card p-6 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Twitter / X API</h3>
                                <p className="text-sm text-slate-500">Post updates and handle DMs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${settings.twitter.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                                {settings.twitter.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => handleChange('twitter', 'enabled', !settings.twitter.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.twitter.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.twitter.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                            <input
                                type="password"
                                value={settings.twitter.apiKey}
                                onChange={(e) => handleChange('twitter', 'apiKey', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">API Secret</label>
                            <input
                                type="password"
                                value={settings.twitter.apiSecret}
                                onChange={(e) => handleChange('twitter', 'apiSecret', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                            />
                        </div>
                    </div>
                </div>
                {/* SMS Gateway Configuration */}
                <div className="card p-6 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">SMS Gateway</h3>
                                <p className="text-sm text-slate-500">Twilio / Africa's Talking / Infobip</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${settings.sms?.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                                {settings.sms?.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => handleChange('sms', 'enabled', !settings.sms?.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.sms?.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.sms?.enabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                            <select
                                value={settings.sms?.provider || 'twilio'}
                                onChange={(e) => handleChange('sms', 'provider', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            >
                                <option value="twilio">Twilio</option>
                                <option value="africastalking">Africa's Talking</option>
                                <option value="infobip">Infobip</option>
                                <option value="other">Other / Custom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sender ID</label>
                            <input
                                type="text"
                                value={settings.sms?.senderId || ''}
                                onChange={(e) => handleChange('sms', 'senderId', e.target.value)}
                                placeholder="e.g., CITYHOSP"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                            <input
                                type="password"
                                value={settings.sms?.apiKey || ''}
                                onChange={(e) => handleChange('sms', 'apiKey', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">API Secret / Auth Token</label>
                            <input
                                type="password"
                                value={settings.sms?.apiSecret || ''}
                                onChange={(e) => handleChange('sms', 'apiSecret', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialSettings;
