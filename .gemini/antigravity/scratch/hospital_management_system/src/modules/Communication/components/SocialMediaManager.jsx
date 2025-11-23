import React, { useState } from 'react';
import {
    MessageCircle, Facebook, Twitter, Instagram, Send,
    Image as ImageIcon, Paperclip, MoreVertical, Search,
    ThumbsUp, Share2, MessageSquare, Check, CheckCheck, Users, MessageSquareText
} from 'lucide-react';

const SocialMediaManager = () => {
    const [activeTab, setActiveTab] = useState('inbox'); // inbox, compose, accounts
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [messageInput, setMessageInput] = useState('');
    const [postContent, setPostContent] = useState('');

    // Mock Data for Unified Inbox
    const [messages, setMessages] = useState([
        {
            id: 1,
            platform: 'whatsapp',
            sender: 'John Doe',
            avatar: null,
            content: 'Hello, I would like to reschedule my appointment for next Tuesday.',
            time: '10:30 AM',
            unread: true,
            status: 'received'
        },
        {
            id: 2,
            platform: 'facebook',
            sender: 'Sarah Smith',
            avatar: null,
            content: 'Do you offer pediatric dental services?',
            time: '09:15 AM',
            unread: false,
            status: 'read'
        },
        {
            id: 3,
            platform: 'twitter',
            sender: '@health_conscious',
            avatar: null,
            content: 'Great service at the clinic today! #healthcare #topnotch',
            time: 'Yesterday',
            unread: false,
            status: 'read'
        },
        {
            id: 4,
            platform: 'sms',
            sender: '+256 755 123456',
            avatar: null,
            content: 'Confirming my appointment for tomorrow at 2pm.',
            time: 'Yesterday',
            unread: true,
            status: 'received'
        }
    ]);

    // Mock Data for Connected Accounts
    const [accounts, setAccounts] = useState([
        { id: 'wa', name: 'WhatsApp Business', icon: MessageCircle, color: 'text-green-500', status: 'connected', handle: '+256 700 123456' },
        { id: 'fb', name: 'Facebook Page', icon: Facebook, color: 'text-blue-600', status: 'connected', handle: 'City Hospital' },
        { id: 'tw', name: 'Twitter / X', icon: Twitter, color: 'text-black', status: 'connected', handle: '@CityHospital' },
        { id: 'ig', name: 'Instagram', icon: Instagram, color: 'text-pink-600', status: 'disconnected', handle: '-' },
        { id: 'sms', name: 'SMS Gateway', icon: MessageSquareText, color: 'text-purple-600', status: 'connected', handle: 'CITYHOSP' }
    ]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            platform: 'whatsapp', // Defaulting for demo
            sender: 'You',
            content: messageInput,
            time: 'Just now',
            unread: false,
            status: 'sent'
        };

        setMessages([newMessage, ...messages]);
        setMessageInput('');
    };

    const handlePostUpdate = () => {
        if (!postContent.trim()) return;
        alert(`Posted to ${selectedPlatform === 'all' ? 'all connected platforms' : selectedPlatform}!`);
        setPostContent('');
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'whatsapp': return <MessageCircle size={16} className="text-green-500" />;
            case 'facebook': return <Facebook size={16} className="text-blue-600" />;
            case 'twitter': return <Twitter size={16} className="text-black" />;
            case 'instagram': return <Instagram size={16} className="text-pink-600" />;
            case 'sms': return <MessageSquareText size={16} className="text-purple-600" />;
            default: return <MessageCircle size={16} />;
        }
    };

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Navigation & Accounts */}
            <div className="w-full lg:w-64 flex flex-col gap-4">
                <div className="card p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'inbox' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <MessageSquare size={20} />
                        <span>Unified Inbox</span>
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'compose' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <Send size={20} />
                        <span>Compose Post</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'accounts' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <Users size={20} />
                        <span>Accounts</span>
                    </button>
                </div>

                <div className="card p-4 flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Connected Channels</h3>
                    <div className="space-y-3">
                        {accounts.map(acc => (
                            <div key={acc.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <acc.icon size={18} className={acc.color} />
                                    <span className="text-sm font-medium text-slate-700">{acc.name}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${acc.status === 'connected' ? 'bg-green-500' : 'bg-slate-300'}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 card flex flex-col overflow-hidden">
                {activeTab === 'inbox' && (
                    <div className="flex h-full">
                        {/* Message List */}
                        <div className="w-1/3 border-r border-slate-100 flex flex-col">
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                    <button
                                        onClick={() => setSelectedPlatform('all')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${selectedPlatform === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setSelectedPlatform('whatsapp')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${selectedPlatform === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => setSelectedPlatform('facebook')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${selectedPlatform === 'facebook' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        Facebook
                                    </button>
                                    <button
                                        onClick={() => setSelectedPlatform('sms')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${selectedPlatform === 'sms' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        SMS
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {messages
                                    .filter(m => selectedPlatform === 'all' || m.platform === selectedPlatform)
                                    .map(msg => (
                                        <div key={msg.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${msg.unread ? 'bg-blue-50/50' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    {getPlatformIcon(msg.platform)}
                                                    <span className={`text-sm font-bold ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.sender}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">{msg.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-2">{msg.content}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Chat View */}
                        <div className="flex-1 flex flex-col bg-slate-50/30">
                            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">John Doe</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <MessageCircle size={12} className="text-green-500" />
                                            <span>WhatsApp • +256 700 123456</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">JD</div>
                                    <div className="max-w-[80%]">
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100">
                                            <p className="text-sm text-slate-800">Hello, I would like to reschedule my appointment for next Tuesday.</p>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">10:30 AM</p>
                                    </div>
                                </div>

                                {/* Mock Reply */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">ME</div>
                                    <div className="max-w-[80%]">
                                        <div className="bg-primary text-white p-3 rounded-lg rounded-tr-none shadow-sm">
                                            <p className="text-sm">Hi John, sure thing. What time works best for you?</p>
                                        </div>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <p className="text-xs text-slate-400">10:32 AM</p>
                                            <CheckCheck size={14} className="text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                                        <Paperclip size={20} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                                        <ImageIcon size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'compose' && (
                    <div className="p-6 max-w-2xl mx-auto w-full">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Post</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Platforms</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedPlatform(selectedPlatform === 'facebook' ? 'all' : 'facebook')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedPlatform === 'facebook' || selectedPlatform === 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                                    >
                                        <Facebook size={18} />
                                        Facebook
                                    </button>
                                    <button
                                        onClick={() => setSelectedPlatform(selectedPlatform === 'twitter' ? 'all' : 'twitter')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedPlatform === 'twitter' || selectedPlatform === 'all' ? 'bg-slate-100 border-slate-300 text-black' : 'border-slate-200 text-slate-600'}`}
                                    >
                                        <Twitter size={18} />
                                        Twitter
                                    </button>
                                    <button
                                        onClick={() => setSelectedPlatform(selectedPlatform === 'instagram' ? 'all' : 'instagram')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${selectedPlatform === 'instagram' || selectedPlatform === 'all' ? 'bg-pink-50 border-pink-200 text-pink-700' : 'border-slate-200 text-slate-600'}`}
                                    >
                                        <Instagram size={18} />
                                        Instagram
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Post Content</label>
                                <textarea
                                    rows="6"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="What's happening at the hospital?"
                                />
                                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                    <span>{postContent.length} characters</span>
                                    <button className="flex items-center gap-1 text-primary hover:underline">
                                        <ImageIcon size={14} />
                                        Add Media
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                                    Schedule
                                </button>
                                <button
                                    onClick={handlePostUpdate}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    Publish Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'accounts' && (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Connected Accounts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {accounts.map(acc => (
                                <div key={acc.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center ${acc.color}`}>
                                            <acc.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{acc.name}</h3>
                                            <p className="text-sm text-slate-500">{acc.handle}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${acc.status === 'connected'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                            }`}
                                    >
                                        {acc.status === 'connected' ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialMediaManager;
