import React, { useState } from 'react';
import { MessageSquare, Mail, Bell, Phone, Users, Send, Globe, Settings } from 'lucide-react';
import SocialMediaManager from './components/SocialMediaManager';
import SocialSettings from './components/SocialSettings';

const CommunicationDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, social, settings

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Communication Hub</h1>
                    <p className="text-slate-500">Internal messaging, announcements, and patient notifications</p>
                </div>
                <div className="flex gap-2">
                    {activeView === 'social' && (
                        <button
                            onClick={() => setActiveView('settings')}
                            className="btn btn-secondary gap-2"
                        >
                            <Settings size={20} />
                            Configure API
                        </button>
                    )}
                    <button className="btn btn-primary gap-2">
                        <Send size={20} />
                        New Message
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Channels / Sidebar */}
                <div className="card lg:col-span-1 p-4 h-fit">
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg font-medium transition-colors ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} />
                                <span>Internal Inbox</span>
                            </div>
                            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">4</span>
                        </button>

                        <button
                            onClick={() => setActiveView('social')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg font-medium transition-colors ${activeView === 'social' || activeView === 'settings' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Globe size={20} />
                                <span>Social Media</span>
                            </div>
                            <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded-full">New</span>
                        </button>

                        <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Mail size={20} />
                            <span>Email Campaigns</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Bell size={20} />
                            <span>Announcements</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Phone size={20} />
                            <span>SMS / Telephony</span>
                        </button>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Direct Messages</h3>
                        <div className="space-y-1">
                            {[1, 2, 3].map((i) => (
                                <button key={i} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            DR
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-sm font-medium text-slate-800 truncate">Dr. Richard Roe</p>
                                        <p className="text-xs text-slate-500 truncate">Can you check the lab results?</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeView === 'dashboard' && (
                        <div className="card flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        ALL
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">All Staff Announcement</h3>
                                        <p className="text-xs text-slate-500">32 participants</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><Users size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                                    <div>
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100">
                                            <p className="text-sm font-bold text-slate-800 mb-1">Admin</p>
                                            <p className="text-sm text-slate-600">Please note that the server maintenance is scheduled for tonight at 10 PM. The system might be unavailable for 15 minutes.</p>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">10:30 AM</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
                                    <div className="text-right">
                                        <div className="bg-primary text-white p-3 rounded-lg rounded-tr-none shadow-sm">
                                            <p className="text-sm">Noted, thanks for the update.</p>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">10:32 AM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'social' && <SocialMediaManager />}
                    {activeView === 'settings' && <SocialSettings />}
                </div>
            </div>
        </div>
    );
};

export default CommunicationDashboard;
