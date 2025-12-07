import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, Users, ArrowRight, Activity, Maximize, Minimize, Volume2 } from 'lucide-react';
import voiceAnnouncer from '../../utils/voiceAnnouncement';

const QueueDisplay = () => {
    const { queueEntries } = useData();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [lastAnnouncedId, setLastAnnouncedId] = useState(null);
    const previousEntriesRef = useRef([]);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-announce newly called tokens
    useEffect(() => {
        const calledEntries = queueEntries?.filter(e => e.status === 'Called') || [];
        const newlyCalled = calledEntries.find(entry =>
            entry.id !== lastAnnouncedId &&
            !previousEntriesRef.current.some(prev => prev.id === entry.id && prev.status === 'Called')
        );

        if (newlyCalled && voiceAnnouncer.isSupported()) {
            voiceAnnouncer.announceToken(
                newlyCalled.queueNumber,
                newlyCalled.department,
                newlyCalled.patientName
            ).catch(err => console.error('Auto-announcement failed:', err));
            setLastAnnouncedId(newlyCalled.id);
        }

        previousEntriesRef.current = queueEntries || [];
    }, [queueEntries, lastAnnouncedId]);

    const departments = ['Doctor', 'Pharmacy', 'Laboratory', 'Radiology', 'Billing', 'Triage', 'Maternity'];

    const getDepartmentQueue = (dept) => {
        return (queueEntries || [])
            .filter(e => e.department === dept && (e.status === 'Waiting' || e.status === 'Called' || e.status === 'InService'))
            .sort((a, b) => {
                // Sort by priority first, then time
                const priorityOrder = { 'Emergency': 0, 'Urgent': 1, 'Normal': 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(a.checkInTime) - new Date(b.checkInTime);
            });
    };

    const getCurrentlyServing = (dept) => {
        return (queueEntries || []).find(e => e.department === dept && e.status === 'InService');
    };

    const getCurrentlyCalled = (dept) => {
        return (queueEntries || []).find(e => e.department === dept && e.status === 'Called');
    };

    const getNextPatients = (dept, count = 3) => {
        const queue = getDepartmentQueue(dept);
        return queue.filter(e => e.status === 'Waiting').slice(0, count);
    };

    const getRecentlyCalled = () => {
        return (queueEntries || [])
            .filter(e => e.status === 'Called' || e.status === 'InService')
            .sort((a, b) => new Date(b.calledAt || b.checkInTime) - new Date(a.calledAt || a.checkInTime))
            .slice(0, 5);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Activity size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Patient Queue Status</h1>
                        <p className="text-slate-400">Please wait for your number to be called</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-mono font-bold text-emerald-400">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-slate-400 text-sm">
                            {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={toggleFullScreen}
                        className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                    >
                        {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                </div>
            </div>

            {/* Recently Called Banner */}
            {getRecentlyCalled().length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Volume2 className="text-blue-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Recently Called Tokens</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {getRecentlyCalled().map(entry => (
                            <div key={entry.id} className="bg-slate-800/80 border border-blue-500/40 rounded-lg px-4 py-2 flex items-center gap-3">
                                <span className="font-mono font-bold text-2xl text-blue-400">{entry.queueNumber}</span>
                                <div className="border-l border-slate-600 pl-3">
                                    <p className="text-xs text-slate-400">{entry.department}</p>
                                    <p className="text-sm text-white font-medium">{entry.patientName}</p>
                                </div>
                                {entry.status === 'Called' && (
                                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded animate-pulse">CALLING</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {departments.map(dept => {
                    const current = getCurrentlyServing(dept);
                    const called = getCurrentlyCalled(dept);
                    const next = getNextPatients(dept);

                    return (
                        <div key={dept} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
                            {/* Department Header */}
                            <div className="bg-slate-700/50 p-4 border-b border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">{dept}</h2>
                                <div className="px-3 py-1 bg-slate-600 rounded-full text-xs font-medium text-slate-300">
                                    Counter {departments.indexOf(dept) + 1}
                                </div>
                            </div>

                            {/* Now Serving / Called */}
                            <div className={`p-6 text-center border-b border-slate-700 flex-1 flex flex-col justify-center ${called ? 'bg-blue-900/30 animate-pulse' : 'bg-slate-800/50'
                                }`}>
                                {called && (
                                    <p className="text-sm text-blue-400 uppercase font-bold tracking-wider mb-2 flex items-center justify-center gap-2">
                                        <Volume2 size={16} className="animate-pulse" />
                                        Now Calling
                                    </p>
                                )}
                                {!called && current && (
                                    <p className="text-sm text-emerald-400 uppercase font-bold tracking-wider mb-2">Now Serving</p>
                                )}
                                {!called && !current && (
                                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-2">Waiting</p>
                                )}
                                <div className={`text-6xl font-black tracking-tight mb-2 ${called ? 'text-blue-400 animate-pulse' :
                                        current ? 'text-white' : 'text-slate-600'
                                    }`}>
                                    {called ? called.queueNumber : current ? current.queueNumber : '--'}
                                </div>
                                <p className="text-slate-400 font-medium truncate px-4">
                                    {called ? called.patientName : current ? current.patientName : 'Counter Closed'}
                                </p>
                            </div>

                            {/* Up Next */}
                            <div className="p-4 bg-slate-900/50">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                                    <ArrowRight size={14} />
                                    Up Next
                                </p>
                                <div className="space-y-2">
                                    {next.length > 0 ? (
                                        next.map((patient, idx) => (
                                            <div key={patient.id} className="flex justify-between items-center p-2 rounded bg-slate-800 border border-slate-700/50">
                                                <span className="font-mono font-bold text-slate-300">{patient.queueNumber}</span>
                                                <span className="text-sm text-slate-400 truncate max-w-[120px]">{patient.patientName}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-600 text-center py-2 italic">No patients waiting</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-slate-500 text-sm">
                <p>If your number is skipped, please approach the reception desk.</p>
            </div>
        </div>
    );
};

export default QueueDisplay;
