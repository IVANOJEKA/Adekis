import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, Users, ArrowRight, Activity, Maximize, Minimize } from 'lucide-react';

const QueueDisplay = () => {
    const { queueEntries } = useData();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const departments = ['Doctor', 'Pharmacy', 'Laboratory', 'Radiology', 'Billing', 'Triage', 'Maternity'];

    const getDepartmentQueue = (dept) => {
        return queueEntries
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

    const getCurrentServing = (dept) => {
        return queueEntries.find(e => e.department === dept && e.status === 'InService');
    };

    const getNextPatients = (dept, count = 3) => {
        const queue = getDepartmentQueue(dept);
        // Filter out the one currently in service if it's in the list (though getDepartmentQueue logic separates them usually, but safety first)
        return queue.filter(e => e.status === 'Waiting' || e.status === 'Called').slice(0, count);
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                {departments.map(dept => {
                    const current = getCurrentServing(dept);
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

                            {/* Now Serving */}
                            <div className="p-6 text-center border-b border-slate-700 bg-slate-800/50 flex-1 flex flex-col justify-center">
                                <p className="text-sm text-emerald-400 uppercase font-bold tracking-wider mb-2">Now Serving</p>
                                <div className="text-6xl font-black text-white tracking-tight mb-2">
                                    {current ? current.queueNumber : '--'}
                                </div>
                                <p className="text-slate-400 font-medium truncate px-4">
                                    {current ? current.patientName : 'Counter Closed'}
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
